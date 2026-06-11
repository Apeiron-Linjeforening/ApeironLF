/* ============================================================
   APEIRON — Fadderuke (egen Google Kalender)
   ------------------------------------------------------------
   Henter fadderukenes program fra en EGEN Google-kalender
   (samme API-nøkkel som arrangementene, men egen calendarId)
   og viser det i sidens kompakte uke/dag-stil. Programmet
   grupperes automatisk i Uke 1 / Uke 2 ut fra datoene.

   Tre oppsett — bytt i Tweaks:
     · picker     — uke-faner + dagsknapper, én dag om gangen
     · accordion  — alle dager listet, klikk for å folde ut
     · overview   — helhetlig oversikt over begge ukene samtidig

   ▸ Slik LEGGER DERE TIL en post: legg den rett inn i fadderuke-
     kalenderen — siden oppdaterer seg selv. Ingen koding.

   ▸ TYPE: skriv typen først i tittelen med kolon, f.eks.
        «Grill: Bli-kjent-kveld»  →  tagges «Grill».
     Sted hentes fra «Sted»-feltet i kalenderhendelsen.

   ▸ OPPSETT: lim inn fadderuke-kalenderens ID i CONFIG.calendarId
     under. API-nøkkelen er den samme som arrangementene bruker.
     Helt til calendarId er satt vises tydelige plassholdere.
   ============================================================ */
(function () {
  var CONFIG = {
    // 👇 Lim inn fadderuke-kalenderens ID her (egen kalender, ikke
    //    samme som arrangementer). Finn den i Google Kalender →
    //    Innstillinger for kalenderen → «Integrer kalender» → Kalender-ID.
    //    La stå tom inntil videre — da vises plassholdere.
    calendarId: '74a6de6d28a7a0ec383148bb2f67025d09712386e8b6add3d425fc0d9b5320f7@group.calendar.google.com',
    // Samme API-nøkkel som arrangementene (apeiron-events.js).
    API_KEY: 'AIzaSyDpJWruxDIh5tZ5yacb6uURhGlm6IbalBs',
    timeZone: 'Europe/Oslo',
    maxResults: 60
  };

  // ---- PLASSHOLDER-DATA — vises til calendarId er satt ------------------
  var PLACEHOLDER = {
    dates: '[ datoer kommer ]',
    weeks: [
      { label: 'Uke 1', days: [
        { wd: 'Mandag',  date: '[ dato ]', items: [
          { time: '00:00', title: '[ Aktivitet ]', place: '[ sted ]', kind: '[ type ]' },
          { time: '00:00', title: '[ Aktivitet ]', place: '[ sted ]', kind: '[ type ]' }
        ]},
        { wd: 'Tirsdag', date: '[ dato ]', items: [
          { time: '00:00', title: '[ Aktivitet ]', place: '[ sted ]', kind: '[ type ]' }
        ]},
        { wd: 'Onsdag',  date: '[ dato ]', items: [
          { time: '00:00', title: '[ Aktivitet ]', place: '[ sted ]', kind: '[ type ]' },
          { time: '00:00', title: '[ Aktivitet ]', place: '[ sted ]', kind: '[ type ]' }
        ]},
        { wd: 'Torsdag', date: '[ dato ]', items: [
          { time: '00:00', title: '[ Aktivitet ]', place: '[ sted ]', kind: '[ type ]' }
        ]},
        { wd: 'Fredag',  date: '[ dato ]', items: [
          { time: '00:00', title: '[ Aktivitet ]', place: '[ sted ]', kind: '[ type ]' },
          { time: '00:00', title: '[ Aktivitet ]', place: '[ sted ]', kind: '[ type ]' }
        ]},
        { wd: 'Lørdag',  date: '[ dato ]', items: [
          { time: '00:00', title: '[ Aktivitet ]', place: '[ sted ]', kind: '[ type ]' }
        ]},
        { wd: 'Søndag',  date: '[ dato ]', items: [] }
      ]},
      { label: 'Uke 2', days: [
        { wd: 'Mandag',  date: '[ dato ]', items: [
          { time: '00:00', title: '[ Aktivitet ]', place: '[ sted ]', kind: '[ type ]' }
        ]},
        { wd: 'Tirsdag', date: '[ dato ]', items: [
          { time: '00:00', title: '[ Aktivitet ]', place: '[ sted ]', kind: '[ type ]' },
          { time: '00:00', title: '[ Aktivitet ]', place: '[ sted ]', kind: '[ type ]' }
        ]},
        { wd: 'Onsdag',  date: '[ dato ]', items: [
          { time: '00:00', title: '[ Aktivitet ]', place: '[ sted ]', kind: '[ type ]' }
        ]},
        { wd: 'Torsdag', date: '[ dato ]', items: [
          { time: '00:00', title: '[ Aktivitet ]', place: '[ sted ]', kind: '[ type ]' },
          { time: '00:00', title: '[ Aktivitet ]', place: '[ sted ]', kind: '[ type ]' }
        ]},
        { wd: 'Fredag',  date: '[ dato ]', items: [
          { time: '00:00', title: '[ Aktivitet ]', place: '[ sted ]', kind: '[ type ]' }
        ]},
        { wd: 'Lørdag',  date: '[ dato ]', items: [
          { time: '00:00', title: '[ Aktivitet ]', place: '[ sted ]', kind: '[ type ]' }
        ]},
        { wd: 'Søndag',  date: '[ dato ]', items: [] }
      ]}
    ]
  };

  // FADDER = data som faktisk vises (plassholder eller live kalender).
  var FADDER = PLACEHOLDER;
  var IS_LIVE = false;

  var WD_LONG  = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
  var WD_SHORT = { 'Mandag': 'Man', 'Tirsdag': 'Tir', 'Onsdag': 'Ons', 'Torsdag': 'Tor', 'Fredag': 'Fre', 'Lørdag': 'Lør', 'Søndag': 'Søn' };
  var MONTHS   = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];

  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function stripHtml(s) { var d = document.createElement('div'); d.innerHTML = s; return (d.textContent || '').trim(); }
  function dayMs() { return 86400000; }
  function midnight(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }
  function fmtDate(d) { return d.getDate() + '. ' + MONTHS[d.getMonth()]; }
  function timeStr(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }

  // ---- Henting fra Google Kalender --------------------------------------
  function load() {
    if (!CONFIG.calendarId || !CONFIG.API_KEY) { useSample(); return; }
    var url = 'https://www.googleapis.com/calendar/v3/calendars/'
      + encodeURIComponent(CONFIG.calendarId) + '/events'
      + '?key=' + encodeURIComponent(CONFIG.API_KEY)
      + '&timeMin=' + encodeURIComponent(new Date(Date.now() - 7 * dayMs()).toISOString())
      + '&singleEvents=true&orderBy=startTime&maxResults=' + CONFIG.maxResults
      + '&timeZone=' + encodeURIComponent(CONFIG.timeZone);
    fetch(url)
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) {
        var items = (data.items || []).map(parseEvent).filter(function (e) { return e.title; });
        if (!items.length) { useSample(); return; }
        FADDER = groupIntoWeeks(items); IS_LIVE = true; render();
      })
      .catch(function () { useSample(); });
  }
  function useSample() { FADDER = PLACEHOLDER; IS_LIVE = false; render(); }

  function parseEvent(raw) {
    var s = raw.start || {};
    var allDay = !!s.date && !s.dateTime;
    var start = new Date(s.dateTime || (s.date + 'T00:00:00'));
    var summary = (raw.summary || 'Aktivitet').trim();
    var kind = '', title = summary;
    var m = summary.match(/^([^:]{2,22}):\s*(.+)$/);
    if (m) { kind = m[1].trim(); title = m[2].trim(); }
    return { start: start, allDay: allDay, title: title, kind: kind, place: raw.location || '' };
  }

  // Flat liste med hendelser → { dates, weeks:[{label, days:[{wd,date,items}]}] }
  function groupIntoWeeks(events) {
    events.sort(function (a, b) { return a.start - b.start; });
    var first = events[0].start, last = events[events.length - 1].start;

    // Mandag i uka til første hendelse (00:00).
    var firstMid = midnight(first);
    var startMonday = firstMid - (((new Date(firstMid).getDay() + 6) % 7)) * dayMs();

    var lastDayIndex = Math.floor((midnight(last) - startMonday) / dayMs());
    var numWeeks = Math.max(2, Math.floor(lastDayIndex / 7) + 1);

    // Bygg tomt skjelett: numWeeks uker à 7 dager (man–søn).
    var weeks = [];
    for (var w = 0; w < numWeeks; w++) {
      var days = [];
      for (var d = 0; d < 7; d++) {
        var dt = new Date(startMonday + (w * 7 + d) * dayMs());
        days.push({ wd: WD_LONG[d], date: fmtDate(dt), items: [] });
      }
      weeks.push({ label: 'Uke ' + (w + 1), days: days });
    }

    // Plasser hver hendelse i riktig uke/dag.
    events.forEach(function (e) {
      var di = Math.floor((midnight(e.start) - startMonday) / dayMs());
      if (di < 0) return;
      var wi = Math.floor(di / 7), dw = di % 7;
      if (!weeks[wi]) return;
      weeks[wi].days[dw].items.push({
        time: e.allDay ? 'Heldag' : timeStr(e.start),
        title: e.title, place: e.place, kind: e.kind
      });
    });

    return { dates: fmtDate(first) + ' – ' + fmtDate(last), weeks: weeks };
  }

  // ---- Delte byggesteiner -----------------------------------------------
  function metaStr(it) { return [it.kind, it.place].filter(Boolean).join(' · '); }

  function itemRow(it) {
    var meta = metaStr(it);
    return '' +
      '<div class="fd-item">' +
        '<span class="fd-item__time">' + esc(it.time) + '</span>' +
        '<div class="fd-item__body">' +
          '<span class="fd-item__title">' + esc(it.title) + '</span>' +
          (meta ? '<span class="fd-item__meta">' + esc(meta) + '</span>' : '') +
        '</div>' +
      '</div>';
  }
  function itemsBlock(items) {
    if (!items.length) return '<p class="fd-rest">Fri dag — ingen felles program.</p>';
    return '<div class="fd-items">' + items.map(itemRow).join('') + '</div>';
  }
  function cntLabel(n) { return n === 0 ? 'Fri' : (n + (n === 1 ? ' post' : ' poster')); }

  var pick = { week: 0, day: 0 };

  // ---- 1) Dagsvelger -----------------------------------------------------
  function renderPicker() {
    var el = document.getElementById('fadderPicker');
    if (!el) return;
    if (pick.week >= FADDER.weeks.length) pick.week = 0;
    var week = FADDER.weeks[pick.week] || FADDER.weeks[0];
    if (pick.day >= week.days.length) pick.day = 0;
    var day = week.days[pick.day] || week.days[0];

    var weekTabs = FADDER.weeks.map(function (w, i) {
      return '<button class="fd-week' + (i === pick.week ? ' is-active' : '') + '" data-week="' + i + '" type="button">' + esc(w.label) + '</button>';
    }).join('');

    var dayChips = week.days.map(function (d, i) {
      return '<button class="fd-day' + (i === pick.day ? ' is-active' : '') + (d.items.length ? '' : ' is-empty') + '" data-day="' + i + '" type="button">' +
        '<span class="fd-day__wd">' + esc(WD_SHORT[d.wd] || d.wd) + '</span>' +
        '<span class="fd-day__dt">' + esc(d.date) + '</span>' +
        '<span class="fd-day__dot" aria-hidden="true"></span>' +
      '</button>';
    }).join('');

    el.innerHTML = '' +
      '<div class="fd-weeks" role="tablist">' + weekTabs + '</div>' +
      '<div class="fd-days">' + dayChips + '</div>' +
      '<div class="fd-panel">' +
        '<div class="fd-panel__head">' +
          '<h4>' + esc(day.wd) + '</h4>' +
          '<span class="fd-panel__date">' + esc(week.label) + ' · ' + esc(day.date) + '</span>' +
        '</div>' +
        itemsBlock(day.items) +
      '</div>';

    el.querySelectorAll('.fd-week').forEach(function (b) {
      b.addEventListener('click', function () { pick.week = +b.dataset.week; pick.day = 0; renderPicker(); });
    });
    el.querySelectorAll('.fd-day').forEach(function (b) {
      b.addEventListener('click', function () { pick.day = +b.dataset.day; renderPicker(); });
    });
  }

  // ---- 2) Foldeliste -----------------------------------------------------
  function renderAccordion() {
    var el = document.getElementById('fadderAccordion');
    if (!el) return;
    var firstOpen = true;
    el.innerHTML = FADDER.weeks.map(function (w) {
      var rows = w.days.map(function (d) {
        var open = firstOpen ? ' open' : ''; firstOpen = false;
        return '' +
          '<details class="fd-acc__day"' + open + '>' +
            '<summary>' +
              '<span class="fd-acc__wd">' + esc(d.wd) + '</span>' +
              '<span class="fd-acc__dt">' + esc(d.date) + '</span>' +
              '<span class="fd-acc__cnt">' + cntLabel(d.items.length) + '</span>' +
              '<span class="fd-acc__chev" aria-hidden="true">+</span>' +
            '</summary>' +
            '<div class="fd-acc__body">' + itemsBlock(d.items) + '</div>' +
          '</details>';
      }).join('');
      return '<div class="fd-acc__week"><span class="fd-acc__wklbl">' + esc(w.label) + '</span></div>' + rows;
    }).join('');
  }

  // ---- Hjelpefunksjon: bygg oversikts-HTML (brukes av begge oversiktsvisninger) ----
  function buildOverviewHTML() {
    return '<div class="fd-ov__grid">' + FADDER.weeks.map(function (w) {
      var days = w.days.map(function (d) {
        var body = d.items.length
          ? '<div class="fd-ov__items">' + d.items.map(function (it) {
              var meta = metaStr(it);
              return '<div class="fd-ov__it">' +
                '<span class="fd-ov__t">' + esc(it.time) + '</span>' +
                '<span class="fd-ov__n">' + esc(it.title) +
                  (meta ? '<span class="fd-ov__m">' + esc(meta) + '</span>' : '') +
                '</span>' +
              '</div>';
            }).join('') + '</div>'
          : '<p class="fd-ov__rest">Fri</p>';
        return '<div class="fd-ov__day' + (d.items.length ? '' : ' is-empty') + '">' +
            '<div class="fd-ov__dh">' +
              '<span class="fd-ov__wd">' + esc(WD_SHORT[d.wd] || d.wd) + '</span>' +
              '<span class="fd-ov__dt">' + esc(d.date) + '</span>' +
            '</div>' + body +
          '</div>';
      }).join('');
      return '<div class="fd-ov__col">' +
          '<div class="fd-ov__wk">' + esc(w.label) + '</div>' + days +
        '</div>';
    }).join('') + '</div>';
  }

  // ---- 3) Helhetlig oversikt (Tweaks-layout) ----------------------------
  function renderOverview() {
    var el = document.getElementById('fadderOverview');
    if (!el) return;
    el.innerHTML = buildOverviewHTML();
  }

  // ---- 4) Full-program-panel (toggle-knapp under pickeren) --------------
  function renderFullView() {
    var el = document.getElementById('fadderFullView');
    if (!el) return;
    el.innerHTML = buildOverviewHTML();
  }

  function initFullBtn() {
    var btn   = document.getElementById('fadderFullBtn');
    var panel = document.getElementById('fadderFullView');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      var open = panel.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      var lbl = btn.querySelector('.fd-btn__lbl');
      var arr = btn.querySelector('.arr');
      if (lbl) lbl.textContent = open ? 'Skjul fullstendig program' : 'Vis fullstendig program';
      if (arr) arr.textContent = open ? '↑' : '↓';
      if (open && window.apeironRescanReveals) window.apeironRescanReveals();
    });
  }

  function render() {
    var datesEl = document.getElementById('fadderDates');
    if (datesEl) datesEl.textContent = FADDER.dates;
    var noteEl = document.getElementById('fadderPlaceholder');
    if (noteEl) noteEl.style.display = IS_LIVE ? 'none' : '';
    renderPicker();
    renderAccordion();
    renderOverview();
    renderFullView();
    if (window.apeironRescanReveals) window.apeironRescanReveals();
  }

  function setLayout(layout) {
    var stage = document.querySelector('.fadder__stage');
    if (!stage) return;
    if (['picker', 'accordion', 'overview'].indexOf(layout) < 0) layout = 'picker';
    stage.setAttribute('data-fadder-layout', layout);
  }
  window.apeironSetFadderLayout = setLayout;

  function showCalPopup(btn, calId) {
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
    btn.parentNode.style.position = 'relative';
    btn.parentNode.appendChild(popup);
    function onOutside(e) {
      if (!popup.contains(e.target) && e.target !== btn) {
        popup.parentNode && popup.parentNode.removeChild(popup);
        document.removeEventListener('click', onOutside);
      }
    }
    setTimeout(function () { document.addEventListener('click', onOutside); }, 10);
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

  function init() {
    load();
    initFullBtn();
    var subBtn = document.getElementById('fadderAddAll');
    if (subBtn) {
      subBtn.addEventListener('click', function (ev) {
        ev.preventDefault();
        showCalPopup(subBtn, CONFIG.calendarId);
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
