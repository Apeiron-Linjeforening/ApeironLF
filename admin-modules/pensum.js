/* ============================================================
   admin-modules/pensum.js — Pensum-siden (pensum.html) som C-modul.
   Krever pensum-content.js (PENSUM_CONTENT), som skallet (admin.html) laster.
   Live forhåndsvisning via pensum.html?preview=1.
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('pensum', {
    title: 'Pensum',
    see: { href: 'pensum.html', label: 'Se Pensum ↗' },
    exportName: 'pensum-content.js',

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live fra den ekte Pensum-siden — endringene dine vises umiddelbart. Tips: bruk <code>**fet**</code> for uthevet tekst og <code>[tekst](adresse)</code> for lenker i meta-punkter og tom-tilstand-meldinger.</p>'
          + '<div class="pv-board-wrap"><iframe id="pv-board" src="pensum.html?preview=1" title="Forhåndsvisning av Pensum"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du Pensum</strong>'
          + '<ol>'
            + '<li>Rediger nedenfor — endringer vises live i forhåndsvisningen</li>'
            + '<li>Trykk <b>☁ Publiser til GitHub</b> oppe til høyre</li>'
            + '<li><em>(Reserve hvis publisering svikter: «↓ Last ned alle endrede» nederst i Oversikt-fanen, og legg fila i GitHub.)</em></li>'
            + '<li>Cloudflare oppdaterer nettsiden automatisk innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren din.</div>'
        + '</div>'
        + '<div class="panel"><h2>Topp-banner <small>øverst på siden</small></h2>'
          + '<div class="panel-body">'
            + '<div class="fg"><label>Tilbake-lenke (tekst)</label><input type="text" id="ps-back"></div>'
            + '<div class="fg"><label>Tittel</label><input type="text" id="ps-title"></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="ps-lede"></textarea></div>'
            + '<div class="sub-h">Meta-punkter <small style="font-weight:400;text-transform:none;letter-spacing:0">(bruk **fet** for utheving)</small></div>'
            + '<div class="lst-plain" id="lst-meta"></div><button class="btn-add" type="button" data-addmeta>+ Nytt punkt</button>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Seksjoner <small>overskriftene over emnegruppene</small></h2>'
          + '<div class="panel-body"><div id="lst-sections"></div>'
            + '<p class="hint">Fargemerket (Felles/Filosofi/Etikk/Master) bestemmes av seksjonen — bare overskriftsteksten redigeres her.</p>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Emner <small>emnekatalogen</small></h2>'
          + '<div class="panel-body"><div class="lst" id="lst-courses"></div><button class="btn-add" type="button" data-addcourse>+ Nytt emne</button></div>'
        + '</div>'
        + '<div class="panel"><h2>Studieretningene <small>«Hva du kan studere»</small></h2>'
          + '<div class="panel-body">'
            + '<div class="frow"><div class="fg narrow"><label>Eyebrow</label><input type="text" id="ps-ti-eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="ps-ti-heading"></div></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="ps-ti-lede"></textarea></div>'
            + '<div class="sub-h">Retninger</div><div class="lst" id="lst-tracks"></div><button class="btn-add" type="button" data-addtrack>+ Ny retning</button>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Grader &amp; løp <small>studieprogrammene</small></h2>'
          + '<div class="panel-body">'
            + '<div class="fg"><label>Seksjonsoverskrift</label><input type="text" id="ps-graderHeading"></div>'
            + '<div class="sub-h">Programmer</div><div class="lst" id="lst-programs"></div><button class="btn-add" type="button" data-addprogram>+ Nytt program</button>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Pensum-markedet <small>teaser-banneret</small></h2>'
          + '<div class="panel-body">'
            + '<div class="frow"><div class="fg narrow"><label>Merkelapp</label><input type="text" id="ps-teaser-tag"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="ps-teaser-heading"></div></div>'
            + '<div class="fg"><label>Tekst</label><textarea id="ps-teaser-body"></textarea></div>'
            + '<div class="frow"><div class="fg"><label>Knapp — tekst</label><input type="text" id="ps-teaser-ctaLabel"></div>'
            + '<div class="fg"><label>Knapp — lenke</label><input type="text" id="ps-teaser-ctaHref"></div></div>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Ansvarsfraskrivelser <small>de to notisene nederst</small></h2>'
          + '<div class="panel-body">'
            + '<div class="fg"><label>Notis 1 (under emnelista)</label><textarea id="ps-note1"></textarea></div>'
            + '<div class="fg"><label>Notis 2 (helt nederst)</label><textarea id="ps-note2"></textarea></div>'
          + '</div>'
        + '</div>';

      var q = function (id) { return host.querySelector('#' + id); };
      var LS_KEY = 'apeiron-pensum-v1';
      var data = {};
      function clone(o) { return JSON.parse(JSON.stringify(o)); }
      function arr(x) { return Array.isArray(x) ? x : []; }
      function fresh() {
        var d = clone(window.PENSUM_CONTENT || {});
        d.subhero = d.subhero || {}; d.subhero.meta = arr(d.subhero.meta);
        d.sections = arr(d.sections);
        d.courses = arr(d.courses);
        d.teaser = d.teaser || {};
        d.tracksIntro = d.tracksIntro || {};
        d.tracks = arr(d.tracks);
        d.programs = arr(d.programs);
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
        data.subhero = Object.assign({}, f.subhero, data.subhero); data.subhero.meta = arr(data.subhero.meta);
        data.teaser = Object.assign({}, f.teaser, data.teaser);
        data.tracksIntro = Object.assign({}, f.tracksIntro, data.tracksIntro);
        if (!Array.isArray(data.sections)) data.sections = f.sections;
        if (!Array.isArray(data.courses)) data.courses = [];
        if (!Array.isArray(data.tracks)) data.tracks = [];
        if (!Array.isArray(data.programs)) data.programs = [];
      }
      function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(data)); pushPreview(); }
      var saveTimer = null;
      function lazySave() { pushPreview(); clearTimeout(saveTimer); saveTimer = setTimeout(function () { saveData(); AC.toast('Lagret i nettleseren'); }, 300); }
      function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
      function moveArr(a, i, dir) { var j = i + dir; if (j < 0 || j >= a.length) return; var t = a[i]; a[i] = a[j]; a[j] = t; }
      function ctrls() { return '<div class="lrow-ctrls"><button class="btn-mini up" type="button" title="Opp">↑</button><button class="btn-mini dn" type="button" title="Ned">↓</button><button class="btn-mini x" type="button" title="Slett">✕</button></div>'; }

      var FIELD_MAP = {
        'ps-back': 'subhero.back', 'ps-title': 'subhero.title', 'ps-lede': 'subhero.lede',
        'ps-ti-eyebrow': 'tracksIntro.eyebrow', 'ps-ti-heading': 'tracksIntro.heading', 'ps-ti-lede': 'tracksIntro.lede',
        'ps-graderHeading': 'graderHeading',
        'ps-teaser-tag': 'teaser.tag', 'ps-teaser-heading': 'teaser.heading', 'ps-teaser-body': 'teaser.body',
        'ps-teaser-ctaLabel': 'teaser.ctaLabel', 'ps-teaser-ctaHref': 'teaser.ctaHref',
        'ps-note1': 'note1', 'ps-note2': 'note2'
      };
      function getPath(path) { return path.split('.').reduce(function (o, k) { return (o || {})[k]; }, data); }
      function isUnsafeKey(k) { return k === '__proto__' || k === 'prototype' || k === 'constructor'; }
      function setPath(path, val) {
        var parts = path.split('.'), o = data;
        for (var i = 0; i < parts.length - 1; i++) {
          var key = parts[i];
          if (isUnsafeKey(key)) return;
          if (!Object.prototype.hasOwnProperty.call(o, key) || o[key] == null || typeof o[key] !== 'object') o[key] = {};
          o = o[key];
        }
        var last = parts[parts.length - 1];
        if (isUnsafeKey(last)) return;
        o[last] = val;
      }
      function renderFields() { Object.keys(FIELD_MAP).forEach(function (id) { var el = q(id); if (el) el.value = getPath(FIELD_MAP[id]) || ''; }); }
      function wireFields() { Object.keys(FIELD_MAP).forEach(function (id) { var el = q(id); if (!el) return; el.addEventListener('input', function () { setPath(FIELD_MAP[id], el.value); lazySave(); }); }); }

      // Gjenbrukbar enkel streng-liste (meta, points, chips)
      function strList(container, list, placeholder) {
        container.innerHTML = '';
        list.forEach(function (s, i) {
          var row = document.createElement('div');
          row.className = 'frow str-row';
          row.innerHTML = '<div class="fg"><input type="text" data-s value="' + esc(s) + '" placeholder="' + esc(placeholder || '') + '"></div>'
            + '<div class="str-ctrls"><button class="btn-mini up" type="button" title="Opp">↑</button><button class="btn-mini dn" type="button" title="Ned">↓</button><button class="btn-mini x" type="button" title="Slett">✕</button></div>';
          row.querySelector('[data-s]').addEventListener('input', function () { list[i] = this.value; lazySave(); });
          row.querySelector('.up').addEventListener('click', function () { moveArr(list, i, -1); strList(container, list, placeholder); lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(list, i, 1); strList(container, list, placeholder); lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { list.splice(i, 1); strList(container, list, placeholder); lazySave(); });
          container.appendChild(row);
        });
      }

      function renderMeta() { strList(q('lst-meta'), data.subhero.meta, 'f.eks. **15** emner'); }

      function renderSections() {
        var hostEl = q('lst-sections'); hostEl.innerHTML = '';
        data.sections.forEach(function (s) {
          var row = document.createElement('div');
          row.className = 'frow';
          row.innerHTML = '<div class="fg narrow"><label>Nivå</label><input type="text" value="' + esc(s.id) + '" disabled></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" data-lbl value="' + esc(s.label) + '"></div>';
          row.querySelector('[data-lbl]').addEventListener('input', function () { s.label = this.value; lazySave(); });
          hostEl.appendChild(row);
        });
      }

      function levelOptions(sel) {
        return data.sections.map(function (s) { return '<option value="' + esc(s.id) + '"' + (s.id === sel ? ' selected' : '') + '>' + esc(s.label) + '</option>'; }).join('');
      }
      function courseMode(c) { if (c._mode) return c._mode; if (c.empty && !(Array.isArray(c.books) && c.books.length)) return 'empty'; return 'books'; }

      function renderCourses() {
        var hostEl = q('lst-courses'); hostEl.innerHTML = '';
        data.courses.forEach(function (c, i) {
          var row = document.createElement('div');
          row.className = 'lrow'; row.setAttribute('data-id', 'course' + i);
          var mode = courseMode(c);
          row.innerHTML =
            '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<div class="lrow-fields">'
              + '<div class="frow"><div class="fg narrow"><label>Nivå</label><select data-k="level">' + levelOptions(c.level) + '</select></div>'
              + '<div class="fg narrow"><label>Emnekode</label><input type="text" data-k="code" value="' + esc(c.code) + '"></div>'
              + '<div class="fg narrow"><label>Semester</label><input type="text" data-k="semester" value="' + esc(c.semester) + '"></div></div>'
              + '<div class="fg"><label>Emnenavn</label><input type="text" data-k="name" value="' + esc(c.name) + '"></div>'
              + '<div class="fg"><label>Beskrivelse</label><textarea data-k="desc">' + esc(c.desc) + '</textarea></div>'
              + '<div class="fg"><label>Merknad (valgfri, gul ⚠-linje)</label><input type="text" data-k="note" value="' + esc(c.note || '') + '"></div>'
              + '<div class="frow"><div class="fg"><label>ntnu.no-lenke — tekst</label><input type="text" data-k="ntnuLabel" value="' + esc(c.ntnuLabel || '') + '" placeholder="Se emne på ntnu.no"></div>'
              + '<div class="fg"><label>ntnu.no-lenke — adresse</label><input type="text" data-k="ntnuHref" value="' + esc(c.ntnuHref || '') + '"></div></div>'
              + '<div class="seg-row"><label class="seg-lbl">Pensum-felt:</label>'
                + '<label class="seg-opt"><input type="radio" name="pmode' + i + '" value="books"' + (mode === 'books' ? ' checked' : '') + '> Bokliste</label>'
                + '<label class="seg-opt"><input type="radio" name="pmode' + i + '" value="empty"' + (mode === 'empty' ? ' checked' : '') + '> Melding</label>'
              + '</div>'
              + '<div class="pmode-area"></div>'
            + '</div>'
            + ctrls();
          row.querySelectorAll('[data-k]').forEach(function (inp) {
            var ev = inp.tagName === 'SELECT' ? 'change' : 'input';
            inp.addEventListener(ev, function () { c[inp.getAttribute('data-k')] = inp.value; lazySave(); });
          });
          row.querySelector('.up').addEventListener('click', function () { moveArr(data.courses, i, -1); renderCourses(); lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(data.courses, i, 1); renderCourses(); lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(data.courses, i, '«' + (c.code || c.name || 'Emne') + '» fjernet', renderCourses, lazySave); });

          var area = row.querySelector('.pmode-area');
          function renderArea() {
            var m = courseMode(c);
            area.innerHTML = '';
            if (m === 'empty') {
              if (!c.empty) c.empty = { title: '', body: '' };
              var ev = document.createElement('div');
              ev.innerHTML = '<div class="fg"><label>Melding — tittel</label><input type="text" data-e="title" value="' + esc(c.empty.title) + '"></div>'
                + '<div class="fg"><label>Melding — tekst <small style="font-weight:400;text-transform:none;letter-spacing:0">(støtter [lenke](adresse))</small></label><textarea data-e="body">' + esc(c.empty.body) + '</textarea></div>';
              ev.querySelectorAll('[data-e]').forEach(function (inp) { inp.addEventListener('input', function () { c.empty[inp.getAttribute('data-e')] = inp.value; lazySave(); }); });
              area.appendChild(ev);
            } else {
              if (!Array.isArray(c.books)) c.books = [];
              var lbl = document.createElement('div'); lbl.className = 'sub-h'; lbl.style.marginTop = '4px'; lbl.textContent = 'Bøker'; area.appendChild(lbl);
              var booksHost = document.createElement('div'); area.appendChild(booksHost);
              function renderBooks() {
                booksHost.innerHTML = '';
                c.books.forEach(function (bk, j) {
                  var br = document.createElement('div'); br.className = 'frow str-row';
                  br.innerHTML = '<div class="fg"><input type="text" data-b="title" value="' + esc(bk.title) + '" placeholder="Tittel"></div>'
                    + '<div class="fg"><input type="text" data-b="author" value="' + esc(bk.author) + '" placeholder="Forfatter"></div>'
                    + '<div class="fg"><input type="text" data-b="detail" value="' + esc(bk.detail || '') + '" placeholder="Detalj (valgfri)"></div>'
                    + '<div class="str-ctrls"><button class="btn-mini x" type="button" title="Fjern bok">✕</button></div>';
                  br.querySelectorAll('[data-b]').forEach(function (inp) { inp.addEventListener('input', function () { bk[inp.getAttribute('data-b')] = inp.value; lazySave(); }); });
                  br.querySelector('.x').addEventListener('click', function () { c.books.splice(j, 1); renderBooks(); lazySave(); });
                  booksHost.appendChild(br);
                });
              }
              renderBooks();
              var add = document.createElement('button'); add.className = 'btn-add'; add.type = 'button'; add.textContent = '+ Ny bok';
              add.addEventListener('click', function () { c.books.push({ title: '', author: '', detail: '' }); renderBooks(); lazySave(); });
              area.appendChild(add);
            }
          }
          row.querySelectorAll('input[name="pmode' + i + '"]').forEach(function (rb) {
            rb.addEventListener('change', function () { if (this.checked) { c._mode = this.value; renderArea(); lazySave(); } });
          });
          renderArea();
          hostEl.appendChild(row);
        });
      }

      function cardWithSubList(arrRef, prefix, rerender, opts) {
        // opts.fields: function(c) -> top fields HTML; opts.sub: {key, label, placeholder}
        var hostEl = q(opts.hostId); hostEl.innerHTML = '';
        arrRef().forEach(function (c, i) {
          if (!Array.isArray(c[opts.sub.key])) c[opts.sub.key] = [];
          var row = document.createElement('div');
          row.className = 'lrow'; row.setAttribute('data-id', prefix + i);
          row.innerHTML =
            '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<div class="lrow-fields">' + opts.fields(c)
              + '<div class="sub-h" style="margin-top:6px">' + opts.sub.label + '</div><div class="sub-host"></div>'
              + '<button class="btn-add" type="button" data-addsub>+ ' + opts.sub.add + '</button>'
            + '</div>'
            + ctrls();
          row.querySelectorAll('[data-k]').forEach(function (inp) { inp.addEventListener('input', function () { c[inp.getAttribute('data-k')] = inp.value; lazySave(); }); });
          row.querySelector('.up').addEventListener('click', function () { moveArr(arrRef(), i, -1); rerender(); lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(arrRef(), i, 1); rerender(); lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(arrRef(), i, '«' + (c.title || 'Kort') + '» fjernet', rerender, lazySave); });
          var subHost = row.querySelector('.sub-host');
          strList(subHost, c[opts.sub.key], opts.sub.placeholder);
          row.querySelector('[data-addsub]').addEventListener('click', function () { c[opts.sub.key].push(''); strList(subHost, c[opts.sub.key], opts.sub.placeholder); lazySave(); });
          hostEl.appendChild(row);
        });
      }

      function renderTracks() {
        cardWithSubList(function () { return data.tracks; }, 'track', renderTracks, {
          hostId: 'lst-tracks', sub: { key: 'points', label: 'Punkter', add: 'Nytt punkt', placeholder: 'f.eks. Filosofihistorie (FI1001)' },
          fields: function (c) {
            return '<div class="frow"><div class="fg narrow"><label>Symbol</label><input type="text" data-k="glyph" value="' + esc(c.glyph) + '"></div>'
              + '<div class="fg narrow"><label>Merkelapp</label><input type="text" data-k="level" value="' + esc(c.level) + '"></div>'
              + '<div class="fg"><label>Tittel</label><input type="text" data-k="title" value="' + esc(c.title) + '"></div></div>'
              + '<div class="fg"><label>Tekst</label><textarea data-k="body">' + esc(c.body) + '</textarea></div>';
          }
        });
      }
      function renderPrograms() {
        cardWithSubList(function () { return data.programs; }, 'program', renderPrograms, {
          hostId: 'lst-programs', sub: { key: 'chips', label: 'Smakebiter fra pensum', add: 'Ny smakebit', placeholder: 'f.eks. Examen philosophicum' },
          fields: function (c) {
            return '<div class="frow"><div class="fg narrow"><label>Nummer</label><input type="text" data-k="num" value="' + esc(c.num) + '"></div>'
              + '<div class="fg narrow"><label>Merkelapp</label><input type="text" data-k="level" value="' + esc(c.level) + '"></div>'
              + '<div class="fg"><label>Studiepoeng / lengde</label><input type="text" data-k="sp" value="' + esc(c.sp) + '"></div></div>'
              + '<div class="fg"><label>Tittel</label><input type="text" data-k="title" value="' + esc(c.title) + '"></div>'
              + '<div class="fg"><label>Beskrivelse</label><textarea data-k="desc">' + esc(c.desc) + '</textarea></div>';
          }
        });
      }

      host.querySelector('[data-addmeta]').addEventListener('click', function () { data.subhero.meta.push(''); renderMeta(); lazySave(); });
      host.querySelector('[data-addcourse]').addEventListener('click', function () { data.courses.push({ level: (data.sections[0] || {}).id || 'felles', code: '', name: '', semester: '', desc: '', ntnuHref: '', books: [], _mode: 'books' }); renderCourses(); lazySave(); });
      host.querySelector('[data-addtrack]').addEventListener('click', function () { data.tracks.push({ glyph: '', level: 'Studieretning', title: '', body: '', points: [] }); renderTracks(); lazySave(); });
      host.querySelector('[data-addprogram]').addEventListener('click', function () { data.programs.push({ num: '', level: '', sp: '', title: '', desc: '', chips: [] }); renderPrograms(); lazySave(); });

      function wireDrag(hostId, arrRef, rerender) {
        AC.enableDragSort(q(hostId), {
          itemSelector: '.lrow', handleSelector: '.drag-handle',
          onReorder: function (ids) {
            var a = arrRef();
            var order = ids.map(function (id) { return parseInt(id.replace(/^\D+/, ''), 10); });
            var next = order.map(function (idx) { return a[idx]; });
            a.length = 0; Array.prototype.push.apply(a, next);
            rerender(); lazySave();
          }
        });
      }
      function renderAll() { renderFields(); renderMeta(); renderSections(); renderCourses(); renderTracks(); renderPrograms(); }

      function exportFile() {
        var out = clone(data);
        (out.courses || []).forEach(function (c) {
          var m = c._mode || (c.empty && !(Array.isArray(c.books) && c.books.length) ? 'empty' : 'books');
          if (m === 'empty') { delete c.books; } else { delete c.empty; }
          delete c._mode;
          if (Array.isArray(c.books)) c.books = c.books.filter(function (b) { return (b.title && b.title.trim()) || (b.author && b.author.trim()); });
          if (!c.note) delete c.note;
          if (!c.ntnuLabel) delete c.ntnuLabel;
        });
        out.subhero.meta = (out.subhero.meta || []).filter(function (m) { return m && m.trim(); });
        (out.tracks || []).forEach(function (t) { t.points = (t.points || []).filter(function (p) { return p && p.trim(); }); });
        (out.programs || []).forEach(function (p) { p.chips = (p.chips || []).filter(function (ch) { return ch && ch.trim(); }); });
        var content =
          '/* Innhold for Pensum-siden (pensum.html) — TEKST-delene.\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Rediger direkte her, eller åpne Admin-senteret → Pensum.\n'
          + '   Format: **fet** og [tekst](adresse). Søk/filter ligger i pensum.html.\n'
          + '*/\n\n'
          + 'window.PENSUM_CONTENT = ' + JSON.stringify(out, null, 2) + ';\n';
        AC.downloadBlob('pensum-content.js', content);
        AC.toast('Fil lastet ned — erstatt i GitHub og push!');
      }

      q('reset-btn').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); data = fresh(); renderAll(); AC.toast('Tilbakestilt til publisert versjon'); pushPreview();
      });

      var pvFrame = q('pv-board');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-pensum-preview', content: data }, '*'); } catch (e) {} }
      function onPreviewMsg(e) { if (e.data && e.data.type === 'apeiron-pensum-preview-ready') { pushPreview(); fitPreview(); } }
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
      wireDrag('lst-courses', function () { return data.courses; }, renderCourses);
      wireDrag('lst-tracks', function () { return data.tracks; }, renderTracks);
      wireDrag('lst-programs', function () { return data.programs; }, renderPrograms);
      fitPreview(); setTimeout(fitPreview, 80);
      pushPreview(); setTimeout(pushPreview, 150);

      return {
        export: exportFile,
        destroy: function () { window.removeEventListener('message', onPreviewMsg); window.removeEventListener('resize', fitPreview); }
      };
    }
  });
})();
