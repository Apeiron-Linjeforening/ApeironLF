/* ============================================================
   admin-modules/ny-student.js: «Ny student?»-editor som C-modul.
   Redigerer content/ny-student-content.js (NYSTUDENT_CONTENT).
   Bygger på samme mønster som hjelp.js: preview-iframe, utkast i
   localStorage, kort-lister med drag-sortering, eksport og PanelShell.
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('ny-student', {
    title: 'Ny student',
    see: { href: 'ny-student.html', label: 'Se Ny student-siden ↗' },
    exportName: 'content/ny-student-content.js',

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live fra den ekte «Ny student?»-siden. Endringene dine vises umiddelbart.</p>'
          + '<div class="pv-page-wrap"><iframe id="pv-page" src="ny-student.html?preview=1" title="Forhåndsvisning av Ny student-siden"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du «Ny student?»-siden</strong>'
          + '<ol>'
            + '<li>Rediger innholdet nedenfor. Klikk på et felt for å redigere det</li>'
            + '<li>Legg til kort med <b>+ Nytt kort</b> / <b>+ Nytt steg</b> / <b>+ Nytt spørsmål</b></li>'
            + '<li>Trykk <b>☁ Publiser til GitHub</b> oppe til høyre</li>'
            + '<li>Cloudflare oppdaterer nettsiden automatisk innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren din.</div>'
        + '</div>'
        + '<div class="panel" data-sec-key="subhero"><div class="panel-title">Topp / hurtignav <small>øverst på siden</small></div>'
          + '<div class="meta-panel">'
            + '<div class="meta-grid"><div class="fg narrow"><label>Tilbake-tekst</label><input type="text" id="sh-back"></div>'
            + '<div class="fg narrow"><label>Tilbake-lenke</label><input type="text" id="sh-backHref"></div></div>'
            + '<div class="meta-grid" style="margin-top:10px"><div class="fg"><label>Overskrift</label><input type="text" id="sh-heading"></div></div>'
            + '<div class="meta-grid" style="margin-top:10px"><div class="fg"><label>Ingress</label><textarea id="sh-lede"></textarea></div></div>'
          + '</div>'
          + '<div class="sec"><div class="sec-head"><h2>Hurtignav-kort</h2><span class="count" id="count-nav"></span><button class="btn-add" type="button" data-add-nav>+ Nytt kort</button></div><div class="list" id="list-nav"></div></div>'
        + '</div>'
        + '<div class="panel" data-sec-key="praktisk"><div class="panel-title">Det praktiske <small>sjekkliste</small></div>'
          + metaGrid('pr')
          + '<div class="sec"><div class="sec-head"><h2>Steg</h2><span class="count" id="count-steps"></span><button class="btn-add" type="button" data-add-steps>+ Nytt steg</button></div><div class="list" id="list-steps"></div></div>'
        + '</div>'
        + '<div class="panel" data-sec-key="blikjent"><div class="panel-title">Bli kjent <small>mørkt bånd</small></div>'
          + metaGrid('bk')
          + '<div class="sec"><div class="sec-head"><h2>Velkomstkort</h2><span class="count" id="count-welcome"></span><button class="btn-add" type="button" data-add-welcome>+ Nytt kort</button></div><div class="list" id="list-welcome"></div></div>'
          + '<div class="meta-panel" style="margin-top:14px"><h3>«Lyst til å bidra?»-felt</h3>'
            + '<div class="meta-grid"><div class="fg narrow"><label>Ikon (emoji)</label><input type="text" id="eng-icon"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="eng-title"></div></div>'
            + '<div class="meta-grid" style="margin-top:10px"><div class="fg"><label>Tekst</label><textarea id="eng-body"></textarea></div></div>'
            + '<div class="meta-grid" style="margin-top:10px"><div class="fg narrow"><label>Knappetekst</label><input type="text" id="eng-ctaLabel"></div>'
            + '<div class="fg"><label>Knapp-lenke</label><input type="text" id="eng-ctaHref"></div></div>'
          + '</div>'
        + '</div>'
        + '<div class="panel" data-sec-key="dragvoll"><div class="panel-title">På Dragvoll <small>stedskort</small></div>'
          + metaGrid('dr')
          + '<div class="sec"><div class="sec-head"><h2>Stedskort</h2><span class="count" id="count-dragvoll"></span><button class="btn-add" type="button" data-add-dragvoll>+ Nytt kort</button></div><div class="list" id="list-dragvoll"></div></div>'
        + '</div>'
        + '<div class="panel" data-sec-key="faq"><div class="panel-title">Spørsmål <small>FAQ</small></div>'
          + '<div class="meta-panel"><div class="meta-grid"><div class="fg narrow"><label>Eyebrow</label><input type="text" id="fq-eyebrow"></div>'
          + '<div class="fg"><label>Overskrift</label><input type="text" id="fq-heading"></div></div></div>'
          + '<div class="sec"><div class="sec-head"><h2>Spørsmål</h2><span class="count" id="count-faq"></span><button class="btn-add" type="button" data-add-faq>+ Nytt spørsmål</button></div><div class="list" id="list-faq"></div></div>'
        + '</div>';

      function metaGrid(p) {
        return '<div class="meta-panel">'
          + '<div class="meta-grid"><div class="fg narrow"><label data-help="Liten etikett over overskriften.">Eyebrow</label><input type="text" id="' + p + '-eyebrow"></div>'
          + '<div class="fg"><label>Overskrift</label><input type="text" id="' + p + '-heading"></div></div>'
          + '<div class="meta-grid" style="margin-top:10px"><div class="fg"><label>Ingress</label><textarea id="' + p + '-lede"></textarea></div></div>'
          + '</div>';
      }

      var LS_KEY = 'apeiron-nystudent-v1';

      var data = {};
      function clone(x) { return JSON.parse(JSON.stringify(x == null ? null : x)); }
      function fresh() { return clone(window.NYSTUDENT_CONTENT || {}); }
      function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

      function normalize() {
        data.subhero = data.subhero || {}; data.subhero.nav = data.subhero.nav || [];
        data.praktisk = data.praktisk || {}; data.praktisk.steps = data.praktisk.steps || [];
        data.blikjent = data.blikjent || {}; data.blikjent.cards = data.blikjent.cards || [];
        data.blikjent.engasjer = data.blikjent.engasjer || { icon: '', title: '', body: '', ctaLabel: '', ctaHref: '' };
        data.dragvoll = data.dragvoll || {}; data.dragvoll.cards = data.dragvoll.cards || [];
        data.faq = data.faq || {}; data.faq.items = data.faq.items || [];
        // Rekkefølge på de flyttbare innholdsseksjonene (subhero ligger alltid fast øverst).
        var RK = ['praktisk', 'blikjent', 'dragvoll', 'faq'];
        var ord = (Array.isArray(data.sectionOrder) ? data.sectionOrder : []).filter(function (k) { return RK.indexOf(k) >= 0; });
        RK.forEach(function (k) { if (ord.indexOf(k) < 0) ord.push(k); });
        data.sectionOrder = ord;
      }
      function loadData() {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) { try { data = JSON.parse(raw); normalize(); return; } catch (_) {} }
        data = fresh(); normalize();
      }
      var saveTimer = null;
      function saveData() { AC.persistDraft(LS_KEY, data); AC.toast('Lagret i nettleseren'); pushPreview(); }
      function lazySave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveData, 350); }

      /* ── kort-byggere ── */
      function head(titleTxt) {
        return '<div class="card-head"><span class="drag-handle" title="Dra for å sortere">⠿</span>'
          + '<span class="card-title">' + esc(titleTxt) + '</span>'
          + '<div class="order-btns"><button class="btn-ord up" type="button" title="Opp">↑</button><button class="btn-ord dn" type="button" title="Ned">↓</button></div>'
          + '<button class="btn-del" type="button">Slett</button></div>';
      }
      function bindFields(card, item, titleField, fallback) {
        card.querySelectorAll('[data-f]').forEach(function (el) {
          var field = el.getAttribute('data-f');
          el.addEventListener('input', function () {
            item[field] = el.value;
            if (field === titleField) card.querySelector('.card-title').textContent = el.value || fallback;
            lazySave();
          });
        });
      }
      function navCard(n, arr) {
        var card = document.createElement('div'); card.className = 'card'; card.setAttribute('data-id', arr.indexOf(n));
        card.innerHTML = head(n.title || '(uten tittel)')
          + '<div class="fields"><div class="frow">'
          + '<div class="fg"><label>Tittel</label><input type="text" data-f="title" value="' + esc(n.title) + '"></div>'
          + '<div class="fg narrow"><label>Anker (#id)</label><input type="text" data-f="target" value="' + esc(n.target) + '" placeholder="#praktisk"></div></div>'
          + '<div class="fg"><label>Beskrivelse</label><input type="text" data-f="desc" value="' + esc(n.desc) + '"></div>'
          + '<div class="hint">Anker peker til en seksjon: #praktisk, #blikjent, #dragvoll, #sporsmal.</div></div>';
        bindFields(card, n, 'title', '(uten tittel)'); wireCardControls(card, arr, n); return card;
      }
      function stepCard(s, arr) {
        var card = document.createElement('div'); card.className = 'card'; card.setAttribute('data-id', arr.indexOf(s));
        card.innerHTML = head(s.title || '(uten tittel)')
          + '<div class="fields"><div class="fg"><label>Tittel</label><input type="text" data-f="title" value="' + esc(s.title) + '"></div>'
          + '<div class="fg"><label>Tekst</label><textarea data-f="body">' + esc(s.body) + '</textarea></div></div>';
        bindFields(card, s, 'title', '(uten tittel)'); wireCardControls(card, arr, s); return card;
      }
      function iconCard(c, arr) {
        var card = document.createElement('div'); card.className = 'card'; card.setAttribute('data-id', arr.indexOf(c));
        card.innerHTML = head(c.title || '(uten tittel)')
          + '<div class="fields"><div class="frow">'
          + '<div class="fg narrow"><label>Ikon (emoji)</label><input type="text" data-f="icon" value="' + esc(c.icon) + '" placeholder="📖"></div>'
          + '<div class="fg"><label>Tittel</label><input type="text" data-f="title" value="' + esc(c.title) + '"></div></div>'
          + '<div class="fg"><label>Tekst</label><textarea data-f="body">' + esc(c.body) + '</textarea></div>'
          + (('linkLabel' in c) ? ('<div class="frow"><div class="fg narrow"><label>Lenketekst</label><input type="text" data-f="linkLabel" value="' + esc(c.linkLabel) + '" placeholder="tom = ingen lenke"></div>'
              + '<div class="fg"><label>Lenke</label><input type="text" data-f="linkHref" value="' + esc(c.linkHref) + '" placeholder="index.html#..."></div></div>') : '')
          + '</div>';
        bindFields(card, c, 'title', '(uten tittel)'); wireCardControls(card, arr, c); return card;
      }
      function faqCard(f, arr) {
        var card = document.createElement('div'); card.className = 'card'; card.setAttribute('data-id', arr.indexOf(f));
        card.innerHTML = head(f.q || '(uten spørsmål)')
          + '<div class="fields"><div class="fg"><label>Spørsmål</label><input type="text" data-f="q" value="' + esc(f.q) + '"></div>'
          + '<div class="fg"><label>Svar</label><textarea data-f="a">' + esc(f.a) + '</textarea></div></div>';
        bindFields(card, f, 'q', '(uten spørsmål)'); wireCardControls(card, arr, f); return card;
      }
      function wireCardControls(card, arr, item) {
        card.querySelector('.up').addEventListener('click', function () { var i = arr.indexOf(item); if (i > 0) { var t = arr[i]; arr[i] = arr[i - 1]; arr[i - 1] = t; renderAll(); lazySave(); } });
        card.querySelector('.dn').addEventListener('click', function () { var i = arr.indexOf(item); if (i > -1 && i < arr.length - 1) { var t = arr[i]; arr[i] = arr[i + 1]; arr[i + 1] = t; renderAll(); lazySave(); } });
        card.querySelector('.btn-del').addEventListener('click', function () { var nm = item.title || item.q || 'kort'; var i = arr.indexOf(item); if (i > -1) AC.undoDelete(arr, i, '«' + nm + '» slettet', function () { renderAll(); }, lazySave); });
      }

      /* ── meta-felt ── */
      function setVal(id, val) { var el = host.querySelector('#' + id); if (el) el.value = val == null ? '' : val; }
      function fillList(id, arr, maker) { var el = host.querySelector('#' + id); if (!el) return; el.innerHTML = ''; arr.forEach(function (item) { el.appendChild(maker(item, arr)); }); }

      function renderMetaInputs() {
        var s = data.subhero;
        setVal('sh-back', s.back); setVal('sh-backHref', s.backHref); setVal('sh-heading', s.heading); setVal('sh-lede', s.lede);
        setVal('pr-eyebrow', data.praktisk.eyebrow); setVal('pr-heading', data.praktisk.heading); setVal('pr-lede', data.praktisk.lede);
        setVal('bk-eyebrow', data.blikjent.eyebrow); setVal('bk-heading', data.blikjent.heading); setVal('bk-lede', data.blikjent.lede);
        var e = data.blikjent.engasjer;
        setVal('eng-icon', e.icon); setVal('eng-title', e.title); setVal('eng-body', e.body); setVal('eng-ctaLabel', e.ctaLabel); setVal('eng-ctaHref', e.ctaHref);
        setVal('dr-eyebrow', data.dragvoll.eyebrow); setVal('dr-heading', data.dragvoll.heading); setVal('dr-lede', data.dragvoll.lede);
        setVal('fq-eyebrow', data.faq.eyebrow); setVal('fq-heading', data.faq.heading);
      }
      function updateCounts() {
        function n(id, len, word) { var el = host.querySelector('#' + id); if (el) el.textContent = len + ' ' + word; }
        n('count-nav', data.subhero.nav.length, 'kort'); n('count-steps', data.praktisk.steps.length, 'steg');
        n('count-welcome', data.blikjent.cards.length, 'kort'); n('count-dragvoll', data.dragvoll.cards.length, 'kort');
        n('count-faq', data.faq.items.length, 'spørsmål');
      }
      function renderAll() {
        renderMetaInputs();
        fillList('list-nav', data.subhero.nav, navCard);
        fillList('list-steps', data.praktisk.steps, stepCard);
        fillList('list-welcome', data.blikjent.cards, iconCard);
        fillList('list-dragvoll', data.dragvoll.cards, iconCard);
        fillList('list-faq', data.faq.items, faqCard);
        updateCounts();
        if (AC.enhanceHelp) AC.enhanceHelp(host);
      }
      function wire(id, setter) { var el = host.querySelector('#' + id); if (el) el.addEventListener('input', function () { setter(this.value); lazySave(); }); }
      function wireMeta() {
        wire('sh-back', function (v) { data.subhero.back = v; }); wire('sh-backHref', function (v) { data.subhero.backHref = v; });
        wire('sh-heading', function (v) { data.subhero.heading = v; }); wire('sh-lede', function (v) { data.subhero.lede = v; });
        ['pr:praktisk', 'bk:blikjent', 'dr:dragvoll'].forEach(function (pair) {
          var p = pair.split(':')[0], k = pair.split(':')[1];
          wire(p + '-eyebrow', function (v) { data[k].eyebrow = v; }); wire(p + '-heading', function (v) { data[k].heading = v; }); wire(p + '-lede', function (v) { data[k].lede = v; });
        });
        wire('fq-eyebrow', function (v) { data.faq.eyebrow = v; }); wire('fq-heading', function (v) { data.faq.heading = v; });
        ['icon', 'title', 'body', 'ctaLabel', 'ctaHref'].forEach(function (f) { wire('eng-' + f, function (v) { data.blikjent.engasjer[f] = v; }); });
      }

      function scrollLast(listId) { setTimeout(function () { var last = host.querySelector('#' + listId + ' .card:last-child'); if (last) last.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60); }
      host.querySelector('[data-add-nav]').addEventListener('click', function () { data.subhero.nav.push({ title: '', desc: '', target: '#' }); renderAll(); lazySave(); scrollLast('list-nav'); });
      host.querySelector('[data-add-steps]').addEventListener('click', function () { data.praktisk.steps.push({ title: '', body: '' }); renderAll(); lazySave(); scrollLast('list-steps'); });
      host.querySelector('[data-add-welcome]').addEventListener('click', function () { data.blikjent.cards.push({ icon: '', title: '', body: '', linkLabel: '', linkHref: '' }); renderAll(); lazySave(); scrollLast('list-welcome'); });
      host.querySelector('[data-add-dragvoll]').addEventListener('click', function () { data.dragvoll.cards.push({ icon: '', title: '', body: '' }); renderAll(); lazySave(); scrollLast('list-dragvoll'); });
      host.querySelector('[data-add-faq]').addEventListener('click', function () { data.faq.items.push({ q: '', a: '' }); renderAll(); lazySave(); scrollLast('list-faq'); });

      function exportFile() {
        var header =
          '/* Innhold for «Ny student?»-siden (ny-student.html).\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Rediger direkte her, eller åpne Admin-senteret -> Ny student. */\n\n';
        var content = header + 'window.NYSTUDENT_CONTENT = ' + JSON.stringify(data, null, 2) + ';\n';
        AC.saveFile('content/ny-student-content.js', content);
        AC.toast('Fil lastet ned. Erstatt i GitHub og push!');
      }

      host.querySelector('#reset-btn').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); data = fresh(); normalize(); renderAll(); AC.toast('Tilbakestilt til publisert versjon'); pushPreview();
      });

      [
        ['list-nav',      function () { return data.subhero.nav; },   function (v) { data.subhero.nav = v; }],
        ['list-steps',    function () { return data.praktisk.steps; },function (v) { data.praktisk.steps = v; }],
        ['list-welcome',  function () { return data.blikjent.cards; },function (v) { data.blikjent.cards = v; }],
        ['list-dragvoll', function () { return data.dragvoll.cards; },function (v) { data.dragvoll.cards = v; }],
        ['list-faq',      function () { return data.faq.items; },     function (v) { data.faq.items = v; }]
      ].forEach(function (cfg) {
        AC.enableDragSort(host.querySelector('#' + cfg[0]), {
          itemSelector: '.card', handleSelector: '.drag-handle', handleOnly: true,
          onReorder: function (ids) { var snap = cfg[1]().slice(); cfg[2](ids.map(function (o) { return snap[Number(o)]; })); renderAll(); lazySave(); }
        });
      });

      /* ─── live forhåndsvisning (ny-student.html?preview=1) ─── */
      var pvFrame = host.querySelector('#pv-page');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-nystudent-preview', content: data }, '*'); } catch (e) {} }
      function onPreviewMsg(e) { if (e.origin !== window.location.origin) return; if (e.data && e.data.type === 'apeiron-nystudent-preview-ready') { pushPreview(); fitPreview(); } }
      function fitPreview() {
        var wrap = host.querySelector('.pv-page-wrap');
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

      loadData(); AC.draftBaseline(LS_KEY, data); wireMeta(); renderAll();
      ['list-nav', 'list-steps', 'list-welcome', 'list-dragvoll', 'list-faq'].forEach(function (lid) {
        var el = host.querySelector('#' + lid);
        if (el && AC.viewSwitch) AC.viewSwitch({ list: el, key: 'apeiron-nystudent-view-' + lid + '-v1', help: 'Velg hvordan kortene vises mens du redigerer. Påvirker bare admin, ikke den publiserte siden.' });
      });
      fitPreview(); setTimeout(fitPreview, 80);
      pushPreview(); setTimeout(pushPreview, 150);

      /* ── delt «Liste + detalj»-skall (faste seksjoner, ingen rekkefølge) ── */
      function shellSections() {
        return ['subhero'].concat(data.sectionOrder).map(function (key) {
          var node = host.querySelector('.panel[data-sec-key="' + key + '"]');
          if (!node) return null;
          var title = node.querySelector('.panel-title');
          var label = '', sub = '';
          if (title) { var sm = title.querySelector('small'); sub = sm ? sm.textContent.trim() : ''; label = (title.textContent || '').replace(sub, '').trim(); }
          return { id: key, label: label, sub: sub, node: node, av: '✎', fixed: key === 'subhero' };
        }).filter(Boolean);
      }
      var shell = AC.PanelShell.mount(host, AC, {
        rail: 'sections', title: 'Ny student', subtitle: 'Seksjoner', remember: 'apeiron-nystudent-shell-sel',
        page: { href: 'ny-student.html', id: 'ny-student', label: 'Ny student', ico: '🎓' },
        sections: shellSections,
        onSectionReorder: function (keys) {
          // Subhero (topp/hurtignav) er låst øverst.
          keys = (keys || []).filter(function (k) { return k !== 'subhero'; });
          data.sectionOrder = keys; lazySave();
        }
      });
      function applyPanelLayout() { if (shell) shell.layoutChanged(); }
      window.addEventListener('apeiron-panellayout', applyPanelLayout);
      applyPanelLayout();

      return {
        export: exportFile,
        destroy: function () {
          window.removeEventListener('message', onPreviewMsg);
          window.removeEventListener('resize', fitPreview);
          window.removeEventListener('apeiron-panellayout', applyPanelLayout);
          if (shell) shell.destroy();
        }
      };
    }
  });
})();
