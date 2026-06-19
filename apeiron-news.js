/* ============================================================
   apeiron-news.js — nyheter på forsiden
   Leser fra news-content.js (window.NEWS_CONTENT), som ligger i repoet og
   lastes umiddelbart. Redigeres i nyheter-admin.html. Erstatter det gamle
   Google Sheet-baserte systemet.

   Viser:
     • «Akkurat nå»-kortet i toppbildet (#news-panel) — hastebeskjeder,
       neste arrangement (auto fra kalenderen) og siste kunngjøringer.
     • Slanke beskjeder øverst i Arrangementer / Aporetisk / Fadderuke
       (#news-arrangement / #news-aporetisk / #news-fadderuke).

   Valgfri live-kanal: hvis window.NEWS_ENDPOINT er satt (news-config.js),
   hentes ekstra beskjeder live (f.eks. en hastebeskjed lagt inn fra mobil).
   Dette er ikke nødvendig — siden virker helt fint uten.
   ============================================================ */
(function () {
  'use strict';

  var LS_KEY = 'apeiron-news-v1';
  var MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DES'];
  var WD = ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør'];
  var SECTIONS = { arrangement: 'news-arrangement', aporetisk: 'news-aporetisk', fadderuke: 'news-fadderuke' };
  var MAX_PANEL = 3; // antall kunngjøringer i panelet (resten ligger i arkivet)

  var state = { items: [], event: null, sources: {} };
  var SRC_PRIORITY = { aporetisk: 3, fadder: 2, activity: 1 };
  var SRC_LABEL = {
    aporetisk: { lbl: 'Neste · Aporetisk Aften', href: 'index.html#aporetisk' },
    fadder:    { lbl: 'Neste · Fadderuke',      href: 'index.html#fadderuke' },
    activity:  { lbl: 'Neste arrangement',      href: 'index.html#arrangementer' }
  };

  /* ---------- hjelpere ---------- */
  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }
  function safeUrl(url) {
    var u = String(url || '').trim();
    if (/^(https?:\/\/|mailto:|\/|#|[a-z0-9._-]+\.[a-z]{2,})/i.test(u)) return u.replace(/"/g, '%22');
    return '';
  }
  // **fet** *kursiv* _understrek_ [tekst](url) + linjeskift — XSS-trygt.
  function markup(text) {
    var s = esc(text);
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, url) {
      var safe = safeUrl(url);
      return safe ? '<a href="' + safe + '" target="_blank" rel="noopener">' + label + '</a>' : label;
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    s = s.replace(/_([^_]+)_/g, '<u>$1</u>');
    return s.replace(/\r?\n/g, '<br>');
  }
  function parseDate(v) {
    var m = String(v || '').trim().match(/^(\d{2})\.(\d{2})\.(\d{2})$/);
    if (!m) return null;
    var d = new Date(2000 + +m[1], +m[2] - 1, +m[3]);
    return isNaN(d.getTime()) ? null : d;
  }
  // Valgfritt tidsvindu (from/to «åå.mm.dd»). Feiler trygt → alltid synlig.
  function inWindow(n) {
    var now = new Date(), from = parseDate(n.from), to = parseDate(n.to);
    if (from && now < from) return false;
    if (to) { var end = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999); if (now > end) return false; }
    return true;
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fmtPosted(iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  /* ---------- data ---------- */
  function getData() {
    var base = (window.NEWS_CONTENT && Array.isArray(window.NEWS_CONTENT.items)) ? window.NEWS_CONTENT.items : [];
    // Admin-utkast i samme nettleser vinner (live forhåndsvisning / lokal testing).
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (raw) { var d = JSON.parse(raw); if (d && Array.isArray(d.items)) return d.items.slice(); }
    } catch (_) {}
    return base.slice();
  }
  function visible(items, place) {
    return items.filter(function (n) {
      return n && !n.done && n.place === place && inWindow(n);
    });
  }

  /* ---------- panel (Akkurat nå) ---------- */
  function panelRowAnnounce(n) {
    var safe = n.link ? safeUrl(n.link) : '';
    var ext = /^https?:/i.test(safe);
    var tag = ext ? ' target="_blank" rel="noopener"' : '';
    var lbl = n.date ? esc(n.date) : 'Kunngjøring';
    var meta = n.posted ? '<span class="now__meta">Lagt ut ' + esc(fmtPosted(n.posted)) + '</span>' : '';
    var inner =
      '<span class="now__body"><span class="now__lbl">' + lbl + '</span>'
      + '<span class="now__ttl">' + esc(n.title || '') + '</span>' + meta + '</span>'
      + '<span class="now__arr" aria-hidden="true">→</span>';
    return safe
      ? '<a class="now__row" href="' + safe + '"' + tag + '>' + inner + '</a>'
      : '<div class="now__row">' + inner + '</div>';
  }
  function panelUrgent(n) {
    var safe = n.link ? safeUrl(n.link) : '';
    var txt = esc(n.title || n.text || 'Viktig beskjed');
    return safe
      ? '<a class="now__urgent" href="' + safe + '">' + txt + '</a>'
      : '<div class="now__urgent">' + txt + '</div>';
  }
  function panelEventRow() {
    var c = state.event;
    if (!c || !c.ev || !c.ev.start) return '';
    var e = c.ev, d = e.start;
    var meta = (e.allDay ? 'Hele dagen' : (WD[d.getDay()] + ' · ' + pad(d.getHours()) + ':' + pad(d.getMinutes())));
    if (e.place) meta += ' · ' + esc(e.place);
    var L = SRC_LABEL[c.src] || SRC_LABEL.activity;
    var ttl = esc(e.title || 'Arrangement');
    return '<a class="now__row now__row--event" href="' + L.href + '">'
      + '<span class="now__date"><b>' + d.getDate() + '</b><span>' + MON[d.getMonth()] + '</span></span>'
      + '<span class="now__body"><span class="now__lbl">' + L.lbl + '</span>'
      + '<span class="now__ttl">' + ttl + '</span><span class="now__meta">' + meta + '</span></span>'
      + '</a>';
  }
  function logoFallback(host) {
    // Ingen nyheter og ikke noe arrangement → vis seglet (som før), aldri et tomt kort.
    host.className = 'hero__logo-card';
    host.hidden = false;
    host.innerHTML = '<img src="assets/apeiron-logo.png" alt="Apeiron sitt segl med timeglass og gresk inskripsjon" />';
  }
  function renderPanel(items) {
    var host = document.getElementById('news-panel');
    if (!host) return;
    var panel = visible(items, 'panel');
    var urgent = panel.filter(function (n) { return n.urgent; });
    var normal = panel.filter(function (n) { return !n.urgent; }).slice(0, MAX_PANEL);
    var evRow = panelEventRow();

    // Tomt kort unngås: uten innhold OG uten arrangement → seglet.
    if (!urgent.length && !normal.length && !evRow) { logoFallback(host); return; }

    host.className = 'hero__aside';
    host.hidden = false;
    var h = '<aside class="now" role="complementary" aria-label="Akkurat nå">'
      + '<div class="now__head"><span class="now__kick">Akkurat nå</span></div>'
      + urgent.map(panelUrgent).join('')
      + evRow
      + normal.map(panelRowAnnounce).join('')
      + '<a class="now__all" href="nyheter.html">Alle nyheter &amp; arkiv <span aria-hidden="true">→</span></a>'
      + '</aside>';
    host.innerHTML = h;
  }

  /* ---------- slank beskjed i seksjon ---------- */
  function beskjed(n) {
    var body = '';
    if (n.title) body += '<b>' + esc(n.title) + '</b>' + (n.text ? ' ' : '');
    if (n.text) body += markup(n.text);
    if (n.link) {
      var safe = safeUrl(n.link);
      if (safe) {
        var ext = /^https?:/i.test(safe);
        body += ' <a href="' + safe + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>'
          + esc(n.linkLabel || 'Les mer') + ' →</a>';
      }
    }
    return '<div class="beskjed' + (n.urgent ? ' beskjed--urgent' : '') + '" role="status">'
      + '<span class="beskjed__tag">' + (n.urgent ? 'Viktig' : 'Beskjed') + '</span>'
      + '<div class="beskjed__body">' + body + '</div></div>';
  }
  function renderSections(items) {
    Object.keys(SECTIONS).forEach(function (place) {
      var host = document.getElementById(SECTIONS[place]);
      if (!host) return;
      var list = visible(items, place);
      if (!list.length) { host.hidden = true; host.innerHTML = ''; return; }
      host.hidden = false;
      host.innerHTML = list.map(beskjed).join('');
    });
  }

  /* ---------- render ---------- */
  function render() {
    var items = state.items;
    renderPanel(items);
    renderSections(items);
  }

  // Krok fra kalenderne (apeiron-events / aporetisk-cal / apeiron-fadder):
  // hver kalender melder inn sitt neste kommende arrangement med en kilde-nøkkel.
  // Vi viser det aller første som kommer, og slår sammen samme hendelse som
  // står i flere kalendere (f.eks. Aporetisk på en fadder-torsdag) til én.
  window.apeironNewsNextEvent = function (ev, live, source) {
    source = source || 'activity';
    state.sources[source] = (ev && ev.start) ? ev : null;
    recomputeEvent();
    render();
  };
  function recomputeEvent() {
    var now = new Date(), cands = [];
    Object.keys(state.sources).forEach(function (src) {
      var ev = state.sources[src];
      if (ev && ev.start && ev.start >= now) cands.push({ src: src, ev: ev });
    });
    // Tidligst først; ved likt tidspunkt vinner mest spesifikke kalender.
    cands.sort(function (a, b) {
      return (a.ev.start - b.ev.start) || ((SRC_PRIORITY[b.src] || 0) - (SRC_PRIORITY[a.src] || 0));
    });
    var seen = {}, deduped = [];
    cands.forEach(function (c) {
      var k = c.ev.start.getTime() + '|' + String(c.ev.title || '').toLowerCase().trim();
      if (seen[k]) return; seen[k] = 1; deduped.push(c);
    });
    state.event = deduped.length ? deduped[0] : null;
  }

  /* ---------- live forhåndsvisning (nyheter-admin.html) ---------- */
  function previewBridge() {
    var IS = false;
    try { IS = /[?&]preview\b/.test(location.search) || (window.self !== window.top); } catch (e) {}
    if (!IS) return false;
    window.addEventListener('message', function (e) {
      var d = e.data;
      if (!d || d.type !== 'apeiron-news-preview') return;
      if (Array.isArray(d.items)) { state.items = d.items; render(); }
    });
    try { parent.postMessage({ type: 'apeiron-news-preview-ready' }, '*'); } catch (_) {}
    return true;
  }

  /* ---------- valgfri live-kanal ---------- */
  function loadLive() {
    var ENDPOINT = window.NEWS_ENDPOINT || '';
    if (!ENDPOINT) return;
    var url = ENDPOINT;
    var token = window.NEWS_TOKEN || '';
    if (token) url += (url.indexOf('?') > -1 ? '&' : '?') + 'token=' + encodeURIComponent(token);
    fetch(url, { method: 'GET' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (data) {
        if (!Array.isArray(data) || !data.length) return;
        // Live-beskjeder legges FØRST (nyest/viktigst), så repo-innholdet.
        var live = data.map(function (n) {
          return {
            place: (n.place || 'panel').toLowerCase(), urgent: !!n.urgent,
            title: n.title || '', text: n.text || '', date: n.date || '',
            link: n.link || '', linkLabel: n.linkLabel || '',
            from: n.from || '', to: n.to || '', done: false
          };
        });
        state.items = live.concat(state.items);
        render();
      })
      .catch(function () { /* stille — live-kanalen er valgfri */ });
  }

  /* ---------- init ---------- */
  function init() {
    // Kjør bare der det finnes en plassholder (forsiden).
    if (!document.getElementById('news-panel') && !document.getElementById('news-arrangement')) return;
    state.items = getData();
    render();
    if (previewBridge()) return; // i forhåndsvisning: vent på data fra admin (ikke hent live)
    loadLive();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
