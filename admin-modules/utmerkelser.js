/* ============================================================
   admin-modules/utmerkelser.js — Utmerkelser-editor som C-modul
   Erstatter utmerkelser-admin.html. Krever palette.js (createColorControl) og
   utmerkelser-content.js (UTMERKELSER_CONTENT), som skallet (admin.html) laster.
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('utmerkelser', {
    title: 'Utmerkelser',
    see: { href: 'utmerkelser.html', label: 'Se Utmerkelser-siden ↗' },
    exportName: 'utmerkelser-content.js',

    searchEntries: function () {
      var d = window.AdminCommon.readDraftOr('apeiron-utmerkelser-v1', 'UTMERKELSER_CONTENT') || {};
      var out = [];
      if (d.intro && d.intro.heading) out.push({ t: d.intro.heading, d: String(d.intro.lede || '').trim(), u: 'utmerkelser.html', g: 'Heder' });
      (d.people || []).forEach(function (pp) {
        if (!pp || !pp.name || /Fornavn\s+Etternavn/i.test(pp.name)) return;
        var meta = [pp.honor, pp.year].filter(Boolean).join(' · ');
        out.push({ t: pp.name, d: meta + (pp.desc ? ' — ' + pp.desc : ''), u: 'utmerkelser.html', g: 'Heder' });
      });
      return out;
    },

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live fra den ekte Utmerkelser-siden — endringene dine vises umiddelbart.</p>'
          + '<div class="pv-frame-wrap"><iframe id="pv-frame" src="utmerkelser.html?preview=1" title="Forhåndsvisning av Utmerkelser-siden"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" data-reset type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du Utmerkelser-siden</strong>'
          + '<ol>'
            + '<li>Rediger innholdet nedenfor — klikk på et felt for å redigere det</li>'
            + '<li>Last opp portrett ved å <b>klikke på bildefeltet</b> eller dra et bilde inn</li>'
            + '<li>Klikk <b>↓ Last ned alle endrede</b> oppe til høyre</li>'
            + '<li>Erstatt <code>utmerkelser-content.js</code> i GitHub-repositoriet og push/commit</li>'
            + '<li>Cloudflare oppdaterer nettsiden automatisk innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren din. Eksempel­kortene er bare maler — bytt dem ut med ekte personer.</div>'
        + '</div>'
        + '<div class="meta-panel"><h3>Overskrift øverst på siden</h3>'
          + '<div class="meta-grid">'
            + '<div class="fg narrow"><label data-help="Liten etikett over overskriften, f.eks. «Heder & ære».">Eyebrow</label><input type="text" data-meta="eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" data-meta="heading"></div>'
            + '<div class="fg"><label>Ingress</label><input type="text" data-meta="lede"></div>'
            + '<div class="fg narrow"><label data-help="Teksten på «Tilbake»-lenken øverst til venstre.">Tilbake-tekst</label><input type="text" data-meta="back"></div>'
            + '<div class="fg narrow"><label data-help="Hvor «Tilbake»-lenken går, f.eks. index.html.">Tilbake-lenke</label><input type="text" data-meta="backHref"></div>'
          + '</div>'
        + '</div>'
        + '<div class="sec"><div class="sec-head"><h2>Utmerkelser (personer)</h2><span class="count" data-count></span><button class="btn-add" type="button" data-add>+ Ny utmerkelse</button></div><div class="list" data-list></div></div>'
        + '<input type="file" data-file accept="image/png,image/jpeg,image/webp,image/avif" hidden>';

      var LS_KEY = 'apeiron-utmerkelser-v1';
      var esc = AC.esc;
      var data = { intro: {}, people: [] };

      function fresh() {
        var c = window.UTMERKELSER_CONTENT || {};
        return {
          intro: Object.assign({ eyebrow: 'Heder & ære', heading: 'Utmerkelser', lede: '', back: 'Tilbake', backHref: 'index.html' }, c.intro || {}),
          people: (c.people || []).map(function (x) { return Object.assign({}, x); })
        };
      }
      function normalize() { data.intro = data.intro || {}; data.people = data.people || []; }
      function loadData() {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) { try { data = JSON.parse(raw); normalize(); return; } catch (_) {} }
        data = fresh(); normalize();
      }
      function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(data)); AC.toast('Lagret i nettleseren'); pushPreview(); }
      var saveTimer = null;
      function lazySave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveData, 350); }
      function uid(pfx) { return pfx + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
      function initialsFrom(name) { return String(name || '').split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).join('').toUpperCase().slice(0, 4); }
      function find(id) { return data.people.find(function (x) { return x.id === id; }); }

      // Bygger <option>-liste for årskull (studieår), f.eks. 2025/2026. Eldre/ukjente
      // verdier (f.eks. bare «2026») bevares som eget valg så ingenting går tapt.
      function arskullOptions(current) {
        var now = new Date();
        var startYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1; // studieår starter i august
        var top = startYear + 1; // tillat neste kull
        var cur = String(current == null ? '' : current).trim();
        var found = false;
        var opts = '<option value=""' + (cur ? '' : ' selected') + '>Velg årskull…</option>';
        for (var y = top; y >= 2014; y--) {
          var a = y + '/' + (y + 1);
          var sel = (a === cur) ? ' selected' : '';
          if (sel) found = true;
          opts += '<option value="' + a + '"' + sel + '>' + a + '</option>';
        }
        if (cur && !found) opts += '<option value="' + esc(cur) + '" selected>' + esc(cur) + ' (eldre format)</option>';
        return opts;
      }

      // bildefelt håndteres av AdminCommon.wireImageField (delt) i personCard


      function personCard(p) {
        var card = document.createElement('div');
        card.className = 'card'; card.setAttribute('data-id', p.id);
        card.innerHTML =
          '<div class="card-head"><span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<span class="card-title">' + esc(p.name || '(uten navn)') + '</span>'
            + '<div class="order-btns"><button class="btn-ord btn-up" type="button" title="Opp">↑</button><button class="btn-ord btn-dn" type="button" title="Ned">↓</button></div>'
            + '<button class="btn-del" type="button">Slett</button></div>'
          + '<div class="card-body">'
            + AC.imgFieldHtml('', 'Klikk eller dra inn bilde')
            + '<div class="fields">'
              + '<div class="frow">'
                + '<div class="fg"><label>Navn</label><input type="text" data-f="name" value="' + esc(p.name) + '" placeholder="Fullt navn"></div>'
                + '<div class="fg narrow"><label>Initialer</label><input type="text" data-f="initials" value="' + esc(p.initials) + '" placeholder="f.eks. FE"></div>'
              + '</div>'
              + '<div class="frow">'
                + '<div class="fg"><label data-help="Selve utmerkelsen, vises stort, f.eks. «Æresmedlem».">Utmerkelse</label><input type="text" data-f="honor" value="' + esc(p.honor) + '" placeholder="f.eks. Æresmedlem"></div>'
                + '<div class="fg narrow"><label data-help="Studieåret personen hedres for. Brukes til å filtrere etter årskull på den publiserte siden.">Årskull</label><select data-f="year">' + arskullOptions(p.year) + '</select></div>'
              + '</div>'
              + '<div class="fg"><label>Fargestripe</label><div data-accent-host></div></div>'
              + '<div class="fg"><label>Beskrivelse</label><textarea data-f="desc" placeholder="Kort om hvorfor personen hedres...">' + esc(p.desc) + '</textarea></div>'
            + '</div>'
          + '</div>';

        AC.wireImageField({
          zone: card.querySelector('.img-zone'),
          get: function () { return p.img || ''; },
          set: function (url) { p.img = url || null; },
          aspect: 1, outSize: 700, quality: 0.85,
          title: 'Rediger bilde — ' + (p.name || 'person'),
          afterChange: lazySave
        });

        card.querySelectorAll('[data-f]').forEach(function (el) {
          var field = el.getAttribute('data-f');
          el.addEventListener('input', function () {
            p[field] = el.value;
            if (field === 'name') {
              card.querySelector('.card-title').textContent = el.value || '(uten navn)';
              var initEl = card.querySelector('[data-f="initials"]');
              if (initEl && !p.initials) { p.initials = initialsFrom(el.value); initEl.value = p.initials; }
            }
            lazySave();
          });
        });
        var accentHost = card.querySelector('[data-accent-host]');
        if (accentHost && window.createColorControl) accentHost.appendChild(window.createColorControl({ value: p.accent || '', emptyLabel: 'Gull (standard)', onChange: function (v) { p.accent = v; lazySave(); } }));
        card.querySelector('.btn-up').addEventListener('click', function () { move(p.id, -1); });
        card.querySelector('.btn-dn').addEventListener('click', function () { move(p.id, 1); });
        card.querySelector('.btn-del').addEventListener('click', function () { del(p.id); });
        return card;
      }

      function renderList() {
        var el = host.querySelector('[data-list]'); el.innerHTML = '';
        data.people.forEach(function (item) { el.appendChild(personCard(item)); });
        host.querySelector('[data-count]').textContent = data.people.length + (data.people.length === 1 ? ' utmerkelse' : ' utmerkelser');
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
        data.people.push({ id: uid('p'), name: '', initials: '', img: null, honor: '', year: '', accent: '', desc: '' });
        renderList(); lazySave();
        setTimeout(function () { var last = host.querySelector('[data-list] .card:last-child'); if (last) last.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
      }
      function del(id) { var i = data.people.findIndex(function (x) { return x.id === id; }); if (i < 0) return; AC.undoDelete(data.people, i, '«' + (data.people[i].name || 'Utmerkelse') + '» slettet', renderList, lazySave); }
      function move(id, dir) {
        var arr = data.people, i = arr.findIndex(function (x) { return x.id === id; });
        if (i < 0) return; var j = i + dir; if (j < 0 || j >= arr.length) return;
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t; renderList(); lazySave();
      }

      function exportFile() {
        var out = JSON.parse(JSON.stringify(data));
        var content =
          '/* Innhold for Utmerkelser-siden (utmerkelser.html).\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Rediger direkte her, eller åpne Admin-senteret → Utmerkelser.\n'
          + '\n'
          + '   people[].img   : "assets/utmerkelser/filnavn.jpg", base64-bilde fra admin, eller null.\n'
          + '   people[].honor : selve utmerkelsen, vises stort.\n'
          + '   people[].accent: fargestripe — palettnavn ("" = gull) eller { light, dark }. */\n\n'
          + 'window.UTMERKELSER_CONTENT = ' + JSON.stringify(out, null, 2) + ';\n';
        AC.saveFile('utmerkelser-content.js', content);
        AC.toast('Fil lastet ned — erstatt i GitHub og push!');
      }

      host.querySelector('[data-reset]').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); data = fresh(); renderAll(); AC.toast('Tilbakestilt til publisert versjon'); pushPreview();
      });
      host.querySelector('[data-add]').addEventListener('click', add);

      AC.enableDragSort(host.querySelector('[data-list]'), {
        itemSelector: '.card', handleSelector: '.drag-handle',
        onReorder: function (ids) { data.people.sort(function (a, b) { return ids.indexOf(a.id) - ids.indexOf(b.id); }); lazySave(); }
      });

      loadData(); renderAll();
      AC.viewSwitch({ list: host.querySelector('[data-list]'), key: 'apeiron-utmerkelser-view-v1', help: 'Velg hvordan utmerkelses-kortene vises mens du redigerer her i admin. Påvirker bare redigeringsvisningen, ikke den publiserte siden.' });

      /* ── live forhåndsvisning (utmerkelser.html?preview=1) ── */
      var pvFrame = host.querySelector('#pv-frame');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-utmerkelser-preview', content: data }, '*'); } catch (e) {} }
      function onPreviewMsg(e) { if (e.data && e.data.type === 'apeiron-utmerkelser-preview-ready') { pushPreview(); fitPreview(); } }
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
