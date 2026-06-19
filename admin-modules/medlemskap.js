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
    exportName: 'membership-config.js',

    mount: function (host, AC) {
      var LS_KEY = 'apeiron-membership-v1';
      var esc = AC.esc;

      function fresh() {
        var c = window.MEMBERSHIP_CONFIG || {};
        return {
          vippsNumber: c.vippsNumber || '',
          vippsName: c.vippsName || '',
          steps: (c.steps || []).slice(),
          tiers: (c.tiers || []).map(function (t) { return Object.assign({}, t); })
        };
      }
      var store = AC.createStore(LS_KEY, fresh);
      function norm() {
        if (!Array.isArray(store.data.steps)) store.data.steps = [];
        if (!Array.isArray(store.data.tiers)) store.data.tiers = [];
      }
      norm();
      function uid() { return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live fra forsiden — «Bli medlem»-kortet (priser og innmeldingssteg) oppdateres mens du skriver.</p>'
          + '<div class="pv-frame-wrap"><iframe id="pv-frame" src="index.html?preview=1#bli-medlem" title="Forhåndsvisning av Bli medlem"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" data-reset type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du medlemskapsprisene</strong>'
          + '<ol><li>Rediger Vipps-info, prisnivåer og innmeldingsstegene nedenfor</li>'
          + '<li>Klikk <b>↓ Last ned alle endrede</b> oppe til høyre</li>'
          + '<li>Erstatt <code>membership-config.js</code> i GitHub-repoet og commit/push</li>'
          + '<li>Cloudflare oppdaterer nettsiden automatisk innen et minutt</li></ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren. Last ned filen for å publisere.</div>'
        + '</div>'
        + '<div class="panel"><div class="sec-head"><h2>Vipps</h2></div>'
          + '<div class="frow">'
            + '<div class="fg narrow"><label data-help="Vipps-nummeret medlemmer betaler til, f.eks. #551937.">Vipps-nummer</label><input type="text" data-meta="vippsNumber" placeholder="#551937"></div>'
            + '<div class="fg"><label data-help="Navnet som vises i Vipps for mottakeren.">Vipps-navn</label><input type="text" data-meta="vippsName" placeholder="Apeiron"></div>'
          + '</div></div>'
        + '<div class="panel"><div class="sec-head"><h2>Prisnivåer</h2><button class="btn-add" data-add-tier type="button">+ Nytt nivå</button></div><div class="list" data-tiers></div></div>'
        + '<div class="panel"><div class="sec-head"><h2>Innmeldingssteg</h2><button class="btn-add" data-add-step type="button">+ Nytt steg</button></div>'
          + '<p class="tip-note" style="margin:0 0 14px"><b>Tips:</b> bruk <code>{vipps}</code> for Vipps-nummeret og <code>{navn}</code> for Vipps-navnet i teksten.</p>'
          + '<div class="list" data-steps></div></div>';

      var tierList = host.querySelector('[data-tiers]');
      var stepList = host.querySelector('[data-steps]');

      function move(arr, i, dir) { var j = i + dir; if (j < 0 || j >= arr.length) return; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }

      function renderMeta() {
        host.querySelectorAll('[data-meta]').forEach(function (el) {
          var f = el.getAttribute('data-meta');
          el.value = store.data[f] || '';
          el.oninput = function () { store.data[f] = el.value; store.lazySave(); };
        });
      }

      function renderTiers() {
        tierList.innerHTML = '';
        store.data.tiers.forEach(function (t, i) {
          var card = document.createElement('div');
          card.className = 'card';
          card.setAttribute('data-id', t.id || (t.id = uid()));
          card.innerHTML =
            '<div class="card-head"><span class="drag-handle" title="Dra for å sortere">⠿</span>'
              + '<span class="card-title">' + esc(t.label || '(nytt nivå)') + '</span>'
              + '<div class="order-btns"><button class="btn-ord" data-up type="button">↑</button><button class="btn-ord" data-dn type="button">↓</button></div>'
              + '<button class="btn-del" type="button">Slett</button></div>'
            + '<div class="frow">'
              + '<div class="fg"><label>Navn på nivå</label><input type="text" data-f="label" value="' + esc(t.label || '') + '" placeholder="f.eks. Ett studieår"></div>'
              + '<div class="fg narrow"><label data-help="Pris i kroner. Vises som «100,–».">Pris (kr)</label><input type="number" data-f="price" value="' + (t.price != null && isFinite(t.price) ? Number(t.price) : '') + '" min="0" step="1" placeholder="100"></div>'
            + '</div>'
            + '<div class="fg"><label data-help="Kort forklaring under prisen. La stå tom for å skjule.">Forklaring</label><input type="text" data-f="note" value="' + esc(t.note || '') + '" placeholder="f.eks. Gjelder ett studieår (høst + vår)."></div>';
          card.querySelectorAll('[data-f]').forEach(function (el) {
            el.addEventListener('input', function () {
              var f = el.getAttribute('data-f');
              t[f] = el.type === 'number' ? (el.value === '' ? null : Number(el.value)) : el.value;
              if (f === 'label') card.querySelector('.card-title').textContent = el.value || '(nytt nivå)';
              store.lazySave();
            });
          });
          card.querySelector('[data-up]').addEventListener('click', function () { move(store.data.tiers, i, -1); renderTiers(); store.lazySave(); });
          card.querySelector('[data-dn]').addEventListener('click', function () { move(store.data.tiers, i, 1); renderTiers(); store.lazySave(); });
          card.querySelector('.btn-del').addEventListener('click', function () {
            if (confirm('Slett «' + (t.label || 'dette nivået') + '»?')) { store.data.tiers.splice(i, 1); renderTiers(); store.lazySave(); }
          });
          tierList.appendChild(card);
        });
        AC.enhanceHelp(tierList);
      }

      function renderSteps() {
        stepList.innerHTML = '';
        store.data.steps.forEach(function (txt, i) {
          var card = document.createElement('div');
          card.className = 'card';
          card.setAttribute('data-id', i);
          card.innerHTML =
            '<div class="card-head"><span class="drag-handle" title="Dra for å sortere">⠿</span>'
              + '<span class="card-title">Steg ' + (i + 1) + '</span>'
              + '<div class="order-btns"><button class="btn-ord" data-up type="button">↑</button><button class="btn-ord" data-dn type="button">↓</button></div>'
              + '<button class="btn-del" type="button">Slett</button></div>'
            + '<div class="fg"><label>Tekst</label><input type="text" data-f="step" value="' + esc(txt) + '" placeholder="f.eks. Vipps riktig beløp til {vipps} «{navn}»"></div>';
          card.querySelector('[data-f]').addEventListener('input', function (e) { store.data.steps[i] = e.target.value; store.lazySave(); });
          card.querySelector('[data-up]').addEventListener('click', function () { move(store.data.steps, i, -1); renderSteps(); store.lazySave(); });
          card.querySelector('[data-dn]').addEventListener('click', function () { move(store.data.steps, i, 1); renderSteps(); store.lazySave(); });
          card.querySelector('.btn-del').addEventListener('click', function () { store.data.steps.splice(i, 1); renderSteps(); store.lazySave(); });
          stepList.appendChild(card);
        });
      }

      function renderAll() { renderMeta(); renderTiers(); renderSteps(); }
      renderAll();

      host.querySelector('[data-add-tier]').addEventListener('click', function () {
        store.data.tiers.push({ id: uid(), label: '', price: null, note: '' }); renderTiers(); store.lazySave();
      });
      host.querySelector('[data-add-step]').addEventListener('click', function () {
        store.data.steps.push(''); renderSteps(); store.lazySave();
      });
      host.querySelector('[data-reset]').addEventListener('click', function () {
        if (!confirm('Tilbakestille til siste publiserte versjon? Lokale endringer forsvinner.')) return;
        store.reset(); norm(); renderAll(); AC.toast('Tilbakestilt til publisert versjon');
      });

      AC.enableDragSort(tierList, {
        itemSelector: '.card', handleSelector: '.drag-handle',
        onReorder: function (ids) { store.data.tiers.sort(function (a, b) { return ids.indexOf(a.id) - ids.indexOf(b.id); }); renderTiers(); store.lazySave(); }
      });
      AC.enableDragSort(stepList, {
        itemSelector: '.card', handleSelector: '.drag-handle',
        onReorder: function (ids) { var snap = store.data.steps.slice(); store.data.steps = ids.map(function (o) { return snap[Number(o)]; }); renderSteps(); store.lazySave(); }
      });

      // Skallet kaller denne når brukeren trykker «Last ned …».
      function exportFile() {
        var out = {
          vippsNumber: store.data.vippsNumber || '',
          vippsName: store.data.vippsName || '',
          steps: store.data.steps,
          tiers: store.data.tiers.map(function (t) {
            return { id: t.id || uid(), label: t.label || '', price: t.price != null ? t.price : 0, note: t.note || '' };
          })
        };
        var js = '/* ============================================================\n'
          + '   membership-config.js — medlemskapspriser og innmeldingsinfo\n'
          + '   Redigeres via Admin-senteret → Medlemskap (last ned og erstatt denne filen).\n'
          + '   ============================================================ */\n'
          + 'window.MEMBERSHIP_CONFIG = ' + JSON.stringify(out, null, 2) + ';\n';
        AC.saveFile('membership-config.js', js);
        AC.toast('Lastet ned membership-config.js');
      }

      /* ── live forhåndsvisning (index.html?preview=1#bli-medlem) ── */
      var pvFrame = host.querySelector('#pv-frame');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-membership-preview', content: store.data }, '*'); } catch (e) {} }
      var origSave = store.save;
      store.save = function () { origSave(); pushPreview(); };
      function onPreviewMsg(e) { if (e.data && e.data.type === 'apeiron-membership-preview-ready') { pushPreview(); fitPreview(); } }
      function fitPreview() {
        var wrap = host.querySelector('.pv-frame-wrap');
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

      return {
        export: exportFile,
        destroy: function () { window.removeEventListener('message', onPreviewMsg); window.removeEventListener('resize', fitPreview); }
      };
    }
  });
})();
