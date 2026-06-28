/* ============================================================
   admin-modules/nyheter.js — Nyheter-editor som C-modul
   Erstatter nyheter-admin.html. Krever news-content.js (NEWS_CONTENT), som
   skallet (admin.html) laster. Live forhåndsvisning via index.html?preview=1.
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('nyheter', {
    title: 'Nyheter',
    see: { href: 'nyheter.html', label: 'Se nyheter ↗' },
    exportName: 'news-content.js',

    searchEntries: function () {
      var d = window.AdminCommon.readDraftOr('apeiron-news-v1', 'NEWS_CONTENT') || {};
      function stripMd(s) {
        return String(s || '')
          .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
          .replace(/[*_]{1,3}/g, '')
          .replace(/\s+/g, ' ').trim();
      }
      return (d.items || []).map(function (it) {
        if (!it || !it.title) return null;
        return { t: (it.urgent ? 'Viktig · ' : '') + it.title, d: stripMd(it.text || ''), u: 'nyheter.html', g: 'Nyheter' };
      }).filter(Boolean);
    },

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live mens du skriver. Bytt mellom forsidens «Akkurat nå»-kort og hele nyhetssiden (med arkiv).</p>'
          + '<div class="pv-page" id="pv-page"><button type="button" data-page="index.html?preview=1" class="pv-page-btn on">Forsiden</button><button type="button" data-page="nyheter.html?preview=1" class="pv-page-btn">Nyhetssiden</button></div>'
          + '<div class="pv-wrap"><iframe id="pv-frame" src="index.html?preview=1" title="Forhåndsvisning"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til publisert versjon</button>'
          + '<strong>Slik legger du ut en nyhet</strong>'
          + '<ol>'
            + '<li>Trykk <b>+ Ny nyhet</b> og velg <b>hvor</b> den skal vises (Forsiden, Arrangementer, Aporetisk eller Fadderuke)</li>'
            + '<li>Skriv en kort <b>tittel</b>, og eventuelt litt brødtekst og en lenke (påmelding, skjema …)</li>'
            + '<li>Sett <b>⚑ Viktig</b> for tydelig vinrød hastemarkering</li>'
            + '<li>Trykk <b>☁ Publiser til GitHub</b> oppe til høyre. Siden oppdateres innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Lagres automatisk i nettleseren mens du jobber. Nyeste øverst. Dra i ⠿ for å sortere. Gamle nyheter: trykk <b>● Aktiv → ✓ Arkivert</b> i stedet for å slette. Da flyttes de til arkivet på nyhetssiden. «Neste arrangement» i panelet hentes automatisk fra kalenderen; det legger du ikke inn her.</div>'
        + '</div>'
        + '<div class="sec" data-news-banner><div class="sec-head"><h2>Topp-banner</h2></div>'
          + '<p class="sec-desc">Tittelen og teksten øverst på nyhetssiden.</p>'
          + '<div class="fields">'
            + '<div class="fg"><label>Tilbake-lenke (tekst)</label><input type="text" id="sh-back"></div>'
            + '<div class="fg"><label>Tittel</label><input type="text" id="sh-title"></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="sh-lede"></textarea></div>'
          + '</div></div>'
        + '<div class="sec-head"><h2>Nyheter</h2><span class="count" id="count-items"></span><button class="btn-add" type="button" id="add-item">+ Ny nyhet</button></div>'
        + '<div class="list" id="list-items"></div>'
        + '<div class="sec arch-news" id="arch-sec" style="display:none">'
          + '<div class="sec-head"><h2>Arkiverte nyheter</h2><span class="count" id="count-arch"></span></div>'
          + '<p class="sec-desc">Nyheter du har arkivert (✓ Arkivert). De vises ikke på forsiden lenger, men ligger i arkivet på nyhetssiden. Sett en tilbake til ● Aktiv for å vise den igjen.</p>'
          + '<div class="lay-switch" id="news-arch-density">'
            + '<span class="lay-switch__lbl" data-help="Velg hvordan arkiverte nyheter vises mens du redigerer. Kompakt slår hver nyhet sammen til én rad (tittel + dato); Utvidet åpner full redigering. Pilen i kort-toppen åpner/lukker én enkelt.">Visning</span>'
            + '<div class="lay-switch__btns">'
              + '<button type="button" data-density="kompakt" title="Sammenslåtte rader: rask oversikt"><span class="lay-ic ic-rows"><i></i><i></i><i></i></span>Kompakt</button>'
              + '<button type="button" data-density="utvidet" title="Full redigering av hver arkiverte nyhet"><span class="lay-ic ic-one"><i></i></span>Utvidet</button>'
            + '</div>'
          + '</div>'
          + '<div class="list" id="list-arch"></div>'
        + '</div>';

      var q = function (id) { return host.querySelector('#' + id); };
      var LS_KEY = 'apeiron-news-v1';
      var esc = AC.esc;
      var PLACES = [
        { v: 'panel', t: 'Forsiden (Akkurat nå-kortet)' },
        { v: 'arrangement', t: 'Arrangementer' },
        { v: 'aporetisk', t: 'Aporetisk Aften' },
        { v: 'fadderuke', t: 'Fadderukene' }
      ];
      var KICKERS = ['Kunngjøring', 'Nyhet', 'Beskjed', 'Påminnelse', 'Frist'];
      var data = { subhero: {}, items: [] };

      var ARCH_OPEN_KEY = 'apeiron-news-arch-open-v1';
      var archOpen = {}; try { archOpen = JSON.parse(localStorage.getItem(ARCH_OPEN_KEY)) || {}; } catch (_) { archOpen = {}; }
      function saveArchOpen() { try { localStorage.setItem(ARCH_OPEN_KEY, JSON.stringify(archOpen)); } catch (_) {} }
      function isArchOpen(id) { return !!archOpen[id]; }
      function setArchOpen(id, v) { if (v) archOpen[id] = true; else delete archOpen[id]; saveArchOpen(); }
      function archAnyClosed() { return data.items.some(function (n) { return n.done && !isArchOpen(n.id); }); }

      function fresh() { var c = window.NEWS_CONTENT || {}; return { subhero: Object.assign({}, c.subhero || {}), items: (c.items || []).map(function (x) { return Object.assign({}, x); }) }; }
      function loadData() {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) { try { data = JSON.parse(raw); if (!data.items) data.items = []; if (!data.subhero) data.subhero = {}; normItems(); return; } catch (_) {} }
        data = fresh(); normItems();
      }
      var saveTimer = null;
      function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(data)); AC.toast('Lagret i nettleseren'); pushPreview(); }
      function lazySave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveData, 300); }
      function uid() { return 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
      function fmtPosted(iso) { if (!iso) return ''; var d = new Date(iso + 'T00:00:00'); return isNaN(d.getTime()) ? iso : d.toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' }); }
      function normItems() { (data.items || []).forEach(function (n) { if (n && n.kicker === undefined) n.kicker = 'Kunngjøring'; }); }
      function kickerHtml(n) {
        var v = (n.kicker === undefined ? 'Kunngjøring' : (n.kicker || ''));
        var preset = KICKERS.indexOf(v) >= 0, none = (v === '');
        var opts = '<option value=""' + (none ? ' selected' : '') + '>Ingen</option>'
          + KICKERS.map(function (k) { return '<option value="' + esc(k) + '"' + (v === k ? ' selected' : '') + '>' + esc(k) + '</option>'; }).join('')
          + '<option value="__custom"' + (!preset && !none ? ' selected' : '') + '>Egendefinert…</option>';
        return '<select data-kicker>' + opts + '</select>'
          + '<input type="text" class="kicker-custom" data-kicker-custom value="' + (!preset && !none ? esc(v) : '') + '" placeholder="Egen tekst"' + (!preset && !none ? '' : ' hidden') + '>';
      }

      function itemCard(n) {
        var card = document.createElement('div');
        card.className = 'card' + (n.urgent ? ' is-urgent' : '') + (n.done ? ' is-done' : '') + (n.done && !isArchOpen(n.id) ? ' is-collapsed' : '');
        card.setAttribute('data-id', n.id);
        var placeOpts = PLACES.map(function (p) { return '<option value="' + p.v + '"' + (n.place === p.v ? ' selected' : '') + '>' + esc(p.t) + '</option>'; }).join('');
        var chevron = n.done ? '<button class="btn-collapse" type="button" title="Vis/skjul"><span class="chev">▾</span></button>' : '';
        var archWhen = (n.done && n.posted) ? '<span class="arch-when">' + esc(fmtPosted(n.posted)) + '</span>' : '';
        card.innerHTML =
          '<div class="card-head">' + chevron + '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<span class="card-title">' + esc(n.title || '(uten tittel)') + '</span>'
            + archWhen
            + '<div class="order-btns"><button class="btn-ord btn-up" type="button" title="Opp">↑</button><button class="btn-ord btn-dn" type="button" title="Ned">↓</button></div>'
            + '<button class="btn-toggle btn-urgent ' + (n.urgent ? 'btn-urgent--on' : 'btn-toggle--off') + '" type="button" title="Hastegrad">⚑ Viktig</button>'
            + '<button class="btn-toggle btn-status btn-status--' + (n.done ? 'done' : 'active') + '" type="button" title="' + (n.done ? 'Hent tilbake til aktive nyheter' : 'Flytt til arkivet (Tidligere nyheter)') + '">' + (n.done ? '↩ Hent tilbake' : '🗄 Arkivér') + '</button>'
            + '<button class="btn-del" type="button">Slett</button></div>'
          + '<div class="fields">'
            + '<div class="frow">'
              + '<div class="fg"><label data-help="Hvor nyheten vises. «Forsiden» = Akkurat nå-kortet i toppbildet. De andre = en slank beskjed øverst i den seksjonen.">Vises på</label><select data-f="place">' + placeOpts + '</select></div>'
              + '<div class="fg narrow"><label data-help="Liten merkelapp øverst på «Akkurat nå»-kortet. «Ingen» skjuler den – da får tittelen plassen.">Merkelapp</label>' + kickerHtml(n) + '</div>'
              + '<div class="fg narrow"><label data-help="Vises som liten tidsstempel øverst til høyre på kortet. Tom = datoen nyheten ble lagt ut brukes automatisk.">Dato (valgfri)</label><input type="text" data-f="date" value="' + esc(n.date) + '" placeholder="f.eks. 20. juni"></div>'
            + '</div>'
            + '<div class="fg"><label>Tittel</label><input type="text" data-f="title" value="' + esc(n.title) + '" placeholder="Kort og tydelig"></div>'
            + '<div class="fg"><label data-help="Valgfri brødtekst. **fet**  *kursiv*  _understrek_  [lenketekst](https://…)">Tekst (valgfri)</label><textarea data-f="text" placeholder="Litt mer om nyheten …">' + esc(n.text) + '</textarea></div>'
            + '<div class="frow">'
              + '<div class="fg"><label data-help="Side og anker (f.eks. index.html#arrangementer) eller en https-lenke. Tom = ingen lenke.">Lenke (valgfri)</label><div class="addr-wrap"><input type="text" data-f="link" value="' + esc(n.link) + '" placeholder="index.html#arrangementer"><button class="btn-loc" type="button" title="Velg side og seksjon">📍</button></div><div class="lnk-warn"></div></div>'
              + '<div class="fg narrow"><label>Lenketekst</label><input type="text" data-f="linkLabel" value="' + esc(n.linkLabel) + '" placeholder="Les mer"></div>'
            + '</div>'
            + '<div class="posted-note">' + (n.posted ? 'Lagt ut ' + esc(fmtPosted(n.posted)) : 'Legges ut i dag') + '</div>'
          + '</div>';

        card.querySelectorAll('[data-f]').forEach(function (el) {
          var f = el.getAttribute('data-f');
          el.addEventListener('input', function () { n[f] = el.value; if (f === 'title') card.querySelector('.card-title').textContent = el.value || '(uten tittel)'; lazySave(); });
        });
        var kSel = card.querySelector('[data-kicker]'), kIn = card.querySelector('[data-kicker-custom]');
        if (kSel) kSel.addEventListener('change', function () {
          if (kSel.value === '__custom') { kIn.hidden = false; n.kicker = kIn.value || ''; kIn.focus(); }
          else { kIn.hidden = true; n.kicker = kSel.value; }
          lazySave();
        });
        if (kIn) kIn.addEventListener('input', function () { n.kicker = kIn.value; lazySave(); });
        card.querySelector('.btn-urgent').addEventListener('click', function () {
          n.urgent = !n.urgent;
          this.className = 'btn-toggle btn-urgent ' + (n.urgent ? 'btn-urgent--on' : 'btn-toggle--off');
          card.classList.toggle('is-urgent', !!n.urgent); lazySave();
        });
        card.querySelector('.btn-status').addEventListener('click', function () {
          n.done = !n.done;
          // arkivdato settes ved første arkivering og endres ALDRI ved «Hent tilbake»
          if (n.done && !n.archivedAt) n.archivedAt = Date.now();
          AC.toast(n.done ? ('Arkivert ' + fmtArchived(n.archivedAt) + ', ligger nå under «Arkiverte»') : 'Hentet tilbake til aktive');
          shellRender(); lazySave();
        });
        card.querySelector('.btn-up').addEventListener('click', function () { move(n.id, -1); });
        card.querySelector('.btn-dn').addEventListener('click', function () { move(n.id, 1); });
        card.querySelector('.btn-del').addEventListener('click', function () { del(n.id); });
        var colBtn = card.querySelector('.btn-collapse');
        if (colBtn) colBtn.addEventListener('click', function () {
          card.classList.toggle('is-collapsed');
          setArchOpen(n.id, !card.classList.contains('is-collapsed'));
          updateArchDensity();
        });
        AC.wireHrefField(card, { sel: '[data-f="link"]' });
        return card;
      }

      function renderList() {
        var active = data.items.filter(function (n) { return !n.done; });
        var done = data.items.filter(function (n) { return n.done; });
        var el = q('list-items'); el.innerHTML = ''; active.forEach(function (n) { el.appendChild(itemCard(n)); });
        var ael = q('list-arch'); ael.innerHTML = ''; done.forEach(function (n) { ael.appendChild(itemCard(n)); });
        q('count-items').textContent = active.length + (active.length === 1 ? ' nyhet' : ' nyheter');
        q('count-arch').textContent = done.length + (done.length === 1 ? ' arkivert' : ' arkiverte');
        q('arch-sec').style.display = done.length ? '' : 'none';
        updateArchDensity();
        AC.enhanceHelp(host);
      }
      function applyArchDensity(mode) {
        data.items.forEach(function (n) { if (n.done) setArchOpen(n.id, mode === 'utvidet'); });
        renderList();
      }
      function updateArchDensity() {
        var sw = q('news-arch-density'); if (!sw) return;
        var done = data.items.filter(function (n) { return n.done; }).length;
        sw.style.display = done ? '' : 'none';
        var active = (done && !archAnyClosed()) ? 'utvidet' : 'kompakt';
        Array.prototype.forEach.call(sw.querySelectorAll('[data-density]'), function (b) { b.classList.toggle('active', b.getAttribute('data-density') === active); });
      }
      function add() {
        data.items.unshift({ id: uid(), place: 'panel', urgent: false, title: '', text: '', date: '', kicker: 'Kunngjøring', link: '', linkLabel: '', done: false, posted: new Date().toISOString().slice(0, 10) });
        renderList(); lazySave();
        setTimeout(function () { var f = host.querySelector('#list-items .card:first-child'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
      }
      function del(id) { var i = data.items.findIndex(function (x) { return x.id === id; }); if (i < 0) return; AC.undoDelete(data.items, i, '«' + (data.items[i].title || 'Nyhet') + '» slettet', shellRender, lazySave); }
      function move(id, dir) {
        var a = data.items, i = a.findIndex(function (x) { return x.id === id; });
        if (i < 0) return; var j = i + dir; if (j < 0 || j >= a.length) return;
        var t = a[i]; a[i] = a[j]; a[j] = t; shellRender(); lazySave();
      }

      function exportFile() {
        var header =
          '/* ============================================================\n'
          + '   news-content.js — nyheter, kunngjøringer og beskjeder\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Redigeres i Admin-senteret → Nyheter, eller rett her.\n'
          + '\n'
          + '   place: "panel" (Akkurat nå-kortet) | "arrangement" | "aporetisk" | "fadderuke"\n'
          + '   kicker: merkelapp på «Akkurat nå»-kortet ("" = ingen). date: liten tidsstempel-tekst (tom = lagt ut-dato).\n'
          + '   urgent: true = vinrød «Viktig». text: **fet** *kursiv* _understrek_ [tekst](url).\n'
          + '   done: true = arkivert (vises i arkivet på nyheter.html, ikke på forsiden).\n'
          + '   subhero: topp-banneret (tilbake-lenke, tittel, ingress).\n'
          + '   ============================================================ */\n\n'
          + 'window.NEWS_CONTENT = ' + JSON.stringify({ subhero: data.subhero, items: data.items }, null, 2) + ';\n';
        AC.saveFile('news-content.js', header);
        AC.toast('Fil lastet ned. Erstatt i GitHub og push!');
      }

      q('add-item').addEventListener('click', add);
      host.querySelectorAll('#news-arch-density [data-density]').forEach(function (b) {
        b.addEventListener('click', function () { applyArchDensity(b.getAttribute('data-density')); });
      });
      q('reset-btn').addEventListener('click', function () {
        if (!confirm('Forkast alle ueksporterte endringer og last inn publisert versjon?')) return;
        localStorage.removeItem(LS_KEY); data = fresh(); normItems(); renderList(); AC.toast('Tilbakestilt'); pushPreview();
      });

      function applyOrderFromDom() {
        var ids = [];
        host.querySelectorAll('#list-items .card, #list-arch .card').forEach(function (c) { ids.push(c.getAttribute('data-id')); });
        data.items.sort(function (a, b) { return ids.indexOf(a.id) - ids.indexOf(b.id); });
        lazySave();
      }
      AC.enableDragSort(q('list-items'), { itemSelector: '.card', handleSelector: '.drag-handle', onReorder: applyOrderFromDom });
      AC.enableDragSort(q('list-arch'), { itemSelector: '.card', handleSelector: '.drag-handle', onReorder: applyOrderFromDom });

      function fmtArchived(ts) { if (!ts) return ''; try { return new Date(ts).toLocaleDateString('no-NO', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (_) { return ''; } }
      /* ── delt «Liste + detalj»-skall (status-filter: Aktive / Arkiverte / Alle) ── */
      var shell = AC.PanelShell.mount(host, AC, {
        rail: 'filter',
        title: 'Nyheter', subtitle: '1 samling',
        remember: 'apeiron-nyheter-shell-sel',
        banner: { label: 'Topp-banner', current: function () { return (data.subhero && data.subhero.title) || ''; }, adopt: function () { return host.querySelector('[data-news-banner]'); } },
        filter: {
          def: 'active',
          segments: [
            { key: 'active', label: 'Aktive', count: function () { return data.items.filter(function (n) { return !n.done; }).length; } },
            { key: 'archived', label: 'Arkiverte', count: function () { return data.items.filter(function (n) { return n.done; }).length; } },
            { key: 'all', label: 'Alle', count: function () { return data.items.length; } }
          ]
        },
        groups: [{
          key: 'items', label: 'Saker', addLabel: 'Ny nyhet',
          items: function () { return data.items; },
          matchFilter: function (n, seg) { return seg === 'all' ? true : seg === 'archived' ? !!n.done : !n.done; },
          meta: function (n) {
            var sub = n.done ? ('Arkivert ' + (fmtArchived(n.archivedAt) || fmtPosted(n.posted) || '')) : (n.kicker || 'Aktiv');
            return { av: n.urgent ? '⚑' : '📰', cls: 'sq', nm: n.title || '(uten tittel)', sub: sub, dot: n.done ? 'off' : 'on' };
          },
          detail: function (n) { var c = itemCard(n); c.classList.remove('is-collapsed'); return c; },
          onAdd: function () { add(); return data.items[0] && data.items[0].id; }
        }]
      });
      function shellRender() { renderList(); if (shell.isActive()) shell.refresh(); }
      function applyPanelLayout() { shell.layoutChanged(); }
      window.addEventListener('apeiron-panellayout', applyPanelLayout);

      var pvFrame = q('pv-frame');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-news-preview', items: data.items, subhero: data.subhero }, '*'); } catch (e) {} }
      function onPreviewMsg(e) { if (e.data && e.data.type === 'apeiron-news-preview-ready') { pushPreview(); } }
      function fitPreview() {
        var wrap = host.querySelector('.pv-wrap');
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
      host.querySelectorAll('#pv-page [data-page]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.classList.contains('on')) return;
          host.querySelectorAll('#pv-page [data-page]').forEach(function (x) { x.classList.toggle('on', x === b); });
          pvFrame.src = b.getAttribute('data-page');
        });
      });
      window.addEventListener('message', onPreviewMsg);
      window.addEventListener('resize', fitPreview);
      if (pvFrame) pvFrame.addEventListener('load', function () { fitPreview(); pushPreview(); });

      loadData(); renderList(); applyPanelLayout();
      (function () {
        var map = { 'sh-back': 'back', 'sh-title': 'title', 'sh-lede': 'lede' };
        Object.keys(map).forEach(function (id) {
          var el = q(id); if (!el) return;
          el.value = (data.subhero && data.subhero[map[id]]) || '';
          el.addEventListener('input', function () { data.subhero[map[id]] = el.value; lazySave(); });
        });
      })();
      AC.viewSwitch({ list: q('list-items'), key: 'apeiron-news-view-v1', help: 'Velg hvordan nyhetskortene vises mens du redigerer her i admin. Påvirker bare redigeringsvisningen, ikke den publiserte siden.' });
      fitPreview(); setTimeout(fitPreview, 80);
      pushPreview(); setTimeout(pushPreview, 200);

      return {
        export: exportFile,
        destroy: function () { window.removeEventListener('message', onPreviewMsg); window.removeEventListener('resize', fitPreview); window.removeEventListener('apeiron-panellayout', applyPanelLayout); if (shell) shell.destroy(); }
      };
    }
  });
})();
