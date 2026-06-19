/* ============================================================
   admin-modules/om-oss.js — «Om oss»-editor som C-modul
   Erstatter om-oss-admin.html. Krever om-content.js (OM_CONTENT), som skallet
   (admin.html) laster. Live forhåndsvisning via om-oss.html?preview=1.
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('om-oss', {
    title: 'Om oss',
    see: { href: 'om-oss.html', label: 'Se Om oss ↗' },
    exportName: 'om-content.js',

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live fra den ekte «Om oss»-siden — endringene dine vises umiddelbart. Dette panelet styrer <b>«Hva er apeiron?»</b> og <b>FAQ-en</b>. (Samarbeid, Lesesalen, Møt styret og Bli medlem styres andre steder.)</p>'
          + '<div class="pv-board-wrap"><iframe id="pv-board" src="om-oss.html?preview=1" title="Forhåndsvisning av Om oss"></iframe></div>'
          + '<div class="pv-jump"><button type="button" data-jump="#om">Om oss</button><button type="button" data-jump="#faq">FAQ</button></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du Om oss</strong>'
          + '<ol>'
            + '<li>Rediger tekstene nedenfor — endringer vises live i forhåndsvisningen</li>'
            + '<li>Klikk <b>↓ Last ned</b> oppe til høyre</li>'
            + '<li>Erstatt <code>om-content.js</code> i GitHub-repositoriet og push/commit</li>'
            + '<li>Cloudflare oppdaterer nettsiden automatisk innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren din. Dette panelet styrer «Om oss»-teksten og hele FAQ-en. Hero/Kontakt på Hjem ligger i Forsiden-panelet.</div>'
        + '</div>'
        + '<div class="panel"><h2>Om oss <small>«Hva er apeiron?»</small></h2>'
          + '<div class="panel-body">'
            + '<div class="frow">'
              + '<div class="fg narrow"><label>Eyebrow</label><input type="text" id="om-eyebrow"></div>'
              + '<div class="fg narrow"><label>Gresk ord</label><input type="text" id="om-greek"></div>'
              + '<div class="fg"><label>Uttale / undertekst</label><input type="text" id="om-greekSmall"></div>'
            + '</div>'
            + '<div class="sub-h">Avsnitt</div><div class="lst" id="lst-paras"></div><button class="btn-add" type="button" data-add="paras">+ Nytt avsnitt</button>'
            + '<div class="sub-h">Timeglass-kort</div>'
            + '<div class="fg"><label>Tittel</label><input type="text" id="om-card-title"></div>'
            + '<div class="fg"><label>Tekst</label><textarea id="om-card-body"></textarea></div>'
            + '<div class="sub-h">Samarbeids-teaser</div>'
            + '<div class="frow"><div class="fg narrow"><label>Eyebrow</label><input type="text" id="om-teaser-eyebrow"></div>'
            + '<div class="fg"><label>Tittel</label><input type="text" id="om-teaser-title"></div></div>'
            + '<div class="fg"><label>Tekst</label><textarea id="om-teaser-body"></textarea></div>'
            + '<div class="frow"><div class="fg"><label>Lenketekst</label><input type="text" id="om-teaser-linkLabel"></div>'
            + '<div class="fg narrow"><label>Lenke</label><input type="text" id="om-teaser-linkHref" placeholder="#samarbeid"></div></div>'
            + '<div class="sub-h">Nøkkeltall</div><div class="lst" id="lst-stats"></div><button class="btn-add" type="button" data-add="stats">+ Nytt tall</button>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>FAQ <small>ofte stilte spørsmål</small></h2>'
          + '<div class="panel-body">'
            + '<div class="frow"><div class="fg narrow"><label>Eyebrow</label><input type="text" id="faq-eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="faq-heading"></div></div>'
            + '<div class="sub-h">Spørsmål &amp; svar</div><div class="lst" id="lst-faq"></div><button class="btn-add" type="button" data-add="faq">+ Nytt spørsmål</button>'
          + '</div>'
        + '</div>';

      var q = function (id) { return host.querySelector('#' + id); };
      var LS_KEY = 'apeiron-om-v1';
      var data = {};
      function clone(o) { return JSON.parse(JSON.stringify(o)); }
      function fresh() {
        var c = window.OM_CONTENT || {};
        var d = clone(c);
        d.om = d.om || {};
        d.om.paras = Array.isArray(d.om.paras) ? d.om.paras : [];
        d.om.card = d.om.card || { title: '', body: '' };
        d.om.teaser = d.om.teaser || { eyebrow: '', title: '', body: '', linkLabel: '', linkHref: '' };
        d.om.stats = Array.isArray(d.om.stats) ? d.om.stats : [];
        d.faq = d.faq || {};
        d.faq.items = Array.isArray(d.faq.items) ? d.faq.items : [];
        return d;
      }
      function loadData() {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) { try { data = JSON.parse(raw); normalize(); return; } catch (_) {} }
        data = fresh();
      }
      function normalize() {
        var f = fresh();
        data = Object.assign({}, f, data);
        data.om = Object.assign({}, f.om, data.om);
        data.om.card = Object.assign({}, f.om.card, data.om.card);
        data.om.teaser = Object.assign({}, f.om.teaser, data.om.teaser);
        if (!Array.isArray(data.om.paras)) data.om.paras = [];
        if (!Array.isArray(data.om.stats)) data.om.stats = [];
        data.faq = Object.assign({}, f.faq, data.faq);
        if (!Array.isArray(data.faq.items)) data.faq.items = [];
      }
      function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(data)); pushPreview(); }
      var saveTimer = null;
      function lazySave() { pushPreview(); clearTimeout(saveTimer); saveTimer = setTimeout(function () { saveData(); AC.toast('Lagret i nettleseren'); }, 300); }
      function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

      var FIELD_MAP = {
        'om-eyebrow': 'om.eyebrow', 'om-greek': 'om.greek', 'om-greekSmall': 'om.greekSmall',
        'om-card-title': 'om.card.title', 'om-card-body': 'om.card.body',
        'om-teaser-eyebrow': 'om.teaser.eyebrow', 'om-teaser-title': 'om.teaser.title', 'om-teaser-body': 'om.teaser.body',
        'om-teaser-linkLabel': 'om.teaser.linkLabel', 'om-teaser-linkHref': 'om.teaser.linkHref',
        'faq-eyebrow': 'faq.eyebrow', 'faq-heading': 'faq.heading'
      };
      function getPath(path) { return path.split('.').reduce(function (o, k) { return (o || {})[k]; }, data); }
      function setPath(path, val) {
        var parts = path.split('.'), o = data;
        for (var i = 0; i < parts.length - 1; i++) { if (o[parts[i]] == null) o[parts[i]] = {}; o = o[parts[i]]; }
        o[parts[parts.length - 1]] = val;
      }
      function renderFields() { Object.keys(FIELD_MAP).forEach(function (id) { var el = q(id); if (el) el.value = getPath(FIELD_MAP[id]) || ''; }); }
      function wireFields() { Object.keys(FIELD_MAP).forEach(function (id) { var el = q(id); if (!el) return; el.addEventListener('input', function () { setPath(FIELD_MAP[id], el.value); lazySave(); }); }); }

      function renderParas() {
        var hostEl = q('lst-paras'); hostEl.innerHTML = '';
        data.om.paras.forEach(function (txt, i) {
          var row = document.createElement('div');
          row.className = 'lrow'; row.setAttribute('data-id', 'p' + i);
          row.innerHTML =
            '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<div class="lrow-fields"><textarea placeholder="Avsnittstekst...">' + esc(txt) + '</textarea></div>'
            + '<div class="lrow-ctrls"><button class="btn-mini up" type="button" title="Opp">↑</button><button class="btn-mini dn" type="button" title="Ned">↓</button><button class="btn-mini x" type="button" title="Slett">✕</button></div>';
          row.querySelector('textarea').addEventListener('input', function () { data.om.paras[i] = this.value; lazySave(); });
          row.querySelector('.up').addEventListener('click', function () { moveArr(data.om.paras, i, -1); renderParas(); lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(data.om.paras, i, 1); renderParas(); lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { data.om.paras.splice(i, 1); renderParas(); lazySave(); });
          hostEl.appendChild(row);
        });
      }
      function renderStats() {
        var hostEl = q('lst-stats'); hostEl.innerHTML = '';
        data.om.stats.forEach(function (s, i) {
          var row = document.createElement('div');
          row.className = 'lrow'; row.setAttribute('data-id', 's' + i);
          row.innerHTML =
            '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<div class="lrow-fields"><div class="frow">'
              + '<div class="fg narrow"><label>Tall</label><input type="text" data-k="num" value="' + esc(s.num) + '" placeholder="180+"></div>'
              + '<div class="fg"><label>Etikett</label><input type="text" data-k="lbl" value="' + esc(s.lbl) + '" placeholder="Medlemmer"></div>'
            + '</div></div>'
            + '<div class="lrow-ctrls"><button class="btn-mini up" type="button" title="Opp">↑</button><button class="btn-mini dn" type="button" title="Ned">↓</button><button class="btn-mini x" type="button" title="Slett">✕</button></div>';
          row.querySelectorAll('[data-k]').forEach(function (inp) { inp.addEventListener('input', function () { s[inp.getAttribute('data-k')] = inp.value; lazySave(); }); });
          row.querySelector('.up').addEventListener('click', function () { moveArr(data.om.stats, i, -1); renderStats(); lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(data.om.stats, i, 1); renderStats(); lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { data.om.stats.splice(i, 1); renderStats(); lazySave(); });
          hostEl.appendChild(row);
        });
      }
      function renderFaq() {
        var hostEl = q('lst-faq'); hostEl.innerHTML = '';
        data.faq.items.forEach(function (it, i) {
          var row = document.createElement('div');
          row.className = 'lrow'; row.setAttribute('data-id', 'q' + i);
          row.innerHTML =
            '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<div class="lrow-fields">'
              + '<div class="fg"><label>Spørsmål</label><input type="text" data-k="q" value="' + esc(it.q) + '" placeholder="Spørsmålet..."></div>'
              + '<div class="fg"><label>Svar</label><textarea data-k="a" placeholder="Svaret...">' + esc(it.a) + '</textarea></div>'
            + '</div>'
            + '<div class="lrow-ctrls"><button class="btn-mini up" type="button" title="Opp">↑</button><button class="btn-mini dn" type="button" title="Ned">↓</button><button class="btn-mini x" type="button" title="Slett">✕</button></div>';
          row.querySelectorAll('[data-k]').forEach(function (inp) { inp.addEventListener('input', function () { it[inp.getAttribute('data-k')] = inp.value; lazySave(); }); });
          row.querySelector('.up').addEventListener('click', function () { moveArr(data.faq.items, i, -1); renderFaq(); lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(data.faq.items, i, 1); renderFaq(); lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { if (confirm('Slett dette spørsmålet?')) { data.faq.items.splice(i, 1); renderFaq(); lazySave(); } });
          hostEl.appendChild(row);
        });
      }
      function moveArr(arr, i, dir) { var j = i + dir; if (j < 0 || j >= arr.length) return; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }

      host.querySelectorAll('[data-add]').forEach(function (b) {
        b.addEventListener('click', function () {
          var which = b.getAttribute('data-add');
          if (which === 'paras') { data.om.paras.push(''); renderParas(); }
          else if (which === 'stats') { data.om.stats.push({ num: '', lbl: '' }); renderStats(); }
          else if (which === 'faq') { data.faq.items.push({ q: '', a: '' }); renderFaq(); }
          lazySave();
        });
      });
      function wireDrag(hostId, arrRef, rerender) {
        AC.enableDragSort(q(hostId), {
          itemSelector: '.lrow', handleSelector: '.drag-handle',
          onReorder: function (ids) {
            var arr = arrRef();
            var order = ids.map(function (id) { return parseInt(id.replace(/^\D+/, ''), 10); });
            var next = order.map(function (idx) { return arr[idx]; });
            arr.length = 0; Array.prototype.push.apply(arr, next);
            rerender(); lazySave();
          }
        });
      }
      function renderAll() { renderFields(); renderParas(); renderStats(); renderFaq(); }

      function exportFile() {
        var out = { om: clone(data.om || {}), faq: clone(data.faq || {}) };
        out.om.paras = (out.om.paras || []).filter(function (p) { return p && p.trim(); });
        out.om.stats = (out.om.stats || []).filter(function (s) { return (s.num && s.num.trim()) || (s.lbl && s.lbl.trim()); });
        out.faq.items = (out.faq.items || []).filter(function (it) { return (it.q && it.q.trim()) || (it.a && it.a.trim()); });
        var content =
          '/* Innhold for Om oss-siden (om-oss.html) — TEKST-delene som endres ofte.\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Rediger direkte her, eller åpne Admin-senteret → Om oss.\n'
          + '     om  : «Hva er apeiron?» — gresk ord, avsnitt, timeglass-kort, samarbeids-teaser, nøkkeltall\n'
          + '     faq : seksjonsoverskrift + ofte stilte spørsmål\n'
          + '   Hero + Kontakt (Hjem) ligger i index-content.js (Forsiden-panelet).\n'
          + '*/\n\n'
          + 'window.OM_CONTENT = ' + JSON.stringify(out, null, 2) + ';\n';
        AC.downloadBlob('om-content.js', content);
        AC.toast('Fil lastet ned — erstatt i GitHub og push!');
      }

      q('reset-btn').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); data = fresh(); renderAll(); AC.toast('Tilbakestilt til publisert versjon'); pushPreview();
      });

      var pvFrame = q('pv-board');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-om-preview', content: data }, '*'); } catch (e) {} }
      function onPreviewMsg(e) { if (e.data && e.data.type === 'apeiron-om-preview-ready') { pushPreview(); fitPreview(); } }
      function fitPreview() {
        var wrap = host.querySelector('.pv-board-wrap');
        if (!pvFrame || !wrap) return;
        var W = wrap.clientWidth; if (!W) return;
        var contentW = 1180;
        var scale = W / contentW;
        var visibleH = Math.max(520, Math.min(960, Math.round(window.innerHeight * 0.82)));
        pvFrame.style.width = contentW + 'px';
        pvFrame.style.height = Math.round(visibleH / scale) + 'px';
        pvFrame.style.transform = 'scale(' + scale + ')';
        wrap.style.height = visibleH + 'px';
      }
      window.addEventListener('message', onPreviewMsg);
      window.addEventListener('resize', fitPreview);
      if (pvFrame) pvFrame.addEventListener('load', fitPreview);

      host.querySelectorAll('[data-jump]').forEach(function (b) {
        b.addEventListener('click', function () {
          var sel = b.getAttribute('data-jump');
          try { var doc = pvFrame.contentWindow.document; var t = doc.querySelector(sel); if (t) pvFrame.contentWindow.scrollTo({ top: t.offsetTop, behavior: 'smooth' }); } catch (e) {}
        });
      });

      loadData(); renderAll(); wireFields();
      wireDrag('lst-paras', function () { return data.om.paras; }, renderParas);
      wireDrag('lst-stats', function () { return data.om.stats; }, renderStats);
      wireDrag('lst-faq', function () { return data.faq.items; }, renderFaq);
      fitPreview(); setTimeout(fitPreview, 80);
      pushPreview(); setTimeout(pushPreview, 150);

      return {
        export: exportFile,
        destroy: function () { window.removeEventListener('message', onPreviewMsg); window.removeEventListener('resize', fitPreview); }
      };
    }
  });
})();
