/* ============================================================
   apeiron-news.js — «trådløse» nyheter/hastebeskjeder på forsiden
   Henter nyheter live fra et Google Apps Script (doGet) som leser
   et Google Sheet «Nyheter». Redigeres fra mobil/PC uten å røre
   repoet. Se docs/apps-script-oppsett.md (seksjonen «Nyheter»).

   Endepunkt: window.NEWS_ENDPOINT (news-config.js). Tom = av.

   Dataformat fra doGet (JSON-array), én post per rad:
     { place, urgent, from, to, title, text, link }
       place  — "topp" | "hovedoppslag" | "arrangement" | "aporetisk" | "fadderuke"
       urgent — true ved hastegrad "haste"
       from   — "åå.mm.dd" eller "" (ingen startgrense)
       to     — "åå.mm.dd" eller "" (ingen sluttgrense)
       title  — kort tittel (valgfri)
       text   — brødtekst med enkel markup (se renderMarkup)
       link   — valgfri URL ({tekst} hentes fra Lenke-cella om satt)

   Stille hvis ingen nyheter, manglende endepunkt eller feil:
   en valgfri funksjon skal aldri lage støy på siden.
   ============================================================ */
(function () {
  'use strict';

  var ENDPOINT = window.NEWS_ENDPOINT || '';
  var TOKEN = window.NEWS_TOKEN || '';
  // Plasseringer vi støtter → id på plassholderen i index.html.
  var ZONES = {
    topp:         'news-topp',
    hovedoppslag: 'news-hovedoppslag',
    arrangement:  'news-arrangement',
    aporetisk:    'news-aporetisk',
    fadderuke:    'news-fadderuke'
  };

  // Robust plasserings-tolkning: arket kan bruke litt ulike skrivemåter
  // («Aporetisk aften», «Fadderukene», flertall osv.). Vi normaliserer og
  // mapper kjente varianter til riktig sone, så ingen nyhet faller stille bort.
  var PLACE_ALIASES = {
    'topp':            'topp',
    'hovedoppslag':    'hovedoppslag',
    'hoved':           'hovedoppslag',
    'arrangement':     'arrangement',
    'arrangementer':   'arrangement',
    'aporetisk':       'aporetisk',
    'aporetisk aften': 'aporetisk',
    'aporetiskaften':  'aporetisk',
    'fadderuke':       'fadderuke',
    'fadderuka':       'fadderuke',
    'fadderukene':     'fadderuke',
    'fadder':          'fadderuke'
  };

  function zoneFor(place) {
    var p = String(place == null ? '' : place).trim().toLowerCase().replace(/\s+/g, ' ');
    var key = PLACE_ALIASES[p] || p;
    return ZONES[key] ? key : null;
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  // Bare trygge lenke-protokoller slipper gjennom (ingen javascript:).
  function safeUrl(url) {
    var u = String(url || '').trim();
    if (/^(https?:\/\/|mailto:|\/|#|[a-z0-9._-]+\.[a-z]{2,}|[a-z0-9._-]+\.html)/i.test(u)) {
      return u.replace(/"/g, '%22');
    }
    return '';
  }

  // Escaper HTML FØRST (XSS-trygt), bygger så enkel markup → trygg HTML.
  function renderMarkup(text) {
    var s = esc(text);
    // Lenker: [tekst](url) — url valideres, ugyldige droppes til ren tekst.
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, url) {
      var safe = safeUrl(url);
      if (!safe) return label;
      return '<a href="' + safe + '" target="_blank" rel="noopener">' + label + '</a>';
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'); // **fet**
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');             // *kursiv*
    s = s.replace(/_([^_]+)_/g, '<u>$1</u>');                 // _understrek_
    s = s.replace(/\r?\n/g, '<br>');                          // linjeskift
    return s;
  }

  // Tolk "åå.mm.dd" (år.måned.dag, tosifret år) som lokal dato. År = 2000 + åå.
  // Ugyldig/tomt → null (ingen grense).
  function parseDate(v) {
    var m = String(v || '').trim().match(/^(\d{2})\.(\d{2})\.(\d{2})$/);
    if (!m) return null;
    var d = new Date(2000 + +m[1], +m[2] - 1, +m[3]);
    return isNaN(d.getTime()) ? null : d;
  }

  // Vis hvis (ingen from || nå ≥ from) og (ingen to || nå ≤ slutten av to-dagen).
  // Feiler trygt: skjuler aldri en nyhet ved skrivefeil i datoene.
  function inWindow(n) {
    var now = new Date();
    var from = parseDate(n.from);
    if (from && now < from) return false;
    var to = parseDate(n.to);
    if (to) {
      var end = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999);
      if (now > end) return false;
    }
    return true;
  }

  function buildItem(n) {
    var urgent = !!n.urgent;
    var el = document.createElement('div');
    el.className = 'news-item' + (urgent ? ' is-urgent' : '');
    el.setAttribute('role', 'status');
    var h = '';
    if (urgent) h += '<span class="news-item__flag">Viktig</span>';
    if (n.title) h += '<h3 class="news-item__title">' + esc(n.title) + '</h3>';
    if (n.text) h += '<div class="news-item__text">' + renderMarkup(n.text) + '</div>';
    if (n.link) {
      var safe = safeUrl(n.link);
      if (safe) h += '<a class="news-item__link" href="' + safe + '" target="_blank" rel="noopener">Les mer →</a>';
    }
    el.innerHTML = h;
    return el;
  }

  function render(items) {
    // Grupper på plassering, kun støttede soner og innenfor dato-vinduet.
    var byZone = {};
    items.forEach(function (n) {
      if (!n) return;
      var place = zoneFor(n.place);
      if (!place) return;
      if (!inWindow(n)) return;
      (byZone[place] = byZone[place] || []).push(n);
    });

    Object.keys(ZONES).forEach(function (place) {
      var host = document.getElementById(ZONES[place]);
      if (!host) return;
      var list = byZone[place] || [];
      host.innerHTML = '';
      if (!list.length) { host.hidden = true; return; }
      list.forEach(function (n) { host.appendChild(buildItem(n)); });
      host.hidden = false;
    });
  }

  function load() {
    if (!ENDPOINT) return; // funksjonen er av
    var url = ENDPOINT;
    if (TOKEN) url += (url.indexOf('?') > -1 ? '&' : '?') + 'token=' + encodeURIComponent(TOKEN);
    fetch(url, { method: 'GET' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) { if (Array.isArray(data)) render(data); })
      .catch(function () { /* stille: valgfri funksjon */ });
  }

  function init() {
    // Kjør bare hvis minst én plassholder finnes (forsiden).
    for (var place in ZONES) {
      if (document.getElementById(ZONES[place])) { load(); return; }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
