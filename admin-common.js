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
    location.reload();
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
  function setupAuth(onUnlock) {
    var gate    = document.getElementById('gate');
    var adminEl = document.getElementById('admin');
    var pwInput = document.getElementById('pw-input');
    var pwErr   = document.getElementById('pw-err');
    var pwBtn   = document.getElementById('pw-btn');

    // defer: kjør onUnlock på neste «tick». Viktig på auto-innlogging — da kalles
    // setupAuth() før vertsskriptet har initialisert sine let/const-variabler
    // (f.eks. «products»/«data»). Utsettelsen lar skriptet bli ferdig først.
    function unlock(defer) {
      if (gate) gate.style.display = 'none';
      if (adminEl) adminEl.classList.add('on');
      injectLogout(adminEl);
      if (typeof onUnlock === 'function') {
        if (defer) setTimeout(onUnlock, 0); else onUnlock();
      }
    }

    function login(pw) {
      if (pw === PASSWORD) {
        try { localStorage.setItem(AUTH_KEY, '1'); } catch (_) {}
        unlock(false);
      } else if (pwErr) {
        pwErr.textContent = 'Feil passord — prøv igjen';
        if (pwInput) { pwInput.value = ''; pwInput.focus(); }
      }
    }

    if (isAuthed()) {
      unlock(true);
    } else {
      if (pwBtn)   pwBtn.addEventListener('click', function () { login(pwInput ? pwInput.value : ''); });
      if (pwInput) pwInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') login(pwInput.value); });
    }
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
  function saveFile(filename, content) {
    if (!window.showSaveFilePicker || !window.indexedDB) {
      downloadBlob(filename, content);
      return Promise.resolve('download');
    }
    var KEY = 'file:' + filename;
    function pick() {
      return window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: 'JavaScript', accept: { 'text/javascript': ['.js'] } }]
      }).then(function (h) { return idbSet(KEY, h).then(function () { return h; }); });
    }
    return idbGet(KEY).then(function (handle) {
      if (!handle) return pick();
      return verifyPermission(handle).then(function (ok) { return ok ? handle : pick(); });
    }).then(function (handle) {
      return handle.createWritable()
        .then(function (w) { return w.write(content).then(function () { return w.close(); }); })
        .then(function () { return 'direct'; });
    }).catch(function (e) {
      if (e && e.name === 'AbortError') return 'cancel';
      downloadBlob(filename, content);
      return 'download';
    });
  }

  window.AdminCommon = {
    PASSWORD: PASSWORD,
    setupAuth: setupAuth,
    logout: logout,
    toast: toast,
    help: makeHelp,
    enhanceHelp: enhanceHelp,
    saveFile: saveFile,
    downloadBlob: downloadBlob
  };
})();
