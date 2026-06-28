/* ============================================================
   admin-modules/om-oss.js — «Om oss»-bygger (Page Builder)
   ------------------------------------------------------------
   PAGE-native: redigerer window.OM_PAGE (om.page.js) — en ordnet
   liste av typede seksjoner { id, type, tone, enabled, props }.

   To deler:
     1) SEKSJONSBYGGER (øverst): dra for å sortere, tone-velger per
        seksjon (Auto/Lys/Mørk/Aksent) med rytme-vakt, «+ Ny seksjon»
        og slett. Topp-banneret er pinnet (kan ikke slettes).
     2) INNHOLD (under): ett panel per seksjon, felter etter type.

   PRESIS LIVE-PREVIEW — tre meldingstyper, så previewen ikke bygges
   om unødig (var årsaken til flimmer/bilde-relasting):
     fargebytte      → apeiron-page-tone     (kun data-tone)
     tekstredigering → apeiron-section-update (kun den ene seksjonen)
     struktur        → apeiron-page-preview   (full tegning)
   Eksporterer om.page.js.
   ============================================================ */
(function () {
  'use strict';

  var TONES = [
    { v: 'auto', l: 'Auto' },
    { v: 'paper', l: 'Lys' },
    { v: 'navy', l: 'Mørk' },
    { v: 'accent', l: 'Aksent' }
  ];
  var TYPE_ICON = { banner: '▤', about: '¶', cardgrid: '▦', lesesal: '▥', join: '★', faq: '?' };

  AdminPanels.define('om-oss', {
    title: 'Om oss',
    see: { href: 'om-oss.html', label: 'Se Om oss ↗' },
    exportName: 'om.page.js',

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live fra den ekte «Om oss»-siden. Bygg siden med <b>seksjoner</b>: dra for å endre rekkefølge, velg <b>tone</b> (farge) per seksjon, legg til eller fjern. Innholdet redigeres i panelene under.</p>'
          + '<div class="pv-board-wrap"><iframe id="pv-board" src="om-oss.html?preview=1" title="Forhåndsvisning av Om oss"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du Om oss</strong>'
          + '<ol>'
            + '<li>Bygg og rediger nedenfor. Endringer vises live i forhåndsvisningen</li>'
            + '<li>Trykk <b>☁ Publiser til GitHub</b> oppe til høyre</li>'
            + '<li><em>(Reserve hvis publisering svikter: «↓ Last ned alle endrede» nederst i Oversikt-fanen, og legg fila i GitHub.)</em></li>'
            + '<li>Cloudflare oppdaterer nettsiden automatisk innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren din. Lesesalen-bildene ligger som filer i <code>assets/lesesalen/</code>; medlemspriser i Medlemskap-panelet.</div>'
        + '</div>'
        + '<div class="panel"><h2>Seksjoner <small>dra, velg tone, legg til eller fjern</small></h2>'
          + '<div class="panel-body">'
            + '<p class="hint">Tonen styrer bakgrunnen. <b>Auto</b> veksler lys/mørk automatisk så rytmen aldri brekker; velg en fast tone for å bestemme selv. Topp-banneret ligger alltid øverst.</p>'
            + '<div class="builder" id="lst-sections"></div>'
            + '<div id="picker-host"></div>'
          + '</div>'
        + '</div>'
        + '<div id="sec-editors"></div>';

      var LS_KEY = 'apeiron-om-page-v1';
      var data = {};
      var openPicker = false;

      function clone(o) { return JSON.parse(JSON.stringify(o)); }
      function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
      function freshPage() { return clone(window.OM_PAGE || { meta: {}, sections: [] }); }

      function normalize() {
        if (!data || typeof data !== 'object') data = freshPage();
        if (!data.meta) data.meta = { title: 'Om oss', slug: 'om-oss' };
        if (!Array.isArray(data.sections)) data.sections = [];
        data.sections.forEach(function (s) {
          if (!s.id) s.id = newId(s.type || 'sek');
          if (!s.type) s.type = 'about';
          if (!s.tone) s.tone = 'auto';
          if (!s.props || typeof s.props !== 'object') s.props = SectionTypes.defaults(s.type);
        });
      }
      function newId(type) {
        var base = (type || 'sek').replace(/[^a-z0-9]/gi, '').slice(0, 8) || 'sek';
        var id, n = 0;
        do { id = base + (n ? '-' + n : '-' + Math.random().toString(36).slice(2, 5)); n++; }
        while (data.sections && data.sections.some(function (s) { return s.id === id; }));
        return id;
      }

      function loadData() {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) { try { data = JSON.parse(raw); normalize(); return; } catch (_) {} }
        data = freshPage(); normalize();
      }

      /* ── Persistering + presise preview-dytt ──────────────── */
      var saveTimer = null;
      function persist() { clearTimeout(saveTimer); saveTimer = setTimeout(function () { localStorage.setItem(LS_KEY, JSON.stringify(data)); AC.toast('Lagret i nettleseren'); }, 350); }
      var pvFrame;
      function post(msg) { if (pvFrame && pvFrame.contentWindow) { try { pvFrame.contentWindow.postMessage(msg, '*'); } catch (e) {} } }
      function pushFull() { post({ type: 'apeiron-page-preview', page: data }); }
      function pushTone() { post({ type: 'apeiron-page-tone', page: data }); }
      function pushSection(id) { post({ type: 'apeiron-section-update', page: data, id: id }); }

      /* ── Tone-utregning (speiler section-engine) for rytme-vakt ── */
      function resolveTones() {
        var prev = null;
        return data.sections.map(function (s) {
          var t = s.tone || 'auto';
          if (t === 'auto') t = (prev === 'paper') ? 'navy' : 'paper';
          prev = t;
          return t;
        });
      }
      function toneName(t) { return t === 'navy' ? 'mørk' : t === 'accent' ? 'aksent' : 'lys'; }
      function secLabel(s) {
        var p = s.props || {};
        return p.title || p.heading || p.eyebrow || (SectionTypes.get(s.type) || {}).label || s.type;
      }

      /* ════════ SEKSJONSBYGGER ════════ */
      function renderBuilder() {
        var hostEl = document.getElementById('lst-sections'); if (!hostEl) return;
        hostEl.innerHTML = '';
        var resolved = resolveTones();
        data.sections.forEach(function (s, i) {
          var row = document.createElement('div');
          row.className = 'brow' + (s.enabled === false ? ' is-off' : '') + (s.pinned ? ' is-pinned' : '');
          row.setAttribute('data-id', s.id);
          var seg = TONES.map(function (t) {
            return '<button type="button" data-tone="' + t.v + '"' + (s.tone === t.v ? ' class="on"' : '') + '>' + t.l + '</button>';
          }).join('');
          row.innerHTML =
            '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<span class="brow__ico">' + (TYPE_ICON[s.type] || '▭') + '</span>'
            + '<span class="brow__name"><b>' + esc(secLabel(s)) + '</b><span>#' + esc(s.id) + ' · ' + esc(s.type) + '</span></span>'
            + '<span class="seg">' + seg + '</span>'
            + '<span class="brow__act">'
              + '<button class="iconbtn" data-act="edit" title="Rediger innhold">✎</button>'
              + (s.pinned ? '' : '<button class="iconbtn danger" data-act="del" title="Fjern seksjon">✕</button>')
            + '</span>';
          row.querySelectorAll('.seg button').forEach(function (b) {
            b.addEventListener('click', function () {
              s.tone = b.getAttribute('data-tone');
              renderBuilder();        // oppdater knapper + rytme-vakt
              pushTone(); persist();  // PRESIS: bare data-tone i preview
            });
          });
          row.querySelector('[data-act="edit"]').addEventListener('click', function () { scrollToEditor(s.id); });
          var del = row.querySelector('[data-act="del"]');
          if (del) del.addEventListener('click', function () {
            AC.undoDelete(data.sections, i, 'Seksjon «' + secLabel(s) + '» fjernet', function () { renderBuilder(); renderEditors(); }, function () { pushFull(); persist(); });
          });
          hostEl.appendChild(row);

          if (i > 0 && resolved[i] === resolved[i - 1] && (s.tone !== 'auto' || data.sections[i - 1].tone !== 'auto')) {
            var warn = document.createElement('div');
            warn.className = 'brow__warn';
            warn.textContent = 'Samme tone (' + toneName(resolved[i]) + ') som seksjonen over. Vil du bytte for litt kontrast?';
            hostEl.appendChild(warn);
          }
        });

        var add = document.createElement('button');
        add.className = 'addbar'; add.type = 'button'; add.textContent = '+ Ny seksjon';
        add.addEventListener('click', function () { openPicker = !openPicker; renderPicker(); });
        hostEl.appendChild(add);
      }

      function renderPicker() {
        var ph = document.getElementById('picker-host'); if (!ph) return;
        if (!openPicker) { ph.innerHTML = ''; return; }
        var tiles = SectionTypes.list().filter(function (t) { return t.type !== 'banner'; }).map(function (t) {
          return '<button class="ptile" type="button" data-type="' + t.type + '">'
            + '<span class="ptile__ico">' + (TYPE_ICON[t.type] || '▭') + '</span>'
            + '<b>' + esc(t.label) + '</b><span>' + esc(t.desc || '') + '</span></button>';
        }).join('');
        ph.innerHTML = '<div class="picker"><div class="picker__h">+ Ny seksjon</div>'
          + '<div class="picker__sub">Velg en blokktype. Den legges nederst med standardinnhold du kan redigere.</div>'
          + '<div class="picker__grid">' + tiles + '</div></div>';
        ph.querySelectorAll('.ptile').forEach(function (b) {
          b.addEventListener('click', function () {
            var type = b.getAttribute('data-type');
            var s = { id: newId(type), type: type, tone: 'auto', enabled: true, props: SectionTypes.defaults(type) };
            data.sections.push(s);
            openPicker = false;
            renderBuilder(); renderPicker(); renderEditors();
            pushFull(); persist();
            regUndoAdd('Seksjon lagt til', function () { var i = data.sections.indexOf(s); if (i > -1) data.sections.splice(i, 1); renderBuilder(); renderPicker(); renderEditors(); pushFull(); persist(); });
            setTimeout(function () { scrollToEditor(s.id); }, 30);
          });
        });
      }

      function scrollToEditor(id) {
        var panel = document.getElementById('sec-ed-' + id);
        var scroller = host.closest('.panel-host') || host.parentElement;
        if (panel && scroller) {
          var top = panel.offsetTop - 12;
          try { scroller.scrollTo({ top: top, behavior: 'smooth' }); } catch (e) { scroller.scrollTop = top; }
          panel.classList.add('flash');
          setTimeout(function () { panel.classList.remove('flash'); }, 900);
        }
      }

      /* ════════ INNHOLDS-EDITORER (ett panel per seksjon) ════════ */
      function renderEditors() {
        var wrap = document.getElementById('sec-editors'); if (!wrap) return;
        wrap.innerHTML = '';
        data.sections.forEach(function (s) {
          var panel = document.createElement('div');
          panel.className = 'panel'; panel.id = 'sec-ed-' + s.id;
          var label = SectionTypes.get(s.type) ? SectionTypes.get(s.type).label : s.type;
          panel.innerHTML = '<h2>' + esc(secLabel(s)) + ' <small>' + esc(label) + '</small></h2><div class="panel-body"></div>';
          var body = panel.querySelector('.panel-body');
          var fn = EDITORS[s.type];
          // notify: presis preview-oppdatering av KUN denne seksjonen
          var notify = function () { updateBuilderLabels(); pushSection(s.id); persist(); };
          if (fn) fn(s, body, notify); else body.innerHTML = '<p class="hint">Ingen redigering for type «' + esc(s.type) + '» ennå.</p>';
          wrap.appendChild(panel);
        });
        if (typeof shell !== 'undefined' && shell && shell.isActive()) shell.refresh();
      }
      function updateBuilderLabels() {
        data.sections.forEach(function (s) {
          var b = document.querySelector('#lst-sections .brow[data-id="' + s.id + '"] .brow__name b');
          if (b) b.textContent = secLabel(s);
          var h = document.querySelector('#sec-ed-' + s.id + ' > h2');
          if (h && h.firstChild) h.firstChild.textContent = secLabel(s) + ' ';
        });
      }

      /* ── felles list-rad-verktøy ── */
      function moveArr(arr, i, dir) { var j = i + dir; if (j < 0 || j >= arr.length) return; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
      function listRow(fieldsHTML) {
        var row = document.createElement('div'); row.className = 'lrow';
        row.innerHTML = '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
          + '<div class="lrow-fields">' + fieldsHTML + '</div>'
          + '<div class="lrow-ctrls"><button class="btn-mini up" type="button" title="Opp">↑</button><button class="btn-mini dn" type="button" title="Ned">↓</button><button class="btn-mini x" type="button" title="Slett">✕</button></div>';
        return row;
      }
      function wireCtrls(row, arr, i, rerender, label, notify) {
        row.querySelector('.up').addEventListener('click', function () { moveArr(arr, i, -1); rerender(); notify(); });
        row.querySelector('.dn').addEventListener('click', function () { moveArr(arr, i, 1); rerender(); notify(); });
        row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(arr, i, label + ' fjernet', rerender, notify); });
      }
      function field(label, obj, key, opts, notify) {
        opts = opts || {};
        var wrap = document.createElement('div'); wrap.className = 'fg' + (opts.narrow ? ' narrow' : '');
        var ctl = opts.area ? document.createElement('textarea') : document.createElement('input');
        if (!opts.area) ctl.type = 'text';
        if (opts.ph) ctl.setAttribute('placeholder', opts.ph);
        ctl.value = obj[key] == null ? '' : obj[key];
        ctl.addEventListener('input', function () { obj[key] = ctl.value; if (notify) notify(); });
        wrap.innerHTML = '<label>' + esc(label) + '</label>';
        wrap.appendChild(ctl);
        return wrap;
      }
      function subH(t) { var d = document.createElement('div'); d.className = 'sub-h'; d.textContent = t; return d; }
      function addBtn(label, onClick) { var b = document.createElement('button'); b.className = 'btn-add'; b.type = 'button'; b.textContent = label; b.addEventListener('click', onClick); return b; }
      function regUndoAdd(label, undoFn) { if (AC.undoable) AC.undoable(label, function () { try { undoFn(); } catch (_) {} if (typeof shell !== 'undefined' && shell && shell.isActive()) shell.refresh(); }); }
      function frow(children) { var d = document.createElement('div'); d.className = 'frow'; children.forEach(function (c) { d.appendChild(c); }); return d; }

      function dragList(listEl, arr, rer, notify) {
        AC.enableDragSort(listEl, {
          itemSelector: '.lrow', handleSelector: '.drag-handle',
          onReorder: function () {
            var rows = [].slice.call(listEl.querySelectorAll('.lrow'));
            var next = rows.map(function (r) { return arr[parseInt(r.getAttribute('data-idx'), 10)]; });
            arr.length = 0; Array.prototype.push.apply(arr, next); rer(); notify();
          }
        });
      }

      // liste av tekstlinjer (strenger)
      function stringList(body, arr, label, ph, notify) {
        var listEl = document.createElement('div'); listEl.className = 'lst';
        function rer() {
          listEl.innerHTML = '';
          arr.forEach(function (txt, i) {
            var row = listRow('<div class="fg"><input type="text" value="' + esc(txt) + '" placeholder="' + esc(ph || '') + '"></div>');
            row.setAttribute('data-idx', i);
            row.querySelector('input').addEventListener('input', function () { arr[i] = this.value; notify(); });
            wireCtrls(row, arr, i, rer, label, notify);
            listEl.appendChild(row);
          });
        }
        rer();
        body.appendChild(listEl);
        body.appendChild(addBtn('+ ' + label, function () { arr.push(''); var _i = arr.length - 1; rer(); notify(); regUndoAdd('Punkt lagt til', function () { if (_i < arr.length) arr.splice(_i, 1); rer(); notify(); }); }));
        dragList(listEl, arr, rer, notify);
      }

      // liste av objekter med egendefinert felt-bygger
      function objList(body, arr, label, buildFields, makeNew, notify) {
        var listEl = document.createElement('div'); listEl.className = 'lst';
        function rer() {
          listEl.innerHTML = '';
          arr.forEach(function (item, i) {
            var row = listRow('');
            row.setAttribute('data-idx', i);
            row.querySelector('.lrow-fields').appendChild(buildFields(item, i));
            wireCtrls(row, arr, i, rer, label, notify);
            listEl.appendChild(row);
          });
        }
        rer();
        body.appendChild(listEl);
        body.appendChild(addBtn('+ ' + label, function () { var _o = makeNew(); arr.push(_o); rer(); notify(); regUndoAdd('Blokk lagt til', function () { var i = arr.indexOf(_o); if (i > -1) arr.splice(i, 1); rer(); notify(); }); }));
        dragList(listEl, arr, rer, notify);
      }

      // kort med nøstede lenker (allies / mot-styret)
      function cardList(body, arr, notify) {
        var listEl = document.createElement('div'); listEl.className = 'lst';
        function rer() {
          listEl.innerHTML = '';
          arr.forEach(function (c, i) {
            if (!Array.isArray(c.links)) c.links = [];
            var row = listRow(
              '<div class="frow"><div class="fg narrow"><label>Symbol</label><input data-k="glyph" value="' + esc(c.glyph) + '"></div>'
              + '<div class="fg narrow"><label>Merkelapp</label><input data-k="level" value="' + esc(c.level) + '"></div>'
              + '<div class="fg"><label>Tittel</label><input data-k="title" value="' + esc(c.title) + '"></div></div>'
              + '<div class="fg"><label>Tekst</label><textarea data-k="body">' + esc(c.body) + '</textarea></div>'
              + '<div class="sub-h" style="margin-top:6px">Lenker</div><div class="card-links"></div>'
              + '<button class="btn-add" type="button" data-addlink>+ Ny lenke</button>'
            );
            row.setAttribute('data-idx', i);
            row.querySelectorAll('[data-k]').forEach(function (inp) { inp.addEventListener('input', function () { c[inp.getAttribute('data-k')] = inp.value; notify(); }); });
            wireCtrls(row, arr, i, rer, 'Kort', notify);
            var linksHost = row.querySelector('.card-links');
            function renderLinks() {
              linksHost.innerHTML = '';
              c.links.forEach(function (l, j) {
                var lr = document.createElement('div'); lr.className = 'frow link-row';
                lr.innerHTML = '<div class="fg"><input data-lk="label" value="' + esc(l.label) + '" placeholder="Instagram"></div>'
                  + '<div class="fg"><input data-lk="href" value="' + esc(l.href) + '" placeholder="https://…"></div>'
                  + '<button class="btn-mini x" type="button" title="Fjern lenke">✕</button>';
                lr.querySelectorAll('[data-lk]').forEach(function (inp) { inp.addEventListener('input', function () { l[inp.getAttribute('data-lk')] = inp.value; notify(); }); });
                lr.querySelector('.x').addEventListener('click', function () { c.links.splice(j, 1); renderLinks(); notify(); });
                linksHost.appendChild(lr);
              });
            }
            renderLinks();
            row.querySelector('[data-addlink]').addEventListener('click', function () { c.links.push({ label: '', href: '' }); renderLinks(); notify(); });
            listEl.appendChild(row);
          });
        }
        rer();
        body.appendChild(listEl);
        body.appendChild(addBtn('+ Nytt kort', function () { var _c = { glyph: '', level: '', title: '', body: '', links: [] }; arr.push(_c); rer(); notify(); regUndoAdd('Kort lagt til', function () { var i = arr.indexOf(_c); if (i > -1) arr.splice(i, 1); rer(); notify(); }); }));
        dragList(listEl, arr, rer, notify);
      }

      /* ── per-type editorer ── */
      var EDITORS = {
        banner: function (s, body, notify) {
          var p = s.props;
          body.appendChild(field('Tilbake-lenke (tekst)', p, 'back', {}, notify));
          body.appendChild(field('Tilbake-lenke (URL)', p, 'backHref', { ph: 'index.html' }, notify));
          body.appendChild(field('Tittel', p, 'title', {}, notify));
          body.appendChild(field('Ingress', p, 'lede', { area: true }, notify));
        },
        about: function (s, body, notify) {
          var p = s.props;
          if (!Array.isArray(p.paras)) p.paras = [];
          if (!p.card) p.card = { title: '', body: '' };
          if (!p.teaser) p.teaser = { eyebrow: '', title: '', body: '', linkLabel: '', linkHref: '' };
          if (!Array.isArray(p.stats)) p.stats = [];
          body.appendChild(frow([field('Eyebrow', p, 'eyebrow', { narrow: true }, notify), field('Gresk ord', p, 'greek', { narrow: true }, notify), field('Uttale / undertekst', p, 'greekSmall', {}, notify)]));
          body.appendChild(subH('Avsnitt'));
          stringList(body, p.paras, 'Avsnitt', 'Avsnittstekst…', notify);
          body.appendChild(subH('Timeglass-kort'));
          body.appendChild(field('Tittel', p.card, 'title', {}, notify));
          body.appendChild(field('Tekst', p.card, 'body', { area: true }, notify));
          body.appendChild(subH('Samarbeids-teaser'));
          body.appendChild(frow([field('Eyebrow', p.teaser, 'eyebrow', { narrow: true }, notify), field('Tittel', p.teaser, 'title', {}, notify)]));
          body.appendChild(field('Tekst', p.teaser, 'body', { area: true }, notify));
          body.appendChild(frow([field('Lenketekst', p.teaser, 'linkLabel', {}, notify), field('Lenke', p.teaser, 'linkHref', { narrow: true, ph: '#samarbeid' }, notify)]));
          body.appendChild(subH('Nøkkeltall'));
          objList(body, p.stats, 'Tall', function (st) {
            return frow([field('Tall', st, 'num', { narrow: true }, notify), field('Etikett', st, 'lbl', {}, notify)]);
          }, function () { return { num: '', lbl: '' }; }, notify);
        },
        cardgrid: function (s, body, notify) {
          var p = s.props;
          if (!Array.isArray(p.cards)) p.cards = [];
          body.appendChild(frow([field('Eyebrow', p, 'eyebrow', { narrow: true }, notify), field('Overskrift', p, 'heading', {}, notify)]));
          body.appendChild(field('Ingress', p, 'lede', { area: true }, notify));
          body.appendChild(subH('Kort'));
          cardList(body, p.cards, notify);
        },
        lesesal: function (s, body, notify) {
          var p = s.props;
          if (!Array.isArray(p.features)) p.features = [];
          body.appendChild(frow([field('Eyebrow', p, 'eyebrow', { narrow: true }, notify), field('Overskrift', p, 'heading', {}, notify)]));
          body.appendChild(field('Ingress', p, 'lede', { area: true }, notify));
          body.appendChild(field('Hovedbilde (URL)', p, 'mainImage', { ph: 'assets/lesesalen/lesesal1.jpg' }, notify));
          body.appendChild(subH('Punkter (ikonet følger rekkefølgen)'));
          objList(body, p.features, 'Punkt', function (f) {
            var d = document.createElement('div');
            d.appendChild(field('Tittel', f, 'title', {}, notify));
            d.appendChild(field('Tekst', f, 'body', { area: true }, notify));
            return d;
          }, function () { return { title: '', body: '' }; }, notify);
        },
        join: function (s, body, notify) {
          var p = s.props;
          if (!Array.isArray(p.benefits)) p.benefits = [];
          body.appendChild(field('Eyebrow', p, 'eyebrow', {}, notify));
          body.appendChild(field('Overskrift', p, 'heading', {}, notify));
          body.appendChild(field('Ingress', p, 'lede', { area: true }, notify));
          body.appendChild(subH('Fordeler'));
          stringList(body, p.benefits, 'Fordel', 'En fordel…', notify);
          body.appendChild(subH('Kort'));
          body.appendChild(frow([field('Kort-tittel', p, 'cardTitle', {}, notify), field('Knappetekst', p, 'ctaLabel', {}, notify)]));
          body.appendChild(field('Knappe-lenke', p, 'ctaHref', { ph: 'index.html#kontakt' }, notify));
          var note = document.createElement('p'); note.className = 'hint';
          note.textContent = 'Priser og innmeldingssteg styres i Medlemskap-panelet.';
          body.appendChild(note);
        },
        faq: function (s, body, notify) {
          var p = s.props;
          if (!Array.isArray(p.items)) p.items = [];
          body.appendChild(frow([field('Eyebrow', p, 'eyebrow', { narrow: true }, notify), field('Overskrift', p, 'heading', {}, notify)]));
          body.appendChild(subH('Spørsmål & svar'));
          objList(body, p.items, 'Spørsmål', function (it) {
            var d = document.createElement('div');
            d.appendChild(field('Spørsmål', it, 'q', {}, notify));
            d.appendChild(field('Svar', it, 'a', { area: true }, notify));
            return d;
          }, function () { return { q: '', a: '' }; }, notify);
        }
      };

      /* ════════ EKSPORT ════════ */
      function exportFile() {
        var out = clone(data);
        out.sections.forEach(function (s) {
          var p = s.props || {};
          if (Array.isArray(p.paras)) p.paras = p.paras.filter(function (x) { return x && x.trim(); });
          if (Array.isArray(p.benefits)) p.benefits = p.benefits.filter(function (x) { return x && x.trim(); });
          if (Array.isArray(p.stats)) p.stats = p.stats.filter(function (x) { return (x.num && x.num.trim()) || (x.lbl && x.lbl.trim()); });
          if (Array.isArray(p.features)) p.features = p.features.filter(function (x) { return (x.title && x.title.trim()) || (x.body && x.body.trim()); });
          if (Array.isArray(p.items)) p.items = p.items.filter(function (x) { return (x.q && x.q.trim()) || (x.a && x.a.trim()); });
          if (Array.isArray(p.cards)) {
            p.cards = p.cards.filter(function (c) { return (c.title && c.title.trim()) || (c.body && c.body.trim()); });
            p.cards.forEach(function (c) { if (Array.isArray(c.links)) c.links = c.links.filter(function (l) { return (l.label && l.label.trim()) || (l.href && l.href.trim()); }); });
          }
        });
        var content =
          '/* «Om oss» som DATA — Apeiron Page Builder (om.page.js)\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Hver seksjon: { id, type, tone, enabled?, props }. Motoren (section-engine.js)\n'
          + '   tegner lista; typene bor i om-sections.js. Rediger i Admin → Om oss.\n'
          + '   Bilder: assets/lesesalen/ · medlemspriser: membership-config.js\n'
          + '*/\n\n'
          + 'window.OM_PAGE = ' + JSON.stringify(out, null, 2) + ';\n';
        AC.downloadBlob('om.page.js', content);
        AC.toast('Fil lastet ned. Erstatt om.page.js i GitHub og push!');
      }

      /* ════════ PREVIEW-RAMME (skalering) ════════ */
      pvFrame = document.getElementById('pv-board');
      function onPreviewMsg(e) {
        if (e.data && e.data.type === 'apeiron-om-preview-ready') { pushFull(); fitPreview(); }
      }
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

      function wireSectionDrag() {
        AC.enableDragSort(document.getElementById('lst-sections'), {
          itemSelector: '.brow', handleSelector: '.drag-handle',
          onReorder: function (ids) {
            ids = ids.filter(function (id) { return id; });
            data.sections.sort(function (a, b) { return ids.indexOf(a.id) - ids.indexOf(b.id); });
            renderBuilder(); renderEditors(); pushFull(); persist();
          }
        });
      }

      document.getElementById('reset-btn').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); data = freshPage(); normalize();
        renderBuilder(); renderPicker(); renderEditors(); AC.toast('Tilbakestilt til publisert versjon'); pushFull();
      });

      loadData();
      renderBuilder(); renderPicker(); renderEditors(); wireSectionDrag();
      fitPreview(); setTimeout(fitPreview, 80);
      pushFull(); setTimeout(pushFull, 150);

      /* ── delt «Liste + detalj»-skall (sections: «Seksjoner»-bygger + én rad per
         seksjon; hver seksjons-editor bygges på nytt i detalj-ruten via EDITORS) ── */
      var shell = AC.PanelShell.mount(host, AC, {
        rail: 'sections',
        title: 'Om oss', subtitle: 'Bygg siden',
        remember: 'apeiron-om-oss-shell-sel',
        sections: function () {
          var out = [];
          var bnode = document.getElementById('lst-sections');
          bnode = bnode ? bnode.closest('.panel') : null;
          if (bnode) out.push({ id: '__builder', label: 'Seksjoner', sub: 'Legg til, fjern, omsorter', node: bnode, av: '☰' });
          (data.sections || []).forEach(function (s) {
            var lbl = SectionTypes.get(s.type) ? SectionTypes.get(s.type).label : s.type;
            out.push({ id: s.id, label: secLabel(s), sub: lbl, av: '✎',
              build: function (box) { var p = document.createElement('div'); p.className = 'panel-body'; box.appendChild(p); var fn = EDITORS[s.type]; var notify = function () { updateBuilderLabels(); pushSection(s.id); persist(); }; if (fn) fn(s, p, notify); else p.innerHTML = '<p class="hint">Ingen redigering for type «' + esc(s.type) + '» ennå.</p>'; } });
          });
          return out;
        }
      });
      function applyPanelLayout() { shell.layoutChanged(); }
      window.addEventListener('apeiron-panellayout', applyPanelLayout);
      applyPanelLayout();

      return {
        export: exportFile,
        destroy: function () { window.removeEventListener('message', onPreviewMsg); window.removeEventListener('resize', fitPreview); window.removeEventListener('apeiron-panellayout', applyPanelLayout); if (shell) shell.destroy(); }
      };
    }
  });
})();
