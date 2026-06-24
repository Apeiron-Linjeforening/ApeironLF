/* apeiron-pensum.js — gjengir TEKST-delene av Pensum-siden (pensum.html) fra
   pensum-content.js (window.PENSUM_CONTENT): topp-banner, emnekatalogen,
   «Pensum-markedet»-teaseren, ansvarsfraskrivelser, studieretningene og grader.

   Selve søk/filter/trekkspill-logikken ligger i pensum.html og kjøres ETTER
   dette skriptet, så den fanger opp de gjengitte emnekortene.

   Tekst-format som tolkes: **fet** og [tekst](adresse).

   Preview-protokoll: pensum.html?preview=1 lytter etter
     postMessage({ type:'apeiron-pensum-preview', content })
   og melder fra med 'apeiron-pensum-preview-ready' / '-height'. */
(function () {
  'use strict';

  var IS_PREVIEW = false;
  try { IS_PREVIEW = /[?&]preview\b/.test(location.search); } catch (e) {}

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  // **fet** og [tekst](adresse) → trygt formatert HTML (input escapes først)
  function rich(s) {
    s = esc(s);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (m, t, u) {
      var ext = /^https?:/i.test(u);
      return '<a href="' + u + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + t + '</a>';
    });
    return s;
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
  function setHtml(id, html, hasData) {
    var el = document.getElementById(id);
    if (!el || !(IS_PREVIEW || hasData)) return;
    el.innerHTML = html;
  }

  // Faste fallback-kortnavn hvis en seksjon mangler «short» (eldre data).
  var SECTION_FALLBACK = { felles: 'Felles', filosofi: 'Filosofi', etikk: 'Etikk', master: 'Master' };

  // Filtrer-fanene bygges fra seksjonene (single source of truth), så nye/delte
  // seksjoner får sin egen fane automatisk. Beholder aktiv fane over re-render.
  function renderTabs(sections) {
    var wrap = document.querySelector('.ps-tabs');
    if (!wrap) return;
    if (!(IS_PREVIEW || sections.length)) return;
    var active = wrap.querySelector('.ps-tab.is-active');
    var cur = active ? active.getAttribute('data-filter') : 'alle';
    var valid = { alle: 1 }; sections.forEach(function (s) { valid[s.id] = 1; });
    if (!valid[cur]) cur = 'alle';
    var html = '<button class="ps-tab' + (cur === 'alle' ? ' is-active' : '') + '" data-filter="alle" type="button">Alle emner</button>';
    sections.forEach(function (s) {
      html += '<button class="ps-tab' + (cur === s.id ? ' is-active' : '') + '" data-filter="' + esc(s.id) + '" type="button">' + esc(s.short || s.label || s.id) + '</button>';
    });
    wrap.innerHTML = html;
  }

  function renderCatalog(C) {
    var grid = document.getElementById('psGrid');
    if (!grid) return;
    var sections = Array.isArray(C.sections) ? C.sections : [];
    var courses = Array.isArray(C.courses) ? C.courses : [];
    if (!(IS_PREVIEW || courses.length)) { renderTabs(sections); return; }
    var html = '';
    sections.forEach(function (sec) {
      var inSec = courses.filter(function (c) { return c.level === sec.id; });
      var badgeLbl = sec.short || sec.label || SECTION_FALLBACK[sec.id] || sec.id || '';
      var badgeStyle = sec.color ? ' style="background:' + esc(sec.color) + '"' : '';
      html += '<div class="ps-section-divider reveal" data-section="' + esc(sec.id) + '"><h2>' + esc(sec.label) + '</h2></div>';
      inSec.forEach(function (c, i) {
        var delay = (i % 2 === 1) ? ' d1' : '';
        var booksHtml = '';
        if (Array.isArray(c.books) && c.books.length) {
          booksHtml = '<ul class="ps-books">' + c.books.map(function (bk, bi) {
            var det = bk.detail ? '<span class="ps-book__detail">' + esc(bk.detail) + '</span>' : '';
            return '<li class="ps-book"><span class="ps-book__num">' + (bi + 1) + '</span>'
              + '<div class="ps-book__info"><span class="ps-book__title">' + esc(bk.title) + '</span>'
              + '<span class="ps-book__author">' + esc(bk.author) + '</span>' + det + '</div></li>';
          }).join('') + '</ul>';
        } else if (c.empty) {
          booksHtml = '<div class="ps-empty"><b>' + esc(c.empty.title) + '</b><span>' + rich(c.empty.body) + '</span></div>';
        }
        var note = c.note ? '<p class="ps-note">' + esc(c.note) + '</p>' : '';
        var ntnuLabel = c.ntnuLabel || 'Se emne på ntnu.no';
        var ntnu = c.ntnuHref ? '<a class="ps-ntnu-link" href="' + esc(c.ntnuHref) + '" target="_blank" rel="noopener">' + esc(ntnuLabel) + ' →</a>' : '';
        html += '<article class="ps-course reveal' + delay + '" data-level="' + esc(c.level) + '">'
          + '<button class="ps-course__toggle" type="button" aria-expanded="false">'
          + '<div class="ps-course__badges"><span class="ps-badge"' + badgeStyle + '>' + esc(badgeLbl) + '</span></div>'
          + '<span class="ps-course__code">' + esc(c.code) + '</span>'
          + '<span class="ps-course__name">' + esc(c.name) + '</span>'
          + '<span class="ps-semester">' + esc(c.semester) + '</span>'
          + '<span class="ps-course__arrow" aria-hidden="true">▾</span>'
          + '</button>'
          + '<div class="ps-course__body"><div class="ps-course__body-inner">'
          + '<div><p class="ps-course__desc">' + rich(c.desc) + '</p>' + note + ntnu + '</div>'
          + '<div><span class="ps-books__lbl">Pensumliste</span>' + booksHtml + '</div>'
          + '</div></div>'
          + '</article>';
      });
    });
    grid.innerHTML = html;
    renderTabs(sections);
  }

  function render() {
    var C = window.PENSUM_CONTENT || {};
    var sh = C.subhero || {}, teaser = C.teaser || {}, ti = C.tracksIntro || {};

    /* ── SUBHERO ── */
    setText('ix-ps-back', sh.back);
    setText('ix-ps-title', sh.title);
    setText('ix-ps-lede', sh.lede);
    setHtml('ix-ps-meta', (Array.isArray(sh.meta) ? sh.meta : []).map(function (m) {
      return '<li>' + rich(m) + '</li>';
    }).join(''), Array.isArray(sh.meta) && sh.meta.length);

    /* ── EMNEKATALOG ── */
    renderCatalog(C);

    /* ── PENSUM-MARKEDET (teaser) ── */
    setText('ix-ps-teaser-tag', teaser.tag);
    setText('ix-ps-teaser-heading', teaser.heading);
    setText('ix-ps-teaser-body', teaser.body);
    setText('ix-ps-teaser-cta-label', teaser.ctaLabel);
    setHref('ix-ps-teaser-cta', teaser.ctaHref);

    setText('ix-ps-note1', C.note1);

    /* ── STUDIERETNINGENE ── */
    setText('ix-ps-tracks-eyebrow', ti.eyebrow);
    setText('ix-ps-tracks-heading', ti.heading);
    setText('ix-ps-tracks-lede', ti.lede);
    setHtml('ix-ps-tracks', (Array.isArray(C.tracks) ? C.tracks : []).map(function (t, i) {
      var delay = i === 0 ? '' : ' d' + i;
      var points = (t.points || []).map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('');
      return '<article class="track reveal' + delay + '">'
        + '<span class="track__glyph" aria-hidden="true">' + esc(t.glyph) + '</span>'
        + '<span class="prog__level">' + esc(t.level) + '</span>'
        + '<h3>' + esc(t.title) + '</h3>'
        + '<p>' + esc(t.body) + '</p>'
        + '<ul class="track__points">' + points + '</ul>'
        + '</article>';
    }).join(''), Array.isArray(C.tracks) && C.tracks.length);

    /* ── GRADER & LØP ── */
    setText('grader', C.graderHeading);
    setHtml('ix-ps-programs', (Array.isArray(C.programs) ? C.programs : []).map(function (p) {
      var chips = (p.chips || []).map(function (ch) { return '<li>' + esc(ch) + '</li>'; }).join('');
      return '<article class="prog reveal">'
        + '<div class="prog__head"><span class="prog__num">' + esc(p.num) + '</span>'
        + '<div><div class="prog__badges"><span class="prog__level">' + esc(p.level) + '</span>'
        + '<span class="prog__sp">' + esc(p.sp) + '</span></div>'
        + '<h3>' + esc(p.title) + '</h3></div></div>'
        + '<div class="prog__body"><p class="prog__desc">' + esc(p.desc) + '</p>'
        + '<div class="prog__pensum"><span class="prog__pensum-lbl">Smakebiter fra pensum</span>'
        + '<ul class="prog__chips">' + chips + '</ul></div></div>'
        + '</article>';
    }).join(''), Array.isArray(C.programs) && C.programs.length);

    setText('ix-ps-note2', C.note2);
  }

  render();

  /* ── Live forhåndsvisning fra pensum-admin (pensum.html?preview=1) ── */
  if (IS_PREVIEW) {
    var notify = function () {
      try { parent.postMessage({ type: 'apeiron-pensum-preview-height', height: document.documentElement.scrollHeight }, '*'); } catch (e) {}
    };
    window.addEventListener('message', function (e) {
      var d = e.data;
      if (!d || d.type !== 'apeiron-pensum-preview') return;
      if (d.content) window.PENSUM_CONTENT = d.content;
      render();
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      if (typeof window.__pensumRefresh === 'function') window.__pensumRefresh();
      notify();
    });
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    try { parent.postMessage({ type: 'apeiron-pensum-preview-ready' }, '*'); } catch (e) {}
  }
})();
