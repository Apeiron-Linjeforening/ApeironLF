/* ============================================================
   admin-modules/forsiden.js — Forsiden (Hjem): Hero + Kontakt, som C-modul
   Erstatter index-admin.html. Krever footer-icons.js (FOOTER_ICON_LABELS) og
   index-content.js (INDEX_CONTENT), som skallet (admin.html) laster.
   Live forhåndsvisning via index.html?preview=1.
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('forsiden', {
    title: 'Forsiden',
    see: { href: 'index.html', label: 'Se Hjem ↗' },
    exportName: 'index-content.js',

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Live fra den ekte forsiden (Hjem) — endringene dine vises umiddelbart. Dette panelet styrer <b>tekstene på Hjem</b> (hero, seksjons-introer, «Bli medlem» og kontakt). «Om oss» og FAQ redigeres i <b>Om oss</b>.</p>'
          + '<div class="pv-board-wrap"><iframe id="pv-board" src="index.html?preview=1" title="Forhåndsvisning av forsiden"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du Hjem</strong>'
          + '<ol>'
            + '<li>Rediger tekstene nedenfor — endringer vises live i forhåndsvisningen</li>'
            + '<li>Trykk <b>☁ Publiser til GitHub</b> oppe til høyre</li>'
            + '<li><em>(Reserve hvis publisering svikter: «↓ Last ned alle endrede» nederst i Oversikt-fanen, og legg fila i GitHub.)</em></li>'
            + '<li>Cloudflare oppdaterer nettsiden automatisk innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Endringer lagres automatisk i nettleseren din. Dette panelet styrer <b>tekstene på Hjem</b> (hero, seksjons-introer, «Bli medlem»-intro og kontakt). «Om oss» + FAQ ligger i Om oss-panelet. Arrangementene, nyheter, oppslagstavla og medlemspriser hentes/redigeres andre steder.</div>'
        + '</div>'
        + '<div class="panel"><h2>Galleribilder på forsiden <small>live fra Drive-galleriet</small></h2>'
          + '<div class="panel-body">'
            + '<style>'
              + '.hg-master{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:13px 15px;background:rgba(35,39,64,.04);border:1px solid var(--border);border-radius:8px}'
              + '.hg-master__txt b{display:block;font-size:.95rem;color:var(--navy)}'
              + '.hg-master__txt span{display:block;font-size:.76rem;color:var(--ink-soft);line-height:1.45;margin-top:3px;max-width:48ch}'
              + '.hg-switch{position:relative;flex:0 0 auto;width:46px;height:27px;cursor:pointer}'
              + '.hg-switch input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer}'
              + '.hg-switch i{position:absolute;inset:0;background:#c4c8d4;border-radius:999px;transition:background .18s}'
              + '.hg-switch i::after{content:"";position:absolute;top:3px;left:3px;width:21px;height:21px;background:#fff;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.28);transition:transform .18s}'
              + '.hg-switch input:checked + i{background:var(--gold,#d4af37)}'
              + '.hg-switch input:checked + i::after{transform:translateX(19px)}'
              + '.hg-body{margin-top:18px;transition:opacity .2s}'
              + '.hg-body.is-off{opacity:.4;pointer-events:none}'
              + '.hg-grp{margin-bottom:20px}'
              + '.hg-grp:last-child{margin-bottom:0}'
              + '.hg-grp__h{font-size:.64rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft);padding-bottom:7px;margin-bottom:12px;border-bottom:1px solid var(--border)}'
              + '.hg-body input[type=range]{width:100%;accent-color:var(--navy,#232740)}'
              + '.hg-toggle{display:flex;align-items:center;gap:9px;font-size:.88rem;color:var(--navy);cursor:pointer;margin:2px 0}'
              + '.hg-toggle input{width:17px;height:17px;accent-color:var(--navy,#232740)}'
              + '.hg-hidden{display:none!important}'
              + '.hg-help{display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;border-radius:50%;background:#cdd2e0;color:#2b2c33;font-size:10px;font-weight:700;margin-left:6px;cursor:help;vertical-align:middle}'
              + '[data-hg="size"].is-locked{opacity:.4}'
              + '[data-hg="size"].is-locked input{cursor:not-allowed}'
            + '</style>'
            + '<div class="hg-master">'
              + '<div class="hg-master__txt"><b>Vis galleribilder på forsiden</b><span>Av som standard. Bildene hentes tilfeldig fra hele Drive-galleriet og oppdaterer seg selv.</span></div>'
              + '<label class="hg-switch" title="Slå galleribildene på eller av"><input type="checkbox" id="hg-enabled"><i></i></label>'
            + '</div>'
            + '<div class="hg-body" id="hg-body">'
              + '<div class="hg-grp">'
                + '<div class="hg-grp__h">Stil &amp; plassering</div>'
                + '<div class="fg"><label>Stil</label><select id="hg-style">'
                  + '<option value="A">A — Rullende bånd</option>'
                  + '<option value="B">B — Mosaikk (egen seksjon)</option>'
                  + '<option value="C">C — Polaroider (egen seksjon)</option>'
                  + '<option value="D">D — Svevende bilder bak hero</option>'
                + '</select></div>'
                + '<div class="fg" data-hg="placement"><label>Plassering</label><select id="hg-placement">'
                  + '<option value="top">Rett under hero</option>'
                  + '<option value="before-medlem">Like før «Bli medlem»</option>'
                + '</select></div>'
              + '</div>'
              + '<div class="hg-grp">'
                + '<div class="hg-grp__h">Bevegelse &amp; utseende</div>'
                + '<div class="frow">'
                  + '<div class="fg narrow" data-hg="count"><label><span id="hg-count-label">Antall bilder</span>: <output id="hg-count-v"></output></label><input type="range" id="hg-count" min="3" max="16" step="1"></div>'
                  + '<div class="fg narrow" data-hg="opacity"><label>Synlighet: <output id="hg-opacity-v"></output></label><input type="range" id="hg-opacity" min="10" max="100" step="5"></div>'
                + '</div>'
                + '<div class="frow">'
                  + '<div class="fg narrow" data-hg="speed"><label>Hastighet: <output id="hg-speed-v"></output></label><input type="range" id="hg-speed" min="50" max="150" step="10"></div>'
                  + '<div class="fg narrow" data-hg="size"><label>Størrelse: <output id="hg-size-v"></output><span class="hg-help" title="Størrelsen kan bare justeres når du har én ramme. Med flere rammer får de varierte, tilfeldige størrelser.">?</span></label><input type="range" id="hg-size" min="50" max="200" step="10"></div>'
                  + '<div class="fg narrow" data-hg="direction"><label>Retning</label><select id="hg-direction">'
                    + '<option value="up-left">Opp mot venstre</option>'
                    + '<option value="up-right">Opp mot høyre</option>'
                    + '<option value="up">Rett opp</option>'
                    + '<option value="left">Mot venstre</option>'
                    + '<option value="right">Mot høyre</option>'
                  + '</select></div>'
                + '</div>'
                + '<div class="fg" data-hg="animation"><label>Animasjon</label><select id="hg-animation">'
                  + '<option value="diagonal">Diagonal drift</option>'
                  + '<option value="vertical">Rett opp / loddrett</option>'
                  + '<option value="kenburns">Sakte zoom (Ken Burns)</option>'
                  + '<option value="crossfade">Krysstoning</option>'
                  + '<option value="dvd">Sprett mellom kantene (DVD)</option>'
                + '</select></div>'
              + '</div>'
              + '<div class="hg-grp" data-hg="extras">'
                + '<div class="hg-grp__h">Stil-spesifikt</div>'
                + '<div class="fg" data-hg="motif"><label>Motiv</label><select id="hg-motif">'
                  + '<option value="photos">Galleribilder</option>'
                  + '<option value="blueLogos">Blå logo-utkast (bytter mellom variantene)</option>'
                  + '<option value="logoBW">Logo — vanlig &amp; svart</option>'
                  + '<option value="hourglass">Timeglass-logo</option>'
                + '</select></div>'
                + '<label class="hg-toggle" data-hg="navclip"><input type="checkbox" id="hg-navclip"> Klipp bildene ved navigasjonsbaren</label>'
                + '<div class="fg" data-hg="mosaic"><label>Bildestørrelser</label><select id="hg-mosaic">'
                  + '<option value="varied">Varierte (ett stort + flere små)</option>'
                  + '<option value="uniform">Like store</option>'
                + '</select></div>'
                + '<div class="fg" data-hg="pola"><label>Polaroid-stil</label><select id="hg-pola">'
                  + '<option value="framed">Hvit polaroid-ramme</option>'
                  + '<option value="clean">Rene bilder (ingen ramme)</option>'
                + '</select></div>'
                + '<div data-hg="section">'
                  + '<div class="fg"><label>Seksjonsoverskrift</label><input type="text" id="hg-heading"></div>'
                  + '<div class="fg"><label>Ingress</label><textarea id="hg-lede"></textarea></div>'
                + '</div>'
              + '</div>'
            + '</div>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Hero <small>øverst på Hjem</small></h2>'
          + '<div class="panel-body">'
            + '<div class="frow"><div class="fg narrow"><label>Tittel (før)</label><input type="text" id="hero-wm-pre"></div>'
            + '<div class="fg narrow"><label>Spesial-bokstav</label><input type="text" id="hero-wm-mid"></div>'
            + '<div class="fg narrow"><label>Tittel (etter)</label><input type="text" id="hero-wm-post"></div></div>'
            + '<p class="hint">Den store tittelen øverst (foreningsnavnet). «Spesial-bokstaven» får ∞-stilen — la den stå tom for en vanlig bokstav.</p>'
            + '<div class="fg"><label>Eyebrow (liten etikett over tittelen)</label><input type="text" id="hero-eyebrow"></div>'
            + '<div class="fg"><label>Undertittel</label><input type="text" id="hero-tag"></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="hero-lede"></textarea></div>'
            + '<div class="frow"><div class="fg"><label>Knapp 1 — tekst</label><input type="text" id="hero-cta1-label"></div>'
            + '<div class="fg narrow"><label>Knapp 1 — lenke</label><input type="text" id="hero-cta1-href" placeholder="#bli-medlem"></div></div>'
            + '<div class="frow"><div class="fg"><label>Knapp 2 — tekst</label><input type="text" id="hero-cta2-label"></div>'
            + '<div class="fg narrow"><label>Knapp 2 — lenke</label><input type="text" id="hero-cta2-href" placeholder="#arrangementer"></div></div>'
            + '<div class="fg"><label>«Ny her?»-bro-lenke (tekst under knappene)</label><input type="text" id="hero-bridge"></div>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Arrangementer <small>seksjons-intro på Hjem</small></h2>'
          + '<div class="panel-body">'
            + '<div class="fg"><label>Eyebrow (liten etikett over tittelen)</label><input type="text" id="arr-eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="arr-heading"></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="arr-lede"></textarea></div>'
            + '<p class="hint">Selve arrangementene hentes fra Google Kalender — her styrer du bare overskriften og teksten over dem.</p>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Aporetisk Aften <small>seksjons-intro på Hjem</small></h2>'
          + '<div class="panel-body">'
            + '<div class="fg"><label>Eyebrow (liten etikett over tittelen)</label><input type="text" id="apo-eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="apo-title"></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="apo-lede"></textarea></div>'
            + '<div class="fg"><label>«For hvem»</label><input type="text" id="apo-forwhom"></div>'
            + '<div class="sub-h">Side-boks (det greske ordet)</div>'
            + '<div class="frow"><div class="fg"><label>Gresk ord</label><input type="text" id="apo-greek"></div>'
            + '<div class="fg"><label>Uttale / oversettelse</label><input type="text" id="apo-greek-sub"></div></div>'
            + '<div class="fg"><label>Notat under ordet</label><textarea id="apo-note"></textarea></div>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Fadderukene <small>seksjons-intro på Hjem</small></h2>'
          + '<div class="panel-body">'
            + '<div class="fg"><label>Eyebrow (liten etikett over tittelen)</label><input type="text" id="fadder-eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="fadder-heading"></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="fadder-lede"></textarea></div>'
            + '<p class="hint">Selve programmet og datoene hentes fra fadderuke-kalenderen.</p>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Bli medlem <small>intro-teksten i «Bli medlem»-seksjonen</small></h2>'
          + '<div class="panel-body">'
            + '<div class="fg"><label>Eyebrow (liten etikett over tittelen)</label><input type="text" id="m-eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="m-heading"></div>'
            + '<div class="fg"><label>Ingress</label><textarea id="m-lede"></textarea></div>'
            + '<div class="sub-h">Fordeler <small style="font-weight:400;text-transform:none;letter-spacing:0">(punktene med avhuking)</small></div>'
            + '<p class="hint">Hvert punkt får automatisk et avhukings-ikon. Priser og innmeldingssteg redigeres i <b>Medlemskap</b>-panelet.</p>'
            + '<div class="lst" id="lst-benefits"></div><button class="btn-add" type="button" data-add="benefits">+ Ny fordel</button>'
          + '</div>'
        + '</div>'
        + '<div class="panel"><h2>Kontakt <small>nederst på Hjem</small></h2>'
          + '<div class="panel-body">'
            + '<div class="fg"><label>Eyebrow (seksjons-etikett over «Ta kontakt…»)</label><input type="text" id="k-eyebrow"></div>'
            + '<div class="fg"><label>Overskrift</label><input type="text" id="k-heading"></div>'
            + '<div class="fg"><label>E-post</label><input type="text" id="k-email"></div>'
            + '<div class="fg"><label>Adresse</label><input type="text" id="k-address"></div>'
            + '<div class="frow"><div class="fg"><label>Nettside (vist tekst)</label><input type="text" id="k-web"></div>'
            + '<div class="fg"><label>Nettside (full lenke)</label><input type="text" id="k-webHref" placeholder="https://..."></div></div>'
            + '<div class="sub-h">Vanlige spørsmål <small style="font-weight:400;text-transform:none;letter-spacing:0">(vist ved siden av kontakt)</small></div>'
            + '<div class="fg"><label>Seksjonsoverskrift</label><input type="text" id="k-faqHeading"></div>'
            + '<p class="hint">Et kort utdrag på Hjem. Den fulle FAQ-en ligger i Om oss-panelet.</p>'
            + '<div class="lst" id="lst-hjemfaq"></div><button class="btn-add" type="button" data-add="hjemfaq">+ Nytt spørsmål</button>'
            + '<div class="sub-h">Medie- &amp; sosiale lenker</div>'
            + '<p class="hint">Legg til Instagram, Facebook, YouTube, e-post osv. Velg ikon fra lista. Bruk full lenke (https://…) eller mailto:… for e-post.</p>'
            + '<div class="lst" id="lst-socials"></div><button class="btn-add" type="button" data-add="socials">+ Ny lenke</button>'
          + '</div>'
        + '</div>';

      var q = function (id) { return host.querySelector('#' + id); };
      var LS_KEY = 'apeiron-index-v1';
      var data = {};
      function clone(o) { return JSON.parse(JSON.stringify(o)); }
      function fresh() {
        var c = window.INDEX_CONTENT || {};
        var d = clone(c);
        d.hero = d.hero || {};
        d.hero.cta1 = d.hero.cta1 || { label: '', href: '' };
        d.hero.cta2 = d.hero.cta2 || { label: '', href: '' };
        d.hero.wordmark = d.hero.wordmark || { pre: '', mid: '', post: '' };
        d.arr = d.arr || {};
        d.apo = d.apo || {};
        d.fadder = d.fadder || {};
        d.medlem = d.medlem || {};
        d.medlem.benefits = Array.isArray(d.medlem.benefits) ? d.medlem.benefits : [];
        d.kontakt = d.kontakt || {};
        d.kontakt.socials = Array.isArray(d.kontakt.socials) ? d.kontakt.socials : [];
        d.kontakt.faq = Array.isArray(d.kontakt.faq) ? d.kontakt.faq : [];
        d.heroGallery = Object.assign({
          enabled: false, style: 'D', placement: 'top', count: 10, opacity: 0.8, speed: 100,
          direction: 'up-left', animation: 'diagonal', navClip: true, dvdMotif: 'photos',
          mosaicSizes: 'varied', polaStyle: 'framed', dvdSize: 100,
          heading: 'Livet i Apeiron', lede: 'Glimt fra det sosiale livet i Apeiron — fester, fagkvelder og alt imellom.'
        }, d.heroGallery || {});
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
        data.hero = Object.assign({}, f.hero, data.hero);
        data.hero.cta1 = Object.assign({}, f.hero.cta1, data.hero.cta1);
        data.hero.cta2 = Object.assign({}, f.hero.cta2, data.hero.cta2);
        data.hero.wordmark = Object.assign({}, f.hero.wordmark, data.hero.wordmark);
        data.arr = Object.assign({}, f.arr, data.arr);
        data.apo = Object.assign({}, f.apo, data.apo);
        data.fadder = Object.assign({}, f.fadder, data.fadder);
        data.medlem = Object.assign({}, f.medlem, data.medlem);
        if (!Array.isArray(data.medlem.benefits)) data.medlem.benefits = [];
        data.kontakt = Object.assign({}, f.kontakt, data.kontakt);
        if (!Array.isArray(data.kontakt.socials)) data.kontakt.socials = [];
        if (!Array.isArray(data.kontakt.faq)) data.kontakt.faq = [];
        data.heroGallery = Object.assign({}, f.heroGallery, data.heroGallery);
      }
      function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(data)); pushPreview(); }
      var saveTimer = null;
      function lazySave() { pushPreview(); clearTimeout(saveTimer); saveTimer = setTimeout(function () { saveData(); AC.toast('Lagret i nettleseren'); }, 300); }
      function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

      var FIELD_MAP = {
        'hero-eyebrow': 'hero.eyebrow', 'hero-tag': 'hero.tag', 'hero-lede': 'hero.lede',
        'hero-cta1-label': 'hero.cta1.label', 'hero-cta1-href': 'hero.cta1.href',
        'hero-cta2-label': 'hero.cta2.label', 'hero-cta2-href': 'hero.cta2.href',
        'hero-bridge': 'hero.bridge',
        'hero-wm-pre': 'hero.wordmark.pre', 'hero-wm-mid': 'hero.wordmark.mid', 'hero-wm-post': 'hero.wordmark.post',
        'arr-eyebrow': 'arr.eyebrow', 'arr-heading': 'arr.heading', 'arr-lede': 'arr.lede',
        'apo-eyebrow': 'apo.eyebrow', 'apo-title': 'apo.title', 'apo-lede': 'apo.lede',
        'apo-forwhom': 'apo.forWhom', 'apo-greek': 'apo.greek', 'apo-greek-sub': 'apo.greekSub', 'apo-note': 'apo.note',
        'fadder-eyebrow': 'fadder.eyebrow', 'fadder-heading': 'fadder.heading', 'fadder-lede': 'fadder.lede',
        'm-eyebrow': 'medlem.eyebrow', 'm-heading': 'medlem.heading', 'm-lede': 'medlem.lede',
        'k-heading': 'kontakt.heading', 'k-eyebrow': 'kontakt.eyebrow', 'k-email': 'kontakt.email', 'k-address': 'kontakt.address',
        'k-web': 'kontakt.web', 'k-webHref': 'kontakt.webHref', 'k-faqHeading': 'kontakt.faqHeading'
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
      function renderFields() {
        Object.keys(FIELD_MAP).forEach(function (id) { var el = q(id); if (el) el.value = getPath(FIELD_MAP[id]) || ''; });
      }
      function wireFields() {
        Object.keys(FIELD_MAP).forEach(function (id) { var el = q(id); if (!el) return; el.addEventListener('input', function () { setPath(FIELD_MAP[id], el.value); lazySave(); }); });
      }

      function renderSocials() {
        var hostEl = q('lst-socials'); hostEl.innerHTML = '';
        var LABELS = window.FOOTER_ICON_LABELS || {};
        data.kontakt.socials.forEach(function (s, i) {
          var row = document.createElement('div');
          row.className = 'lrow'; row.setAttribute('data-id', 'soc' + i);
          var opts = Object.keys(LABELS).map(function (k) { return '<option value="' + k + '"' + (s.icon === k ? ' selected' : '') + '>' + esc(LABELS[k]) + '</option>'; }).join('');
          row.innerHTML =
            '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<div class="lrow-fields">'
              + '<div class="frow"><div class="fg"><label>Navn</label><input type="text" data-k="label" value="' + esc(s.label) + '" placeholder="Instagram"></div>'
              + '<div class="fg narrow"><label>Ikon</label><select data-k="icon">' + opts + '</select></div></div>'
              + '<div class="fg"><label>Lenke</label><input type="text" data-k="href" value="' + esc(s.href) + '" placeholder="https://… eller mailto:…"></div>'
            + '</div>'
            + '<div class="lrow-ctrls"><button class="btn-mini up" type="button" title="Opp">↑</button><button class="btn-mini dn" type="button" title="Ned">↓</button><button class="btn-mini x" type="button" title="Slett">✕</button></div>';
          row.querySelectorAll('[data-k]').forEach(function (inp) { var ev = inp.tagName === 'SELECT' ? 'change' : 'input'; inp.addEventListener(ev, function () { s[inp.getAttribute('data-k')] = inp.value; lazySave(); }); });
          row.querySelector('.up').addEventListener('click', function () { moveArr(data.kontakt.socials, i, -1); renderSocials(); lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(data.kontakt.socials, i, 1); renderSocials(); lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(data.kontakt.socials, i, '«' + (s.label || 'Sosial lenke') + '» fjernet', renderSocials, lazySave); });
          hostEl.appendChild(row);
        });
      }
      function renderBenefits() {
        var hostEl = q('lst-benefits'); hostEl.innerHTML = '';
        data.medlem.benefits.forEach(function (b, i) {
          var row = document.createElement('div');
          row.className = 'lrow'; row.setAttribute('data-id', 'ben' + i);
          row.innerHTML =
            '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<div class="lrow-fields">'
              + '<div class="fg"><label>Fordel</label><input type="text" data-k="text" value="' + esc(b) + '" placeholder="f.eks. Rabattert inngang på alle arrangementer"></div>'
            + '</div>'
            + '<div class="lrow-ctrls"><button class="btn-mini up" type="button" title="Opp">↑</button><button class="btn-mini dn" type="button" title="Ned">↓</button><button class="btn-mini x" type="button" title="Slett">✕</button></div>';
          row.querySelector('[data-k]').addEventListener('input', function () { data.medlem.benefits[i] = this.value; lazySave(); });
          row.querySelector('.up').addEventListener('click', function () { moveArr(data.medlem.benefits, i, -1); renderBenefits(); lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(data.medlem.benefits, i, 1); renderBenefits(); lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(data.medlem.benefits, i, 'Fordel fjernet', renderBenefits, lazySave); });
          hostEl.appendChild(row);
        });
      }
      function renderHjemFaq() {
        var hostEl = q('lst-hjemfaq'); hostEl.innerHTML = '';
        data.kontakt.faq.forEach(function (it, i) {
          var row = document.createElement('div');
          row.className = 'lrow'; row.setAttribute('data-id', 'q' + i);
          row.innerHTML =
            '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
            + '<div class="lrow-fields">'
              + '<div class="fg"><label>Spørsmål</label><input type="text" data-k="q" value="' + esc(it.q) + '" placeholder="Spørsmålet..."></div>'
              + '<div class="fg"><label>Svar</label><textarea data-k="a" placeholder="Svaret...">' + esc(it.a) + '</textarea></div>'
            + '</div>'
            + '<div class="lrow-ctrls"><button class="btn-mini up" type="button" title="Opp">↑</button><button class="btn-mini dn" type="button" title="Ned">↓</button><button class="btn-mini x" type="button" title="Slett">✕</button></div>';
          row.querySelectorAll('[data-k]').forEach(function (inp) { inp.addEventListener('input', function () { it[inp.getAttribute('data-k')] = inp.value; lazySave(); }); });
          row.querySelector('.up').addEventListener('click', function () { moveArr(data.kontakt.faq, i, -1); renderHjemFaq(); lazySave(); });
          row.querySelector('.dn').addEventListener('click', function () { moveArr(data.kontakt.faq, i, 1); renderHjemFaq(); lazySave(); });
          row.querySelector('.x').addEventListener('click', function () { AC.undoDelete(data.kontakt.faq, i, 'Spørsmål fjernet', renderHjemFaq, lazySave); });
          hostEl.appendChild(row);
        });
      }
      function moveArr(arr, i, dir) { var j = i + dir; if (j < 0 || j >= arr.length) return; var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }

      host.querySelectorAll('[data-add]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.getAttribute('data-add') === 'socials') { data.kontakt.socials.push({ label: '', href: '', icon: 'web' }); renderSocials(); lazySave(); }
          else if (b.getAttribute('data-add') === 'benefits') { data.medlem.benefits.push(''); renderBenefits(); lazySave(); }
          else if (b.getAttribute('data-add') === 'hjemfaq') { data.kontakt.faq.push({ q: '', a: '' }); renderHjemFaq(); lazySave(); }
        });
      });
      function wireDrag(hostId, arrRef, rerender) {
        AC.enableDragSort(q(hostId), {
          itemSelector: '.lrow', handleSelector: '.drag-handle',
          onReorder: function (ids) {
            var arr = arrRef();
            var order = ids.map(function (id) { return parseInt(id.replace(/^\D+/, ''), 10); });
            var next = order.map(function (idx) { return arr[idx]; });
            arr.length = 0; Array.prototype.push.apply(arr, next);
            rerender(); lazySave();
          }
        });
      }
      function renderHeroGallery() {
        var g = data.heroGallery || {};
        q('hg-enabled').checked = !!g.enabled;
        q('hg-style').value = g.style || 'D';
        q('hg-placement').value = g.placement || 'top';
        q('hg-count').value = g.count; q('hg-count-v').textContent = g.count;
        var op = Math.round((g.opacity != null ? g.opacity : 0.8) * 100);
        q('hg-opacity').value = op; q('hg-opacity-v').textContent = op + '%';
        q('hg-speed').value = g.speed; q('hg-speed-v').textContent = g.speed + '%';
        q('hg-direction').value = g.direction || 'up-left';
        q('hg-animation').value = g.animation || 'diagonal';
        q('hg-navclip').checked = !!g.navClip;
        q('hg-motif').value = g.dvdMotif || 'photos';
        q('hg-size').value = g.dvdSize != null ? g.dvdSize : 100; q('hg-size-v').textContent = (g.dvdSize != null ? g.dvdSize : 100) + '%';
        q('hg-mosaic').value = g.mosaicSizes || 'varied';
        q('hg-pola').value = g.polaStyle || 'framed';
        q('hg-heading').value = g.heading || '';
        q('hg-lede').value = g.lede || '';
        setBodyDim();
        updateHgVis();
      }
      function updateHgVis() {
        var style = q('hg-style').value, anim = q('hg-animation').value, isD = style === 'D';
        setDirectionOptions(style);
        setCountRange();
        function show(name, on) { host.querySelectorAll('[data-hg="' + name + '"]').forEach(function (el) { el.classList.toggle('hg-hidden', !on); }); }
        show('placement', !isD);
        show('animation', isD);
        show('navclip', isD);
        show('motif', isD && anim === 'dvd');
        show('extras', style !== 'A');
        show('size', isD && anim === 'dvd');
        var sizeOn = isD && anim === 'dvd' && parseInt(q('hg-count').value, 10) === 1;
        q('hg-size').disabled = !sizeOn;
        var sizeFg = host.querySelector('[data-hg="size"]'); if (sizeFg) sizeFg.classList.toggle('is-locked', !sizeOn);
        show('count', style !== 'A');
        show('opacity', isD);
        show('speed', isD || style === 'A');
        show('direction', style === 'A' || (isD && anim === 'diagonal'));
        show('mosaic', style === 'B');
        show('pola', style === 'C');
        show('section', style === 'B' || style === 'C');
      }
      // Retnings-alternativene er ulike per stil: A ruller bare venstre/høyre,
      // mens D har fem unike drift-retninger. Vis kun de relevante.
      // Antall-slideren tilpasses stilen: D+DVD bruker 1–4 rammer, ellers 3–16 bilder.
      function setCountRange() {
        var style = q('hg-style').value, anim = q('hg-animation').value;
        var slider = q('hg-count'), lbl = q('hg-count-label');
        var isDvd = (style === 'D' && anim === 'dvd');
        var min = isDvd ? 1 : 3, max = isDvd ? 4 : 16;
        slider.min = min; slider.max = max;
        var cur = parseInt(slider.value, 10);
        if (isNaN(cur)) cur = (data.heroGallery && data.heroGallery.count) || min;
        if (cur < min) cur = min; if (cur > max) cur = max;
        slider.value = cur;
        q('hg-count-v').textContent = cur;
        if (lbl) lbl.textContent = isDvd ? 'Antall rammer' : 'Antall bilder';
        if (data.heroGallery) data.heroGallery.count = cur;
      }
      function setDirectionOptions(style) {
        var sel = q('hg-direction');
        var optsD = [['up-left', 'Opp mot venstre'], ['up-right', 'Opp mot høyre'], ['up', 'Rett opp'], ['left', 'Mot venstre'], ['right', 'Mot høyre']];
        var optsA = [['left', 'Mot venstre'], ['right', 'Mot høyre']];
        var opts = style === 'A' ? optsA : optsD;
        var cur = sel.value || (data.heroGallery && data.heroGallery.direction);
        sel.innerHTML = opts.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('');
        if (opts.some(function (o) { return o[0] === cur; })) { sel.value = cur; }
        else { sel.value = (style === 'A' ? 'left' : 'up-left'); if (data.heroGallery) data.heroGallery.direction = sel.value; }
      }
      function setBodyDim() { var b = q('hg-body'); if (b) b.classList.toggle('is-off', !q('hg-enabled').checked); }
      function wireHeroGallery() {
        function bindToggle(id, key) { q(id).addEventListener('change', function () { data.heroGallery[key] = this.checked; lazySave(); }); }
        function bindSelect(id, key, after) { q(id).addEventListener('change', function () { data.heroGallery[key] = this.value; if (after) after(); lazySave(); }); }
        q('hg-enabled').addEventListener('change', function () { data.heroGallery.enabled = this.checked; setBodyDim(); lazySave(); });
        bindToggle('hg-navclip', 'navClip');
        bindSelect('hg-style', 'style', updateHgVis);
        bindSelect('hg-placement', 'placement');
        bindSelect('hg-direction', 'direction');
        bindSelect('hg-animation', 'animation', updateHgVis);
        bindSelect('hg-motif', 'dvdMotif');
        q('hg-size').addEventListener('input', function () { data.heroGallery.dvdSize = parseInt(this.value, 10); q('hg-size-v').textContent = this.value + '%'; lazySave(); });
        bindSelect('hg-mosaic', 'mosaicSizes');
        bindSelect('hg-pola', 'polaStyle');
        q('hg-count').addEventListener('input', function () { data.heroGallery.count = parseInt(this.value, 10); q('hg-count-v').textContent = this.value; updateHgVis(); lazySave(); });
        q('hg-opacity').addEventListener('input', function () { data.heroGallery.opacity = parseInt(this.value, 10) / 100; q('hg-opacity-v').textContent = this.value + '%'; lazySave(); });
        q('hg-speed').addEventListener('input', function () { data.heroGallery.speed = parseInt(this.value, 10); q('hg-speed-v').textContent = this.value + '%'; lazySave(); });
        q('hg-heading').addEventListener('input', function () { data.heroGallery.heading = this.value; lazySave(); });
        q('hg-lede').addEventListener('input', function () { data.heroGallery.lede = this.value; lazySave(); });
      }
      function renderAll() { renderFields(); renderBenefits(); renderSocials(); renderHjemFaq(); renderHeroGallery(); }

      function exportFile() {
        var out = { heroGallery: clone(data.heroGallery || {}), hero: clone(data.hero || {}), arr: clone(data.arr || {}), apo: clone(data.apo || {}), fadder: clone(data.fadder || {}), medlem: clone(data.medlem || {}), kontakt: clone(data.kontakt || {}) };
        out.medlem.benefits = (out.medlem.benefits || []).filter(function (b) { return b && b.trim(); });
        out.kontakt.socials = (out.kontakt.socials || []).filter(function (s) { return (s.label && s.label.trim()) || (s.href && s.href.trim()); });
        out.kontakt.faq = (out.kontakt.faq || []).filter(function (it) { return (it.q && it.q.trim()) || (it.a && it.a.trim()); });
        var content =
          '/* Innhold for forsiden (index.html / «Hjem») — TEKST-delene som endres ofte.\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   Rediger direkte her, eller åpne Admin-senteret → Forsiden.\n'
          + '\n'
          + '   Dekker forsiden (Hjem): hero + seksjons-introer (arrangementer/aporetisk/fadderuke) + bli medlem (intro) + kontakt.\n'
          + '   «Om oss» + FAQ ligger på om-oss.html → om-content.js (Om oss-panelet).\n'
          + '*/\n\n'
          + 'window.INDEX_CONTENT = ' + JSON.stringify(out, null, 2) + ';\n';
        AC.downloadBlob('index-content.js', content);
        AC.toast('Fil lastet ned — erstatt i GitHub og push!');
      }

      q('reset-btn').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); data = fresh(); renderAll(); AC.toast('Tilbakestilt til publisert versjon'); pushPreview();
      });

      var pvFrame = q('pv-board');
      function pushPreview() { if (!pvFrame || !pvFrame.contentWindow) return; try { pvFrame.contentWindow.postMessage({ type: 'apeiron-index-preview', content: data }, '*'); } catch (e) {} }
      function onPreviewMsg(e) { if (e.data && e.data.type === 'apeiron-index-preview-ready') { pushPreview(); fitPreview(); } }
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

      loadData(); renderAll(); wireFields(); wireHeroGallery();
      wireDrag('lst-socials', function () { return data.kontakt.socials; }, renderSocials);
      wireDrag('lst-benefits', function () { return data.medlem.benefits; }, renderBenefits);
      wireDrag('lst-hjemfaq', function () { return data.kontakt.faq; }, renderHjemFaq);
      AC.viewSwitch({ list: q('lst-socials'), key: 'apeiron-forsiden-socials-view-v1', help: 'Velg hvordan lenke-radene vises mens du redigerer her i admin. Påvirker bare redigeringsvisningen, ikke nettsiden.' });
      AC.viewSwitch({ list: q('lst-hjemfaq'), key: 'apeiron-forsiden-faq-view-v1', help: 'Velg hvordan FAQ-radene vises mens du redigerer her i admin. Påvirker bare redigeringsvisningen, ikke nettsiden.' });
      fitPreview(); setTimeout(fitPreview, 80);
      pushPreview(); setTimeout(pushPreview, 150);

      return {
        export: exportFile,
        destroy: function () { window.removeEventListener('message', onPreviewMsg); window.removeEventListener('resize', fitPreview); }
      };
    }
  });
})();
