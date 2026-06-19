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
          + '<p class="pp-sub">Live fra forsiden — «Akkurat nå»-kortet i toppbildet og beskjedene i seksjonene oppdateres mens du skriver.</p>'
          + '<div class="pv-wrap"><iframe id="pv-frame" src="index.html?preview=1" title="Forhåndsvisning av forsiden"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til publisert versjon</button>'
          + '<strong>Slik legger du ut en nyhet</strong>'
          + '<ol>'
            + '<li>Trykk <b>+ Ny nyhet</b> og velg <b>hvor</b> den skal vises (Forsiden, Arrangementer, Aporetisk eller Fadderuke)</li>'
            + '<li>Skriv en kort <b>tittel</b> — og evt. litt brødtekst og en lenke (påmelding, skjema …)</li>'
            + '<li>Sett <b>⚑ Viktig</b> for tydelig vinrød hastemarkering</li>'
            + '<li>Trykk <b>↓ Last ned alle endrede</b> oppe til høyre, erstatt fila i GitHub og push — siden oppdateres innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Lagres automatisk i nettleseren mens du jobber. Nyeste øverst — dra i ⠿ for å sortere. Gamle nyheter: trykk <b>● Aktiv → ✓ Arkivert</b> i stedet for å slette — da flyttes de til arkivet på nyhetssiden. «Neste arrangement» i panelet hentes automatisk fra kalenderen; det legger du ikke inn her.</div>'
        + '</div>'
        + '<div class="sec-head"><h2>Nyheter</h2><span class="count" id="count-items"></span><button class="btn-add" type="button" id="add-item">+ Ny nyhet</button></div>'
        + '<div class="list" id="list-items"></div>';

      var q = function (id) { return host.querySelector('#' + id); };
      var LS_KEY = 'apeiron-news-v1';
      var esc = AC.esc;
      var PLACES = [
        { v: 'panel', t: 'Forsiden (Akkurat nå-kortet)' },
        { v: 'arrangement', t: 'Arrangementer' },
        { v: 'aporetisk', t: 'Aporetisk Aften' },
        { v: 'fadderuke', t: 'Fadderukene' }
      ];
      var data = { items: [] };

      function fresh() { var c = window.NEWS_CONTENT || {}; return { items: (c.items || []).map(function (x) { return Object.assign({}, x); }) }; }
      function loadData() {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) { try { data = JSON.parse(raw); if (!data.items) data.items = []; return; } catch (_) {} }
        data = fresh();
      }
      var saveTimer = null;
      function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(data)); AC.toast('Lagret i nettleseren'); pushPreview(); }
      function lazySave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveData, 300); }
      function uid() { return 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
      function fmtPosted(iso) { if (!iso) return ''; var d = new Date(iso + 'T00:00:00'); return isNaN(d.getTime()) ? iso : d.toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' }); }

      function itemCard(n) {
        var card = document.createElement('div');
        card.className = 'card' + (n.urgent ? ' is-urgent' : '') + (n.done ? ' is-done' : '');
        card.setAttribute('data-id', n.id);
        var placeOpts = PLACES.map(function (p) { return '<option value="' + p.v + '"' + (n.place === p.v ? ' selected' : '') + '>' + esc(p.t) + '</option>'; }).join('');
        card.innerHTML =
          '<div class="card-head"><span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<span class="card-title">' + esc(n.title || '(uten tittel)') + '</span>'
            + '<div class="order-btns"><button class="btn-ord btn-up" type="button" title="Opp">↑</button><button class="btn-ord btn-dn" type="button" title="Ned">↓</button></div>'
            + '<button class="btn-toggle btn-urgent ' + (n.urgent ? 'btn-urgent--on' : 'btn-toggle--off') + '" type="button" title="Hastegrad">⚑ Viktig</button>'
            + '<button class="btn-toggle btn-status btn-status--' + (n.done ? 'done' : 'active') + '" type="button" title="Aktiv / arkivert">' + (n.done ? '✓ Arkivert' : '● Aktiv') + '</button>'
            + '<button class="btn-del" type="button">Slett</button></div>'
          + '<div class="fields">'
            + '<div class="frow">'
              + '<div class="fg"><label data-help="Hvor nyheten vises. «Forsiden» = Akkurat nå-kortet i toppbildet. De andre = en slank beskjed øverst i den seksjonen.">Vises på</label><select data-f="place">' + placeOpts + '</select></div>'
              + '<div class="fg narrow"><label data-help="Valgfri fritekst-dato, f.eks. «20. juni», «I kveld» eller «Frist 25. juni».">Dato (valgfri)</label><input type="text" data-f="date" value="' + esc(n.date) + '" placeholder="f.eks. 20. juni"></div>'
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
        card.querySelector('.btn-urgent').addEventListener('click', function () {
          n.urgent = !n.urgent;
          this.className = 'btn-toggle btn-urgent ' + (n.urgent ? 'btn-urgent--on' : 'btn-toggle--off');
          card.classList.toggle('is-urgent', !!n.urgent); lazySave();
        });
        card.querySelector('.btn-status').addEventListener('click', function () {
          n.done = !n.done;
          this.className = 'btn-toggle btn-status btn-status--' + (n.done ? 'done' : 'active');
          this.textContent = n.done ? '✓ Arkivert' : '● Aktiv';
          card.classList.toggle('is-done', !!n.done); lazySave();
        });
        card.querySelector('.btn-up').addEventListener('click', function () { move(n.id, -1); });
        card.querySelector('.btn-dn').addEventListener('click', function () { move(n.id, 1); });
        card.querySelector('.btn-del').addEventListener('click', function () { if (confirm('Slett «' + (n.title || 'denne nyheten') + '»? (Vurder «Arkivert» i stedet.)')) del(n.id); });
        AC.wireHrefField(card, { sel: '[data-f="link"]' });
        return card;
      }

      function renderList() {
        var el = q('list-items'); el.innerHTML = '';
        data.items.forEach(function (n) { el.appendChild(itemCard(n)); });
        q('count-items').textContent = data.items.length + (data.items.length === 1 ? ' nyhet' : ' nyheter');
        AC.enhanceHelp(host);
      }
      function add() {
        data.items.unshift({ id: uid(), place: 'panel', urgent: false, title: '', text: '', date: '', link: '', linkLabel: '', done: false, posted: new Date().toISOString().slice(0, 10) });
        renderList(); lazySave();
        setTimeout(function () { var f = host.querySelector('#list-items .card:first-child'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
      }
      function del(id) { data.items = data.items.filter(function (x) { return x.id !== id; }); renderList(); lazySave(); }
      function move(id, dir) {
        var a = data.items, i = a.findIndex(function (x) { return x.id === id; });
        if (i < 0) return; var j = i + dir; if (j < 0 || j >= a.length) return;
        var t = a[i]; a[i] = a[j]; a[j] = t; renderList(); lazySave();
      }

      function exportFile() {
        var header =
          '/* ============================================================\n'
          + '   news-content.js — nyheter, kunngjøringer og beskjeder\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Redigeres i Admin-senteret → Nyheter, eller rett her.\n'
          + '\n'
          + '   place: "panel" (Akkurat nå-kortet) | "arrangement" | "aporetisk" | "fadderuke"\n'
          + '   urgent: true = vinrød «Viktig». text: **fet** *kursiv* _understrek_ [tekst](url).\n'
          + '   done: true = arkivert (vises i arkivet på nyheter.html, ikke på forsiden).\n'
          + '   ============================================================ */\n\n'
          + 'window.NEWS_CONTENT = ' + JSON.stringify({ items: data.items }, null, 2) + ';\n';
        AC.saveFile('news-content.js', header);
        AC.toast('Fil lastet ned — erstatt i GitHub og push!');
      }

      q('add-item').addEventListener('click', add);
      q('reset-btn').addEventListener('click', function () {
        if (!confirm('Forkast alle ueksporterte endringer og last inn publisert versjon?')) return;
        localStorage.removeItem(LS_KEY); data = fresh(); renderList(); AC.toast('Tilbakestilt'); pushPreview();
      });

      AC.enableDragSort(q('list-items'), {
        itemSelector: '.card', handleSelector: '.drag-handle',
        onReorder: function (ids) { data.items.sort(function (a, b) { return ids.indexOf(a.id) - ids.indexOf(b.id); }); lazySave(); }
      });

      var pvFrame = q('pv-frame');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-news-preview', items: data.items }, '*'); } catch (e) {} }
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
      window.addEventListener('message', onPreviewMsg);
      window.addEventListener('resize', fitPreview);
      if (pvFrame) pvFrame.addEventListener('load', function () { fitPreview(); pushPreview(); });

      loadData(); renderList();
      fitPreview(); setTimeout(fitPreview, 80);
      pushPreview(); setTimeout(pushPreview, 200);

      return {
        export: exportFile,
        destroy: function () { window.removeEventListener('message', onPreviewMsg); window.removeEventListener('resize', fitPreview); }
      };
    }
  });
})();
