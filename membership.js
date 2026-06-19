/* ============================================================
   membership.js — fyller «Bli medlem»-kortet fra membership-config.js
   Statisk fallback-markup i index.html vises hvis konfigurasjonen mangler.
   ============================================================ */
(function () {
  var IS_PREVIEW = false;
  try { IS_PREVIEW = /[?&]preview\b/.test(location.search); } catch (e) {}

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  function renderMembership() {
    var cfg = window.MEMBERSHIP_CONFIG;
    if (!cfg) return;

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
  }

  renderMembership();

  /* ── Live forhåndsvisning fra Medlemskap-admin (index.html?preview=1) ──
     Lytter etter ny config og re-renderer «Bli medlem»-kortet. */
  if (IS_PREVIEW) {
    window.addEventListener('message', function (e) {
      var d = e.data;
      if (!d || d.type !== 'apeiron-membership-preview') return;
      if (d.content) window.MEMBERSHIP_CONFIG = d.content;
      renderMembership();
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      try { parent.postMessage({ type: 'apeiron-membership-preview-ready' }, '*'); } catch (_) {}
    });
    try { parent.postMessage({ type: 'apeiron-membership-preview-ready' }, '*'); } catch (_) {}
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }
})();
