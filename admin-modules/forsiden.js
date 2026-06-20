/* ============================================================
   admin-modules/forsiden.js — Forsiden (Hjem): Hero + Kontakt, som C-modul
   Erstatter index-admin.html. Krever footer-icons.js (FOOTER_ICON_LABELS) og
   index-content.js (INDEX_CONTENT), som skallet (admin.html) laster.
   Live forhåndsvisning via index.html?preview=1.
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('forsiden', {
    title: 'Forsiden',
    see: { href: 'index.html', label: 'Se Hjem ↗' },
    exportName: 'index-content.js',

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live fra den ekte forsiden (Hjem) — endringene dine vises umiddelbart. Dette panelet styrer <b>Hero</b> og <b>Kontakt</b>. «Om oss» og FAQ redigeres i <b>Om oss</b>.</p>'
          + '<div class="pv-board-wrap"><iframe id="pv-board" src="index.html?preview=1" title="Forhåndsvisning av forsiden"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du Hjem</strong>'
          + '<ol>'
            + '<li>Rediger tekstene nedenfor — endringer vises live i forhåndsvisningen</li>'
            + '<li>Klikk <b>↓ Last ned alle endrede</b> oppe til høyre</li>'
            + '<li>Erstatt <code>index-content.js</code> i GitHub-repositoriet og push/commit</li>'
            + '<li>Cloudflare oppdaterer nettsiden automatisk innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren din. Dette panelet styrer kun <b>Hero</b> og <b>Kontakt</b> på Hjem. «Om oss» + FAQ ligger i Om oss-panelet. Arrangementer, nyheter, oppslagstavla og medlemspriser redigeres andre steder.</div>'
        + '</div>'
        + '<div class="panel"><h2>Hero <small>øverst på Hjem</small></h2>'
          + '<div class="panel-body">'
            + '<div class="fg"><label>Eyebrow (liten etikett over tittelen)</label><input type="text" id="hero-eyebrow"></div>'
            + '<div class="fg"><label>Undertittel</label><input type="text" id="hero-tag"></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="hero-lede"></textarea></div>'
            + '<div class="frow"><div class="fg"><label>Knapp 1 — tekst</label><input type="text" id="hero-cta1-label"></div>'
            + '<div class="fg narrow"><label>Knapp 1 — lenke</label><input type="text" id="hero-cta1-href" placeholder="#bli-medlem"></div></div>'
            + '<div class="frow"><div class="fg"><label>Knapp 2 — tekst</label><input type="text" id="hero-cta2-label"></div>'
            + '<div class="fg narrow"><label>Knapp 2 — lenke</label><input type="text" id="hero-cta2-href" placeholder="#arrangementer"></div></div>'
            + '<div class="sub-h">«Under oppbygging»-banner</div>'
            + '<div class="toggle-row"><span class="t-lbl"><b>Vis banneret</b><span>Den gule advarselen nederst i hero. Skru av når siden er ferdig.</span></span>'
            + '<label class="switch"><input type="checkbox" id="hero-wip-show"><span class="sl"></span></label></div>'
            + '<div class="fg"><label>Banner-tekst</label><input type="text" id="hero-wip-text"></div>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Kontakt <small>nederst på Hjem</small></h2>'
          + '<div class="panel-body">'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="k-heading"></div>'
            + '<div class="fg"><label>E-post</label><input type="text" id="k-email"></div>'
            + '<div class="fg"><label>Adresse</label><input type="text" id="k-address"></div>'
            + '<div class="frow"><div class="fg"><label>Nettside (vist tekst)</label><input type="text" id="k-web"></div>'
            + '<div class="fg"><label>Nettside (full lenke)</label><input type="text" id="k-webHref" placeholder="https://..."></div></div>'
            + '<div class="sub-h">Vanlige spørsmål <small style="font-weight:400;text-transform:none;letter-spacing:0">(vist ved siden av kontakt)</small></div>'
            + '<div class="fg"><label>Seksjonsoverskrift</label><input type="text" id="k-faqHeading"></div>'
            + '<p class="hint">Et kort utdrag på Hjem. Den fulle FAQ-en ligger i Om oss-panelet.</p>'
            + '<div class="lst" id="lst-hjemfaq"></div><button class="btn-add" type="button" data-add="hjemfaq">+ Nytt spørsmål</button>'
            + '<div class="sub-h">Medie- &amp; sosiale lenker</div>'
            + '<p class="hint">Legg til Instagram, Facebook, YouTube, e-post osv. Velg ikon fra lista. Bruk full lenke (https://…) eller mailto:… for e-post.</p>'
            + '<div class="lst" id="lst-socials"></div><button class="btn-add" type="button" data-add="socials">+ Ny lenke</button>'
          + '</div>'
        + '</div>';

      var q = function (id) { return host.querySelector('#' + id); };
      var LS_KEY = 'apeiron-index-v1';
      var data = {};
      function clone(o) { return JSON.parse(JSON.stringify(o)); }
      function fresh() {
        var c = window.INDEX_CONTENT || {};
        var d = clone(c);
        d.hero = d.hero || {};
        d.hero.cta1 = d.hero.cta1 || { label: '', href: '' };
        d.hero.cta2 = d.hero.cta2 || { label: '', href: '' };
        d.hero.wip = d.hero.wip || { show: true, text: '' };
        d.kontakt = d.kontakt || {};
        d.kontakt.socials = Array.isArray(d.kontakt.socials) ? d.kontakt.socials : [];
        d.kontakt.faq = Array.isArray(d.kontakt.faq) ? d.kontakt.faq : [];
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
        data.hero = Object.assign({}, f.hero, data.hero);
        data.hero.cta1 = Object.assign({}, f.hero.cta1, data.hero.cta1);
        data.hero.cta2 = Object.assign({}, f.hero.cta2, data.hero.cta2);
        data.hero.wip = Object.assign({}, f.hero.wip, data.hero.wip);
        data.kontakt = Object.assign({}, f.kontakt, data.kontakt);
        if (!Array.isArray(data.kontakt.socials)) data.kontakt.socials = [];
        if (!Array.isArray(data.kontakt.faq)) data.kontakt.faq = [];
      }
      function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(data)); pushPreview(); }
      var saveTimer = null;
      function lazySave() { pushPreview(); clearTimeout(saveTimer); saveTimer = setTimeout(function () { saveData(); AC.toast('Lagret i nettleseren'); }, 300); }
      function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

      var FIELD_MAP = {
        'hero-eyebrow': 'hero.eyebrow', 'hero-tag': 'hero.tag', 'hero-lede': 'hero.lede',
        'hero-cta1-label': 'hero.cta1.label', 'hero-cta1-href': 'hero.cta1.href',
        'hero-cta2-label': 'hero.cta2.label', 'hero-cta2-href': 'hero.cta2.href',
        'hero-wip-text': 'hero.wip.text',
        'k-heading': 'kontakt.heading', 'k-email': 'kontakt.email', 'k-address': 'kontakt.address',
        'k-web': 'kontakt.web', 'k-webHref': 'kontakt.webHref', 'k-faqHeading': 'kontakt.faqHeading'
      };
      function getPath(path) { return path.split('.').reduce(function (o, k) { return (o || {})[k]; }, data); }
      function isUnsafeKey(k) { return k === '__proto__' || k === 'prototype' || k === 'constructor'; }
      function setPath(path, val) {
        var parts = path.split('.'), o = data;
        for (var p = 0; p < parts.length; p++) { if (isUnsafeKey(parts[p])) return; }
        for (var i = 0; i < parts.length - 1; i++) {
          var key = parts[i];
          if (!Object.prototype.hasOwnProperty.call(o, key) || o[key] == null || typeof o[key] !== 'object') o[key] = {};
          o = o[key];
        }
        o[parts[parts.length - 1]] = val;
      }
      function renderFields() {
        Object.keys(FIELD_MAP).forEach(function (id) { var el = q(id); if (el) el.value = getPath(FIELD_MAP[id]) || ''; });
        q('hero-wip-show').checked = data.hero.wip.show !== false;
      }
      function wireFields() {
        Object.keys(FIELD_MAP).forEach(function (id) { var el = q(id); if (!el) return; el.addEventListener('input', function () { setPath(FIELD_MAP[id], el.value); lazySave(); }); });
        q('hero-wip-show').addEventListener('change', function () { data.hero.wip.show = this.checked; lazySave(); });
      }

      function renderSocials() {
        var hostEl = q('lst-socials'); hostEl.innerHTML = '';
        var LABELS = window.FOOTER_ICON_LABELS || {};
        data.kontakt.socials.forEach(function (s, i) {
          var row = document.createElement('div');
          row.className = 'lrow'; row.setAttribute('data-id', 'soc' + i);
          var opts = Object.keys(LABELS).map(function (k) { return '<option value="' + k + '"' + (s.icon === k ? ' selected' : '') + '>' + esc(LABELS[k]) + '</option>'; }).join('');
          row.innerHTML =
            '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<div class="lrow-fields">'
              + '<div class="frow"><div class="fg"><label>Navn</label><input type="text" data-k="label" value="' + esc(s.label) + '" placeholder="Instagram"></div>'
              + '<div class="fg narrow"><label>Ikon</label><select data-k="icon">' + opts + '</select></div></div>'
              + '<div class="fg"><label>Lenke</label><input type="text" data-k="href" value="' + esc(s.href) + '" placeholder="https://… eller mailto:…"></div>'
            + '</div>'
            + '<div class="lrow-ctrls"><button class="btn-mini up" type="button" title="Opp">↑</button><button class="btn-mini dn" type="button" title="Ned">↓</button><button class="btn-mini x" type="button" title="Slett">✕</button></div>';
          row.querySelectorAll('[data-k]').forEach(function (inp) { var ev = inp.tagName === 'SELECT' ? 'change' : 'input'; inp.addEventListener(ev, function () { s[inp.getAttribute('data-k')] = inp.value; lazySave(); }); });
          row.querySelector('.up').addEventListener('click', function () { moveArr(data.kontakt.socials, i, -1); renderSocials(); lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(data.kontakt.socials, i, 1); renderSocials(); lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(data.kontakt.socials, i, '«' + (s.label || 'Sosial lenke') + '» fjernet', renderSocials, lazySave); });
          hostEl.appendChild(row);
        });
      }
      function renderHjemFaq() {
        var hostEl = q('lst-hjemfaq'); hostEl.innerHTML = '';
        data.kontakt.faq.forEach(function (it, i) {
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
          row.querySelector('.up').addEventListener('click', function () { moveArr(data.kontakt.faq, i, -1); renderHjemFaq(); lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(data.kontakt.faq, i, 1); renderHjemFaq(); lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(data.kontakt.faq, i, 'Spørsmål fjernet', renderHjemFaq, lazySave); });
          hostEl.appendChild(row);
        });
      }
      function moveArr(arr, i, dir) { var j = i + dir; if (j < 0 || j >= arr.length) return; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }

      host.querySelectorAll('[data-add]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.getAttribute('data-add') === 'socials') { data.kontakt.socials.push({ label: '', href: '', icon: 'web' }); renderSocials(); lazySave(); }
          else if (b.getAttribute('data-add') === 'hjemfaq') { data.kontakt.faq.push({ q: '', a: '' }); renderHjemFaq(); lazySave(); }
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
      function renderAll() { renderFields(); renderSocials(); renderHjemFaq(); }

      function exportFile() {
        var out = { hero: clone(data.hero || {}), kontakt: clone(data.kontakt || {}) };
        out.kontakt.socials = (out.kontakt.socials || []).filter(function (s) { return (s.label && s.label.trim()) || (s.href && s.href.trim()); });
        out.kontakt.faq = (out.kontakt.faq || []).filter(function (it) { return (it.q && it.q.trim()) || (it.a && it.a.trim()); });
        var content =
          '/* Innhold for forsiden (index.html / «Hjem») — TEKST-delene som endres ofte.\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Rediger direkte her, eller åpne Admin-senteret → Forsiden.\n'
          + '\n'
          + '   Dekker forsiden (Hjem): hero + kontakt.\n'
          + '   «Om oss» + FAQ ligger på om-oss.html → om-content.js (Om oss-panelet).\n'
          + '*/\n\n'
          + 'window.INDEX_CONTENT = ' + JSON.stringify(out, null, 2) + ';\n';
        AC.downloadBlob('index-content.js', content);
        AC.toast('Fil lastet ned — erstatt i GitHub og push!');
      }

      q('reset-btn').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); data = fresh(); renderAll(); AC.toast('Tilbakestilt til publisert versjon'); pushPreview();
      });

      var pvFrame = q('pv-board');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-index-preview', content: data }, '*'); } catch (e) {} }
      function onPreviewMsg(e) { if (e.data && e.data.type === 'apeiron-index-preview-ready') { pushPreview(); fitPreview(); } }
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

      loadData(); renderAll(); wireFields();
      wireDrag('lst-socials', function () { return data.kontakt.socials; }, renderSocials);
      wireDrag('lst-hjemfaq', function () { return data.kontakt.faq; }, renderHjemFaq);
      AC.viewSwitch({ list: q('lst-socials'), key: 'apeiron-forsiden-socials-view-v1', help: 'Velg hvordan lenke-radene vises mens du redigerer her i admin. Påvirker bare redigeringsvisningen, ikke nettsiden.' });
      AC.viewSwitch({ list: q('lst-hjemfaq'), key: 'apeiron-forsiden-faq-view-v1', help: 'Velg hvordan FAQ-radene vises mens du redigerer her i admin. Påvirker bare redigeringsvisningen, ikke nettsiden.' });
      fitPreview(); setTimeout(fitPreview, 80);
      pushPreview(); setTimeout(pushPreview, 150);

      return {
        export: exportFile,
        destroy: function () { window.removeEventListener('message', onPreviewMsg); window.removeEventListener('resize', fitPreview); }
      };
    }
  });
})();
