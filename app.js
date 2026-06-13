/* Apeiron — interaksjoner: nav, mobilmeny, FAQ, scroll-reveal */
(function () {
  // Year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Sticky nav
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add('is-stuck');
    else nav.classList.remove('is-stuck');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scrollspy: highlight the nav link for the section currently in view
  var spyLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"]')
  ).filter(function (a) { return !a.classList.contains('nav__cta'); });
  var spyMap = spyLinks.map(function (a) {
    var id = a.getAttribute('href').slice(1);
    return { link: a, section: document.getElementById(id) };
  }).filter(function (m) { return m.section; });

  var allSections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));

  function onSpy() {
    var pos = window.scrollY + window.innerHeight / 2; // section at viewport center wins
    var activeId = null;
    allSections.forEach(function (el) {
      if (el.offsetTop <= pos) activeId = el.id;
    });
    // near the very bottom, force-activate the last section
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
      activeId = allSections[allSections.length - 1].id;
    }
    spyMap.forEach(function (m) {
      m.link.classList.toggle('is-active', m.section.id === activeId);
    });
  }
  if (spyMap.length) {
    window.addEventListener('scroll', onSpy, { passive: true });
    window.addEventListener('resize', onSpy);
    onSpy();
  }

  // ── Dropdown trigger scrollspy: active highlight + dynamic label ──
  // Collects all page <section id="…"> elements so non-nav sections (e.g. #bli-medlem)
  // properly deactivate the dropdown group when scrolled into.
  var allPageSections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));

  var dropGroups = [];
  document.querySelectorAll('.nav__dropdown').forEach(function (dd) {
    var trigger = dd.querySelector('.nav__drop-trigger');
    if (!trigger) return;
    var firstNode = trigger.firstChild;
    var defaultText = (firstNode && firstNode.nodeType === 3)
      ? firstNode.nodeValue.trim() : '';
    // Only include links that point to a same-page anchor (#…)
    var entries = Array.prototype.slice.call(
      dd.querySelectorAll('.nav__drop-menu a[href^="#"]')
    ).map(function (a) {
      return { id: a.getAttribute('href').slice(1), label: a.textContent.trim() };
    });
    if (entries.length) {
      dropGroups.push({ trigger: trigger, defaultText: defaultText, entries: entries });
    }
  });

  // Build id → group lookup for O(1) matching
  var dropSectionIds = {};
  dropGroups.forEach(function (g) {
    g.entries.forEach(function (e) { dropSectionIds[e.id] = g; });
  });

  function setTriggerLabel(btn, text) {
    var node = btn.firstChild;
    if (node && node.nodeType === 3) node.nodeValue = text + ' ';
  }

  // Only activate on pages that actually contain the linked sections
  var hasDropSections = dropGroups.length > 0 &&
    Object.keys(dropSectionIds).some(function (id) {
      return !!document.getElementById(id);
    });

  if (hasDropSections) {
    var updateDropTriggers = function () {
      var pos = window.scrollY + window.innerHeight / 2;

      // Find the last section (including non-nav ones) whose top is above the fold
      var globalSection = null;
      allPageSections.forEach(function (el) {
        if (el.offsetTop <= pos) globalSection = el;
      });
      var globalId = globalSection ? globalSection.id : null;
      var activeGroup = globalId ? (dropSectionIds[globalId] || null) : null;

      dropGroups.forEach(function (g) {
        var isActive = activeGroup === g;
        var label = g.defaultText;
        if (isActive) {
          var matched = g.entries.filter(function (e) { return e.id === globalId; })[0];
          if (matched) label = matched.label;
        }
        g.trigger.classList.toggle('nav__drop-trigger--active', isActive);
        setTriggerLabel(g.trigger, label);
      });
    };

    window.addEventListener('scroll', updateDropTriggers, { passive: true });
    window.addEventListener('resize', updateDropTriggers);
    updateDropTriggers();
  }

  // Mobile drawer
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  function closeDrawer() {
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  if (burger) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  drawer.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeDrawer);
  });
  var dSearchBtn = drawer.querySelector('.drawer__search-row');
  if (dSearchBtn) dSearchBtn.addEventListener('click', closeDrawer);

  // FAQ accordion
  document.querySelectorAll('.faq__item').forEach(function (item) {
    var q = item.querySelector('.faq__q');
    var a = item.querySelector('.faq__a');
    function setHeight() {
      if (item.classList.contains('open')) a.style.maxHeight = a.scrollHeight + 'px';
    }
    // init open ones
    if (item.classList.contains('open')) setHeight();
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      // close all
      document.querySelectorAll('.faq__item').forEach(function (it) {
        it.classList.remove('open');
        it.querySelector('.faq__a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
    window.addEventListener('resize', function () {
      if (item.classList.contains('open')) a.style.maxHeight = a.scrollHeight + 'px';
    });
  });

  // Scroll reveal.
  // Primary: IntersectionObserver — animates each block as it scrolls into view
  // (works in every real browser). Fallback: a probe on an always-visible element
  // detects environments where IO never fires (offscreen iframes / capture
  // harnesses); only then do we reveal everything outright so nothing stays hidden.
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function revealAll() { reveals.forEach(function (el) { el.classList.add('in'); }); reveals.length = 0; }

  if (!('IntersectionObserver' in window)) {
    revealAll();
    // Allow late-injected content (events/fadderuke) to be revealed too.
    window.apeironRescanReveals = function () {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    };
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    reveals.forEach(function (el) { io.observe(el); });

    // Re-observe nodes injected after load (Google-kalender events, fadderuke).
    window.apeironRescanReveals = function () {
      document.querySelectorAll('.reveal:not(.in)').forEach(function (el) { io.observe(el); });
    };

    // Probe: observe the (always-visible-at-load) nav. If IO is alive it fires
    // almost immediately; if it hasn't fired within 700ms, IO is dead here.
    var ioAlive = false;
    var probe = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) ioAlive = true;
      probe.disconnect();
    }, {});
    probe.observe(document.getElementById('nav'));
    setTimeout(function () { if (!ioAlive) revealAll(); }, 700);
  }

  // Stat-tall: teller seg opp fra 0 når «Om oss»-båndet kommer i syne.
  // Bevarer suffiks (f.eks. «+»); ikke-numeriske verdier (∞) står stille.
  var statNums = Array.prototype.slice.call(document.querySelectorAll('.stat__num'));
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el) {
    var raw = el.textContent;
    var m = raw.match(/\d+/);
    if (!m) return;                       // ∞ o.l. — la stå
    var target = parseInt(m[0], 10);
    var suffix = raw.slice(m.index + m[0].length);
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var dur = 1100, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);   // ease-out cubic
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  if (statNums.length) {
    if (!('IntersectionObserver' in window)) {
      statNums.forEach(countUp);
    } else {
      var statIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { countUp(e.target); statIo.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      statNums.forEach(function (el) { statIo.observe(el); });
    }
  }
})();
