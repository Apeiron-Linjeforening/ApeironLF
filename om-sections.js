/* ============================================================
   om-sections.js — seksjonstyper for Apeiron (Apeiron-først)
   ------------------------------------------------------------
   Hver type registrerer seg i SectionTypes og eier ALT om sin
   seksjon på ett sted: standard-innhold (defaults), hvordan den
   tegnes (render) og evt. JS etter innsetting (mount).

   I denne fasen gjenskaper hver render NØYAKTIG dagens markup og
   CSS-klasser, slik at «data → identisk side» kan bevises. Tonen
   (ctx.tone) regnes ut av motoren og legges på som data-tone, men
   styrer ennå ikke bakgrunnen — det kobles på i tema-steget.

   Typene er destillert fra det Om oss-siden allerede bruker. De
   generaliseres til andre sider senere.
   ============================================================ */
(function () {
  'use strict';
  if (!window.SectionTypes) { console.error('section-engine.js må lastes før om-sections.js'); return; }
  var E = window.PageEngine.esc;

  // Liten hjelp: tegn lenke-rad (ekstern lenke får target=_blank).
  function linkRow(links) {
    return (links || []).map(function (l) {
      var href = l.href || '#';
      var ext = /^https?:/i.test(href);
      return '<a class="ally__link" href="' + E(href) + '"'
        + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + E(l.label) + ' \u2192</a>';
    }).join('');
  }

  /* ── BANNER — sidens topp-banner (subhero) ───────────────── */
  SectionTypes.define('banner', {
    label: 'Topp-banner', icon: '\u25A4',
    desc: 'Sidens hode: tilbake-lenke, tittel og ingress. Kan vise minimeny (\u00ABP\u00E5 denne siden\u00BB).',
    defaults: function () { return { back: 'Til forsiden', backHref: 'index.html', title: 'Ny side', lede: '', toc: false }; },
    render: function (p, s, ctx) {
      var lede = (p.lede || ctx.preview)
        ? '<p class="subhero__lede">' + E(p.lede) + '</p>' : '';
      return '<section class="subhero" id="' + E(s.id || 'banner') + '">'
        + '<img class="subhero__seal" src="assets/apeiron-logo.png" alt="" aria-hidden="true" />'
        + '<div class="subhero__inner">'
        + '<a class="subhero__back" href="' + E(p.backHref || 'index.html') + '">' + E(p.back || '') + '</a>'
        + '<h1>' + E(p.title || '') + '</h1>'
        + lede
        + '</div></section>';
    },
    // Minimeny (\u00ABP\u00E5 denne siden\u00BB): bygges fra seksjonenes data-screen-label,
    // s\u00E5 den alltid speiler seksjonene som faktisk er p\u00E5 siden. Plasseres
    // med lik luft mellom ingressen og vinduskanten (m\u00E5lt, ikke gjettet).
    mount: function (el, p) {
      if (!el || !p || !p.toc) return;
      var inner = el.querySelector('.subhero__inner');
      if (!inner) return;
      var secs = [].filter.call(document.querySelectorAll('#page section[data-screen-label]'), function (s) { return s.id; });
      if (!secs.length) return;
      var toc = document.createElement('nav');
      toc.className = 'hero-toc';
      toc.setAttribute('aria-label', 'Innhold p\u00E5 denne siden');
      var ttl = document.createElement('span');
      ttl.className = 'hero-toc__ttl'; ttl.textContent = 'P\u00E5 denne siden';
      toc.appendChild(ttl);
      secs.forEach(function (s) {
        var a = document.createElement('a');
        a.href = '#' + s.id;
        a.textContent = s.getAttribute('data-screen-label');
        toc.appendChild(a);
      });
      inner.appendChild(toc);
      var place = function () {
        if (window.innerWidth <= 900) { toc.style.left = ''; return; }
        var lede = inner.querySelector('.subhero__lede');
        var vw = document.documentElement.clientWidth;
        var textRight = lede ? lede.getBoundingClientRect().right : 660;
        var gap = (vw - textRight - toc.offsetWidth) / 2;
        if (gap < 24) gap = 24;
        toc.style.left = Math.round(textRight + gap - inner.getBoundingClientRect().left) + 'px';
      };
      place();
      // \u00E9n hero per side: bytt ut ev. gammel resize-lytter ved re-render
      if (window.__heroTocPlace) window.removeEventListener('resize', window.__heroTocPlace);
      window.__heroTocPlace = place;
      window.addEventListener('resize', place);
    }
  });

  /* ── ABOUT — «Hva er apeiron?»-komposisjonen ─────────────── */
  var HOURGLASS = '<svg class="about__hourglass" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h12M6 22h12M6 2c0 5 4 6 6 10 2-4 6-5 6-10M6 22c0-5 4-6 6-10 2 4 6 5 6 10"/></svg>';
  SectionTypes.define('about', {
    label: 'Intro-komposisjon', icon: '\u00B6',
    desc: 'Rik intro: gresk ord, avsnitt, fremhevet kort, teaser og nøkkeltall.',
    defaults: function () { return { eyebrow: '', heading: '', greek: '', greekSmall: '', paras: [], card: { title: '', body: '' }, teaser: null, stats: [] }; },
    render: function (p, s, ctx) {
      var paras = (p.paras || []).map(function (t, i) {
        return '<p' + (i === 0 ? ' class="about__p-first"' : '') + '>' + E(t) + '</p>';
      }).join('\n          ');
      var greek = (p.greek || ctx.preview)
        ? '<div class="about__greek">' + E(p.greek) + '\n          <small>' + E(p.greekSmall) + '</small>\n        </div>' : '';
      var card = p.card ? '<div class="about__card reveal d2">'
        + HOURGLASS
        + '<h3>' + E(p.card.title) + '</h3>'
        + '<p>' + E(p.card.body) + '</p></div>' : '';
      var teaser = p.teaser ? '<div class="about__teaser reveal d3">'
        + '<span class="eyebrow">' + E(p.teaser.eyebrow) + '</span>'
        + '<h4>' + E(p.teaser.title) + '</h4>'
        + '<p>' + E(p.teaser.body) + '</p>'
        + '<a class="btn btn--ghost" href="' + E(p.teaser.linkHref || '#') + '">'
        + '<span>' + E(p.teaser.linkLabel) + '</span> <span class="arr">\u2192</span></a>'
        + '</div>' : '';
      var stats = (p.stats && p.stats.length) ? '<div class="stats reveal">'
        + p.stats.map(function (st) {
          return '<div class="stat"><div class="stat__num">' + E(st.num) + '</div><div class="stat__lbl">' + E(st.lbl) + '</div></div>';
        }).join('') + '</div>' : '';
      // heading beholder den kursiverte «apeiron» (betrodd innhold fra side-data)
      var heading = p.heading || 'Hva er <em style="font-style:italic;color:var(--warm)">apeiron</em>?';
      return '<section class="section about" id="' + E(s.id || 'om') + '" data-screen-label="Om oss">'
        + '<div class="wrap"><div class="about__grid">'
        + '<div class="reveal">'
        + '<span class="eyebrow">' + E(p.eyebrow) + '</span>'
        + '<h2 class="h-section">' + heading + '</h2>'
        + greek
        + '\n          ' + paras
        + '</div>'
        + '<div>' + card + teaser + '</div>'
        + '</div>'
        + stats
        + '</div></section>';
    }
  });

  /* ── CARDGRID — sentrert header + 3 «ally»-kort ──────────── */
  SectionTypes.define('cardgrid', {
    label: 'Kort-rutenett', icon: '\u25A6',
    desc: 'Overskrift og kort med symbol, merkelapp, tekst og lenker.',
    defaults: function () { return { eyebrow: '', heading: 'Ny seksjon', lede: '', cards: [] }; },
    render: function (p, s, ctx) {
      var cards = (p.cards || []).map(function (c, i) {
        var delay = i === 0 ? '' : ' d' + i;
        // «imagesFrom: tillitsvalgte» → hent portrettene automatisk fra hvem som
        // er satt som PTV/ITV/FTV i Hjelp (studier-kortenes holderImg). Faller
        // tilbake til de manuelt valgte c.images hvis ingen innehavere er satt.
        var imgs = c.images || [];
        if (c.imagesFrom === 'tillitsvalgte') {
          var tvCards = (window.HJELP_CONTENT && window.HJELP_CONTENT.studier && window.HJELP_CONTENT.studier.cards) || [];
          var derived = tvCards.map(function (t) { return t && t.holderImg; }).filter(Boolean);
          if (derived.length) imgs = derived;
        }
        var avatars = imgs.map(function (img) {
          return '<img src="' + E(img) + '" alt="" loading="lazy">';
        }).join('');
        if (c.imagesMore) avatars += '<span class="ally__avatars-more">' + E(c.imagesMore) + '</span>';
        var avRow = avatars ? '<div class="ally__avatars">' + avatars + '</div>' : '';
        return '<article class="ally reveal' + delay + '">'
          + '<span class="ally__glyph" aria-hidden="true">' + E(c.glyph) + '</span>'
          + '<span class="prog__level">' + E(c.level) + '</span>'
          + '<h3>' + E(c.title) + '</h3>'
          + avRow
          + '<p>' + E(c.body) + '</p>'
          + '<div class="ally__links">' + linkRow(c.links) + '</div>'
          + '</article>';
      }).join('\n      ');
      var lede = (p.lede || ctx.preview) ? '<p class="lede">' + E(p.lede) + '</p>' : '';
      return '<section class="section allies" id="' + E(s.id || 'kort') + '"'
        + (p.screenLabel ? ' data-screen-label="' + E(p.screenLabel) + '"' : '') + '>'
        + '<div class="wrap">'
        + '<div class="center center--head">'
        + '<span class="eyebrow eyebrow--center">' + E(p.eyebrow) + '</span>'
        + '<h2 class="h-section">' + E(p.heading) + '</h2>'
        + lede
        + '</div>'
        + '<div class="ally__grid">' + cards + '</div>'
        + '</div></section>';
    }
  });

  /* ── LESESAL — tekst + funksjonsliste + bildegalleri ─────── */
  var LS_ICONS = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
  ];
  SectionTypes.define('lesesal', {
    label: 'Tekst + galleri', icon: '\u25A5',
    desc: 'Tekst og funksjonsliste på én side, bildegalleri med lightbox på den andre.',
    defaults: function () { return { eyebrow: '', heading: 'Galleri', lede: '', features: [], mainImage: '' }; },
    render: function (p, s, ctx) {
      var feats = (p.features || []).map(function (f, i) {
        return '<li>' + (LS_ICONS[i % LS_ICONS.length])
          + '<div><strong>' + E(f.title) + '</strong><span>' + E(f.body) + '</span></div></li>';
      }).join('\n          ');
      var mainImg = p.mainImage || 'assets/lesesalen/lesesal1.jpg';
      return '<section class="section lesesal" id="' + E(s.id || 'lesesalen') + '" data-screen-label="Lesesalen">'
        + '<div class="wrap"><div class="lesesal__grid">'
        + '<div class="reveal">'
        + '<span class="eyebrow">' + E(p.eyebrow) + '</span>'
        + '<h2 class="h-section">' + E(p.heading) + '</h2>'
        + '<p class="lesesal__lede">' + E(p.lede) + '</p>'
        + '<ul class="lesesal__features">\n          ' + feats + '\n        </ul>'
        + '</div>'
        + '<div class="lesesal__gallery reveal d1">'
        + '<div class="lesesal__img-main">'
        + '<image-slot id="ls1" shape="rect" placeholder="Lesesalen \u2014 oversiktsbilde" src="' + E(mainImg) + '"></image-slot>'
        + '</div>'
        + '<div class="lesesal__marquee-wrap"><div class="lesesal__marquee-track" id="lesesal-marquee"></div></div>'
        + '</div>'
        + '</div></div></section>';
    },
    // Bildegalleri + lightbox — flyttet ut av inline-script til mount-hook.
    mount: function (el, p) {
      (function () {
        var probe = function (src) {
          return new Promise(function (resolve) {
            var img = new Image();
            img.onload = function () { resolve(true); };
            img.onerror = function () { resolve(false); };
            img.src = src;
          });
        };
        var track = document.getElementById('lesesal-marquee');
        var mainSrc = p.mainImage || 'assets/lesesalen/lesesal1.jpg';
        (async function () {
          var found = [];
          for (var i = 2; i <= 99; i++) {
            var src = 'assets/lesesalen/lesesal' + i + '.jpg';
            if (!await probe(src)) break;
            found.push(src);
          }
          var allSrcs = [mainSrc].concat(found);
          var lb = document.getElementById('lsLb');
          var lbImg = document.getElementById('lsLbImg');
          var lbInfo = document.getElementById('lsLbInfo');
          var lbIdx = 0;
          function showLb(idx) {
            if (!lb || !lbImg) return;
            lbIdx = ((idx % allSrcs.length) + allSrcs.length) % allSrcs.length;
            lbImg.src = allSrcs[lbIdx];
            if (lbInfo) lbInfo.textContent = (lbIdx + 1) + ' / ' + allSrcs.length;
            lb.classList.add('is-open');
            document.body.style.overflow = 'hidden';
          }
          function closeLb() {
            if (!lb) return;
            lb.classList.remove('is-open');
            document.body.style.overflow = '';
            lbImg.src = '';
          }
          if (lb && lbImg && lbInfo) {
            var bx = document.getElementById('lsLbClose'); if (bx) bx.onclick = closeLb;
            var bp = document.getElementById('lsLbPrev'); if (bp) bp.onclick = function () { showLb(lbIdx - 1); };
            var bn = document.getElementById('lsLbNext'); if (bn) bn.onclick = function () { showLb(lbIdx + 1); };
            lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
            document.addEventListener('keydown', function (e) {
              if (!lb.classList.contains('is-open')) return;
              if (e.key === 'ArrowLeft') showLb(lbIdx - 1);
              if (e.key === 'ArrowRight') showLb(lbIdx + 1);
              if (e.key === 'Escape') closeLb();
            });
          }
          var mainSlot = document.getElementById('ls1');
          if (mainSlot) mainSlot.addEventListener('click', function () { showLb(0); });
          if (!found.length || !track) return;
          var make = function (src, i, suffix) {
            var elm = document.createElement('image-slot');
            elm.id = 'ls' + i + suffix;
            elm.setAttribute('shape', 'rect');
            elm.setAttribute('placeholder', 'Lesesalen \u2014 bilde ' + i);
            elm.setAttribute('src', src);
            return elm;
          };
          found.forEach(function (src, idx) {
            var a = make(src, idx + 2, ''); a.addEventListener('click', function () { showLb(idx + 1); }); track.appendChild(a);
          });
          found.forEach(function (src, idx) {
            var b = make(src, idx + 2, 'b'); b.addEventListener('click', function () { showLb(idx + 1); }); track.appendChild(b);
          });
        })();
      })();
    }
  });

  /* ── JOIN — «Bli medlem» (maroon band + medlemskort) ─────── */
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>';
  SectionTypes.define('join', {
    label: 'Handlingsbanner', icon: '\u2605',
    desc: 'Fremhevet «bli med»-seksjon med fordeler og medlemskort.',
    defaults: function () { return { eyebrow: '', heading: 'Bli medlem', lede: '', benefits: [], cardTitle: 'Medlemskap', ctaLabel: 'Meld deg inn', ctaHref: 'index.html#kontakt' }; },
    render: function (p, s, ctx) {
      var benefits = (p.benefits || []).map(function (b) {
        return '<li>' + CHECK + ' ' + E(b) + '</li>';
      }).join('\n          ');
      return '<section class="section join" id="' + E(s.id || 'bli-medlem') + '" data-screen-label="Bli medlem">'
        + '<div class="wrap"><div class="join__grid">'
        + '<div class="reveal">'
        + '<span class="eyebrow">' + E(p.eyebrow) + '</span>'
        + '<h2 class="h-section">' + E(p.heading) + '</h2>'
        + '<p class="join__lede">' + E(p.lede) + '</p>'
        + '<ul class="join__benefits">\n          ' + benefits + '\n        </ul>'
        + '</div>'
        + '<div class="join__card reveal d2">'
        + '<div class="join__tiers" id="joinTiers"></div>'
        + '<h3>' + E(p.cardTitle || 'Medlemskap') + '</h3>'
        + '<ol class="join__steps" id="joinSteps"></ol>'
        + '<a class="btn btn--maroon btn--full" href="' + E(p.ctaHref || 'index.html#kontakt') + '">' + E(p.ctaLabel || 'Meld deg inn i dag') + '</a>'
        + '</div>'
        + '</div></div></section>';
    }
    // #joinTiers / #joinSteps fylles av membership.js fra membership-config.js
  });

  /* ── FAQ — sentrert header + trekkspill ──────────────────── */
  SectionTypes.define('faq', {
    label: 'Ofte stilte spørsmål', icon: '?',
    desc: 'Spørsmål og svar i et trekkspill.',
    defaults: function () { return { eyebrow: 'Spørsmål?', heading: 'Ofte stilte spørsmål', items: [] }; },
    render: function (p, s, ctx) {
      var items = (p.items || []).map(function (it) {
        return '<div class="faq__item">'
          + '<button class="faq__q">' + E(it.q) + '</button>'
          + '<div class="faq__a"><p>' + E(it.a) + '</p></div>'
          + '</div>';
      }).join('\n      ');
      return '<section class="section faq-sec" id="' + E(s.id || 'faq') + '" data-screen-label="FAQ">'
        + '<div class="wrap">'
        + '<div class="center center--head">'
        + '<span class="eyebrow eyebrow--center">' + E(p.eyebrow) + '</span>'
        + '<h2 class="h-section">' + E(p.heading) + '</h2>'
        + '</div>'
        + '<div class="faq reveal faq--narrow">' + items + '</div>'
        + '</div></section>';
    }
    // accordion wires fra app.js (.faq__q) — identisk markup, samme oppførsel
  });
})();
