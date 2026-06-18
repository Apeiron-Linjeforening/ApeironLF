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

    /* ── HERO ── */
    setText('ix-hero-eyebrow', hero.eyebrow);
    setText('ix-hero-tag', hero.tag);
    setText('ix-hero-lede', hero.lede);
    if (hero.cta1) { setText('ix-hero-cta1-label', hero.cta1.label); setHref('ix-hero-cta1', hero.cta1.href); }
    if (hero.cta2) { setText('ix-hero-cta2-label', hero.cta2.label); setHref('ix-hero-cta2', hero.cta2.href); }

    var wipBanner = document.getElementById('wip-banner');
    if (wipBanner && hero.wip) {
      setText('ix-wip-text', hero.wip.text);
      // show=false skjuler banneret helt
      if (hero.wip.show === false) wipBanner.style.display = 'none';
      else wipBanner.style.display = '';
    }

    /* ── KONTAKT ── */
    setText('ix-k-heading', kontakt.heading);
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
