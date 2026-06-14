/* ============================================================
   merch-cart.js — handlekurv + bestilling for merch.html
   Leser produkter fra window.MERCH_PRODUCTS, sender bestilling til
   window.MERCH_ORDER_ENDPOINT (Google Apps Script). Faller tilbake til
   e-post hvis endepunkt mangler. Se docs/apps-script-oppsett.md.
   ============================================================ */
(function () {
  'use strict';

  var LS = 'apeiron-cart-v1';
  var MEMBER_LS = 'apeiron-cart-member-v1';
  var endpoint = (window.MERCH_ORDER_ENDPOINT || '').trim();
  var fallbackEmail = window.MERCH_ORDER_EMAIL || 'apeironlinjeforening@gmail.com';
  var vippsInfo = window.MERCH_VIPPS || '#551937 «Apeiron»';
  var LOGO = 'assets/apeiron-logo.png';

  var cart = loadCart();
  var isMember = loadMember();

  function loadCart() { try { return JSON.parse(localStorage.getItem(LS)) || []; } catch (_) { return []; } }
  function saveCart() { try { localStorage.setItem(LS, JSON.stringify(cart)); } catch (_) {} }
  function loadMember() { try { return localStorage.getItem(MEMBER_LS) === '1'; } catch (_) { return false; } }
  function saveMember() { try { localStorage.setItem(MEMBER_LS, isMember ? '1' : '0'); } catch (_) {} }
  // Medlemspris for en kurv-linje (fra linja, ev. oppslag mot produktet for
  // gamle kurver lagret før medlemspris fantes). null = ingen medlemspris.
  function memberPriceOf(it) {
    if (it.memberPrice != null) return it.memberPrice;
    var p = product(it.id);
    return (p && p.memberPrice != null) ? p.memberPrice : null;
  }
  // Effektiv enhetspris ut fra om «medlem» er huket av.
  function unitPrice(it) {
    var mp = memberPriceOf(it);
    if (isMember && mp != null) return mp;
    return it.price != null ? it.price : null;
  }
  function anyMemberPrice() { return cart.some(function (it) { return memberPriceOf(it) != null; }); }
  // Escaper både tekst- og attributt-kontekst: i tillegg til <>& også " og '
  // slik at verdier trygt kan limes inn i value="…"/src="…" o.l.
  function esc(s) {
    return (s == null ? '' : String(s))
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function product(id) { return (window.MERCH_PRODUCTS || []).filter(function (p) { return p.id === id; })[0]; }
  function count() { return cart.reduce(function (n, it) { return n + it.qty; }, 0); }
  function total() { return cart.reduce(function (n, it) { return n + (Number(unitPrice(it)) || 0) * it.qty; }, 0); }

  /* ── UI-oppbygging ── */
  var root = document.createElement('div');
  root.className = 'cart-root';
  root.innerHTML =
    '<button type="button" class="cart-fab" aria-label="Åpne handlekurv">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>'
      + '<span class="cart-fab__count" hidden>0</span>'
    + '</button>'
    + '<div class="cart-overlay"></div>'
    + '<aside class="cart-drawer" role="dialog" aria-label="Handlekurv" aria-modal="true">'
      + '<div class="cart-drawer__head">'
        + '<h3>Handlekurv</h3>'
        + '<button type="button" class="cart-clear" hidden>Tøm kurv</button>'
        + '<button type="button" class="cart-close" aria-label="Lukk">&times;</button>'
      + '</div>'
      + '<div class="cart-items"></div>'
      + '<form class="cart-checkout" hidden>'
        + '<div class="cart-vipps"></div>'
        + '<h4>Dine opplysninger</h4>'
        + '<label>Navn<input type="text" name="name" required></label>'
        + '<label>E-post<input type="email" name="email" required></label>'
        + '<label>Telefon <span class="cart-opt">(valgfritt)</span><input type="tel" name="phone"></label>'
        + '<label>Kommentar <span class="cart-opt">(valgfritt)</span><textarea name="comment" rows="2"></textarea></label>'
        // Honeypot mot spam-bots: skjult felt mennesker ikke ser/fyller ut.
        + '<input type="text" name="company" class="cart-hp" tabindex="-1" autocomplete="off" aria-hidden="true">'
        + '<p class="cart-privacy">Opplysningene brukes kun til å behandle bestillingen din og lagres hos Apeiron.</p>'
        + '<button type="submit" class="btn btn--maroon cart-send">Send bestilling</button>'
        + '<p class="cart-status" role="status"></p>'
      + '</form>'
      + '<button type="button" class="cart-continue">← Fortsett å handle</button>'
    + '</aside>';
  document.body.appendChild(root);

  var fab      = root.querySelector('.cart-fab');
  var badge    = root.querySelector('.cart-fab__count');
  var overlay  = root.querySelector('.cart-overlay');
  var drawer   = root.querySelector('.cart-drawer');
  var itemsEl  = root.querySelector('.cart-items');
  var form     = root.querySelector('.cart-checkout');
  var statusEl = root.querySelector('.cart-status');
  var clearBtn = root.querySelector('.cart-clear');
  var vippsEl  = root.querySelector('.cart-vipps');

  vippsEl.innerHTML = 'Betaling skjer via <b>Vipps til ' + esc(vippsInfo)
    + '</b> etter at vi har bekreftet bestillingen din på e-post.';

  function openDrawer()  { root.classList.add('cart-open'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { root.classList.remove('cart-open'); document.body.style.overflow = ''; }
  function flash() { fab.classList.remove('bump'); void fab.offsetWidth; fab.classList.add('bump'); }

  fab.addEventListener('click', openDrawer);
  overlay.addEventListener('click', closeDrawer);
  root.querySelector('.cart-close').addEventListener('click', closeDrawer);
  root.querySelector('.cart-continue').addEventListener('click', closeDrawer);
  clearBtn.addEventListener('click', function () {
    if (cart.length && confirm('Tømme hele handlekurven?')) { cart = []; saveCart(); renderCart(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('cart-open')) closeDrawer(); });

  /* ── Legg i kurv (event-delegering) ── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-add]');
    if (!btn) return;
    var card = btn.closest('.product');
    if (!card) return;
    addToCart(btn.getAttribute('data-add'), card, btn);
  });

  function variantValue(card, name) {
    var el = card.querySelector('[data-variant="' + name + '"]');
    return el ? el.value : '';
  }

  // Kort, ikke-påtrengende bekreftelse på selve knappen — åpner IKKE kurven.
  function confirmAdd(btn) {
    if (!btn) return;
    if (!btn._origLabel) btn._origLabel = btn.textContent;
    btn.classList.add('product__add--ok');
    btn.textContent = 'Lagt i kurv ✓';
    clearTimeout(btn._okTimer);
    btn._okTimer = setTimeout(function () {
      btn.classList.remove('product__add--ok');
      btn.textContent = btn._origLabel;
    }, 1400);
  }

  function addToCart(id, card, btn) {
    var p = product(id);
    if (!p) return;
    var size  = variantValue(card, 'size');
    var color = variantValue(card, 'color');
    var qtyEl = card.querySelector('[data-variant="qty"]');
    var qty = Math.max(1, parseInt(qtyEl && qtyEl.value, 10) || 1);
    var key = [id, size, color].join('|');
    var existing = cart.filter(function (it) { return it.key === key; })[0];
    if (existing) { existing.qty += qty; }
    else {
      cart.push({ key: key, id: id, name: p.name, price: p.price != null ? p.price : null,
                  memberPrice: p.memberPrice != null ? p.memberPrice : null,
                  img: p.img || null, size: size, color: color, qty: qty });
    }
    saveCart(); renderCart(); flash(); confirmAdd(btn);
  }

  function setQty(key, qty) {
    var it = cart.filter(function (x) { return x.key === key; })[0];
    if (!it) return;
    it.qty = Math.max(1, qty);
    saveCart(); renderCart();
  }
  function removeItem(key) {
    cart = cart.filter(function (x) { return x.key !== key; });
    saveCart(); renderCart();
  }

  /* ── Render ── */
  function renderBadge() {
    var n = count();
    badge.textContent = n;
    badge.hidden = n === 0;
    fab.classList.toggle('cart-fab--filled', n > 0);
  }

  function variantLabel(it) {
    var v = [];
    if (it.size) v.push(it.size);
    if (it.color) v.push(it.color);
    return v.length ? '<span class="cart-item__variant">' + esc(v.join(' · ')) + '</span>' : '';
  }

  function renderCart() {
    renderBadge();
    clearBtn.hidden = cart.length === 0;
    if (!cart.length) {
      itemsEl.innerHTML = '<p class="cart-empty">Handlekurven er tom.</p>';
      form.hidden = true;
      return;
    }
    var html = cart.map(function (it) {
      var line = (Number(it.price) || 0) * it.qty;
      var mp = memberPriceOf(it);
      var priceHtml;
      if (it.price == null) {
        priceHtml = '—';
      } else {
        // Normalpris først; medlemspris under når produktet har en.
        priceHtml = '<span class="cart-item__price-normal' + (isMember && mp != null ? ' is-struck' : '') + '">' + line + ',–</span>';
        if (mp != null) {
          priceHtml += '<span class="cart-item__price-member' + (isMember ? ' is-active' : '') + '">Medlem: ' + (Number(mp) * it.qty) + ',–</span>';
        }
      }
      return '<div class="cart-item" data-key="' + esc(it.key) + '">'
        + '<img class="cart-item__thumb" src="' + esc(it.img || LOGO) + '" alt=""'
          + (it.img ? '' : ' data-placeholder') + '>'
        + '<div class="cart-item__main">'
          + '<div class="cart-item__top">'
            + '<div class="cart-item__info"><span class="cart-item__name">' + esc(it.name) + '</span>' + variantLabel(it) + '</div>'
            + '<button type="button" class="cart-item__rm" data-rm aria-label="Fjern">&times;</button>'
          + '</div>'
          + '<div class="cart-item__bottom">'
            + '<div class="cart-item__controls">'
              + '<button type="button" class="cart-qty" data-dec aria-label="Færre">−</button>'
              + '<input type="number" class="cart-qty-num" value="' + (Number(it.qty) || 1) + '" min="1" inputmode="numeric">'
              + '<button type="button" class="cart-qty" data-inc aria-label="Flere">+</button>'
            + '</div>'
            + '<div class="cart-item__price">' + priceHtml + '</div>'
          + '</div>'
        + '</div>'
      + '</div>';
    }).join('');
    if (anyMemberPrice()) {
      html += '<label class="cart-member"><input type="checkbox" class="cart-member__cb"'
        + (isMember ? ' checked' : '') + '> Jeg er medlem <span class="cart-member__note">(få medlemspris)</span></label>';
    }
    html += '<div class="cart-total"><span>Totalt</span><b>' + total() + ',–</b></div>';
    itemsEl.innerHTML = html;
    form.hidden = false;
    setStatus('');

    var memberCb = itemsEl.querySelector('.cart-member__cb');
    if (memberCb) memberCb.addEventListener('change', function () {
      isMember = memberCb.checked; saveMember(); renderCart();
    });

    itemsEl.querySelectorAll('.cart-item').forEach(function (row) {
      var key = row.getAttribute('data-key');
      var it = cart.filter(function (x) { return x.key === key; })[0];
      row.querySelector('[data-dec]').addEventListener('click', function () { setQty(key, it.qty - 1); });
      row.querySelector('[data-inc]').addEventListener('click', function () { setQty(key, it.qty + 1); });
      row.querySelector('[data-rm]').addEventListener('click', function () { removeItem(key); });
      row.querySelector('.cart-qty-num').addEventListener('change', function (e) {
        setQty(key, parseInt(e.target.value, 10) || 1);
      });
    });
  }

  /* ── Innsending ── */
  function summaryText() {
    var lines = cart.map(function (it) {
      var v = [];
      if (it.size) v.push('str: ' + it.size);
      if (it.color) v.push('farge: ' + it.color);
      var u = unitPrice(it);
      var pris = u != null ? ' = ' + (Number(u) * it.qty) + ',–' : '';
      return '- ' + it.qty + 'x ' + it.name + (v.length ? ' (' + v.join(', ') + ')' : '') + pris;
    });
    if (isMember && anyMemberPrice()) lines.push('(Medlemspris benyttet)');
    return lines.join('\n');
  }

  function setStatus(msg, kind) {
    statusEl.textContent = msg || '';
    statusEl.className = 'cart-status' + (kind ? ' cart-status--' + kind : '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!cart.length) { setStatus('Handlekurven er tom.', 'err'); return; }
    var fd = new FormData(form);
    // Honeypot: bots fyller ut det skjulte feltet. Lat som alt gikk bra, send ingenting.
    if ((fd.get('company') || '').trim()) { orderDone(); return; }
    var payload = {
      token: window.MERCH_ORDER_TOKEN || '',
      name: (fd.get('name') || '').trim(),
      email: (fd.get('email') || '').trim(),
      phone: (fd.get('phone') || '').trim(),
      comment: (fd.get('comment') || '').trim(),
      isMember: isMember,
      total: total(),
      items: cart.map(function (it) {
        var u = unitPrice(it);
        return { id: it.id, name: it.name, qty: it.qty, size: it.size, color: it.color,
                 price: it.price, memberPrice: memberPriceOf(it), unitPrice: u,
                 lineTotal: (Number(u) || 0) * it.qty };
      })
    };

    if (!endpoint) { return sendViaEmail(payload); }

    var sendBtn = form.querySelector('.cart-send');
    sendBtn.disabled = true;
    setStatus('Sender …');
    // Apps Script svarer med en omdirigering uten CORS-headere. Med mode:'no-cors'
    // sendes forespørselen (og skrives til arket) uten at nettleseren kaster
    // CORS-feil. Svaret blir «opaque» — vi kan ikke lese det, men det er ok.
    fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    })
      .then(function () { orderDone(); })
      .catch(function () {
        sendBtn.disabled = false;
        setStatus('Kunne ikke sende automatisk. Prøv e-post i stedet.', 'err');
        sendViaEmail(payload, true);
      });
  });

  function orderDone() {
    cart = []; saveCart(); renderBadge();
    clearBtn.hidden = true;
    form.hidden = true;
    setStatus('');
    itemsEl.innerHTML =
      '<div class="cart-done">'
        + '<div class="cart-done__check" aria-hidden="true">✓</div>'
        + '<h4>Takk! Bestillingen er sendt</h4>'
        + '<p>Vi tar kontakt på e-post for å bekrefte. Betaling skjer via <b>Vipps til ' + esc(vippsInfo) + '</b>.</p>'
        + '<button type="button" class="btn btn--maroon cart-done__close">Lukk</button>'
      + '</div>';
    var c = itemsEl.querySelector('.cart-done__close');
    if (c) c.addEventListener('click', closeDrawer);
    openDrawer();
  }

  // E-post-fallback: åpner ferdig utfylt e-post med hele kurven.
  function sendViaEmail(payload, keepCart) {
    var body = 'Hei Apeiron,\n\nJeg vil bestille:\n' + summaryText()
      + '\n\nTotalt: ' + payload.total + ',–'
      + '\n\nNavn: ' + payload.name
      + '\nE-post: ' + payload.email
      + (payload.phone ? '\nTelefon: ' + payload.phone : '')
      + (payload.comment ? '\nKommentar: ' + payload.comment : '')
      + '\n';
    var href = 'mailto:' + fallbackEmail
      + '?subject=' + encodeURIComponent('Merch-bestilling fra ' + (payload.name || ''))
      + '&body=' + encodeURIComponent(body);
    window.location.href = href;
    if (!keepCart) setStatus('Åpner e-post for å fullføre bestillingen …');
  }

  renderCart();
})();
