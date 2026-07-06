/* ============================================================
   section-engine.js — Apeiron Page Builder · kjerne-motor
   ------------------------------------------------------------
   En side er en ordnet liste av TYPEDE seksjoner. Hver seksjon er
   { id, type, tone, enabled?, props }. Motoren slår opp typen i et
   register (SectionTypes), kaller dens render() til HTML, og kjører
   en eventuell mount() for seksjoner som trenger JS (galleri o.l.).

   Dette er fundamentet sidene rendres fra — samme motor for hver
   side og (etter hvert) hver forening som kloner prosjektet.

   Globalt API:
     SectionTypes.define(type, def)   registrer en seksjonstype
     SectionTypes.get(type)           hent typedefinisjonen
     SectionTypes.has(type)           finnes typen?
     SectionTypes.list()              [{ type, label, icon }] for admin
     PageEngine.render(page, el, opt) tegn en side inn i et element
     PageEngine.resolveTones(list)    regn ut faktisk tone per seksjon
     PageEngine.esc(s)                HTML-escape

   Tone (farge/stemning) er semantisk: 'auto' veksler lys/mørk ut fra
   posisjon slik rytmen aldri brekker når seksjoner flyttes; en pinnet
   tone ('paper' | 'navy' | 'accent') overstyrer. I denne fasen tegner
   hver Apeiron-type fortsatt sin opprinnelige bakgrunn (parity), men
   tonen regnes ut og legges på som data-tone for neste steg.
   ============================================================ */
(function () {
  'use strict';

  var REG = {};

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var SectionTypes = {
    define: function (type, def) {
      if (!type || typeof def !== 'object') return;
      REG[type] = def;
    },
    get: function (type) { return REG[type] || null; },
    has: function (type) { return Object.prototype.hasOwnProperty.call(REG, type); },
    list: function () {
      return Object.keys(REG).map(function (t) {
        return { type: t, label: REG[t].label || t, icon: REG[t].icon || '▭', desc: REG[t].desc || '' };
      });
    },
    // Standard-innhold for «+ Ny seksjon» — typen leverer sine egne defaults.
    defaults: function (type) {
      var def = REG[type];
      if (def && typeof def.defaults === 'function') { try { return def.defaults(); } catch (e) {} }
      return {};
    }
  };

  // Veksler 'auto'-seksjoner mellom lys (paper) og mørk (navy) ut fra
  // forrige FAKTISKE tone, slik at to like aldri havner ved siden av
  // hverandre. Pinnede toner tas som de er.
  function resolveTones(sections) {
    var prev = null;
    return sections.map(function (s) {
      var t = (s && s.tone) || 'auto';
      if (t === 'auto') t = (prev === 'paper') ? 'navy' : 'paper';
      prev = t;
      return t;
    });
  }

  // Naboer med lik, PINNET tone — admin bruker dette til å varsle
  // redaktøren (rytme-vakt). Returnerer en liste av indekser som kolliderer.
  function toneClashes(sections, resolved) {
    var out = [];
    for (var i = 1; i < sections.length; i++) {
      if (resolved[i] === resolved[i - 1]) out.push(i);
    }
    return out;
  }

  function visibleSections(page, preview) {
    return (page.sections || []).filter(function (s) {
      if (!s || !s.type || !SectionTypes.has(s.type)) return false;
      return preview || s.enabled !== false;   // skjulte seksjoner vises i preview
    });
  }

  function render(page, mountEl, opts) {
    if (!page || !mountEl) return;
    opts = opts || {};
    var preview = !!opts.preview;

    var sections = visibleSections(page, preview);
    var tones = resolveTones(sections);

    var html = sections.map(function (s, i) {
      var def = SectionTypes.get(s.type);
      var ctx = { tone: tones[i], index: i, count: sections.length, preview: preview, esc: esc, page: page };
      try {
        return def.render(s.props || {}, s, ctx) || '';
      } catch (e) {
        console.error('[engine] render feilet for type "' + s.type + '"', e);
        return preview ? '<section class="section"><div class="wrap"><p style="color:#76110f">⚠ Feil i seksjon «' + esc(s.type) + '»</p></div></section>' : '';
      }
    }).join('\n');

    mountEl.innerHTML = html;

    // Merk hver seksjon med faktisk tone (for senere tema-styling + admin).
    sections.forEach(function (s, i) {
      var el = s.id ? document.getElementById(s.id) : null;
      if (el) el.setAttribute('data-tone', tones[i]);
    });

    // mount-hooks (galleri, lightbox, alt som trenger JS etter innsetting)
    sections.forEach(function (s) {
      var def = SectionTypes.get(s.type);
      if (def && typeof def.mount === 'function') {
        var el = s.id ? document.getElementById(s.id) : null;
        try { def.mount(el, s.props || {}, s, { preview: preview }); }
        catch (e) { console.error('[engine] mount feilet for type "' + s.type + '"', e); }
      }
    });

    return { sections: sections, tones: tones, clashes: toneClashes(sections, tones) };
  }

  /* ── Inkrementelle oppdateringer (presis live-preview, ingen ombygging) ──
     applyTones: regn ut toner på nytt og sett data-tone på hver seksjon —
     ingen innerHTML, ingen bilde-relasting. Bruk ved fargebytte.
     renderSection: tegn KUN én seksjon om (erstatt elementet), ved tekst-
     redigering, slik at resten av siden (scroll, bilder) står i ro. */
  function applyTones(page, mountEl, opts) {
    if (!page) return;
    opts = opts || {};
    var sections = visibleSections(page, !!opts.preview);
    var tones = resolveTones(sections);
    sections.forEach(function (s, i) {
      var el = s.id ? document.getElementById(s.id) : null;
      if (el) el.setAttribute('data-tone', tones[i]);
    });
    return { tones: tones, clashes: toneClashes(sections, tones) };
  }

  function renderSection(page, mountEl, id, opts) {
    if (!page || !mountEl || !id) return;
    opts = opts || {};
    var preview = !!opts.preview;
    var sections = visibleSections(page, preview);
    var idx = -1;
    for (var k = 0; k < sections.length; k++) { if (sections[k].id === id) { idx = k; break; } }
    var old = document.getElementById(id);
    if (idx < 0) { // seksjonen finnes ikke lenger (skjult/slettet) — fjern elementet
      if (old && old.parentNode === mountEl) old.parentNode.removeChild(old);
      applyTones(page, mountEl, opts);
      return;
    }
    var s = sections[idx];
    var tones = resolveTones(sections);
    var def = SectionTypes.get(s.type);
    var ctx = { tone: tones[idx], index: idx, count: sections.length, preview: preview, esc: esc, page: page };
    var html = '';
    try { html = def.render(s.props || {}, s, ctx) || ''; }
    catch (e) { console.error('[engine] renderSection feilet for "' + s.type + '"', e); return; }
    var tmp = document.createElement('div'); tmp.innerHTML = html;
    var newEl = tmp.firstElementChild; if (!newEl) return;
    if (old && old.parentNode) old.parentNode.replaceChild(newEl, old);
    else mountEl.appendChild(newEl);
    newEl.setAttribute('data-tone', tones[idx]);
    if (def && typeof def.mount === 'function') {
      try { def.mount(newEl, s.props || {}, s, { preview: preview }); }
      catch (e) { console.error('[engine] mount feilet for "' + s.type + '"', e); }
    }
    applyTones(page, mountEl, opts); // hold naboers tone i sync (billig)
  }

  window.SectionTypes = SectionTypes;
  window.PageEngine = { render: render, applyTones: applyTones, renderSection: renderSection, resolveTones: resolveTones, toneClashes: toneClashes, esc: esc };
})();
