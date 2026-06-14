/* Apeiron — felles fargepalett + admin-fargekontroll.
   ÉN kilde til sannhet for alle navngitte farger, med lys- OG mørk-variant.

   Lastes FØR render-scriptene på offentlige sider, og før admin-koden på
   admin-sidene. Faller siden tilbake til standard hvis fila mangler.

   Datamodell for et fargevalg (color / accent):
     "maroon"                              ferdig tema (navn)  — gir lys+mørk
     { light:"maroon", dark:"plum" }       mikset fra palett
     { light:"#76110f", dark:"#e0a8a0" }   rå hex (fargehjul)
   Alle tre håndteres av resolveColor(). Tomt/utelatt => nøytral.

   resolveColor(val) -> { light:"#..", dark:"#.." }  (alltid hex, klar for CSS) */
(function () {
  'use strict';

  /* Hver farge: lys-verdi (for lys bakgrunn) + mørk-verdi (lesbar på mørk).
     Mørk-variantene er lysere/pastell slik at de holder kontrast i marine-modus. */
  var PALETTE = {
    neutral: { light: '#5a5d72', dark: '#b3b8d2' },
    maroon:  { light: '#76110f', dark: '#e3756e' },
    gold:    { light: '#8a6d10', dark: '#d4af37' },
    navy:    { light: '#1c2347', dark: '#7d97ff' },
    green:   { light: '#2f7d3f', dark: '#5fd16f' },
    teal:    { light: '#2c6b6b', dark: '#6fc3c3' },
    blue:    { light: '#3e74e0', dark: '#a9c4ff' },
    plum:    { light: '#6a4570', dark: '#c79fce' },
    rust:    { light: '#9c531f', dark: '#e0a06a' }
  };

  /* Rekkefølge + norske etiketter for nedtrekksmenyer. */
  var NAMES = [
    ['', 'Nøytral'], ['maroon', 'Rødbrun'], ['gold', 'Gull'], ['navy', 'Marineblå'],
    ['green', 'Skoggrønn'], ['teal', 'Petrol'], ['blue', 'Blå'], ['plum', 'Plomme'], ['rust', 'Rust']
  ];

  /* Animerte glød-presets (kortkant i merch). key => CSS-klasse product--glow-<key>.
     soft = dempet/sakte, bold = tydelig/rask. Verdi lagres som { anim: key }. */
  var ANIMATED = [
    ['aurora-soft', 'Aurora · dempet'], ['aurora-bold', 'Aurora · tydelig'],
    ['ember-soft', 'Ember · dempet'], ['ember-bold', 'Ember · tydelig'],
    ['neon-soft', 'Neon · dempet'], ['neon-bold', 'Neon · tydelig'],
    ['rainbow-soft', 'Regnbue · dempet'], ['rainbow-bold', 'Regnbue · tydelig']
  ];
  /* Liten gradient-forhåndsvisning per animert preset (statisk hint i admin). */
  var ANIM_PREVIEW = {
    aurora: 'linear-gradient(120deg,#d4af37,#48dbfb,#c79fce)',
    ember:  'linear-gradient(120deg,#76110f,#d4af37,#e0a06a)',
    neon:   'linear-gradient(120deg,#2f4ea0,#48dbfb,#8fa8ee)',
    rainbow:'linear-gradient(120deg,#ff6b6b,#feca57,#48dbfb,#ff9ff3)'
  };
  function animPreview(key) { return ANIM_PREVIEW[String(key).split('-')[0]] || ''; }

  function isHex(v) { return typeof v === 'string' && v.charAt(0) === '#'; }

  /* Slå opp én modus-verdi (navn eller hex) -> hex. */
  function oneSide(v, mode) {
    if (!v) return PALETTE.neutral[mode];
    if (isHex(v)) return v;
    return (PALETTE[v] || PALETTE.neutral)[mode];
  }

  /* Animert preset? Returner key (f.eks. "aurora-bold") ellers null. */
  function animOf(val) { return (val && typeof val === 'object' && val.anim) ? val.anim : null; }

  /* Hovedoppslag: tar string | {light,dark} | {anim} -> {light,dark} hex.
     Animerte presets har ingen farge -> faller til nøytral (kanten styres av CSS-klasse). */
  function resolveColor(val) {
    if (val == null || val === '' || animOf(val)) {
      return { light: PALETTE.neutral.light, dark: PALETTE.neutral.dark };
    }
    if (typeof val === 'string') {                 // ferdig tema (navn) eller rå hex
      if (isHex(val)) return { light: val, dark: val };
      var p = PALETTE[val] || PALETTE.neutral;
      return { light: p.light, dark: p.dark };
    }
    return {                                        // mikset / rå hex per modus
      light: oneSide(val.light, 'light'),
      dark:  oneSide(val.dark, 'dark')
    };
  }

  /* Inline style-streng med begge variabler, til bruk i render:
       <span style="--c-l:#..;--c-d:#.."> ... CSS plukker via html[data-mode].
     For animerte presets gir den tom streng (kanten styres av klasse). */
  function styleVars(val) {
    if (animOf(val)) return '';
    var c = resolveColor(val);
    return '--c-l:' + c.light + ';--c-d:' + c.dark;
  }

  /* ─────────────────────────────────────────────────────────────────────
     Admin-fargekontroll. createColorControl({ value, onChange }) -> element.
     value : nåværende color/accent (string | {light,dark})
     onChange(newValue) : kalles ved hver endring med komponert verdi.
     Selvstendig: injiserer egen CSS én gang, ingen avhengighet i vertssiden.
     ───────────────────────────────────────────────────────────────────── */
  var cssInjected = false;
  function injectCss() {
    if (cssInjected) return;
    cssInjected = true;
    var css =
      '.ape-color{display:flex;flex-direction:column;gap:7px;}' +
      '.ape-color__row{display:flex;align-items:center;gap:7px;}' +
      '.ape-color__theme{flex:1;font-family:inherit;font-size:.82rem;padding:6px 7px;border:1px solid rgba(35,39,64,.2);border-radius:3px;background:#fff;}' +
      '.ape-color__prev{flex:0 0 auto;width:22px;height:22px;border-radius:4px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.18);}' +
      '.ape-color__custom{display:flex;flex-direction:column;gap:6px;padding:8px;border:1px dashed rgba(35,39,64,.24);border-radius:4px;background:rgba(35,39,64,.03);}' +
      '.ape-color__crow{display:flex;align-items:center;gap:6px;}' +
      '.ape-color__lbl{flex:0 0 42px;font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#5a5d72;}' +
      '.ape-color__name{flex:1;font-family:inherit;font-size:.8rem;padding:5px 6px;border:1px solid rgba(35,39,64,.2);border-radius:3px;background:#fff;}' +
      '.ape-color__hex{flex:0 0 auto;width:30px;height:28px;padding:0;border:1px solid rgba(35,39,64,.2);border-radius:3px;background:#fff;cursor:pointer;}' +
      '.ape-color__custom[hidden]{display:none;}';
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  function opt(value, label, selected) {
    return '<option value="' + value + '"' + (selected ? ' selected' : '') + '>' + label + '</option>';
  }

  function nameOptions(selectedName) {
    return NAMES.map(function (n) { return opt(n[0], n[1], n[0] === selectedName); }).join('')
      + opt('__hex', 'Egen hex…', selectedName === '__hex');
  }

  function createColorControl(opts) {
    injectCss();
    var onChange = opts.onChange || function () {};
    var value = opts.value;
    // Etikett for tom verdi i tema-menyen (f.eks. "Gull (standard)" for striper).
    var emptyLabel = opts.emptyLabel || NAMES[0][1];
    // Valgfrie animerte presets ([key,label]); tom liste => ingen «Animert»-gruppe.
    var animated = opts.animatedPresets || [];

    // Tolk startverdi: animert vs egendefinert (objekt/hex) vs tema (string)
    var anim = animOf(value);
    var custom = !anim && ((value && typeof value === 'object') || isHex(value));
    // Per-modus startverdier (navn eller hex)
    var side = { light: '', dark: '' };
    if (value && typeof value === 'object') {
      side.light = value.light || '';
      side.dark = value.dark || '';
    } else if (isHex(value)) {
      side.light = value; side.dark = value;
    } else {                                   // tema -> forhåndsfyll begge fra paletten
      side.light = value || ''; side.dark = value || '';
    }

    var wrap = document.createElement('div');
    wrap.className = 'ape-color';

    var themeOpts = NAMES.map(function (n) {
      return opt(n[0], n[0] === '' ? emptyLabel : n[1], !custom && !anim && n[0] === (value || ''));
    }).join('');
    if (animated.length) {
      themeOpts += '<optgroup label="Animert glød">' + animated.map(function (a) {
        return opt('__anim:' + a[0], a[1], anim === a[0]);
      }).join('') + '</optgroup>';
    }
    themeOpts += opt('__custom', 'Egendefinert…', custom);

    wrap.innerHTML =
      '<div class="ape-color__row">' +
        '<select class="ape-color__theme">' + themeOpts + '</select>' +
        '<span class="ape-color__prev"></span>' +
      '</div>' +
      '<div class="ape-color__custom"' + (custom ? '' : ' hidden') + '>' +
        crow('light', 'Lys', side.light) +
        crow('dark', 'Mørk', side.dark) +
      '</div>';

    function crow(mode, label, v) {
      var selName = isHex(v) ? '__hex' : (v || '');
      return '<div class="ape-color__crow" data-mode="' + mode + '">' +
        '<span class="ape-color__lbl">' + label + '</span>' +
        '<select class="ape-color__name">' + nameOptions(selName) + '</select>' +
        '<input type="color" class="ape-color__hex" value="' + resolveColor(v)[mode] + '">' +
      '</div>';
    }

    var themeSel = wrap.querySelector('.ape-color__theme');
    var customBox = wrap.querySelector('.ape-color__custom');
    var prev = wrap.querySelector('.ape-color__prev');

    function compose() {
      var tv = themeSel.value;
      if (tv.indexOf('__anim:') === 0) return { anim: tv.slice(7) };  // animert preset
      if (tv === '__custom') return { light: side.light || '', dark: side.dark || '' };
      return tv;                                                       // ferdig tema (eller '')
    }
    function refreshPrev() {
      // Animert: vis gradient-hint. Ellers: delt swatch som viser BÅDE lys- og
      // mørkmodus-fargen (diagonal split), så man ser mørkmodusfargen før valg.
      var v = compose(), a = animOf(v);
      if (a) { prev.style.background = animPreview(a); return; }
      var c = resolveColor(v);
      prev.style.background = 'linear-gradient(135deg, ' + c.light + ' 0 50%, ' + c.dark + ' 50% 100%)';
    }
    function fire() { refreshPrev(); onChange(compose()); }

    themeSel.addEventListener('change', function () {
      var tv = themeSel.value;
      if (tv === '__custom') {
        customBox.hidden = false;
      } else {
        customBox.hidden = true;
        if (tv.indexOf('__anim:') !== 0) { side.light = tv; side.dark = tv; }  // hold custom synket
      }
      fire();
    });

    wrap.querySelectorAll('.ape-color__crow').forEach(function (row) {
      var mode = row.getAttribute('data-mode');
      var nameSel = row.querySelector('.ape-color__name');
      var hex = row.querySelector('.ape-color__hex');
      nameSel.addEventListener('change', function () {
        if (nameSel.value === '__hex') {
          side[mode] = hex.value;                                 // bytt til rå hex
        } else {
          side[mode] = nameSel.value;
          hex.value = resolveColor(side[mode])[mode];             // speil paletten i hjulet
        }
        fire();
      });
      hex.addEventListener('input', function () {
        side[mode] = hex.value;                                   // fargehjul -> hex-modus
        nameSel.value = '__hex';
        fire();
      });
    });

    refreshPrev();
    return wrap;
  }

  window.APEIRON_PALETTE = PALETTE;
  window.APEIRON_PALETTE_NAMES = NAMES;
  window.APEIRON_ANIMATED = ANIMATED;
  window.resolveColor = resolveColor;
  window.paletteAnim = animOf;
  window.paletteStyleVars = styleVars;
  window.createColorControl = createColorControl;
})();
