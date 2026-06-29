/* ============================================================
   site-chrome.js — delt meny (header + mobilmeny) og footer
   Injiseres på alle offentlige sider, så menyen og footeren
   vedlikeholdes ETT sted. Mønster som report.js (selvstendig).

   Hver side har to ankre i <body>:
     <div id="site-nav"></div>      (øverst, rett etter <body>)
     <div id="site-footer"></div>   (nederst, før skriptene)
   Dette skriptet bytter dem ut med ferdig markup og kobler på
   all nav-oppførsel (sticky, scrollspy, dropdown-markering,
   mobilmeny) — på ALLE sider, slik at «du er her» virker overalt.

   Footer-innholdet kommer fra window.SITE_FOOTER (site-content.js),
   som kan redigeres i Admin-senteret → Footer.
   ============================================================ */
(function () {
  'use strict';

  var CUR = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (!CUR) CUR = 'index.html';

  function pageOf(href) {
    return (href || '').split('#')[0].split('?')[0].split('/').pop().toLowerCase();
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ─── Meny-markup bygges fra window.SITE_NAV (nav-content.js) ───
     Lenker til index-seksjoner skrives som "index.html#anker" så de virker fra
     alle sider; localizeHrefs() forkorter dem til "#anker" på selve forsiden.
     Header-menyen (desktop) får SAMME DOM som før, så scrollspy/aktiv-markering
     virker uendret. Mobilmenyen bygges nå som sammenleggbare seksjoner. */
  function navData() {
    return (window.SITE_NAV && window.SITE_NAV.length) ? window.SITE_NAV : [];
  }
  function hasKids(it) { return it && it.children && it.children.length; }

  // Desktop: én rad med lenker + nedtrekksmenyer
  function buildHeaderLinks() {
    return navData().filter(function (it) { return !it.drawerOnly; }).map(function (it) {
      if (hasKids(it)) {
        var sub = it.children.map(function (c) {
          return '<a href="' + esc(c.href) + '">' + esc(c.label) + '</a>';
        }).join('');
        return '<div class="nav__dropdown">' +
          '<a class="nav__drop-trigger" href="' + esc(it.href) + '">' + esc(it.label) +
            ' <span class="nav__caret">▾</span></a>' +
          '<div class="nav__drop-menu">' + sub + '</div>' +
        '</div>';
      }
      return '<a href="' + esc(it.href) + '" class="nav__top">' + esc(it.label) + '</a>';
    }).join('');
  }

  function buildNav() {
    return '<header class="nav" id="nav">' +
      '<a class="nav__brand" href="index.html#top">' +
        '<img src="assets/apeiron-logo.png" alt="Apeiron segl" />' +
        '<span><span class="nm">APEIRON</span><span class="sub">Filosofi &amp; Etikk · NTNU</span></span>' +
      '</a>' +
      '<span class="nav__spacer" data-spacer="l"></span>' +
      '<nav class="nav__links">' + buildHeaderLinks() + '</nav>' +
      '<span class="nav__spacer" data-spacer="r"></span>' +
      '<button class="nav__color-toggle" id="colorToggle" type="button" data-color-toggle aria-label="Bytt fargemodus">' +
        '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>' +
        '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' +
      '</button>' +
      '<button class="nav__search-btn" type="button" aria-label="Søk på nettstedet">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>' +
        '<span class="nav__search-hint">Søk</span>' +
      '</button>' +
      '<button class="nav__burger" id="burger" aria-label="Åpne meny" aria-expanded="false"><span></span><span></span><span></span></button>' +
    '</header>';
  }

  // Mobil: skuff med sammenleggbare seksjoner (samme struktur som desktop —
  // nedtrekksmenyer → sammenleggbare seksjoner, vanlige lenker → direkte lenker).
  function buildDrawer() {
    var items = navData().map(function (it) {
      if (hasKids(it)) {
        var links = it.children.map(function (c) {
          return '<a href="' + esc(c.href) + '">' + esc(c.label) + '</a>';
        }).join('');
        return '<div class="drawer__sec">' +
          '<button class="drawer__sec-head" type="button" aria-expanded="false">' +
            '<span>' + esc(it.label) + '</span>' +
            '<span class="drawer__chev" aria-hidden="true">▾</span>' +
          '</button>' +
          '<div class="drawer__sec-body"><div class="drawer__sec-inner">' + links + '</div></div>' +
        '</div>';
      }
      return '<a class="drawer__link" href="' + esc(it.href) + '">' + esc(it.label) + '</a>';
    }).join('');
    return '<div class="drawer" id="drawer">' +
      '<button class="drawer__close" id="drawerClose" type="button" aria-label="Lukk meny">✕</button>' +
      '<div class="drawer__inner">' +
        '<a class="drawer__brand" href="index.html#top">' +
          '<img src="assets/apeiron-logo.png" alt="Apeiron segl" />' +
          '<span><span class="nm">APEIRON</span><span class="sub">Filosofi &amp; Etikk · NTNU</span></span>' +
        '</a>' +
        '<nav class="drawer__nav">' + items + '</nav>' +
        '<button class="drawer__mode" type="button" data-color-toggle aria-label="Bytt fargemodus">' +
          '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>' +
          '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' +
          '<span class="drawer__mode-label drawer__mode-label--dark">Mørk modus</span>' +
          '<span class="drawer__mode-label drawer__mode-label--light">Lys modus</span>' +
        '</button>' +
      '</div>' +
    '</div>';
  }

  /* ─── Ikoner for sosiale lenker (felles sett i footer-icons.js) ─── */
  var ICONS = window.FOOTER_ICONS || {};

  /* ─── Bygg footeren fra window.SITE_FOOTER ─── */
  function buildFooter() {
    var f = window.SITE_FOOTER || {};
    var links = (f.links || []).map(function (l) {
      return '<a href="' + esc(l.href) + '">' + esc(l.label) + '</a>';
    }).join('');
    var social = (f.social || []).map(function (s) {
      var ic = ICONS[(s.icon || '').toLowerCase()] || '';
      return '<a href="' + esc(s.href) + '" target="_blank" rel="noopener" aria-label="' + esc(s.label) + '">' +
        ic + ' ' + esc(s.label) + '</a>';
    }).join('');
    var rep = f.report || {};
    var mailto = 'mailto:' + esc(rep.email || '') +
      (rep.subject ? '?subject=' + encodeURIComponent(rep.subject) : '');
    // begrep.html bruker en mørkere footer-bakgrunn
    var style = CUR === 'begrep.html'
      ? ' style="background:#060606; border-top:1px solid rgba(240,236,224,.08);"' : '';
    return '<footer class="footer"' + style + '>' +
      '<div class="wrap">' +
        '<img src="assets/apeiron-logo.png" alt="Apeiron segl" />' +
        '<div class="footer__name">' + esc(f.name || '') + '</div>' +
        '<div class="footer__tag">' + esc(f.tagline || '') + '</div>' +
        '<div class="footer__links">' + links + '</div>' +
        '<div class="footer__fine">' + esc(f.fine || '') + '</div>' +
        (social ? '<div class="footer__social">' + social + '</div>' : '') +
        (rep.email ? '<div class="footer__report"><a href="' + mailto + '">' + esc(rep.label || 'Rapporter en feil') + '</a></div>' : '') +
        '<div class="footer__admin" style="margin-top:16px"><a href="admin.html" style="font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;opacity:.38;color:inherit;transition:opacity .2s" onmouseover="this.style.opacity=.85" onmouseout="this.style.opacity=.38">Admin</a></div>' +
      '</div>' +
    '</footer>';
  }

  function replaceAnchor(id, html) {
    var el = document.getElementById(id);
    if (!el) return;
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    var frag = document.createDocumentFragment();
    while (tmp.firstChild) frag.appendChild(tmp.firstChild);
    el.parentNode.replaceChild(frag, el);
  }

  /* Forkort "denne-siden.html#anker" → "#anker" så det blir mykt scroll på egen side. */
  function localizeHrefs(scope) {
    scope.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      var hash = href.indexOf('#');
      if (hash > 0 && pageOf(href) === CUR) a.setAttribute('href', href.slice(hash));
    });
  }

  /* Side-basert «du er her»-markering (flyttet fra app.js, kjører nå på alle sider). */
  function markActive() {
    document.querySelectorAll('.nav__links .nav__dropdown').forEach(function (dd) {
      var trigger = dd.querySelector('.nav__drop-trigger');
      if (!trigger) return;
      var match = pageOf(trigger.getAttribute('href')) === CUR;
      dd.querySelectorAll('.nav__drop-menu a').forEach(function (a) {
        if (pageOf(a.getAttribute('href')) === CUR) { a.classList.add('is-active'); match = true; }
      });
      if (match) {
        trigger.classList.add('nav__drop-trigger--active');
        trigger.setAttribute('data-page-active', '');
      }
    });
    document.querySelectorAll('.nav__links > a').forEach(function (a) {
      if (a.classList.contains('nav__cta')) return;
      if (pageOf(a.getAttribute('href')) === CUR) a.classList.add('is-active');
    });
  }

  /* ─── Plassering av lenkene på menylinja ───
     window.SITE_NAV_CONFIG.align: 0=venstre, 50=sentrert, 100=høyre (hakk på 5).
     To fleksible mellomrom (spacers) på hver side av lenkene fordeler ledig plass
     etter forholdet align : (100−align). */
  function applyNavAlign() {
    var cfg = window.SITE_NAV_CONFIG || {};
    var a = cfg.align;
    if (a === 'left') a = 0; else if (a === 'center') a = 50; else if (a === 'right') a = 100;
    a = Number(a); if (isNaN(a)) a = 0;
    a = Math.max(0, Math.min(100, a));
    var sl = document.querySelector('.nav__spacer[data-spacer="l"]');
    var sr = document.querySelector('.nav__spacer[data-spacer="r"]');
    if (sl) sl.style.flexGrow = String(a);
    if (sr) sr.style.flexGrow = String(100 - a);
  }

  /* ─── Nav-oppførsel (flyttet fra app.js) ─── */
  function wireNav() {
    var nav = document.getElementById('nav');

    // Sticky nav + eksponer nav-høyden som --nav-h (topp-nyhetsstripa henger
    // sticky rett under nav-en og trenger den faktiske høyden, som endrer seg
    // når nav-en krymper i «is-stuck»-tilstand).
    if (nav) {
      // Marker at JS styrer nav-kollapsen, så den harde fallback-media-queryen
      // (max-width:1120px) slås av. Da bestemmer den innholdsbaserte målingen
      // under når burgeren skal vises — ikke en fast breakpoint.
      document.documentElement.classList.add('nav-js');

      // Plassering av lenkene på linja (venstrelent/sentrert/høyrelent + finhakk)
      applyNavAlign();

      // Innholdsbasert kollaps: vis burgeren så snart desktop-lenkene ikke får
      // plass på topplinja — uansett hvor mange menypunkter som legges til.
      // Måler i utvidet tilstand: fjern klassen, les overflow, sett den igjen.
      var applyNavFit = function () {
        nav.classList.remove('is-collapsed');
        // +2px buffer mot avrunding; behold burger på ekte smale skjermer uansett
        if (nav.scrollWidth > nav.clientWidth + 2) nav.classList.add('is-collapsed');
      };
      applyNavFit();
      window.addEventListener('resize', applyNavFit);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(applyNavFit);

      var onScroll = function () {
        if (window.scrollY > 40) nav.classList.add('is-stuck');
        else nav.classList.remove('is-stuck');
        document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      onScroll();
    }

    // Scrollspy: marker nav-lenken for seksjonen i visning
    var spyLinks = Array.prototype.slice.call(
      document.querySelectorAll('.nav__links a[href^="#"]')
    ).filter(function (a) { return !a.classList.contains('nav__cta'); });
    var spyMap = spyLinks.map(function (a) {
      return { link: a, section: document.getElementById(a.getAttribute('href').slice(1)) };
    }).filter(function (m) { return m.section; });
    var allSections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));

    function onSpy() {
      var pos = window.scrollY + window.innerHeight / 2;
      var activeId = null;
      allSections.forEach(function (el) { if (el.offsetTop <= pos) activeId = el.id; });
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4 && allSections.length) {
        activeId = allSections[allSections.length - 1].id;
      }
      spyMap.forEach(function (m) { m.link.classList.toggle('is-active', m.section.id === activeId); });
    }
    if (spyMap.length) {
      window.addEventListener('scroll', onSpy, { passive: true });
      window.addEventListener('resize', onSpy);
      onSpy();
    }

    // Dropdown-trigger scrollspy + dynamisk etikett
    var allPageSections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
    var dropGroups = [];
    document.querySelectorAll('.nav__dropdown').forEach(function (dd) {
      var trigger = dd.querySelector('.nav__drop-trigger');
      if (!trigger) return;
      var firstNode = trigger.firstChild;
      var defaultText = (firstNode && firstNode.nodeType === 3) ? firstNode.nodeValue.trim() : '';
      var entries = Array.prototype.slice.call(
        dd.querySelectorAll('.nav__drop-menu a[href^="#"]')
      ).map(function (a) { return { id: a.getAttribute('href').slice(1), label: a.textContent.trim() }; });
      if (entries.length) dropGroups.push({ trigger: trigger, defaultText: defaultText, entries: entries });
    });
    var dropSectionIds = {};
    dropGroups.forEach(function (g) { g.entries.forEach(function (e) { dropSectionIds[e.id] = g; }); });
    function setTriggerLabel(btn, text) {
      var node = btn.firstChild;
      if (node && node.nodeType === 3) node.nodeValue = text + ' ';
    }
    var hasDropSections = dropGroups.length > 0 &&
      Object.keys(dropSectionIds).some(function (id) { return !!document.getElementById(id); });
    if (hasDropSections) {
      var updateDropTriggers = function () {
        var pos = window.scrollY + window.innerHeight / 2;
        var globalSection = null;
        allPageSections.forEach(function (el) { if (el.offsetTop <= pos) globalSection = el; });
        var globalId = globalSection ? globalSection.id : null;
        var activeGroup = globalId ? (dropSectionIds[globalId] || null) : null;
        dropGroups.forEach(function (g) {
          var scrollActive = activeGroup === g;
          var pageActive = g.trigger.hasAttribute('data-page-active');
          var label = g.defaultText;
          if (scrollActive) {
            var matched = g.entries.filter(function (e) { return e.id === globalId; })[0];
            if (matched) label = matched.label;
          }
          g.trigger.classList.toggle('nav__drop-trigger--active', scrollActive || pageActive);
          setTriggerLabel(g.trigger, label);
        });
      };
      window.addEventListener('scroll', updateDropTriggers, { passive: true });
      window.addEventListener('resize', updateDropTriggers);
      updateDropTriggers();
    }

    // Mobilmeny (skuff) med sammenleggbare seksjoner
    var burger = document.getElementById('burger');
    var drawer = document.getElementById('drawer');
    if (drawer) {
      var setOpen = function (open) {
        drawer.classList.toggle('is-open', open);
        document.body.style.overflow = open ? 'hidden' : '';
        if (burger) {
          burger.classList.toggle('is-open', open);
          burger.setAttribute('aria-expanded', open ? 'true' : 'false');
          burger.setAttribute('aria-label', open ? 'Lukk meny' : 'Åpne meny');
        }
      };
      var closeDrawer = function () { setOpen(false); };
      if (burger) {
        burger.addEventListener('click', function () {
          setOpen(!drawer.classList.contains('is-open'));
        });
      }
      var closeBtn = document.getElementById('drawerClose');
      if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
      // Et klikk på en faktisk lenke lukker skuffen (men ikke på seksjonshoder)
      drawer.querySelectorAll('a[href]').forEach(function (a) { a.addEventListener('click', closeDrawer); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
      });

      // Sammenleggbare seksjoner — åpne den som inneholder gjeldende side
      drawer.querySelectorAll('.drawer__sec').forEach(function (sec) {
        var head = sec.querySelector('.drawer__sec-head');
        if (!head) return;
        var hasCurrent = Array.prototype.some.call(sec.querySelectorAll('a[href]'), function (a) {
          return pageOf(a.getAttribute('href')) === CUR;
        });
        if (hasCurrent) { sec.classList.add('is-open'); head.setAttribute('aria-expanded', 'true'); }
        head.addEventListener('click', function () {
          var open = sec.classList.toggle('is-open');
          head.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
      });
    }
  }

  /* Side-basert «du er her»-markering i mobilmenyen. */
  function markActiveDrawer() {
    var drawer = document.getElementById('drawer');
    if (!drawer) return;
    drawer.querySelectorAll('a[href]').forEach(function (a) {
      if (pageOf(a.getAttribute('href')) === CUR) a.classList.add('is-active');
    });
  }

  /* ─── «Til toppen»-knapp: liten sirkel nede til høyre på alle sider ─── */
  function addToTop() {
    if (document.querySelector('.to-top')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'to-top';
    btn.setAttribute('aria-label', 'Til toppen av siden');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';
    btn.addEventListener('click', function () {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
    document.body.appendChild(btn);
    var onScroll = function () { btn.classList.toggle('is-visible', window.scrollY > 400); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function init() {
    replaceAnchor('site-nav', buildNav() + buildDrawer());
    replaceAnchor('site-footer', buildFooter());
    addToTop();
    var navLinks = document.querySelector('.nav__links');
    var drawer = document.getElementById('drawer');
    if (navLinks) localizeHrefs(navLinks);
    if (drawer) localizeHrefs(drawer);
    if (navLinks) markActive();
    if (drawer) markActiveDrawer();
    wireNav();
  }

  // Kjør så snart ankrene finnes (under parsing) så andre skript finner nav/footer.
  if (document.getElementById('site-nav') || document.getElementById('site-footer')) init();
  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
