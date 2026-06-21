/* ============================================================
   admin-modules/styret.js — Styret-editor som C-modul
   Krever palette.js (createColorControl), admin-image-editor.js
   (AdminImageEditor) og styret-content.js (STYRET_CONTENT).

   Bilder lagres som EGNE filer: medlemskortet får en sti
   (assets/styret/<id>.webp), mens bytene ligger i IndexedDB
   (AdminCommon.imgGet/Set) og lastes ned som egne bildefiler ved
   publisering (samme flyt som innholdsfila — ingen zip). Slik holder
   styret-content.js seg liten.

   I tillegg: arkiv over tidligere styrer (period, sammendrag,
   høydepunkter, medlemmer med notat) — vises på styret.html
   (teaser) og styret-arkiv.html (i sin helhet).
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('styret', {
    title: 'Styret',
    see: { href: 'styret.html', label: 'Se Styret-siden ↗' },
    exportName: 'styret-content.js',

    searchEntries: function () {
      var d = window.AdminCommon.readDraftOr('apeiron-styret-v1', 'STYRET_CONTENT') || {};
      var out = [];
      (d.members || []).forEach(function (m) {
        if (!m || !m.name) return;
        var tags = (m.tags || []).map(function (t) { return t && t.label; }).filter(Boolean);
        var desc = (m.role || '') + ' · Apeiron 2025/26';
        if (tags.length) desc += ' · ' + tags.join(', ');
        out.push({ t: m.name, d: desc, u: 'index.html#styret', g: 'Styret' });
      });
      var roles = (d.roles || []).map(function (r) { return r && r.name; }).filter(Boolean);
      if (roles.length) out.push({ t: 'Om vervene — Styret', d: 'Beskrivelse av styrevervene i Apeiron: ' + roles.join(', ') + '.', u: 'styret.html', g: 'Styret' });
      (d.archive || []).forEach(function (a) {
        if (!a || !a.period) return;
        out.push({ t: 'Styret ' + a.period, d: (a.summary || 'Tidligere styre i Apeiron.').slice(0, 150), u: 'styret-arkiv.html#arkiv', g: 'Styre-arkiv' });
      });
      return out;
    },

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live mens du redigerer — bytt mellom Styret-siden og hele arkivsiden (tidligere styrer).</p>'
          + '<div class="pv-page" id="pv-page"><button type="button" data-page="styret.html?preview=1" class="pv-page-btn on">Styret-siden</button><button type="button" data-page="styret-arkiv.html?preview=1" class="pv-page-btn">Arkivsiden</button></div>'
          + '<div class="pv-board-wrap"><iframe id="pv-board" src="styret.html?preview=1" title="Forhåndsvisning"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du Styret-siden</strong>'
          + '<ol>'
            + '<li>Rediger innholdet nedenfor — klikk på et felt for å redigere det</li>'
            + '<li>Last opp portrett ved å <b>klikke på bildefeltet</b> eller dra et bilde inn — da åpnes redigeringsvinduet (flytt, zoom, roter, speilvend, lys/kontrast/metning)</li>'
            + '<li>Arkivér et avtroppende styre med <b>+ Arkivér nåværende styre</b>, og skriv notater om hva styret og hvert medlem gjorde</li>'
            + '<li>Klikk <b>↓ Last ned alle endrede</b> oppe til høyre — du får <code>styret-content.js</code> og portrettene som egne bildefiler (lastes ned én og én)</li>'
            + '<li>Legg <code>styret-content.js</code> i GitHub, og slipp bildefilene i mappa <code>assets/styret/</code> (arkivbilder i <code>assets/styret/arkiv/</code>). Push/commit alt.</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren din. Bilder lastes ned som egne filer (ikke inni innholdsfila), så fila holder seg liten. Til bildene er committet vises initialene som fallback.</div>'
        + '</div>'
        + '<div class="meta-panel">'
          + '<h3>Topp-banner</h3>'
          + '<div class="meta-grid">'
            + '<div class="fg narrow"><label>Tilbake-lenke</label><input type="text" id="meta-sh-back"></div>'
            + '<div class="fg"><label>Tittel</label><input type="text" id="meta-sh-title"></div>'
            + '<div class="fg"><label>Ingress</label><input type="text" id="meta-sh-lede"></div>'
          + '</div>'
          + '<h3>Overskrift — Styremedlemmer</h3>'
          + '<div class="meta-grid">'
            + '<div class="fg narrow"><label data-help="Liten etikett som vises over overskriften på siden, f.eks. «Hvem er vi».">Eyebrow</label><input type="text" id="meta-board-eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="meta-board-heading"></div>'
            + '<div class="fg"><label>Ingress</label><input type="text" id="meta-board-lede"></div>'
          + '</div>'
          + '<h3>Overskrift — Hva gjør vi (roller)</h3>'
          + '<div class="meta-grid">'
            + '<div class="fg narrow"><label data-help="Liten etikett som vises over overskriften på siden, f.eks. «Hvem er vi».">Eyebrow</label><input type="text" id="meta-verv-eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="meta-verv-heading"></div>'
            + '<div class="fg"><label>Ingress</label><input type="text" id="meta-verv-lede"></div>'
          + '</div>'
        + '</div>'
        + '<div class="sec"><div class="sec-head"><h2>Styremedlemmer</h2><span class="count" id="count-members"></span><button class="btn-add btn-add--danger" type="button" id="clear-board">🗑 Tøm styret</button><button class="btn-add" type="button" data-add="members">+ Nytt medlem</button></div>'
          + '<div class="lay-switch" id="lay-switch">'
            + '<span class="lay-switch__lbl" data-help="Velg hvordan styremedlemmene vises mens du redigerer her i admin. Påvirker bare denne redigeringsvisningen — ikke den publiserte Styret-siden.">Visning</span>'
            + '<div class="lay-switch__btns">'
              + '<button type="button" data-lay="stack" title="Stablet – ett bredt kort per rad (som før)"><span class="lay-ic ic-stack"><i></i><i></i></span>Stablet</button>'
              + '<button type="button" data-lay="b1" title="To kort i bredden"><span class="lay-ic ic-b1"><i></i><i></i></span>To i bredden</button>'
              + '<button type="button" data-lay="b2" title="Tre kompakte kort i bredden"><span class="lay-ic ic-b2"><i></i><i></i><i></i></span>Tre kompakt</button>'
              + '<button type="button" data-lay="b3" title="Portrettkort i galleri – bildet øverst"><span class="lay-ic ic-b3"><i></i><i></i></span>Galleri</button>'
            + '</div>'
          + '</div>'
          + '<div class="undo-bar" id="undo-bar" hidden></div>'
          + '<div class="list" id="list-members"></div></div>'
        + '<div class="sec"><div class="sec-head"><h2>Roller — «Hva gjør vi»</h2><span class="count" id="count-roles"></span><button class="btn-add" type="button" data-add="roles">+ Ny rolle</button></div><div class="list" id="list-roles"></div></div>'
        + '<div class="sec arch-sec">'
          + '<div class="sec-head"><h2>Tidligere styrer (arkiv)</h2><span class="count" id="count-archive"></span>'
            + '<button class="btn-add btn-add--ghost" type="button" id="arch-add-empty">+ Tomt arkiv</button>'
            + '<button class="btn-add" type="button" id="arch-add-current">+ Arkivér nåværende styre</button></div>'
          + '<p class="sec-desc">Bygg et arkiv over hvilke styrer som har vært. «Arkivér nåværende styre» tar en kopi av styremedlemmene over, som du så kan skrive notater på. Arkivet vises som teaser på Styret-siden og i sin helhet på arkivsiden — velg «Arkivsiden» i forhåndsvisningen øverst for å se den live.</p>'
          + '<div class="lay-switch" id="arch-density">'
            + '<span class="lay-switch__lbl" data-help="Velg hvordan arkivet vises mens du redigerer. Kompakt slår sammen hvert styre til én rad (periode + medlemstall) for rask oversikt når det blir mange år. Utvidet åpner full editor for alle. Du kan alltid åpne/lukke ett enkelt styre med pilen i kort-toppen.">Visning</span>'
            + '<div class="lay-switch__btns">'
              + '<button type="button" data-density="kompakt" title="Sammenslåtte rader — rask oversikt over mange år"><span class="lay-ic ic-rows"><i></i><i></i><i></i></span>Kompakt</button>'
              + '<button type="button" data-density="utvidet" title="Full editor — alle styrer åpne"><span class="lay-ic ic-one"><i></i></span>Utvidet</button>'
            + '</div>'
          + '</div>'
          + '<div class="list lay-cols-1" id="list-archive"></div></div>'
        + '<input type="file" data-file accept="image/png,image/jpeg,image/webp,image/avif" hidden>';

      var q = function (id) { return host.querySelector('#' + id); };
      var LS_KEY = 'apeiron-styret-v1';
      var esc = AC.esc;
      var data = { board: {}, verv: {}, members: [], roles: [], archive: [] };
      var imgCache = {};   // sti -> dataURL (lastes fra IndexedDB)
      var VIEW_KEY = 'apeiron-styret-view-v1';
      var viewMode = 'b1';
      try { var _sv = localStorage.getItem(VIEW_KEY); if (_sv) viewMode = _sv; } catch (_) {}
      function saveView() { try { localStorage.setItem(VIEW_KEY, viewMode); } catch (_) {} }
      var ARCH_MEM_MODES = [
        { id: 'cols-1', n: 1, label: '1 i bredden', title: 'Ett medlem per rad' },
        { id: 'cols-2', n: 2, label: '2 i bredden', title: 'To medlemmer i bredden' }
      ];
      var ARCH_OPEN_KEY = 'apeiron-styret-arch-open-v1';
      var openArch = {};
      try { openArch = JSON.parse(localStorage.getItem(ARCH_OPEN_KEY)) || {}; } catch (_) { openArch = {}; }
      function saveOpenArch() { try { localStorage.setItem(ARCH_OPEN_KEY, JSON.stringify(openArch)); } catch (_) {} }
      function isArchOpen(id) { return !!openArch[id]; }
      function setArchOpen(id, val) { if (val) openArch[id] = true; else delete openArch[id]; saveOpenArch(); }

      function fresh() {
        var c = window.STYRET_CONTENT || {};
        return {
          subhero: Object.assign({}, c.subhero || {}),
          board: Object.assign({ eyebrow: 'Hvem er vi', heading: 'Styret 2025/26', lede: '' }, c.board || {}),
          verv: Object.assign({ eyebrow: 'Rollene', heading: 'Hva gjør vi?', lede: '' }, c.verv || {}),
          members: (c.members || []).map(function (x) { return Object.assign({}, x, { tags: (x.tags || []).map(function (t) { return Object.assign({}, t); }) }); }),
          roles: (c.roles || []).map(function (x) { return Object.assign({}, x, { resp: (x.resp || []).slice() }); }),
          archive: (c.archive || []).map(function (a) { return Object.assign({}, a, {
            highlights: (a.highlights || []).slice(),
            members: (a.members || []).map(function (m) { return Object.assign({}, m, { tags: (m.tags || []).map(function (t) { return Object.assign({}, t); }) }); })
          }); })
        };
      }
      function normalize() {
        data.subhero = data.subhero || {};
        data.board = data.board || {}; data.verv = data.verv || {};
        data.members = data.members || []; data.roles = data.roles || []; data.archive = data.archive || [];
        data.members.forEach(function (m) { if (!Array.isArray(m.tags)) m.tags = []; });
        data.roles.forEach(function (r) { if (!Array.isArray(r.resp)) r.resp = []; });
        data.archive.forEach(function (a) {
          if (!a.id) a.id = uid('a');
          if (!Array.isArray(a.highlights)) a.highlights = [];
          if (!Array.isArray(a.members)) a.members = [];
          a.members.forEach(function (m) { if (!m.id) m.id = uid('am'); if (!Array.isArray(m.tags)) m.tags = []; });
        });
      }
      function loadData() {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) { try { data = JSON.parse(raw); normalize(); migrateInline(); return; } catch (_) {} }
        data = fresh(); normalize();
      }
      function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(data)); AC.toast('Lagret i nettleseren'); pushPreview(); }
      var saveTimer = null;
      function lazySave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveData, 350); }
      function uid(pfx) { return pfx + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
      function initialsFrom(name) { return String(name || '').split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).join('').toUpperCase().slice(0, 4); }
      function find(list, id) { return data[list].find(function (x) { return x.id === id; }); }

      // Bygger <option>-liste for styreperiode (årskull), f.eks. «2024 / 2025».
      // Genereres automatisk rundt inneværende studieår. Egendefinerte/eldre
      // verdier bevares som eget valg så ingenting går tapt.
      function periodeOptions(current) {
        var now = new Date();
        var startYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1; // studieår starter i august
        var top = startYear + 1; // tillat neste periode
        var cur = String(current == null ? '' : current).trim();
        var found = false;
        var opts = '<option value=""' + (cur ? '' : ' selected') + '>Velg periode…</option>';
        for (var y = top; y >= 2014; y--) {
          var p = y + ' / ' + (y + 1);
          var sel = (p === cur) ? ' selected' : '';
          if (sel) found = true;
          opts += '<option value="' + p + '"' + sel + '>' + p + '</option>';
        }
        if (cur && !found) opts += '<option value="' + esc(cur) + '" selected>' + esc(cur) + ' (egendefinert)</option>';
        return opts;
      }

      // Gammelt utkast kan ha base64 rett i .img — flytt til bildelageret.
      function migrateInline() {
        data.members.forEach(function (m) {
          if (m.img && /^data:/.test(m.img)) { var p = memberPath(m); imgCache[p] = m.img; AC.imgSet(p, m.img); m.img = p; }
        });
        data.archive.forEach(function (a) {
          a.members.forEach(function (m) {
            if (m.img && /^data:/.test(m.img)) { var p = archPath(a, m); imgCache[p] = m.img; AC.imgSet(p, m.img); m.img = p; }
          });
        });
      }

      function memberPath(m) { return 'assets/styret/' + m.id + '.webp'; }
      function archPath(a, m) { return 'assets/styret/arkiv/' + a.id + '-' + m.id + '.webp'; }
      // visnings-URL: cache (ikke-committet) ellers selve stien/data:
      function imgSrc(obj) { if (!obj || !obj.img) return ''; return imgCache[obj.img] || obj.img; }
      // øyeblikksbilde av et bildes tilstand (sti + faktiske bytes) for ANGRE
      function snapImg(obj) {
        var cur = (obj && obj.img) || null;
        var bytes = (cur && imgCache[cur] && /^data:/.test(imgCache[cur])) ? imgCache[cur] : null;
        return { img: cur, bytes: bytes };
      }
      // gjenopprett et bilde til et tidligere øyeblikksbilde. writeKey = stien
      // som den angrede handlingen skrev til (skal ryddes om snapshotet var tomt/committet).
      function restoreImg(obj, writeKey, snap) {
        if (snap.img) {
          obj.img = snap.img;
          if (snap.bytes) { imgCache[snap.img] = snap.bytes; AC.imgSet(snap.img, snap.bytes); }
          else if (writeKey) { delete imgCache[writeKey]; AC.imgDel(writeKey); }
        } else {
          if (writeKey) { delete imgCache[writeKey]; AC.imgDel(writeKey); }
          obj.img = null;
        }
        renderList('members'); renderArchive();
        lazySave();
      }

      /* ── felles bildehåndtering via redigeringsvinduet ── */
      var fileInput = host.querySelector('[data-file]');
      var pickTarget = null;
      fileInput.addEventListener('change', function () {
        var f = fileInput.files && fileInput.files[0];
        if (f && pickTarget) {
          var reader = new FileReader();
          var tgt = pickTarget;
          reader.onload = function (e) { openEditor(tgt, e.target.result); };
          reader.readAsDataURL(f);
        }
        pickTarget = null; fileInput.value = '';
      });
      function pickFile(target) { pickTarget = target; fileInput.click(); }
      function dropFile(target, file) {
        var reader = new FileReader();
        reader.onload = function (e) { openEditor(target, e.target.result); };
        reader.readAsDataURL(file);
      }
      // target = { obj, path, zone, title }
      function openEditor(target, src) {
        if (!window.AdminImageEditor) { alert('Bilderedigereren er ikke lastet.'); return; }
        AdminImageEditor.open({
          src: src, aspect: 1, outSize: 700, quality: 0.86, round: true,
          title: target.title || 'Rediger portrett',
          applyLabel: 'Bruk bilde',
          onApply: function (dataUrl) {
            var snap = snapImg(target.obj);
            target.obj.img = target.path;
            imgCache[target.path] = dataUrl;
            AC.imgSet(target.path, dataUrl);
            if (target.zone) refreshImgZone(target.zone, dataUrl);
            AC.checkImageSize(dataUrl);
            lazySave();
            AC.undoable('Portrett endret', function () { restoreImg(target.obj, target.path, snap); });
          }
        });
      }
      function clearImg(target) {
        var snap = snapImg(target.obj);
        var writeKey = target.obj.img || target.path;
        if (target.obj.img) { AC.imgDel(target.obj.img); delete imgCache[target.obj.img]; }
        target.obj.img = null;
        if (target.zone) refreshImgZone(target.zone, null);
        lazySave();
        if (snap.img) AC.undoable('Portrett fjernet', function () { restoreImg(target.obj, writeKey, snap); });
      }

      function refreshImgZone(zone, url) {
        var col = zone.closest('.img-col') || zone;
        var preview = zone.querySelector('.img-preview');
        var ph = zone.querySelector('.img-ph');
        var clrBtn = col.querySelector('.btn-clr-img');
        var editBtn = col.querySelector('.btn-edit-img');
        var overlay = zone.querySelector('.img-overlay');
        if (editBtn) editBtn.style.display = 'flex';
        if (url) {
          if (!preview) { preview = document.createElement('img'); preview.className = 'img-preview'; preview.alt = ''; zone.appendChild(preview); }
          // mangler bildefila (f.eks. ikke committet ennå)? vis placeholder i stedet for ødelagt bilde.
          preview.onerror = function () { preview.style.display = 'none'; if (ph) ph.style.display = 'flex'; if (overlay) overlay.textContent = '⚠ Bilde mangler — klikk for å laste opp'; };
          preview.style.display = 'block'; preview.src = url;
          if (ph) ph.style.display = 'none';
          if (clrBtn) clrBtn.style.display = 'flex';
          if (overlay) overlay.textContent = '✎ Rediger / bytt';
        } else {
          if (preview) { preview.onerror = null; preview.style.display = 'none'; preview.removeAttribute('src'); }
          if (ph) ph.style.display = 'flex';
          if (clrBtn) clrBtn.style.display = 'none';
          if (overlay) overlay.textContent = '📷 Last opp';
        }
      }

      // Kobler en .img-zone til opplasting/redigering. getTarget() returnerer
      // { obj, path } slik at vi alltid jobber mot riktig objekt og sti.
      function wireImgZone(zone, getTarget, title) {
        function target() { var t = getTarget(); return { obj: t.obj, path: t.path, zone: zone, title: title }; }
        zone.addEventListener('click', function (e) {
          if (e.target.closest('.btn-clr-img') || e.target.closest('.btn-edit-img')) return;
          var t = target();
          if (t.obj.img) openEditor(t, imgSrc(t.obj)); else pickFile(t);
        });
        zone.addEventListener('dragenter', function (e) { e.preventDefault(); zone.setAttribute('data-over', ''); });
        zone.addEventListener('dragover', function (e) { e.preventDefault(); });
        zone.addEventListener('dragleave', function () { zone.removeAttribute('data-over'); });
        zone.addEventListener('drop', function (e) { e.preventDefault(); zone.removeAttribute('data-over'); var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) dropFile(target(), f); });
        var col = zone.closest('.img-col') || zone;
        var editBtn = col.querySelector('.btn-edit-img');
        if (editBtn) editBtn.addEventListener('click', function (e) { e.stopPropagation(); var t = target(); if (t.obj.img) openEditor(t, imgSrc(t.obj)); else pickFile(t); });
        var clrBtn = col.querySelector('.btn-clr-img');
        if (clrBtn) clrBtn.addEventListener('click', function (e) { e.stopPropagation(); clearImg(target()); });
      }

      var IMG_ZONE_HTML =
        '<div class="img-ph"><img src="assets/apeiron-logo.png" alt=""><span>Klikk eller dra inn bilde</span></div>'
        + '<div class="img-overlay">📷 Last opp</div>';
      function imgColHtml(zoneCls) {
        return '<div class="img-col">'
          + '<div class="img-zone' + (zoneCls ? ' ' + zoneCls : '') + '">' + IMG_ZONE_HTML + '</div>'
          + '<div class="img-bar">'
            + '<button class="ibtn btn-edit-img" type="button" title="Last opp / rediger bilde">✎</button>'
            + '<button class="ibtn btn-clr-img" type="button" title="Fjern bilde">✕</button>'
          + '</div>'
        + '</div>';
      }

      /* ───────────────────── STYREMEDLEMMER ───────────────────── */
      function memberCard(m) {
        var card = document.createElement('div');
        card.className = 'card'; card.setAttribute('data-id', m.id);
        var headHtml =
          '<div class="card-head"><span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<span class="card-title">' + esc(m.name || '(uten navn)') + '</span>'
            + '<div class="order-btns"><button class="btn-ord btn-up" type="button" title="Opp">↑</button><button class="btn-ord btn-dn" type="button" title="Ned">↓</button></div>'
            + '<button class="btn-del" type="button">Slett</button></div>';
        var footHtml =
          '<div class="b3-foot"><span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<button class="btn-del" type="button">Slett</button>'
            + '<div class="order-btns"><button class="btn-ord btn-up" type="button" title="Opp">↑</button><button class="btn-ord btn-dn" type="button" title="Ned">↓</button></div></div>';
        var imgZone = imgColHtml('');
        var fName = '<div class="fg"><label>Navn</label><input type="text" data-f="name" value="' + esc(m.name) + '" placeholder="Fullt navn"></div>';
        var fInit = '<div class="fg narrow"><label data-help="Forkortelse som vises i en gull-sirkel når portrettet ikke er lastet opp ennå, f.eks. «SL».">Initialer</label><input type="text" data-f="initials" value="' + esc(m.initials) + '" placeholder="f.eks. SL"></div>';
        var fRole = '<div class="fg"><label data-help="Personens viktigste verv, vises stort på kortet, f.eks. «Leder».">Hovedverv (Rolle)</label><input type="text" data-f="role" value="' + esc(m.role) + '" placeholder="f.eks. Leder"></div>';
        var tagsHtml = '<div class="subed" data-tags></div>';
        if (viewMode === 'b2') {
          card.innerHTML = headHtml
            + '<div class="card-body b2-body">'
              + '<div class="b2-top">' + imgZone + fName + '</div>'
              + '<div class="frow">' + fRole + fInit + '</div>'
              + tagsHtml
            + '</div>';
        } else if (viewMode === 'b3') {
          card.innerHTML =
            '<div class="b3-img">' + imgZone + '</div>'
            + '<div class="fields">' + fName + '<div class="frow">' + fRole + fInit + '</div>' + tagsHtml + '</div>'
            + footHtml;
        } else {
          card.innerHTML = headHtml
            + '<div class="card-body">' + imgZone
              + '<div class="fields"><div class="frow">' + fName + fInit + '</div>' + fRole + tagsHtml + '</div>'
            + '</div>';
        }

        var zone = card.querySelector('.img-zone');
        if (m.img) refreshImgZone(zone, imgSrc(m));
        wireImgZone(zone, function () { return { obj: m, path: memberPath(m) }; }, 'Rediger portrett — ' + (m.name || ''));

        card.querySelectorAll('[data-f]').forEach(function (el) {
          var field = el.getAttribute('data-f');
          el.addEventListener('input', function () {
            m[field] = el.value;
            if (field === 'name') {
              var titleEl = card.querySelector('.card-title');
              if (titleEl) titleEl.textContent = el.value || '(uten navn)';
              var initEl = card.querySelector('[data-f="initials"]');
              if (initEl && !m.initials) { m.initials = initialsFrom(el.value); initEl.value = m.initials; }
            }
            lazySave();
          });
        });
        renderTags(card.querySelector('[data-tags]'), m);
        card.querySelector('.btn-up').addEventListener('click', function () { move('members', m.id, -1); });
        card.querySelector('.btn-dn').addEventListener('click', function () { move('members', m.id, 1); });
        card.querySelector('.btn-del').addEventListener('click', function () { del('members', m.id); });
        return card;
      }

      function renderTags(hostEl, m) {
        if (!Array.isArray(m.tags)) m.tags = [];
        hostEl.innerHTML = '<label data-help="Mindre verv eller utvalg, vist som fargede merker under hovedvervet. Velg farge med fargevelgeren ved siden av hvert merke.">Tilleggsverv (chips)</label><div class="subed-rows"></div><button class="btn-subadd" type="button">+ verv</button>';
        var rows = hostEl.querySelector('.subed-rows');
        m.tags.forEach(function (t, i) {
          var row = document.createElement('div');
          row.className = 'subed-row'; row.style.alignItems = 'flex-start';
          var input = document.createElement('input');
          input.type = 'text'; input.value = t.label || ''; input.placeholder = 'f.eks. ASAP';
          input.addEventListener('input', function () { t.label = input.value; lazySave(); });
          var ctrl = window.createColorControl({ value: t.color, onChange: function (v) { t.color = v; lazySave(); } });
          ctrl.style.flex = '1';
          var del = document.createElement('button');
          del.className = 'btn-mini x'; del.type = 'button'; del.title = 'Fjern'; del.textContent = '✕';
          del.addEventListener('click', function () { AC.undoDelete(m.tags, i, 'Tilleggsverv fjernet', function () { renderTags(hostEl, m); }, lazySave); });
          row.appendChild(input); row.appendChild(ctrl); row.appendChild(del);
          rows.appendChild(row);
        });
        hostEl.querySelector('.btn-subadd').addEventListener('click', function () { m.tags.push({ label: '', color: '' }); renderTags(hostEl, m); lazySave(); });
      }

      /* ───────────────────── ROLLER ───────────────────── */
      function roleCard(r) {
        var card = document.createElement('div');
        card.className = 'card'; card.setAttribute('data-id', r.id);
        card.innerHTML =
          '<div class="card-head"><span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<span class="card-title">' + esc(r.name || '(uten navn)') + '</span>'
            + '<div class="order-btns"><button class="btn-ord btn-up" type="button" title="Opp">↑</button><button class="btn-ord btn-dn" type="button" title="Ned">↓</button></div>'
            + '<button class="btn-del" type="button">Slett</button></div>'
          + '<div class="card-body no-img">'
            + '<div class="fields">'
              + '<div class="frow"><div class="fg"><label>Navn på verv</label><input type="text" data-f="name" value="' + esc(r.name) + '" placeholder="f.eks. Leder"></div>'
              + '<div class="fg"><label data-help="Fargen på stripen ved siden av vervet på siden. La stå tom for gull (standard).">Fargestripe</label><div data-accent-host></div></div></div>'
              + '<div class="fg"><label>Beskrivelse</label><textarea data-f="desc" placeholder="Kort beskrivelse av vervet...">' + esc(r.desc) + '</textarea></div>'
              + '<div class="subed" data-resp></div>'
            + '</div>'
          + '</div>';
        card.querySelectorAll('[data-f]').forEach(function (el) {
          var field = el.getAttribute('data-f');
          var evt = el.tagName === 'SELECT' ? 'change' : 'input';
          el.addEventListener(evt, function () { r[field] = el.value; if (field === 'name') card.querySelector('.card-title').textContent = el.value || '(uten navn)'; lazySave(); });
        });
        var accentHost = card.querySelector('[data-accent-host]');
        if (accentHost && window.createColorControl) accentHost.appendChild(window.createColorControl({ value: r.accent || '', emptyLabel: 'Gull (standard)', onChange: function (v) { r.accent = v; lazySave(); } }));
        renderResp(card.querySelector('[data-resp]'), r);
        card.querySelector('.btn-up').addEventListener('click', function () { move('roles', r.id, -1); });
        card.querySelector('.btn-dn').addEventListener('click', function () { move('roles', r.id, 1); });
        card.querySelector('.btn-del').addEventListener('click', function () { del('roles', r.id); });
        return card;
      }

      function renderResp(hostEl, r) {
        hostEl.innerHTML = '<label data-help="Punktliste som vises under beskrivelsen av vervet på siden.">Ansvar / punkter</label><div class="subed-rows"></div><button class="btn-subadd" type="button">+ punkt</button>';
        var rows = hostEl.querySelector('.subed-rows');
        r.resp.forEach(function (txt, i) {
          var row = document.createElement('div');
          row.className = 'subed-row';
          row.innerHTML =
            '<input type="text" value="' + esc(txt) + '" placeholder="Et ansvarspunkt...">'
            + '<button class="btn-mini up" type="button" title="Opp">↑</button>'
            + '<button class="btn-mini dn" type="button" title="Ned">↓</button>'
            + '<button class="btn-mini x" type="button" title="Fjern">✕</button>';
          row.querySelector('input').addEventListener('input', function () { r.resp[i] = this.value; lazySave(); });
          row.querySelector('.btn-mini.up').addEventListener('click', function () { if (i > 0) { var t = r.resp[i]; r.resp[i] = r.resp[i - 1]; r.resp[i - 1] = t; renderResp(hostEl, r); lazySave(); } });
          row.querySelector('.btn-mini.dn').addEventListener('click', function () { if (i < r.resp.length - 1) { var t = r.resp[i]; r.resp[i] = r.resp[i + 1]; r.resp[i + 1] = t; renderResp(hostEl, r); lazySave(); } });
          row.querySelector('.btn-mini.x').addEventListener('click', function () { AC.undoDelete(r.resp, i, 'Punkt fjernet', function () { renderResp(hostEl, r); }, lazySave); });
          rows.appendChild(row);
        });
        hostEl.querySelector('.btn-subadd').addEventListener('click', function () { r.resp.push(''); renderResp(hostEl, r); lazySave(); });
      }

      /* ───────────────────── ARKIV (tidligere styrer) ───────────────────── */
      function archiveCard(a) {
        var card = document.createElement('div');
        card.className = 'card arch-card'; card.setAttribute('data-id', a.id);
        card.innerHTML =
          '<div class="card-head"><button class="btn-collapse" type="button" title="Vis/skjul dette styret"><span class="chev">▾</span></button>'
            + '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<span class="card-title">' + esc(a.period || '(uten periode)') + '</span>'
            + '<span class="arch-head-count"></span>'
            + '<div class="order-btns"><button class="btn-ord btn-up" type="button" title="Opp">↑</button><button class="btn-ord btn-dn" type="button" title="Ned">↓</button></div>'
            + '<button class="btn-del" type="button">Slett</button></div>'
          + '<div class="arch-body">'
            + '<div class="frow"><div class="fg narrow"><label data-help="Styreperioden (årskull). Vises som overskrift og brukes til å sortere arkivet på den publiserte siden.">Periode</label><select data-af="period">' + periodeOptions(a.period) + '</select></div>'
              + '<div class="fg"><label>Tittel (valgfri)</label><input type="text" data-af="heading" value="' + esc(a.heading || '') + '" placeholder="f.eks. Styret 2024/25"></div></div>'
            + '<div class="fg"><label>Sammendrag — hva gjorde styret denne perioden?</label><textarea data-af="summary" placeholder="Skriv om styreperioden...">' + esc(a.summary || '') + '</textarea></div>'
            + '<div class="subed" data-highlights></div>'
            + '<div class="arch-mem-head"><span class="arch-mem-ttl">Medlemmer</span><span class="arch-mem-count"></span><button class="btn-subadd" type="button" data-add-mem>+ medlem</button></div>'
            + '<div class="arch-mem-list" data-mem-list></div>'
          + '</div>';

        card.querySelectorAll('[data-af]').forEach(function (el) {
          var field = el.getAttribute('data-af');
          var evt = el.tagName === 'SELECT' ? 'change' : 'input';
          el.addEventListener(evt, function () { a[field] = el.value; if (field === 'period') card.querySelector('.card-title').textContent = el.value || '(uten periode)'; lazySave(); });
        });
        renderHighlights(card.querySelector('[data-highlights]'), a);
        renderArchMembers(card, a);
        AC.viewSwitch({ list: card.querySelector('[data-mem-list]'), key: 'apeiron-styret-archmem-view-v1', def: 'cols-2', modes: ARCH_MEM_MODES, help: 'Velg hvordan medlemmene i dette tidligere styret vises mens du redigerer. Påvirker bare admin.' });
        if (!isArchOpen(a.id)) card.classList.add('is-collapsed');
        card.querySelector('.btn-collapse').addEventListener('click', function () {
          card.classList.toggle('is-collapsed');
          setArchOpen(a.id, !card.classList.contains('is-collapsed'));
          updateArchDensity();
        });
        card.querySelector('[data-add-mem]').addEventListener('click', function () {
          a.members.push({ id: uid('am'), name: '', role: '', initials: '', img: null, note: '', tags: [] });
          renderArchMembers(card, a); lazySave();
        });
        card.querySelector('.btn-up').addEventListener('click', function () { move('archive', a.id, -1); });
        card.querySelector('.btn-dn').addEventListener('click', function () { move('archive', a.id, 1); });
        card.querySelector('.btn-del').addEventListener('click', function () { del('archive', a.id); });
        return card;
      }

      function renderHighlights(hostEl, a) {
        hostEl.innerHTML = '<label data-help="Korte stikkord om hva styret fikk til i perioden. Vises som en liste i arkivet.">Høydepunkter / oppnåelser</label><div class="subed-rows"></div><button class="btn-subadd" type="button">+ punkt</button>';
        var rows = hostEl.querySelector('.subed-rows');
        a.highlights.forEach(function (txt, i) {
          var row = document.createElement('div');
          row.className = 'subed-row';
          row.innerHTML =
            '<input type="text" value="' + esc(txt) + '" placeholder="Et høydepunkt...">'
            + '<button class="btn-mini up" type="button" title="Opp">↑</button>'
            + '<button class="btn-mini dn" type="button" title="Ned">↓</button>'
            + '<button class="btn-mini x" type="button" title="Fjern">✕</button>';
          row.querySelector('input').addEventListener('input', function () { a.highlights[i] = this.value; lazySave(); });
          row.querySelector('.btn-mini.up').addEventListener('click', function () { if (i > 0) { var t = a.highlights[i]; a.highlights[i] = a.highlights[i - 1]; a.highlights[i - 1] = t; renderHighlights(hostEl, a); lazySave(); } });
          row.querySelector('.btn-mini.dn').addEventListener('click', function () { if (i < a.highlights.length - 1) { var t = a.highlights[i]; a.highlights[i] = a.highlights[i + 1]; a.highlights[i + 1] = t; renderHighlights(hostEl, a); lazySave(); } });
          row.querySelector('.btn-mini.x').addEventListener('click', function () { AC.undoDelete(a.highlights, i, 'Høydepunkt fjernet', function () { renderHighlights(hostEl, a); }, lazySave); });
          rows.appendChild(row);
        });
        hostEl.querySelector('.btn-subadd').addEventListener('click', function () { a.highlights.push(''); renderHighlights(hostEl, a); lazySave(); });
      }

      function renderArchMembers(card, a) {
        var listEl = card.querySelector('[data-mem-list]');
        listEl.innerHTML = '';
        a.members.forEach(function (m, idx) {
          var row = document.createElement('div');
          row.className = 'arch-mem'; row.setAttribute('data-mid', m.id);
          row.innerHTML =
            imgColHtml('arch-mem__img')
            + '<div class="arch-mem__fields">'
              + '<div class="frow"><div class="fg"><label>Navn</label><input type="text" data-mf="name" value="' + esc(m.name) + '" placeholder="Navn"></div>'
              + '<div class="fg"><label>Verv</label><input type="text" data-mf="role" value="' + esc(m.role) + '" placeholder="f.eks. Leder"></div>'
              + '<div class="fg narrow"><label data-help="Forkortelse som vises når portrettet mangler, f.eks. «SL».">Init.</label><input type="text" data-mf="initials" value="' + esc(m.initials) + '" placeholder="SL"></div></div>'
              + '<div class="fg"><label>Notat — hva gjorde personen i perioden? (valgfri)</label><textarea data-mf="note" placeholder="Kort om bidraget...">' + esc(m.note || '') + '</textarea></div>'
              + '<div class="subed arch-mem-tags" data-mtags></div>'
            + '</div>'
            + '<div class="arch-mem__ctrls"><button class="btn-mini up" type="button" title="Opp">↑</button><button class="btn-mini dn" type="button" title="Ned">↓</button><button class="btn-mini x" type="button" title="Fjern">✕</button></div>';

          var zone = row.querySelector('.img-zone');
          if (m.img) refreshImgZone(zone, imgSrc(m));
          wireImgZone(zone, function () { return { obj: m, path: archPath(a, m) }; }, 'Rediger portrett — ' + (m.name || ''));

          row.querySelectorAll('[data-mf]').forEach(function (el) {
            var field = el.getAttribute('data-mf');
            el.addEventListener('input', function () {
              m[field] = el.value;
              if (field === 'name' && !m.initials) { m.initials = initialsFrom(el.value); var ie = row.querySelector('[data-mf="initials"]'); if (ie) ie.value = m.initials; }
              lazySave();
            });
          });
          renderTags(row.querySelector('[data-mtags]'), m);
          row.querySelector('.btn-mini.up').addEventListener('click', function () { if (idx > 0) { var t = a.members[idx]; a.members[idx] = a.members[idx - 1]; a.members[idx - 1] = t; renderArchMembers(card, a); lazySave(); } });
          row.querySelector('.btn-mini.dn').addEventListener('click', function () { if (idx < a.members.length - 1) { var t = a.members[idx]; a.members[idx] = a.members[idx + 1]; a.members[idx + 1] = t; renderArchMembers(card, a); lazySave(); } });
          row.querySelector('.btn-mini.x').addEventListener('click', function () {
            AC.undoDelete(a.members, idx, '«' + (m.name || 'Medlem') + '» fjernet fra arkivet', function () { renderArchMembers(card, a); }, lazySave);
          });
          listEl.appendChild(row);
        });
        var cnt = card.querySelector('.arch-mem-count');
        var lbl = a.members.length ? (a.members.length + (a.members.length === 1 ? ' medlem' : ' medlemmer')) : '';
        if (cnt) cnt.textContent = lbl;
        var hc = card.querySelector('.arch-head-count');
        if (hc) hc.textContent = a.members.length ? lbl : 'Ingen medlemmer';
      }

      // Kopier dagens styre til et nytt arkiv-utkast.
      function archiveCurrent() {
        var a = { id: uid('a'), period: '', heading: '', summary: '', highlights: [], members: [] };
        data.members.forEach(function (m) {
          var am = { id: uid('am'), name: m.name, role: m.role, initials: m.initials, img: null, note: '', tags: (m.tags || []).map(function (t) { return Object.assign({}, t); }) };
          // snapshot bildet: cache-bilder kopieres til egen arkivsti, committede filer gjenbrukes.
          if (m.img && imgCache[m.img]) { var p = archPath(a, am); imgCache[p] = imgCache[m.img]; AC.imgSet(p, imgCache[m.img]); am.img = p; }
          else if (m.img) am.img = m.img;
          a.members.push(am);
        });
        data.archive.unshift(a);
        setArchOpen(a.id, true);
        renderArchive();
        lazySave();
        setTimeout(function () { var first = host.querySelector('#list-archive .card:first-child'); if (first) { first.scrollIntoView({ behavior: 'smooth', block: 'center' }); var pi = first.querySelector('[data-af="period"]'); if (pi) pi.focus(); } }, 60);
      }

      /* ── Tøm styret + ANGRE (egen, ikke «Tilbakestill») ──
         Snapshotet lagres i localStorage, så angre overlever en reload. Bildene
         beholdes i lageret slik at angre gjenoppretter portrettene også. */
      var UNDO_KEY = 'apeiron-styret-undo-v1';
      function readUndo() { try { var r = localStorage.getItem(UNDO_KEY); return r ? JSON.parse(r) : null; } catch (_) { return null; } }
      function writeUndo(s) { try { localStorage.setItem(UNDO_KEY, JSON.stringify(s)); } catch (_) {} }
      function dropUndo() { try { localStorage.removeItem(UNDO_KEY); } catch (_) {} }
      function showUndoBar(snap) {
        var bar = q('undo-bar'); if (!bar) return;
        if (!snap || !snap.members) { bar.hidden = true; bar.innerHTML = ''; return; }
        var n = snap.members.length;
        bar.hidden = false;
        bar.innerHTML = '<span class="undo-msg">Styret ble tømt — <b>' + n + '</b> medlem' + (n === 1 ? '' : 'mer') + ' fjernet.</span>'
          + '<button class="undo-do" type="button">↶ Angre</button>'
          + '<button class="undo-x" type="button" title="Lukk">✕</button>';
        bar.querySelector('.undo-do').addEventListener('click', undoClear);
        bar.querySelector('.undo-x').addEventListener('click', function () { dropUndo(); showUndoBar(null); });
      }
      function clearBoard() {
        if (!data.members.length) { AC.toast('Styret er allerede tomt'); return; }
        if (!confirm('Fjerne alle ' + data.members.length + ' styremedlemmene fra «Styremedlemmer»?\n\nDu kan angre umiddelbart etterpå (egen Angre-knapp). Roller og arkiv røres ikke.')) return;
        var snap = { action: 'clear-members', members: JSON.parse(JSON.stringify(data.members)), at: Date.now() };
        writeUndo(snap);
        data.members = [];
        renderList('members'); showUndoBar(snap); lazySave();
      }
      function undoClear() {
        var snap = readUndo(); if (!snap || !snap.members) return;
        data.members = snap.members.map(function (m) { return Object.assign({}, m, { tags: (m.tags || []).map(function (t) { return Object.assign({}, t); }) }); });
        dropUndo(); showUndoBar(null);
        renderList('members'); lazySave();
        AC.toast('Angret — styret er gjenopprettet');
      }

      /* ───────────────────── RENDER ───────────────────── */
      function renderList(list) {
        var el = q('list-' + list); el.innerHTML = '';
        if (list === 'members') el.className = 'list lay-' + viewMode;
        var maker = list === 'members' ? memberCard : roleCard;
        data[list].forEach(function (item) { el.appendChild(maker(item)); });
        updateCounts();
        AC.enhanceHelp(el);
      }
      function setView(mode) { if (mode === viewMode) return; viewMode = mode; saveView(); renderList('members'); updateLaySwitch(); }
      function updateLaySwitch() { var sw = q('lay-switch'); if (!sw) return; Array.prototype.forEach.call(sw.querySelectorAll('[data-lay]'), function (b) { b.classList.toggle('active', b.getAttribute('data-lay') === viewMode); }); }
      function renderArchive() {
        var el = q('list-archive'); el.innerHTML = '';
        data.archive.forEach(function (a) { el.appendChild(archiveCard(a)); });
        updateCounts();
        AC.enhanceHelp(host);
        updateArchDensity();
      }
      function archAnyClosed() { return data.archive.some(function (a) { return !isArchOpen(a.id); }); }
      function applyArchDensity(mode) {
        data.archive.forEach(function (a) { setArchOpen(a.id, mode === 'utvidet'); });
        renderArchive();
      }
      function updateArchDensity() {
        var sw = q('arch-density'); if (!sw) return;
        sw.style.display = data.archive.length ? '' : 'none';
        var active = (data.archive.length && !archAnyClosed()) ? 'utvidet' : 'kompakt';
        Array.prototype.forEach.call(sw.querySelectorAll('[data-density]'), function (b) {
          b.classList.toggle('active', b.getAttribute('data-density') === active);
        });
      }
      function renderMeta() {
        q('meta-sh-back').value = (data.subhero && data.subhero.back) || ''; q('meta-sh-title').value = (data.subhero && data.subhero.title) || ''; q('meta-sh-lede').value = (data.subhero && data.subhero.lede) || '';
        q('meta-board-eyebrow').value = data.board.eyebrow || ''; q('meta-board-heading').value = data.board.heading || ''; q('meta-board-lede').value = data.board.lede || '';
        q('meta-verv-eyebrow').value = data.verv.eyebrow || ''; q('meta-verv-heading').value = data.verv.heading || ''; q('meta-verv-lede').value = data.verv.lede || '';
      }
      function updateCounts() {
        q('count-members').textContent = data.members.length + ' medlemmer';
        q('count-roles').textContent = data.roles.length + ' roller';
        q('count-archive').textContent = data.archive.length ? (data.archive.length + (data.archive.length === 1 ? ' styre' : ' styrer')) : '';
      }
      function renderAll() { renderMeta(); renderList('members'); renderList('roles'); renderArchive(); AC.enhanceHelp(host); }

      var DEFAULTS = {
        members: function () { return { id: uid('m'), name: '', role: '', initials: '', img: null, tags: [] }; },
        roles: function () { return { id: uid('r'), name: '', accent: '', desc: '', resp: [] }; }
      };
      function add(list) {
        data[list].push(DEFAULTS[list]()); renderList(list); lazySave();
        setTimeout(function () { var last = host.querySelector('#list-' + list + ' .card:last-child'); if (last) last.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
      }
      function del(list, id) {
        var arr = data[list], i = arr.findIndex(function (x) { return x.id === id; });
        if (i < 0) return;
        var render = list === 'archive' ? renderArchive : function () { renderList(list); };
        var label = list === 'members' ? ('«' + (arr[i].name || 'Medlem') + '» slettet')
          : list === 'roles' ? ('«' + (arr[i].name || 'Rolle') + '» slettet')
          : ('Arkivert styre «' + (arr[i].period || '') + '» slettet');
        AC.undoDelete(arr, i, label, render, lazySave);
      }
      function move(list, id, dir) {
        var arr = data[list], i = arr.findIndex(function (x) { return x.id === id; });
        if (i < 0) return; var j = i + dir; if (j < 0 || j >= arr.length) return;
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t; list === 'archive' ? renderArchive() : renderList(list); lazySave();
      }

      function wireMeta(id, group, key) { q(id).addEventListener('input', function () { data[group][key] = this.value; lazySave(); }); }
      wireMeta('meta-sh-back', 'subhero', 'back'); wireMeta('meta-sh-title', 'subhero', 'title'); wireMeta('meta-sh-lede', 'subhero', 'lede');
      wireMeta('meta-board-eyebrow', 'board', 'eyebrow'); wireMeta('meta-board-heading', 'board', 'heading'); wireMeta('meta-board-lede', 'board', 'lede');
      wireMeta('meta-verv-eyebrow', 'verv', 'eyebrow'); wireMeta('meta-verv-heading', 'verv', 'heading'); wireMeta('meta-verv-lede', 'verv', 'lede');

      /* ───────────────────── EKSPORT ───────────────────── */
      // hvilke bildestier er faktisk i bruk?
      function referencedPaths() {
        var set = {};
        data.members.forEach(function (m) { if (m.img) set[m.img] = 1; });
        data.archive.forEach(function (a) { a.members.forEach(function (m) { if (m.img) set[m.img] = 1; }); });
        return set;
      }
      function exportFile() {
        var out = JSON.parse(JSON.stringify(data));
        out.members.forEach(function (m) { m.tags = (m.tags || []).filter(function (t) { return t && t.label && t.label.trim(); }); });
        out.roles.forEach(function (r) { r.resp = (r.resp || []).filter(function (x) { return x && x.trim(); }); });
        out.archive.forEach(function (a) {
          a.highlights = (a.highlights || []).filter(function (x) { return x && x.trim(); });
          (a.members || []).forEach(function (m) { m.tags = (m.tags || []).filter(function (t) { return t && t.label && t.label.trim(); }); });
        });
        var content =
          '/* Innhold for Styret-siden (styret.html) + arkivsiden (styret-arkiv.html).\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Rediger direkte her, eller åpne Admin-senteret → Styret.\n'
          + '\n'
          + '   members[].img : sti til egen bildefil (assets/styret/…webp). Bildene\n'
          + '                   lastes ned som egne filer — legg dem i assets/styret/.\n'
          + '   members[].tags: tilleggsverv som chips. color = palettnavn ("maroon"),\n'
          + '                    eller { light, dark } med palettnavn/hex for egendefinert.\n'
          + '   roles[].accent: fargestripe — palettnavn ("" = gull) eller { light, dark }.\n'
          + '   roles[].resp : punktliste under beskrivelsen.\n'
          + '   archive[]    : tidligere styrer { period, heading, summary, highlights[],\n'
          + '                  members[]{ name, role, initials, img, note, tags } }. */\n\n'
          + 'window.STYRET_CONTENT = ' + JSON.stringify(out, null, 2) + ';\n';
        AC.saveFile('styret-content.js', content);

        // last ned hvert refererte bilde som EGEN fil (samme flyt som innholdsfila — ingen zip)
        var refs = referencedPaths();
        AC.imgAll().then(function (store) {
          var items = [];
          Object.keys(refs).forEach(function (p) {
            var d = store[p] || imgCache[p];
            if (d && /^data:/.test(d)) {
              try { items.push({ name: p.split('/').pop(), bytes: AC.dataUrlToBytes(d) }); } catch (_) {}
            }
          });
          if (items.length) {
            // litt mellomrom mellom hver nedlasting så nettleseren ikke slår dem sammen / blokkerer
            items.forEach(function (it, idx) {
              setTimeout(function () {
                AC.saveBlob(it.name, new Blob([it.bytes], { type: 'image/webp' }));
              }, idx * 220);
            });
            AC.toast('Lastet ned styret-content.js + ' + items.length + ' bilde' + (items.length === 1 ? '' : 'r') + ' — legg bildene i assets/styret/ og push!');
          } else {
            AC.toast('Fil lastet ned — erstatt i GitHub og push!');
          }
        }).catch(function () { AC.toast('Fil lastet ned — erstatt i GitHub og push!'); });
      }

      q('reset-btn').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); data = fresh(); normalize(); renderAll();
        // last bildelageret på nytt så portrettene matcher publisert tilstand (ikke stale redigeringer i minnet)
        AC.imgAll().then(function (map) { imgCache = map || {}; renderList('members'); renderArchive(); pushPreview(); });
        AC.toast('Tilbakestilt til publisert versjon'); pushPreview();
      });
      host.querySelectorAll('[data-add]').forEach(function (b) { b.addEventListener('click', function () { add(b.getAttribute('data-add')); }); });
      host.querySelectorAll('#lay-switch [data-lay]').forEach(function (b) { b.addEventListener('click', function () { setView(b.getAttribute('data-lay')); }); });
      q('arch-add-current').addEventListener('click', archiveCurrent);
      host.querySelectorAll('#arch-density [data-density]').forEach(function (b) {
        b.addEventListener('click', function () { applyArchDensity(b.getAttribute('data-density')); });
      });
      q('clear-board').addEventListener('click', clearBoard);
      q('arch-add-empty').addEventListener('click', function () {
        var na = { id: uid('a'), period: '', heading: '', summary: '', highlights: [], members: [] };
        data.archive.unshift(na); setArchOpen(na.id, true);
        renderArchive(); lazySave();
        setTimeout(function () { var first = host.querySelector('#list-archive .card:first-child'); if (first) { first.scrollIntoView({ behavior: 'smooth', block: 'center' }); var pi = first.querySelector('[data-af="period"]'); if (pi) pi.focus(); } }, 60);
      });

      ['members', 'roles', 'archive'].forEach(function (list) {
        AC.enableDragSort(q('list-' + list), {
          itemSelector: '.card', handleSelector: '.drag-handle',
          onReorder: function (ids) { data[list].sort(function (a, b) { return ids.indexOf(a.id) - ids.indexOf(b.id); }); lazySave(); }
        });
      });

      /* ───────────────────── FORHÅNDSVISNING ───────────────────── */
      var pvFrame = q('pv-board');
      function previewImages() {
        var refs = referencedPaths(), map = {};
        Object.keys(refs).forEach(function (p) { if (imgCache[p]) map[p] = imgCache[p]; });
        return map;
      }
      function pushPreview() {
        if (!pvFrame || !pvFrame.contentWindow) return;
        var msg = { type: 'apeiron-styret-preview', content: data, images: previewImages() };
        try { pvFrame.contentWindow.postMessage(msg, '*'); } catch (e) {}
      }
      function onPreviewMsg(e) {
        if (!e.data) return;
        if (e.data.type === 'apeiron-styret-preview-ready' || e.data.type === 'apeiron-styret-arkiv-preview-ready') { pushPreview(); fitPreview(); }
      }
      function fitFrameTo(frame, wrapSel) {
        var wrap = host.querySelector(wrapSel);
        if (!frame || !wrap) return;
        var W = wrap.clientWidth; if (!W) return;
        var contentW = (window.AdminCommon && AdminCommon.getPreviewWidth) ? AdminCommon.getPreviewWidth() : 1180;
        var scale = Math.min(1, W / contentW);
        var visibleH = Math.max(420, Math.min(680, Math.round(window.innerHeight * 0.66)));
        frame.style.width = contentW + 'px';
        frame.style.height = Math.round(visibleH / scale) + 'px';
        frame.style.transform = 'scale(' + scale + ')';
        wrap.style.height = visibleH + 'px';
      }
      function fitPreview() { fitFrameTo(pvFrame, '.pv-board-wrap'); }
      host.querySelectorAll('#pv-page [data-page]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.classList.contains('on')) return;
          host.querySelectorAll('#pv-page [data-page]').forEach(function (x) { x.classList.toggle('on', x === b); });
          pvFrame.src = b.getAttribute('data-page');
        });
      });
      window.addEventListener('message', onPreviewMsg);
      window.addEventListener('resize', fitPreview);
      if (pvFrame) pvFrame.addEventListener('load', function () { fitPreview(); pushPreview(); });

      loadData(); renderAll(); updateLaySwitch();
      AC.viewSwitch({ list: q('list-roles'), key: 'apeiron-styret-roles-view-v1', help: 'Velg hvordan rolle-kortene vises mens du redigerer her i admin. Påvirker bare redigeringsvisningen, ikke den publiserte siden.' });
      showUndoBar(readUndo());
      fitPreview(); setTimeout(fitPreview, 80);
      // last bildelageret, så bytt ut placeholdere + send til preview
      AC.imgAll().then(function (map) {
        imgCache = Object.assign(map || {}, imgCache);
        renderList('members'); renderArchive();
        pushPreview();
      });
      pushPreview(); setTimeout(pushPreview, 150);

      return {
        export: exportFile,
        destroy: function () { window.removeEventListener('message', onPreviewMsg); window.removeEventListener('resize', fitPreview); }
      };
    }
  });
})();
