/* ============================================================
   APEIRON — Arrangementer fra Google Kalender
   ------------------------------------------------------------
   Henter arrangementer automatisk fra foreningens offentlige
   Google Kalender og viser dem i sidens egen stil (liste +
   rutenett), pluss en innebygd Google-kalender-fane.

   ▸ Slik LEGGER DERE TIL et arrangement: legg det rett inn i
     Google Kalenderen — siden oppdaterer seg selv. Ingen
     koding nødvendig.

   ▸ KATEGORI: skriv kategorien først i tittelen med kolon, f.eks.
        «Fagkveld: Etikk & KI»  →  blir tagget «Fagkveld».
     Uten kolon havner det under «Arrangement».

   ▸ ÉN GANGS OPPSETT for live liste/rutenett:
     Lim inn en Google API-nøkkel i API_KEY under (gratis å lage
     på console.cloud.google.com → APIs → Calendar API → Credentials).
     Helt til det er gjort viser liste/rutenett tydelige plassholdere,
     mens «Google-kalender»-fanen alltid er live.
   ============================================================ */
(function () {
  var CONFIG = {
    calendarId: 'apeironlinjeforening@gmail.com',
    API_KEY: window.GOOGLE_API_KEY || '',
    timeZone: 'Europe/Oslo',
    maxResults: 24
  };

  var MONTHS = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];
  var WEEKDAYS = ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør'];

  // ---- Plassholdere (vises til API-nøkkel er satt) ----------------------
  //  Tydelige plassholdere — IKKE ekte arrangementer. Når Google-kalenderen
  //  kobles til (API-nøkkel), erstattes disse av de virkelige hendelsene.
  var SAMPLE = [
    { cat: '[ Kategori ]', title: '[ Arrangement ]', start: '2026-09-04T18:00:00', place: '[ sted ]', desc: '[ Kort beskrivelse av arrangementet kommer her. ]' },
    { cat: '[ Kategori ]', title: '[ Arrangement ]', start: '2026-09-11T18:00:00', place: '[ sted ]', desc: '[ Kort beskrivelse av arrangementet kommer her. ]' },
    { cat: '[ Kategori ]', title: '[ Arrangement ]', start: '2026-09-18T18:00:00', place: '[ sted ]', desc: '[ Kort beskrivelse av arrangementet kommer her. ]' },
    { cat: '[ Kategori ]', title: '[ Arrangement ]', start: '2026-09-25T18:00:00', place: '[ sted ]', desc: '[ Kort beskrivelse av arrangementet kommer her. ]' }
  ];

  var INITIAL_LIST = 4;
  var INITIAL_GRID = 6;
  var state = { view: 'list', cat: 'Alle', events: [], live: false, expanded: false };

  // ---- Hjelpere ----------------------------------------------------------
  function parseEvent(raw) {
    // Google Calendar API item → vårt format
    var s = raw.start || {};
    var allDay = !!s.date && !s.dateTime;
    var start = new Date(s.dateTime || (s.date + 'T00:00:00'));
    var summary = (raw.summary || 'Arrangement').trim();
    var cat = 'Arrangement', title = summary;
    var m = summary.match(/^([^:]{2,22}):\s*(.+)$/);
    if (m) { cat = m[1].trim(); title = m[2].trim(); }
    var rawDesc = raw.description || '';
    return {
      cat: cat, title: title, start: start, allDay: allDay,
      place: raw.location || '', desc: stripHtml(rawDesc),
      link: raw.htmlLink || '', signupUrl: extractSignupUrl(rawDesc)
    };
  }
  function sampleToEvent(e) {
    return {
      cat: e.cat, title: e.title, start: new Date(e.start), allDay: !!e.allDay,
      place: e.place || '', desc: e.desc || '', link: ''
    };
  }
  function stripHtml(s) {
    var d = document.createElement('div'); d.innerHTML = s;
    return (d.textContent || '').trim();
  }
  function extractSignupUrl(rawHtml) {
    var d = document.createElement('div'); d.innerHTML = rawHtml;
    var anchors = d.querySelectorAll('a[href]');
    for (var i = 0; i < anchors.length; i++) {
      var h = anchors[i].href || '';
      if (h.indexOf('forms.gle') > -1 || h.indexOf('docs.google.com/forms') > -1) return h;
    }
    var m = rawHtml.match(/https?:\/\/(?:forms\.gle|docs\.google\.com\/forms\/[^\s"<>]+)/);
    return m ? m[0] : '';
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function timeStr(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function whenStr(e) {
    var wd = WEEKDAYS[e.start.getDay()];
    if (e.allDay) return wd + ' · hele dagen';
    return wd + ' · ' + timeStr(e.start);
  }
  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }

  // ---- Henting -----------------------------------------------------------
  function load() {
    if (!CONFIG.API_KEY) { useSample(); return; }
    var url = 'https://www.googleapis.com/calendar/v3/calendars/'
      + encodeURIComponent(CONFIG.calendarId) + '/events'
      + '?key=' + encodeURIComponent(CONFIG.API_KEY)
      + '&timeMin=' + encodeURIComponent(new Date().toISOString())
      + '&singleEvents=true&orderBy=startTime&maxResults=' + CONFIG.maxResults
      + '&timeZone=' + encodeURIComponent(CONFIG.timeZone);
    fetch(url)
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) {
        var items = (data.items || []).map(parseEvent).filter(function (e) { return e.title; });
        // Kalenderen er nådd, men tom → vis «dato kommer»-tomtilstand (ikke plassholdere).
        if (!items.length) { state.events = []; state.live = true; build(); return; }
        state.events = items; state.live = true; build();
      })
      .catch(function () { useSample(); });
  }
  function useSample() {
    state.events = SAMPLE.map(sampleToEvent); state.live = false; build();
  }

  // ---- Bygg UI -----------------------------------------------------------
  function build() {
    // Statuslinja er bevisst tom: hver visning viser sin egen vennlige
    // «kommer»-melding når kalenderen ikke er live, så et eget banner blir
    // bare forvirrende (ser ut som en feil).
    var statusEl = document.getElementById('evStatus');
    if (statusEl) { statusEl.innerHTML = ''; statusEl.style.display = 'none'; }
    buildFilters();
    render();
  }

  function buildFilters() {
    var wrap = document.getElementById('evFilters');
    if (!wrap) return;
    if (!state.live) { wrap.innerHTML = ''; return; }
    var cats = ['Alle'];
    state.events.forEach(function (e) { if (cats.indexOf(e.cat) < 0) cats.push(e.cat); });
    wrap.innerHTML = '';
    cats.forEach(function (c) {
      var b = document.createElement('button');
      b.className = 'ev-chip' + (c === state.cat ? ' is-active' : '');
      b.textContent = c;
      b.addEventListener('click', function () { state.cat = c; state.expanded = false; buildFilters(); render(); });
      wrap.appendChild(b);
    });
  }

  function filtered() {
    return state.events.filter(function (e) { return state.cat === 'Alle' || e.cat === state.cat; });
  }

  function render() {
    // view tabs
    document.querySelectorAll('.ev-view').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.view === state.view);
    });
    var list = document.getElementById('evList');
    var grid = document.getElementById('evGrid');
    var cal = document.getElementById('evCal');
    if (list) list.style.display = state.view === 'list' ? '' : 'none';
    if (grid) grid.style.display = state.view === 'grid' ? '' : 'none';
    if (cal) cal.style.display = state.view === 'calendar' ? '' : 'none';

    var data = filtered();
    var listLimit = state.expanded ? data.length : INITIAL_LIST;
    var gridLimit = state.expanded ? data.length : INITIAL_GRID;
    if (state.view === 'list') renderList(list, data.slice(0, listLimit), data.length, INITIAL_LIST);
    if (state.view === 'grid') renderGrid(grid, data.slice(0, gridLimit), data.length, INITIAL_GRID);
    if (state.view === 'calendar') renderCalendar(cal, data);
    if (window.apeironRescanReveals) window.apeironRescanReveals();
  }

  function emptyMsg() {
    // Frakoblet (ingen kontakt med kalender-API) → tydelig systembeskjed.
    if (!state.live) {
      return '<p class="ev-empty is-offline">⚠ Google API-nøkkelen er ugyldig eller ikke satt opp. Se <a href="https://github.com/Apeiron-Linjeforening/ApeironLF#readme" target="_blank" rel="noopener">README på GitHub</a> for hva som må sjekkes, eller <a href="#kontakt">ta kontakt med Apeiron styret</a>.</p>';
    }
    // Tilkoblet, men ingen arrangementer i kalenderen → vennlig beskjed.
    if (!state.events.length) {
      return '<p class="ev-empty">Ingen kommende arrangementer akkurat nå. Nye datoer legges ut fortløpende, følg oss gjerne på Instagram i mellomtiden.</p>';
    }
    return '<p class="ev-empty">Ingen arrangementer i denne kategorien akkurat nå.</p>';
  }

  function toggleBtn(total, limit) {
    if (state.expanded) {
      return '<button class="ev-show-more" type="button" data-action="less">Vis færre <span class="arr">↑</span></button>';
    }
    if (total <= limit) return '';
    var hidden = total - limit;
    return '<button class="ev-show-more" type="button" data-action="more">Vis alle ' + total + ' arrangementer (' + hidden + ' til) <span class="arr">↓</span></button>';
  }

  function bindToggleBtn(el) {
    var btn = el.querySelector('.ev-show-more');
    if (!btn) return;
    btn.addEventListener('click', function () {
      state.expanded = btn.dataset.action === 'more';
      render();
    });
  }

  function renderList(el, data, total, limit) {
    if (!el) return;
    if (!state.live || !data.length) { el.innerHTML = emptyMsg(); return; }
    el.innerHTML = data.map(function (e) {
      var d = e.start;
      var more = e.link
        ? '<a class="ev-more" href="' + e.link + '" target="_blank" rel="noopener">Mer info <span class="arr">→</span></a>'
        : '<a class="ev-more" href="#arrangementer">Mer info <span class="arr">→</span></a>';
      return '' +
        '<article class="evrow">' +
          '<div class="evrow__date"><span class="d">' + pad(d.getDate()) + '</span><span class="m">' + MONTHS[d.getMonth()] + '</span></div>' +
          '<div class="evrow__main">' +
            '<div class="evrow__tags"><span class="tag">' + esc(e.cat) + '</span>' +
              '<span class="evrow__when">' + esc(whenStr(e)) + (e.place ? ' · ' + esc(e.place) : '') + '</span></div>' +
            '<h3>' + esc(e.title) + '</h3>' +
            (e.desc ? '<p>' + esc(e.desc) + '</p>' : '') +
          '</div>' +
          '<div class="evrow__act">' + more +
            (e.signupUrl ? '<a class="ev-signup" href="' + esc(e.signupUrl) + '" target="_blank" rel="noopener">Meld deg på <span class="arr">→</span></a>' : '') +
          '</div>' +
        '</article>';
    }).join('') + toggleBtn(total, limit);
    bindToggleBtn(el);
  }

  function renderGrid(el, data, total, limit) {
    if (!el) return;
    if (!state.live || !data.length) { el.innerHTML = emptyMsg(); return; }
    el.innerHTML = data.map(function (e) {
      var d = e.start;
      return '' +
        '<article class="evcard evcard--plain">' +
          '<div class="evcard__head">' +
            '<div class="evcard__date2"><span class="d">' + pad(d.getDate()) + '</span><span class="m">' + MONTHS[d.getMonth()] + '</span></div>' +
            '<span class="evcard__cat">' + esc(e.cat) + '</span>' +
          '</div>' +
          '<div class="evcard__body">' +
            '<h3>' + esc(e.title) + '</h3>' +
            (e.desc ? '<p>' + esc(e.desc) + '</p>' : '') +
            '<div class="evcard__meta"><b>' + esc(whenStr(e)) + '</b>' + (e.place ? ' · ' + esc(e.place) : '') + '</div>' +
            (e.signupUrl ? '<a class="ev-signup" href="' + esc(e.signupUrl) + '" target="_blank" rel="noopener">Meld deg på <span class="arr">→</span></a>' : '') +
          '</div>' +
        '</article>';
    }).join('') + toggleBtn(total, limit);
    bindToggleBtn(el);
  }

  var MONTH_NAMES = ['januar', 'februar', 'mars', 'april', 'mai', 'juni',
    'juli', 'august', 'september', 'oktober', 'november', 'desember'];
  var WD_MON = ['man', 'tir', 'ons', 'tor', 'fre', 'lør', 'søn'];

  function startMonth() {
    var base = (filtered()[0] && filtered()[0].start) || new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  }

  function renderCalendar(el, data) {
    if (!el) return;
    if (!state.live) { el.innerHTML = emptyMsg(); return; }
    if (!state.calMonth) state.calMonth = startMonth();
    var year = state.calMonth.getFullYear(), month = state.calMonth.getMonth();
    var first = new Date(year, month, 1);
    var startWd = (first.getDay() + 6) % 7;            // mandag først
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var today = new Date(); today.setHours(0, 0, 0, 0);

    var byDay = {};
    data.forEach(function (e) {
      if (e.start.getFullYear() === year && e.start.getMonth() === month) {
        var k = e.start.getDate();
        (byDay[k] = byDay[k] || []).push(e);
      }
    });

    var html = '<div class="evcal">'
      + '<div class="evcal-bar">'
        + '<button class="evcal-nav" type="button" data-cal="prev" aria-label="Forrige måned">‹</button>'
        + '<div class="evcal-title">' + MONTH_NAMES[month] + ' ' + year + '</div>'
        + '<button class="evcal-nav" type="button" data-cal="next" aria-label="Neste måned">›</button>'
      + '</div>'
      + '<div class="evcal-grid">';
    WD_MON.forEach(function (d) { html += '<div class="evcal-wd">' + d + '</div>'; });
    for (var p = 0; p < startWd; p++) html += '<div class="evcal-cell evcal-cell--pad"></div>';
    var MAX_CHIPS = 2;
    for (var day = 1; day <= daysInMonth; day++) {
      var evs = byDay[day] || [];
      var isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
      var visible = evs.slice(0, MAX_CHIPS);
      var overflow = evs.length - MAX_CHIPS;
      html += '<div class="evcal-cell' + (evs.length ? ' has-ev' : '') + (isToday ? ' is-today' : '') + '">'
        + '<span class="evcal-num">' + day + '</span>'
        + '<div class="evcal-chips">'
        + visible.map(function (e) {
            return '<span class="evcal-chip"><b>' + (e.allDay ? '' : esc(timeStr(e.start)) + ' ') + '</b>' + esc(e.title) + '</span>';
          }).join('')
        + (overflow > 0 ? '<button class="evcal-overflow" type="button" data-day="' + day + '">+' + overflow + ' til</button>' : '')
        + '</div></div>';
    }
    html += '</div></div>';
    el.innerHTML = html;
    el.querySelectorAll('.evcal-nav').forEach(function (b) {
      b.addEventListener('click', function () {
        state.calMonth = new Date(year, month + (b.dataset.cal === 'next' ? 1 : -1), 1);
        render();
      });
    });
    el.querySelectorAll('.evcal-overflow').forEach(function (b) {
      b.addEventListener('click', function () {
        var cell = b.closest('.evcal-cell');
        var chips = cell.querySelector('.evcal-chips');
        var day = parseInt(b.dataset.day, 10);
        var evs = byDay[day] || [];
        chips.innerHTML = evs.map(function (e) {
          return '<span class="evcal-chip"><b>' + (e.allDay ? '' : esc(timeStr(e.start)) + ' ') + '</b>' + esc(e.title) + '</span>';
        }).join('') + '<button class="evcal-overflow" type="button" data-day="' + day + '">Vis færre</button>';
        chips.querySelector('.evcal-overflow').addEventListener('click', function () { render(); });
      });
    });
  }

  // ---- ICS-eksport («Legg hele programmet i din egen kalender») ----------
  function toIcsDate(d, allDay) {
    function p(n) { return n < 10 ? '0' + n : '' + n; }
    if (allDay) {
      return d.getFullYear() + '' + p(d.getMonth() + 1) + '' + p(d.getDate());
    }
    return d.getFullYear() + '' + p(d.getMonth() + 1) + '' + p(d.getDate())
      + 'T' + p(d.getHours()) + '' + p(d.getMinutes()) + '00';
  }
  function escIcs(s) { return (s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
  function foldLine(s) {
    // ICS lines max 75 octets; fold with CRLF + space
    var out = '', i = 0;
    while (i < s.length) { out += (i ? '\r\n ' : '') + s.slice(i, i + 75); i += 75; }
    return out;
  }

  function buildIcs(events) {
    var lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Apeiron Linjeforening//NTNU//NO',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Apeiron Linjeforening',
      'X-WR-TIMEZONE:Europe/Oslo'
    ];
    events.forEach(function (e, i) {
      var dtStart = toIcsDate(e.start, e.allDay);
      // default duration 2h for timed events
      var end = new Date(e.start.getTime() + (e.allDay ? 0 : 2 * 3600000));
      var dtEnd = toIcsDate(end, e.allDay);
      var uid = 'apeiron-' + i + '-' + e.start.getTime() + '@apeironlf.no';
      lines.push('BEGIN:VEVENT');
      lines.push(foldLine('UID:' + uid));
      if (e.allDay) {
        lines.push('DTSTART;VALUE=DATE:' + dtStart);
        lines.push('DTEND;VALUE=DATE:' + dtEnd);
      } else {
        lines.push('DTSTART;TZID=Europe/Oslo:' + dtStart);
        lines.push('DTEND;TZID=Europe/Oslo:' + dtEnd);
      }
      lines.push(foldLine('SUMMARY:' + escIcs(e.cat !== 'Arrangement' ? e.cat + ': ' + e.title : e.title)));
      if (e.desc) lines.push(foldLine('DESCRIPTION:' + escIcs(e.desc)));
      if (e.place) lines.push(foldLine('LOCATION:' + escIcs(e.place)));
      if (e.link) lines.push(foldLine('URL:' + e.link));
      lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  function showCalPopup(btn, calId) {
    // Fjern eventuelle eksisterende popups
    var existing = document.querySelector('.cal-popup');
    if (existing) { existing.parentNode.removeChild(existing); }

    var encoded = encodeURIComponent(calId);
    var webcalUrl = 'webcal://calendar.google.com/calendar/ical/' + encoded + '/public/basic.ics';
    var googleUrl = 'https://calendar.google.com/calendar/r?cid=' + encoded;

    var popup = document.createElement('div');
    popup.className = 'cal-popup';
    popup.innerHTML =
      '<p class="cal-popup__lbl">Velg kalender-app</p>' +
      '<a class="cal-popup__opt" href="' + googleUrl + '" target="_blank" rel="noopener">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' +
        'Google Kalender' +
      '</a>' +
      '<a class="cal-popup__opt" href="' + webcalUrl + '">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h8M8 18h5"/></svg>' +
        'Apple / Outlook (iCal)' +
      '</a>';

    // Plasser popup over knappen
    btn.parentNode.style.position = 'relative';
    btn.parentNode.appendChild(popup);

    // Lukk ved klikk utenfor
    function onOutside(e) {
      if (!popup.contains(e.target) && e.target !== btn) {
        popup.parentNode && popup.parentNode.removeChild(popup);
        document.removeEventListener('click', onOutside);
      }
    }
    setTimeout(function () { document.addEventListener('click', onOutside); }, 10);

    // Lukk etter klikk på et alternativ
    var opts = popup.querySelectorAll('.cal-popup__opt');
    for (var i = 0; i < opts.length; i++) {
      opts[i].addEventListener('click', function () {
        setTimeout(function () {
          popup.parentNode && popup.parentNode.removeChild(popup);
          document.removeEventListener('click', onOutside);
        }, 200);
      });
    }
  }

  function subscribeCalendar(btn) {
    showCalPopup(btn, CONFIG.calendarId);
  }

  // ---- View-bytte (faner + Tweaks) --------------------------------------
  function setView(v) {
    if (['list', 'grid', 'calendar'].indexOf(v) < 0) return;
    state.view = v; render();
  }
  window.apeironSetEventsView = setView;

  function init() {
    document.querySelectorAll('.ev-view').forEach(function (b) {
      b.addEventListener('click', function () { setView(b.dataset.view); });
    });

    // Kalender-nedlasting-knapp
    var addAllBtn = document.getElementById('evAddAll');
    if (addAllBtn) {
      addAllBtn.addEventListener('click', function (ev) {
        ev.preventDefault();
        subscribeCalendar(addAllBtn);
      });
    }

    load();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
