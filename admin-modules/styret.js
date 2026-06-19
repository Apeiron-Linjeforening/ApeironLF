/* ============================================================
   admin-modules/styret.js — Styret-editor som C-modul
   Erstatter styret-admin.html. Krever palette.js (createColorControl) og
   styret-content.js (STYRET_CONTENT), som skallet (admin.html) laster.
   Live forhåndsvisning via styret.html?preview=1.
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
      return out;
    },

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live fra den ekte Styret-siden — bla i ruta for å se hele siden (styremedlemmer øverst, «Hva gjør vi» under). Endringene dine vises umiddelbart.</p>'
          + '<div class="pv-board-wrap"><iframe id="pv-board" src="styret.html?preview=1" title="Forhåndsvisning av Styret-siden"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du Styret-siden</strong>'
          + '<ol>'
            + '<li>Rediger innholdet nedenfor — klikk på et felt for å redigere det</li>'
            + '<li>Last opp portrett ved å <b>klikke på bildefeltet</b> eller dra et bilde inn</li>'
            + '<li>Legg til tilleggsverv (chips) på et medlem med <b>+ verv</b>, og punkter på en rolle med <b>+ punkt</b></li>'
            + '<li>Klikk <b>↓ Last ned alle endrede</b> oppe til høyre</li>'
            + '<li>Erstatt <code>styret-content.js</code> i GitHub-repositoriet og push/commit</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren din. Hovedvervet (Rolle) vises stort; chips vises diskré under navnet.</div>'
        + '</div>'
        + '<div class="meta-panel">'
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
        + '<div class="sec"><div class="sec-head"><h2>Styremedlemmer</h2><span class="count" id="count-members"></span><button class="btn-add" type="button" data-add="members">+ Nytt medlem</button></div><div class="list" id="list-members"></div></div>'
        + '<div class="sec"><div class="sec-head"><h2>Roller — «Hva gjør vi»</h2><span class="count" id="count-roles"></span><button class="btn-add" type="button" data-add="roles">+ Ny rolle</button></div><div class="list" id="list-roles"></div></div>'
        + '<input type="file" data-file accept="image/png,image/jpeg,image/webp,image/avif" hidden>';

      var q = function (id) { return host.querySelector('#' + id); };
      var LS_KEY = 'apeiron-styret-v1';
      var esc = AC.esc;
      var data = { board: {}, verv: {}, members: [], roles: [] };

      function fresh() {
        var c = window.STYRET_CONTENT || {};
        return {
          board: Object.assign({ eyebrow: 'Hvem er vi', heading: 'Styret 2025/26', lede: '' }, c.board || {}),
          verv: Object.assign({ eyebrow: 'Rollene', heading: 'Hva gjør vi?', lede: '' }, c.verv || {}),
          members: (c.members || []).map(function (x) { return Object.assign({}, x, { tags: (x.tags || []).map(function (t) { return Object.assign({}, t); }) }); }),
          roles: (c.roles || []).map(function (x) { return Object.assign({}, x, { resp: (x.resp || []).slice() }); })
        };
      }
      function normalize() {
        data.board = data.board || {}; data.verv = data.verv || {};
        data.members = data.members || []; data.roles = data.roles || [];
        data.members.forEach(function (m) { if (!Array.isArray(m.tags)) m.tags = []; });
        data.roles.forEach(function (r) { if (!Array.isArray(r.resp)) r.resp = []; });
      }
      function loadData() {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) { try { data = JSON.parse(raw); normalize(); return; } catch (_) {} }
        data = fresh();
      }
      function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(data)); AC.toast('Lagret i nettleseren'); pushPreview(); }
      var saveTimer = null;
      function lazySave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveData, 350); }
      function uid(pfx) { return pfx + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
      function initialsFrom(name) { return String(name || '').split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).join('').toUpperCase().slice(0, 4); }
      function find(list, id) { return data[list].find(function (x) { return x.id === id; }); }

      var imgTarget = null;
      var fileInput = host.querySelector('[data-file]');
      fileInput.addEventListener('change', function () {
        var f = fileInput.files && fileInput.files[0];
        if (f && imgTarget) processImage(f, imgTarget);
        fileInput.value = '';
      });
      function openPicker(id) { imgTarget = { id: id }; fileInput.click(); }
      function processImage(file, tgt) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var img = new Image();
          img.onload = function () {
            var MAX = 600, w = img.width, h = img.height;
            if (Math.max(w, h) > MAX) { var s = MAX / Math.max(w, h); w = Math.round(w * s); h = Math.round(h * s); }
            var canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            var url = canvas.toDataURL('image/webp', 0.82);
            AC.checkImageSize(url);
            var m = find('members', tgt.id);
            if (m) m.img = url;
            var zone = host.querySelector('[data-id="' + tgt.id + '"] .img-zone');
            if (zone) refreshImgZone(zone, url);
            lazySave();
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
      function refreshImgZone(zone, url) {
        var preview = zone.querySelector('.img-preview');
        var ph = zone.querySelector('.img-ph');
        var clrBtn = zone.querySelector('.btn-clr-img');
        var overlay = zone.querySelector('.img-overlay');
        if (url) {
          if (!preview) { preview = document.createElement('img'); preview.className = 'img-preview'; preview.alt = ''; zone.appendChild(preview); }
          preview.style.display = 'block'; preview.src = url;
          ph.style.display = 'none'; clrBtn.style.display = 'flex'; overlay.textContent = '↺ Bytt bilde';
        } else {
          if (preview) { preview.style.display = 'none'; preview.src = ''; }
          ph.style.display = 'flex'; clrBtn.style.display = 'none'; overlay.textContent = '📷 Last opp';
        }
      }

      function memberCard(m) {
        var card = document.createElement('div');
        card.className = 'card'; card.setAttribute('data-id', m.id);
        card.innerHTML =
          '<div class="card-head"><span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<span class="card-title">' + esc(m.name || '(uten navn)') + '</span>'
            + '<div class="order-btns"><button class="btn-ord btn-up" type="button" title="Opp">↑</button><button class="btn-ord btn-dn" type="button" title="Ned">↓</button></div>'
            + '<button class="btn-del" type="button">Slett</button></div>'
          + '<div class="card-body">'
            + '<div class="img-zone"><div class="img-ph"><img src="assets/apeiron-logo.png" alt=""><span>Klikk eller dra inn bilde</span></div><div class="img-overlay">📷 Last opp</div><button class="btn-clr-img" type="button" title="Fjern">✕</button></div>'
            + '<div class="fields">'
              + '<div class="frow"><div class="fg"><label>Navn</label><input type="text" data-f="name" value="' + esc(m.name) + '" placeholder="Fullt navn"></div>'
              + '<div class="fg narrow"><label>Initialer</label><input type="text" data-f="initials" value="' + esc(m.initials) + '" placeholder="f.eks. SL"></div></div>'
              + '<div class="fg"><label data-help="Personens viktigste verv, vises stort på kortet, f.eks. «Leder».">Hovedverv (Rolle)</label><input type="text" data-f="role" value="' + esc(m.role) + '" placeholder="f.eks. Leder"></div>'
              + '<div class="subed" data-tags></div>'
            + '</div>'
          + '</div>';

        var zone = card.querySelector('.img-zone');
        if (m.img) refreshImgZone(zone, m.img);
        zone.addEventListener('click', function () { openPicker(m.id); });
        zone.addEventListener('dragenter', function (e) { e.preventDefault(); zone.setAttribute('data-over', ''); });
        zone.addEventListener('dragover', function (e) { e.preventDefault(); });
        zone.addEventListener('dragleave', function () { zone.removeAttribute('data-over'); });
        zone.addEventListener('drop', function (e) { e.preventDefault(); zone.removeAttribute('data-over'); var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) processImage(f, { id: m.id }); });
        card.querySelector('.btn-clr-img').addEventListener('click', function (e) { e.stopPropagation(); m.img = null; refreshImgZone(zone, null); lazySave(); });

        card.querySelectorAll('[data-f]').forEach(function (el) {
          var field = el.getAttribute('data-f');
          el.addEventListener('input', function () {
            m[field] = el.value;
            if (field === 'name') {
              card.querySelector('.card-title').textContent = el.value || '(uten navn)';
              var initEl = card.querySelector('[data-f="initials"]');
              if (initEl && !m.initials) { m.initials = initialsFrom(el.value); initEl.value = m.initials; }
            }
            lazySave();
          });
        });
        renderTags(card.querySelector('[data-tags]'), m);
        card.querySelector('.btn-up').addEventListener('click', function () { move('members', m.id, -1); });
        card.querySelector('.btn-dn').addEventListener('click', function () { move('members', m.id, 1); });
        card.querySelector('.btn-del').addEventListener('click', function () { if (confirm('Slett «' + (m.name || 'dette medlemmet') + '»?')) del('members', m.id); });
        return card;
      }

      function renderTags(hostEl, m) {
        hostEl.innerHTML = '<label>Tilleggsverv (chips)</label><div class="subed-rows"></div><button class="btn-subadd" type="button">+ verv</button>';
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
          del.addEventListener('click', function () { m.tags.splice(i, 1); renderTags(hostEl, m); lazySave(); });
          row.appendChild(input); row.appendChild(ctrl); row.appendChild(del);
          rows.appendChild(row);
        });
        hostEl.querySelector('.btn-subadd').addEventListener('click', function () { m.tags.push({ label: '', color: '' }); renderTags(hostEl, m); lazySave(); });
      }

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
              + '<div class="fg"><label>Fargestripe</label><div data-accent-host></div></div></div>'
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
        card.querySelector('.btn-del').addEventListener('click', function () { if (confirm('Slett «' + (r.name || 'denne rollen') + '»?')) del('roles', r.id); });
        return card;
      }

      function renderResp(hostEl, r) {
        hostEl.innerHTML = '<label>Ansvar / punkter</label><div class="subed-rows"></div><button class="btn-subadd" type="button">+ punkt</button>';
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
          row.querySelector('.btn-mini.x').addEventListener('click', function () { r.resp.splice(i, 1); renderResp(hostEl, r); lazySave(); });
          rows.appendChild(row);
        });
        hostEl.querySelector('.btn-subadd').addEventListener('click', function () { r.resp.push(''); renderResp(hostEl, r); lazySave(); });
      }

      function renderList(list) {
        var el = q('list-' + list); el.innerHTML = '';
        var maker = list === 'members' ? memberCard : roleCard;
        data[list].forEach(function (item) { el.appendChild(maker(item)); });
        updateCounts();
      }
      function renderMeta() {
        q('meta-board-eyebrow').value = data.board.eyebrow || ''; q('meta-board-heading').value = data.board.heading || ''; q('meta-board-lede').value = data.board.lede || '';
        q('meta-verv-eyebrow').value = data.verv.eyebrow || ''; q('meta-verv-heading').value = data.verv.heading || ''; q('meta-verv-lede').value = data.verv.lede || '';
      }
      function updateCounts() { q('count-members').textContent = data.members.length + ' medlemmer'; q('count-roles').textContent = data.roles.length + ' roller'; }
      function renderAll() { renderMeta(); renderList('members'); renderList('roles'); AC.enhanceHelp(host); }

      var DEFAULTS = {
        members: function () { return { id: uid('m'), name: '', role: '', initials: '', img: null, tags: [] }; },
        roles: function () { return { id: uid('r'), name: '', accent: '', desc: '', resp: [] }; }
      };
      function add(list) {
        data[list].push(DEFAULTS[list]()); renderList(list); lazySave();
        setTimeout(function () { var last = host.querySelector('#list-' + list + ' .card:last-child'); if (last) last.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
      }
      function del(list, id) { data[list] = data[list].filter(function (x) { return x.id !== id; }); renderList(list); lazySave(); }
      function move(list, id, dir) {
        var arr = data[list], i = arr.findIndex(function (x) { return x.id === id; });
        if (i < 0) return; var j = i + dir; if (j < 0 || j >= arr.length) return;
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t; renderList(list); lazySave();
      }

      function wireMeta(id, group, key) { q(id).addEventListener('input', function () { data[group][key] = this.value; lazySave(); }); }
      wireMeta('meta-board-eyebrow', 'board', 'eyebrow'); wireMeta('meta-board-heading', 'board', 'heading'); wireMeta('meta-board-lede', 'board', 'lede');
      wireMeta('meta-verv-eyebrow', 'verv', 'eyebrow'); wireMeta('meta-verv-heading', 'verv', 'heading'); wireMeta('meta-verv-lede', 'verv', 'lede');

      function exportFile() {
        var out = JSON.parse(JSON.stringify(data));
        out.members.forEach(function (m) { m.tags = (m.tags || []).filter(function (t) { return t && t.label && t.label.trim(); }); });
        out.roles.forEach(function (r) { r.resp = (r.resp || []).filter(function (x) { return x && x.trim(); }); });
        var content =
          '/* Innhold for Styret-siden (styret.html).\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Rediger direkte her, eller åpne Admin-senteret → Styret.\n'
          + '\n'
          + '   members[].img : "assets/Styremedlemmer/filnavn.jpg", base64-bilde fra admin, eller null.\n'
          + '   members[].tags: tilleggsverv som chips. color = palettnavn ("maroon"),\n'
          + '                    eller { light, dark } med palettnavn/hex for egendefinert.\n'
          + '   roles[].accent: fargestripe — palettnavn ("" = gull) eller { light, dark }.\n'
          + '   roles[].resp : punktliste under beskrivelsen. */\n\n'
          + 'window.STYRET_CONTENT = ' + JSON.stringify(out, null, 2) + ';\n';
        AC.saveFile('styret-content.js', content);
        AC.toast('Fil lastet ned — erstatt i GitHub og push!');
      }

      q('reset-btn').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); data = fresh(); renderAll(); AC.toast('Tilbakestilt til publisert versjon'); pushPreview();
      });
      host.querySelectorAll('[data-add]').forEach(function (b) { b.addEventListener('click', function () { add(b.getAttribute('data-add')); }); });

      ['members', 'roles'].forEach(function (list) {
        AC.enableDragSort(q('list-' + list), {
          itemSelector: '.card', handleSelector: '.drag-handle',
          onReorder: function (ids) { data[list].sort(function (a, b) { return ids.indexOf(a.id) - ids.indexOf(b.id); }); lazySave(); }
        });
      });

      var pvFrame = q('pv-board');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-styret-preview', content: data }, '*'); } catch (e) {} }
      function onPreviewMsg(e) { if (e.data && e.data.type === 'apeiron-styret-preview-ready') { pushPreview(); fitPreview(); } }
      function fitPreview() {
        var wrap = host.querySelector('.pv-board-wrap');
        if (!pvFrame || !wrap) return;
        var W = wrap.clientWidth; if (!W) return;
        var contentW = (window.AdminCommon && AdminCommon.getPreviewWidth) ? AdminCommon.getPreviewWidth() : 1180;
        var scale = Math.min(1, W / contentW);
        var visibleH = Math.max(420, Math.min(680, Math.round(window.innerHeight * 0.66)));
        pvFrame.style.width = contentW + 'px';
        pvFrame.style.height = Math.round(visibleH / scale) + 'px';
        pvFrame.style.transform = 'scale(' + scale + ')';
        wrap.style.height = visibleH + 'px';
      }
      window.addEventListener('message', onPreviewMsg);
      window.addEventListener('resize', fitPreview);
      if (pvFrame) pvFrame.addEventListener('load', fitPreview);

      loadData(); renderAll();
      fitPreview(); setTimeout(fitPreview, 80);
      pushPreview(); setTimeout(pushPreview, 150);

      return {
        export: exportFile,
        destroy: function () { window.removeEventListener('message', onPreviewMsg); window.removeEventListener('resize', fitPreview); }
      };
    }
  });
})();
