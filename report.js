/* ============================================================
   report.js — «Rapporter en feil på nettsiden»
   Erstatter det at fot-lenken sender deg rett inn i e-postklienten.
   I stedet åpnes en liten boks som forklarer og lar deg velge:
   kopiere e-postadressen ELLER åpne e-post selv.

   Selvstendig: injiserer egen CSS + modal én gang og fanger klikk på
   alle .footer__report a. Lenkens mailto: beholdes som fallback om
   JavaScript er av.
   ============================================================ */
(function () {
  'use strict';
  var EMAIL = 'apeironlinjeforening@gmail.com';
  var SUBJECT = 'Feil på nettsiden';

  function injectCss() {
    var css =
      '.report-ov{position:fixed;inset:0;background:rgba(20,22,38,.55);display:none;' +
        'align-items:center;justify-content:center;z-index:9999;padding:20px;}' +
      '.report-ov.on{display:flex;}' +
      '.report-box{background:var(--card,#fff);color:var(--ink,#1a1d2e);max-width:420px;width:100%;' +
        'border:1px solid var(--line,rgba(0,0,0,.15));border-radius:8px;padding:22px 22px 20px;' +
        'box-shadow:0 24px 60px -20px rgba(0,0,0,.5);font-family:var(--body,system-ui,sans-serif);}' +
      '.report-box h3{font-family:var(--display,Georgia,serif);font-size:1.4rem;margin:0 0 8px;color:var(--ink,#1a1d2e);}' +
      '.report-box p{font-size:.92rem;line-height:1.5;color:var(--ink-soft,#4a4d63);margin:0 0 14px;}' +
      '.report-mail{display:flex;align-items:center;gap:8px;background:var(--paper,#f4ecd9);' +
        'border:1px solid var(--line,rgba(0,0,0,.15));border-radius:5px;padding:9px 11px;margin-bottom:14px;}' +
      '.report-mail code{font-family:monospace;font-size:.9rem;color:var(--ink,#1a1d2e);flex:1;word-break:break-all;}' +
      '.report-actions{display:flex;gap:8px;flex-wrap:wrap;}' +
      '.report-btn{flex:1;min-width:120px;cursor:pointer;border-radius:5px;padding:9px 12px;font-size:.9rem;' +
        'font-family:inherit;border:1px solid var(--maroon,#76110f);}' +
      '.report-btn--primary{background:var(--maroon,#76110f);color:#fff;}' +
      '.report-btn--ghost{background:transparent;color:var(--maroon,#76110f);}' +
      'html[data-mode="marine"] .report-btn{border-color:var(--gold,#d4af37);}' +
      'html[data-mode="marine"] .report-btn--primary{background:var(--gold,#d4af37);color:var(--navy,#232740);}' +
      'html[data-mode="marine"] .report-btn--ghost{color:var(--gold,#d4af37);}' +
      '.report-close{margin-top:12px;background:none;border:none;color:var(--ink-soft,#4a4d63);' +
        'font-size:.82rem;cursor:pointer;text-decoration:underline;text-underline-offset:2px;display:block;}';
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  function build() {
    var ov = document.createElement('div');
    ov.className = 'report-ov';
    ov.innerHTML =
      '<div class="report-box" role="dialog" aria-modal="true" aria-label="Rapporter en feil">' +
        '<h3>Rapporter en feil</h3>' +
        '<p>Fant du noe som ikke fungerer? Send oss en kort beskrivelse på e-post, ' +
          'gjerne med hvilken side det gjelder. Tusen takk for hjelpen!</p>' +
        '<div class="report-mail"><code>' + EMAIL + '</code>' +
          '<button type="button" class="report-btn report-btn--ghost" data-copy>Kopier</button></div>' +
        '<div class="report-actions">' +
          '<a class="report-btn report-btn--primary" data-open ' +
            'href="mailto:' + EMAIL + '?subject=' + encodeURIComponent(SUBJECT) + '">Åpne e-post</a>' +
        '</div>' +
        '<button type="button" class="report-close" data-close>Lukk</button>' +
      '</div>';
    document.body.appendChild(ov);

    function close() { ov.classList.remove('on'); }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-close]').addEventListener('click', close);
    ov.querySelector('[data-open]').addEventListener('click', close);
    ov.querySelector('[data-copy]').addEventListener('click', function () {
      var btn = this;
      var done = function () { btn.textContent = 'Kopiert ✓'; setTimeout(function () { btn.textContent = 'Kopier'; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(done, function () {});
      } else {
        var t = document.createElement('textarea'); t.value = EMAIL; document.body.appendChild(t);
        t.select(); try { document.execCommand('copy'); done(); } catch (_) {} document.body.removeChild(t);
      }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    return ov;
  }

  function init() {
    var links = document.querySelectorAll('.footer__report a');
    if (!links.length) return;
    injectCss();
    var ov = build();
    Array.prototype.forEach.call(links, function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); ov.classList.add('on'); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
