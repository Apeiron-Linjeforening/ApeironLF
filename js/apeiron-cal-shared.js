/* ============================================================
   APEIRON — delte kalender-hjelpere
   ------------------------------------------------------------
   Små funksjoner som brukes av alle tre kalender-modulene på
   forsiden (apeiron-events.js, aporetisk-cal.js, apeiron-fadder.js).

   MÅ lastes FØR de tre filene i index.html. Modulene henter den
   defensivt (`window.ApeironCal || null`) og faller tilbake til
   ren tekst hvis den skulle mangle, så en feil rekkefølge gir
   ikke en blank seksjon.
   ============================================================ */
(function () {
  // Kartnål-ikon i samme strek-stil som de øvrige SVG-ene på siden.
  var PIN_SVG =
    '<svg class="cal-place__pin" width="12" height="12" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"/>' +
    '<circle cx="12" cy="10" r="2.6"/></svg>';

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  // «Sted»-feltet fra kalenderen → søk i Google Maps.
  function mapsUrl(place) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place || '');
  }

  // HTML-streng med klikkbart sted. `label` overstyrer visningsteksten
  // (brukes til «Se adresse» når adressen er for lang for raden).
  // Merk: esc() gjør & i URL-en om til &amp;, som er riktig i et
  // href-attributt satt via innerHTML.
  function placeLinkHTML(place, label) {
    var p = (place || '').trim();
    if (!p) return '';
    var text = label || p;
    var title = 'Åpne «' + p + '» i kart';
    return '<a class="cal-place" href="' + esc(mapsUrl(p)) + '"' +
      ' target="_blank" rel="noopener"' +
      ' title="' + esc(title) + '" aria-label="' + esc(title) + '">' +
      PIN_SVG + '<span>' + esc(text) + '</span></a>';
  }

  // Samme lenke bygget som DOM-node (for kallsteder som allerede
  // bruker createElement i stedet for innerHTML).
  function placeLinkEl(place, label) {
    var p = (place || '').trim();
    if (!p) return null;
    var a = document.createElement('a');
    a.className = 'cal-place';
    a.href = mapsUrl(p);
    a.target = '_blank';
    a.rel = 'noopener';
    a.title = 'Åpne «' + p + '» i kart';
    a.setAttribute('aria-label', a.title);
    a.innerHTML = PIN_SVG;
    var span = document.createElement('span');
    span.textContent = label || p;
    a.appendChild(span);
    return a;
  }

  // Parser HTML trygt: DOMParser kjører ALDRI skript eller event-handlere
  // (f.eks. <img onerror>), i motsetning til å sette innerHTML på et element.
  // Kalender-beskrivelsene kommer fra våre egne Google-kalendere, men dette
  // fjerner risikoen helt om en oppføring skulle inneholde ondsinnet markup.
  function parseHtml(s) {
    return new DOMParser().parseFromString(String(s == null ? '' : s), 'text/html');
  }
  // Kalenderbeskrivelser → ren tekst med linjeskiftene i behold.
  // Google sender avsnitt som <br> og <p>, og bruker &nbsp; flittig; uten
  // dette klistres setningene sammen og teksten brytes ikke i smale spalter.
  function stripHtml(s) {
    var src = String(s == null ? '' : s)
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, '\n');
    return (parseHtml(src).body.textContent || '')
      .replace(/\u00a0/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  window.ApeironCal = {
    mapsUrl: mapsUrl,
    placeLinkHTML: placeLinkHTML,
    placeLinkEl: placeLinkEl,
    parseHtml: parseHtml,
    stripHtml: stripHtml
  };
})();
