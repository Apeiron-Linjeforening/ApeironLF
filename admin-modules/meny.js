/* ============================================================
   admin-modules/meny.js — Meny-editor som C-modul
   Erstatter meny-admin.html. Krever nav-content.js (SITE_NAV) + footer-icons.js,
   som skallet (admin.html) laster. Dobbel live-preview (desktop + mobil) via
   srcdoc som laster den ekte site-chrome.js. Angre/gjør-om + stedvelger.
   Rydder opp globale lyttere + body-popover på destroy.
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('meny', {
    title: 'Meny',
    see: { href: 'index.html', label: 'Se nettsiden ↗' },
    exportName: 'nav-content.js',

    mount: function (host, AC) {
      host.innerHTML =
        '<div class="desk-preview-bar">'
          + '<div class="dpb-cap">Desktop — menylinje <span class="dpb-hint">Vist i din skjermbredde — slik menylinja faktisk ser ut. <b>Får punktene ikke plass, bytter linja automatisk til hamburgermeny.</b> Undermenyene ser du utvidet i mobil-forhåndsvisningen til høyre.</span></div>'
          + '<div class="np-desk-wrap"><iframe id="pv-desk" title="Desktop-forhåndsvisning" scrolling="no"></iframe></div>'
        + '</div>'
        + '<div class="editor-grid"><div class="editor">'
          + '<div class="hist-bar"><button class="btn-hist" id="undo-btn" type="button" title="Angre (Ctrl/Cmd+Z)" disabled>↶ Angre</button><button class="btn-hist" id="redo-btn" type="button" title="Gjør om (Ctrl/Cmd+Shift+Z)" disabled>↷ Gjør om</button></div>'
          + '<div class="tip">'
            + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
            + '<strong>Slik oppdaterer du menyen</strong>'
            + '<ol>'
              + '<li>Rediger punktene nedenfor — forhåndsvisningen oppdateres med nettstedets <b>ekte</b> meny-utseende</li>'
              + '<li>Legg til underpunkter for å lage en nedtrekksmeny, dra i <b>⠿</b> for å sortere</li>'
              + '<li>Velg <b>synlighet</b> per punkt: begge, kun mobil eller kun desktop</li>'
              + '<li>Trykk <b>☁ Publiser til GitHub</b> oppe til høyre — endringene legges ut automatisk</li>'
            + '</ol>'
            + '<div class="tip-note">💡 Klikk <b>📍</b> ved et adressefelt for å velge side og seksjon fra en liste med lesbare navn. (Du kan fortsatt skrive adressen for hånd.) Angre/gjør-om med knappene over eller Ctrl/Cmd+Z.</div>'
          + '</div>'
          + '<div class="align-sec">'
            + '<h2>Plassering på menylinja</h2>'
            + '<p class="sec-desc">Hvor punktene ligger på desktop-linja. Velg en forhåndsinnstilling, eller dra for å finjustere — den hekter seg på faste hakk (hvert 5. trinn). Logo til venstre og søk/modus til høyre står alltid fast.</p>'
            + '<div class="align-presets"><button type="button" data-align="0">⟵&nbsp; Venstrelent</button><button type="button" data-align="50">⟷&nbsp; Sentrert</button><button type="button" data-align="100">Høyrelent &nbsp;⟶</button></div>'
            + '<div class="align-track"><input type="range" id="align-range" min="0" max="100" step="5" value="0" aria-label="Plassering på menylinja"><div class="align-scale"><span>Ved logoen</span><span>Midten</span><span>Ved søk</span></div></div>'
          + '</div>'
          + '<div class="sec">'
            + '<div class="sec-head"><h2>Menypunkter</h2><span class="count" id="count-items"></span><button class="btn-add" type="button" id="add-item">+ Nytt menypunkt</button></div>'
            + '<p class="sec-desc">Toppnivå-punkter i rekkefølge (venstre→høyre på desktop, topp→bunn på mobil). Et punkt med underpunkter blir en nedtrekksmeny på desktop og en sammenleggbar seksjon på mobil. Dra i ⠿ for å sortere.</p>'
            + '<div class="list" id="list-items"></div>'
          + '</div>'
        + '</div>'
        + '<aside class="preview-pane"><h3>Mobil</h3><p class="pp-sub">Hamburgermenyen — skuffen vises åpen med alle seksjoner utvidet.</p><div class="np-mob-wrap"><iframe id="pv-mob" title="Mobil-forhåndsvisning" scrolling="no"></iframe></div></aside>'
        + '</div>';

      var q = function (id) { return host.querySelector('#' + id); };
      var LS_KEY = 'apeiron-nav-v1';
      var LS_ALIGN = 'apeiron-nav-align-v1';
      var navAlign = 0;
      var data = null;
      var uidc = 0;
      function uid() { return 'n' + (Date.now().toString(36)) + (uidc++).toString(36); }
      var esc = AC.esc;

      function modeOf(it) { if (it.drawerOnly) return 'drawer'; if (it.desktopOnly) return 'desktop'; return 'both'; }
      function mapItem(it) {
        return { _id: uid(), label: it.label || '', href: it.href || '', mode: modeOf(it),
          children: (it.children || []).map(function (c) { return { _id: uid(), label: c.label || '', href: c.href || '' }; }) };
      }
      function fresh() { var nav = (window.SITE_NAV && window.SITE_NAV.length) ? window.SITE_NAV : []; return nav.map(mapItem); }

      function snapAlign(v) { v = Math.round(Number(v) / 5) * 5; if (isNaN(v)) v = 0; return Math.max(0, Math.min(100, v)); }
      function defaultAlign() { var c = window.SITE_NAV_CONFIG || {}; var a = c.align; if (a === 'left') a = 0; else if (a === 'center') a = 50; else if (a === 'right') a = 100; return snapAlign(a); }
      function loadAlign() { var raw = localStorage.getItem(LS_ALIGN); if (raw != null && raw !== '') navAlign = snapAlign(raw); else navAlign = defaultAlign(); }
      function applyAlignUI() {
        var range = q('align-range'); if (range) range.value = navAlign;
        host.querySelectorAll('.align-presets button').forEach(function (b) { b.classList.toggle('active', Number(b.getAttribute('data-align')) === navAlign); });
      }
      function setAlign(v, persist) {
        navAlign = snapAlign(v); applyAlignUI(); renderPreview();
        if (persist) { localStorage.setItem(LS_ALIGN, String(navAlign)); AC.toast('Lagret i nettleseren'); lazyHistory(); }
      }
      function loadData() {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) {
          try {
            var d = JSON.parse(raw);
            if (Array.isArray(d)) {
              data = d.map(function (it) {
                return { _id: it._id || uid(), label: it.label || '', href: it.href || '',
                  mode: (it.mode === 'drawer' || it.mode === 'desktop') ? it.mode : 'both',
                  children: (it.children || []).map(function (c) { return { _id: c._id || uid(), label: c.label || '', href: c.href || '' }; }) };
              });
              return;
            }
          } catch (_) {}
        }
        data = fresh();
      }
      function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(data)); AC.toast('Lagret i nettleseren'); }
      var saveTimer = null;
      function lazySave() { clearTimeout(saveTimer); saveTimer = setTimeout(function () { saveData(); renderPreview(); pushHistory(); }, 350); }

      /* historikk */
      var histStack = [], histIndex = -1, histTimer = null;
      function stateSnap() { return JSON.stringify({ items: data, align: navAlign }); }
      function pushHistory() {
        var snap = stateSnap();
        if (histStack[histIndex] === snap) return;
        histStack = histStack.slice(0, histIndex + 1);
        histStack.push(snap);
        if (histStack.length > 100) histStack.shift();
        histIndex = histStack.length - 1;
        updateHistButtons();
      }
      function lazyHistory() { clearTimeout(histTimer); histTimer = setTimeout(pushHistory, 400); }
      function restoreSnap(snap) {
        var s = JSON.parse(snap);
        data = (s.items || []).map(function (it) {
          return { _id: it._id || uid(), label: it.label || '', href: it.href || '',
            mode: (it.mode === 'drawer' || it.mode === 'desktop') ? it.mode : 'both',
            children: (it.children || []).map(function (c) { return { _id: c._id || uid(), label: c.label || '', href: c.href || '' }; }) };
        });
        navAlign = snapAlign(s.align);
        renderItems(); applyAlignUI(); renderPreview();
        localStorage.setItem(LS_KEY, JSON.stringify(data));
        localStorage.setItem(LS_ALIGN, String(navAlign));
      }
      function undo() { if (histIndex <= 0) return; histIndex--; restoreSnap(histStack[histIndex]); updateHistButtons(); AC.toast('Angret'); }
      function redo() { if (histIndex >= histStack.length - 1) return; histIndex++; restoreSnap(histStack[histIndex]); updateHistButtons(); AC.toast('Gjorde om'); }
      function updateHistButtons() { var u = q('undo-btn'), r = q('redo-btn'); if (u) u.disabled = histIndex <= 0; if (r) r.disabled = histIndex >= histStack.length - 1; }

      var HREF_HELP = 'Hvor lenken går:\n• En side i repoet: «pensum.html»\n• En seksjon på forsiden: «index.html#kontakt»\n• En seksjon på en annen side: «styret.html#sak»\n• En ekstern adresse: «https://...».\nTips: skriv hele «side.html#anker» — menyen forkorter det automatisk på riktig side.';
      var MODE_HELP = 'Hvor punktet vises:\n• Begge — både desktop-menyen og mobilmenyen (standard)\n• Kun mobil — vises bare i hamburgermenyen (drawerOnly)\n• Kun desktop — vises bare i menylinja på store skjermer (desktopOnly)';
      var PARENT_HELP = 'Landingslenken for selve punktet. På desktop er dette der man havner om man klikker på toppnivå-teksten; underpunktene vises i nedtrekksmenyen. Ofte er første underpunkt den samme lenken.';

      function kidCard(it, c) {
        var card = document.createElement('div');
        card.className = 'kid-card'; card.setAttribute('data-id', c._id);
        card.innerHTML =
          '<span class="drag-handle kid-handle" title="Dra for å sortere">⠿</span>'
          + '<div class="fg"><label data-help="Teksten som vises i nedtrekksmenyen / seksjonen.">Tekst</label><input type="text" data-f="label" placeholder="f.eks. Pensum"></div>'
          + '<div class="fg"><label data-help="' + esc(HREF_HELP) + '">Adresse</label><div class="addr-wrap"><input type="text" data-f="href" placeholder="pensum.html"><button class="btn-loc" type="button" title="Velg side og seksjon">📍</button></div></div>'
          + '<button class="btn-del-row" type="button" title="Fjern underpunkt">✕</button>';
        card.querySelector('[data-f="label"]').value = c.label;
        card.querySelector('[data-f="href"]').value = c.href;
        card.querySelectorAll('[data-f]').forEach(function (el) { el.addEventListener('input', function () { c[el.getAttribute('data-f')] = el.value; lazySave(); }); });
        card.querySelector('.btn-del-row').addEventListener('click', function () { it.children = it.children.filter(function (x) { return x !== c; }); renderItems(); lazySave(); });
        wireLoc(card);
        AC.enhanceHelp(card);
        return card;
      }

      function itemCard(it) {
        var card = document.createElement('div');
        card.className = 'item-card'; card.setAttribute('data-id', it._id);
        var hasKids = it.children && it.children.length;
        card.innerHTML =
          '<div class="item-row">'
            + '<span class="drag-handle item-handle" title="Dra for å sortere">⠿</span>'
            + '<div class="fg"><label data-help="Teksten som vises i menyen.">Tekst</label><input type="text" data-f="label" placeholder="f.eks. Om oss"></div>'
            + '<div class="fg"><label data-help="' + esc(hasKids ? PARENT_HELP : HREF_HELP) + '">Adresse</label><div class="addr-wrap"><input type="text" data-f="href" placeholder="index.html#om"><button class="btn-loc" type="button" title="Velg side og seksjon">📍</button></div></div>'
            + '<div class="fg narrow"><label data-help="' + esc(MODE_HELP) + '">Synlighet</label><select data-f="mode"><option value="both">Begge</option><option value="drawer">Kun mobil</option><option value="desktop">Kun desktop</option></select></div>'
            + '<button class="btn-del-row" type="button" title="Fjern menypunkt">✕</button>'
          + '</div>'
          + '<div class="kids"><div class="kids-head"><span class="ttl">Undermeny (nedtrekk)</span><button class="btn-add-kid" type="button">+ Underpunkt</button></div><div class="kids-list"></div></div>';
        card.querySelector('[data-f="label"]').value = it.label;
        card.querySelector('[data-f="href"]').value = it.href;
        card.querySelector('[data-f="mode"]').value = it.mode;
        card.querySelectorAll('.item-row [data-f]').forEach(function (el) {
          var evt = el.tagName === 'SELECT' ? 'change' : 'input';
          el.addEventListener(evt, function () { it[el.getAttribute('data-f')] = el.value; lazySave(); });
        });
        card.querySelector('.item-row .btn-del-row').addEventListener('click', function () { data = data.filter(function (x) { return x !== it; }); renderItems(); lazySave(); });
        var kidsList = card.querySelector('.kids-list');
        if (hasKids) { it.children.forEach(function (c) { kidsList.appendChild(kidCard(it, c)); }); }
        else { kidsList.innerHTML = '<div class="kids-empty">Ingen underpunkter — punktet blir en enkel lenke.</div>'; }
        card.querySelector('.btn-add-kid').addEventListener('click', function () { it.children.push({ _id: uid(), label: '', href: '' }); renderItems(); lazySave(); });
        AC.enableDragSort(kidsList, {
          itemSelector: '.kid-card', handleSelector: '.kid-handle',
          onReorder: function (ids) { it.children.sort(function (a, b) { return ids.indexOf(a._id) - ids.indexOf(b._id); }); lazySave(); }
        });
        wireLoc(card.querySelector('.item-row'));
        AC.enhanceHelp(card);
        return card;
      }

      function renderItems() {
        var el = q('list-items'); el.innerHTML = '';
        data.forEach(function (it) { el.appendChild(itemCard(it)); });
        q('count-items').textContent = data.length + ' punkter';
      }

      function cleanNav() {
        return data.filter(function (it) { return (it.label || '').trim() || (it.href || '').trim(); })
          .map(function (it) {
            var o = { label: it.label, href: it.href };
            var kids = (it.children || []).filter(function (c) { return (c.label || '').trim() || (c.href || '').trim(); });
            if (kids.length) o.children = kids.map(function (c) { return { label: c.label, href: c.href }; });
            if (it.mode === 'drawer') o.drawerOnly = true;
            if (it.mode === 'desktop') o.desktopOnly = true;
            return o;
          });
      }

      function frameDoc(navJson, openDrawer) {
        var extra = openDrawer
          ? '<scr' + 'ipt>setTimeout(function(){var d=document.getElementById("drawer");if(d){d.style.transition="none";d.classList.add("is-open");d.querySelectorAll(".drawer__sec").forEach(function(s){s.classList.add("is-open");});}},70);</scr' + 'ipt>'
          : '';
        var bg = openDrawer ? '#232740' : 'transparent';
        var navBg = openDrawer ? '' : '.nav{background:#232740 !important;}';
        return '<!DOCTYPE html><html lang="no"><head><meta charset="utf-8">'
          + '<link rel="preconnect" href="https://fonts.googleapis.com">'
          + '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
          + '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Spectral:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">'
          + '<link rel="stylesheet" href="styles.css">'
          + '<style>html,body{margin:0;background:' + bg + ';min-height:100%;}.nav{position:static !important;}' + navBg + 'body::before{display:none !important;}</style>'
          + '</head><body data-mode="paper"><div id="site-nav"></div>'
          + '<scr' + 'ipt>window.SITE_NAV=' + navJson + ';window.SITE_NAV_CONFIG={align:' + Number(navAlign) + '};window.SITE_FOOTER={};</scr' + 'ipt>'
          + '<scr' + 'ipt src="footer-icons.js"></scr' + 'ipt>'
          + '<scr' + 'ipt src="site-chrome.js"></scr' + 'ipt>'
          + extra + '</body></html>';
      }
      function renderPreview() {
        var navJson = JSON.stringify(cleanNav());
        var desk = q('pv-desk'), mob = q('pv-mob');
        if (desk) { desk.onload = fitDesk; desk.srcdoc = frameDoc(navJson, false); }
        if (mob) mob.srcdoc = frameDoc(navJson, true);
      }
      function fitDesk() {
        var f = q('pv-desk'); if (!f) return;
        var wrap = f.parentElement;
        var W = wrap.clientWidth;
        var contentW = Math.max(W, 1180);
        var scale = W / contentW;
        f.style.width = contentW + 'px';
        f.style.transformOrigin = 'top left';
        f.style.transform = scale < 1 ? 'scale(' + scale + ')' : 'none';
        var h = 80;
        try { var n = f.contentDocument && f.contentDocument.querySelector('.nav'); if (n) h = n.offsetHeight; } catch (e) {}
        h = Math.max(56, h);
        f.style.setProperty('--nav-h', h + 'px');
        f.style.setProperty('--nav-h-open', (h + 260) + 'px');
        wrap.style.height = Math.round(h * Math.min(1, scale)) + 2 + 'px';
        measureLayout();
      }
      function measureLayout() {
        var bar = host.querySelector('.desk-preview-bar');
        var barH = bar ? bar.offsetHeight : 120;
        host.style.setProperty('--pp-top', (barH + 14) + 'px');
      }
      function winResize() { fitDesk(); }
      window.addEventListener('resize', winResize);

      function exportFile() {
        var out = cleanNav();
        var content =
          '/* ============================================================\n'
          + '   nav-content.js — redigerbar meny for hele nettstedet\n'
          + '   Leses av site-chrome.js, som bygger BÅDE header-menyen og\n'
          + '   mobilmenyen (skuffen) fra denne ene lista — på alle sider.\n'
          + '   Rediger via Admin-senteret → Meny (eller for hånd her).\n'
          + '\n'
          + '   Datamodell: window.SITE_NAV = liste med toppnivå-punkter.\n'
          + '   Hvert punkt: { label, href, children?[{label,href}],\n'
          + '   drawerOnly?  (kun mobil),  desktopOnly? (kun desktop) }.\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   ============================================================ */\n'
          + 'window.SITE_NAV = ' + JSON.stringify(out, null, 2) + ';\n'
          + 'window.SITE_NAV_CONFIG = { align: ' + Number(navAlign) + ' };\n';
        AC.saveFile('nav-content.js', content);
        AC.toast('Fil lastet ned — erstatt i GitHub og push!');
      }

      q('reset-btn').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); localStorage.removeItem(LS_ALIGN);
        data = fresh(); navAlign = defaultAlign();
        renderItems(); applyAlignUI(); renderPreview(); pushHistory(); AC.toast('Tilbakestilt til publisert versjon');
      });

      var rangeEl = q('align-range');
      if (rangeEl) rangeEl.addEventListener('input', function () { setAlign(rangeEl.value, true); });
      host.querySelectorAll('.align-presets button').forEach(function (b) { b.addEventListener('click', function () { setAlign(b.getAttribute('data-align'), true); }); });

      q('add-item').addEventListener('click', function () { data.push({ _id: uid(), label: '', href: '', mode: 'both', children: [] }); renderItems(); lazySave(); });
      q('undo-btn').addEventListener('click', undo);
      q('redo-btn').addEventListener('click', redo);
      function onKeydown(e) {
        var mod = e.metaKey || e.ctrlKey;
        if (!mod || e.key.toLowerCase() !== 'z') return;
        var t = e.target, tag = t && t.tagName;
        if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
      }
      document.addEventListener('keydown', onKeydown);

      AC.enableDragSort(q('list-items'), {
        itemSelector: '.item-card', handleSelector: '.item-handle',
        onReorder: function (ids) {
          var order = ids.filter(function (id) { return data.some(function (it) { return it._id === id; }); });
          data.sort(function (a, b) { return order.indexOf(a._id) - order.indexOf(b._id); });
          lazySave();
        }
      });

      /* ── stedvelger (popover på document.body) ── */
      var PAGE_SECTIONS = [
        { file: 'index.html', name: 'Forsiden', sections: [ { anchor: 'arrangementer', name: 'Arrangementer' }, { anchor: 'oppslagstavla-teaser', name: 'Oppslagstavla' }, { anchor: 'aporetisk', name: 'Aporetisk Aften' }, { anchor: 'fadderuke', name: 'Fadderuke' }, { anchor: 'bli-medlem', name: 'Bli medlem' }, { anchor: 'kontakt', name: 'Kontakt' } ] },
        { file: 'om-oss.html', name: 'Om oss', sections: [ { anchor: 'om', name: 'Om oss' }, { anchor: 'samarbeid', name: 'Fellesskap & samarbeid' }, { anchor: 'lesesalen', name: 'Lesesalen' }, { anchor: 'mot-styret', name: 'Møt styret' }, { anchor: 'bli-medlem', name: 'Bli medlem' }, { anchor: 'faq', name: 'Ofte stilte spørsmål' } ] },
        { file: 'styret.html', name: 'Styret', sections: [ { anchor: 'styremedlemmer', name: 'Styremedlemmer' }, { anchor: 'tillitsvalgte', name: 'Tillitsvalgte' }, { anchor: 'sak', name: 'S.A.K' }, { anchor: 'vervene', name: 'Om vervene' } ] },
        { file: 'begrep.html', name: 'Begrep', sections: [ { anchor: 'om', name: 'Om Begrep' }, { anchor: 'utgavene', name: 'Tidsskriftet' }, { anchor: 'podkast', name: 'Podkasten' }, { anchor: 'film', name: 'Filmproduksjon' }, { anchor: 'julekalender', name: 'Hilbert Hotell (julekalender)' }, { anchor: 'kontakt', name: 'Bidra & kontakt' } ] },
        { file: 'hjelp.html', name: 'Hjelp & støtte', sections: [ { anchor: 'sifra', name: 'Si fra' }, { anchor: 'studier', name: 'Faglig hjelp' }, { anchor: 'helse', name: 'Psykisk helse' }, { anchor: 'fysisk', name: 'Fysisk helse' }, { anchor: 'akutt', name: 'Akutt hjelp' } ] },
        { file: 'galleri.html', name: 'Galleri', sections: [ { anchor: 'galleri', name: 'Bildegalleri' } ] },
        { file: 'pensum.html', name: 'Pensum', sections: [] },
        { file: 'merch.html', name: 'Merch', sections: [ { anchor: 'butikk', name: 'Produkter' } ] },
        { file: 'marked.html', name: 'Kjøp & bytte', sections: [] }
      ];
      function enrichLive() {
        PAGE_SECTIONS.forEach(function (p) {
          fetch(p.file).then(function (r) { return r.ok ? r.text() : Promise.reject(); }).then(function (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            doc.querySelectorAll('section[id]').forEach(function (sec) {
              var id = sec.id;
              if (!id || id === 'top') return;
              if (p.sections.some(function (s) { return s.anchor === id; })) return;
              var h = sec.querySelector('h1, h2, h3');
              var nm = h ? h.textContent.replace(/\s+/g, ' ').trim() : '';
              if (nm.length > 42) nm = nm.slice(0, 40) + '…';
              if (!nm) nm = '#' + id;
              p.sections.push({ anchor: id, name: nm });
            });
            if (pop && pop.style.display !== 'none') renderLocList(pop._q || '');
          }).catch(function () {});
        });
      }

      var pop = null;
      function locDocClick(e) { if (!pop || pop.style.display === 'none') return; if (pop.contains(e.target) || (e.target.closest && e.target.closest('.btn-loc'))) return; closePop(); }
      function locWinResize() { if (pop && pop.style.display !== 'none') positionPop(pop._target); }
      function buildPicker() {
        if (pop) return;
        pop = document.createElement('div');
        pop.className = 'locpop';
        pop.innerHTML =
          '<div class="locpop__head"><span class="ttl">Velg side eller seksjon</span></div>'
          + '<div class="locpop__search"><input type="text" placeholder="Søk side eller seksjon…" aria-label="Søk"></div>'
          + '<div class="locpop__list"></div>';
        document.body.appendChild(pop);
        var search = pop.querySelector('.locpop__search input');
        search.addEventListener('input', function () { pop._q = search.value; renderLocList(search.value); positionPop(pop._target); });
        search.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') { closePop(); return; }
          if (e.key === 'Enter') { e.preventDefault(); var first = pop.querySelector('.locpop__list [data-href]'); if (first) chooseLoc(first.getAttribute('data-href')); }
        });
        document.addEventListener('click', locDocClick);
        window.addEventListener('resize', locWinResize);
      }
      function renderLocList(query) {
        var list = pop.querySelector('.locpop__list');
        var cur = pop._target ? pop._target.value.trim() : '';
        query = (query || '').toLowerCase().trim();
        var html = '', any = false;
        PAGE_SECTIONS.forEach(function (p) {
          var pageMatch = p.name.toLowerCase().indexOf(query) >= 0 || p.file.toLowerCase().indexOf(query) >= 0;
          var secs = p.sections.filter(function (s) { return pageMatch || s.name.toLowerCase().indexOf(query) >= 0 || ('#' + s.anchor).indexOf(query) >= 0; });
          if (!pageMatch && !secs.length) return;
          any = true;
          html += '<div class="locpop__pg"><button type="button" data-href="' + esc(p.file) + '">' + esc(p.name) + '</button><span class="file">' + esc(p.file) + '</span></div>';
          secs.forEach(function (s) { var href = p.file + '#' + s.anchor; html += '<button type="button" class="locpop__sec' + (href === cur ? ' cur' : '') + '" data-href="' + esc(href) + '">' + esc(s.name) + ' <span class="anch">#' + esc(s.anchor) + '</span></button>'; });
        });
        if (!any) html = '<div class="locpop__empty">Ingen treff på «' + esc(query) + '»</div>';
        list.innerHTML = html;
        list.querySelectorAll('[data-href]').forEach(function (b) { b.addEventListener('click', function () { chooseLoc(b.getAttribute('data-href')); }); });
      }
      function chooseLoc(href) { var input = pop._target; if (input) { input.value = href; input.dispatchEvent(new Event('input', { bubbles: true })); } closePop(); }
      function closePop() { if (pop) pop.style.display = 'none'; }
      function positionPop(input) {
        if (!pop || !input) return;
        var r = input.getBoundingClientRect();
        var pw = pop.offsetWidth || 344, ph = pop.offsetHeight || 360;
        var left = r.left;
        if (left + pw > window.innerWidth - 8) left = window.innerWidth - 8 - pw;
        if (left < 8) left = 8;
        var top = r.bottom + 6;
        if (top + ph > window.innerHeight - 8) { top = r.top - 6 - ph; if (top < 8) top = 8; }
        pop.style.left = left + 'px'; pop.style.top = top + 'px';
      }
      function openLocPicker(input) {
        buildPicker();
        if (pop.style.display !== 'none' && pop._target === input) { closePop(); return; }
        pop._target = input; pop._q = '';
        var s = pop.querySelector('.locpop__search input');
        s.value = ''; renderLocList('');
        pop.style.display = 'flex'; positionPop(input);
        setTimeout(function () { s.focus(); }, 0);
      }
      function wireLoc(scope) {
        if (!scope) return;
        var btn = scope.querySelector('.btn-loc'); if (!btn) return;
        var input = scope.querySelector('[data-f="href"]');
        btn.addEventListener('click', function (e) { e.preventDefault(); openLocPicker(input); });
      }

      loadData(); loadAlign(); renderItems(); applyAlignUI(); renderPreview();
      measureLayout(); setTimeout(measureLayout, 120);
      pushHistory(); buildPicker(); enrichLive();
      AC.enhanceHelp(host);

      return {
        export: exportFile,
        destroy: function () {
          window.removeEventListener('resize', winResize);
          document.removeEventListener('keydown', onKeydown);
          document.removeEventListener('click', locDocClick);
          window.removeEventListener('resize', locWinResize);
          if (pop && pop.parentNode) pop.parentNode.removeChild(pop);
          pop = null;
        }
      };
    }
  });
})();
