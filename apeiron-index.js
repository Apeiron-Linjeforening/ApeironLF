/* apeiron-index.js — gjengir TEKST-delene av forsiden (Hjem) fra index-content.js
   (window.INDEX_CONTENT) og lytter etter live-forhåndsvisning fra index-admin.
   Dekker nå KUN Hero + Kontakt. «Om oss» og FAQ ligger på om-oss.html og
   gjengis av apeiron-om.js (om-content.js).

   På den ekte siden beholdes HTML-en som fallback hvis et felt mangler;
   i preview gjenspeiles innholdet nøyaktig (også tomme felt).

   Preview-protokoll: index.html?preview=1 lytter etter
     postMessage({ type:'apeiron-index-preview', content })
   og melder fra med 'apeiron-index-preview-ready' / '-height'. */
(function () {
  'use strict';

  var IS_PREVIEW = false;
  try { IS_PREVIEW = /[?&]preview\b/.test(location.search); } catch (e) {}

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Sett tekst på et element. På ekte side: bare overstyr når en verdi finnes
  // (HTML-en er fallback). I preview: speil nøyaktig, også tomt.
  function setText(id, val) {
    var el = document.getElementById(id);
    if (!el) return;
    if (IS_PREVIEW) { el.textContent = (val == null ? '' : val); return; }
    if (val != null && val !== '') el.textContent = val;
  }
  function setHref(id, val) {
    var el = document.getElementById(id);
    if (!el) return;
    if (val != null && val !== '') el.setAttribute('href', val);
    else if (IS_PREVIEW) el.setAttribute('href', '#');
  }

  function renderIndex() {
    var C = window.INDEX_CONTENT || {};
    var hero = C.hero || {}, kontakt = C.kontakt || {};
    var arr = C.arr || {}, apo = C.apo || {}, fadder = C.fadder || {};

    /* ── HERO ── */
    var wm = hero.wordmark || {};
    setText('ix-hero-wm-pre', wm.pre);
    setText('ix-hero-wm-mid', wm.mid);
    setText('ix-hero-wm-post', wm.post);
    setText('ix-hero-eyebrow', hero.eyebrow);
    setText('ix-hero-tag', hero.tag);
    setText('ix-hero-lede', hero.lede);
    if (hero.cta1) { setText('ix-hero-cta1-label', hero.cta1.label); setHref('ix-hero-cta1', hero.cta1.href); }
    if (hero.cta2) { setText('ix-hero-cta2-label', hero.cta2.label); setHref('ix-hero-cta2', hero.cta2.href); }
    setText('ix-hero-bridge', hero.bridge);

    /* ── BLI MEDLEM (intro-kolonnen) rendres nå av membership.js fra
       MEMBERSHIP_CONFIG, slik at hele «Bli medlem»-blokken styres ett sted
       (Admin → Medlemskap). Ikke rør #ix-m-* her. ── */

    /* ── SEKSJONS-INTROER (Arrangementer / Aporetisk / Fadderukene) ── */
    setText('ix-arr-eyebrow', arr.eyebrow);
    setText('ix-arr-heading', arr.heading);
    setText('ix-arr-lede', arr.lede);
    setText('ix-apo-eyebrow', apo.eyebrow);
    setText('ix-apo-title', apo.title);
    setText('ix-apo-lede', apo.lede);
    setText('ix-apo-forwhom', apo.forWhom);
    setText('ix-apo-greek', apo.greek);
    setText('ix-apo-greek-sub', apo.greekSub);
    setText('ix-apo-note', apo.note);
    setText('ix-fadder-eyebrow', fadder.eyebrow);
    setText('ix-fadder-heading', fadder.heading);
    setText('ix-fadder-lede', fadder.lede);

    /* ── KONTAKT ── */
    setText('ix-k-heading', kontakt.heading);
    setText('ix-k-eyebrow', kontakt.eyebrow);
    setText('ix-k-email', kontakt.email);
    setHref('ix-k-email', kontakt.email ? 'mailto:' + kontakt.email : '');
    setText('ix-k-address', kontakt.address);
    setText('ix-k-web', kontakt.web);
    setHref('ix-k-web', kontakt.webHref);

    /* Kort FAQ ved siden av kontaktboksen (Hjem) */
    setText('ix-hjem-faq-heading', kontakt.faqHeading);
    var hjemFaqHost = document.getElementById('ix-hjem-faq');
    if (hjemFaqHost && Array.isArray(kontakt.faq) && (IS_PREVIEW || kontakt.faq.length)) {
      hjemFaqHost.innerHTML = kontakt.faq.map(function (it) {
        return '<div class="faq__item">'
          + '<button class="faq__q">' + esc(it.q) + '</button>'
          + '<div class="faq__a"><p>' + esc(it.a) + '</p></div>'
          + '</div>';
      }).join('');
      if (IS_PREVIEW) wireFaq(hjemFaqHost);
    }

    var socHost = document.getElementById('ix-k-socials');
    if (socHost && Array.isArray(kontakt.socials) && (IS_PREVIEW || kontakt.socials.length)) {
      var ICONS = window.FOOTER_ICONS || {};
      socHost.innerHTML = kontakt.socials.map(function (s) {
        var href = s.href || '#';
        var ext = /^https?:/i.test(href);
        var icon = ICONS[s.icon] || ICONS.web || '';
        return '<a href="' + esc(href) + '" class="contact__social-link"'
          + (ext ? ' target="_blank" rel="noopener"' : '')
          + ' aria-label="' + esc(s.label) + '">' + icon
          + '<span>' + esc(s.label) + '</span></a>';
      }).join('');
    }
    applySectionOrder(C.sectionOrder);
  }

  /* Endrer rekkefølgen på innholdsseksjonene etter C.sectionOrder (settes i
     Admin → Forsiden). Galleri-ankeret (.hg-anchor rett foran en seksjon, f.eks.
     «Bli medlem») følger med seksjonen sin. Faller trygt tilbake til naturlig
     rekkefølge om lista mangler eller er ufullstendig. Hero ligger fast øverst og
     flyttes ikke; oppslagstavla-teaseren kan flyttes (ligger først som standard). */
  function applySectionOrder(order) {
    var KEYS = ['oppslagstavla-teaser', 'arrangementer', 'aporetisk', 'fadderuke', 'bli-medlem', 'kontakt'];
    var ord = (order && order.length) ? order.filter(function (k) { return KEYS.indexOf(k) >= 0; }) : [];
    KEYS.forEach(function (k) { if (ord.indexOf(k) < 0) ord.push(k); });
    var units = [];
    for (var i = 0; i < ord.length; i++) {
      var sec = document.getElementById(ord[i]);
      if (!sec) continue;
      var nodes = [sec];
      var prev = sec.previousElementSibling;
      // Galleri-ankeret rett foran en seksjon følger med (f.eks. «Bli medlem»).
      // «hg-top» er hero-galleriets faste plassering øverst og skal IKKE flytte med
      // oppslagstavla-teaseren.
      if (prev && prev.classList && prev.classList.contains('hg-anchor') && prev.id !== 'hg-top') nodes.unshift(prev);
      units.push({ sec: sec, nodes: nodes });
    }
    if (units.length < 2) return;
    var parent = units[0].sec.parentNode;
    for (var j = 0; j < units.length; j++) { if (units[j].sec.parentNode !== parent) return; }
    var kids = Array.prototype.slice.call(parent.children);
    var maxIdx = -1;
    units.forEach(function (u) { var ix = kids.indexOf(u.sec); if (ix > maxIdx) maxIdx = ix; });
    var endRef = kids[maxIdx + 1] || null;
    units.forEach(function (u) { u.nodes.forEach(function (n) { parent.insertBefore(n, endRef); }); });
  }

  // Minimal accordion-kobling — kun brukt i preview ved re-render (app.js har
  // allerede kjørt da). På ekte side står app.js for FAQ-en.
  function wireFaq(scope) {
    scope.querySelectorAll('.faq__item').forEach(function (item) {
      var q = item.querySelector('.faq__q');
      var a = item.querySelector('.faq__a');
      if (!q || !a) return;
      q.addEventListener('click', function () {
        var open = item.classList.contains('open');
        scope.querySelectorAll('.faq__item').forEach(function (it) {
          it.classList.remove('open');
          var aa = it.querySelector('.faq__a'); if (aa) aa.style.maxHeight = null;
        });
        if (!open) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
      });
    });
  }

  // Kjør med en gang (DOM-en over scriptet finnes; app.js lastes etter oss).
  renderIndex();

  /* ── Live forhåndsvisning fra index-admin (index.html?preview=1) ── */
  if (IS_PREVIEW) {
    var notify = function () {
      try { parent.postMessage({ type: 'apeiron-index-preview-height', height: document.documentElement.scrollHeight }, '*'); } catch (e) {}
    };
    window.addEventListener('message', function (e) {
      if (e.origin !== window.location.origin) return;
      var d = e.data;
      if (!d || d.type !== 'apeiron-index-preview') return;
      if (d.content) window.INDEX_CONTENT = d.content;
      renderIndex();
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      notify();
    });
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    try { parent.postMessage({ type: 'apeiron-index-preview-ready' }, '*'); } catch (e) {}
  }
})();
