/* ============================================================
   admin-common.js — delt logikk for alle admin-paneler
   (merch-admin, styret-admin, begrep-admin, hjelp-admin, …)

   Tilbyr:
     AdminCommon.setupAuth(onUnlock)  — passord-gate + delt innlogging
     AdminCommon.logout()             — logg ut og last siden på nytt
     AdminCommon.toast(msg)           — «Lagret i nettleseren»-varsel
     AdminCommon.help(text)           — lag en «?»-hjelpeboble
     AdminCommon.enhanceHelp(root)    — gjør om alle [data-help] til «?»-bobler

   Forventet markup på hver admin-side:
     #gate (#pw-input, #pw-btn, #pw-err), #admin (.a-header), #toast
   ============================================================ */
(function () {
  'use strict';

  var PASSWORD = 'apeiron2026';        // ← endre admin-passordet her (gjelder alle paneler)
  var AUTH_KEY = 'apeiron-admin-auth'; // delt nøkkel: innlogging gjelder ALLE admin-sider

  // Les auth fra både local- og sessionStorage (bakoverkompatibelt).
  function isAuthed() {
    try {
      return localStorage.getItem(AUTH_KEY) === '1' ||
             sessionStorage.getItem(AUTH_KEY) === '1';
    } catch (_) { return false; }
  }

  function logout() {
    try { localStorage.removeItem(AUTH_KEY); sessionStorage.removeItem(AUTH_KEY); } catch (_) {}
    // Naviger til den offentlige siden i stedet for å laste admin-siden på nytt
    // (ellers blir man stående fast på passord-gaten uten vei tilbake).
    // «begrep-admin.html» → «begrep.html»; faller tilbake til forsiden.
    var file = (location.pathname.split('/').pop() || '');
    var dest = /-admin\.html$/.test(file) ? file.replace(/-admin\.html$/, '.html') : 'index.html';
    location.href = dest;
  }

  // Legg til en «Logg ut»-knapp i admin-headeren (én gang).
  function injectLogout(adminEl) {
    var header = adminEl && adminEl.querySelector('.a-header');
    if (!header || header.querySelector('.btn-logout')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn-logout';
    b.textContent = 'Logg ut';
    b.addEventListener('click', logout);
    header.appendChild(b);
  }

  /* ─── AUTH ───
     Bruker localStorage slik at innlogging på ett admin-panel gjelder alle de
     andre i samme nettleser (også i nye faner). Fikser bugen der man måtte logge
     inn på nytt for hver admin-side. */
  /* ─── AUTH (fjernet) ───
     Passordet er fjernet — admin-panelene er åpne. Endringer må uansett
     eksporteres og committes til GitHub for å bli synlige på nettsiden, så
     dette er ingen reell sikkerhetssvekkelse; det fjerner bare et friksjonssteg.
     setupAuth(onUnlock) viser nå panelet med en gang og kaller onUnlock. */
  function setupAuth(onUnlock) {
    var gate    = document.getElementById('gate');
    var adminEl = document.getElementById('admin');
    if (gate) gate.style.display = 'none';
    if (adminEl) adminEl.classList.add('on');
    if (typeof onUnlock === 'function') setTimeout(onUnlock, 0);
  }

  /* ─── DRA-OG-SLIPP SORTERING ───
     enableDragSort(container, { itemSelector, handleSelector, idAttr, onReorder })
     Gjør kortene i en liste sorterbare ved å dra i et håndtak. Fungerer med mus
     og touch (pointer events). Lytteren ligger på containeren, så den overlever
     full re-render av kortene. onReorder(idArray) kalles ved slipp, med ny
     rekkefølge av data-id-verdiene.

     Det dratte kortet «løftes» (position:fixed) og følger pekeren, en plassholder
     viser hvor det vil lande, og siden auto-scroller når man drar mot topp/bunn.
     En liten terskel skiller et vanlig klikk fra et dra. */
  function enableDragSort(container, opts) {
    if (!container || container._dragSortOn) return;
    container._dragSortOn = true;
    var itemSel   = opts.itemSelector;
    var handleSel = opts.handleSelector;
    var idAttr    = opts.idAttr || 'data-id';
    var onReorder = opts.onReorder || function () {};
    var THRESH = 4;     // px før et klikk regnes som dra
    var EDGE   = 64;    // px-sone øverst/nederst som auto-scroller
    var MAXSPD = 20;    // maks scroll-fart pr. frame

    container.addEventListener('pointerdown', function (e) {
      if (e.button != null && e.button !== 0) return;
      var handle = e.target.closest && e.target.closest(handleSel);
      if (!handle || !container.contains(handle)) return;
      var dragEl = handle.closest(itemSel);
      if (!dragEl) return;

      var startX = e.clientX, startY = e.clientY;
      var dragging = false, ph = null, offX = 0, offY = 0, lastY = startY, raf = null;

      // Plasser plassholderen ut fra pekerens y-posisjon (ekskluderer dratt kort/ph).
      function positionPlaceholder(y) {
        var items = container.querySelectorAll(itemSel);
        var before = null;
        for (var i = 0; i < items.length; i++) {
          if (items[i] === dragEl) continue;
          var r = items[i].getBoundingClientRect();
          if (y < r.top + r.height / 2) { before = items[i]; break; }
        }
        if (before) container.insertBefore(ph, before);
        else container.appendChild(ph);
      }

      function begin() {
        dragging = true;
        var r = dragEl.getBoundingClientRect();
        offX = startX - r.left; offY = startY - r.top;
        ph = document.createElement('div');
        ph.className = 'drag-placeholder';
        ph.style.height = r.height + 'px';
        dragEl.parentNode.insertBefore(ph, dragEl.nextSibling);
        dragEl.classList.add('drag-active');
        dragEl.style.position = 'fixed';
        dragEl.style.zIndex = '9999';
        dragEl.style.width = r.width + 'px';
        dragEl.style.height = r.height + 'px';
        dragEl.style.left = r.left + 'px';
        dragEl.style.top = r.top + 'px';
        dragEl.style.margin = '0';
        dragEl.style.pointerEvents = 'none';
        dragEl.style.boxSizing = 'border-box';
        try { handle.setPointerCapture(e.pointerId); } catch (_) {}
        autoScroll();
      }

      function autoScroll() {
        raf = requestAnimationFrame(autoScroll);
        var vh = window.innerHeight, spd = 0;
        if (lastY < EDGE) spd = -Math.ceil((EDGE - lastY) / EDGE * MAXSPD);
        else if (lastY > vh - EDGE) spd = Math.ceil((lastY - (vh - EDGE)) / EDGE * MAXSPD);
        if (spd) { window.scrollBy(0, spd); positionPlaceholder(lastY); }
      }

      function onMove(ev) {
        if (!dragging) {
          if (Math.abs(ev.clientX - startX) < THRESH && Math.abs(ev.clientY - startY) < THRESH) return;
          begin();
        }
        lastY = ev.clientY;
        dragEl.style.left = (ev.clientX - offX) + 'px';
        dragEl.style.top = (ev.clientY - offY) + 'px';
        positionPlaceholder(ev.clientY);
      }

      function end() {
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', end);
        handle.removeEventListener('pointercancel', end);
        try { handle.releasePointerCapture(e.pointerId); } catch (_) {}
        if (raf) cancelAnimationFrame(raf);
        if (dragging) {
          if (ph && ph.parentNode) container.insertBefore(dragEl, ph);
          if (ph && ph.parentNode) ph.parentNode.removeChild(ph);
          dragEl.classList.remove('drag-active');
          ['position', 'zIndex', 'width', 'height', 'left', 'top', 'margin', 'pointerEvents', 'boxSizing']
            .forEach(function (p) { dragEl.style[p] = ''; });
          var ids = Array.prototype.map.call(container.querySelectorAll(itemSel), function (el) {
            return el.getAttribute(idAttr);
          });
          onReorder(ids);
        }
        dragEl = null;
      }

      e.preventDefault();
      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', end);
      handle.addEventListener('pointercancel', end);
    });
  }

  /* ─── TOAST ─── */
  function toast(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._toastTimer);
    el._toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }

  /* ─── HJELPETEKST ───
     «?»-ikon som viser en forklaring ved hover/fokus. */
  function makeHelp(text) {
    var s = document.createElement('span');
    s.className = 'help-tip';
    s.tabIndex = 0;
    s.setAttribute('role', 'note');
    s.setAttribute('aria-label', 'Hjelp: ' + text);
    s.textContent = '?';
    var bubble = document.createElement('span');
    bubble.className = 'help-tip__bubble';
    bubble.textContent = text;
    s.appendChild(bubble);
    return s;
  }

  // Gjør om alle elementer med data-help="forklaring" til en label med «?»-boble.
  function enhanceHelp(root) {
    var scope = root || document;
    Array.prototype.forEach.call(scope.querySelectorAll('[data-help]'), function (el) {
      if (el.querySelector('.help-tip')) return;
      el.appendChild(makeHelp(el.getAttribute('data-help')));
    });
  }

  /* ─── FILLAGRING ───
     saveFile(filnavn, innhold) skriver innholdet til fil. Når File System Access
     API er tilgjengelig (krever http(s) eller localhost — IKKE file://), kan man
     velge repo-fila én gang og deretter lagre rett til den ved hvert eksport.
     Filhåndtaket huskes i IndexedDB på tvers av reload. Ellers: vanlig nedlasting.
     Returnerer en Promise<'direct' | 'download' | 'cancel'>. */
  var DB_NAME = 'apeiron-admin', STORE = 'handles';

  function idb() {
    return new Promise(function (res, rej) {
      var r = indexedDB.open(DB_NAME, 1);
      r.onupgradeneeded = function () { r.result.createObjectStore(STORE); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
  }
  function idbGet(key) {
    return idb().then(function (db) {
      return new Promise(function (res, rej) {
        var t = db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
        t.onsuccess = function () { res(t.result); };
        t.onerror = function () { rej(t.error); };
      });
    });
  }
  function idbSet(key, val) {
    return idb().then(function (db) {
      return new Promise(function (res, rej) {
        var t = db.transaction(STORE, 'readwrite').objectStore(STORE).put(val, key);
        t.onsuccess = function () { res(); };
        t.onerror = function () { rej(t.error); };
      });
    });
  }
  function verifyPermission(handle) {
    var opts = { mode: 'readwrite' };
    return handle.queryPermission(opts).then(function (p) {
      if (p === 'granted') return true;
      return handle.requestPermission(opts).then(function (p2) { return p2 === 'granted'; });
    });
  }
  function downloadBlob(filename, content) {
    var blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  // Vanlig nedlasting — én fil, én dialog, hver gang. Vi brukte tidligere File
  // System Access («lagre rett til fila»), men den feiler på enkelte systemer
  // (bl.a. Linux) og ga DA to dialoger: filvelger + nedlasting. Vanlig
  // nedlasting er forutsigbart og likt de andre admin-panelene.
  function saveFile(filename, content) {
    downloadBlob(filename, content);
    return Promise.resolve('download');
  }

  /* ─── DELT DATALAGER (for C-moduler) ───
     createStore(lsKey, freshFn) gir et lite datalager som alle admin-moduler
     deler oppførsel gjennom: utkast lagres automatisk i localStorage, og kan
     tilbakestilles til den publiserte versjonen (freshFn() leser fra repo-globalen).
       store.data       — det redigerbare objektet (les/skriv fritt)
       store.save()      — lagre nå + «Lagret»-varsel
       store.lazySave()  — lagre etter en kort pause (for input-felt)
       store.reset()     — forkast utkast, last publisert versjon på nytt */
  function createStore(lsKey, freshFn) {
    var store = { data: null, key: lsKey };
    function load() {
      try { var raw = localStorage.getItem(lsKey); if (raw) { store.data = JSON.parse(raw); return; } } catch (_) {}
      store.data = freshFn();
    }
    load();
    var t = null;
    store.save = function () {
      try { localStorage.setItem(lsKey, JSON.stringify(store.data)); } catch (_) {}
      toast('Lagret i nettleseren');
    };
    store.lazySave = function () { clearTimeout(t); t = setTimeout(store.save, 350); };
    store.reset = function () { try { localStorage.removeItem(lsKey); } catch (_) {} load(); };
    return store;
  }

  /* ─── EFFEKTIV DATA (for søkeindeks-bygging) ───
     readDraftOr(lsKey, globalName) gir den dataen som FAKTISK gjelder for et
     område akkurat nå: localStorage-utkastet hvis det finnes, ellers den
     publiserte repo-globalen (window[globalName]). Brukes av modulenes
     searchEntries() så indeksen reflekterer både upubliserte utkast og
     publisert innhold. Returnerer {} hvis ingenting finnes. */
  function readDraftOr(lsKey, globalName) {
    try { var raw = localStorage.getItem(lsKey); if (raw != null) { var v = JSON.parse(raw); if (v != null) return v; } } catch (_) {}
    try { return window[globalName] != null ? window[globalName] : {}; } catch (_) { return {}; }
  }

  /* ─── FORHÅNDSVISNING: enhetsmodus (desktop/mobil) ───
     getPreviewWidth() gir innholdsbredden modulenes fit-funksjoner skalerer mot:
     desktop = 1180, mobil = 390. Skallet bytter modus og kaller resize. */
  var PV_DEVICE_KEY = 'apeiron-admin-preview-device';
  function previewDevice() {
    try { return localStorage.getItem(PV_DEVICE_KEY) === 'mobile' ? 'mobile' : 'desktop'; } catch (_) { return 'desktop'; }
  }
  function setPreviewDevice(m) {
    try { localStorage.setItem(PV_DEVICE_KEY, m === 'mobile' ? 'mobile' : 'desktop'); } catch (_) {}
  }
  function getPreviewWidth() { return previewDevice() === 'mobile' ? 390 : 1180; }

  /* ─── SIDE/SEKSJON-VELGER (delt 📍) + LENKEVALIDERING + BILDEADVARSEL ───
     PAGE_SECTIONS speiler nettstedets sider og seksjoner. attachLocPicker(btn,input)
     gir feltet en velger; validateHref() flagger lenker til ukjente sider/ankere;
     checkImageSize() varsler om altfor store base64-bilder. */
  var PAGE_SECTIONS = [
    { file: 'index.html', name: 'Forsiden', sections: [{ anchor: 'arrangementer', name: 'Arrangementer' }, { anchor: 'oppslagstavla-teaser', name: 'Oppslagstavla' }, { anchor: 'aporetisk', name: 'Aporetisk Aften' }, { anchor: 'fadderuke', name: 'Fadderuke' }, { anchor: 'bli-medlem', name: 'Bli medlem' }, { anchor: 'kontakt', name: 'Kontakt' }] },
    { file: 'om-oss.html', name: 'Om oss', sections: [{ anchor: 'om', name: 'Om oss' }, { anchor: 'samarbeid', name: 'Fellesskap & samarbeid' }, { anchor: 'lesesalen', name: 'Lesesalen' }, { anchor: 'mot-styret', name: 'Møt styret' }, { anchor: 'bli-medlem', name: 'Bli medlem' }, { anchor: 'faq', name: 'Ofte stilte spørsmål' }] },
    { file: 'styret.html', name: 'Styret', sections: [{ anchor: 'styremedlemmer', name: 'Styremedlemmer' }, { anchor: 'tillitsvalgte', name: 'Tillitsvalgte' }, { anchor: 'sak', name: 'S.A.K' }, { anchor: 'vervene', name: 'Om vervene' }] },
    { file: 'begrep.html', name: 'Begrep', sections: [{ anchor: 'om', name: 'Om Begrep' }, { anchor: 'utgavene', name: 'Tidsskriftet' }, { anchor: 'podkast', name: 'Podkasten' }, { anchor: 'film', name: 'Filmproduksjon' }, { anchor: 'julekalender', name: 'Hilbert Hotell' }, { anchor: 'kontakt', name: 'Bidra & kontakt' }] },
    { file: 'hjelp.html', name: 'Hjelp & støtte', sections: [{ anchor: 'sifra', name: 'Si fra' }, { anchor: 'studier', name: 'Faglig hjelp' }, { anchor: 'helse', name: 'Psykisk helse' }, { anchor: 'fysisk', name: 'Fysisk helse' }, { anchor: 'akutt', name: 'Akutt hjelp' }] },
    { file: 'galleri.html', name: 'Galleri', sections: [{ anchor: 'galleri', name: 'Bildegalleri' }] },
    { file: 'pensum.html', name: 'Pensum', sections: [] },
    { file: 'merch.html', name: 'Merch', sections: [{ anchor: 'butikk', name: 'Produkter' }] },
    { file: 'nyheter.html', name: 'Nyheter', sections: [] },
    { file: 'oppslagstavla.html', name: 'Oppslagstavla', sections: [] },
    { file: 'oppnaelser.html', name: 'Oppnåelser', sections: [] },
    { file: 'utmerkelser.html', name: 'Utmerkelser', sections: [] },
    { file: 'marked.html', name: 'Kjøp & bytte', sections: [] }
  ];

  function validateHref(href) {
    href = String(href == null ? '' : href).trim();
    if (!href) return { level: 'ok', msg: '' };
    if (/^(https?:|mailto:|tel:)/i.test(href)) return { level: 'ok', msg: '' };
    if (href.charAt(0) === '#') return { level: 'ok', msg: '' };
    var m = href.match(/^([^#?]+)(?:#(.+))?$/);
    var file = m ? m[1] : href;
    var anchor = m && m[2] ? m[2] : '';
    var page = null;
    for (var i = 0; i < PAGE_SECTIONS.length; i++) if (PAGE_SECTIONS[i].file === file) { page = PAGE_SECTIONS[i]; break; }
    if (!page) return { level: 'warn', msg: 'Ukjent side «' + file + '»' };
    if (anchor && !page.sections.some(function (s) { return s.anchor === anchor; }))
      return { level: 'warn', msg: 'Fant ikke seksjonen #' + anchor };
    return { level: 'ok', msg: '' };
  }

  var _lp = null;
  function lpBuild() {
    if (_lp) return _lp;
    var pop = document.createElement('div');
    pop.className = 'locpop'; pop.style.display = 'none';
    pop.innerHTML =
      '<div class="locpop__head"><span class="ttl">Velg side eller seksjon</span></div>'
      + '<div class="locpop__search"><input type="text" placeholder="Søk side eller seksjon…" aria-label="Søk"></div>'
      + '<div class="locpop__list"></div>';
    document.body.appendChild(pop);
    var searchEl = pop.querySelector('.locpop__search input');
    function render(query) {
      var list = pop.querySelector('.locpop__list');
      var cur = pop._target ? pop._target.value.trim() : '';
      query = (query || '').toLowerCase().trim();
      var html = '', any = false;
      PAGE_SECTIONS.forEach(function (p) {
        var pageMatch = p.name.toLowerCase().indexOf(query) >= 0 || p.file.toLowerCase().indexOf(query) >= 0;
        var secs = p.sections.filter(function (s) { return pageMatch || s.name.toLowerCase().indexOf(query) >= 0 || ('#' + s.anchor).indexOf(query) >= 0; });
        if (!pageMatch && !secs.length) return;
        any = true;
        html += '<div class="locpop__pg"><button type="button" data-href="' + esc(p.file) + '">' + esc(p.name) + '</button><span class="file">' + esc(p.file) + '</span></div>';
        secs.forEach(function (s) { var href = p.file + '#' + s.anchor; html += '<button type="button" class="locpop__sec' + (href === cur ? ' cur' : '') + '" data-href="' + esc(href) + '">' + esc(s.name) + ' <span class="anch">#' + esc(s.anchor) + '</span></button>'; });
      });
      if (!any) html = '<div class="locpop__empty">Ingen treff på «' + esc(query) + '»</div>';
      list.innerHTML = html;
      list.querySelectorAll('[data-href]').forEach(function (b) { b.addEventListener('click', function () { choose(b.getAttribute('data-href')); }); });
    }
    function choose(href) { var input = pop._target; if (input) { input.value = href; input.dispatchEvent(new Event('input', { bubbles: true })); } close(); }
    function close() { pop.style.display = 'none'; }
    function position(input) {
      if (!input) return;
      var r = input.getBoundingClientRect();
      var pw = pop.offsetWidth || 344, ph = pop.offsetHeight || 360;
      var left = r.left; if (left + pw > window.innerWidth - 8) left = window.innerWidth - 8 - pw; if (left < 8) left = 8;
      var top = r.bottom + 6; if (top + ph > window.innerHeight - 8) { top = r.top - 6 - ph; if (top < 8) top = 8; }
      pop.style.left = left + 'px'; pop.style.top = top + 'px';
    }
    searchEl.addEventListener('input', function () { render(searchEl.value); position(pop._target); });
    searchEl.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Enter') { e.preventDefault(); var first = pop.querySelector('.locpop__list [data-href]'); if (first) choose(first.getAttribute('data-href')); }
    });
    document.addEventListener('click', function (e) {
      if (pop.style.display === 'none') return;
      if (pop.contains(e.target) || (e.target.closest && e.target.closest('.btn-loc'))) return;
      close();
    });
    window.addEventListener('resize', function () { if (pop.style.display !== 'none') position(pop._target); });
    _lp = {
      open: function (input) {
        if (pop.style.display !== 'none' && pop._target === input) { close(); return; }
        pop._target = input; searchEl.value = ''; render(''); pop.style.display = 'flex'; position(input);
        setTimeout(function () { searchEl.focus(); }, 0);
      }
    };
    return _lp;
  }
  function attachLocPicker(button, input) {
    if (!button || !input) return;
    button.addEventListener('click', function (e) { e.preventDefault(); lpBuild().open(input); });
  }

  // Koble et adressefelt til 📍-velger + live-validering. scope = element som
  // inneholder [data-f="href"] (eller annet via opts.sel), .btn-loc og .lnk-warn.
  function wireHrefField(scope, opts) {
    opts = opts || {};
    var input = scope.querySelector(opts.sel || '[data-f="href"]');
    if (!input) return;
    var btn = scope.querySelector('.btn-loc');
    var warnEl = scope.querySelector('.lnk-warn');
    if (btn) attachLocPicker(btn, input);
    function check() {
      if (!warnEl) return;
      var r = validateHref(input.value);
      if (r.level === 'warn') { warnEl.textContent = '⚠ ' + r.msg; warnEl.classList.add('show'); }
      else { warnEl.textContent = ''; warnEl.classList.remove('show'); }
    }
    input.addEventListener('input', check);
    check();
  }

  function checkImageSize(dataUrl, label) {
    try {
      if (typeof dataUrl !== 'string' || dataUrl.indexOf('data:') !== 0) return;
      var kb = Math.round(dataUrl.length * 0.75 / 1024);
      if (kb >= 500) toast('⚠ Stort bilde (~' + (kb >= 1024 ? (Math.round(kb / 102.4) / 10) + ' MB' : kb + ' kB') + (label ? ', ' + label : '') + ') — beskjær/forminsk gjerne før publisering');
    } catch (_) {}
  }

  /* ─── ESCAPE ─── */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  window.AdminCommon = {
    PASSWORD: PASSWORD,
    setupAuth: setupAuth,
    logout: logout,
    toast: toast,
    help: makeHelp,
    enhanceHelp: enhanceHelp,
    saveFile: saveFile,
    downloadBlob: downloadBlob,
    enableDragSort: enableDragSort,
    createStore: createStore,
    readDraftOr: readDraftOr,
    previewDevice: previewDevice,
    setPreviewDevice: setPreviewDevice,
    getPreviewWidth: getPreviewWidth,
    pageSections: PAGE_SECTIONS,
    validateHref: validateHref,
    attachLocPicker: attachLocPicker,
    wireHrefField: wireHrefField,
    checkImageSize: checkImageSize,
    esc: esc
  };

  /* ─── PANEL-REGISTER (for C: skall + moduler) ───
     Hver admin-modul registrerer seg med AdminPanels.define(id, def). Skallet
     (admin.html) bygger menyen og mounter modulen i en beholder. Slik samler vi
     alle editorene i ett skall uten å duplisere ramme/innlogging/eksport. */
  window.AdminPanels = window.AdminPanels || {
    _defs: {},
    define: function (id, def) { this._defs[id] = def; },
    get: function (id) { return this._defs[id]; }
  };
})();
