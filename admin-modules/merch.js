/* ============================================================
   admin-modules/merch.js — Merch-editor (produkter) som C-modul
   Erstatter merch-admin.html. Krever palette.js (createColorControl,
   APEIRON_ANIMATED) og merch-products.js (MERCH_PRODUCTS / MERCH_INFO),
   som skallet (admin.html) laster. Live forhåndsvisning via merch.html?preview=1.
   Bildegalleri pr. produkt med crop/zoom (modal på body), rotasjon,
   farge-bilde-kobling, badge, fargekontroller. Rydder opp på destroy.
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('merch', {
    title: 'Merch',
    see: { href: 'merch.html', label: 'Se merch-siden ↗' },
    exportName: 'merch-products.js',

    searchEntries: function () {
      var d = window.AdminCommon.readDraftOr('apeiron-merch-v1', 'MERCH_PRODUCTS');
      var arr = Array.isArray(d) ? d : ((d && d.products) || []);
      return arr.map(function (p) {
        if (!p || !p.name) return null;
        var desc = String(p.desc || '').split('\n')[0].trim();
        var price = (p.price == null) ? 'Kommer snart'
          : (p.price + ',–' + ((p.memberPrice != null) ? (' (' + p.memberPrice + ',– for medlemmer)') : ''));
        return { t: p.name, d: (desc ? desc + ' · ' : '') + price, u: 'merch.html#butikk', g: 'Merch' };
      }).filter(Boolean);
    },

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live fra den ekte merch-siden — bla i ruta for å se hele siden (info-tekst, «Merch»-toppen og bestillingsboksen nederst). Endringene dine vises umiddelbart.</p>'
          + '<div class="pv-shop-wrap"><iframe id="pv-shop" src="merch.html?preview=1" title="Forhåndsvisning av butikken"></iframe></div>'
        + '</section>'
        + '<div class="editor-col">'
          + '<div class="tip">'
            + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
            + '<strong>Slik oppdaterer du merch-siden</strong>'
            + '<ol>'
              + '<li>Rediger produktene nedenfor — klikk på et felt for å redigere det</li>'
              + '<li>Last opp bilder ved å <b>klikke på bildefeltet</b> eller dra bilder inn på det (du kan velge flere)</li>'
              + '<li><b>Koble farger til bilder:</b> har produktet farger, kan du på hvert bilde velge hvilken farge det hører til — da byttes hovedbildet i butikken når kunden velger den fargen</li>'
              + '<li>Trykk <b>☁ Publiser til GitHub</b> oppe til høyre — endringene legges ut automatisk</li>'
            + '</ol>'
            + '<div class="tip-note">🖼️ <b>Bilder pr. produkt:</b> Det <b>første</b> bildet er hovedbildet («Hoved»). På hver miniatyr: <b>⠿</b> dra rekkefølge · <b>⛶</b> beskjær/zoom · <b>↻</b> roter · <b>✕</b> slett. Har produktet farger, kan du koble et bilde til en farge.</div>'
            + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren din. Last ned filen for å publisere.</div>'
          + '</div>'
          + '<div class="info-edit">'
            + '<label for="info-input"><strong>Info-tekst øverst i butikken</strong></label>'
            + '<p class="info-edit__hint">Vises i en boks øverst på merch-siden — f.eks. leveringstid, henteinfo eller en beskjed. La stå tom for å skjule boksen. Dobbelt linjeskift gir nytt avsnitt.</p>'
            + '<textarea id="info-input" rows="3" placeholder="F.eks. «Neste utlevering på lesesalen torsdag 12. juni. Bestill innen mandag!»"></textarea>'
            + '<div class="fg" style="margin-top:12px"><label for="info-label-input">Merkelapp over teksten</label>'
              + '<input type="text" id="info-label-input" placeholder="f.eks. «Merk», «Nyhet», «Viktig» — tom = ingen merkelapp">'
              + '<p class="info-edit__hint" style="margin-top:6px">Den lille gull-teksten med ✦-stjernen øverst i boksen. La stå tom for å fjerne den helt.</p>'
            + '</div>'
          + '</div>'
          + '<div class="info-edit">'
            + '<label><strong>Topp-banner</strong></label>'
            + '<p class="info-edit__hint">Tittelen og teksten øverst på merch-siden.</p>'
            + '<div class="fg"><label>Tilbake-lenke (tekst)</label><input type="text" id="msh-back"></div>'
            + '<div class="fg"><label>Tittel</label><input type="text" id="msh-title"></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="msh-lede" rows="2"></textarea></div>'
          + '</div>'
          + '<div style="display:flex;justify-content:flex-end;margin-bottom:14px"><button class="btn-add" id="add-btn" type="button">+ Nytt produkt</button></div>'
          + '<div id="plist"></div>'
        + '</div>'
        + '<input type="file" data-file accept="image/png,image/jpeg,image/webp,image/avif" multiple hidden>';

      var q = function (id) { return host.querySelector('#' + id); };
      var LS_KEY = 'apeiron-merch-v1';
      var LS_INFO_KEY = 'apeiron-merch-info-v1';
      var LS_INFO_LABEL_KEY = 'apeiron-merch-info-label-v1';
      var LS_SUBHERO_KEY = 'apeiron-merch-subhero-v1';
      var products = [];
      var info = '';
      var infoLabel = 'Merk';
      var subhero = {};

      function fromPublished() { return (window.MERCH_PRODUCTS || []).map(function (p) { return Object.assign({}, p); }); }
      function loadData() {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) { try { products = JSON.parse(raw); } catch (_) { products = fromPublished(); } } else { products = fromPublished(); }
        normalizeProducts();
        var rawInfo = localStorage.getItem(LS_INFO_KEY);
        info = rawInfo != null ? rawInfo : (window.MERCH_INFO || '');
        var rawLabel = localStorage.getItem(LS_INFO_LABEL_KEY);
        infoLabel = rawLabel != null ? rawLabel : (window.MERCH_INFO_LABEL != null ? window.MERCH_INFO_LABEL : 'Merk');
        var rawSh = localStorage.getItem(LS_SUBHERO_KEY);
        try { subhero = rawSh != null ? (JSON.parse(rawSh) || {}) : Object.assign({}, window.MERCH_SUBHERO || {}); } catch (_) { subhero = Object.assign({}, window.MERCH_SUBHERO || {}); }
      }
      function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(products)); localStorage.setItem(LS_INFO_KEY, info); localStorage.setItem(LS_INFO_LABEL_KEY, infoLabel); localStorage.setItem(LS_SUBHERO_KEY, JSON.stringify(subhero)); AC.toast('Lagret i nettleseren'); pushPreview(); }
      var saveTimer = null;
      function lazySave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveData, 350); }
      function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
      function uid() { return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
      function prod(id) { return products.find(function (x) { return x.id === id; }); }

      function normalizeProducts() {
        products.forEach(function (p) {
          if (!Array.isArray(p.images)) p.images = (p.img ? [p.img] : []);
          p.images = p.images.filter(function (u) { return typeof u === 'string' && u; });
          if (!p.colorImages || typeof p.colorImages !== 'object') p.colorImages = {};
          syncPrimary(p);
        });
      }
      function syncPrimary(p) { p.img = p.images.length ? p.images[0] : null; }

      var fileInput = host.querySelector('[data-file]');
      var imgTarget = null;
      fileInput.addEventListener('change', function () {
        var files = fileInput.files;
        if (files && files.length && imgTarget) addImages(imgTarget, files);
        fileInput.value = '';
      });
      function openPicker(id) { imgTarget = id; fileInput.click(); }

      function toWebp(file) {
        return new Promise(function (resolve, reject) {
          var reader = new FileReader();
          reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
              var MAX = 900, w = img.width, h = img.height;
              if (Math.max(w, h) > MAX) { var s = MAX / Math.max(w, h); w = Math.round(w * s); h = Math.round(h * s); }
              var canvas = document.createElement('canvas');
              canvas.width = w; canvas.height = h;
              canvas.getContext('2d').drawImage(img, 0, 0, w, h);
              var _u = canvas.toDataURL('image/webp', 0.82);
              if (window.AdminCommon) AdminCommon.checkImageSize(_u);
              resolve(_u);
            };
            img.onerror = reject; img.src = e.target.result;
          };
          reader.onerror = reject; reader.readAsDataURL(file);
        });
      }
      function addImages(prodId, fileList) {
        var p = prod(prodId); if (!p) return;
        var files = Array.prototype.slice.call(fileList).filter(function (f) { return f && /^image\//.test(f.type); });
        Promise.all(files.map(toWebp)).then(function (urls) {
          urls.forEach(function (u) { p.images.push(u); });
          syncPrimary(p); renderGallery(prodId); lazySave();
        });
      }
      function removeImageAt(prodId, idx) {
        var p = prod(prodId); if (!p || idx < 0 || idx >= p.images.length) return;
        var prevImages = p.images.slice();
        var prevColorImages = Object.assign({}, p.colorImages || {});
        p.images.splice(idx, 1);
        var cm = p.colorImages || {};
        Object.keys(cm).forEach(function (c) { if (cm[c] === idx) delete cm[c]; else if (cm[c] > idx) cm[c] = cm[c] - 1; });
        syncPrimary(p); renderGallery(prodId); lazySave();
        AC.undoable('Bilde fjernet', function () {
          var pp = prod(prodId); if (!pp) return;
          pp.images = prevImages.slice();
          pp.colorImages = Object.assign({}, prevColorImages);
          syncPrimary(pp); renderGallery(prodId); lazySave();
        });
      }
      function rotateImageAt(prodId, idx) {
        var p = prod(prodId); if (!p || !p.images[idx]) return;
        var prev = p.images[idx];
        var img = new Image();
        img.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = img.height; canvas.height = img.width;
          var ctx = canvas.getContext('2d');
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(Math.PI / 2);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          p.images[idx] = canvas.toDataURL('image/webp', 0.82);
          syncPrimary(p); renderGallery(prodId); lazySave();
          AC.undoable('Bilde rotert', function () {
            var pp = prod(prodId); if (pp && pp.images[idx] != null) { pp.images[idx] = prev; syncPrimary(pp); renderGallery(prodId); lazySave(); }
          });
        };
        img.src = p.images[idx];
      }
      function reorderImages(prodId, ids) {
        var p = prod(prodId); if (!p) return;
        var order = ids.map(function (s) { return parseInt(s, 10); }).filter(function (n) { return !isNaN(n) && n < p.images.length; });
        if (order.length !== p.images.length) { renderGallery(prodId); return; }
        var newImages = order.map(function (oi) { return p.images[oi]; });
        var remap = {}; order.forEach(function (oi, ni) { remap[oi] = ni; });
        var cm = p.colorImages || {}; var ncm = {};
        Object.keys(cm).forEach(function (c) { if (remap[cm[c]] != null) ncm[c] = remap[cm[c]]; });
        p.images = newImages; p.colorImages = ncm;
        syncPrimary(p); renderGallery(prodId); lazySave();
      }
      function renderGallery(prodId, wrap) {
        var p = prod(prodId);
        wrap = wrap || host.querySelector('[data-id="' + prodId + '"] [data-gallery]');
        if (!p || !wrap) return;
        var cm = p.colorImages || {};
        var colors = (p.colors || []).filter(Boolean);
        var html = '';
        p.images.forEach(function (u, i) {
          var curColor = '';
          Object.keys(cm).forEach(function (k) { if (cm[k] === i) curColor = k; });
          var colorRow = '';
          if (colors.length) {
            var opts = '<option value="">(vanlig)</option>' + colors.map(function (c) { return '<option value="' + esc(c) + '"' + (c === curColor ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('');
            colorRow = '<div class="img-thumb__color"><select data-colorsel="' + i + '" title="Vis dette bildet når denne fargen velges">' + opts + '</select></div>';
          }
          html += '<div class="img-thumb" data-id="' + i + '">'
            + (i === 0 ? '<span class="img-thumb__primary">Hoved</span>' : '')
            + (curColor ? '<span class="img-thumb__clr" title="Vises for fargen ' + esc(curColor) + '">' + esc(curColor) + '</span>' : '')
            + '<img src="' + esc(u) + '" alt="">'
            + '<div class="img-thumb__bar">'
              + '<span class="grip" title="Dra for å endre rekkefølge">⠿</span>'
              + '<button class="tbtn crop" type="button" title="Rediger bilde (beskjær, zoom, roter)" data-act="crop" data-i="' + i + '"><span class="tbtn-ic">✎</span>Rediger</button>'
              + '<button class="tbtn x" type="button" title="Fjern bilde" data-act="del" data-i="' + i + '">✕</button>'
            + '</div>' + colorRow
          + '</div>';
        });
        html += '<div class="img-add" data-add-img>' + (p.images.length ? '+ Legg til flere bilder' : '📷 Klikk eller dra inn bilde(r)') + '</div>';
        wrap.innerHTML = html;
        wrap.querySelectorAll('[data-act="del"]').forEach(function (b) { b.addEventListener('click', function () { removeImageAt(prodId, Number(b.getAttribute('data-i'))); }); });
        wrap.querySelectorAll('[data-act="crop"]').forEach(function (b) { b.addEventListener('click', function () {
          var idx = Number(b.getAttribute('data-i'));
          var pp = prod(prodId); if (!pp || !pp.images[idx]) return;
          window.AdminImageEditor.open({
            src: pp.images[idx], aspect: 1, aspects: [1, 0.75, 1.3333], outSize: 1000, quality: 0.85,
            title: 'Rediger bilde', applyLabel: 'Bruk bilde',
            onApply: function (url) { var prev = pp.images[idx]; pp.images[idx] = url; if (window.AdminCommon) AdminCommon.checkImageSize(url); syncPrimary(pp); renderGallery(prodId); lazySave(); AC.undoable('Bilde endret', function () { var q2 = prod(prodId); if (q2 && q2.images[idx] != null) { q2.images[idx] = prev; syncPrimary(q2); renderGallery(prodId); lazySave(); } }); }
          });
        }); });
        wrap.querySelectorAll('[data-colorsel]').forEach(function (sel) { sel.addEventListener('change', function () { setImageColor(prodId, Number(sel.getAttribute('data-colorsel')), sel.value); }); });
        var addTile = wrap.querySelector('[data-add-img]');
        if (addTile) addTile.addEventListener('click', function () { openPicker(prodId); });
      }
      function setImageColor(prodId, idx, color) {
        var p = prod(prodId); if (!p) return;
        var cm = p.colorImages || (p.colorImages = {});
        Object.keys(cm).forEach(function (k) { if (cm[k] === idx) delete cm[k]; });
        if (color) cm[color] = idx;
        renderGallery(prodId); lazySave();
      }

      /* ── crop/zoom (modal på body) ── */
      var crop = null, cropEls = null;
      function cropKeydown(e) { if (e.key === 'Escape' && crop) closeCrop(); }
      function buildCropModal() {
        if (cropEls) return cropEls;
        var ov = document.createElement('div');
        ov.className = 'crop-ov';
        ov.innerHTML =
          '<div class="crop-box"><h3>Beskjær / zoom</h3>'
            + '<div class="crop-view"><img alt=""></div>'
            + '<div class="crop-row"><span>Zoom</span><input type="range" class="crop-zoom" min="1" max="4" step="0.01" value="1"></div>'
            + '<p class="crop-hint">Dra bildet for å flytte. Zoom med glidebryteren eller scrollhjulet. «Bruk» beskjærer til et kvadrat.</p>'
            + '<div class="crop-actions"><button type="button" class="crop-cancel">Avbryt</button><button type="button" class="crop-apply">Bruk</button></div>'
          + '</div>';
        document.body.appendChild(ov);
        var view = ov.querySelector('.crop-view');
        var img = ov.querySelector('.crop-view img');
        var zoom = ov.querySelector('.crop-zoom');
        cropEls = { ov: ov, view: view, img: img, zoom: zoom };
        ov.addEventListener('click', function (e) { if (e.target === ov) closeCrop(); });
        ov.querySelector('.crop-cancel').addEventListener('click', closeCrop);
        ov.querySelector('.crop-apply').addEventListener('click', applyCrop);
        zoom.addEventListener('input', function () { setCropZoom(parseFloat(zoom.value)); });
        var dragging = false, lastX = 0, lastY = 0;
        view.addEventListener('pointerdown', function (e) { if (!crop) return; dragging = true; lastX = e.clientX; lastY = e.clientY; try { view.setPointerCapture(e.pointerId); } catch (_) {} e.preventDefault(); });
        view.addEventListener('pointermove', function (e) { if (!dragging || !crop) return; crop.x += e.clientX - lastX; crop.y += e.clientY - lastY; lastX = e.clientX; lastY = e.clientY; clampCrop(); applyCropView(); });
        function endDrag(e) { dragging = false; try { view.releasePointerCapture(e.pointerId); } catch (_) {} }
        view.addEventListener('pointerup', endDrag);
        view.addEventListener('pointercancel', endDrag);
        view.addEventListener('wheel', function (e) { if (!crop) return; e.preventDefault(); var rect = view.getBoundingClientRect(); var z = (crop.s / crop.base) * (e.deltaY < 0 ? 1.1 : 1 / 1.1); z = Math.max(1, Math.min(4, z)); cropZoomAt(crop.base * z, e.clientX - rect.left, e.clientY - rect.top); }, { passive: false });
        document.addEventListener('keydown', cropKeydown);
        return cropEls;
      }
      function openCrop(prodId, idx) {
        var p = prod(prodId); if (!p || !p.images[idx]) return;
        var els = buildCropModal();
        els.ov.classList.add('on'); els.img.src = p.images[idx];
        var image = new Image();
        image.onload = function () {
          var V = els.view.clientWidth || 320;
          var base = V / Math.min(image.naturalWidth, image.naturalHeight);
          crop = { prodId: prodId, idx: idx, img: image, V: V, base: base, s: base, x: 0, y: 0 };
          crop.x = (V - image.naturalWidth * crop.s) / 2;
          crop.y = (V - image.naturalHeight * crop.s) / 2;
          els.zoom.value = '1'; clampCrop(); applyCropView();
        };
        image.src = p.images[idx];
      }
      function setCropZoom(z) { if (!crop) return; cropZoomAt(crop.base * z, crop.V / 2, crop.V / 2); }
      function cropZoomAt(newS, px, py) {
        if (!crop) return;
        var ix = (px - crop.x) / crop.s, iy = (py - crop.y) / crop.s;
        crop.s = newS; crop.x = px - ix * crop.s; crop.y = py - iy * crop.s;
        clampCrop(); applyCropView();
        if (cropEls) cropEls.zoom.value = String(Math.max(1, Math.min(4, crop.s / crop.base)));
      }
      function clampCrop() {
        if (!crop) return;
        var V = crop.V;
        var w = crop.img.naturalWidth * crop.s, h = crop.img.naturalHeight * crop.s;
        crop.x = w <= V ? (V - w) / 2 : Math.max(V - w, Math.min(0, crop.x));
        crop.y = h <= V ? (V - h) / 2 : Math.max(V - h, Math.min(0, crop.y));
      }
      function applyCropView() {
        if (!cropEls || !crop) return;
        var im = cropEls.img;
        im.style.width = (crop.img.naturalWidth * crop.s) + 'px';
        im.style.height = (crop.img.naturalHeight * crop.s) + 'px';
        im.style.left = crop.x + 'px'; im.style.top = crop.y + 'px';
      }
      function closeCrop() { if (cropEls) cropEls.ov.classList.remove('on'); crop = null; }
      function applyCrop() {
        if (!crop) return;
        var s = crop.s, V = crop.V;
        var sx = -crop.x / s, sy = -crop.y / s, sw = V / s, sh = V / s;
        var OUT = Math.min(900, Math.max(1, Math.round(sw)));
        var canvas = document.createElement('canvas');
        canvas.width = OUT; canvas.height = OUT;
        canvas.getContext('2d').drawImage(crop.img, sx, sy, sw, sh, 0, 0, OUT, OUT);
        var url = canvas.toDataURL('image/webp', 0.85);
        var p = prod(crop.prodId);
        if (p && p.images[crop.idx] != null) { p.images[crop.idx] = url; syncPrimary(p); renderGallery(crop.prodId); lazySave(); }
        closeCrop();
      }

      function setField(id, field, val) {
        var p = prod(id); if (!p) return;
        p[field] = val === '' && field !== 'badge' ? null : val;
        if (field === 'name') { var titleEl = host.querySelector('[data-id="' + id + '"] .pcard-title'); if (titleEl) titleEl.textContent = val || '(uten navn)'; }
        lazySave();
      }

      function makeCard(p) {
        var card = document.createElement('div');
        card.className = 'pcard'; card.setAttribute('data-id', p.id);
        var badgeTypes = [ { v: '', l: 'Ingen' }, { v: 'bestseller', l: 'Bestseller' }, { v: 'new', l: 'Nyhet' }, { v: 'limited', l: 'Begrenset' }, { v: 'custom', l: 'Egendefinert' } ];
        var curSel = p.badgeType ? p.badgeType : (p.badge ? 'custom' : '');
        var radios = badgeTypes.map(function (bt) {
          var rid = 'bt-' + p.id + '-' + (bt.v || 'none');
          return '<input type="radio" id="' + rid + '" name="bt-' + p.id + '" value="' + bt.v + '"' + (curSel === bt.v ? ' checked' : '') + '><label for="' + rid + '">' + bt.l + '</label>';
        }).join('');

        card.innerHTML =
          '<div class="pcard-head"><span class="drag-handle" title="Sorter">⠿</span>'
            + '<span class="pcard-title">' + esc(p.name || '(uten navn)') + '</span>'
            + '<div class="order-btns"><button class="btn-ord btn-up" type="button" title="Flytt opp">↑</button><button class="btn-ord btn-dn" type="button" title="Flytt ned">↓</button></div>'
            + '<button class="btn-del" type="button">Slett</button></div>'
          + '<div class="pcard-body"><div class="img-gallery" data-gallery></div>'
            + '<div class="fields">'
              + '<div class="frow">'
                + '<div class="fg narrow"><label>Kategori</label><input type="text" data-f="category" value="' + esc(p.category || '') + '" placeholder="f.eks. Tilbehør"></div>'
                + '<div class="fg"><label>Produktnavn</label><input type="text" data-f="name" value="' + esc(p.name || '') + '" placeholder="Navn på produktet"></div>'
              + '</div>'
              + '<div class="fg"><label>Beskrivelse</label><textarea data-f="desc" placeholder="Kort beskrivelse av produktet...">' + esc(p.desc || '') + '</textarea></div>'
              + '<div class="frow">'
                + '<div class="fg narrow"><label data-help="La feltet stå tomt for å skjule prisen helt.">Pris (kr)</label><input type="number" data-f="price" value="' + (p.price != null && isFinite(p.price) ? Number(p.price) : '') + '" min="0" step="1" placeholder="tom = skjul pris"></div>'
                + '<div class="fg narrow"><label data-help="Valgfri rabattert pris for medlemmer.">Medlemspris (kr)</label><input type="number" data-f="memberPrice" value="' + (p.memberPrice != null && isFinite(p.memberPrice) ? Number(p.memberPrice) : '') + '" min="0" step="1" placeholder="tom = ingen"></div>'
              + '</div>'
              + '<div class="fg"><label data-help="Velg ett: en ferdig merkelapp ELLER «Egendefinert» med egen tekst og farge. «Ingen» skjuler merkelappen.">Badge</label>'
                + '<div class="badge-opts">' + radios + '</div>'
                + '<div class="badge-custom' + (curSel === 'custom' ? ' on' : '') + '" data-badge-custom>'
                  + '<input type="text" data-f="badge" value="' + esc(p.badge || '') + '" placeholder="Egendefinert badge-tekst, f.eks. «Snart utsolgt»">'
                  + '<div class="badge-custom-color"><span class="app-lbl">Farge</span><div data-badge-host></div></div>'
                  + '<div class="badge-custom-color"><span class="app-lbl">Tekstfarge</span><div data-badgetext-host></div></div>'
                + '</div>'
              + '</div>'
              + '<div class="fg"><label data-help="Animert glød eller fast lysfarge rundt selve merkelappen.">Badge-glød</label><div data-badgeglow-host></div></div>'
              + '<div class="frow">'
                + '<div class="fg"><label data-help="Valgfrie størrelser, skilt med komma. Tom = ingen størrelsesvalg.">Størrelser (komma)</label><input type="text" data-vlist="sizes" value="' + esc((p.sizes || []).join(', ')) + '" placeholder="f.eks. S, M, L, XL"></div>'
                + '<div class="fg"><label data-help="Valgfrie farger, skilt med komma. Tom = ingen fargevalg.">Farger (komma)</label><input type="text" data-vlist="colors" value="' + esc((p.colors || []).join(', ')) + '" placeholder="f.eks. Marineblå, Bordeaux"></div>'
              + '</div>'
              + '<div class="fg"><label data-help="Teksten på knappen. Standard «Legg i kurv».">Bestill-knapp tekst</label><input type="text" data-f="btnLabel" value="' + esc(p.btnLabel || '') + '" placeholder="Bestill (f.eks. «Utsolgt»)"></div>'
              + '<div class="fg"><label data-help="Kortkant: lysende kant rundt kortet. Knapp: farge på bestill-knappen.">Utseende — farger & kant</label>'
                + '<div class="appearance"><div class="app-col"><span class="app-lbl">Kortkant</span><div data-edge-host></div></div><div class="app-col"><span class="app-lbl">Knapp</span><div data-btn-host></div></div></div></div>'
              + '<button class="adv-toggle" type="button">▸ Bestillingslenke (avansert)</button>'
              + '<div class="adv-fields">'
                + '<div class="fg"><label>E-post emne</label><input type="text" data-f="emailSubject" value="' + esc(p.emailSubject || '') + '" placeholder="Bestilling: Produktnavn"></div>'
                + '<div class="fg"><label>E-post forhåndsutfylt tekst</label><input type="text" data-f="emailBody" value="' + esc(p.emailBody || '') + '" placeholder="f.eks. Størrelse: "></div>'
              + '</div>'
            + '</div>'
          + '</div>';

        var gal = card.querySelector('[data-gallery]');
        renderGallery(p.id, gal);
        gal.addEventListener('dragenter', function (e) { e.preventDefault(); gal.setAttribute('data-over', ''); });
        gal.addEventListener('dragover', function (e) { e.preventDefault(); });
        gal.addEventListener('dragleave', function () { gal.removeAttribute('data-over'); });
        gal.addEventListener('drop', function (e) { e.preventDefault(); gal.removeAttribute('data-over'); var files = e.dataTransfer && e.dataTransfer.files; if (files && files.length) addImages(p.id, files); });
        AC.enableDragSort(gal, { itemSelector: '.img-thumb', handleSelector: '.grip', onReorder: function (ids) { reorderImages(p.id, ids); } });

        card.querySelectorAll('[data-f]').forEach(function (el) {
          var field = el.getAttribute('data-f');
          el.addEventListener('input', function () { var v = el.type === 'number' ? (el.value === '' ? null : Number(el.value)) : el.value; setField(p.id, field, v); });
        });
        card.querySelectorAll('[data-vlist]').forEach(function (el) {
          el.addEventListener('input', function () {
            var f = el.getAttribute('data-vlist');
            var arr = el.value.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
            setField(p.id, f, arr.length ? arr : null);
            if (f === 'colors') renderGallery(p.id);
          });
        });

        var customWrap = card.querySelector('[data-badge-custom]');
        card.querySelectorAll('.badge-opts input[type=radio]').forEach(function (r) {
          r.addEventListener('change', function () {
            if (!r.checked) return;
            if (r.value === 'custom') { setField(p.id, 'badgeType', null); if (customWrap) customWrap.classList.add('on'); }
            else { setField(p.id, 'badgeType', r.value || null); setField(p.id, 'badge', null); var txt = card.querySelector('[data-f="badge"]'); if (txt) txt.value = ''; if (customWrap) customWrap.classList.remove('on'); }
          });
        });

        card.querySelector('.btn-up').addEventListener('click', function () { move(p.id, -1); });
        card.querySelector('.btn-dn').addEventListener('click', function () { move(p.id, 1); });
        card.querySelector('.btn-del').addEventListener('click', function () { del(p.id); });

        var advBtn = card.querySelector('.adv-toggle'), advDiv = card.querySelector('.adv-fields');
        advBtn.addEventListener('click', function () { var open = advDiv.classList.toggle('open'); advBtn.textContent = (open ? '▾' : '▸') + ' Bestillingslenke (avansert)'; });

        var mkColor = window.createColorControl;
        var bHost = card.querySelector('[data-badge-host]');
        if (bHost && mkColor) bHost.appendChild(mkColor({ value: p.badgeColor, emptyLabel: 'Standardfarge', onChange: function (v) { p.badgeColor = v || null; lazySave(); } }));
        var btxtHost = card.querySelector('[data-badgetext-host]');
        if (btxtHost && mkColor) btxtHost.appendChild(mkColor({ value: p.badgeTextColor, emptyLabel: 'Hvit (standard)', onChange: function (v) { p.badgeTextColor = v || null; lazySave(); } }));
        var bgHost = card.querySelector('[data-badgeglow-host]');
        if (bgHost && mkColor) bgHost.appendChild(mkColor({ value: p.badgeGlow, emptyLabel: 'Ingen glød', animatedPresets: window.APEIRON_ANIMATED, onChange: function (v) { p.badgeGlow = v || null; lazySave(); } }));
        var eHost = card.querySelector('[data-edge-host]');
        if (eHost && mkColor) eHost.appendChild(mkColor({ value: p.edge, emptyLabel: 'Ingen kant', animatedPresets: window.APEIRON_ANIMATED, onChange: function (v) { p.edge = v || null; lazySave(); } }));
        var btHost = card.querySelector('[data-btn-host]');
        if (btHost && mkColor) btHost.appendChild(mkColor({ value: p.btnColor, emptyLabel: 'Standard (vinrød)', onChange: function (v) { p.btnColor = v || null; lazySave(); } }));

        AC.enhanceHelp(card);
        return card;
      }

      function renderAll() {
        var list = q('plist'); list.innerHTML = '';
        products.forEach(function (p) { list.appendChild(makeCard(p)); });
      }

      function add() {
        var p = { id: uid(), badge: null, badgeType: null, category: 'Tilbehør', name: '', desc: '', price: null, memberPrice: null, img: null, images: [], colorImages: {}, sizes: null, colors: null, badgeGlow: null, emailSubject: 'Bestilling: ', emailBody: '' };
        products.push(p); renderAll(); lazySave();
        setTimeout(function () { var last = host.querySelector('#plist .pcard:last-child'); if (last) last.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
      }
      function del(id) { var i = products.findIndex(function (p) { return p.id === id; }); if (i < 0) return; AC.undoDelete(products, i, '«' + (products[i].name || 'Produkt') + '» slettet', renderAll, lazySave); }
      function move(id, dir) {
        var i = products.findIndex(function (p) { return p.id === id; });
        if (i < 0) return; var j = i + dir; if (j < 0 || j >= products.length) return;
        var tmp = products[i]; products[i] = products[j]; products[j] = tmp; renderAll(); lazySave();
      }

      function exportFile() {
        var content =
          '/* Produktdata for Apeiron merch-siden.\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Rediger direkte her, eller åpne Admin-senteret → Merch.\n'
          + '\n'
          + '   badgeType: "bestseller" | "new" | "limited" | null\n'
          + '   btnLabel : tekst på handlekurv-knappen (tom = "Legg i kurv")\n'
          + '   sizes/colors: array av varianter eller null\n'
          + '   price: null skjuler pris og gir «Kommer snart»\n'
          + '   Farger (valgfrie): badgeColor, badgeTextColor, badgeGlow (fast el. { anim }),\n'
          + '     btnColor, edge (farge el. { anim: "aurora-bold" }).\n'
          + '   images: galleri — base64 fra admin eller "assets/merch/..." stier. Hoved = images[0].\n'
          + '   colorImages: { "Fargenavn": indeks } — bytt bilde når en farge velges. */\n\n'
          + 'window.MERCH_SUBHERO = ' + JSON.stringify(subhero) + ';\n\n'
          + 'window.MERCH_INFO = ' + JSON.stringify(info) + ';\n\n'
          + 'window.MERCH_INFO_LABEL = ' + JSON.stringify(infoLabel) + ';\n\n'
          + 'window.MERCH_PRODUCTS = ' + JSON.stringify(products, null, 2) + ';\n';
        AC.saveFile('merch-products.js', content);
        AC.toast('Fil lastet ned — erstatt i GitHub og push!');
      }

      q('reset-btn').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon fra merch-products.js. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); localStorage.removeItem(LS_INFO_KEY); localStorage.removeItem(LS_INFO_LABEL_KEY); localStorage.removeItem(LS_SUBHERO_KEY);
        products = fromPublished(); normalizeProducts(); info = window.MERCH_INFO || ''; infoLabel = (window.MERCH_INFO_LABEL != null ? window.MERCH_INFO_LABEL : 'Merk'); subhero = Object.assign({}, window.MERCH_SUBHERO || {});
        renderInfo(); renderSubhero(); renderAll(); AC.toast('Tilbakestilt til publisert versjon'); pushPreview();
      });
      q('add-btn').addEventListener('click', add);

      var infoInput = q('info-input');
      if (infoInput) infoInput.addEventListener('input', function () { info = infoInput.value; lazySave(); });
      var infoLabelInput = q('info-label-input');
      if (infoLabelInput) infoLabelInput.addEventListener('input', function () { infoLabel = infoLabelInput.value; lazySave(); });
      function renderInfo() { if (infoInput) infoInput.value = info; if (infoLabelInput) infoLabelInput.value = infoLabel; }
      var SH_MAP = { 'msh-back': 'back', 'msh-title': 'title', 'msh-lede': 'lede' };
      function renderSubhero() { Object.keys(SH_MAP).forEach(function (id) { var el = q(id); if (el) el.value = subhero[SH_MAP[id]] || ''; }); }
      Object.keys(SH_MAP).forEach(function (id) { var el = q(id); if (el) el.addEventListener('input', function () { subhero[SH_MAP[id]] = el.value; lazySave(); }); });

      AC.enableDragSort(q('plist'), {
        itemSelector: '.pcard', handleSelector: '.drag-handle',
        onReorder: function (ids) { products.sort(function (a, b) { return ids.indexOf(a.id) - ids.indexOf(b.id); }); lazySave(); }
      });

      /* ── live forhåndsvisning ── */
      var pvFrame = q('pv-shop');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-merch-preview', products: products, info: info, infoLabel: infoLabel, subhero: subhero }, '*'); } catch (e) {} }
      function onPreviewMsg(e) { if (e.data && e.data.type === 'apeiron-merch-preview-ready') { pushPreview(); fitShop(); } }
      function fitShop() {
        var wrap = host.querySelector('.pv-shop-wrap');
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
      window.addEventListener('resize', fitShop);
      if (pvFrame) pvFrame.addEventListener('load', fitShop);

      loadData(); renderInfo(); renderSubhero(); renderAll();
      AC.viewSwitch({ list: q('plist'), key: 'apeiron-merch-view-v1', modes: [
        { id: 'cols-1', n: 1, label: '1 i bredden', title: 'Ett produkt per rad' },
        { id: 'cols-2', n: 2, label: '2 i bredden', title: 'To produkter i bredden' }
      ], help: 'Velg hvordan produktkortene vises mens du redigerer her i admin. Påvirker bare redigeringsvisningen, ikke nettbutikken.' });
      fitShop(); setTimeout(fitShop, 80);
      pushPreview(); setTimeout(pushPreview, 150);

      return {
        export: exportFile,
        destroy: function () {
          window.removeEventListener('message', onPreviewMsg);
          window.removeEventListener('resize', fitShop);
          document.removeEventListener('keydown', cropKeydown);
          if (cropEls && cropEls.ov && cropEls.ov.parentNode) cropEls.ov.parentNode.removeChild(cropEls.ov);
          cropEls = null;
        }
      };
    }
  });
})();
