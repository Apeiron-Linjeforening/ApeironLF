/* ============================================================
   admin-image-editor.js — gjenbrukbar bilderedigerer (modal)
   Brukes av admin-modulene for å gi et fullverdig redigeringsvindu
   når man legger til/bytter et bilde: flytt, zoom, roter, speilvend,
   lysstyrke / kontrast / metning — og beskjæring til riktig format.

   API (selvstendig — injiserer egen CSS, ingen avhengigheter):
     window.AdminImageEditor.open({
       src,                  // dataURL eller sti til kildebildet (kreves)
       aspect,               // ønsket bredde/høyde på resultatet (1 = kvadrat). Standard 1
       outSize,              // lengste side i px på resultatet. Standard 700
       quality,              // webp-kvalitet 0..1. Standard 0.88
       title,                // tittel i vinduet
       applyLabel,           // tekst på «Bruk»-knappen
       onApply(dataUrl),     // kalles med ferdig webp-dataURL
       onCancel              // valgfri
     });

   Bildet rendres på canvas slik at filtre, rotasjon og speilvending vises
   nøyaktig i forhåndsvisningen — det du ser er nøyaktig det som lagres.
   ============================================================ */
(function () {
  'use strict';

  var cssInjected = false;
  function injectCss() {
    if (cssInjected) return;
    cssInjected = true;
    var css =
      '.aie-ov{position:fixed;inset:0;z-index:9600;display:none;align-items:center;justify-content:center;' +
      '  padding:18px;background:rgba(15,17,30,.62);font-family:"Spectral",Georgia,serif;}' +
      '.aie-ov.on{display:flex;}' +
      '.aie-box{background:#f4ecd9;border-radius:12px;width:min(860px,96vw);max-height:94vh;overflow:auto;position:relative;' +
      '  box-shadow:0 30px 70px -22px rgba(0,0,0,.6);display:grid;grid-template-columns:1fr 270px;}' +
      '.aie-close{position:absolute;top:10px;right:12px;z-index:6;width:32px;height:32px;border-radius:50%;border:1px solid rgba(35,39,64,.2);background:#fff;color:#232740;font-size:1rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.14);}' +
      '.aie-close:hover{background:#76110f;border-color:#76110f;color:#fff;}' +
      '.aie-stage{padding:22px 22px 18px;display:flex;flex-direction:column;gap:14px;min-width:0;}' +
      '.aie-head{display:flex;align-items:baseline;gap:10px;}' +
      '.aie-head h3{font-family:"Cormorant Garamond",Georgia,serif;font-size:1.5rem;font-weight:700;color:#232740;margin:0;}' +
      '.aie-head .aie-sub{font-size:.78rem;color:rgba(26,29,46,.6);}' +
      '.aie-canvas-wrap{position:relative;align-self:center;border-radius:8px;overflow:hidden;' +
      '  background:#1c1f33 repeating-conic-gradient(#272b45 0% 25%,#222640 0% 50%) 50%/22px 22px;' +
      '  box-shadow:0 8px 28px -12px rgba(0,0,0,.5);touch-action:none;cursor:grab;max-width:100%;}' +
      '.aie-canvas-wrap:active{cursor:grabbing;}' +
      '.aie-canvas-wrap canvas{display:block;max-width:100%;height:auto;}' +
      '.aie-grid{position:absolute;inset:0;pointer-events:none;opacity:.5;' +
      '  background-image:linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),' +
      '    linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px);' +
      '  background-size:calc(100%/3) calc(100%/3);}' +
      '.aie-round{position:absolute;inset:0;pointer-events:none;border-radius:50%;display:none;' +
      '  box-shadow:0 0 0 9999px rgba(18,20,33,.5), inset 0 0 0 1px rgba(255,255,255,.6);}' +
      '.aie-toolbar{display:flex;flex-wrap:wrap;gap:7px;}' +
      '.aie-tbtn{display:inline-flex;align-items:center;gap:6px;padding:7px 11px;border:1px solid rgba(35,39,64,.18);' +
      '  border-radius:6px;background:#fff;color:#232740;font-family:inherit;font-size:.82rem;font-weight:600;cursor:pointer;' +
      '  transition:background .14s,border-color .14s;}' +
      '.aie-tbtn:hover{background:rgba(212,175,55,.16);border-color:rgba(212,175,55,.55);}' +
      '.aie-tbtn .aie-ic{font-size:.95rem;line-height:1;}' +
      '.aie-side{background:#fbf6ea;border-left:1px solid rgba(35,39,64,.1);padding:20px 18px;' +
      '  display:flex;flex-direction:column;gap:16px;}' +
      '.aie-grp{display:flex;flex-direction:column;gap:9px;}' +
      '.aie-grp h4{font-size:.64rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(26,29,46,.55);margin:0;}' +
      '.aie-ctl{display:flex;flex-direction:column;gap:3px;}' +
      '.aie-ctl .aie-lab{display:flex;justify-content:space-between;font-size:.76rem;color:#232740;}' +
      '.aie-ctl .aie-lab span:last-child{color:rgba(26,29,46,.5);font-variant-numeric:tabular-nums;}' +
      '.aie-ctl input[type=range]{width:100%;accent-color:#a07820;cursor:pointer;margin:0;}' +
      '.aie-aspects{display:flex;gap:6px;flex-wrap:wrap;}' +
      '.aie-chip{flex:1;min-width:52px;padding:6px 4px;border:1px solid rgba(35,39,64,.18);border-radius:6px;background:#fff;' +
      '  font-family:inherit;font-size:.74rem;font-weight:600;color:#232740;cursor:pointer;text-align:center;}' +
      '.aie-chip.on{background:#232740;color:#f4ecd9;border-color:#232740;}' +
      '.aie-foot{margin-top:auto;display:flex;gap:9px;}' +
      '.aie-foot button{flex:1;padding:10px 12px;border-radius:6px;font-family:inherit;font-size:.88rem;font-weight:700;cursor:pointer;border:1px solid rgba(35,39,64,.2);}' +
      '.aie-cancel{background:#fff;color:#232740;}' +
      '.aie-cancel:hover{background:rgba(35,39,64,.06);}' +
      '.aie-apply{background:#d4af37;border-color:#d4af37;color:#232740;}' +
      '.aie-apply:hover{filter:brightness(1.07);}' +
      '.aie-reset{align-self:flex-start;background:none;border:none;color:rgba(26,29,46,.55);font-family:inherit;' +
      '  font-size:.76rem;cursor:pointer;text-decoration:underline;text-underline-offset:2px;padding:0;}' +
      '.aie-reset:hover{color:#76110f;}' +
      '@media (max-width:680px){.aie-box{grid-template-columns:1fr;}.aie-side{border-left:none;border-top:1px solid rgba(35,39,64,.1);}}';
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  var els = null;       // delte DOM-elementer (bygges én gang)
  var st = null;        // gjeldende redigeringstilstand
  var dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  function build() {
    if (els) return els;
    injectCss();
    var ov = document.createElement('div');
    ov.className = 'aie-ov';
    ov.innerHTML =
      '<div class="aie-box" role="dialog" aria-modal="true">' +
        '<button type="button" class="aie-close" title="Lukk uten å lagre (Esc)" aria-label="Lukk uten å lagre">✕</button>' +
        '<div class="aie-stage">' +
          '<div class="aie-head"><h3 class="aie-title">Rediger bilde</h3><span class="aie-sub">Dra for å flytte · scroll for å zoome</span></div>' +
          '<div class="aie-canvas-wrap"><canvas></canvas><div class="aie-grid"></div><div class="aie-round"></div></div>' +
          '<div class="aie-toolbar">' +
            '<button type="button" class="aie-tbtn" data-act="rot-l"><span class="aie-ic">↺</span>Roter</button>' +
            '<button type="button" class="aie-tbtn" data-act="rot-r"><span class="aie-ic">↻</span>Roter</button>' +
            '<button type="button" class="aie-tbtn" data-act="flip-h"><span class="aie-ic">⇋</span>Speil vannrett</button>' +
            '<button type="button" class="aie-tbtn" data-act="flip-v"><span class="aie-ic">⇅</span>Speil loddrett</button>' +
          '</div>' +
        '</div>' +
        '<div class="aie-side">' +
          '<div class="aie-grp"><h4>Format</h4><div class="aie-aspects" data-aspects></div></div>' +
          '<div class="aie-grp"><h4>Plassering</h4>' +
            '<div class="aie-ctl"><div class="aie-lab"><span>Zoom</span><span data-out="zoom">100%</span></div><input type="range" data-k="zoom" min="1" max="5" step="0.01" value="1"></div>' +
          '</div>' +
          '<div class="aie-grp"><h4>Justering</h4>' +
            '<div class="aie-ctl"><div class="aie-lab"><span>Lysstyrke</span><span data-out="brightness">0</span></div><input type="range" data-k="brightness" min="0.4" max="1.6" step="0.01" value="1"></div>' +
            '<div class="aie-ctl"><div class="aie-lab"><span>Kontrast</span><span data-out="contrast">0</span></div><input type="range" data-k="contrast" min="0.4" max="1.6" step="0.01" value="1"></div>' +
            '<div class="aie-ctl"><div class="aie-lab"><span>Metning</span><span data-out="saturation">0</span></div><input type="range" data-k="saturation" min="0" max="2" step="0.01" value="1"></div>' +
            '<button type="button" class="aie-reset">Nullstill justeringer</button>' +
          '</div>' +
          '<div class="aie-foot"><button type="button" class="aie-cancel">Avbryt</button><button type="button" class="aie-apply">Bruk</button></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);

    els = {
      ov: ov,
      box: ov.querySelector('.aie-box'),
      title: ov.querySelector('.aie-title'),
      wrap: ov.querySelector('.aie-canvas-wrap'),
      canvas: ov.querySelector('canvas'),
      grid: ov.querySelector('.aie-grid'),
      round: ov.querySelector('.aie-round'),
      aspects: ov.querySelector('[data-aspects]'),
      apply: ov.querySelector('.aie-apply'),
      cancel: ov.querySelector('.aie-cancel'),
      reset: ov.querySelector('.aie-reset'),
      ranges: ov.querySelectorAll('input[type=range]'),
      outs: {}
    };
    ov.querySelectorAll('[data-out]').forEach(function (o) { els.outs[o.getAttribute('data-out')] = o; });

    // verktøyknapper
    ov.querySelectorAll('[data-act]').forEach(function (b) {
      b.addEventListener('click', function () { doAct(b.getAttribute('data-act')); });
    });
    els.cancel.addEventListener('click', function () { close(false); });
    var closeX = ov.querySelector('.aie-close');
    if (closeX) closeX.addEventListener('click', function () { close(false); });
    els.apply.addEventListener('click', function () { close(true); });
    els.reset.addEventListener('click', function () {
      if (!st) return;
      st.brightness = 1; st.contrast = 1; st.saturation = 1;
      st.rot = 0; st.flipH = false; st.flipV = false;
      st.zoom = 1; st.offX = 0; st.offY = 0;
      syncRanges(); clampPan(); draw();
    });
    ov.addEventListener('click', function (e) { if (e.target === ov) close(false); });

    els.ranges.forEach(function (r) {
      r.addEventListener('input', function () {
        if (!st) return;
        st[r.getAttribute('data-k')] = parseFloat(r.value);
        clampPan(); draw();
      });
    });

    // dra for å flytte
    var dragging = false, lx = 0, ly = 0;
    els.wrap.addEventListener('pointerdown', function (e) {
      if (!st) return; dragging = true; lx = e.clientX; ly = e.clientY;
      try { els.wrap.setPointerCapture(e.pointerId); } catch (_) {}
      e.preventDefault();
    });
    els.wrap.addEventListener('pointermove', function (e) {
      if (!dragging || !st) return;
      st.offX += (e.clientX - lx); st.offY += (e.clientY - ly);
      lx = e.clientX; ly = e.clientY; clampPan(); draw();
    });
    function endDrag(e) { dragging = false; try { els.wrap.releasePointerCapture(e.pointerId); } catch (_) {} }
    els.wrap.addEventListener('pointerup', endDrag);
    els.wrap.addEventListener('pointercancel', endDrag);
    els.wrap.addEventListener('wheel', function (e) {
      if (!st) return; e.preventDefault();
      var z = st.zoom * (e.deltaY < 0 ? 1.08 : 1 / 1.08);
      st.zoom = Math.max(1, Math.min(5, z));
      syncRanges(); clampPan(); draw();
    }, { passive: false });

    document.addEventListener('keydown', onKey);
    return els;
  }

  function onKey(e) {
    if (!st || !els || !els.ov.classList.contains('on')) return;
    if (e.key === 'Escape') close(false);
    else if (e.key === 'Enter') close(true);
  }

  // roterte naturlige dimensjoner (bytter w/h på 90/270)
  function rotDims() {
    var swap = (st.rot % 180) !== 0;
    return { w: swap ? st.img.naturalHeight : st.img.naturalWidth, h: swap ? st.img.naturalWidth : st.img.naturalHeight };
  }
  function coverScale() {
    var d = rotDims();
    return Math.max(st.vw / d.w, st.vh / d.h);
  }
  function clampPan() {
    var s = coverScale() * st.zoom, d = rotDims();
    var mx = Math.max(0, (d.w * s - st.vw) / 2), my = Math.max(0, (d.h * s - st.vh) / 2);
    st.offX = Math.max(-mx, Math.min(mx, st.offX));
    st.offY = Math.max(-my, Math.min(my, st.offY));
  }

  function paint(ctx, scale) {
    var s = coverScale() * st.zoom * scale;
    ctx.save();
    ctx.fillStyle = '#1c1f33';
    ctx.fillRect(0, 0, st.vw * scale, st.vh * scale);
    ctx.filter = 'brightness(' + st.brightness + ') contrast(' + st.contrast + ') saturate(' + st.saturation + ')';
    ctx.translate(st.vw * scale / 2 + st.offX * scale, st.vh * scale / 2 + st.offY * scale);
    ctx.rotate(st.rot * Math.PI / 180);
    ctx.scale(st.flipH ? -1 : 1, st.flipV ? -1 : 1);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    var iw = st.img.naturalWidth, ih = st.img.naturalHeight;
    ctx.drawImage(st.img, -iw * s / 2, -ih * s / 2, iw * s, ih * s);
    ctx.restore();
  }

  function draw() {
    var c = els.canvas, ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint(ctx, 1);
    // tallvisning
    els.outs.zoom.textContent = Math.round(st.zoom * 100) + '%';
    els.outs.brightness.textContent = signed(st.brightness);
    els.outs.contrast.textContent = signed(st.contrast);
    els.outs.saturation.textContent = signed(st.saturation);
  }
  function signed(v) { var n = Math.round((v - 1) * 100); return (n > 0 ? '+' : '') + n; }

  function syncRanges() {
    els.ranges.forEach(function (r) {
      var k = r.getAttribute('data-k');
      if (st[k] != null) r.value = String(st[k]);
    });
  }

  function doAct(act) {
    if (!st) return;
    if (act === 'rot-l') st.rot = (st.rot + 270) % 360;
    else if (act === 'rot-r') st.rot = (st.rot + 90) % 360;
    else if (act === 'flip-h') st.flipH = !st.flipH;
    else if (act === 'flip-v') st.flipV = !st.flipV;
    clampPan(); draw();
  }

  function setAspect(aspect) {
    if (!st) return;
    st.aspect = aspect;
    // forhåndsvisning: lengste side ~360 css-px
    var maxW = Math.min(360, (els.box.clientWidth || 520) - 320);
    maxW = Math.max(240, maxW);
    if (aspect >= 1) { st.vw = maxW; st.vh = Math.round(maxW / aspect); }
    else { st.vh = maxW; st.vw = Math.round(maxW * aspect); }
    var c = els.canvas;
    c.width = Math.round(st.vw * dpr); c.height = Math.round(st.vh * dpr);
    c.style.width = st.vw + 'px'; c.style.height = st.vh + 'px';
    els.wrap.style.width = st.vw + 'px';
    // re-sentrer pan ved formatbytte
    st.offX = 0; st.offY = 0;
    clampPan(); draw();
    if (els.round) els.round.style.display = st.round ? 'block' : 'none';
    if (els.grid) els.grid.style.display = st.round ? 'none' : '';
    if (els.aspects) els.aspects.querySelectorAll('.aie-chip').forEach(function (ch) {
      ch.classList.toggle('on', Math.abs(parseFloat(ch.getAttribute('data-a')) - aspect) < 0.001);
    });
  }

  function renderAspectChips(allowed, current) {
    var LABELS = [['1', 'Kvadrat'], ['0.75', 'Portrett'], ['1.3333', 'Liggende'], ['0.5625', 'Høy 9:16'], ['1.7778', 'Bred 16:9']];
    els.aspects.innerHTML = '';
    allowed.forEach(function (a) {
      var lab = (LABELS.find(function (l) { return Math.abs(parseFloat(l[0]) - a) < 0.01; }) || [String(a), a + '×'])[1];
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'aie-chip' + (Math.abs(a - current) < 0.001 ? ' on' : '');
      b.setAttribute('data-a', a); b.textContent = lab;
      b.addEventListener('click', function () { setAspect(a); });
      els.aspects.appendChild(b);
    });
    els.aspects.parentElement.style.display = allowed.length > 1 ? '' : 'none';
  }

  var pending = null;
  function open(opts) {
    opts = opts || {};
    build();
    var aspect = opts.aspect || 1;
    var allowed = opts.aspects && opts.aspects.length ? opts.aspects : [aspect];
    pending = {
      outSize: opts.outSize || 700,
      quality: opts.quality || 0.88,
      onApply: opts.onApply || function () {},
      onCancel: opts.onCancel || function () {}
    };
    els.title.textContent = opts.title || 'Rediger bilde';
    els.apply.textContent = opts.applyLabel || 'Bruk';

    var img = new Image();
    img.onload = function () {
      st = {
        img: img, aspect: aspect, rot: 0, flipH: false, flipV: false,
        zoom: 1, offX: 0, offY: 0, brightness: 1, contrast: 1, saturation: 1,
        vw: 320, vh: 320, round: !!opts.round
      };
      els.ov.classList.add('on');
      if (els.round) els.round.style.display = st.round ? 'block' : 'none';
      if (els.grid) els.grid.style.display = st.round ? 'none' : '';
      renderAspectChips(allowed, aspect);
      syncRanges();
      // vent på layout før vi måler boksbredde
      requestAnimationFrame(function () { setAspect(aspect); });
    };
    img.onerror = function () { pending = null; if (typeof opts.onError === 'function') { opts.onError(); return; } alert('Kunne ikke laste bildet for redigering.'); };
    if (/^data:|^blob:/.test(opts.src)) img.src = opts.src;
    else { img.crossOrigin = 'anonymous'; img.src = opts.src; }
  }

  function renderOut() {
    // utdata: lengste side = outSize, samme sideforhold som forhåndsvisning
    var out = pending.outSize;
    var ow, oh;
    if (st.aspect >= 1) { ow = out; oh = Math.round(out / st.aspect); }
    else { oh = out; ow = Math.round(out * st.aspect); }
    var scale = ow / st.vw;
    var canvas = document.createElement('canvas');
    canvas.width = ow; canvas.height = oh;
    var ctx = canvas.getContext('2d');
    paint(ctx, scale);
    return canvas.toDataURL('image/webp', pending.quality);
  }

  function close(apply) {
    if (!els) return;
    if (apply && st && pending) {
      var url = renderOut();
      var cb = pending.onApply;
      els.ov.classList.remove('on'); st = null;
      var p = pending; pending = null;
      try { cb(url); } catch (e) { console.warn('AdminImageEditor onApply feilet', e); }
      return;
    }
    var oc = pending && pending.onCancel;
    els.ov.classList.remove('on'); st = null; pending = null;
    if (oc) try { oc(); } catch (_) {}
  }

  window.AdminImageEditor = {
    open: open,
    destroy: function () {
      if (els && els.ov && els.ov.parentNode) els.ov.parentNode.removeChild(els.ov);
      document.removeEventListener('keydown', onKey);
      els = null; st = null; pending = null; cssInjected = false;
    }
  };
})();
