/* ============================================================
   Apeiron — Nettstedsøk
   Brukes på alle sider. Legg til <script src="site-search.js">
   rett før </body> og .nav__search-btn i navbaren.
   ============================================================ */
(function () {

  /* ── Søkeindeks ── */
  var IDX = [
    /* Startside */
    { t: 'Om oss', d: 'Apeiron er linjeforeningen for filosofi og etikk ved NTNU siden 1981, et fellesskap uten faste grenser.', u: 'om-oss.html#om', g: 'Om oss' },
    { t: 'Studiet', d: 'Studieretningene filosofi og etikk, grader og løp ved NTNU.', u: 'pensum.html', g: 'Startside' },
    { t: 'Filosofi (studieretning)', d: 'Grunnleggende spørsmål om mennesket, verden og kunnskap. FI1001, FI1101, FI1003, FI1004, FI1005.', u: 'pensum.html', g: 'Startside' },
    { t: 'Etikk (studieretning)', d: 'Hvordan vi bør handle og leve, som individer og fellesskap. FI1210, FI1211, FI1002, FI2211.', u: 'pensum.html', g: 'Startside' },
    { t: 'Årsstudium i filosofi', d: '60 studiepoeng · 1 år · kan brukes som valgfrie emner i annen grad.', u: 'pensum.html', g: 'Startside' },
    { t: 'Årsstudium i etikk', d: '60 studiepoeng · 1 år (også deltid). Særlig godt for videre- og tilleggsutdanning.', u: 'pensum.html', g: 'Startside' },
    { t: 'Bachelor i filosofi og etikk', d: '180 studiepoeng · 3 år · to studieretninger · bacheloroppgave.', u: 'pensum.html', g: 'Startside' },
    { t: 'Master i filosofi og etikk', d: '120 studiepoeng · 2 år · masteroppgave og forskningsseminar.', u: 'pensum.html', g: 'Startside' },
    { t: 'Arrangementer', d: 'Fagkvelder, symposion, lesesirkler og mer. Se hele semesterprogrammet.', u: 'index.html#arrangementer', g: 'Startside' },
    { t: 'Aporetisk Aften', d: 'Én kveld i måneden rundt ett filosofisk spørsmål, uten pensum og uten fasit. Åpent for alle.', u: 'index.html#aporetisk', g: 'Startside' },
    { t: 'Fadderuke', d: 'Studiestartens beste uker. Bli kjent med faget, byen og medstudentene.', u: 'index.html#fadderuke', g: 'Startside' },
    { t: 'Oppslagstavla', d: 'Plakatene for det som skjer i Apeiron: fagkvelder, fester, frister og kunngjøringer.', u: 'oppslagstavla.html', g: 'Startside' },
    { t: 'Styret 2025/26', d: 'Leder, nestleder, økonomi, sosialansvarlig, faddersjef, fagansvarlig og mer.', u: 'index.html#styret', g: 'Startside' },
    { t: 'S.A.K', d: 'Sosiale Arrangement Komité, lavterskel engasjement for alle studenter.', u: 'styret.html#sak', g: 'Styret' },
    { t: 'Lesesalen', d: 'Filosofi- og etikkstudentenes eget tilfluktssted på Dragvoll: bibliotek, gratis kaffe for medlemmer og god plass.', u: 'om-oss.html#lesesalen', g: 'Om oss' },
    { t: 'Galleri', d: 'Bilder fra fester, fagkvelder og fadderuker, automatisk hentet fra Google Drive.', u: 'galleri.html', g: 'Galleri' },
    { t: 'Fellesskap & samarbeid', d: 'Unionen, søsterforeningen Dionysos og studenttidsskriftet Begrep.', u: 'om-oss.html#samarbeid', g: 'Om oss' },
    { t: 'Bli medlem', d: 'Meld deg inn i Apeiron og få fullt utbytte av alt vi tilbyr.', u: 'index.html#bli-medlem', g: 'Startside' },
    { t: 'Kontakt', d: 'Ta kontakt med styret på e-post eller sosiale medier. apeironlinjeforening@gmail.com', u: 'index.html#kontakt', g: 'Startside' },
    /* Styret */
    { t: 'Stian Lauritzen', d: 'Leder · Apeiron 2025/26', u: 'index.html#styret', g: 'Styret' },
    { t: 'Dennis Cleophas', d: 'Nestleder · Apeiron 2025/26', u: 'index.html#styret', g: 'Styret' },
    { t: 'Dagny Flakne', d: 'Økonomiansvarlig · Apeiron 2025/26', u: 'index.html#styret', g: 'Styret' },
    { t: 'Iver N. Edvardsen', d: 'Sosialansvarlig & S.A.K-medgrunnlegger · Apeiron 2025/26', u: 'index.html#styret', g: 'Styret' },
    { t: 'Natalie Bellingmo', d: 'PR-ansvarlig · Apeiron 2025/26', u: 'index.html#styret', g: 'Styret' },
    { t: 'Anna Fagerli', d: 'Faddersjef · Apeiron 2025/26', u: 'index.html#styret', g: 'Styret' },
    { t: 'Robin M. Søraker', d: 'Fagansvarlig · Apeiron 2025/26', u: 'index.html#styret', g: 'Styret' },
    { t: 'Martin R. Skauge', d: 'Potet & programtillitsvalgt (PTV) · Apeiron 2025/26', u: 'index.html#styret', g: 'Styret' },
    { t: 'Helene P. Ruud', d: 'Potet · Apeiron 2025/26', u: 'index.html#styret', g: 'Styret' },
    { t: 'Karoline B. Holthe', d: 'Potet · Apeiron 2025/26', u: 'index.html#styret', g: 'Styret' },
    { t: 'Fredrik C.F. Rosenfors', d: 'A.S.A.P S.A.K & S.A.K-medgrunnlegger · Apeiron 2025/26', u: 'index.html#styret', g: 'Styret' },
    /* Pensum */
    { t: 'Pensum', d: 'Pensumlister for alle emner på filosofi og etikk ved NTNU.', u: 'pensum.html', g: 'Pensum' },
    { t: 'FI1001: Filosofiens og etikkens historie', d: 'Felles · 15 sp · Platon: Staten · Descartes: Meditasjoner', u: 'pensum.html', g: 'Pensum' },
    { t: 'FI1002: Etikk og politisk filosofi', d: 'Felles · 7,5 sp · Rawls: A Theory of Justice', u: 'pensum.html', g: 'Pensum' },
    { t: 'FI1003: Kunnskaps- og vitenskapsteori', d: 'Felles · 7,5 sp · Gilje & Grimen: Vitenskapsteori for nybegynnere', u: 'pensum.html', g: 'Pensum' },
    { t: 'FI1004: Metafysikk og bevissthetsfilosofi', d: 'Filosofi · 7,5 sp · virkelighet, eksistens og bevissthet', u: 'pensum.html', g: 'Pensum' },
    { t: 'FI1005: Logikk', d: 'Filosofi · 7,5 sp · formell logikk og argumentasjonsteori', u: 'pensum.html', g: 'Pensum' },
    { t: 'FI1101: Samtidens filosofi', d: 'Filosofi · 7,5 sp · Heidegger: Being and Time · fenomenologi, eksistensialisme', u: 'pensum.html', g: 'Pensum' },
    { t: 'FI1210: Innføring i etikk og metaetikk', d: 'Etikk · 7,5 sp · Aristoteles: Den nikomakiske etikk · Mill: Utilitarisme', u: 'pensum.html', g: 'Pensum' },
    { t: 'FI1211: Etikkprosjekt og metode', d: 'Etikk · 15 sp · prosjektbasert fordypning i etisk analyse', u: 'pensum.html', g: 'Pensum' },
    { t: 'FI2002: Bacheloroppgave', d: 'Felles · 15 sp · selvstendig skriftlig arbeid, individuelt pensum', u: 'pensum.html', g: 'Pensum' },
    { t: 'FI2111: Fordypning 1', d: 'Filosofi · 15 sp · fordypning i valgt tema, varierer per semester', u: 'pensum.html', g: 'Pensum' },
    { t: 'FI2211: Sosial- og rettsfilosofi', d: 'Etikk · 15 sp · rettferdighet, makt og rettslige strukturer', u: 'pensum.html', g: 'Pensum' },
    { t: 'EXPH0100: Examen philosophicum (humaniora)', d: 'Filosofi · 7,5 sp · Skirbekk & Gilje: Filosofihistorie', u: 'pensum.html', g: 'Pensum' },
    { t: 'EXPH0200: Examen philosophicum (samfunn)', d: 'Etikk · 7,5 sp · obligatorisk innføring for samfunnsvitenskap', u: 'pensum.html', g: 'Pensum' },
    /* Merch */
    { t: 'Merch', d: 'Apeiron-merch i begrenset opplag. Bestill via e-post, hent på lesesalen.', u: 'merch.html', g: 'Merch' },
    { t: 'Segl-pin', d: 'Emaljert pin med Apeirons timeglass-segl. Hard emalje, gullkant. Ca. 2,5 cm · 75,– (65,– for medlemmer)', u: 'merch.html#butikk', g: 'Merch' },
    { t: 'Gresk tekst-pin', d: 'ΑΠΕΙΡΟΝ i gulltekst på marineblå bunn. Soft emalje. Ca. 3 cm · 75,– (65,– for medlemmer)', u: 'merch.html#butikk', g: 'Merch' },
    { t: 'Crew-neck genser', d: 'Marineblå genser med brodert segl på bryst · begrenset antall · str. S–XL · 450,– (405,– for medlemmer)', u: 'merch.html#butikk', g: 'Merch' },
    { t: 'Tote-bag', d: 'Naturbeige canvas-bag med trykt segl og ΦΙΛΟΣΟΦΙΑ · 200,– (180,– for medlemmer)', u: 'merch.html#butikk', g: 'Merch' },
    { t: 'Filosofkrus', d: 'Hvit keramikk med Γνῶθι σεαυτόν (kjenn deg selv) og seglet. 350 ml · 180,– (160,– for medlemmer)', u: 'merch.html#butikk', g: 'Merch' },
    { t: 'Pensum-markedet', d: 'Kjøp og bytte av brukt pensum. Kommer snart.', u: 'marked.html', g: 'Merch' },
    /* Begrep */
    { t: 'Begrep', d: 'Studentdrevet filosofisk tidsskrift ved NTNU. Utgaver, podkast, film og mer.', u: 'begrep.html', g: 'Begrep' },
    { t: 'Begrep Podcast', d: 'Samtaler med forfatterne bak artiklene i Begrep tidsskrift. Sesong 1.', u: 'begrep.html#podkast', g: 'Begrep' },
    { t: 'Begrepsliggjort', d: 'Filosofiske samtaler med gjester. Sesong 2 av Begrep Podcast.', u: 'begrep.html#podkast', g: 'Begrep' },
    { t: 'Hilbert Hotell', d: 'Filosofisk advent-fortelling i 24 episoder. Desember 2025.', u: 'begrep.html#julekalender', g: 'Begrep' },
    { t: 'Bidra i Begrep', d: 'Skriv for tidsskriftet eller bli med i redaksjonen.', u: 'begrep.html#bidra', g: 'Begrep' },
    /* Om vervene */
    { t: 'Om vervene (Styret)', d: 'Beskrivelse av alle styreverv i Apeiron: Leder, Nestleder, Økonomiansvarlig, Sosialansvarlig, PR-ansvarlig, Faddersjef, Fagansvarlig, Potet, PTV, ITV, S.A.K, H.I.V.', u: 'styret.html', g: 'Styret' },
    /* Heder */
    { t: 'Utmerkelser', d: 'Vi hedrer personer som har stått ut i studentmiljøet og det frivillige arbeidet: æresmedlemmer, ildsjeler og mer.', u: 'utmerkelser.html', g: 'Heder' },
    { t: 'Oppnåelser', d: 'Premier, pokaler og resultater Apeiron har vunnet: volleyballcup-sølv, best oppmøte fra Dionysos og mer.', u: 'oppnaelser.html', g: 'Heder' },
  ];

  /* ── SVG-ikoner per gruppe ── */
  var ICONS = {
    Startside: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    Nyheter:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h13v14a1 1 0 01-1 1H5a1 1 0 01-1-1z"/><path d="M17 8h3v9a2 2 0 01-2 2"/><line x1="7" y1="9" x2="14" y2="9"/><line x1="7" y1="13" x2="14" y2="13"/><line x1="7" y1="16" x2="11" y2="16"/></svg>',
    'Om oss':  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="8" r="0.6" fill="currentColor"/></svg>',
    Styret:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
    Pensum:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
    Merch:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>',
    Begrep:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h10M4 18h7"/></svg>',
    Galleri:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
    Heder:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M8.2 12.5L7 22l5-3 5 3-1.2-9.5"/></svg>',
  };
  var GROUP_ORDER = ['Startside', 'Nyheter', 'Om oss', 'Styret', 'Heder', 'Pensum', 'Merch', 'Begrep', 'Galleri'];

  /* ── Datakilde ──
     search-index.js (auto-generert fra innholdet, lastet før dette scriptet)
     foretrekkes. IDX over er en innebygd nødløsning hvis fila mangler. */
  var DATA = (typeof window !== 'undefined' && window.SEARCH_INDEX
              && window.SEARCH_INDEX.length) ? window.SEARCH_INDEX : IDX;

  /* ── Norsk stemmer (bøyning) ──
     Reduserer bøyde former til en felles stamme, både ved indeksering og
     ved søk, slik at «studieretninger» møter «studieretning». Kompakt port
     av Snowball (bokmål). God, ikke perfekt — uregelmessige/sammensatte ord
     dekkes av SYN-lista under. */
  function norwegianStem(word) {
    word = (word || '').toLowerCase();
    var len = word.length;
    if (len < 3) return word;
    var V = 'aeiouyæåø';
    var isV = function (c) { return V.indexOf(c) !== -1; };
    var r1 = len;
    for (var i = 1; i < len; i++) { if (!isV(word[i]) && isV(word[i - 1])) { r1 = i + 1; break; } }
    if (r1 < 3) r1 = 3;
    var ends = function (w, s) { return w.length >= s.length && w.slice(w.length - s.length) === s; };
    var step1 = [
      ['hetenes', ''], ['hetene', ''], ['hetens', ''], ['heten', ''], ['heter', ''],
      ['endes', ''], ['enes', ''], ['edes', ''], ['erte', 'er'], ['ande', ''], ['ende', ''],
      ['ane', ''], ['ene', ''], ['ens', ''], ['ers', ''], ['ets', ''], ['het', ''], ['ast', ''],
      ['ede', ''], ['ert', 'er'], ['ar', ''], ['er', ''], ['as', ''], ['es', ''], ['et', ''],
      ['en', ''], ['a', ''], ['e', '']
    ];
    var applied = false;
    for (var k = 0; k < step1.length; k++) {
      var suf = step1[k][0];
      if (ends(word, suf) && (len - suf.length) >= r1) {
        word = word.slice(0, word.length - suf.length) + step1[k][1];
        applied = true; break;
      }
    }
    if (!applied && ends(word, 's') && (word.length - 1) >= r1) {
      var b = word[word.length - 2], validS = 'bcdfghjlmnoprtvyz', keep = false;
      if (b && validS.indexOf(b) !== -1) keep = true;
      else if (b === 'k') { var b2 = word[word.length - 3]; if (b2 && !isV(b2)) keep = true; }
      if (keep) word = word.slice(0, word.length - 1);
    }
    len = word.length;
    if ((ends(word, 'dt') || ends(word, 'vt')) && (len - 1) >= r1) word = word.slice(0, len - 1);
    var step3 = ['hetslov', 'slov', 'elov', 'lov', 'elig', 'eleg', 'els', 'lig', 'eig', 'ig', 'leg'];
    for (var m = 0; m < step3.length; m++) {
      var s3 = step3[m];
      if (ends(word, s3) && (word.length - s3.length) >= r1) { word = word.slice(0, word.length - s3.length); break; }
    }
    return word;
  }

  /* Håndholdt synonym-/normaliseringsliste for uregelmessige former som
     stemmeren ikke fanger (utvid ved behov). */
  var SYN = { 'bøker': 'bok', 'bøkene': 'bok', 'bøkenes': 'bok', 'bøkers': 'bok' };

  function nTokenize(str) { return (str || '').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean); }
  function nProcess(term) {
    term = (term || '').toLowerCase();
    if (term.length < 2) return null;
    if (SYN[term]) term = SYN[term];
    return norwegianStem(term);
  }

  /* ── Søkemotor: MiniSearch (bøyning + fuzzy) hvis lastet, ellers delstreng-fallback ── */
  var mini = null;
  (function buildIndex() {
    try {
      if (typeof MiniSearch === 'undefined') return;
      mini = new MiniSearch({
        fields: ['t', 'd'], storeFields: ['t', 'd', 'u', 'g'], idField: '_id',
        tokenize: nTokenize, processTerm: nProcess
      });
      mini.addAll(DATA.map(function (it, i) { return { _id: i, t: it.t, d: it.d, u: it.u, g: it.g }; }));
    } catch (e) { mini = null; }
  })();

  /* ── Hjelpere ── */
  function htmlEsc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  /* Stamme-bevisst highlighting: marker hele ord hvis stammen matcher et
     søkeords stamme (fanger bøyde treff), med delstreng-prefiks som backup. */
  function hl(str, q) {
    if (!q) return htmlEsc(str);
    var qStems = nTokenize(q).map(nProcess).filter(Boolean);
    var raw = q.trim().toLowerCase().split(/\s+/).filter(function (w) { return w.length >= 2; });
    if (!qStems.length && !raw.length) return htmlEsc(str);
    var parts = String(str).split(/([\p{L}\p{N}]+)/u);
    return parts.map(function (seg, i) {
      if (i % 2 === 1) {
        var low = seg.toLowerCase(), st = nProcess(seg);
        var hit = (st && qStems.some(function (qs) { return st === qs || st.indexOf(qs) === 0 || qs.indexOf(st) === 0; }))
               || raw.some(function (w) { return low.indexOf(w) === 0; });
        return hit ? '<mark>' + htmlEsc(seg) + '</mark>' : htmlEsc(seg);
      }
      return htmlEsc(seg);
    }).join('');
  }

  /* ── Delstreng-scoring (fallback hvis MiniSearch ikke lastet) ── */
  function legacyScore(item, q) {
    var t = item.t.toLowerCase(), d = item.d.toLowerCase();
    var words = q.split(/\s+/).filter(Boolean);
    if (!words.length) return 0;
    if (t.startsWith(q)) return 12;
    if (t.includes(q)) return 10;
    if (d.includes(q)) return 6;
    if (words.every(function (w) { return t.includes(w); })) return 8;
    if (words.every(function (w) { return d.includes(w); })) return 4;
    if (words.some(function (w) { return t.includes(w); })) return 3;
    if (words.some(function (w) { return d.includes(w); })) return 1;
    return 0;
  }
  function legacySearch(q) {
    return DATA
      .map(function (it) { return { it: it, s: legacyScore(it, q) }; })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .map(function (x) { return x.it; })
      .slice(0, 28);
  }

  /* ── Søk ── MiniSearch (bøyning + prefiks + skrivefeil), ellers delstreng ── */
  function doSearch(q) {
    q = (q || '').trim();
    if (!q) return [];
    if (mini) {
      try {
        return mini.search(q, { prefix: true, fuzzy: 0.2, boost: { t: 2 }, combineWith: 'OR' })
          .slice(0, 28)
          .map(function (r) { return { t: r.t, d: r.d, u: r.u, g: r.g }; });
      } catch (e) { /* faller tilbake */ }
    }
    return legacySearch(q.toLowerCase());
  }

  /* ── Tastaturhint ── */
  var isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  var shortcut = isMac ? '⌘K' : 'Ctrl+K';

  /* ── Overlay-markup ── */
  var sovEl = document.createElement('div');
  sovEl.id = 'siteOverlay';
  sovEl.className = 'sov';
  sovEl.setAttribute('role', 'dialog');
  sovEl.setAttribute('aria-modal', 'true');
  sovEl.setAttribute('aria-label', 'Nettstedsøk');
  sovEl.innerHTML =
    '<div class="sov__bg" id="sovBg"></div>' +
    '<div class="sov__panel">' +
    '  <div class="sov__inputrow">' +
    '    <svg class="sov__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>' +
    '    <input class="sov__input" id="sovInput" type="search" placeholder="Søk etter side, emne, bok, merch…" autocomplete="off" spellcheck="false" />' +
    '    <button class="sov__esc" id="sovEsc" type="button" aria-label="Lukk søk"><kbd>Esc</kbd></button>' +
    '  </div>' +
    '  <div class="sov__body" id="sovBody" role="listbox">' +
    '    <p class="sov__empty sov__tip">Skriv for å søke på hele nettstedet: sider, emner, bøker og merch.</p>' +
    '  </div>' +
    '  <div class="sov__foot">' +
    '    <span class="sov__key"><kbd>↑↓</kbd> naviger</span>' +
    '    <span class="sov__key"><kbd>↵</kbd> åpne</span>' +
    '    <span class="sov__key"><kbd>' + htmlEsc(shortcut) + '</kbd> søk</span>' +
    '  </div>' +
    '</div>';

  /* ── Resultatrendring ── */
  var curIdx = -1;
  var curItems = [];

  function renderResults(q) {
    var results = doSearch(q);
    curItems = results;
    curIdx = -1;

    if (!q.trim()) {
      sovBody.innerHTML = '<p class="sov__empty sov__tip">Skriv for å søke på hele nettstedet: sider, emner, bøker og merch.</p>';
      return;
    }
    if (!results.length) {
      sovBody.innerHTML = '<p class="sov__empty">Ingen treff for <em>«' + htmlEsc(q.trim()) + '»</em></p>';
      return;
    }

    /* Group by section */
    var groups = {};
    results.forEach(function (it) {
      if (!groups[it.g]) groups[it.g] = [];
      groups[it.g].push(it);
    });

    var html = '';
    GROUP_ORDER.forEach(function (g) {
      if (!groups[g] || !groups[g].length) return;
      html += '<div class="sov__grouplbl">' + htmlEsc(g) + '</div>';
      groups[g].forEach(function (it) {
        html +=
          '<a class="sov__item" href="' + htmlEsc(it.u) + '" role="option">' +
          '<span class="sov__item__ico">' + (ICONS[it.g] || ICONS.Startside) + '</span>' +
          '<span class="sov__item__txt">' +
          '<span class="sov__item__title">' + hl(it.t, q.trim()) + '</span>' +
          '<span class="sov__item__desc">' + hl(it.d, q.trim()) + '</span>' +
          '</span>' +
          '<span class="sov__item__arr" aria-hidden="true">→</span>' +
          '</a>';
      });
    });
    sovBody.innerHTML = html;
  }

  function getItems() { return sovBody.querySelectorAll('.sov__item'); }

  function setActive(n) {
    var items = getItems();
    items.forEach(function (el) { el.classList.remove('is-active'); });
    if (n < 0) { curIdx = -1; return; }
    n = Math.min(n, items.length - 1);
    if (items[n]) {
      items[n].classList.add('is-active');
      /* scrollIntoView replacement — scroll parent container */
      var container = sovBody;
      var el = items[n];
      var elTop = el.offsetTop;
      var elBot = elTop + el.offsetHeight;
      var ctTop = container.scrollTop;
      var ctBot = ctTop + container.clientHeight;
      if (elTop < ctTop) container.scrollTop = elTop - 8;
      else if (elBot > ctBot) container.scrollTop = elBot - container.clientHeight + 8;
    }
    curIdx = n;
  }

  /* ── Åpne / Lukk ── */
  var isOpen = false;
  function open() {
    if (isOpen) return;
    isOpen = true;
    sovEl.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { sovInput.focus(); sovInput.select(); }, 50);
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    sovEl.classList.remove('is-open');
    document.body.style.overflow = '';
    sovInput.value = '';
    renderResults('');
    curIdx = -1;
  }

  /* ── Injects + events ── */
  function init() {
    document.body.appendChild(sovEl);
    var sovInput_ = document.getElementById('sovInput');
    var sovBody_  = document.getElementById('sovBody');
    var sovEsc_   = document.getElementById('sovEsc');
    var sovBg_    = document.getElementById('sovBg');
    /* assign to outer scope vars for renderResults */
    sovInput = sovInput_;
    sovBody  = sovBody_;

    var timer;
    sovInput_.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { renderResults(sovInput_.value); }, 80);
    });

    sovInput_.addEventListener('keydown', function (e) {
      var items = getItems();
      if (e.key === 'ArrowDown') {
        e.preventDefault(); setActive(curIdx < items.length - 1 ? curIdx + 1 : 0);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault(); setActive(curIdx > 0 ? curIdx - 1 : items.length - 1);
      } else if (e.key === 'Enter') {
        var target = curIdx >= 0 ? items[curIdx] : items[0];
        if (target) { window.location.href = target.href; close(); }
      } else if (e.key === 'Escape') {
        close();
      }
    });

    sovEsc_.addEventListener('click', close);
    sovBg_.addEventListener('click', close);

    /* ⌘K / Ctrl+K */
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        isOpen ? close() : open();
      }
      if (e.key === 'Escape' && isOpen) close();
    });

    /* Nav search buttons — event delegation */
    document.addEventListener('click', function (e) {
      if (e.target.closest('.nav__search-btn')) { e.preventDefault(); open(); }
    });
  }

  /* hoisted vars used across functions */
  var sovInput, sovBody;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
