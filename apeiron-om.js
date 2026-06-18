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

  function renderOm() {
    var C = window.OM_CONTENT || {};
    var om = C.om || {}, faq = C.faq || {};

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
