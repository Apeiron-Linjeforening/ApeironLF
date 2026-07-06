/* ============================================================
   admin-modules/medlemskap.js — Medlemskap-editor som C-modul
   Registreres i panel-registeret og mountes av skallet (admin.html).
   Erstatter den frittstående medlemskap-admin.html.
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('medlemskap', {
    title: 'Medlemskap',
    see: { href: 'index.html#bli-medlem', label: 'Se «Bli medlem»' },
    exportName: 'content/membership-config.js',

    mount: function (host, AC) {
      var LS_KEY = 'apeiron-membership-v1';
      var esc = AC.esc;

      function fresh() {
        var c = window.MEMBERSHIP_CONFIG || {};
        return {
          eyebrow: c.eyebrow || '',
          heading: c.heading || '',
          lede: c.lede || '',
          benefits: (c.benefits || []).slice(),
          vippsNumber: c.vippsNumber || '',
          vippsName: c.vippsName || '',
          steps: (c.steps || []).slice(),
          tiers: (c.tiers || []).map(function (t) { return Object.assign({}, t); })
        };
      }
      var store = AC.createStore(LS_KEY, fresh);
      function norm() {
        // «Bli medlem»-introen ble tidligere redigert i Forsiden-panelet og lagret
        // i content/index-content.js. Eldre lokale utkast mangler derfor intro-feltene —
        // vi seeder dem fra MEMBERSHIP_CONFIG, med fallback til INDEX_CONTENT.medlem.
        var c = window.MEMBERSHIP_CONFIG || {};
        var m = (window.INDEX_CONTENT && window.INDEX_CONTENT.medlem) || {};
        if (store.data.eyebrow == null) store.data.eyebrow = c.eyebrow != null ? c.eyebrow : (m.eyebrow || '');
        if (store.data.heading == null) store.data.heading = c.heading != null ? c.heading : (m.heading || '');
        if (store.data.lede == null) store.data.lede = c.lede != null ? c.lede : (m.lede || '');
        if (!Array.isArray(store.data.benefits)) {
          var b = Array.isArray(c.benefits) ? c.benefits : (Array.isArray(m.benefits) ? m.benefits : []);
          store.data.benefits = b.slice();
        }
        if (!Array.isArray(store.data.steps)) store.data.steps = [];
        if (!Array.isArray(store.data.tiers)) store.data.tiers = [];
      }
      norm();
      function uid() { return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live fra «Bli medlem»-seksjonen på forsiden. Hele blokken — intro, fordeler, Vipps, priser og innmeldingssteg — oppdateres mens du skriver.</p>'
          + '<div class="pv-board-wrap"><iframe id="pv-board" src="index.html?preview=1&solo=bli-medlem" title="Forhåndsvisning av Bli medlem"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" data-reset type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du medlemskapsprisene</strong>'
          + '<ol><li>Rediger Vipps-info, prisnivåer og innmeldingsstegene nedenfor</li>'
          + '<li>Trykk <b>☁ Publiser til GitHub</b> oppe til høyre</li>'
          + '<li>Erstatt <code>content/membership-config.js</code> i GitHub-repoet og commit/push</li>'
          + '<li>Cloudflare oppdaterer nettsiden automatisk innen et minutt</li></ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren. Last ned filen for å publisere.</div>'
        + '</div>'
        + '<div class="panel"><h2>Bli medlem <small>intro-teksten</small></h2>'
          + '<div class="panel-body">'
            + '<p class="hint">Introteksten i venstre kolonne av «Bli medlem»-seksjonen. Tidligere lå dette i Forsiden-panelet — nå styres hele blokken herfra.</p>'
            + '<div class="fg"><label>Eyebrow (liten etikett over tittelen)</label><input type="text" data-meta="eyebrow" placeholder="Bli en av oss"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" data-meta="heading" placeholder="Bli medlem i Apeiron"></div>'
            + '<div class="fg"><label>Ingress</label><textarea data-meta="lede" placeholder="Studerer du filosofi eller etikk ved NTNU? …"></textarea></div>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Fordeler <small>punktene med avhuking</small></h2>'
          + '<div class="panel-body">'
            + '<div class="lst" id="lst-benefits"></div><button class="btn-add" type="button" data-add="benefits">+ Ny fordel</button>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Vipps <small>betalingsinfo</small></h2>'
          + '<div class="panel-body">'
            + '<div class="frow"><div class="fg narrow"><label>Vipps-nummer</label><input type="text" data-meta="vippsNumber" placeholder="#551937"></div>'
            + '<div class="fg"><label>Vipps-navn</label><input type="text" data-meta="vippsName" placeholder="Apeiron"></div></div>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Prisnivåer <small>pris-kortene</small></h2>'
          + '<div class="panel-body">'
            + '<div class="lst" id="lst-tiers"></div><button class="btn-add" type="button" data-add="tiers">+ Nytt nivå</button>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Innmeldingssteg <small>stegene under prisen</small></h2>'
          + '<div class="panel-body">'
            + '<p class="hint">Tips: bruk <code>{vipps}</code> for Vipps-nummeret og <code>{navn}</code> for Vipps-navnet i teksten.</p>'
            + '<div class="lst" id="lst-steps"></div><button class="btn-add" type="button" data-add="steps">+ Nytt steg</button>'
          + '</div>'
        + '</div>';

      var q = function (id) { return host.querySelector('#' + id); };
      function moveArr(arr, i, dir) { var j = i + dir; if (j < 0 || j >= arr.length) return; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
      function ctrls() { return '<div class="lrow-ctrls"><button class="btn-mini up" type="button" title="Opp">↑</button><button class="btn-mini dn" type="button" title="Ned">↓</button><button class="btn-mini x" type="button" title="Slett">✕</button></div>'; }

      function renderMeta() {
        host.querySelectorAll('[data-meta]').forEach(function (el) {
          var f = el.getAttribute('data-meta');
          el.value = store.data[f] || '';
          el.oninput = function () { store.data[f] = el.value; store.lazySave(); };
        });
      }

      function renderBenefits() {
        var hostEl = q('lst-benefits'); hostEl.innerHTML = '';
        store.data.benefits.forEach(function (txt, i) {
          var row = document.createElement('div');
          row.className = 'lrow'; row.setAttribute('data-id', 'ben' + i);
          row.innerHTML =
            '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<div class="lrow-fields"><div class="fg"><label>Fordel</label><input type="text" data-k="text" value="' + esc(txt) + '" placeholder="f.eks. Rabattert inngang på alle arrangementer"></div></div>'
            + ctrls();
          row.querySelector('[data-k]').addEventListener('input', function () { store.data.benefits[i] = this.value; store.lazySave(); });
          row.querySelector('.up').addEventListener('click', function () { moveArr(store.data.benefits, i, -1); renderBenefits(); store.lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(store.data.benefits, i, 1); renderBenefits(); store.lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(store.data.benefits, i, 'Fordel slettet', renderBenefits, store.lazySave); });
          hostEl.appendChild(row);
        });
      }

      function renderTiers() {
        var hostEl = q('lst-tiers'); hostEl.innerHTML = '';
        store.data.tiers.forEach(function (t, i) {
          if (!t.id) t.id = uid();
          var row = document.createElement('div');
          row.className = 'lrow'; row.setAttribute('data-id', t.id);
          row.innerHTML =
            '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<div class="lrow-fields">'
              + '<div class="frow"><div class="fg"><label>Navn på nivå</label><input type="text" data-k="label" value="' + esc(t.label || '') + '" placeholder="f.eks. Ett studieår"></div>'
              + '<div class="fg narrow"><label>Pris (kr)</label><input type="number" data-k="price" value="' + (t.price != null && isFinite(t.price) ? Number(t.price) : '') + '" min="0" step="1" placeholder="100"></div></div>'
              + '<div class="fg"><label>Forklaring</label><input type="text" data-k="note" value="' + esc(t.note || '') + '" placeholder="f.eks. Gjelder ett studieår (høst + vår)."></div>'
            + '</div>'
            + ctrls();
          row.querySelectorAll('[data-k]').forEach(function (el) {
            el.addEventListener('input', function () {
              var f = el.getAttribute('data-k');
              t[f] = el.type === 'number' ? (el.value === '' ? null : Number(el.value)) : el.value;
              store.lazySave();
            });
          });
          row.querySelector('.up').addEventListener('click', function () { moveArr(store.data.tiers, i, -1); renderTiers(); store.lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(store.data.tiers, i, 1); renderTiers(); store.lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(store.data.tiers, i, '«' + (t.label || 'Nivå') + '» slettet', renderTiers, store.lazySave); });
          hostEl.appendChild(row);
        });
      }

      function renderSteps() {
        var hostEl = q('lst-steps'); hostEl.innerHTML = '';
        store.data.steps.forEach(function (txt, i) {
          var row = document.createElement('div');
          row.className = 'lrow'; row.setAttribute('data-id', 'step' + i);
          row.innerHTML =
            '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<div class="lrow-fields"><div class="fg"><label>Steg ' + (i + 1) + '</label><input type="text" data-k="text" value="' + esc(txt) + '" placeholder="f.eks. Vipps riktig beløp til {vipps} «{navn}»"></div></div>'
            + ctrls();
          row.querySelector('[data-k]').addEventListener('input', function () { store.data.steps[i] = this.value; store.lazySave(); });
          row.querySelector('.up').addEventListener('click', function () { moveArr(store.data.steps, i, -1); renderSteps(); store.lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(store.data.steps, i, 1); renderSteps(); store.lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(store.data.steps, i, 'Steg slettet', renderSteps, store.lazySave); });
          hostEl.appendChild(row);
        });
      }

      function renderAll() { renderMeta(); renderBenefits(); renderTiers(); renderSteps(); }
      renderAll();

      host.querySelectorAll('[data-add]').forEach(function (b) {
        b.addEventListener('click', function () {
          var which = b.getAttribute('data-add');
          if (which === 'benefits') { store.data.benefits.push(''); renderBenefits(); }
          else if (which === 'tiers') { store.data.tiers.push({ id: uid(), label: '', price: null, note: '' }); renderTiers(); }
          else if (which === 'steps') { store.data.steps.push(''); renderSteps(); }
          store.lazySave();
        });
      });
      host.querySelector('[data-reset]').addEventListener('click', function () {
        if (!confirm('Tilbakestille til siste publiserte versjon? Lokale endringer forsvinner.')) return;
        store.reset(); norm(); renderAll(); AC.toast('Tilbakestilt til publisert versjon');
      });

      function wireDrag(hostId, arrRef, rerender, byId) {
        AC.enableDragSort(q(hostId), {
          itemSelector: '.lrow', handleSelector: '.drag-handle', holdToDrag: true,
          onReorder: function (ids) {
            var arr = arrRef();
            var next = byId
              ? ids.map(function (id) { return arr.filter(function (x) { return x.id === id; })[0]; })
              : ids.map(function (id) { return arr[parseInt(id.replace(/^\D+/, ''), 10)]; });
            arr.length = 0; Array.prototype.push.apply(arr, next);
            rerender(); store.lazySave();
          }
        });
      }
      wireDrag('lst-benefits', function () { return store.data.benefits; }, renderBenefits, false);
      wireDrag('lst-tiers', function () { return store.data.tiers; }, renderTiers, true);
      wireDrag('lst-steps', function () { return store.data.steps; }, renderSteps, false);

      // Skallet kaller denne når brukeren trykker «Last ned …».
      function exportFile() {
        var out = {
          eyebrow: store.data.eyebrow || '',
          heading: store.data.heading || '',
          lede: store.data.lede || '',
          benefits: (store.data.benefits || []).filter(function (b) { return String(b).trim() !== ''; }),
          vippsNumber: store.data.vippsNumber || '',
          vippsName: store.data.vippsName || '',
          steps: store.data.steps,
          tiers: store.data.tiers.map(function (t) {
            return { id: t.id || uid(), label: t.label || '', price: t.price != null ? t.price : 0, note: t.note || '' };
          })
        };
        var js = '/* ============================================================\n'
          + '   content/membership-config.js — medlemskapspriser og innmeldingsinfo\n'
          + '   Redigeres via Admin-senteret → Medlemskap (last ned og erstatt denne filen).\n'
          + '   ============================================================ */\n'
          + 'window.MEMBERSHIP_CONFIG = ' + JSON.stringify(out, null, 2) + ';\n';
        AC.saveFile('content/membership-config.js', js);
        AC.toast('Lastet ned content/membership-config.js');
      }

      /* ── live forhåndsvisning (index.html?preview=1&solo=bli-medlem) ── */
      var pvFrame = host.querySelector('#pv-board');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-membership-preview', content: store.data }, '*'); } catch (e) {} }
      var origSave = store.save;
      store.save = function () { origSave(); pushPreview(); };
      function onPreviewMsg(e) { if (e.origin !== window.location.origin) return; if (e.data && e.data.type === 'apeiron-membership-preview-ready') { pushPreview(); fitPreview(); } }
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
      if (pvFrame) pvFrame.addEventListener('load', function () { fitPreview(); pushPreview(); });
      fitPreview(); setTimeout(fitPreview, 80);
      pushPreview(); setTimeout(pushPreview, 200);

      /* ── delt «Liste + detalj»-skall (sections: hver .panel blir en rad) ── */
      var shell = AC.PanelShell.mount(host, AC, { rail: 'sections', title: 'Medlemskap', subtitle: 'Sidetekster', remember: 'apeiron-medlemskap-shell-sel' });
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
