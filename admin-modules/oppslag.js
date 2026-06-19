/* ============================================================
   admin-modules/oppslag.js — Oppslagstavla-editor som C-modul
   Erstatter oppslagstavla-admin.html. Krever palette.js og oppslag-content.js
   (OPPSLAG_CONTENT), som skallet (admin.html) laster.
   Live forhåndsvisning via oppslagstavla.html?preview=1.
   Rydder opp (destroy) etter body-monterte crop-/stedvelger-elementer +
   globale lyttere når man bytter panel.
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('oppslag', {
    title: 'Oppslagstavla',
    see: { href: 'oppslagstavla.html', label: 'Se Oppslagstavla ↗' },
    exportName: 'oppslag-content.js',

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live fra den ekte Oppslagstavla — endringene dine vises umiddelbart, akkurat slik plakatene henger på siden.</p>'
          + '<div class="pv-board-wrap"><iframe id="pv-board" src="oppslagstavla.html?preview=1" title="Forhåndsvisning av Oppslagstavla"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du Oppslagstavla</strong>'
          + '<ol>'
            + '<li>Rediger plakatene nedenfor — klikk på et felt for å redigere det</li>'
            + '<li>Last opp plakatbildet ved å <b>klikke på bildefeltet</b> eller dra et bilde inn — hover over bildet for å <b>↻ rotere</b> eller <b>⛶ beskjære/zoome</b></li>'
            + '<li>Klikk <b>↓ Last ned alle endrede</b> oppe til høyre</li>'
            + '<li>Erstatt <code>oppslag-content.js</code> i GitHub-repositoriet og push/commit</li>'
            + '<li>Cloudflare oppdaterer nettsiden automatisk innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren din. Nyeste plakat bør ligge øverst — dra i ⠿ for å sortere. Klikk <b>● Aktiv / ✓ Ferdig</b> på en plakat for å arkivere den — arkiverte plakater vises i «Tidligere oppslag» på oppslagstavla-siden, men ikke på forsiden.</div>'
        + '</div>'
        + '<div class="meta-panel"><h3>Overskrift øverst på siden</h3>'
          + '<div class="meta-grid">'
            + '<div class="fg narrow"><label data-help="Liten etikett over overskriften, f.eks. «Oppslagstavla».">Eyebrow</label><input type="text" id="meta-eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="meta-heading"></div>'
            + '<div class="fg"><label>Ingress</label><input type="text" id="meta-lede"></div>'
          + '</div>'
        + '</div>'
        + '<div class="sec"><div class="sec-head"><h2>Plakater</h2><span class="count" id="count-posters"></span><button class="btn-add" type="button" data-add="posters">+ Ny plakat</button></div><div class="list" id="list-posters"></div></div>'
        + '<input type="file" data-file accept="image/png,image/jpeg,image/webp,image/avif" hidden>';

      var q = function (id) { return host.querySelector('#' + id); };
      var LS_KEY = 'apeiron-oppslag-v1';
      var esc = AC.esc;
      var data = { intro: {}, posters: [] };

      function fresh() {
        var c = window.OPPSLAG_CONTENT || {};
        return {
          intro: Object.assign({ eyebrow: 'Oppslagstavla', heading: '', lede: '' }, c.intro || {}),
          posters: (c.posters || []).map(function (x) { return Object.assign({}, x); })
        };
      }
      function normalize() { data.intro = data.intro || {}; data.posters = data.posters || []; }
      function loadData() {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) { try { data = JSON.parse(raw); normalize(); return; } catch (_) {} }
        data = fresh();
      }
      function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(data)); AC.toast('Lagret i nettleseren'); pushPreview(); }
      var saveTimer = null;
      function lazySave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveData, 350); }
      function uid(pfx) { return pfx + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
      function find(id) { return data.posters.find(function (x) { return x.id === id; }); }

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
            var MAX = 1600, w = img.width, h = img.height;
            if (Math.max(w, h) > MAX) { var s = MAX / Math.max(w, h); w = Math.round(w * s); h = Math.round(h * s); }
            var canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            var _ctx = canvas.getContext('2d');
            _ctx.imageSmoothingEnabled = true; _ctx.imageSmoothingQuality = 'high';
            _ctx.drawImage(img, 0, 0, w, h);
            var url = canvas.toDataURL('image/webp', 0.92);
            AC.checkImageSize(url);
            var a = find(tgt.id);
            if (a) a.img = url;
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
        var rotBtn = zone.querySelector('.btn-rot-img');
        var cropBtn = zone.querySelector('.btn-crop-img');
        var overlay = zone.querySelector('.img-overlay');
        if (url) {
          if (!preview) { preview = document.createElement('img'); preview.className = 'img-preview'; preview.alt = ''; zone.appendChild(preview); }
          preview.style.display = 'block'; preview.src = url;
          ph.style.display = 'none'; clrBtn.style.display = 'flex'; overlay.textContent = '↺ Bytt bilde';
          if (rotBtn) rotBtn.style.display = ''; if (cropBtn) cropBtn.style.display = '';
        } else {
          if (preview) { preview.style.display = 'none'; preview.src = ''; }
          ph.style.display = 'flex'; clrBtn.style.display = 'none'; overlay.textContent = '📷 Last opp';
          if (rotBtn) rotBtn.style.display = 'none'; if (cropBtn) cropBtn.style.display = 'none';
        }
      }

      function posterCard(p) {
        var card = document.createElement('div');
        card.className = 'card' + (p.done ? ' is-done' : ''); card.setAttribute('data-id', p.id);
        card.innerHTML =
          '<div class="card-head"><span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<span class="card-title">' + esc(p.title || '(uten tittel)') + '</span>'
            + '<div class="order-btns"><button class="btn-ord btn-up" type="button" title="Opp">↑</button><button class="btn-ord btn-dn" type="button" title="Ned">↓</button></div>'
            + '<button class="btn-status btn-status--' + (p.done ? 'done' : 'active') + '" type="button" title="Klikk for å veksle status">' + (p.done ? '✓ Ferdig' : '● Aktiv') + '</button>'
            + '<button class="btn-del" type="button">Slett</button></div>'
          + '<div class="card-body">'
            + '<div class="img-zone"><div class="img-ph"><img src="assets/apeiron-logo.png" alt=""><span>Klikk eller dra inn plakat</span></div><div class="img-overlay">📷 Last opp</div><button class="btn-rot-img" type="button" title="Roter 90°">↻</button><button class="btn-crop-img" type="button" title="Beskrivær / zoom">⛶</button><button class="btn-clr-img" type="button" title="Fjern">✕</button></div>'
            + '<div class="fields">'
              + '<div class="fg"><label>Tittel</label><input type="text" data-f="title" value="' + esc(p.title) + '" placeholder="f.eks. Aporetisk Aften"></div>'
              + '<div class="frow">'
                + '<div class="fg"><label data-help="Fritekst-dato, f.eks. «14. mars» eller «Hele semesteret».">Dato</label><input type="text" data-f="date" value="' + esc(p.date) + '" placeholder="f.eks. 14. mars"></div>'
                + '<div class="fg"><label>Pin-farge</label><div data-accent-host></div></div>'
              + '</div>'
              + '<div class="fg"><label>Undertekst (valgfri)</label><textarea data-f="note" placeholder="Én kort linje om plakaten...">' + esc(p.note) + '</textarea></div>'
              + '<div class="frow">'
                + '<div class="fg"><label data-help="Hvor «Les mer» går — klikk 📍 for å velge side og seksjon, eller skriv en https-lenke. La stå tom for ingen lenke.">Lenke (valgfri)</label><div class="addr-wrap"><input type="text" data-f="link" value="' + esc(p.link) + '" placeholder="index.html#aporetisk"><button class="btn-loc" type="button" title="Velg side og seksjon">📍</button></div></div>'
                + '<div class="fg narrow"><label>Lenketekst</label><input type="text" data-f="linkLabel" value="' + esc(p.linkLabel) + '" placeholder="Les mer"></div>'
              + '</div>'
            + '</div>'
          + '</div>';

        var zone = card.querySelector('.img-zone');
        if (p.img) refreshImgZone(zone, p.img);
        zone.addEventListener('click', function () { openPicker(p.id); });
        zone.addEventListener('dragenter', function (e) { e.preventDefault(); zone.setAttribute('data-over', ''); });
        zone.addEventListener('dragover', function (e) { e.preventDefault(); });
        zone.addEventListener('dragleave', function () { zone.removeAttribute('data-over'); });
        zone.addEventListener('drop', function (e) { e.preventDefault(); zone.removeAttribute('data-over'); var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) processImage(f, { id: p.id }); });
        card.querySelector('.btn-clr-img').addEventListener('click', function (e) { e.stopPropagation(); p.img = null; refreshImgZone(zone, null); lazySave(); });

        card.querySelectorAll('[data-f]').forEach(function (el) {
          var field = el.getAttribute('data-f');
          el.addEventListener('input', function () { p[field] = el.value; if (field === 'title') card.querySelector('.card-title').textContent = el.value || '(uten tittel)'; lazySave(); });
        });
        var accentHost = card.querySelector('[data-accent-host]');
        if (accentHost && window.createColorControl) accentHost.appendChild(window.createColorControl({ value: p.accent || '', emptyLabel: 'Gull (standard)', onChange: function (v) { p.accent = v; lazySave(); } }));
        card.querySelector('.btn-up').addEventListener('click', function () { move(p.id, -1); });
        card.querySelector('.btn-dn').addEventListener('click', function () { move(p.id, 1); });
        card.querySelector('.btn-del').addEventListener('click', function () { if (confirm('Slett «' + (p.title || 'denne plakaten') + '»?')) del(p.id); });
        var rotBtn = card.querySelector('.btn-rot-img');
        var cropBtn = card.querySelector('.btn-crop-img');
        if (rotBtn) rotBtn.addEventListener('click', function (e) { e.stopPropagation(); rotateImage(p.id); });
        if (cropBtn) cropBtn.addEventListener('click', function (e) { e.stopPropagation(); openCrop(p.id); });
        var statusBtn = card.querySelector('.btn-status');
        statusBtn.addEventListener('click', function () {
          p.done = !p.done;
          statusBtn.className = 'btn-status btn-status--' + (p.done ? 'done' : 'active');
          statusBtn.textContent = p.done ? '✓ Ferdig' : '● Aktiv';
          card.classList.toggle('is-done', !!p.done);
          lazySave();
        });
        wireLoc(card);
        return card;
      }

      function renderList() {
        var el = q('list-posters'); el.innerHTML = '';
        data.posters.forEach(function (item) { el.appendChild(posterCard(item)); });
        q('count-posters').textContent = data.posters.length + (data.posters.length === 1 ? ' plakat' : ' plakater');
      }
      function renderMeta() {
        host.querySelectorAll('[id^="meta-"]').forEach(function () {});
        q('meta-eyebrow').value = data.intro.eyebrow || ''; q('meta-heading').value = data.intro.heading || ''; q('meta-lede').value = data.intro.lede || '';
      }
      function renderAll() { renderMeta(); renderList(); AC.enhanceHelp(host); }

      function add() {
        data.posters.unshift({ id: uid('p'), title: '', date: '', note: '', img: null, link: '', linkLabel: '', accent: '', done: false });
        renderList(); lazySave();
        setTimeout(function () { var first = host.querySelector('#list-posters .card:first-child'); if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
      }
      function del(id) { data.posters = data.posters.filter(function (x) { return x.id !== id; }); renderList(); lazySave(); }
      function move(id, dir) {
        var arr = data.posters, i = arr.findIndex(function (x) { return x.id === id; });
        if (i < 0) return; var j = i + dir; if (j < 0 || j >= arr.length) return;
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t; renderList(); lazySave();
      }
      function wireMeta(id, key) { q(id).addEventListener('input', function () { data.intro[key] = this.value; lazySave(); }); }
      wireMeta('meta-eyebrow', 'eyebrow'); wireMeta('meta-heading', 'heading'); wireMeta('meta-lede', 'lede');

      function exportFile() {
        var out = JSON.parse(JSON.stringify(data));
        var content =
          '/* Innhold for Oppslagstavla (oppslagstavla.html).\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Rediger direkte her, eller åpne Admin-senteret → Oppslagstavla.\n'
          + '\n'
          + '   posters[].img       : "assets/oppslag/filnavn.webp", base64-bilde fra admin, eller null.\n'
          + '   posters[].date      : fritekst-dato.\n'
          + '   posters[].link      : valgfri lenke (side.html#anker eller https://…).\n'
          + '   posters[].accent    : pin-/aksentfarge — palettnavn ("" = gull) eller { light, dark }.\n'
          + '   posters[].done      : true = arkivert (vises i «Tidligere oppslag»). */\n\n'
          + 'window.OPPSLAG_CONTENT = ' + JSON.stringify(out, null, 2) + ';\n';
        AC.saveFile('oppslag-content.js', content);
        AC.toast('Fil lastet ned — erstatt i GitHub og push!');
      }

      q('reset-btn').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); data = fresh(); renderAll(); AC.toast('Tilbakestilt til publisert versjon'); pushPreview();
      });
      host.querySelector('[data-add="posters"]').addEventListener('click', add);

      AC.enableDragSort(q('list-posters'), {
        itemSelector: '.card', handleSelector: '.drag-handle',
        onReorder: function (ids) { data.posters.sort(function (a, b) { return ids.indexOf(a.id) - ids.indexOf(b.id); }); lazySave(); }
      });

      /* ── live forhåndsvisning ── */
      var pvFrame = q('pv-board');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-oppslag-preview', content: data }, '*'); } catch (e) {} }
      function onPreviewMsg(e) { if (e.data && e.data.type === 'apeiron-oppslag-preview-ready') { pushPreview(); fitPreview(); } }
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

      /* ── bilderediger: roter ── */
      function rotateImage(id) {
        var p = find(id); if (!p || !p.img) return;
        var im = new Image();
        im.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = im.height; canvas.height = im.width;
          var ctx = canvas.getContext('2d');
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(Math.PI / 2);
          ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(im, -im.width / 2, -im.height / 2);
          p.img = canvas.toDataURL('image/webp', 0.92);
          var zone = host.querySelector('[data-id="' + id + '"] .img-zone');
          if (zone) refreshImgZone(zone, p.img);
          lazySave();
        };
        im.src = p.img;
      }

      /* ── bilderediger: crop/zoom (modal på document.body) ── */
      var cropState = null, cropEls = null;
      function cropKeydown(e) { if (e.key === 'Escape' && cropState) closeCrop(); }
      function buildCropModal() {
        if (cropEls) return cropEls;
        var ov = document.createElement('div');
        ov.className = 'crop-ov';
        ov.innerHTML =
          '<div class="crop-box"><h3>Beskrivær / zoom</h3>'
            + '<div class="crop-view"><img alt=""></div>'
            + '<div class="crop-row"><span>Zoom</span><input type="range" class="crop-zoom" min="1" max="4" step="0.01" value="1"></div>'
            + '<p class="crop-hint">Dra bildet for å flytte. Zoom med glidebryteren eller scrollhjulet. «Bruk» beskriværer til et kvadrat.</p>'
            + '<div class="crop-actions"><button type="button" class="crop-cancel">Avbryt</button><button type="button" class="crop-apply">Bruk</button></div>'
          + '</div>';
        document.body.appendChild(ov);
        var view = ov.querySelector('.crop-view');
        var cimg = ov.querySelector('.crop-view img');
        var zoom = ov.querySelector('.crop-zoom');
        cropEls = { ov: ov, view: view, img: cimg, zoom: zoom };
        ov.addEventListener('click', function (e) { if (e.target === ov) closeCrop(); });
        ov.querySelector('.crop-cancel').addEventListener('click', closeCrop);
        ov.querySelector('.crop-apply').addEventListener('click', applyCrop);
        zoom.addEventListener('input', function () { setCropZoom(parseFloat(zoom.value)); });
        var dragging = false, lastX = 0, lastY = 0;
        view.addEventListener('pointerdown', function (e) { if (!cropState) return; dragging = true; lastX = e.clientX; lastY = e.clientY; try { view.setPointerCapture(e.pointerId); } catch (_) {} e.preventDefault(); });
        view.addEventListener('pointermove', function (e) { if (!dragging || !cropState) return; cropState.x += e.clientX - lastX; cropState.y += e.clientY - lastY; lastX = e.clientX; lastY = e.clientY; clampCrop(); applyCropView(); });
        function endDrag(e) { dragging = false; try { view.releasePointerCapture(e.pointerId); } catch (_) {} }
        view.addEventListener('pointerup', endDrag);
        view.addEventListener('pointercancel', endDrag);
        view.addEventListener('wheel', function (e) {
          if (!cropState) return; e.preventDefault();
          var rect = view.getBoundingClientRect();
          var z = (cropState.s / cropState.base) * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
          z = Math.max(1, Math.min(4, z));
          cropZoomAt(cropState.base * z, e.clientX - rect.left, e.clientY - rect.top);
        }, { passive: false });
        document.addEventListener('keydown', cropKeydown);
        return cropEls;
      }
      function openCrop(id) {
        var p = find(id); if (!p || !p.img) return;
        var els = buildCropModal();
        els.ov.classList.add('on'); els.img.src = p.img;
        var image = new Image();
        image.onload = function () {
          var V = els.view.clientWidth || 320;
          var base = V / Math.min(image.naturalWidth, image.naturalHeight);
          cropState = { posterId: id, img: image, V: V, base: base, s: base, x: 0, y: 0 };
          cropState.x = (V - image.naturalWidth * cropState.s) / 2;
          cropState.y = (V - image.naturalHeight * cropState.s) / 2;
          els.zoom.value = '1'; clampCrop(); applyCropView();
        };
        image.src = p.img;
      }
      function setCropZoom(z) { if (!cropState) return; cropZoomAt(cropState.base * z, cropState.V / 2, cropState.V / 2); }
      function cropZoomAt(newS, px, py) {
        if (!cropState) return;
        var ix = (px - cropState.x) / cropState.s, iy = (py - cropState.y) / cropState.s;
        cropState.s = newS;
        cropState.x = px - ix * cropState.s; cropState.y = py - iy * cropState.s;
        clampCrop(); applyCropView();
        if (cropEls) cropEls.zoom.value = String(Math.max(1, Math.min(4, cropState.s / cropState.base)));
      }
      function clampCrop() {
        if (!cropState) return;
        var V = cropState.V;
        var w = cropState.img.naturalWidth * cropState.s, h = cropState.img.naturalHeight * cropState.s;
        cropState.x = w <= V ? (V - w) / 2 : Math.max(V - w, Math.min(0, cropState.x));
        cropState.y = h <= V ? (V - h) / 2 : Math.max(V - h, Math.min(0, cropState.y));
      }
      function applyCropView() {
        if (!cropEls || !cropState) return;
        cropEls.img.style.width = (cropState.img.naturalWidth * cropState.s) + 'px';
        cropEls.img.style.height = (cropState.img.naturalHeight * cropState.s) + 'px';
        cropEls.img.style.left = cropState.x + 'px'; cropEls.img.style.top = cropState.y + 'px';
      }
      function closeCrop() { if (cropEls) cropEls.ov.classList.remove('on'); cropState = null; }
      function applyCrop() {
        if (!cropState) return;
        var s = cropState.s, V = cropState.V;
        var sx = -cropState.x / s, sy = -cropState.y / s, sw = V / s, sh = V / s;
        var OUT = Math.min(1600, Math.max(1, Math.round(sw)));
        var canvas = document.createElement('canvas');
        canvas.width = OUT; canvas.height = OUT;
        var _cctx = canvas.getContext('2d');
        _cctx.imageSmoothingEnabled = true; _cctx.imageSmoothingQuality = 'high';
        _cctx.drawImage(cropState.img, sx, sy, sw, sh, 0, 0, OUT, OUT);
        var url = canvas.toDataURL('image/webp', 0.92);
        var p = find(cropState.posterId);
        if (p) { p.img = url; var zone = host.querySelector('[data-id="' + cropState.posterId + '"] .img-zone'); if (zone) refreshImgZone(zone, url); lazySave(); }
        closeCrop();
      }

      /* ── stedvelger (for lenke-feltet) — popover på document.body ── */
      var PAGE_SECTIONS = [
        { file: 'index.html', name: 'Forsiden', sections: [
          { anchor: 'arrangementer', name: 'Arrangementer' }, { anchor: 'oppslagstavla-teaser', name: 'Oppslagstavla (forside-teaser)' },
          { anchor: 'aporetisk', name: 'Aporetisk Aften' }, { anchor: 'fadderuke', name: 'Fadderuke' },
          { anchor: 'bli-medlem', name: 'Bli medlem' }, { anchor: 'kontakt', name: 'Kontakt' } ] },
        { file: 'oppslagstavla.html', name: 'Oppslagstavla', sections: [ { anchor: 'oppslagstavla', name: 'Alle plakater' }, { anchor: 'tidligere-oppslag', name: 'Tidligere oppslag' } ] },
        { file: 'om-oss.html', name: 'Om oss', sections: [ { anchor: 'om', name: 'Om oss' }, { anchor: 'samarbeid', name: 'Fellesskap & samarbeid' }, { anchor: 'lesesalen', name: 'Lesesalen' }, { anchor: 'mot-styret', name: 'Møt styret' }, { anchor: 'bli-medlem', name: 'Bli medlem' }, { anchor: 'faq', name: 'Ofte stilte spørsmål' } ] },
        { file: 'styret.html', name: 'Styret', sections: [ { anchor: 'styremedlemmer', name: 'Styremedlemmer' }, { anchor: 'tillitsvalgte', name: 'Tillitsvalgte' }, { anchor: 'sak', name: 'S.A.K' }, { anchor: 'vervene', name: 'Om vervene' } ] },
        { file: 'begrep.html', name: 'Begrep', sections: [ { anchor: 'om', name: 'Om Begrep' }, { anchor: 'utgavene', name: 'Tidsskriftet' }, { anchor: 'podkast', name: 'Podkasten' }, { anchor: 'film', name: 'Filmproduksjon' }, { anchor: 'julekalender', name: 'Hilbert Hotell (julekalender)' }, { anchor: 'kontakt', name: 'Bidra & kontakt' } ] },
        { file: 'hjelp.html', name: 'Hjelp & støtte', sections: [ { anchor: 'sifra', name: 'Si fra' }, { anchor: 'studier', name: 'Faglig hjelp' }, { anchor: 'helse', name: 'Psykisk helse' }, { anchor: 'fysisk', name: 'Fysisk helse' }, { anchor: 'akutt', name: 'Akutt hjelp' } ] },
        { file: 'galleri.html', name: 'Galleri', sections: [ { anchor: 'galleri', name: 'Bildegalleri' } ] },
        { file: 'pensum.html', name: 'Pensum', sections: [] },
        { file: 'merch.html', name: 'Merch', sections: [ { anchor: 'butikk', name: 'Produkter' } ] },
        { file: 'marked.html', name: 'Kjøp & bytte', sections: [] }
      ];
      var locPop = null;
      function locDocClick(e) { if (!locPop || locPop.style.display === 'none') return; if (locPop.contains(e.target) || (e.target.closest && e.target.closest('.btn-loc'))) return; closePop(); }
      function locWinResize() { if (locPop && locPop.style.display !== 'none') positionPop(locPop._target); }
      function buildPicker() {
        if (locPop) return;
        locPop = document.createElement('div');
        locPop.className = 'locpop';
        locPop.innerHTML =
          '<div class="locpop__head"><span class="ttl">Velg side eller seksjon</span></div>'
          + '<div class="locpop__search"><input type="text" placeholder="Søk side eller seksjon…" aria-label="Søk"></div>'
          + '<div class="locpop__list"></div>';
        document.body.appendChild(locPop);
        var search = locPop.querySelector('.locpop__search input');
        search.addEventListener('input', function () { locPop._q = search.value; renderLocList(search.value); positionPop(locPop._target); });
        search.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') { closePop(); return; }
          if (e.key === 'Enter') { e.preventDefault(); var first = locPop.querySelector('.locpop__list [data-href]'); if (first) chooseLoc(first.getAttribute('data-href')); }
        });
        document.addEventListener('click', locDocClick);
        window.addEventListener('resize', locWinResize);
      }
      function renderLocList(query) {
        var list = locPop.querySelector('.locpop__list');
        var cur = locPop._target ? locPop._target.value.trim() : '';
        query = (query || '').toLowerCase().trim();
        var html = '', any = false;
        PAGE_SECTIONS.forEach(function (pg) {
          var pageMatch = pg.name.toLowerCase().indexOf(query) >= 0 || pg.file.toLowerCase().indexOf(query) >= 0;
          var secs = pg.sections.filter(function (s) { return pageMatch || s.name.toLowerCase().indexOf(query) >= 0 || ('#' + s.anchor).indexOf(query) >= 0; });
          if (!pageMatch && !secs.length) return;
          any = true;
          html += '<div class="locpop__pg"><button type="button" data-href="' + esc(pg.file) + '">' + esc(pg.name) + '</button><span class="file">' + esc(pg.file) + '</span></div>';
          secs.forEach(function (s) { var href = pg.file + '#' + s.anchor; html += '<button type="button" class="locpop__sec' + (href === cur ? ' cur' : '') + '" data-href="' + esc(href) + '">' + esc(s.name) + ' <span class="anch">#' + esc(s.anchor) + '</span></button>'; });
        });
        if (!any) html = '<div class="locpop__empty">Ingen treff på «' + esc(query) + '»</div>';
        list.innerHTML = html;
        list.querySelectorAll('[data-href]').forEach(function (b) { b.addEventListener('click', function () { chooseLoc(b.getAttribute('data-href')); }); });
      }
      function chooseLoc(href) { var input = locPop._target; if (input) { input.value = href; input.dispatchEvent(new Event('input', { bubbles: true })); } closePop(); }
      function closePop() { if (locPop) locPop.style.display = 'none'; }
      function positionPop(input) {
        if (!locPop || !input) return;
        var r = input.getBoundingClientRect();
        var pw = locPop.offsetWidth || 344, ph = locPop.offsetHeight || 360;
        var left = r.left;
        if (left + pw > window.innerWidth - 8) left = window.innerWidth - 8 - pw;
        if (left < 8) left = 8;
        var top = r.bottom + 6;
        if (top + ph > window.innerHeight - 8) { top = r.top - 6 - ph; if (top < 8) top = 8; }
        locPop.style.left = left + 'px'; locPop.style.top = top + 'px';
      }
      function openLocPicker(input) {
        buildPicker();
        if (locPop.style.display !== 'none' && locPop._target === input) { closePop(); return; }
        locPop._target = input; locPop._q = '';
        var s = locPop.querySelector('.locpop__search input');
        s.value = ''; renderLocList('');
        locPop.style.display = 'flex'; positionPop(input);
        setTimeout(function () { s.focus(); }, 0);
      }
      function wireLoc(scope) {
        if (!scope) return;
        var btn = scope.querySelector('.btn-loc');
        if (!btn) return;
        var input = scope.querySelector('[data-f="link"]');
        btn.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); openLocPicker(input); });
      }

      loadData(); renderAll();
      fitPreview(); setTimeout(fitPreview, 80);
      pushPreview(); setTimeout(pushPreview, 150);

      return {
        export: exportFile,
        destroy: function () {
          window.removeEventListener('message', onPreviewMsg);
          window.removeEventListener('resize', fitPreview);
          document.removeEventListener('keydown', cropKeydown);
          document.removeEventListener('click', locDocClick);
          window.removeEventListener('resize', locWinResize);
          if (cropEls && cropEls.ov && cropEls.ov.parentNode) cropEls.ov.parentNode.removeChild(cropEls.ov);
          if (locPop && locPop.parentNode) locPop.parentNode.removeChild(locPop);
          cropEls = null; locPop = null;
        }
      };
    }
  });
})();
