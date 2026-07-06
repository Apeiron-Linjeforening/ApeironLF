/* ============================================================
   admin-modules/marked.js — Pensum-markedet (marked.html) som C-modul
   Krever content/marked-content.js (MARKED_CONTENT), som skallet (admin.html) laster.
   Live forhåndsvisning via marked.html?preview=1.
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('marked', {
    title: 'Marked',
    see: { href: 'marked.html', label: 'Se Marked ↗' },
    exportName: 'content/marked-content.js',

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live fra den ekte «Pensum-markedet»-siden. Endringene dine vises umiddelbart. Dette panelet styrer all tekst på <code>marked.html</code> (den kommer-snart-siden lenket fra Pensum).</p>'
          + '<div class="pv-board-wrap"><iframe id="pv-board" src="marked.html?preview=1" title="Forhåndsvisning av Marked"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du Marked</strong>'
          + '<ol>'
            + '<li>Rediger tekstene nedenfor. Endringer vises live i forhåndsvisningen</li>'
            + '<li>Trykk <b>☁ Publiser til GitHub</b> oppe til høyre</li>'
            + '<li><em>(Reserve hvis publisering svikter: «↓ Last ned alle endrede» nederst i Oversikt-fanen, og legg fila i GitHub.)</em></li>'
            + '<li>Cloudflare oppdaterer nettsiden automatisk innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren din.</div>'
        + '</div>'
        + '<div class="panel"><h2>Topp-banner <small>øverst på siden</small></h2>'
          + '<div class="panel-body">'
            + '<div class="fg"><label>Tilbake-lenke (tekst)</label><input type="text" id="mk-back"></div>'
            + '<div class="fg"><label>Eyebrow (liten etikett over tittelen)</label><input type="text" id="mk-eyebrow"></div>'
            + '<div class="fg"><label>Tittel</label><input type="text" id="mk-title"></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="mk-lede"></textarea></div>'
            + '<div class="sub-h">Merkelapper (pills)</div><div class="lst" id="lst-pills"></div><button class="btn-add" type="button" data-add="pills">+ Ny merkelapp</button>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Intro <small>«Vi bygger noe nyttig»</small></h2>'
          + '<div class="panel-body">'
            + '<div class="frow"><div class="fg narrow"><label>Symbol</label><input type="text" id="mk-symbol"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="mk-intro-heading"></div></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="mk-intro-lede"></textarea></div>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Funksjoner <small>de tre kortene</small></h2>'
          + '<div class="panel-body">'
            + '<div class="lst" id="lst-features"></div><button class="btn-add" type="button" data-add="features">+ Nytt kort</button>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Meld interesse <small>banneret nederst</small></h2>'
          + '<div class="panel-body">'
            + '<div class="frow"><div class="fg narrow"><label>Eyebrow</label><input type="text" id="mk-interest-eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="mk-interest-heading"></div></div>'
            + '<div class="fg"><label>Tekst</label><textarea id="mk-interest-body"></textarea></div>'
            + '<div class="frow"><div class="fg"><label>Knapp 1: tekst</label><input type="text" id="mk-cta1-label"></div>'
            + '<div class="fg"><label>Knapp 1: lenke</label><input type="text" id="mk-cta1-href" placeholder="mailto:…"></div></div>'
            + '<div class="frow"><div class="fg"><label>Knapp 2: tekst</label><input type="text" id="mk-cta2-label"></div>'
            + '<div class="fg"><label>Knapp 2: lenke</label><input type="text" id="mk-cta2-href" placeholder="https://…"></div></div>'
            + '<div class="fg"><label>Notis under knappene</label><input type="text" id="mk-interest-note"></div>'
          + '</div>'
        + '</div>';

      var q = function (id) { return host.querySelector('#' + id); };
      var LS_KEY = 'apeiron-marked-v1';
      var data = {};
      function clone(o) { return JSON.parse(JSON.stringify(o)); }
      function fresh() {
        var c = window.MARKED_CONTENT || {};
        var d = clone(c);
        d.subhero = d.subhero || {};
        d.subhero.pills = Array.isArray(d.subhero.pills) ? d.subhero.pills : [];
        d.intro = d.intro || {};
        d.features = Array.isArray(d.features) ? d.features : [];
        d.interest = d.interest || {};
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
        data.subhero = Object.assign({}, f.subhero, data.subhero);
        if (!Array.isArray(data.subhero.pills)) data.subhero.pills = [];
        data.intro = Object.assign({}, f.intro, data.intro);
        if (!Array.isArray(data.features)) data.features = [];
        data.interest = Object.assign({}, f.interest, data.interest);
      }
      function saveData() { AC.persistDraft(LS_KEY, data); pushPreview(); }
      var saveTimer = null;
      function lazySave() { pushPreview(); clearTimeout(saveTimer); saveTimer = setTimeout(function () { saveData(); AC.toast('Lagret i nettleseren'); }, 300); }
      function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

      var FIELD_MAP = {
        'mk-back': 'subhero.back', 'mk-eyebrow': 'subhero.eyebrow', 'mk-title': 'subhero.title', 'mk-lede': 'subhero.lede',
        'mk-symbol': 'intro.symbol', 'mk-intro-heading': 'intro.heading', 'mk-intro-lede': 'intro.lede',
        'mk-interest-eyebrow': 'interest.eyebrow', 'mk-interest-heading': 'interest.heading', 'mk-interest-body': 'interest.body',
        'mk-cta1-label': 'interest.ctaLabel', 'mk-cta1-href': 'interest.ctaHref',
        'mk-cta2-label': 'interest.ctaLabel2', 'mk-cta2-href': 'interest.ctaHref2',
        'mk-interest-note': 'interest.note'
      };
      function getPath(path) { return path.split('.').reduce(function (o, k) { return (o || {})[k]; }, data); }
      function isUnsafeKey(k) { return k === '__proto__' || k === 'prototype' || k === 'constructor'; }
      function setPath(path, val) {
        var parts = path.split('.'), o = data;
        for (var i = 0; i < parts.length - 1; i++) {
          var key = parts[i];
          if (isUnsafeKey(key)) return;
          if (!Object.prototype.hasOwnProperty.call(o, key) || o[key] == null || typeof o[key] !== 'object') o[key] = {};
          o = o[key];
        }
        var last = parts[parts.length - 1];
        if (isUnsafeKey(last)) return;
        o[last] = val;
      }
      function renderFields() { Object.keys(FIELD_MAP).forEach(function (id) { var el = q(id); if (el) el.value = getPath(FIELD_MAP[id]) || ''; }); }
      function wireFields() { Object.keys(FIELD_MAP).forEach(function (id) { var el = q(id); if (!el) return; el.addEventListener('input', function () { setPath(FIELD_MAP[id], el.value); lazySave(); }); }); }

      function moveArr(arr, i, dir) { var j = i + dir; if (j < 0 || j >= arr.length) return; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
      function ctrls() { return '<div class="lrow-ctrls"><button class="btn-mini up" type="button" title="Opp">↑</button><button class="btn-mini dn" type="button" title="Ned">↓</button><button class="btn-mini x" type="button" title="Slett">✕</button></div>'; }

      function renderPills() {
        var hostEl = q('lst-pills'); hostEl.innerHTML = '';
        data.subhero.pills.forEach(function (p, i) {
          var row = document.createElement('div');
          row.className = 'lrow'; row.setAttribute('data-id', 'pill' + i);
          row.innerHTML =
            '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<div class="lrow-fields"><div class="fg"><label>Merkelapp</label><input type="text" data-k="text" value="' + esc(p) + '"></div></div>'
            + ctrls();
          row.querySelector('[data-k]').addEventListener('input', function () { data.subhero.pills[i] = this.value; lazySave(); });
          row.querySelector('.up').addEventListener('click', function () { moveArr(data.subhero.pills, i, -1); renderPills(); lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(data.subhero.pills, i, 1); renderPills(); lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(data.subhero.pills, i, 'Merkelapp fjernet', renderPills, lazySave); });
          hostEl.appendChild(row);
        });
      }
      function renderFeatures() {
        var hostEl = q('lst-features'); hostEl.innerHTML = '';
        data.features.forEach(function (f, i) {
          var row = document.createElement('div');
          row.className = 'lrow'; row.setAttribute('data-id', 'feat' + i);
          row.innerHTML =
            '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<div class="lrow-fields">'
              + '<div class="frow"><div class="fg narrow"><label>Symbol</label><input type="text" data-k="glyph" value="' + esc(f.glyph) + '"></div>'
              + '<div class="fg"><label>Tittel</label><input type="text" data-k="title" value="' + esc(f.title) + '"></div></div>'
              + '<div class="fg"><label>Tekst</label><textarea data-k="body">' + esc(f.body) + '</textarea></div>'
            + '</div>'
            + ctrls();
          row.querySelectorAll('[data-k]').forEach(function (inp) { inp.addEventListener('input', function () { f[inp.getAttribute('data-k')] = inp.value; lazySave(); }); });
          row.querySelector('.up').addEventListener('click', function () { moveArr(data.features, i, -1); renderFeatures(); lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(data.features, i, 1); renderFeatures(); lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(data.features, i, '«' + (f.title || 'Kort') + '» fjernet', renderFeatures, lazySave); });
          hostEl.appendChild(row);
        });
      }

      host.querySelectorAll('[data-add]').forEach(function (b) {
        b.addEventListener('click', function () {
          var which = b.getAttribute('data-add');
          if (which === 'pills') { data.subhero.pills.push(''); renderPills(); }
          else if (which === 'features') { data.features.push({ glyph: '', title: '', body: '' }); renderFeatures(); }
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
      function renderAll() { renderFields(); renderPills(); renderFeatures(); }

      function exportFile() {
        var out = { subhero: clone(data.subhero || {}), intro: clone(data.intro || {}), features: clone(data.features || []), interest: clone(data.interest || {}) };
        out.subhero.pills = (out.subhero.pills || []).filter(function (p) { return p && p.trim(); });
        out.features = (out.features || []).filter(function (f) { return (f.title && f.title.trim()) || (f.body && f.body.trim()) || (f.glyph && f.glyph.trim()); });
        var content =
          '/* Innhold for Pensum-markedet (marked.html) — TEKST-delene.\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Rediger direkte her, eller åpne Admin-senteret → Marked.\n'
          + '*/\n\n'
          + 'window.MARKED_CONTENT = ' + JSON.stringify(out, null, 2) + ';\n';
        AC.downloadBlob('content/marked-content.js', content);
        AC.toast('Fil lastet ned. Erstatt i GitHub og push!');
      }

      q('reset-btn').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); data = fresh(); renderAll(); AC.toast('Tilbakestilt til publisert versjon'); pushPreview();
      });

      var pvFrame = q('pv-board');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-marked-preview', content: data }, '*'); } catch (e) {} }
      function onPreviewMsg(e) { if (e.origin !== window.location.origin) return; if (e.data && e.data.type === 'apeiron-marked-preview-ready') { pushPreview(); fitPreview(); } }
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

      loadData(); AC.draftBaseline(LS_KEY, data); renderAll(); wireFields();
      wireDrag('lst-pills', function () { return data.subhero.pills; }, renderPills);
      wireDrag('lst-features', function () { return data.features; }, renderFeatures);
      fitPreview(); setTimeout(fitPreview, 80);
      pushPreview(); setTimeout(pushPreview, 150);

      /* ── delt «Liste + detalj»-skall (sections: hver .panel blir en rad) ── */
      var shell = AC.PanelShell.mount(host, AC, { rail: 'sections', title: 'Marked', subtitle: 'Sidetekster', remember: 'apeiron-marked-shell-sel' });
      function applyPanelLayout() { shell.layoutChanged(); }
      window.addEventListener('apeiron-panellayout', applyPanelLayout);
      applyPanelLayout();

      return {
        export: exportFile,
        destroy: function () { window.removeEventListener('message', onPreviewMsg); window.removeEventListener('resize', fitPreview); window.removeEventListener('apeiron-panellayout', applyPanelLayout); if (shell) shell.destroy(); }
      };
    }
  });
})();
