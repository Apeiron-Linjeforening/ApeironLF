/* apeiron-galleri.js — gjengir topp-banneret på Galleri-siden (galleri.html)
   fra galleri-content.js (window.GALLERI_CONTENT). Bildene styres av Drive-
   skriptet i galleri.html; her settes bare subhero-teksten.

   På den ekte siden beholdes HTML-en som fallback hvis et felt mangler; i
   preview speiles innholdet nøyaktig.

   Preview-protokoll: galleri.html?preview=1 lytter etter
     postMessage({ type:'apeiron-galleri-preview', content })
   og melder fra med 'apeiron-galleri-preview-ready' / '-height'. */
(function () {
  'use strict';

  var IS_PREVIEW = false;
  try { IS_PREVIEW = /[?&]preview\b/.test(location.search); } catch (e) {}

  function setText(id, val) {
    var el = document.getElementById(id);
    if (!el) return;
    if (IS_PREVIEW) { el.textContent = (val == null ? '' : val); return; }
    if (val != null && val !== '') el.textContent = val;
  }

  function render() {
    var C = window.GALLERI_CONTENT || {};
    var sh = C.subhero || {};
    setText('ix-gl-back', sh.back);
    setText('ix-gl-title', sh.title);
    setText('ix-gl-lede', sh.lede);
  }

  render();

  if (IS_PREVIEW) {
    var notify = function () {
      try { parent.postMessage({ type: 'apeiron-galleri-preview-height', height: document.documentElement.scrollHeight }, '*'); } catch (e) {}
    };
    window.addEventListener('message', function (e) {
      var d = e.data;
      if (!d || d.type !== 'apeiron-galleri-preview') return;
      if (d.content) window.GALLERI_CONTENT = d.content;
      render();
      notify();
    });
    try { parent.postMessage({ type: 'apeiron-galleri-preview-ready' }, '*'); } catch (e) {}
  }
})();
