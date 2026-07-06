/* ============================================================
   admin-modules/begrep.js — Begrep-editor (utgaver/podkast/film) som C-modul
   Erstatter begrep-admin.html. Krever palette.js og begrep-content.js
   (BEGREP_CONTENT), som skallet (admin.html) laster.
   Live forhåndsvisning via begrep.html?preview=1.
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('begrep', {
    title: 'Begrep',
    see: { href: 'begrep.html', label: 'Se Begrep-siden ↗' },
    exportName: 'begrep-content.js',

    searchEntries: function () {
      var d = window.AdminCommon.readDraftOr('apeiron-begrep-v1', 'BEGREP_CONTENT') || {};
      return (d.podcasts || []).map(function (p) {
        if (!p || !p.title) return null;
        return { t: p.title, d: (p.tag ? p.tag + ' · ' : '') + String(p.desc || '').trim(), u: 'begrep.html#podkast', g: 'Begrep' };
      }).filter(Boolean);
    },

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live fra den ekte Begrep-siden. Bla i ruta for å se hele siden (utgaver, podkast og film). Endringene dine vises umiddelbart.</p>'
          + '<div class="pv-page-wrap"><iframe id="pv-page" src="begrep.html?preview=1" title="Forhåndsvisning av Begrep-siden"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du Begrep-siden</strong>'
          + '<ol>'
            + '<li>Rediger innholdet nedenfor. Klikk på et felt for å redigere det</li>'
            + '<li>Last opp omslag/plakat ved å <b>klikke på bildefeltet</b> eller dra et bilde inn</li>'
            + '<li>Trykk <b>☁ Publiser til GitHub</b> oppe til høyre</li>'
            + '<li><em>(Reserve hvis publisering svikter: «↓ Last ned alle endrede» nederst i Oversikt-fanen, og legg fila i GitHub.)</em></li>'
            + '<li>Cloudflare oppdaterer nettsiden automatisk innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren din. Tallene på siden (utgaver, sesonger) teller seg selv ut fra listene under.</div>'
        + '</div>'
        + '<div class="meta-panel">'
          + '<div class="fg narrow"><label>Grunnlagt (år)</label><input type="number" id="meta-founded" min="1900" step="1"></div>'
          + '<div class="fg narrow"><label data-help="Antall luker/episoder i julekalenderen. Vises som telling på siden.">Julekalender-episoder</label><input type="number" id="meta-jul" min="0" step="1"></div>'
          + '<div class="fg"><label>E-post (kontaktskjema)</label><input type="email" id="meta-email" placeholder="begreptidsskrift@gmail.com"></div>'
          + '<div class="fg" style="flex-basis:100%"><label data-help="Lim inn delingslenken til Google Forms-skjemaet. Brukes som «bestill»-knapp på siden.">Bestillingslenke (Google Forms URL)</label><input type="url" id="meta-order-url" placeholder="https://docs.google.com/forms/..."></div>'
        + '</div>'
        + '<div class="sec"><div class="sec-head"><h2>Utgaver</h2><span class="count" id="count-issues"></span><button class="btn-add" type="button" data-add="issues">+ Ny utgave</button></div><div class="list" id="list-issues"></div></div>'
        + '<div class="sec"><div class="sec-head"><h2>Podkast</h2><span class="count" id="count-podcasts"></span><button class="btn-add" type="button" data-add="podcasts">+ Ny podkast/sesong</button></div><div class="list" id="list-podcasts"></div></div>'
        + '<div class="sec"><div class="sec-head"><h2>Film</h2><span class="count" id="count-films"></span><button class="btn-add" type="button" data-add="films">+ Ny film</button></div><div class="list" id="list-films"></div></div>'
        + '<input type="file" data-file accept="image/png,image/jpeg,image/webp,image/avif" hidden>';

      var q = function (id) { return host.querySelector('#' + id); };
      var LS_KEY = 'apeiron-begrep-v1';
      var esc = AC.esc;
      var data = { meta: {}, issues: [], podcasts: [], films: [] };

      function fresh() {
        var c = window.BEGREP_CONTENT || {};
        return {
          meta: Object.assign({ founded: 2019, julekalenderEpisodes: 24 }, c.meta || {}),
          issues: (c.issues || []).map(function (x) { return Object.assign({}, x); }),
          podcasts: (c.podcasts || []).map(function (x) { return Object.assign({}, x); }),
          films: (c.films || []).map(function (x) { return Object.assign({}, x); })
        };
      }
      function loadData() {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) { try { data = JSON.parse(raw); return; } catch (_) {} }
        data = fresh();
      }
      function saveData() { AC.persistDraft(LS_KEY, data); AC.toast('Lagret i nettleseren'); pushPreview(); }
      var saveTimer = null;
      function lazySave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveData, 350); }
      function uid(pfx) { return pfx + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

      var SCHEMAS = {
        issues: {
          img: 'img', titleField: 'title',
          fields: [
            { f: 'year', label: 'Periode', type: 'text', ph: 'f.eks. Vår 2022', narrow: true },
            { f: 'title', label: 'Årgang', type: 'text', ph: 'f.eks. 5. Årgang' },
            { f: 'roman', label: 'Plassholder', type: 'text', ph: 'f.eks. V', narrow: true }
          ]
        },
        podcasts: {
          titleField: 'title',
          fields: [
            { f: 'tag', label: 'Merkelapp', type: 'text', ph: 'f.eks. Sesong 1', narrow: true },
            { f: 'title', label: 'Tittel', type: 'text', ph: 'Navn på podkasten' },
            { f: 'desc', label: 'Beskrivelse', type: 'textarea', ph: 'Kort beskrivelse...' },
            { f: 'link', label: 'Spotify-lenke', type: 'text', ph: 'https://...' },
            { f: 'accent', label: 'Fargeaksent', type: 'select', opts: (window.APEIRON_PALETTE_NAMES || [['gold', 'Gull'], ['rust', 'Rust'], ['green', 'Grønn']]) },
            { f: 'countsAsSeason', label: 'Teller som podkast-sesong', type: 'check' }
          ]
        },
        films: {
          img: 'poster', titleField: 'title',
          fields: [
            { f: 'title', label: 'Tittel', type: 'text', ph: 'Filmtittel' },
            { f: 'kind', label: 'Type', type: 'text', ph: 'f.eks. Kortfilm', narrow: true },
            { f: 'year', label: 'År', type: 'text', ph: 'f.eks. 2024', narrow: true },
            { f: 'status', label: 'Status', type: 'select', opts: [['released', 'Sluppet'], ['production', 'Under produksjon']] },
            { f: 'youtube', label: 'YouTube video-ID', type: 'text', ph: 'f.eks. dQw4w9WgXcQ (valgfritt)' },
            { f: 'desc', label: 'Beskrivelse', type: 'textarea', ph: 'Kort beskrivelse...' }
          ]
        }
      };

      // bildefelt håndteres av AdminCommon.wireImageField (delt) i makeCard


      function setField(list, id, field, val) {
        var item = data[list].find(function (x) { return x.id === id; });
        if (!item) return;
        item[field] = val;
        if (field === SCHEMAS[list].titleField) {
          var titleEl = host.querySelector('[data-id="' + id + '"] .card-title');
          if (titleEl) titleEl.textContent = val || '(uten navn)';
        }
        updateCounts(); lazySave();
      }

      function makeCard(list, item) {
        var schema = SCHEMAS[list];
        var card = document.createElement('div');
        card.className = 'card'; card.setAttribute('data-id', item.id); card.setAttribute('data-list', list);
        var fieldsHtml = '';
        schema.fields.forEach(function (fd) {
          var input;
          if (fd.type === 'textarea') {
            input = '<textarea data-f="' + fd.f + '" placeholder="' + esc(fd.ph || '') + '">' + esc(item[fd.f] || '') + '</textarea>';
          } else if (fd.type === 'select') {
            input = '<select data-f="' + fd.f + '">' + fd.opts.map(function (o) { return '<option value="' + o[0] + '"' + (item[fd.f] === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select>';
          } else if (fd.type === 'check') {
            var checked = item[fd.f] !== false;
            fieldsHtml += '<div class="fg fg-check"><input type="checkbox" id="chk-' + item.id + '-' + fd.f + '" data-f="' + fd.f + '"' + (checked ? ' checked' : '') + '><label for="chk-' + item.id + '-' + fd.f + '">' + esc(fd.label) + '</label></div>';
            return;
          } else {
            input = '<input type="' + (fd.type === 'number' ? 'number' : 'text') + '" data-f="' + fd.f + '" value="' + esc(item[fd.f] || '') + '" placeholder="' + esc(fd.ph || '') + '">';
          }
          fieldsHtml += '<div class="fg' + (fd.narrow ? ' narrow' : '') + '"><label>' + esc(fd.label) + '</label>' + input + '</div>';
        });
        var titleVal = item[schema.titleField] || '(uten navn)';
        var hasImg = !!schema.img;
        card.innerHTML =
          '<div class="card-head"><span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<span class="card-title">' + esc(titleVal) + '</span>'
            + '<div class="order-btns"><button class="btn-ord btn-up" type="button" title="Opp">↑</button><button class="btn-ord btn-dn" type="button" title="Ned">↓</button></div>'
            + '<button class="btn-del" type="button">Slett</button></div>'
          + '<div class="card-body' + (hasImg ? '' : ' no-img') + '">'
            + (hasImg ? AC.imgFieldHtml(list === 'films' ? 'poster' : '', 'Klikk eller dra inn bilde') : '')
            + '<div class="fields">' + fieldsHtml + '</div>'
          + '</div>';

        if (hasImg) {
          AC.wireImageField({
            zone: card.querySelector('.img-zone'),
            get: function () { return item[schema.img] || ''; },
            set: function (url) { setField(list, item.id, schema.img, url || null); },
            aspect: list === 'films' ? 16 / 10 : 3 / 4, outSize: 1000, quality: 0.84,
            title: 'Rediger bilde'
          });
        }

        card.querySelectorAll('[data-f]').forEach(function (el) {
          var field = el.getAttribute('data-f');
          var evt = (el.tagName === 'SELECT' || el.type === 'checkbox') ? 'change' : 'input';
          el.addEventListener(evt, function () {
            var v;
            if (el.type === 'checkbox') v = el.checked;
            else if (el.type === 'number') v = el.value === '' ? null : Number(el.value);
            else v = el.value;
            setField(list, item.id, field, v);
          });
        });
        card.querySelector('.btn-up').addEventListener('click', function () { move(list, item.id, -1); });
        card.querySelector('.btn-dn').addEventListener('click', function () { move(list, item.id, 1); });
        card.querySelector('.btn-del').addEventListener('click', function () { del(list, item.id); });
        return card;
      }

      function renderList(list) {
        var el = q('list-' + list); el.innerHTML = '';
        data[list].forEach(function (item) { el.appendChild(makeCard(list, item)); });
        updateCounts();
      }
      function renderAll() {
        ['issues', 'podcasts', 'films'].forEach(renderList);
        q('meta-founded').value = data.meta.founded != null ? data.meta.founded : '';
        q('meta-jul').value = data.meta.julekalenderEpisodes != null ? data.meta.julekalenderEpisodes : '';
        q('meta-email').value = data.meta.email || '';
        q('meta-order-url').value = data.meta.orderFormUrl || '';
        AC.enhanceHelp(host);
      }
      function updateCounts() {
        q('count-issues').textContent = data.issues.length + ' utgaver';
        var seasons = data.podcasts.filter(function (p) { return p.countsAsSeason !== false; }).length;
        q('count-podcasts').textContent = data.podcasts.length + ' totalt · ' + seasons + ' sesonger';
        q('count-films').textContent = data.films.length + ' filmer';
      }

      var DEFAULTS = {
        issues: function () { return { id: uid('i'), year: '', title: '', roman: '', img: null }; },
        podcasts: function () { return { id: uid('p'), tag: '', title: '', desc: '', link: 'https://creators.spotify.com/pod/profile/begrep-podcast/', accent: 'gold', countsAsSeason: true }; },
        films: function () { return { id: uid('f'), title: '', kind: 'Kortfilm', year: '', status: 'production', youtube: '', poster: null, desc: '' }; }
      };
      function add(list) {
        data[list].push(DEFAULTS[list]()); renderList(list); lazySave();
        setTimeout(function () { var last = host.querySelector('#list-' + list + ' .card:last-child'); if (last) last.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
      }
      function del(list, id) { var arr = data[list], i = arr.findIndex(function (x) { return x.id === id; }); if (i < 0) return; var it = arr[i]; var nm = it.title || it.name || it.label || 'element'; AC.undoDelete(arr, i, '«' + nm + '» slettet', function () { shellRender(list); }, lazySave); }
      function move(list, id, dir) {
        var arr = data[list], i = arr.findIndex(function (x) { return x.id === id; });
        if (i < 0) return; var j = i + dir; if (j < 0 || j >= arr.length) return;
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t; shellRender(list); lazySave();
      }
      function shellRender(list) { renderList(list); if (typeof shell !== 'undefined' && shell && shell.isActive()) shell.refresh(); }

      q('meta-founded').addEventListener('input', function () { data.meta.founded = this.value === '' ? null : Number(this.value); lazySave(); });
      q('meta-jul').addEventListener('input', function () { data.meta.julekalenderEpisodes = this.value === '' ? null : Number(this.value); lazySave(); });
      q('meta-email').addEventListener('input', function () { data.meta.email = this.value.trim() || null; lazySave(); });
      q('meta-order-url').addEventListener('input', function () { data.meta.orderFormUrl = this.value.trim() || null; lazySave(); });

      function exportFile() {
        var content =
          '/* Innhold for Begrep-siden (begrep.html).\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Rediger direkte her, eller åpne Admin-senteret → Begrep.\n'
          + '\n'
          + '   img/poster: "assets/begrep/filnavn.png", base64-bilde fra admin, eller null.\n'
          + '   Tall i statistikk-stripen telles automatisk fra listene. */\n\n'
          + 'window.BEGREP_CONTENT = ' + JSON.stringify(data, null, 2) + ';\n';
        AC.saveFile('begrep-content.js', content);
        AC.toast('Fil lastet ned. Erstatt i GitHub og push!');
      }

      q('reset-btn').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); data = fresh(); renderAll(); AC.toast('Tilbakestilt til publisert versjon'); pushPreview();
      });
      host.querySelectorAll('[data-add]').forEach(function (b) { b.addEventListener('click', function () { add(b.getAttribute('data-add')); }); });

      ['issues', 'podcasts', 'films'].forEach(function (list) {
        AC.enableDragSort(q('list-' + list), {
          itemSelector: '.card', handleSelector: '.drag-handle',
          onReorder: function (ids) { data[list].sort(function (a, b) { return ids.indexOf(a.id) - ids.indexOf(b.id); }); lazySave(); }
        });
      });

      var pvFrame = q('pv-page');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-begrep-preview', content: data }, '*'); } catch (e) {} }
      function onPreviewMsg(e) { if (e.origin !== window.location.origin) return; if (e.data && e.data.type === 'apeiron-begrep-preview-ready') { pushPreview(); fitPreview(); } }
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

      loadData(); AC.draftBaseline(LS_KEY, data); renderAll();

      /* ── delt «Liste + detalj»-skall (collections: 3 samlinger + banner) ── */
      function bMeta(list, item) {
        if (list === 'issues') return { av: item.roman || '📕', cls: 'sq', nm: item.title || '(uten tittel)', sub: [item.year, item.roman].filter(Boolean).join(' · ') || 'Utgave' };
        if (list === 'podcasts') return { av: '🎙', cls: 'sq', nm: item.title || '(uten tittel)', sub: item.tag || 'Podkast' };
        return { av: '🎬', cls: 'sq', nm: item.title || '(uten tittel)', sub: [item.kind, item.year].filter(Boolean).join(' · ') || 'Film' };
      }
      var shell = AC.PanelShell.mount(host, AC, {
        rail: 'collections',
        title: 'Begrep', subtitle: '3 samlinger',
        remember: 'apeiron-begrep-shell-sel',
        banner: { label: 'Tall & bestilling', sub: 'Grunnlagt, julekalender, bestillingslenke', current: function () { return null; }, adopt: function () { return host.querySelector('.meta-panel'); } },
        groups: ['issues', 'podcasts', 'films'].map(function (list, idx) {
          var labels = { issues: 'Utgaver', podcasts: 'Podkast', films: 'Film' };
          var adds = { issues: 'Ny utgave', podcasts: 'Ny podkast/sesong', films: 'Ny film' };
          return {
            key: list, label: labels[list], addLabel: adds[list], primary: idx === 0,
            items: function () { return data[list]; },
            meta: function (item) { return bMeta(list, item); },
            detail: function (item) { return makeCard(list, item); },
            onReorder: function (ids) { data[list].sort(function (a, b) { return ids.indexOf(a.id) - ids.indexOf(b.id); }); lazySave(); },
            onAdd: function () { add(list); return data[list][data[list].length - 1] && data[list][data[list].length - 1].id; }
          };
        })
      });
      function applyPanelLayout() { shell.layoutChanged(); }
      window.addEventListener('apeiron-panellayout', applyPanelLayout);
      applyPanelLayout();
      ['issues', 'podcasts', 'films'].forEach(function (lst) {
        AC.viewSwitch({ list: q('list-' + lst), key: 'apeiron-begrep-view-' + lst + '-v1', help: 'Velg hvordan kortene i denne lista vises mens du redigerer her i admin. Påvirker bare redigeringsvisningen, ikke den publiserte siden.' });
      });
      fitPreview(); setTimeout(fitPreview, 80);
      pushPreview(); setTimeout(pushPreview, 150);

      return {
        export: exportFile,
        destroy: function () { window.removeEventListener('message', onPreviewMsg); window.removeEventListener('resize', fitPreview); window.removeEventListener('apeiron-panellayout', applyPanelLayout); if (shell) shell.destroy(); }
      };
    }
  });
})();
