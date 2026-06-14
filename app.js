/* Apeiron — innholds-interaksjoner: FAQ, scroll-reveal, stat-teller.
   Nav/mobilmeny/scrollspy ligger nå i site-chrome.js (kjører på alle sider). */
(function () {
  // Lys/mørk modus håndteres av theme.js (lastet i <head>).
  // Header + footer + nav-oppførsel håndteres av site-chrome.js.

  // Year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

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
    var probeEl = document.getElementById('nav') || document.body;
    if (probeEl) probe.observe(probeEl);
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
