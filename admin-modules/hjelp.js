/* ============================================================
   admin-modules/hjelp.js — Hjelp & ressurser-editor som C-modul
   Erstatter hjelp-admin.html. Krever palette.js (createColorControl) og
   hjelp-content.js (HJELP_CONTENT), som skallet (admin.html) laster.
   Bygger på den opprinnelige, velprøvde editor-logikken; eneste endringer:
   ingen egen innlogging/eksportknapp (skallet eier dem), og en destroy() som
   fjerner globale lyttere når man bytter panel.
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('hjelp', {
    title: 'Hjelp',
    see: { href: 'hjelp.html', label: 'Se Hjelp-siden ↗' },
    exportName: 'hjelp-content.js',

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live fra den ekte Hjelp-siden — bla i ruta for å se hele siden. Endringene dine vises umiddelbart.</p>'
          + '<div class="pv-page-wrap"><iframe id="pv-page" src="hjelp.html?preview=1" title="Forhåndsvisning av Hjelp-siden"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du Hjelp-siden</strong>'
          + '<ol>'
            + '<li>Rediger innholdet nedenfor — klikk på et felt for å redigere det</li>'
            + '<li>Legg til kort med <b>+ Nytt kort</b>, og punkter eller kontaktlinjer med <b>+ punkt</b> / <b>+ kontaktlinje</b></li>'
            + '<li>I tekstfelt for kontaktlinjer og «Si fra»-kort kan du bruke HTML, f.eks. <code>&lt;strong&gt;...&lt;/strong&gt;</code> eller en lenke</li>'
            + '<li>Trykk <b>☁ Publiser til GitHub</b> oppe til høyre</li>'
            + '<li><em>(Reserve hvis publisering svikter: «↓ Last ned alle endrede» nederst i Oversikt-fanen, og legg fila i GitHub.)</em></li>'
            + '<li>Cloudflare oppdaterer nettsiden automatisk innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren din. Tomme avsnitt i beskrivelser lages med en blank linje mellom dem.</div>'
        + '</div>'
        + '<div class="panel"><div class="panel-title">Topp / hurtignav <small>øverst på siden</small></div>'
          + '<div class="meta-panel">'
            + '<div class="meta-grid"><div class="fg narrow"><label>Tilbake-tekst</label><input type="text" id="hero-back"></div>'
            + '<div class="fg narrow"><label>Tilbake-lenke</label><input type="text" id="hero-backHref"></div></div>'
            + '<div class="meta-grid" style="margin-top:10px"><div class="fg"><label>Overskrift</label><input type="text" id="hero-heading"></div></div>'
            + '<div class="meta-grid" style="margin-top:10px"><div class="fg"><label>Ingress</label><textarea id="hero-lede"></textarea></div></div>'
          + '</div>'
          + '<div class="sec"><div class="sec-head"><h2>Hurtignav-kort</h2><span class="count" id="count-nav"></span><button class="btn-add" type="button" data-add-nav>+ Nytt kort</button></div><div class="list" id="list-nav"></div></div>'
        + '</div>'
        + '<div class="panel"><div class="panel-title">Si fra</div>'
          + '<div class="meta-panel">'
            + '<div class="meta-grid"><div class="fg narrow"><label data-help="Liten etikett som vises over overskriften i seksjonen.">Eyebrow</label><input type="text" id="sifra-eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="sifra-heading"></div></div>'
            + '<div class="meta-grid" style="margin-top:10px"><div class="fg"><label>Ingress</label><textarea id="sifra-lede"></textarea></div></div>'
            + '<h3 style="margin-top:16px">Gull-knapp under kortene</h3>'
            + '<div class="meta-grid"><div class="fg narrow"><label>Knappetekst</label><input type="text" id="sifra-cta-label"></div>'
            + '<div class="fg"><label>Knapp-lenke</label><input type="text" id="sifra-cta-href"></div></div>'
            + '<h3 style="margin-top:16px">«Hvem kan hjelpe deg?»</h3>'
            + '<div class="meta-grid"><div class="fg"><label>Overskrift</label><input type="text" id="sifra-helpersHeading"></div></div>'
            + '<div class="meta-grid" style="margin-top:10px"><div class="fg"><label>Ingress</label><textarea id="sifra-helpersLede"></textarea></div></div>'
          + '</div>'
          + '<div class="sec"><div class="sec-head"><h2>«Si fra»-kort</h2><span class="count" id="count-items"></span><button class="btn-add" type="button" data-add-items>+ Nytt kort</button></div><div class="list" id="list-items"></div></div>'
          + '<div class="sec"><div class="sec-head"><h2>Rådgivere &amp; ombud</h2><span class="count" id="count-sifracards"></span><button class="btn-add" type="button" data-add-cards="sifra">+ Nytt kort</button></div><div class="list" id="list-sifracards"></div></div>'
        + '</div>'
        + '<div class="panel" data-section="studier"><div class="panel-title">Faglig hjelp</div>'
          + '<div class="meta-panel"><div class="meta-grid"><div class="fg narrow"><label data-help="Liten etikett som vises over overskriften i seksjonen.">Eyebrow</label><input type="text" id="studier-eyebrow"></div>'
          + '<div class="fg"><label>Overskrift</label><input type="text" id="studier-heading"></div></div>'
          + '<div class="meta-grid" style="margin-top:10px"><div class="fg"><label>Ingress</label><textarea id="studier-lede"></textarea></div></div></div>'
          + '<div class="sec"><div class="sec-head"><h2>Kort</h2><span class="count" id="count-studiercards"></span><button class="btn-add" type="button" data-add-cards="studier">+ Nytt kort</button></div><div class="list" id="list-studiercards"></div></div>'
        + '</div>'
        + '<div class="panel" data-section="helse"><div class="panel-title">Psykisk helse</div>'
          + '<div class="meta-panel"><div class="meta-grid"><div class="fg narrow"><label data-help="Liten etikett som vises over overskriften i seksjonen.">Eyebrow</label><input type="text" id="helse-eyebrow"></div>'
          + '<div class="fg"><label>Overskrift</label><input type="text" id="helse-heading"></div></div>'
          + '<div class="meta-grid" style="margin-top:10px"><div class="fg"><label>Ingress</label><textarea id="helse-lede"></textarea></div></div></div>'
          + '<div class="sec"><div class="sec-head"><h2>Kort</h2><span class="count" id="count-helsecards"></span><button class="btn-add" type="button" data-add-cards="helse">+ Nytt kort</button></div><div class="list" id="list-helsecards"></div></div>'
        + '</div>'
        + '<div class="panel" data-section="fysisk"><div class="panel-title">Fysisk helse</div>'
          + '<div class="meta-panel"><div class="meta-grid"><div class="fg narrow"><label data-help="Liten etikett som vises over overskriften i seksjonen.">Eyebrow</label><input type="text" id="fysisk-eyebrow"></div>'
          + '<div class="fg"><label>Overskrift</label><input type="text" id="fysisk-heading"></div></div>'
          + '<div class="meta-grid" style="margin-top:10px"><div class="fg"><label>Ingress</label><textarea id="fysisk-lede"></textarea></div></div></div>'
          + '<div class="sec"><div class="sec-head"><h2>Kort</h2><span class="count" id="count-fysiskcards"></span><button class="btn-add" type="button" data-add-cards="fysisk">+ Nytt kort</button></div><div class="list" id="list-fysiskcards"></div></div>'
        + '</div>'
        + '<div class="panel"><div class="panel-title">Akutt hjelp <small>nødnumre</small></div>'
          + '<div class="meta-panel"><div class="meta-grid"><div class="fg narrow"><label data-help="Liten etikett som vises over overskriften i seksjonen.">Eyebrow</label><input type="text" id="akutt-eyebrow"></div>'
          + '<div class="fg"><label>Overskrift</label><input type="text" id="akutt-heading"></div></div>'
          + '<div class="meta-grid" style="margin-top:10px"><div class="fg"><label>Ingress</label><textarea id="akutt-lede"></textarea></div></div></div>'
          + '<div class="sec"><div class="sec-head"><h2>Nødnummer-kort</h2><span class="count" id="count-akutt"></span><button class="btn-add" type="button" data-add-akutt>+ Nytt kort</button></div><div class="list" id="list-akutt"></div></div>'
        + '</div>';

      /* ─── original editor-logikk (uendret bortsett fra auth/eksport/destroy) ─── */
      var LS_KEY = 'apeiron-hjelp-v1';
      var CARD_SECTIONS = ['sifra', 'studier', 'helse', 'fysisk'];

      var data = {};
      function clone(x) { return JSON.parse(JSON.stringify(x == null ? null : x)); }
      function fresh() { return clone(window.HJELP_CONTENT || {}); }

      function normalize() {
        data.hero = data.hero || {}; data.hero.nav = data.hero.nav || [];
        data.sifra = data.sifra || {}; data.sifra.items = data.sifra.items || [];
        data.sifra.cta = data.sifra.cta || { label: '', href: '' };
        data.sifra.cards = data.sifra.cards || [];
        ['studier', 'helse', 'fysisk'].forEach(function (k) { data[k] = data[k] || {}; data[k].cards = data[k].cards || []; });
        data.akutt = data.akutt || {}; data.akutt.cards = data.akutt.cards || [];
        cardLists().forEach(function (arr) {
          arr.forEach(function (c) { if (!Array.isArray(c.resp)) c.resp = []; if (!Array.isArray(c.contacts)) c.contacts = []; });
        });
      }
      function cardLists() { return [data.sifra.cards, data.studier.cards, data.helse.cards, data.fysisk.cards]; }
      function loadData() {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) { try { data = JSON.parse(raw); normalize(); return; } catch (_) {} }
        data = fresh(); normalize();
      }
      function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(data)); showToast('Lagret i nettleseren'); pushPreview(); }
      var saveTimer = null;
      function lazySave() { clearTimeout(saveTimer); saveTimer = setTimeout(saveData, 350); }
      function showToast(msg) { AC.toast(msg); }
      function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

      function renderSubList(host2, arr, label, addLabel, placeholder) {
        host2.innerHTML = '<label>' + label + '</label><div class="subed-rows"></div><button class="btn-subadd" type="button">' + addLabel + '</button>';
        var rows = host2.querySelector('.subed-rows');
        arr.forEach(function (txt, i) {
          var row = document.createElement('div');
          row.className = 'subed-row';
          row.innerHTML =
            '<input type="text" value="' + esc(txt) + '" placeholder="' + placeholder + '">'
            + '<button class="btn-mini up" type="button" title="Opp">↑</button>'
            + '<button class="btn-mini dn" type="button" title="Ned">↓</button>'
            + '<button class="btn-mini x" type="button" title="Fjern">✕</button>';
          row.querySelector('input').addEventListener('input', function () { arr[i] = this.value; lazySave(); });
          row.querySelector('.up').addEventListener('click', function () { if (i > 0) { var t = arr[i]; arr[i] = arr[i - 1]; arr[i - 1] = t; renderSubList(host2, arr, label, addLabel, placeholder); lazySave(); } });
          row.querySelector('.dn').addEventListener('click', function () { if (i < arr.length - 1) { var t = arr[i]; arr[i] = arr[i + 1]; arr[i + 1] = t; renderSubList(host2, arr, label, addLabel, placeholder); lazySave(); } });
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(arr, i, 'Punkt fjernet', function () { renderSubList(host2, arr, label, addLabel, placeholder); }, lazySave); });
          rows.appendChild(row);
        });
        host2.querySelector('.btn-subadd').addEventListener('click', function () { arr.push(''); renderSubList(host2, arr, label, addLabel, placeholder); lazySave(); });
      }

      function roleCard(c, arr) {
        var card = document.createElement('div');
        card.className = 'card'; card.setAttribute('data-id', arr.indexOf(c));
        card.innerHTML =
          '<div class="card-head"><span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<span class="card-title">' + esc(c.name || '(uten navn)') + '</span>'
            + '<div class="order-btns"><button class="btn-ord up" type="button" title="Opp">↑</button><button class="btn-ord dn" type="button" title="Ned">↓</button></div>'
            + '<button class="btn-del" type="button">Slett</button></div>'
          + '<div class="fields">'
            + '<div class="frow">'
              + '<div class="fg"><label>Navn på kort</label><input type="text" data-f="name" value="' + esc(c.name) + '" placeholder="f.eks. Studentombudet"></div>'
              + '<div class="fg narrow"><label data-help="Liten etikett som vises over overskriften i seksjonen.">Eyebrow</label><input type="text" data-f="eyebrow" value="' + esc(c.eyebrow) + '" placeholder="liten etikett"></div>'
              + '<div class="fg narrow"><label>Fargestripe</label><div data-accent-host></div></div>'
            + '</div>'
            + '<div class="fg"><label>Beskrivelse</label><textarea data-f="desc" placeholder="Brødtekst. Blank linje gir nytt avsnitt.">' + esc(c.desc) + '</textarea></div>'
            + '<div class="fg"><label data-help="Valgfri rødbrun merknad over punktlisten. HTML er tillatt.">Uthevet merknad (rødbrun, vises før punktene)</label><input type="text" data-f="noteTop" value="' + esc(c.noteTop) + '" placeholder="valgfri — HTML lov"></div>'
            + '<div class="subed" data-resp></div>'
            + '<div class="subed" data-contacts></div>'
            + '<div class="fg"><label data-help="Valgfri diskré merknad under punktlisten. HTML er tillatt.">Diskré merknad (vises etter punktene)</label><input type="text" data-f="note" value="' + esc(c.note) + '" placeholder="valgfri — HTML lov"></div>'
            + '<div class="frow">'
              + '<div class="fg narrow"><label>Knappetekst</label><input type="text" data-f="btnLabel" value="' + esc(c.btnLabel) + '" placeholder="tom = ingen knapp"></div>'
              + '<div class="fg"><label>Knapp-lenke</label><input type="text" data-f="btnHref" value="' + esc(c.btnHref) + '" placeholder="https://..."></div>'
            + '</div>'
          + '</div>';
        card.querySelectorAll('[data-f]').forEach(function (el) {
          var field = el.getAttribute('data-f');
          var evt = el.tagName === 'SELECT' ? 'change' : 'input';
          el.addEventListener(evt, function () { c[field] = el.value; if (field === 'name') card.querySelector('.card-title').textContent = el.value || '(uten navn)'; lazySave(); });
        });
        var accentHost = card.querySelector('[data-accent-host]');
        if (accentHost && window.createColorControl) accentHost.appendChild(window.createColorControl({ value: c.accent || '', emptyLabel: 'Gull (standard)', onChange: function (v) { c.accent = v; lazySave(); } }));
        renderSubList(card.querySelector('[data-resp]'), c.resp, 'Punkter (strekpunkter)', '+ punkt', 'Et punkt...');
        renderSubList(card.querySelector('[data-contacts]'), c.contacts, 'Kontaktlinjer (HTML lov)', '+ kontaktlinje', 'f.eks. E-post: <strong>...</strong>');
        wireCardControls(card, arr, c);
        return card;
      }

      function sifraItem(it, arr) {
        var card = document.createElement('div');
        card.className = 'card'; card.setAttribute('data-id', arr.indexOf(it));
        card.innerHTML =
          '<div class="card-head"><span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<span class="card-title">' + esc(it.title || '(uten tittel)') + '</span>'
            + '<div class="order-btns"><button class="btn-ord up" type="button">↑</button><button class="btn-ord dn" type="button">↓</button></div>'
            + '<button class="btn-del" type="button">Slett</button></div>'
          + '<div class="fields">'
            + '<div class="frow"><div class="fg narrow"><label>Ikon (emoji)</label><input type="text" data-f="icon" value="' + esc(it.icon) + '" placeholder="📚"></div>'
            + '<div class="fg"><label>Tittel</label><input type="text" data-f="title" value="' + esc(it.title) + '"></div></div>'
            + '<div class="fg"><label>Tekst (HTML lov — lenker o.l.)</label><textarea data-f="body">' + esc(it.body) + '</textarea></div>'
          + '</div>';
        card.querySelectorAll('[data-f]').forEach(function (el) {
          var field = el.getAttribute('data-f');
          el.addEventListener('input', function () { it[field] = el.value; if (field === 'title') card.querySelector('.card-title').textContent = el.value || '(uten tittel)'; lazySave(); });
        });
        wireCardControls(card, arr, it);
        return card;
      }

      function navCard(n, arr) {
        var card = document.createElement('div');
        card.className = 'card'; card.setAttribute('data-id', arr.indexOf(n));
        card.innerHTML =
          '<div class="card-head"><span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<span class="card-title">' + esc(n.title || '(uten tittel)') + '</span>'
            + '<div class="order-btns"><button class="btn-ord up" type="button">↑</button><button class="btn-ord dn" type="button">↓</button></div>'
            + '<button class="btn-del" type="button">Slett</button></div>'
          + '<div class="fields">'
            + '<div class="frow"><div class="fg"><label>Tittel</label><input type="text" data-f="title" value="' + esc(n.title) + '"></div>'
            + '<div class="fg narrow"><label>Anker (#id)</label><input type="text" data-f="target" value="' + esc(n.target) + '" placeholder="#sifra"></div>'
            + '<div class="fg check"><input type="checkbox" data-f="akutt" id="' + Math.random().toString(36).slice(2) + '"' + (n.akutt ? ' checked' : '') + '><label>Akutt-stil (rød)</label></div></div>'
            + '<div class="fg"><label>Beskrivelse</label><input type="text" data-f="desc" value="' + esc(n.desc) + '"></div>'
            + '<div class="hint">Anker peker til en seksjon på siden: #sifra, #studier, #helse, #fysisk, #akutt.</div>'
          + '</div>';
        card.querySelectorAll('[data-f]').forEach(function (el) {
          var field = el.getAttribute('data-f');
          if (el.type === 'checkbox') { el.addEventListener('change', function () { n[field] = el.checked; lazySave(); }); }
          else { el.addEventListener('input', function () { n[field] = el.value; if (field === 'title') card.querySelector('.card-title').textContent = el.value || '(uten tittel)'; lazySave(); }); }
        });
        wireCardControls(card, arr, n);
        return card;
      }

      function akuttCard(a, arr) {
        var card = document.createElement('div');
        card.className = 'card'; card.setAttribute('data-id', arr.indexOf(a));
        card.innerHTML =
          '<div class="card-head"><span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<span class="card-title">' + esc(a.name || '(uten navn)') + '</span>'
            + '<div class="order-btns"><button class="btn-ord up" type="button">↑</button><button class="btn-ord dn" type="button">↓</button></div>'
            + '<button class="btn-del" type="button">Slett</button></div>'
          + '<div class="fields">'
            + '<div class="frow"><div class="fg"><label>Navn på tjeneste</label><input type="text" data-f="name" value="' + esc(a.name) + '"></div>'
            + '<div class="fg narrow"><label>Nummer (vist)</label><input type="text" data-f="num" value="' + esc(a.num) + '" placeholder="113"></div>'
            + '<div class="fg narrow"><label>Ring-lenke</label><input type="text" data-f="numHref" value="' + esc(a.numHref) + '" placeholder="tel:113"></div>'
            + '<div class="fg check"><input type="checkbox" data-f="life" id="' + Math.random().toString(36).slice(2) + '"' + (a.life ? ' checked' : '') + '><label>Livstruende (uthevet)</label></div></div>'
            + '<div class="fg"><label>Når skal man ringe?</label><textarea data-f="when">' + esc(a.when) + '</textarea></div>'
          + '</div>';
        card.querySelectorAll('[data-f]').forEach(function (el) {
          var field = el.getAttribute('data-f');
          if (el.type === 'checkbox') { el.addEventListener('change', function () { a[field] = el.checked; lazySave(); }); }
          else { el.addEventListener('input', function () { a[field] = el.value; if (field === 'name') card.querySelector('.card-title').textContent = el.value || '(uten navn)'; lazySave(); }); }
        });
        wireCardControls(card, arr, a);
        return card;
      }

      function wireCardControls(card, arr, item) {
        function rerender() { renderAll(); }
        card.querySelector('.up').addEventListener('click', function () { var i = arr.indexOf(item); if (i > 0) { var t = arr[i]; arr[i] = arr[i - 1]; arr[i - 1] = t; rerender(); lazySave(); } });
        card.querySelector('.dn').addEventListener('click', function () { var i = arr.indexOf(item); if (i > -1 && i < arr.length - 1) { var t = arr[i]; arr[i] = arr[i + 1]; arr[i + 1] = t; rerender(); lazySave(); } });
        card.querySelector('.btn-del').addEventListener('click', function () { var nm = item.name || item.title || 'kort'; var i = arr.indexOf(item); if (i > -1) AC.undoDelete(arr, i, '«' + nm + '» slettet', function () { renderAll(); }, lazySave); });
      }

      function fillList(id, arr, maker) { var el = host.querySelector('#' + id); if (!el) return; el.innerHTML = ''; arr.forEach(function (item) { el.appendChild(maker(item, arr)); }); }
      function setVal(id, val) { var el = host.querySelector('#' + id); if (el) el.value = val == null ? '' : val; }

      function renderMetaInputs() {
        setVal('hero-back', data.hero.back); setVal('hero-backHref', data.hero.backHref); setVal('hero-heading', data.hero.heading); setVal('hero-lede', data.hero.lede);
        setVal('sifra-eyebrow', data.sifra.eyebrow); setVal('sifra-heading', data.sifra.heading); setVal('sifra-lede', data.sifra.lede);
        setVal('sifra-cta-label', data.sifra.cta.label); setVal('sifra-cta-href', data.sifra.cta.href);
        setVal('sifra-helpersHeading', data.sifra.helpersHeading); setVal('sifra-helpersLede', data.sifra.helpersLede);
        ['studier', 'helse', 'fysisk', 'akutt'].forEach(function (k) { setVal(k + '-eyebrow', data[k].eyebrow); setVal(k + '-heading', data[k].heading); setVal(k + '-lede', data[k].lede); });
      }
      function updateCounts() {
        function n(id, len, word) { var e = host.querySelector('#' + id); if (e) e.textContent = len + ' ' + word; }
        n('count-nav', data.hero.nav.length, 'kort'); n('count-items', data.sifra.items.length, 'kort'); n('count-sifracards', data.sifra.cards.length, 'kort');
        n('count-studiercards', data.studier.cards.length, 'kort'); n('count-helsecards', data.helse.cards.length, 'kort'); n('count-fysiskcards', data.fysisk.cards.length, 'kort'); n('count-akutt', data.akutt.cards.length, 'kort');
      }
      function renderAll() {
        renderMetaInputs();
        fillList('list-nav', data.hero.nav, navCard);
        fillList('list-items', data.sifra.items, sifraItem);
        fillList('list-sifracards', data.sifra.cards, roleCard);
        fillList('list-studiercards', data.studier.cards, roleCard);
        fillList('list-helsecards', data.helse.cards, roleCard);
        fillList('list-fysiskcards', data.fysisk.cards, roleCard);
        fillList('list-akutt', data.akutt.cards, akuttCard);
        updateCounts();
        AC.enhanceHelp(host);
      }
      function wire(id, setter) { var el = host.querySelector('#' + id); if (el) el.addEventListener('input', function () { setter(this.value); updateCounts(); lazySave(); }); }
      function wireMeta() {
        wire('hero-back', function (v) { data.hero.back = v; }); wire('hero-backHref', function (v) { data.hero.backHref = v; });
        wire('hero-heading', function (v) { data.hero.heading = v; }); wire('hero-lede', function (v) { data.hero.lede = v; });
        wire('sifra-eyebrow', function (v) { data.sifra.eyebrow = v; }); wire('sifra-heading', function (v) { data.sifra.heading = v; }); wire('sifra-lede', function (v) { data.sifra.lede = v; });
        wire('sifra-cta-label', function (v) { data.sifra.cta.label = v; }); wire('sifra-cta-href', function (v) { data.sifra.cta.href = v; });
        wire('sifra-helpersHeading', function (v) { data.sifra.helpersHeading = v; }); wire('sifra-helpersLede', function (v) { data.sifra.helpersLede = v; });
        ['studier', 'helse', 'fysisk', 'akutt'].forEach(function (k) { wire(k + '-eyebrow', function (v) { data[k].eyebrow = v; }); wire(k + '-heading', function (v) { data[k].heading = v; }); wire(k + '-lede', function (v) { data[k].lede = v; }); });
      }
      function newCard() { return { eyebrow: '', accent: '', name: '', desc: '', noteTop: '', resp: [], contacts: [], note: '', btnLabel: '', btnHref: '' }; }
      function scrollLast(listId) { setTimeout(function () { var last = host.querySelector('#' + listId + ' .card:last-child'); if (last) last.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60); }

      host.querySelector('[data-add-nav]').addEventListener('click', function () { data.hero.nav.push({ title: '', desc: '', target: '#', akutt: false }); renderAll(); lazySave(); scrollLast('list-nav'); });
      host.querySelector('[data-add-items]').addEventListener('click', function () { data.sifra.items.push({ icon: '', title: '', body: '' }); renderAll(); lazySave(); scrollLast('list-items'); });
      host.querySelector('[data-add-akutt]').addEventListener('click', function () { data.akutt.cards.push({ name: '', num: '', numHref: 'tel:', when: '', life: false }); renderAll(); lazySave(); scrollLast('list-akutt'); });
      host.querySelectorAll('[data-add-cards]').forEach(function (b) {
        var sec = b.getAttribute('data-add-cards');
        b.addEventListener('click', function () { data[sec].cards.push(newCard()); renderAll(); lazySave(); scrollLast(sec === 'sifra' ? 'list-sifracards' : 'list-' + sec + 'cards'); });
      });

      function cleanCard(c) {
        var o = clone(c);
        o.resp = (o.resp || []).filter(function (x) { return x && x.trim(); });
        o.contacts = (o.contacts || []).filter(function (x) { return x && x.trim(); });
        ['eyebrow', 'noteTop', 'note', 'btnLabel', 'btnHref', 'accent'].forEach(function (k) { if (o[k] === '' || o[k] == null) { if (k !== 'accent') delete o[k]; } });
        if (!o.contacts.length) delete o.contacts;
        return o;
      }
      function exportFile() {
        var out = clone(data);
        CARD_SECTIONS.forEach(function (s) { out[s].cards = out[s].cards.map(cleanCard); });
        var header =
          '/* Innhold for Hjelp & ressurser-siden (hjelp.html).\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Rediger direkte her, eller åpne Admin-senteret → Hjelp for visuell redigering.\n'
          + '\n'
          + '   STRUKTUR\n'
          + '   hero.nav[]        : hurtignav-kortene øverst. {title, desc, target, akutt}\n'
          + '   *.cards[]         : ressurskort (role-card): eyebrow, accent, name, desc,\n'
          + '                       resp[], contacts[], noteTop, note, btnLabel, btnHref\n'
          + '   sifra.items[]     : "Si fra"-kortene. {icon, title, body}  — body tillater HTML\n'
          + '   sifra.cta         : gull-knappen. {label, href}\n'
          + '   akutt.cards[]     : nødnummer-kort. {name, num, numHref, when, life} */\n\n';
        var content = header + 'window.HJELP_CONTENT = ' + JSON.stringify(out, null, 2) + ';\n';
        AC.saveFile('hjelp-content.js', content);
        showToast('Fil lastet ned — erstatt i GitHub og push!');
      }

      host.querySelector('#reset-btn').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); data = fresh(); normalize(); renderAll(); showToast('Tilbakestilt til publisert versjon'); pushPreview();
      });

      [
        ['list-nav',         function () { return data.hero.nav; },     function (v) { data.hero.nav = v; }],
        ['list-items',       function () { return data.sifra.items; },  function (v) { data.sifra.items = v; }],
        ['list-sifracards',  function () { return data.sifra.cards; },  function (v) { data.sifra.cards = v; }],
        ['list-studiercards',function () { return data.studier.cards; },function (v) { data.studier.cards = v; }],
        ['list-helsecards',  function () { return data.helse.cards; },  function (v) { data.helse.cards = v; }],
        ['list-fysiskcards', function () { return data.fysisk.cards; }, function (v) { data.fysisk.cards = v; }],
        ['list-akutt',       function () { return data.akutt.cards; },  function (v) { data.akutt.cards = v; }]
      ].forEach(function (cfg) {
        AC.enableDragSort(host.querySelector('#' + cfg[0]), {
          itemSelector: '.card', handleSelector: '.drag-handle',
          onReorder: function (ids) { var snap = cfg[1]().slice(); cfg[2](ids.map(function (o) { return snap[Number(o)]; })); renderAll(); lazySave(); }
        });
      });

      /* ─── live forhåndsvisning (hjelp.html?preview=1) ─── */
      var pvFrame = host.querySelector('#pv-page');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-hjelp-preview', content: data }, '*'); } catch (e) {} }
      function onPreviewMsg(e) { if (e.data && e.data.type === 'apeiron-hjelp-preview-ready') { pushPreview(); fitPreview(); } }
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

      loadData(); wireMeta(); renderAll();
      ['list-nav', 'list-items', 'list-sifracards', 'list-studiercards', 'list-helsecards', 'list-fysiskcards', 'list-akutt'].forEach(function (lid) {
        var el = host.querySelector('#' + lid);
        if (el) AC.viewSwitch({ list: el, key: 'apeiron-hjelp-view-' + lid + '-v1', help: 'Velg hvordan kortene i denne lista vises mens du redigerer her i admin. Påvirker bare redigeringsvisningen, ikke den publiserte siden.' });
      });
      fitPreview(); setTimeout(fitPreview, 80);
      pushPreview(); setTimeout(pushPreview, 150);

      return {
        export: exportFile,
        destroy: function () {
          window.removeEventListener('message', onPreviewMsg);
          window.removeEventListener('resize', fitPreview);
        }
      };
    }
  });
})();
