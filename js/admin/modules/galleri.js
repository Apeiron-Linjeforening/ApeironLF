/* ============================================================
   admin-modules/galleri.js — Galleri-siden (galleri.html) som C-modul.
   Styrer bare topp-banneret; bildene hentes fra Google Drive.
   Krever galleri-content.js (GALLERI_CONTENT). Live preview via
   galleri.html?preview=1.
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('galleri', {
    title: 'Galleri',
    see: { href: 'galleri.html', label: 'Se Galleri ↗' },
    exportName: 'galleri-content.js',

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live fra den ekte Galleri-siden. Selve bildene hentes automatisk fra Google Drive. Her styrer du bare <b>topp-banneret</b> (tittel og tekst øverst).</p>'
          + '<div class="pv-board-wrap"><iframe id="pv-board" src="galleri.html?preview=1" title="Forhåndsvisning av Galleri"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du Galleri-teksten</strong>'
          + '<ol>'
            + '<li>Rediger tekstene nedenfor. Endringer vises live i forhåndsvisningen</li>'
            + '<li>Trykk <b>☁ Publiser til GitHub</b> oppe til høyre</li>'
            + '<li><em>(Reserve hvis publisering svikter: «↓ Last ned alle endrede» nederst i Oversikt-fanen, og legg fila i GitHub.)</em></li>'
            + '<li>Cloudflare oppdaterer nettsiden automatisk innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren din. Bildene legges i Google Drive-mappen (ikke her).</div>'
        + '</div>'
        + '<div class="panel"><h2>Topp-banner <small>øverst på Galleri</small></h2>'
          + '<div class="panel-body">'
            + '<div class="fg"><label>Tilbake-lenke (tekst)</label><input type="text" id="gl-back"></div>'
            + '<div class="fg"><label>Tittel</label><input type="text" id="gl-title"></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="gl-lede"></textarea></div>'
          + '</div>'
        + '</div>';

      var q = function (id) { return host.querySelector('#' + id); };
      var LS_KEY = 'apeiron-galleri-v1';
      var data = {};
      function clone(o) { return JSON.parse(JSON.stringify(o)); }
      function fresh() {
        var d = clone(window.GALLERI_CONTENT || {});
        d.subhero = d.subhero || {};
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
      }
      function saveData() { AC.persistDraft(LS_KEY, data); pushPreview(); }
      var saveTimer = null;
      function lazySave() { pushPreview(); clearTimeout(saveTimer); saveTimer = setTimeout(function () { saveData(); AC.toast('Lagret i nettleseren'); }, 300); }

      var FIELD_MAP = { 'gl-back': 'subhero.back', 'gl-title': 'subhero.title', 'gl-lede': 'subhero.lede' };
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

      function exportFile() {
        var out = { subhero: clone(data.subhero || {}) };
        var content =
          '/* Innhold for Galleri-siden (galleri.html) — TEKST-delene.\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Rediger direkte her, eller åpne Admin-senteret → Galleri.\n'
          + '   Bildene hentes automatisk fra Google Drive.\n'
          + '*/\n\n'
          + 'window.GALLERI_CONTENT = ' + JSON.stringify(out, null, 2) + ';\n';
        AC.downloadBlob('galleri-content.js', content);
        AC.toast('Fil lastet ned. Erstatt i GitHub og push!');
      }

      q('reset-btn').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); data = fresh(); renderFields(); AC.toast('Tilbakestilt til publisert versjon'); pushPreview();
      });

      var pvFrame = q('pv-board');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-galleri-preview', content: data }, '*'); } catch (e) {} }
      function onPreviewMsg(e) { if (e.origin !== window.location.origin) return; if (e.data && e.data.type === 'apeiron-galleri-preview-ready') { pushPreview(); fitPreview(); } }
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

      loadData(); AC.draftBaseline(LS_KEY, data); renderFields(); wireFields();
      fitPreview(); setTimeout(fitPreview, 80);
      pushPreview(); setTimeout(pushPreview, 150);

      /* ── delt «Liste + detalj»-skall (sections: hver .panel blir en rad) ── */
      var shell = AC.PanelShell.mount(host, AC, { rail: 'sections', title: 'Galleri', subtitle: 'Topp-banner', remember: 'apeiron-galleri-shell-sel' });
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
