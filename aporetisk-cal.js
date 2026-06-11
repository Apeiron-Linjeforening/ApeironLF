/* ============================================================
   APEIRON — Aporetisk Aften dato-widget
   Viser Når / Hvor som meta-etiketter + «Vis alle datoer»-liste.
   ============================================================ */
(function () {

  var CONFIG = {
    calendarId: 'c0fbad2d93f9d91900391591ebe9294012fea1f5a0cfa553a1150d9c768a0f17@group.calendar.google.com',
    API_KEY:    'AIzaSyDpJWruxDIh5tZ5yacb6uURhGlm6IbalBs',
    timeZone:   'Europe/Oslo'
  };

  var MONTHS = ['januar','februar','mars','april','mai','juni',
                'juli','august','september','oktober','november','desember'];

  var state = { events: [], live: false, expanded: false };

  // ---- Parsing -----------------------------------------------------------
  function parseEvent(raw) {
    var s      = raw.start || {};
    var allDay = !!s.date && !s.dateTime;
    var start  = new Date(s.dateTime || (s.date + 'T00:00:00'));
    var summary = (raw.summary || '').trim();
    var cat = 'Aporetisk Aften', title = summary;
    var m = summary.match(/^([^:]{2,22}):\s*(.+)$/);
    if (m) { cat = m[1].trim(); title = m[2].trim(); }
    return { title: title, cat: cat, start: start, allDay: allDay,
             place: raw.location || '', link: raw.htmlLink || '' };
  }

  function isAporetisk(e) {
    return (e.title + ' ' + e.cat).toLowerCase().indexOf('aporetisk') > -1;
  }

  // ---- Sample data (første torsdag i måneden) ----------------------------
  function makeSamples() {
    var now = new Date();
    var samples = [];
    for (var mi = 0; mi < 6; mi++) {
      var base = new Date(now.getFullYear(), now.getMonth() + mi, 1);
      for (var d = 1; d <= 31; d++) {
        var dt = new Date(base.getFullYear(), base.getMonth(), d);
        if (dt.getMonth() !== base.getMonth()) break;
        if (dt.getDay() === 4) {
          var start = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 19, 0, 0);
          samples.push({ title: 'Aporetisk Aften', cat: 'Aporetisk Aften',
                         start: start, allDay: false, place: 'Kontoret til Heine', link: '' });
          break;
        }
      }
    }
    return samples;
  }

  // ---- Fetch -------------------------------------------------------------
  function load() {
    if (!CONFIG.API_KEY) { useSample(); return; }
    var now = new Date();
    var url = 'https://www.googleapis.com/calendar/v3/calendars/'
      + encodeURIComponent(CONFIG.calendarId) + '/events'
      + '?key='       + encodeURIComponent(CONFIG.API_KEY)
      + '&timeMin='   + encodeURIComponent(new Date(now.getFullYear(), now.getMonth(), 1).toISOString())
      + '&singleEvents=true&orderBy=startTime&maxResults=24'
      + '&timeZone='  + encodeURIComponent(CONFIG.timeZone);

    fetch(url)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var items = (data.items || []).map(parseEvent).filter(isAporetisk);
        if (!items.length) { useSample(); return; }
        state.events = items;
        state.live   = true;
        render();
      })
      .catch(function () { useSample(); });
  }

  function useSample() {
    state.events = makeSamples();
    state.live   = false;
    render();
  }

  // ---- Helpers -----------------------------------------------------------
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }

  function upcoming(now) {
    return state.events.filter(function (e) { return e.start >= now; });
  }

  function fmtDate(dt, allDay) {
    var s = pad(dt.getDate()) + '. ' + MONTHS[dt.getMonth()];
    if (!allDay) s += '\u00a0kl.\u00a0' + pad(dt.getHours()) + ':' + pad(dt.getMinutes());
    return s;
  }

  // ---- Render ------------------------------------------------------------
  function render() {
    var now = new Date(); now.setHours(0, 0, 0, 0);
    var upc = upcoming(now);
    var nxt = upc[0] || null;

    // Fyll inn Når og Hvor i apo__meta
    var whenEl  = document.getElementById('apoWhen');
    var whereEl = document.getElementById('apoWhere');
    if (whenEl) {
      var valSpan = whenEl.querySelector('span');
      if (valSpan) valSpan.textContent = nxt ? fmtDate(nxt.start, nxt.allDay) : '—';
    }
    if (whereEl) {
      var placeSpan = whereEl.querySelector('span');
      if (placeSpan) placeSpan.textContent = nxt && nxt.place ? nxt.place : '—';
    }

    // Render toggle + liste i apoCalRoot
    var root = document.getElementById('apoCalRoot');
    if (!root) return;

    var h = '<button type="button" class="apo-cal__toggle">'
          + (state.expanded ? 'Skjul alle datoer\u00a0\u2191' : 'Vis alle datoer\u00a0\u2193')
          + '</button>';

    if (state.expanded) {
      h += '<div class="apo-cal__list" role="list">';
      if (upc.length) {
        upc.forEach(function (e) {
          h += '<div class="apo-cal__ev" role="listitem">'
             + '<span class="apo-cal__ev-date">' + esc(fmtDate(e.start, e.allDay)) + '</span>'
             + (e.place ? '<span class="apo-cal__ev-place">' + esc(e.place) + '</span>' : '')
             + (e.link  ? '<a class="apo-cal__ev-link" href="' + esc(e.link) + '" target="_blank" rel="noopener">Mer\u00a0\u2192</a>' : '')
             + '</div>';
        });
      } else {
        h += '<p class="apo-cal__empty">Ingen kommende arrangementer.</p>';
      }
      h += '</div>';
    }

    root.innerHTML = h;

    var tog = root.querySelector('.apo-cal__toggle');
    if (tog) {
      tog.addEventListener('click', function () {
        state.expanded = !state.expanded;
        render();
      });
    }
  }

  // ---- Init --------------------------------------------------------------
  function init() {
    if (document.getElementById('apoCalRoot')) load();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
