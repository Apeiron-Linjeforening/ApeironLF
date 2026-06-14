/* ============================================================
   membership.js — fyller «Bli medlem»-kortet fra membership-config.js
   Statisk fallback-markup i index.html vises hvis konfigurasjonen mangler.
   ============================================================ */
(function () {
  var cfg = window.MEMBERSHIP_CONFIG;
  if (!cfg) return;

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  // Prisnivåer
  var tiersEl = document.getElementById('joinTiers');
  if (tiersEl && Array.isArray(cfg.tiers) && cfg.tiers.length) {
    tiersEl.innerHTML = cfg.tiers.map(function (t) {
      return '<div class="join__tier">'
        + '<div class="join__tier-head">'
        + '<span class="join__tier-label">' + esc(t.label) + '</span>'
        + '<span class="join__tier-price">' + esc(t.price) + ',–</span>'
        + '</div>'
        + (t.note ? '<p class="join__tier-note">' + esc(t.note) + '</p>' : '')
        + '</div>';
    }).join('');
  }

  // Innmeldingssteg ({vipps}/{navn} fylles inn fra config)
  var stepsEl = document.getElementById('joinSteps');
  if (stepsEl && Array.isArray(cfg.steps) && cfg.steps.length) {
    stepsEl.innerHTML = cfg.steps.map(function (txt, i) {
      var filled = String(txt)
        .replace(/\{vipps\}/g, '<b>' + esc(cfg.vippsNumber || '') + '</b>')
        .replace(/\{navn\}/g, esc(cfg.vippsName || ''));
      return '<li><span class="n">' + (i + 1) + '</span> ' + filled + '</li>';
    }).join('');
  }
})();
