/* ============================================================
   apeiron-hero-gallery.js — Admin-styrte galleribilder på forsiden.
   Leser INDEX_CONTENT.heroGallery og rendrer én av fire stiler med
   tilfeldige bilder hentet live fra Drive-galleriet:
     A = rullende bånd   B = mosaikk   C = polaroider   D = svevende bak hero
   Av som standard (enabled=false). Lytter på samme live-preview-melding
   som apeiron-index.js, så Admin → Forsiden styrer den i sanntid.
   Krever hero-gallery.css.
   ============================================================ */
(function () {
  'use strict';

  var IS_PREVIEW = false;
  try { IS_PREVIEW = /[?&]preview\b/.test(location.search); } catch (e) {}

  // Entré-flagg: bildene glir inn utenfra rammen KUN ved aller første sidelast.
  // Settes false etter første D-foto-bygging, så live-preview/re-render ikke
  // animerer på nytt.
  var hgFirstLoad = true;

  // ── Standardconfig ──
  var DEFAULTS = {
    enabled: false,
    style: 'D',                // 'A' | 'B' | 'C' | 'D'
    placement: 'top',          // 'top' | 'before-medlem'  (kun A/B/C)
    count: 10,
    opacity: 0.8,              // 0..1
    speed: 100,                // 40..200 (%) — høyere = raskere
    direction: 'up-left',      // up-left | up-right | up | left | right
    animation: 'diagonal',     // diagonal | vertical | kenburns | crossfade (kun D)
    navClip: true,             // kun D
    dvdMotif: 'photos',        // photos | blueLogos | logoBW | hourglass (kun D+DVD)
    dvdSize: 100,              // % — størrelse når kun én ramme (kun D+DVD)
    mosaicSizes: 'varied',     // varied | uniform (kun B)
    polaStyle: 'framed',       // framed | clean (kun C)
    heading: 'Livet i Apeiron',
    lede: 'Glimt fra det sosiale livet i Apeiron: fester, fagkvelder og alt imellom.'
  };

  function cfg() {
    var c = (window.INDEX_CONTENT && window.INDEX_CONTENT.heroGallery) || {};
    // På vanlige sidelastinger (ikke ?preview=1): bruk admin-utkastet fra
    // localStorage hvis det finnes, så forhåndsvisningen overlever navigasjon
    // og «Se nettsiden» speiler det du jobber med. I preview-modus driver
    // admin den live via postMessage, så da rører vi ikke localStorage.
    if (!IS_PREVIEW) {
      try {
        var draft = JSON.parse(localStorage.getItem('apeiron-index-v1') || 'null');
        if (draft && draft.heroGallery) c = draft.heroGallery;
      } catch (e) {}
    }
    var out = {};
    Object.keys(DEFAULTS).forEach(function (k) { out[k] = (c[k] == null ? DEFAULTS[k] : c[k]); });
    return out;
  }

  // ── Drive-henting (samme kilde som galleri.html) ──
  var DRIVE = 'https://www.googleapis.com/drive/v3/files';
  var ROOT_FOLDER_ID = '1EAhJQDIqptfYN8QhBsl49xS110JCpota';
  var POOL_KEY = 'apeiron-hg-pool-v1';
  var POOL_TTL = 6 * 3600 * 1000;

  // Lokale reservebilder (brukes hvis Drive er utilgjengelig, f.eks. uten API-nøkkel lokalt).
  var FALLBACK = [
    'assets/lesesalen/lesesal1.jpg', 'assets/lesesalen/lesesal5.jpg', 'assets/lesesalen/lesesal9.jpg',
    'assets/lesesalen/lesesal10.jpg', 'assets/lesesalen/lesesal11.jpg', 'assets/lesesalen/lesesal12.jpg',
    'assets/lesesalen/lesesal15.jpg', 'assets/lesesalen/lesesal16.jpg',
    'assets/oppnaelser/Volleyball26.webp',
    'assets/Styremedlemmer/Iver.jpg', 'assets/Styremedlemmer/Dagny.jpg', 'assets/Styremedlemmer/Helene.jpg',
    'assets/Styremedlemmer/Robin.jpg', 'assets/Styremedlemmer/Natalie.jpg', 'assets/Styremedlemmer/Karoline.jpg',
    'assets/Styremedlemmer/Stian.jpg'
  ];

  function key() { return window.GOOGLE_API_KEY || ''; }
  function thumbUrl(id) { return 'https://drive.google.com/thumbnail?id=' + id + '&sz=w600'; }
  function driveUrl(params) {
    var b = DRIVE + '?key=' + encodeURIComponent(key());
    Object.keys(params).forEach(function (k) { b += '&' + k + '=' + encodeURIComponent(params[k]); });
    return b;
  }
  function getJson(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        try { cb(null, JSON.parse(xhr.responseText)); } catch (e) { cb(e); }
      } else { cb(new Error('HTTP ' + xhr.status)); }
    };
    xhr.onerror = function () { cb(new Error('network')); };
    xhr.send();
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  var poolCache = null;       // array av bilde-URL-er
  function buildPool(cb) {
    if (poolCache) { cb(poolCache); return; }
    if (!key()) { poolCache = FALLBACK.slice(); cb(poolCache); return; }
    try {
      var c = JSON.parse(sessionStorage.getItem(POOL_KEY) || 'null');
      if (c && c.t > Date.now() - POOL_TTL && c.ids && c.ids.length) {
        poolCache = c.ids.map(thumbUrl); cb(poolCache); return;
      }
    } catch (e) {}

    var ids = [];
    getJson(driveUrl({ q: "'" + ROOT_FOLDER_ID + "' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false", fields: 'files(id)', orderBy: 'name desc', pageSize: '50' }), function (e, d) {
      if (e || !d.files || !d.files.length) { poolCache = FALLBACK.slice(); cb(poolCache); return; }
      var years = d.files, pendingY = years.length, eventFolders = [];
      years.forEach(function (y) {
        getJson(driveUrl({ q: "'" + y.id + "' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false", fields: 'files(id)', orderBy: 'name desc', pageSize: '100' }), function (e2, d2) {
          if (!e2 && d2.files) d2.files.forEach(function (f) { eventFolders.push(f.id); });
          if (--pendingY === 0) fetchImages(eventFolders);
        });
      });
    });

    function fetchImages(folders) {
      shuffle(folders); folders = folders.slice(0, 24);
      var pending = folders.length;
      if (!pending) { poolCache = FALLBACK.slice(); cb(poolCache); return; }
      folders.forEach(function (fid) {
        getJson(driveUrl({ q: "'" + fid + "' in parents and mimeType contains 'image/' and trashed=false", fields: 'files(id)', orderBy: 'name', pageSize: '10' }), function (e3, d3) {
          if (!e3 && d3.files) d3.files.forEach(function (f) { ids.push(f.id); });
          if (--pending === 0) finish();
        });
      });
    }
    function finish() {
      if (!ids.length) { poolCache = FALLBACK.slice(); cb(poolCache); return; }
      shuffle(ids);
      try { sessionStorage.setItem(POOL_KEY, JSON.stringify({ t: Date.now(), ids: ids.slice(0, 60) })); } catch (e) {}
      poolCache = ids.map(thumbUrl); cb(poolCache);
    }
  }

  // ── Lightbox (delt, for A/B/C) ──
  var lb, lbImg;
  function ensureLb() {
    if (lb) return;
    lb = document.createElement('div'); lb.className = 'hg-lb';
    lb.innerHTML = '<button class="hg-lb__x" aria-label="Lukk">&times;</button><img alt="" />';
    lbImg = lb.querySelector('img');
    lb.querySelector('.hg-lb__x').addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
    document.body.appendChild(lb);
  }
  function openLb(src) { ensureLb(); lbImg.src = src; lb.classList.add('is-open'); }
  function closeLb() { if (lb) { lb.classList.remove('is-open'); lbImg.src = ''; } }

  // ── Rydding mellom re-rendringer ──
  var injected = [];
  var timers = [];
  var rafId = null, dvdToken = null;
  function clearAll() {
    injected.forEach(function (n) { if (n && n.parentNode) n.parentNode.removeChild(n); });
    injected = [];
    timers.forEach(function (t) { clearInterval(t); });
    timers = [];
    dvdToken = null;
    if (rafId) { try { window.cancelAnimationFrame(rafId); } catch (e) {} rafId = null; }
  }

  function reducedMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }

  // Bygger drift-vektorer ut fra faktisk rammestørrelse, så start/slutt alltid
  // ligger utenfor rammen (uansett retning) → ingen pop midt i bildet.
  function dirVectors(dx, dy) {
    var X = dx + 'px', Xn = '-' + dx + 'px', Y = dy + 'px', Yn = '-' + dy + 'px', Z = '0px';
    return {
      'up-left':  { x0: X,  y0: Y, x1: Xn, y1: Yn },
      'up-right': { x0: Xn, y0: Y, x1: X,  y1: Yn },
      'up':       { x0: Z,  y0: Y, x1: Z,  y1: Yn },
      'left':     { x0: X,  y0: Z, x1: Xn, y1: Z },
      'right':    { x0: Xn, y0: Z, x1: X,  y1: Z }
    };
  }

  // ── D: svevende bilder bak hero ──
  function renderD(c, pool) {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    if (getComputedStyle(hero).position === 'static') hero.style.position = 'relative';
    var navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;

    var floats = document.createElement('div');
    floats.className = 'hg-d-floats hg-mode-' + c.animation + (c.navClip ? ' hg-clip' : '');
    floats.style.setProperty('--hg-clip', navH + 'px');
    var veil = document.createElement('div');
    veil.className = 'hg-d-veil' + (c.animation === 'dvd' ? ' hg-d-veil--flat' : '');
    if (c.animation === 'dvd') {
      // «Synlighet» = hvor synlige bildene er: 100% → ingen slør (fullt synlig,
      // solide bilder), lavere verdi → mørkere slør over hele flaten. Ingen
      // transparency på selve bildene.
      var veilA = Math.max(0, Math.min(0.85, 1 - (c.opacity == null ? 0.8 : c.opacity)));
      veil.style.background = 'rgba(26, 29, 51, ' + veilA.toFixed(2) + ')';
    }

    // Sett inn først (etter seglet) så vi kan måle rammen før vi fyller den.
    var seal = hero.querySelector('.hero__seal');
    if (seal && seal.nextSibling) { hero.insertBefore(floats, seal.nextSibling); hero.insertBefore(veil, floats.nextSibling); }
    else { hero.insertBefore(floats, hero.firstChild); hero.insertBefore(veil, floats.nextSibling); }
    injected.push(floats, veil);

    var W = floats.clientWidth || hero.clientWidth || 1200;
    var H = floats.clientHeight || (hero.clientHeight - (c.navClip ? navH : 0)) || 600;

    if (c.animation === 'dvd') { renderDvd(c, pool, floats, W, H); return; }

    // Translate-avstand: største av målt ramme og selve vinduet + margin, så
    // start/slutt ligger utenfor rammen selv om heroen vokser etter måling
    // (skrift/«Akkurat nå»-kortet laster og gjør heroen høyere etterpå).
    var vw = window.innerWidth || 1280, vh = window.innerHeight || 800;
    var DIRV = dirVectors(Math.max(W, vw) + 500, Math.max(H, vh) + 500);
    var n = Math.max(3, Math.min(16, c.count));
    var dir = (c.animation === 'vertical') ? 'up' : c.direction;
    var v = DIRV[dir] || DIRV['up-left'];
    var imgs = pickN(pool, n);
    var fixed = (c.animation === 'kenburns' || c.animation === 'crossfade');

    // Tilfeldige størrelser.
    var dims = [];
    for (var s = 0; s < n; s++) { var ww = 110 + Math.floor(Math.random() * 60); dims.push({ w: ww, h: Math.round(ww * 0.74) }); }

    // Posisjoner: Drift (diagonal/loddrett) = fritt tilfeldig over hele flaten,
    // overlapp tillatt (bildene kommer fra tilfeldige steder og går over hverandre).
    // Ken Burns / krysstoning = tilfeldig, men aldri mer enn 1/4 overlapp med
    // et annet bilde (regnet med Ken Burns-zoomen i fotavtrykket).
    var kbScale = (c.animation === 'kenburns') ? 1.28 : 1.0;
    var pos = [];
    for (var p = 0; p < n; p++) {
      var d = dims[p];
      if (!fixed) {
        pos.push({ x: Math.random() * Math.max(1, W - d.w), y: Math.random() * Math.max(1, H - d.h) });
        continue;
      }
      var fw = d.w * kbScale, fhh = d.h * kbScale, chosen = null, tries = 0;
      while (tries < 80) {
        var cand = { x: Math.random() * Math.max(1, W - d.w), y: Math.random() * Math.max(1, H - d.h) };
        var ax = cand.x + d.w / 2, ay = cand.y + d.h / 2, ok = true;
        for (var qi = 0; qi < pos.length; qi++) {
          var dq = dims[qi], pq = pos[qi];
          var bx = pq.x + dq.w / 2, by = pq.y + dq.h / 2, bw = dq.w * kbScale, bh = dq.h * kbScale;
          var ox = Math.max(0, Math.min(ax + fw / 2, bx + bw / 2) - Math.max(ax - fw / 2, bx - bw / 2));
          var oy = Math.max(0, Math.min(ay + fhh / 2, by + bh / 2) - Math.max(ay - fhh / 2, by - bh / 2));
          if (ox * oy > 0.25 * Math.min(fw * fhh, bw * bh)) { ok = false; break; }
        }
        if (ok) { chosen = cand; break; }
        tries++;
      }
      pos.push(chosen || { x: Math.random() * Math.max(1, W - d.w), y: Math.random() * Math.max(1, H - d.h) });
    }

    for (var i = 0; i < n; i++) {
      var w = dims[i].w, h = dims[i].h;
      var el = document.createElement('div');
      el.className = 'hg-fp';
      // Egen varighet per animasjon: Ken Burns / krysstoning er merkbart
      // raskere enn den lange driften. Tilfeldig fase, så de ikke synkroniserer.
      var base;
      if (c.animation === 'kenburns') base = 14 + Math.random() * 8;       // 14–22 s
      else if (c.animation === 'crossfade') base = 8 + Math.random() * 6;  // 8–14 s
      else base = 28 + Math.random() * 22;                                 // 28–50 s
      var dur = base * (100 / c.speed);
      var delay = -(Math.random() * dur);
      var kb = '';
      if (c.animation === 'kenburns') {
        kb = '--kbs:' + (1.14 + Math.random() * 0.12).toFixed(3) + ';'
          + '--kbx:' + (Math.random() * 8 - 4).toFixed(1) + '%;'
          + '--kby:' + (Math.random() * 8 - 4).toFixed(1) + '%;';
      }
      var css = 'left:' + Math.round(pos[i].x) + 'px;'
        + 'top:' + Math.round(pos[i].y) + 'px;'
        + 'width:' + w + 'px;height:' + h + 'px;'
        + '--o:' + c.opacity + ';--r:' + (Math.random() * 10 - 5).toFixed(1) + 'deg;'
        + '--d:' + dur.toFixed(1) + 's;--dl:' + delay.toFixed(1) + 's;'
        + kb
        + '--tx0:' + v.x0 + ';--ty0:' + v.y0 + ';--tx1:' + v.x1 + ';--ty1:' + v.y1 + ';';
      el.style.cssText = css;
      var im = document.createElement('img');
      im.src = imgs[i]; im.alt = ''; im.loading = 'lazy';
      el.appendChild(im);
      floats.appendChild(el);

      if (c.animation === 'crossfade') scheduleSwap(im, dur, -delay, pool);
    }
  }

  // ── D-variant: DVD-sprett — én/flere bilderammer spretter mellom kantene og
  //    bytter til et tilfeldig bilde hver gang de treffer en kant. ──
  function renderDvd(c, pool, floats, W, H) {
    // Færre rammer = mindre hakking. Antall-slideren = antall rammer (1–4).
    var n = Math.max(1, Math.min(4, c.count || 1));
    // Hver ramme får FLERE ferdig-lastede, dekodede bildelag stablet oppå
    // hverandre fra start. Sprett = bare flytte z-index mellom dem. Vi rører
    // ALDRI .src under animasjonen, så ingen last/dekod-jobb skjer i sprett-
    // øyeblikket (det var den egentlige kilden til hakkingen).
    // Motiv: galleribilder (standard) eller logo-sett. Logoene ligger som
    // egne lag og byttes mellom — segl vises «bare», timeglasset på et lyst kort.
    var LOGOSETS = {
      blueLogos: ['blue-1', 'blue-2', 'blue-3', 'blue-4', 'blue-5', 'blue-6', 'blue-7'],
      logoBW: ['normal', 'black'],
      hourglass: ['hourglass']
    };
    var motif = c.dvdMotif || 'photos';
    var isLogo = !!LOGOSETS[motif];
    var logoUrls = isLogo ? LOGOSETS[motif].map(function (nm) { return 'assets/dvd-logos/' + nm + '.png'; }) : null;
    var landscape = (motif === 'hourglass');
    var bare = isLogo;   // alle logo-motiv vises «bart» (gjennomsiktig bakgrunn)
    var card = false;
    // Størrelse-innstillingen gjelder KUN når det er én ramme; ved flere
    // beholder vi de varierte tilfeldige størrelsene.
    var size = (c.dvdSize || 100) / 100;
    var single = (n === 1);

    var frames = [];
    for (var i = 0; i < n; i++) {
      var sz, fh, picks, K;
      if (isLogo) {
        picks = logoUrls; K = logoUrls.length;
        if (landscape) { sz = single ? Math.round(206 * size) : (184 + Math.floor(Math.random() * 44)); fh = Math.round(sz * 0.75); }
        else { sz = single ? Math.round(150 * size) : (128 + Math.floor(Math.random() * 46)); fh = sz; } // kvadratiske segl
      } else {
        K = Math.max(3, Math.min(6, pool.length));
        picks = pickN(pool, K);
        sz = single ? Math.round(173 * size) : (150 + Math.floor(Math.random() * 46)); fh = Math.round(sz * 0.72);
      }
      var el = document.createElement('div');
      el.className = 'hg-dvd' + (bare ? ' hg-dvd--logo' : (card ? ' hg-dvd--card' : ''));
      el.style.width = sz + 'px';
      el.style.height = fh + 'px';
      // DVD: bildene er alltid SOLIDE (ingen transparency). «Synlighet»-verdien
      // styrer i stedet sløret over flaten (se veil under) — hvor synlige de er.
      el.style.opacity = '1';
      var layers = [];
      for (var j = 0; j < K; j++) {
        var im = document.createElement('img');
        im.className = 'hg-dvd__img';
        im.decoding = 'async'; im.alt = '';
        im.style.zIndex = (j === 0 ? '2' : '1');
        im.src = picks[j];
        if (im.decode) im.decode().catch(function () {});
        el.appendChild(im);
        layers.push(im);
      }
      floats.appendChild(el);
      // Ekte tilfeldig retning per ramme (ikke deterministisk, så de spriker).
      var ang = Math.random() * Math.PI * 2;
      var sp = (90 + Math.random() * 60) * (c.speed / 100); // px/sek
      var vx = Math.cos(ang) * sp, vy = Math.sin(ang) * sp;
      if (Math.abs(vx) < 35) vx = (vx < 0 ? -1 : 1) * 45;
      if (Math.abs(vy) < 35) vy = (vy < 0 ? -1 : 1) * 45;
      // Hver ramme FØDES nær en TILFELDIG kant (med tilfeldig posisjon langs
      // kanten). Da kan entréen gli den kort inn fra rett utenfor den kanten —
      // aldri langt (intet kast), aldri midt på skjermen (intet pop). Etterpå
      // driver DVD-fysikken den innover og rundt som normalt.
      var edges = ['left', 'right', 'top', 'bottom'];
      var edge = edges[Math.floor(Math.random() * edges.length)];
      var inset = Math.random() * 28; // hvor langt inn fra kanten den lander
      var fx, fy;
      if (edge === 'left')        { fx = inset;            fy = Math.random() * Math.max(1, H - fh); }
      else if (edge === 'right')  { fx = (W - sz) - inset; fy = Math.random() * Math.max(1, H - fh); }
      else if (edge === 'top')    { fy = inset;            fx = Math.random() * Math.max(1, W - sz); }
      else                        { fy = (H - fh) - inset; fx = Math.random() * Math.max(1, W - sz); }
      frames.push({ el: el, layers: layers, top: 0, w: sz, h: fh,
        x: fx, y: fy, vx: vx, vy: vy, entryEdge: edge });
    }
    // Entré KUN ved aller første sidelast (skjuler API-treigheten på Drive-bilder).
    // Hver ramme er født nær en tilfeldig kant; her starter den rett UTENFOR den
    // kanten (klippet av overflow:hidden = usynlig) og glir kort og rolig inn til
    // sin fødeplass. Aldri langt (intet kast), aldri midt på skjermen (intet pop).
    // Opacity røres ALDRI (visibility brukes mot synlighets-pop ved last).
    var doEntrance = hgFirstLoad && !reducedMotion();
    frames.forEach(function (f, i) {
      f.el.style.transform = 'translate(' + f.x + 'px,' + f.y + 'px)';
      if (!doEntrance) return;
      var m = 16; // akkurat utenfor kanten
      var startTx = 0, startTy = 0;
      if (f.entryEdge === 'left')        startTx = -(f.x + f.w + m);  // fra venstre
      else if (f.entryEdge === 'right')  startTx = (W - f.x + m);      // fra høyre
      else if (f.entryEdge === 'top')    startTy = -(f.y + f.h + m);  // fra topp
      else                               startTy = (H - f.y + m);      // fra bunn
      f.el.style.visibility = 'hidden'; // skjult til bildet er lastet (ingen pop)
      f.el.style.translate = startTx + 'px ' + startTy + 'px';
      f.el.style.transition = 'translate 1.1s cubic-bezier(.25,.6,.3,1)'; // kort, rolig
      (function (node, im2, idx) {
        var done = false;
        function reveal() {
          if (done) return; done = true;
          setTimeout(function () {
            // Gjør synlig MENS den ennå står utenfor kanten (klippet), så glir inn.
            node.style.visibility = 'visible';
            node.style.translate = '0px 0px';
          }, 60 + idx * 150);
        }
        if (im2 && im2.complete && im2.naturalWidth) reveal();
        else if (im2) { im2.addEventListener('load', reveal); im2.addEventListener('error', reveal); }
        else reveal();
        setTimeout(reveal, 3500); // failsafe: aldri permanent skjult
      })(f.el, f.layers[0], i);
    });
    hgFirstLoad = false;
    if (reducedMotion()) return;

    // Sprett-bytte = bare flytt z-index til et annet (allerede malt) lag.
    function swap(f) {
      var L = f.layers; if (L.length < 2) return;
      var nx = Math.floor(Math.random() * (L.length - 1));
      if (nx >= f.top) nx++; // garanter et annet lag enn det nåværende
      L[f.top].style.zIndex = '1';
      L[nx].style.zIndex = '2';
      f.top = nx;
    }

    var token = {}; dvdToken = token; var prev = null;
    function step(ts) {
      if (dvdToken !== token) return;
      if (prev == null) prev = ts;
      var dt = Math.min(60, ts - prev) / 1000; prev = ts;
      var bw = floats.clientWidth, bh = floats.clientHeight;
      for (var k = 0; k < frames.length; k++) {
        var f = frames[k];
        f.x += f.vx * dt; f.y += f.vy * dt;
        var hit = false;
        if (f.x <= 0) { f.x = 0; f.vx = Math.abs(f.vx); hit = true; }
        else if (f.x + f.w >= bw) { f.x = bw - f.w; f.vx = -Math.abs(f.vx); hit = true; }
        if (f.y <= 0) { f.y = 0; f.vy = Math.abs(f.vy); hit = true; }
        else if (f.y + f.h >= bh) { f.y = bh - f.h; f.vy = -Math.abs(f.vy); hit = true; }
        if (hit) swap(f);
        f.el.style.transform = 'translate(' + f.x + 'px,' + f.y + 'px)';
      }
      rafId = window.requestAnimationFrame(step);
    }
    rafId = window.requestAnimationFrame(step);
  }

  function scheduleSwap(imgEl, durSec, offsetSec, pool) {
    // Bytt bilde nær bunnen av fade-syklusen (opacity ~0).
    var period = durSec * 1000;
    var t = setInterval(function () {
      var nx = pool[Math.floor(Math.random() * pool.length)];
      if (nx) imgEl.src = nx;
    }, period);
    timers.push(t);
  }

  // ── A: rullende bånd ──
  function renderA(c, pool) {
    var anchor = anchorFor(c.placement);
    if (!anchor) return;
    var n = 12; // fast antall distinkte bilder (loopen dupliseres) — antall styres ikke for A
    var imgs = pickN(pool, n);

    var band = document.createElement('div');
    band.className = 'hg-band' + (/right/.test(c.direction) ? ' hg-rev' : '');
    band.style.setProperty('--d', (45 * (100 / c.speed)).toFixed(0) + 's');

    var track = document.createElement('div');
    track.className = 'hg-band__track';
    [0, 1].forEach(function () {
      imgs.forEach(function (src) {
        var it = document.createElement('div');
        it.className = 'hg-band__item';
        var im = document.createElement('img'); im.src = src; im.alt = ''; im.loading = 'lazy';
        it.appendChild(im);
        it.addEventListener('click', function () { openLb(src); });
        track.appendChild(it);
      });
    });
    band.appendChild(track);

    var cta = document.createElement('div');
    cta.className = 'hg-band__cta';
    cta.innerHTML = '<a class="btn btn--gold" href="galleri.html">Se hele galleriet <span class="arr">→</span></a>';
    band.appendChild(cta);

    anchor.appendChild(band);
    injected.push(band);
  }

  // ── B: mosaikk (fyller alltid hele rutenettet — ingen tomrom) ──
  function renderB(c, pool) {
    var anchor = anchorFor(c.placement);
    if (!anchor) return;
    var cols = 4;
    var R = Math.max(2, Math.min(4, Math.round((c.count || 8) / 4) || 2));
    var area = cols * R;
    var specs;
    if (c.mosaicSizes === 'uniform') {
      specs = [];
      for (var u = 0; u < area; u++) specs.push('');               // alle 1×1
    } else {
      // Ett 2×2 storfelt + to 2×1 brede i toppradene, resten 1×1 — tiler perfekt.
      specs = ['cell--big', 'cell--wide', 'cell--wide'];
      for (var s = 0; s < area - 8; s++) specs.push('');
    }
    var imgs = pickN(pool, specs.length);

    var sec = sectionShell(c, 'hg-section--paper');
    var grid = document.createElement('div');
    grid.className = 'hg-mosaic';
    specs.forEach(function (cls, i) {
      var cell = document.createElement('div');
      cell.className = 'cell' + (cls ? ' ' + cls : '');
      var im = document.createElement('img'); im.src = imgs[i]; im.alt = ''; im.loading = 'lazy';
      cell.appendChild(im);
      cell.addEventListener('click', function () { openLb(imgs[i]); });
      grid.appendChild(cell);
    });
    sec.wrap.insertBefore(grid, sec.cta);
    anchor.appendChild(sec.root);
    injected.push(sec.root);
  }

  // ── C: polaroider (alltid fulle rader) ──
  function renderC(c, pool) {
    var anchor = anchorFor(c.placement);
    if (!anchor) return;
    var cols = 4;
    var R = Math.max(2, Math.min(3, Math.round((c.count || 8) / 4) || 2));
    var n = cols * R;
    var imgs = pickN(pool, n);
    var rot = [-4, 3, -2, 4, -3, 2, -3, 2, -4, 3, -2, 4];
    var framed = (c.polaStyle !== 'clean');

    var sec = sectionShell(c, 'hg-section--paper2');
    var row = document.createElement('div');
    row.className = 'hg-pola-row';
    row.style.setProperty('--cols', cols);
    imgs.forEach(function (src, i) {
      var p = document.createElement('div');
      p.className = 'hg-pola' + (framed ? '' : ' hg-pola--clean');
      p.style.transform = 'rotate(' + rot[i % rot.length] + 'deg)';
      if (framed) p.innerHTML = '<span class="hg-pola__tape"></span>';
      var im = document.createElement('img'); im.src = src; im.alt = ''; im.loading = 'lazy';
      p.appendChild(im);
      p.addEventListener('click', function () { openLb(src); });
      row.appendChild(p);
    });
    sec.wrap.insertBefore(row, sec.cta);
    anchor.appendChild(sec.root);
    injected.push(sec.root);
  }

  // Felles seksjons-skall for B/C (overskrift + ingress + «Se hele galleriet»)
  function sectionShell(c, bgClass) {
    var root = document.createElement('section');
    root.className = 'hg-section ' + bgClass;
    root.setAttribute('data-screen-label', 'Livet i Apeiron');
    var wrap = document.createElement('div');
    wrap.className = 'wrap';
    var head = document.createElement('div');
    head.className = 'hg-section__head';
    head.innerHTML = '<span class="eyebrow eyebrow--center">Av og for studenter</span>'
      + '<h2>' + esc(c.heading || '') + '</h2>'
      + (c.lede ? '<p>' + esc(c.lede) + '</p>' : '');
    var cta = document.createElement('div');
    cta.className = 'hg-section__cta';
    cta.innerHTML = '<a class="btn btn--gold" href="galleri.html">Se hele galleriet <span class="arr">→</span></a>';
    wrap.appendChild(head); wrap.appendChild(cta);
    root.appendChild(wrap);
    return { root: root, wrap: wrap, cta: cta };
  }

  function anchorFor(placement) {
    return document.getElementById(placement === 'before-medlem' ? 'hg-before-medlem' : 'hg-top');
  }
  function pickN(pool, n) {
    var p = shuffle(pool.slice());
    var out = [];
    for (var i = 0; i < n; i++) out.push(p[i % p.length]);
    return out;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  // ── Render ──
  function render() {
    clearAll();
    var c = cfg();
    if (!c.enabled) return;
    // Logo-motiver for DVD trenger ikke Drive-bilder — hopp over hentingen.
    if (c.style === 'D' && c.animation === 'dvd' && c.dvdMotif && c.dvdMotif !== 'photos') {
      renderD(c, []);
      return;
    }
    buildPool(function (pool) {
      if (!pool || !pool.length) return;
      // Bygg på nytt med ferskt config (kan ha endret seg mens vi hentet).
      clearAll();
      var cc = cfg();
      if (!cc.enabled) return;
      if (cc.style === 'D' && cc.animation === 'dvd' && cc.dvdMotif && cc.dvdMotif !== 'photos') { renderD(cc, []); return; }
      if (cc.style === 'A') renderA(cc, pool);
      else if (cc.style === 'B') renderB(cc, pool);
      else if (cc.style === 'C') renderC(cc, pool);
      else renderD(cc, pool);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();

  // ── Live forhåndsvisning fra Admin → Forsiden ──
  if (IS_PREVIEW) {
    window.addEventListener('message', function (e) {
      if (e.origin !== window.location.origin) return;
      var d = e.data;
      if (!d || d.type !== 'apeiron-index-preview') return;
      if (d.content) window.INDEX_CONTENT = d.content;
      render();
    });
  }

  // Eksponer for ev. ekstern bruk/feilsøking.
  window.ApeironHeroGallery = { render: render };
})();
