/* apeiron-om.js — gjengir Om oss-siden (om-oss.html) fra om-content.js
   (window.OM_CONTENT) og lytter etter live-forhåndsvisning fra om-oss-admin.

   Lastes FØR app.js slik at FAQ-listen og nøkkeltallene finnes i DOM-en når
   app.js kobler på accordion + tellere. På den ekte siden beholdes HTML-en
   som fallback hvis et felt mangler; i preview speiles innholdet nøyaktig.

   Preview-protokoll: om-oss.html?preview=1 lytter etter
     postMessage({ type:'apeiron-om-preview', content })
   og melder fra med 'apeiron-om-preview-ready' / '-height'. */
(function () {
  'use strict';

  var IS_PREVIEW = false;
  try { IS_PREVIEW = /[?&]preview\b/.test(location.search); } catch (e) {}

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
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

  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>';
  var LS_ICONS = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
  ];
  function renderAllyGrid(id, list) {
    var hostEl = document.getElementById(id);
    if (!hostEl || !Array.isArray(list) || !(IS_PREVIEW || list.length)) return;
    hostEl.innerHTML = list.map(function (a, i) {
      var delay = i === 0 ? '' : ' d' + i;
      var links = (a.links || []).map(function (l) {
        var href = l.href || '#';
        var ext = /^https?:/i.test(href);
        return '<a class="ally__link" href="' + esc(href) + '"'
          + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + esc(l.label) + ' \u2192</a>';
      }).join('');
      return '<article class="ally reveal' + delay + '">'
        + '<span class="ally__glyph" aria-hidden="true">' + esc(a.glyph) + '</span>'
        + '<span class="prog__level">' + esc(a.level) + '</span>'
        + '<h3>' + esc(a.title) + '</h3>'
        + '<p>' + esc(a.body) + '</p>'
        + '<div class="ally__links">' + links + '</div>'
        + '</article>';
    }).join('');
  }
  function renderFeatures(id, list) {
    var hostEl = document.getElementById(id);
    if (!hostEl || !Array.isArray(list) || !(IS_PREVIEW || list.length)) return;
    hostEl.innerHTML = list.map(function (f, i) {
      return '<li>' + (LS_ICONS[i % LS_ICONS.length] || LS_ICONS[0])
        + '<div><strong>' + esc(f.title) + '</strong><span>' + esc(f.body) + '</span></div></li>';
    }).join('');
  }
  function renderBenefitList(id, list) {
    var hostEl = document.getElementById(id);
    if (!hostEl || !Array.isArray(list) || !(IS_PREVIEW || list.length)) return;
    hostEl.innerHTML = list.map(function (b) { return '<li>' + CHECK + ' ' + esc(b) + '</li>'; }).join('');
  }

  function renderOm() {
    var C = window.OM_CONTENT || {};
    var om = C.om || {}, faq = C.faq || {};

    /* ── SUBHERO (topp-banner) ── */
    var subhero = C.subhero || {};
    setText('ix-subhero-back', subhero.back);
    setText('ix-subhero-title', subhero.title);
    setText('ix-subhero-lede', subhero.lede);

    /* ── OM OSS ── */
    setText('ix-om-eyebrow', om.eyebrow);
    var greek = document.getElementById('ix-om-greek');
    if (greek && (IS_PREVIEW || om.greek)) {
      greek.innerHTML = esc(om.greek) + '\n          <small>' + esc(om.greekSmall) + '</small>';
    }
    if (Array.isArray(om.paras)) {
      om.paras.forEach(function (p, i) { setText('ix-om-p' + (i + 1), p); });
    }
    if (om.card) { setText('ix-om-card-title', om.card.title); setText('ix-om-card-body', om.card.body); }
    if (om.teaser) {
      setText('ix-om-teaser-eyebrow', om.teaser.eyebrow);
      setText('ix-om-teaser-title', om.teaser.title);
      setText('ix-om-teaser-body', om.teaser.body);
      setText('ix-om-teaser-link-label', om.teaser.linkLabel);
      setHref('ix-om-teaser-link', om.teaser.linkHref);
    }
    var statsHost = document.getElementById('ix-om-stats');
    if (statsHost && Array.isArray(om.stats) && (IS_PREVIEW || om.stats.length)) {
      statsHost.innerHTML = om.stats.map(function (s) {
        return '<div class="stat"><div class="stat__num">' + esc(s.num)
          + '</div><div class="stat__lbl">' + esc(s.lbl) + '</div></div>';
      }).join('');
    }

    /* ── FELLESSKAP & SAMARBEID ── */
    var samarbeid = C.samarbeid || {};
    setText('ix-samarbeid-eyebrow', samarbeid.eyebrow);
    setText('ix-samarbeid-heading', samarbeid.heading);
    setText('ix-samarbeid-lede', samarbeid.lede);
    renderAllyGrid('ix-samarbeid-allies', samarbeid.allies);

    /* ── LESESALEN ── */
    var lesesalen = C.lesesalen || {};
    setText('ix-ls-eyebrow', lesesalen.eyebrow);
    setText('ix-ls-heading', lesesalen.heading);
    setText('ix-ls-lede', lesesalen.lede);
    renderFeatures('ix-ls-features', lesesalen.features);

    /* ── MØT STYRET ── */
    var motStyret = C.motStyret || {};
    setText('ix-motstyret-eyebrow', motStyret.eyebrow);
    setText('ix-motstyret-heading', motStyret.heading);
    setText('ix-motstyret-lede', motStyret.lede);
    renderAllyGrid('ix-motstyret-cards', motStyret.cards);

    /* ── BLI MEDLEM (intro-kolonnen) ── */
    var medlem = C.medlem || {};
    setText('ix-om-m-eyebrow', medlem.eyebrow);
    setText('ix-om-m-heading', medlem.heading);
    setText('ix-om-m-lede', medlem.lede);
    renderBenefitList('ix-om-m-benefits', medlem.benefits);

    /* ── FAQ + seksjonsoverskrift ── */
    setText('ix-faq-eyebrow', faq.eyebrow);
    setText('ix-faq-heading', faq.heading);
    var faqHost = document.getElementById('ix-faq-list');
    if (faqHost && Array.isArray(faq.items) && (IS_PREVIEW || faq.items.length)) {
      faqHost.innerHTML = faq.items.map(function (it) {
        return '<div class="faq__item">'
          + '<button class="faq__q">' + esc(it.q) + '</button>'
          + '<div class="faq__a"><p>' + esc(it.a) + '</p></div>'
          + '</div>';
      }).join('');
      if (IS_PREVIEW) wireFaq(faqHost);
    }
  }

  // Minimal accordion-kobling — kun brukt i preview ved re-render, siden app.js
  // allerede har kjørt da. På ekte side står app.js for FAQ-en.
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

  renderOm();

  /* ── Live forhåndsvisning fra om-oss-admin (om-oss.html?preview=1) ── */
  if (IS_PREVIEW) {
    var notify = function () {
      try { parent.postMessage({ type: 'apeiron-om-preview-height', height: document.documentElement.scrollHeight }, '*'); } catch (e) {}
    };
    window.addEventListener('message', function (e) {
      var d = e.data;
      if (!d || d.type !== 'apeiron-om-preview') return;
      if (d.content) window.OM_CONTENT = d.content;
      renderOm();
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      notify();
    });
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    try { parent.postMessage({ type: 'apeiron-om-preview-ready' }, '*'); } catch (e) {}
  }
})();
