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
