/* ============================================================
   admin-modules/oppnaelser.js — Oppnåelser-editor som C-modul
   Erstatter oppnaelser-admin.html. Krever palette.js (createColorControl) og
   oppnaelser-content.js (OPPNAELSER_CONTENT), som skallet (admin.html) laster.
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('oppnaelser', {
    title: 'Oppnåelser',
    see: { href: 'oppnaelser.html', label: 'Se Oppnåelser-siden ↗' },
    exportName: 'oppnaelser-content.js',

    searchEntries: function () {
      var d = window.AdminCommon.readDraftOr('apeiron-oppnaelser-v1', 'OPPNAELSER_CONTENT') || {};
      var out = [];
      if (d.intro && d.intro.heading) out.push({ t: d.intro.heading, d: String(d.intro.lede || '').trim(), u: 'oppnaelser.html', g: 'Heder' });
      (d.awards || []).forEach(function (a) {
        if (!a || !a.title) return;
        var meta = [a.medal, a.giver, a.year].filter(Boolean).join(' · ');
        out.push({ t: a.title, d: meta + (a.desc ? ' — ' + a.desc : ''), u: 'oppnaelser.html', g: 'Heder' });
      });
      return out;
    },

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live fra den ekte Oppnåelser-siden — endringene dine vises umiddelbart.</p>'
          + '<div class="pv-frame-wrap"><iframe id="pv-frame" src="oppnaelser.html?preview=1" title="Forhåndsvisning av Oppnåelser-siden"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" data-reset type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du Oppnåelser-siden</strong>'
          + '<ol>'
            + '<li>Rediger innholdet nedenfor — klikk på et felt for å redigere det</li>'
            + '<li>Last opp plakat / diplom ved å <b>klikke på bildefeltet</b> eller dra et bilde inn</li>'
            + '<li>Klikk <b>↓ Last ned alle endrede</b> oppe til høyre</li>'
            + '<li>Erstatt <code>oppnaelser-content.js</code> i GitHub-repositoriet og push/commit</li>'
            + '<li>Cloudflare oppdaterer nettsiden automatisk innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren din. «Merke» er resultatet (f.eks. Sølv), «Tildelt av» er hvem som arrangerte / delte ut.</div>'
        + '</div>'
        + '<div class="meta-panel"><h3>Overskrift øverst på siden</h3>'
          + '<div class="meta-grid">'
            + '<div class="fg narrow"><label data-help="Liten etikett over overskriften, f.eks. «Pokalhylla».">Eyebrow</label><input type="text" data-meta="eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" data-meta="heading"></div>'
            + '<div class="fg"><label>Ingress</label><input type="text" data-meta="lede"></div>'
            + '<div class="fg narrow"><label data-help="Teksten på «Tilbake»-lenken øverst til venstre.">Tilbake-tekst</label><input type="text" data-meta="back"></div>'
            + '<div class="fg narrow"><label data-help="Hvor «Tilbake»-lenken går, f.eks. index.html.">Tilbake-lenke</label><input type="text" data-meta="backHref"></div>'
          + '</div>'
        + '</div>'
        + '<div class="sec"><div class="sec-head"><h2>Oppnåelser (premier)</h2><span class="count" data-count></span><button class="btn-add" type="button" data-add>+ Ny oppnåelse</button></div><div class="list" data-list></div></div>'
        + '<input type="file" data-file accept="image/png,image/jpeg,image/webp,image/avif" hidden>';

      var LS_KEY = 'apeiron-oppnaelser-v1';
      var esc = AC.esc;
      var data = { intro: {}, awards: [] };

      function fresh() {
        var c = window.OPPNAELSER_CONTENT || {};
        return {
          intro: Object.assign({ eyebrow: 'Pokalhylla', heading: 'Oppnåelser', lede: '', back: 'Tilbake', backHref: 'index.html' }, c.intro || {}),
          awards: (c.awards || []).map(function (x) { return Object.assign({}, x); })
        };
      }
      function normalize() { data.intro = data.intro || {}; data.awards = data.awards || []; }
      function loadData() {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) { try { data = JSON.parse(raw); normalize(); return; } catch (_) {} }
        data = fresh(); normalize();
      }
      function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(data)); AC.toast('Lagret i nettleseren'); pushPreview(); }
      var saveTimer = null;
      function lazySave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveData, 350); }
      function uid(pfx) { return pfx + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
      function find(id) { return data.awards.find(function (x) { return x.id === id; }); }

      // bildefelt håndteres av AdminCommon.wireImageField (delt) i awardCard


      function awardCard(a) {
        var card = document.createElement('div');
        card.className = 'card'; card.setAttribute('data-id', a.id);
        card.innerHTML =
          '<div class="card-head"><span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<span class="card-title">' + esc(a.title || '(uten tittel)') + '</span>'
            + '<div class="order-btns"><button class="btn-ord btn-up" type="button" title="Opp">↑</button><button class="btn-ord btn-dn" type="button" title="Ned">↓</button></div>'
            + '<button class="btn-del" type="button">Slett</button></div>'
          + '<div class="card-body">'
            + AC.imgFieldHtml('', 'Klikk eller dra inn plakat / diplom')
            + '<div class="fields">'
              + '<div class="fg"><label>Tittel</label><input type="text" data-f="title" value="' + esc(a.title) + '" placeholder="f.eks. Volleyballcup 2026"></div>'
              + '<div class="frow">'
                + '<div class="fg"><label data-help="Resultatet, vises som merke på bildet, f.eks. «Sølv».">Merke / resultat</label><input type="text" data-f="medal" value="' + esc(a.medal) + '" placeholder="f.eks. Sølv"></div>'
                + '<div class="fg"><label data-help="Hvem som arrangerte eller delte ut, f.eks. «NTNUI».">Tildelt av</label><input type="text" data-f="giver" value="' + esc(a.giver) + '" placeholder="f.eks. NTNUI"></div>'
                + '<div class="fg narrow"><label>År</label><input type="text" data-f="year" value="' + esc(a.year) + '" placeholder="2026"></div>'
              + '</div>'
              + '<div class="fg"><label>Fargestripe</label><div data-accent-host></div></div>'
              + '<div class="fg"><label>Beskrivelse</label><textarea data-f="desc" placeholder="Kort om oppnåelsen...">' + esc(a.desc) + '</textarea></div>'
            + '</div>'
          + '</div>';

        AC.wireImageField({
          zone: card.querySelector('.img-zone'),
          get: function () { return a.img || ''; },
          set: function (url) { a.img = url || null; },
          aspect: 16 / 10, outSize: 1100, quality: 0.85,
          title: 'Rediger bilde — ' + (a.title || 'oppnåelse'),
          afterChange: lazySave
        });

        card.querySelectorAll('[data-f]').forEach(function (el) {
          var field = el.getAttribute('data-f');
          el.addEventListener('input', function () { a[field] = el.value; if (field === 'title') card.querySelector('.card-title').textContent = el.value || '(uten tittel)'; lazySave(); });
        });
        var accentHost = card.querySelector('[data-accent-host]');
        if (accentHost && window.createColorControl) accentHost.appendChild(window.createColorControl({ value: a.accent || '', emptyLabel: 'Gull (standard)', onChange: function (v) { a.accent = v; lazySave(); } }));
        card.querySelector('.btn-up').addEventListener('click', function () { move(a.id, -1); });
        card.querySelector('.btn-dn').addEventListener('click', function () { move(a.id, 1); });
        card.querySelector('.btn-del').addEventListener('click', function () { del(a.id); });
        return card;
      }

      function renderList() {
        var el = host.querySelector('[data-list]'); el.innerHTML = '';
        data.awards.forEach(function (item) { el.appendChild(awardCard(item)); });
        host.querySelector('[data-count]').textContent = data.awards.length + (data.awards.length === 1 ? ' oppnåelse' : ' oppnåelser');
      }
      function renderMeta() {
        host.querySelectorAll('[data-meta]').forEach(function (el) {
          var k = el.getAttribute('data-meta');
          el.value = data.intro[k] || '';
          el.oninput = function () { data.intro[k] = el.value; lazySave(); };
        });
      }
      function renderAll() { renderMeta(); renderList(); AC.enhanceHelp(host); }

      function add() {
        data.awards.push({ id: uid('a'), title: '', medal: '', giver: '', year: '', img: null, accent: '', desc: '' });
        renderList(); lazySave();
        setTimeout(function () { var last = host.querySelector('[data-list] .card:last-child'); if (last) last.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
      }
      function del(id) { var i = data.awards.findIndex(function (x) { return x.id === id; }); if (i < 0) return; AC.undoDelete(data.awards, i, '«' + (data.awards[i].title || 'Oppnåelse') + '» slettet', renderList, lazySave); }
      function move(id, dir) {
        var arr = data.awards, i = arr.findIndex(function (x) { return x.id === id; });
        if (i < 0) return; var j = i + dir; if (j < 0 || j >= arr.length) return;
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t; renderList(); lazySave();
      }

      function exportFile() {
        var out = JSON.parse(JSON.stringify(data));
        var content =
          '/* Innhold for Oppnåelser-siden (oppnaelser.html).\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Rediger direkte her, eller åpne Admin-senteret → Oppnåelser.\n'
          + '\n'
          + '   awards[].img   : "assets/oppnaelser/filnavn.webp", base64-bilde fra admin, eller null.\n'
          + '   awards[].medal : resultatet, vises som merke (f.eks. «Sølv»).\n'
          + '   awards[].giver : hvem som delte ut / arrangerte.\n'
          + '   awards[].accent: fargestripe — palettnavn ("" = gull) eller { light, dark }. */\n\n'
          + 'window.OPPNAELSER_CONTENT = ' + JSON.stringify(out, null, 2) + ';\n';
        AC.saveFile('oppnaelser-content.js', content);
        AC.toast('Fil lastet ned — erstatt i GitHub og push!');
      }

      host.querySelector('[data-reset]').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); data = fresh(); renderAll(); AC.toast('Tilbakestilt til publisert versjon'); pushPreview();
      });
      host.querySelector('[data-add]').addEventListener('click', add);

      AC.enableDragSort(host.querySelector('[data-list]'), {
        itemSelector: '.card', handleSelector: '.drag-handle',
        onReorder: function (ids) { data.awards.sort(function (a, b) { return ids.indexOf(a.id) - ids.indexOf(b.id); }); lazySave(); }
      });

      loadData(); renderAll();
      AC.viewSwitch({ list: host.querySelector('[data-list]'), key: 'apeiron-oppnaelser-view-v1', help: 'Velg hvordan oppnåelses-kortene vises mens du redigerer her i admin. Påvirker bare redigeringsvisningen, ikke den publiserte siden.' });

      /* ── live forhåndsvisning (oppnaelser.html?preview=1) ── */
      var pvFrame = host.querySelector('#pv-frame');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-oppnaelser-preview', content: data }, '*'); } catch (e) {} }
      function onPreviewMsg(e) { if (e.data && e.data.type === 'apeiron-oppnaelser-preview-ready') { pushPreview(); fitPreview(); } }
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
