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
    // Naviger til den offentlige forsiden i stedet for å laste admin på nytt
    // (ellers blir man stående fast på passord-gaten uten vei tilbake).
    location.href = 'index.html';
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
        document.body.style.userSelect = 'none';
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
        if (ev.pointerId !== e.pointerId) return;
        if (!dragging) {
          if (Math.abs(ev.clientX - startX) < THRESH && Math.abs(ev.clientY - startY) < THRESH) return;
          begin();
        }
        if (ev.cancelable) ev.preventDefault();
        lastY = ev.clientY;
        dragEl.style.left = (ev.clientX - offX) + 'px';
        dragEl.style.top = (ev.clientY - offY) + 'px';
        positionPlaceholder(ev.clientY);
      }

      function end(ev) {
        if (ev && ev.pointerId != null && ev.pointerId !== e.pointerId) return;
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', end);
        document.removeEventListener('pointercancel', end);
        document.body.style.userSelect = '';
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
      // Lytterne ligger på document (ikke handle): da overlever de at det dratte
      // kortet får position:fixed + pointer-events:none, som tidligere fikk
      // peker-fangsten til å slippe og «frøs» dra-operasjonen. pointerId-filteret
      // gjør at bare den aktive pekeren styrer draget.
      document.addEventListener('pointermove', onMove, { passive: false });
      document.addEventListener('pointerup', end);
      document.addEventListener('pointercancel', end);
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

  /* ─── VISNINGSVELGER (kolonne-layout for kortlister) ───
     Setter inn en «Visning»-linje (1/2/3 i bredden) rett over en kortliste.
     Valget huskes per nøkkel i localStorage og legges på lista som
     .lay-cols-1/2/3 (stiler i admin-modules.css). Generisk — flere paneler
     bruker den så de utnytter bredden på samme måte som Styret. */
  function viewSwitch(opts) {
    opts = opts || {};
    var list = opts.list;
    if (!list) return null;
    var key = opts.key;
    var modes = opts.modes || [
      { id: 'cols-1', n: 1, label: '1 i bredden', title: 'Ett kort per rad' },
      { id: 'cols-2', n: 2, label: '2 i bredden', title: 'To kort i bredden' },
      { id: 'cols-3', n: 3, label: '3 i bredden', title: 'Tre kort i bredden' }
    ];
    var cur = opts.def || 'cols-2';
    try { var sv = key && localStorage.getItem(key); if (sv && modes.some(function (m) { return m.id === sv; })) cur = sv; } catch (_) {}

    var wrap = document.createElement('div');
    wrap.className = 'lay-switch';
    var lbl = document.createElement('span');
    lbl.className = 'lay-switch__lbl';
    lbl.textContent = 'Visning';
    lbl.setAttribute('data-help', opts.help || 'Velg hvordan kortene vises mens du redigerer her i admin. Påvirker bare denne redigeringsvisningen — ikke den publiserte siden.');
    wrap.appendChild(lbl);
    var btnWrap = document.createElement('div');
    btnWrap.className = 'lay-switch__btns';
    modes.forEach(function (m) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('data-lay', m.id); b.title = m.title || m.label;
      var ic = document.createElement('span');
      ic.className = 'lay-ic';
      ic.style.gridTemplateColumns = 'repeat(' + (m.n || 1) + ',1fr)';
      for (var i = 0; i < (m.n || 1); i++) ic.appendChild(document.createElement('i'));
      b.appendChild(ic);
      b.appendChild(document.createTextNode(m.label));
      b.addEventListener('click', function () { setMode(m.id); });
      btnWrap.appendChild(b);
    });
    wrap.appendChild(btnWrap);

    function apply() {
      modes.forEach(function (m) { list.classList.remove('lay-' + m.id); });
      list.classList.add('lay-' + cur);
      Array.prototype.forEach.call(btnWrap.querySelectorAll('[data-lay]'), function (b) {
        b.classList.toggle('active', b.getAttribute('data-lay') === cur);
      });
    }
    function setMode(id) {
      if (id === cur) return;
      cur = id;
      try { if (key) localStorage.setItem(key, id); } catch (_) {}
      apply();
      if (typeof opts.onChange === 'function') opts.onChange(id);
    }
    apply();
    if (list.parentNode) list.parentNode.insertBefore(wrap, list);
    enhanceHelp(wrap);
    return wrap;
  }

  /* ─── BILDEFELT (delt) ───
     Gir et bildefelt nøyaktig som i Styret: bildet vises i en .img-zone med en
     verktøylinje UNDER bildet (✎ last opp/rediger · ✕ fjern). Opplasting og
     redigering går gjennom AdminImageEditor (flytt/zoom/roter/speil/beskjær).
     Brukt av oppslag, oppnåelser, utmerkelser, begrep og merch. */
  var _imgPickInput = null;
  function imgPick(cb) {
    if (!_imgPickInput) {
      _imgPickInput = document.createElement('input');
      _imgPickInput.type = 'file';
      _imgPickInput.accept = 'image/png,image/jpeg,image/webp,image/avif';
      _imgPickInput.style.display = 'none';
      document.body.appendChild(_imgPickInput);
    }
    var inp = _imgPickInput;
    inp.onchange = function () {
      var f = inp.files && inp.files[0]; inp.value = '';
      if (!f) return;
      var r = new FileReader();
      r.onload = function (e) { cb(e.target.result); };
      r.readAsDataURL(f);
    };
    inp.click();
  }

  // markup for et bildefelt: .img-col > .img-zone + .img-bar (✎ ✕)
  function imgFieldHtml(zoneClass, phText) {
    return '<div class="img-col">'
      + '<div class="img-zone' + (zoneClass ? ' ' + zoneClass : '') + '">'
        + '<div class="img-ph"><img src="assets/apeiron-logo.png" alt=""><span>' + (phText || 'Klikk eller dra inn bilde') + '</span></div>'
        + '<div class="img-overlay">\uD83D\uDCF7 Last opp</div>'
      + '</div>'
      + '<div class="img-bar">'
        + '<button class="ibtn btn-edit-img" type="button" title="Last opp / rediger bilde">\u270E</button>'
        + '<button class="ibtn btn-clr-img" type="button" title="Fjern bilde">\u2715</button>'
      + '</div>'
    + '</div>';
  }

  // wireImageField({ zone, get, set, aspect, aspects, outSize, quality, round, title, afterChange })
  function wireImageField(opts) {
    var zone = opts.zone; if (!zone) return;
    var col = zone.closest('.img-col') || zone;
    var editBtn = col.querySelector('.btn-edit-img');
    var clrBtn = col.querySelector('.btn-clr-img');
    var aspect = opts.aspect || 1;
    function refresh(url) {
      var preview = zone.querySelector('.img-preview');
      var ph = zone.querySelector('.img-ph');
      var overlay = zone.querySelector('.img-overlay');
      if (editBtn) editBtn.style.display = 'flex';
      if (url) {
        if (!preview) { preview = document.createElement('img'); preview.className = 'img-preview'; preview.alt = ''; zone.appendChild(preview); }
        preview.onerror = function () { preview.style.display = 'none'; if (ph) ph.style.display = 'flex'; if (overlay) overlay.textContent = '\u26A0 Bilde mangler'; };
        preview.style.display = 'block'; preview.src = url;
        if (ph) ph.style.display = 'none';
        if (clrBtn) clrBtn.style.display = 'flex';
        if (overlay) overlay.textContent = '\u270E Rediger / bytt';
      } else {
        if (preview) { preview.onerror = null; preview.style.display = 'none'; preview.removeAttribute('src'); }
        if (ph) ph.style.display = 'flex';
        if (clrBtn) clrBtn.style.display = 'none';
        if (overlay) overlay.textContent = '\uD83D\uDCF7 Last opp';
      }
    }
    function openEd(src) {
      if (!window.AdminImageEditor) { alert('Bilderedigereren er ikke lastet.'); return; }
      window.AdminImageEditor.open({
        src: src, aspect: aspect, aspects: opts.aspects, outSize: opts.outSize || 1000, quality: opts.quality || 0.86,
        round: !!opts.round, title: opts.title || 'Rediger bilde', applyLabel: 'Bruk bilde',
        onApply: function (url) { var prev = (opts.get && opts.get()) || null; opts.set(url); refresh(url); checkImageSize(url); if (opts.afterChange) opts.afterChange(url); undoable('Bilde endret', function () { opts.set(prev); refresh(prev || ''); if (opts.afterChange) opts.afterChange(prev); }); },
        onError: function () { try { toast('Det gamle bildet kunne ikke lastes — velg et nytt.'); } catch (_) {} imgPick(openEd); }
      });
    }
    function editOrPick() { var cur = opts.get && opts.get(); if (cur) openEd(cur); else imgPick(openEd); }
    zone.addEventListener('click', function (e) { if (e.target.closest('.img-bar')) return; editOrPick(); });
    zone.addEventListener('dragenter', function (e) { e.preventDefault(); zone.setAttribute('data-over', ''); });
    zone.addEventListener('dragover', function (e) { e.preventDefault(); });
    zone.addEventListener('dragleave', function () { zone.removeAttribute('data-over'); });
    zone.addEventListener('drop', function (e) { e.preventDefault(); zone.removeAttribute('data-over'); var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) { var r = new FileReader(); r.onload = function (ev) { openEd(ev.target.result); }; r.readAsDataURL(f); } });
    if (editBtn) editBtn.addEventListener('click', function (e) { e.stopPropagation(); editOrPick(); });
    if (clrBtn) clrBtn.addEventListener('click', function (e) { e.stopPropagation(); var prev = (opts.get && opts.get()) || null; opts.set(null); refresh(null); if (opts.afterChange) opts.afterChange(null); if (prev) undoable('Bilde fjernet', function () { opts.set(prev); refresh(prev); if (opts.afterChange) opts.afterChange(prev); }); });
    refresh((opts.get && opts.get()) || '');
  }

  /* ─── FILLAGRING ───
     saveFile(filnavn, innhold) skriver innholdet til fil. Når File System Access
     API er tilgjengelig (krever http(s) eller localhost — IKKE file://), kan man
     velge repo-fila én gang og deretter lagre rett til den ved hvert eksport.
     Filhåndtaket huskes i IndexedDB på tvers av reload. Ellers: vanlig nedlasting.
     Returnerer en Promise<'direct' | 'download' | 'cancel'>. */
  var DB_NAME = 'apeiron-admin', STORE = 'handles', IMG_STORE = 'images';

  function idb() {
    return new Promise(function (res, rej) {
      var r = indexedDB.open(DB_NAME, 2);
      r.onupgradeneeded = function () {
        var db = r.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
        if (!db.objectStoreNames.contains(IMG_STORE)) db.createObjectStore(IMG_STORE);
      };
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
  /* ─── PUBLISERINGS-SINK (G1) ───
     Når en «capture» er aktiv, samler downloadBlob/saveBlob filene i en liste
     i stedet for å laste dem ned — slik at «Publiser til GitHub» kan committe
     nøyaktig de samme filene modulenes export() ellers laster ned. */
  var _capture = null, _captureTs = 0;
  function beginCapture() { _capture = []; _captureTs = Date.now(); }
  function endCapture() { var c = _capture; _capture = null; return c || []; }
  function captureIdleFor() { return _capture ? (Date.now() - _captureTs) : 1e9; }
  function downloadBlob(filename, content) {
    if (_capture) { _capture.push({ path: filename, content: String(content == null ? '' : content), encoding: 'utf-8' }); _captureTs = Date.now(); return; }
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

  /* ─── BILDELAGER (IndexedDB) ───
     Bilder lagres IKKE som base64 i innholdsfilene (det blåser dem opp).
     I stedet får hvert bilde en sti (f.eks. "assets/styret/leder.webp") i
     innholdet, mens selve bytene ligger i IndexedDB her i nettleseren og
     pakkes til en zip ved publisering. imgGet/imgSet/imgDel/imgAll gir et
     enkelt nøkkel→dataURL-lager. Alt er asynkront (Promise). */
  function imgTx(mode) { return idb().then(function (db) { return db.transaction(IMG_STORE, mode).objectStore(IMG_STORE); }); }
  function imgGet(key) {
    return imgTx('readonly').then(function (os) {
      return new Promise(function (res, rej) { var t = os.get(key); t.onsuccess = function () { res(t.result || null); }; t.onerror = function () { rej(t.error); }; });
    });
  }
  function imgSet(key, dataUrl) {
    return imgTx('readwrite').then(function (os) {
      return new Promise(function (res, rej) { var t = os.put(dataUrl, key); t.onsuccess = function () { res(); }; t.onerror = function () { rej(t.error); }; });
    });
  }
  function imgDel(key) {
    return imgTx('readwrite').then(function (os) {
      return new Promise(function (res, rej) { var t = os.delete(key); t.onsuccess = function () { res(); }; t.onerror = function () { rej(t.error); }; });
    });
  }
  function imgAll() {
    return idb().then(function (db) {
      return new Promise(function (res, rej) {
        var out = {}, os = db.transaction(IMG_STORE, 'readonly').objectStore(IMG_STORE);
        var cur = os.openCursor();
        cur.onsuccess = function () { var c = cur.result; if (c) { out[c.key] = c.value; c.continue(); } else res(out); };
        cur.onerror = function () { rej(cur.error); };
      });
    });
  }

  /* ─── BLOB-NEDLASTING + ZIP ───
     dataUrlToBytes() pakker ut en dataURL til rå bytes. zipFiles({sti:bytes})
     bygger et ukomprimert (store) zip-arkiv — webp er allerede komprimert, så
     vi sparer oss en deflate-implementasjon. saveBlob() laster ned en Blob. */
  function dataUrlToBytes(dataUrl) {
    var i = String(dataUrl).indexOf(',');
    var b64 = i >= 0 ? dataUrl.slice(i + 1) : dataUrl;
    var bin = atob(b64);
    var arr = new Uint8Array(bin.length);
    for (var j = 0; j < bin.length; j++) arr[j] = bin.charCodeAt(j);
    return arr;
  }
  var CRC_TABLE = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); t[n] = c >>> 0; }
    return t;
  })();
  function crc32(bytes) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  function zipFiles(files) {
    // files: { 'sti/navn.webp': Uint8Array }
    var enc = new TextEncoder();
    var chunks = [], central = [], offset = 0;
    function u16(v) { return [v & 255, (v >>> 8) & 255]; }
    function u32(v) { return [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]; }
    Object.keys(files).forEach(function (name) {
      var data = files[name];
      var nameB = enc.encode(name);
      var crc = crc32(data);
      var local = [].concat(u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0),
        u32(crc), u32(data.length), u32(data.length), u16(nameB.length), u16(0));
      chunks.push(new Uint8Array(local)); chunks.push(nameB); chunks.push(data);
      var cen = [].concat(u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0),
        u32(crc), u32(data.length), u32(data.length), u16(nameB.length), u16(0), u16(0), u16(0), u16(0),
        u32(0), u32(offset));
      central.push(new Uint8Array(cen)); central.push(nameB);
      offset += local.length + nameB.length + data.length;
    });
    var cenStart = offset, cenSize = 0;
    central.forEach(function (c) { cenSize += c.length; });
    var end = [].concat(u32(0x06054b50), u16(0), u16(0), u16(Object.keys(files).length), u16(Object.keys(files).length),
      u32(cenSize), u32(cenStart), u16(0));
    var all = chunks.concat(central, [new Uint8Array(end)]);
    return new Blob(all, { type: 'application/zip' });
  }
  function saveBlob(filename, blob) {
    if (_capture) { _capture.push({ path: filename, blob: blob }); _captureTs = Date.now(); return; }
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = String(filename).split('/').pop();
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
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
    { file: 'styret.html', name: 'Styret', sections: [{ anchor: 'styremedlemmer', name: 'Styremedlemmer' }, { anchor: 'tillitsvalgte', name: 'Tillitsvalgte' }, { anchor: 'sak', name: 'S.A.K' }, { anchor: 'vervene', name: 'Om vervene' }, { anchor: 'tidligere-styrer', name: 'Tidligere styrer' }] },
    { file: 'styret-arkiv.html', name: 'Styre-arkiv', sections: [{ anchor: 'arkiv', name: 'Tidligere styrer' }] },
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

  /* ─── ANGRE-SNACKBAR (delt, med STABEL) ───
     undoable(label, undoFn) legger en angre-handling på en stabel og viser en
     «↶ Angre»-stripe nederst. Sletter du flere ting kan ALLE angres — Angre tar
     den nyeste først (LIFO), og telleren viser hvor mange som ligger igjen.
     Indeksene fanges ved slettetidspunktet, så LIFO-gjenoppretting lander hvert
     element på riktig plass. Stabelen tømmes etter ~20 s uten aktivitet eller
     når du lukker stripa (✕). undoDelete() er snarveien. */
  var _undo = { el: null, stack: [], timer: null };
  function _resetUndoTimer() {
    if (_undo.timer) clearTimeout(_undo.timer);
    _undo.timer = setTimeout(_clearUndo, 20000);
  }
  function _hideUndo() {
    if (_undo.timer) { clearTimeout(_undo.timer); _undo.timer = null; }
    if (_undo.el) _undo.el.classList.remove('show');
  }
  function _clearUndo() { _undo.stack.length = 0; _hideUndo(); }
  function _renderUndo() {
    if (!_undo.el) return;
    if (!_undo.stack.length) { _hideUndo(); return; }
    var n = _undo.stack.length;
    var top = _undo.stack[n - 1];
    _undo.el.querySelector('.undo-snack__msg').textContent = (top.label || 'Slettet')
      + (n > 1 ? ' — Angre tar én om gangen' : '');
    var badge = _undo.el.querySelector('.undo-snack__count');
    if (n > 1) { badge.textContent = n; badge.style.display = ''; badge.title = n + ' slettinger kan angres'; }
    else { badge.style.display = 'none'; }
    _undo.el.classList.add('show');
  }
  function _undoTop() {
    var item = _undo.stack.pop();
    if (item && item.fn) { try { item.fn(); } catch (e) {} }
    if (_undo.stack.length) { _renderUndo(); _resetUndoTimer(); }
    else _hideUndo();
  }
  function _buildUndo() {
    if (_undo.el) return _undo.el;
    var el = document.createElement('div');
    el.className = 'undo-snack';
    el.setAttribute('role', 'status');
    el.innerHTML = '<span class="undo-snack__count" style="display:none"></span>'
      + '<span class="undo-snack__msg"></span>'
      + '<button type="button" class="undo-snack__do">↶ Angre</button>'
      + '<button type="button" class="undo-snack__x" title="Lukk (gjør slettingene permanente)" aria-label="Lukk">✕</button>';
    el.querySelector('.undo-snack__do').addEventListener('click', _undoTop);
    el.querySelector('.undo-snack__x').addEventListener('click', _clearUndo);
    (document.body || document.documentElement).appendChild(el);
    _undo.el = el;
    return el;
  }
  function undoable(label, undoFn) {
    _buildUndo();
    _undo.stack.push({ label: label || 'Slettet', fn: undoFn });
    _renderUndo();
    _resetUndoTimer();
  }
  // Fjern arr[idx], kjør render()+save(), og tilby angre som setter elementet
  // tilbake på samme plass. Returnerer det fjernede elementet (eller null).
  function undoDelete(arr, idx, label, render, save) {
    if (!arr || idx < 0 || idx >= arr.length) return null;
    var item = arr.splice(idx, 1)[0];
    if (render) { try { render(); } catch (e) {} }
    if (save) { try { save(); } catch (e) {} }
    undoable(label, function () {
      arr.splice(Math.min(idx, arr.length), 0, item);
      if (render) { try { render(); } catch (e) {} }
      if (save) { try { save(); } catch (e) {} }
    });
    return item;
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
    viewSwitch: viewSwitch,
    imgFieldHtml: imgFieldHtml,
    wireImageField: wireImageField,
    saveFile: saveFile,
    downloadBlob: downloadBlob,
    saveBlob: saveBlob,
    beginCapture: beginCapture,
    endCapture: endCapture,
    captureIdleFor: captureIdleFor,
    imgGet: imgGet,
    imgSet: imgSet,
    imgDel: imgDel,
    imgAll: imgAll,
    dataUrlToBytes: dataUrlToBytes,
    zipFiles: zipFiles,
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
    undoable: undoable,
    undoDelete: undoDelete,
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
