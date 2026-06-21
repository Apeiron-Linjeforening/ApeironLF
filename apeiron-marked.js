/* apeiron-marked.js — gjengir Pensum-markedet (marked.html) fra marked-content.js
   (window.MARKED_CONTENT) og lytter etter live-forhåndsvisning fra marked-admin.

   På den ekte siden beholdes HTML-en som fallback hvis et felt mangler; i
   preview speiles innholdet nøyaktig (også tomme felt). Lastes FØR den lokale
   reveal-observeren i marked.html, så dynamisk bygde kort blir fanget opp.

   Preview-protokoll: marked.html?preview=1 lytter etter
     postMessage({ type:'apeiron-marked-preview', content })
   og melder fra med 'apeiron-marked-preview-ready' / '-height'. */
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
  function renderList(id, list, fn) {
    var el = document.getElementById(id);
    if (!el || !Array.isArray(list) || !(IS_PREVIEW || list.length)) return;
    el.innerHTML = list.map(fn).join('');
  }

  function render() {
    var C = window.MARKED_CONTENT || {};
    var sh = C.subhero || {}, intro = C.intro || {}, interest = C.interest || {};

    /* ── SUBHERO ── */
    setText('ix-mk-back', sh.back);
    setText('ix-mk-eyebrow', sh.eyebrow);
    setText('ix-mk-title', sh.title);
    setText('ix-mk-lede', sh.lede);
    renderList('ix-mk-pills', sh.pills, function (p) {
      return '<span class="subhero__pill">' + esc(p) + '</span>';
    });

    /* ── INTRO ── */
    setText('ix-mk-symbol', intro.symbol);
    setText('ix-mk-intro-heading', intro.heading);
    setText('ix-mk-intro-lede', intro.lede);

    /* ── FEATURES ── */
    renderList('ix-mk-features', C.features, function (f, i) {
      var delay = i === 0 ? '' : ' d' + i;
      return '<div class="feat reveal' + delay + '">'
        + '<span class="feat__glyph">' + esc(f.glyph) + '</span>'
        + '<h3>' + esc(f.title) + '</h3>'
        + '<p>' + esc(f.body) + '</p>'
        + '</div>';
    });

    /* ── INTERESSE ── */
    setText('ix-mk-interest-eyebrow', interest.eyebrow);
    setText('ix-mk-interest-heading', interest.heading);
    setText('ix-mk-interest-body', interest.body);
    setText('ix-mk-cta1-label', interest.ctaLabel); setHref('ix-mk-cta1', interest.ctaHref);
    setText('ix-mk-cta2-label', interest.ctaLabel2); setHref('ix-mk-cta2', interest.ctaHref2);
    setText('ix-mk-interest-note', interest.note);
  }

  render();

  /* ── Live forhåndsvisning fra marked-admin (marked.html?preview=1) ── */
  if (IS_PREVIEW) {
    var notify = function () {
      try { parent.postMessage({ type: 'apeiron-marked-preview-height', height: document.documentElement.scrollHeight }, '*'); } catch (e) {}
    };
    window.addEventListener('message', function (e) {
      var d = e.data;
      if (!d || d.type !== 'apeiron-marked-preview') return;
      if (d.content) window.MARKED_CONTENT = d.content;
      render();
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      notify();
    });
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    try { parent.postMessage({ type: 'apeiron-marked-preview-ready' }, '*'); } catch (e) {}
  }
})();
