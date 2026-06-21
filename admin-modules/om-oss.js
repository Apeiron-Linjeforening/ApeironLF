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
          + '<p class="pp-sub">Live fra den ekte «Om oss»-siden — endringene dine vises umiddelbart. Dette panelet styrer <b>hele tekst-innholdet på Om oss</b> (topp-banner, «Hva er apeiron?», Samarbeid, Lesesalen, Møt styret, Bli medlem og FAQ). Hero/Kontakt på Hjem ligger i Forsiden-panelet; medlemspriser i Medlemskap.</p>'
          + '<div class="pv-board-wrap"><iframe id="pv-board" src="om-oss.html?preview=1" title="Forhåndsvisning av Om oss"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du Om oss</strong>'
          + '<ol>'
            + '<li>Rediger tekstene nedenfor — endringer vises live i forhåndsvisningen</li>'
            + '<li>Klikk <b>↓ Last ned alle endrede</b> oppe til høyre</li>'
            + '<li>Erstatt <code>om-content.js</code> i GitHub-repositoriet og push/commit</li>'
            + '<li>Cloudflare oppdaterer nettsiden automatisk innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren din. Dette panelet styrer <b>hele tekst-innholdet på Om oss</b>. Lesesalen-bildene ligger som filer i <code>assets/lesesalen/</code>. Hero/Kontakt på Hjem ligger i Forsiden-panelet; medlemspriser i Medlemskap.</div>'
        + '</div>'
        + '<div class="panel"><h2>Topp-banner <small>øverst på Om oss</small></h2>'
          + '<div class="panel-body">'
            + '<div class="fg"><label>Tilbake-lenke (tekst)</label><input type="text" id="subhero-back"></div>'
            + '<div class="fg"><label>Tittel</label><input type="text" id="subhero-title"></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="subhero-lede"></textarea></div>'
          + '</div>'
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
        + '<div class="panel"><h2>Fellesskap &amp; samarbeid <small>intro + kort</small></h2>'
          + '<div class="panel-body">'
            + '<div class="frow"><div class="fg narrow"><label>Eyebrow</label><input type="text" id="samarbeid-eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="samarbeid-heading"></div></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="samarbeid-lede"></textarea></div>'
            + '<div class="sub-h">Kort</div><div class="lst" id="lst-allies"></div><button class="btn-add" type="button" data-addcard="allies">+ Nytt kort</button>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Lesesalen <small>intro + punkter</small></h2>'
          + '<div class="panel-body">'
            + '<div class="frow"><div class="fg narrow"><label>Eyebrow</label><input type="text" id="ls-eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="ls-heading"></div></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="ls-lede"></textarea></div>'
            + '<div class="sub-h">Punkter <small style="font-weight:400;text-transform:none;letter-spacing:0">(ikonet følger rekkefølgen)</small></div><div class="lst" id="lst-features"></div><button class="btn-add" type="button" data-add="features">+ Nytt punkt</button>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Møt styret <small>intro + kort</small></h2>'
          + '<div class="panel-body">'
            + '<div class="frow"><div class="fg narrow"><label>Eyebrow</label><input type="text" id="motstyret-eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="motstyret-heading"></div></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="motstyret-lede"></textarea></div>'
            + '<div class="sub-h">Kort</div><div class="lst" id="lst-motstyret"></div><button class="btn-add" type="button" data-addcard="motstyret">+ Nytt kort</button>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Bli medlem <small>intro-teksten på Om oss</small></h2>'
          + '<div class="panel-body">'
            + '<div class="fg"><label>Eyebrow</label><input type="text" id="om-m-eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="om-m-heading"></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="om-m-lede"></textarea></div>'
            + '<div class="sub-h">Fordeler</div><div class="lst" id="lst-benefits"></div><button class="btn-add" type="button" data-add="benefits">+ Ny fordel</button>'
            + '<p class="hint">Samme tekst som «Bli medlem»-introen på forsiden — dette er versjonen som vises på Om oss.</p>'
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
        d.subhero = d.subhero || {};
        d.samarbeid = d.samarbeid || {};
        d.samarbeid.allies = Array.isArray(d.samarbeid.allies) ? d.samarbeid.allies : [];
        d.lesesalen = d.lesesalen || {};
        d.lesesalen.features = Array.isArray(d.lesesalen.features) ? d.lesesalen.features : [];
        d.motStyret = d.motStyret || {};
        d.motStyret.cards = Array.isArray(d.motStyret.cards) ? d.motStyret.cards : [];
        d.medlem = d.medlem || {};
        d.medlem.benefits = Array.isArray(d.medlem.benefits) ? d.medlem.benefits : [];
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
        data.subhero = Object.assign({}, f.subhero, data.subhero);
        data.samarbeid = Object.assign({}, f.samarbeid, data.samarbeid);
        if (!Array.isArray(data.samarbeid.allies)) data.samarbeid.allies = [];
        data.lesesalen = Object.assign({}, f.lesesalen, data.lesesalen);
        if (!Array.isArray(data.lesesalen.features)) data.lesesalen.features = [];
        data.motStyret = Object.assign({}, f.motStyret, data.motStyret);
        if (!Array.isArray(data.motStyret.cards)) data.motStyret.cards = [];
        data.medlem = Object.assign({}, f.medlem, data.medlem);
        if (!Array.isArray(data.medlem.benefits)) data.medlem.benefits = [];
        data.faq = Object.assign({}, f.faq, data.faq);
        if (!Array.isArray(data.faq.items)) data.faq.items = [];
      }
      function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(data)); pushPreview(); }
      var saveTimer = null;
      function lazySave() { pushPreview(); clearTimeout(saveTimer); saveTimer = setTimeout(function () { saveData(); AC.toast('Lagret i nettleseren'); }, 300); }
      function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

      var FIELD_MAP = {
        'subhero-back': 'subhero.back', 'subhero-title': 'subhero.title', 'subhero-lede': 'subhero.lede',
        'samarbeid-eyebrow': 'samarbeid.eyebrow', 'samarbeid-heading': 'samarbeid.heading', 'samarbeid-lede': 'samarbeid.lede',
        'ls-eyebrow': 'lesesalen.eyebrow', 'ls-heading': 'lesesalen.heading', 'ls-lede': 'lesesalen.lede',
        'motstyret-eyebrow': 'motStyret.eyebrow', 'motstyret-heading': 'motStyret.heading', 'motstyret-lede': 'motStyret.lede',
        'om-m-eyebrow': 'medlem.eyebrow', 'om-m-heading': 'medlem.heading', 'om-m-lede': 'medlem.lede',
        'om-eyebrow': 'om.eyebrow', 'om-greek': 'om.greek', 'om-greekSmall': 'om.greekSmall',
        'om-card-title': 'om.card.title', 'om-card-body': 'om.card.body',
        'om-teaser-eyebrow': 'om.teaser.eyebrow', 'om-teaser-title': 'om.teaser.title', 'om-teaser-body': 'om.teaser.body',
        'om-teaser-linkLabel': 'om.teaser.linkLabel', 'om-teaser-linkHref': 'om.teaser.linkHref',
        'faq-eyebrow': 'faq.eyebrow', 'faq-heading': 'faq.heading'
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
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(data.om.paras, i, 'Avsnitt fjernet', renderParas, lazySave); });
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
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(data.om.stats, i, 'Tall fjernet', renderStats, lazySave); });
          hostEl.appendChild(row);
        });
      }
      function renderFeatures() {
        var hostEl = q('lst-features'); hostEl.innerHTML = '';
        data.lesesalen.features.forEach(function (f, i) {
          var row = document.createElement('div');
          row.className = 'lrow'; row.setAttribute('data-id', 'feat' + i);
          row.innerHTML =
            '<span class="drag-handle" title="Dra for \u00e5 sortere">\u283f</span>'
            + '<div class="lrow-fields">'
              + '<div class="fg"><label>Tittel</label><input type="text" data-k="title" value="' + esc(f.title) + '"></div>'
              + '<div class="fg"><label>Tekst</label><textarea data-k="body">' + esc(f.body) + '</textarea></div>'
            + '</div>'
            + '<div class="lrow-ctrls"><button class="btn-mini up" type="button" title="Opp">\u2191</button><button class="btn-mini dn" type="button" title="Ned">\u2193</button><button class="btn-mini x" type="button" title="Slett">\u2715</button></div>';
          row.querySelectorAll('[data-k]').forEach(function (inp) { inp.addEventListener('input', function () { f[inp.getAttribute('data-k')] = inp.value; lazySave(); }); });
          row.querySelector('.up').addEventListener('click', function () { moveArr(data.lesesalen.features, i, -1); renderFeatures(); lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(data.lesesalen.features, i, 1); renderFeatures(); lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(data.lesesalen.features, i, 'Punkt fjernet', renderFeatures, lazySave); });
          hostEl.appendChild(row);
        });
      }
      function renderBenefits() {
        var hostEl = q('lst-benefits'); hostEl.innerHTML = '';
        data.medlem.benefits.forEach(function (b, i) {
          var row = document.createElement('div');
          row.className = 'lrow'; row.setAttribute('data-id', 'ben' + i);
          row.innerHTML =
            '<span class="drag-handle" title="Dra for \u00e5 sortere">\u283f</span>'
            + '<div class="lrow-fields"><div class="fg"><label>Fordel</label><input type="text" data-k="text" value="' + esc(b) + '"></div></div>'
            + '<div class="lrow-ctrls"><button class="btn-mini up" type="button" title="Opp">\u2191</button><button class="btn-mini dn" type="button" title="Ned">\u2193</button><button class="btn-mini x" type="button" title="Slett">\u2715</button></div>';
          row.querySelector('[data-k]').addEventListener('input', function () { data.medlem.benefits[i] = this.value; lazySave(); });
          row.querySelector('.up').addEventListener('click', function () { moveArr(data.medlem.benefits, i, -1); renderBenefits(); lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(data.medlem.benefits, i, 1); renderBenefits(); lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(data.medlem.benefits, i, 'Fordel fjernet', renderBenefits, lazySave); });
          hostEl.appendChild(row);
        });
      }
      function renderCardList(hostId, arr, prefix, rerender) {
        var hostEl = q(hostId); hostEl.innerHTML = '';
        arr.forEach(function (c, i) {
          if (!Array.isArray(c.links)) c.links = [];
          var row = document.createElement('div');
          row.className = 'lrow'; row.setAttribute('data-id', prefix + i);
          row.innerHTML =
            '<span class="drag-handle" title="Dra for \u00e5 sortere">\u283f</span>'
            + '<div class="lrow-fields">'
              + '<div class="frow"><div class="fg narrow"><label>Symbol</label><input type="text" data-k="glyph" value="' + esc(c.glyph) + '"></div>'
              + '<div class="fg narrow"><label>Merkelapp</label><input type="text" data-k="level" value="' + esc(c.level) + '"></div>'
              + '<div class="fg"><label>Tittel</label><input type="text" data-k="title" value="' + esc(c.title) + '"></div></div>'
              + '<div class="fg"><label>Tekst</label><textarea data-k="body">' + esc(c.body) + '</textarea></div>'
              + '<div class="sub-h" style="margin-top:6px">Lenker</div><div class="card-links"></div>'
              + '<button class="btn-add" type="button" data-addlink>+ Ny lenke</button>'
            + '</div>'
            + '<div class="lrow-ctrls"><button class="btn-mini up" type="button" title="Opp">\u2191</button><button class="btn-mini dn" type="button" title="Ned">\u2193</button><button class="btn-mini x" type="button" title="Slett">\u2715</button></div>';
          row.querySelectorAll('[data-k]').forEach(function (inp) { inp.addEventListener('input', function () { c[inp.getAttribute('data-k')] = inp.value; lazySave(); }); });
          row.querySelector('.up').addEventListener('click', function () { moveArr(arr, i, -1); rerender(); lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(arr, i, 1); rerender(); lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(arr, i, '\u00abKort\u00bb fjernet', rerender, lazySave); });
          var linksHost = row.querySelector('.card-links');
          (function () {
            function renderLinks() {
              linksHost.innerHTML = '';
              c.links.forEach(function (l, j) {
                var lr = document.createElement('div');
                lr.className = 'frow link-row';
                lr.innerHTML =
                  '<div class="fg"><input type="text" data-lk="label" value="' + esc(l.label) + '" placeholder="Instagram"></div>'
                  + '<div class="fg"><input type="text" data-lk="href" value="' + esc(l.href) + '" placeholder="https://\u2026"></div>'
                  + '<button class="btn-mini x" type="button" title="Fjern lenke">\u2715</button>';
                lr.querySelectorAll('[data-lk]').forEach(function (inp) { inp.addEventListener('input', function () { l[inp.getAttribute('data-lk')] = inp.value; lazySave(); }); });
                lr.querySelector('.x').addEventListener('click', function () { c.links.splice(j, 1); renderLinks(); lazySave(); });
                linksHost.appendChild(lr);
              });
            }
            renderLinks();
            row.querySelector('[data-addlink]').addEventListener('click', function () { c.links.push({ label: '', href: '' }); renderLinks(); lazySave(); });
          })();
          hostEl.appendChild(row);
        });
      }
      function renderAllies() { renderCardList('lst-allies', data.samarbeid.allies, 'ally', renderAllies); }
      function renderMotstyret() { renderCardList('lst-motstyret', data.motStyret.cards, 'card', renderMotstyret); }
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
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(data.faq.items, i, 'Spørsmål fjernet', renderFaq, lazySave); });
          hostEl.appendChild(row);
        });
      }
      function moveArr(arr, i, dir) { var j = i + dir; if (j < 0 || j >= arr.length) return; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }

      host.querySelectorAll('[data-add]').forEach(function (b) {
        b.addEventListener('click', function () {
          var which = b.getAttribute('data-add');
          if (which === 'paras') { data.om.paras.push(''); renderParas(); }
          else if (which === 'stats') { data.om.stats.push({ num: '', lbl: '' }); renderStats(); }
          else if (which === 'features') { data.lesesalen.features.push({ title: '', body: '' }); renderFeatures(); }
          else if (which === 'benefits') { data.medlem.benefits.push(''); renderBenefits(); }
          else if (which === 'faq') { data.faq.items.push({ q: '', a: '' }); renderFaq(); }
          lazySave();
        });
      });
      host.querySelectorAll('[data-addcard]').forEach(function (b) {
        b.addEventListener('click', function () {
          var which = b.getAttribute('data-addcard');
          if (which === 'allies') { data.samarbeid.allies.push({ glyph: '', level: '', title: '', body: '', links: [] }); renderAllies(); }
          else if (which === 'motstyret') { data.motStyret.cards.push({ glyph: '', level: '', title: '', body: '', links: [] }); renderMotstyret(); }
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
      function renderAll() { renderFields(); renderParas(); renderStats(); renderAllies(); renderFeatures(); renderMotstyret(); renderBenefits(); renderFaq(); }

      function exportFile() {
        var out = { subhero: clone(data.subhero || {}), om: clone(data.om || {}), samarbeid: clone(data.samarbeid || {}), lesesalen: clone(data.lesesalen || {}), motStyret: clone(data.motStyret || {}), medlem: clone(data.medlem || {}), faq: clone(data.faq || {}) };
        function cleanLinks(list) { (list || []).forEach(function (c) { if (Array.isArray(c.links)) c.links = c.links.filter(function (l) { return (l.label && l.label.trim()) || (l.href && l.href.trim()); }); }); }
        out.samarbeid.allies = (out.samarbeid.allies || []).filter(function (a) { return (a.title && a.title.trim()) || (a.body && a.body.trim()); }); cleanLinks(out.samarbeid.allies);
        out.lesesalen.features = (out.lesesalen.features || []).filter(function (f) { return (f.title && f.title.trim()) || (f.body && f.body.trim()); });
        out.motStyret.cards = (out.motStyret.cards || []).filter(function (c) { return (c.title && c.title.trim()) || (c.body && c.body.trim()); }); cleanLinks(out.motStyret.cards);
        out.medlem.benefits = (out.medlem.benefits || []).filter(function (b) { return b && b.trim(); });
        out.om.paras = (out.om.paras || []).filter(function (p) { return p && p.trim(); });
        out.om.stats = (out.om.stats || []).filter(function (s) { return (s.num && s.num.trim()) || (s.lbl && s.lbl.trim()); });
        out.faq.items = (out.faq.items || []).filter(function (it) { return (it.q && it.q.trim()) || (it.a && it.a.trim()); });
        var content =
          '/* Innhold for Om oss-siden (om-oss.html) — TEKST-delene som endres ofte.\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Rediger direkte her, eller åpne Admin-senteret → Om oss.\n'
          + '     subhero : topp-banner · om : «Hva er apeiron?» · samarbeid · lesesalen · motStyret · medlem · faq\n'
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
      wireDrag('lst-paras', function () { return data.om.paras; }, renderParas);
      wireDrag('lst-stats', function () { return data.om.stats; }, renderStats);
      wireDrag('lst-allies', function () { return data.samarbeid.allies; }, renderAllies);
      wireDrag('lst-features', function () { return data.lesesalen.features; }, renderFeatures);
      wireDrag('lst-motstyret', function () { return data.motStyret.cards; }, renderMotstyret);
      wireDrag('lst-benefits', function () { return data.medlem.benefits; }, renderBenefits);
      wireDrag('lst-faq', function () { return data.faq.items; }, renderFaq);
      AC.viewSwitch({ list: q('lst-stats'), key: 'apeiron-omoss-stats-view-v1', help: 'Velg hvordan nøkkeltall-radene vises mens du redigerer her i admin. Påvirker bare redigeringsvisningen, ikke nettsiden.' });
      AC.viewSwitch({ list: q('lst-faq'), key: 'apeiron-omoss-faq-view-v1', help: 'Velg hvordan spørsmål & svar vises mens du redigerer her i admin. Påvirker bare redigeringsvisningen, ikke nettsiden.' });
      fitPreview(); setTimeout(fitPreview, 80);
      pushPreview(); setTimeout(pushPreview, 150);

      return {
        export: exportFile,
        destroy: function () { window.removeEventListener('message', onPreviewMsg); window.removeEventListener('resize', fitPreview); }
      };
    }
  });
})();
