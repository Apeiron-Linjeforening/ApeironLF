/* Innhold for Pensum-siden (pensum.html) — TEKST-delene.
   Sist oppdatert: 21.6.2026
   Rediger direkte her, eller åpne Admin-senteret → Pensum for visuell redigering.

   Dekker:
     subhero  : topp-banner (tilbake, tittel, ingress, meta-punkter)
     sections : seksjons-overskriftene (Felles / Filosofi / Etikk / Master)
     courses  : emnekortene (kode, navn, semester, beskrivelse, bøker / tom-tilstand)
     teaser   : «Pensum-markedet»-banneret
     notes    : de to ansvarsfraskrivelsene
     tracksIntro + tracks : «Studieretningene»
     graderHeading + programs : «Grader & løp»

   Tekst-format som tolkes ved gjengivelse:
     **fet**            → uthevet tekst
     [tekst](adresse)   → lenke

   Emnenivå (level) styrer fargemerket: felles / filosofi / etikk / master.
   Selve søk/filter/trekkspill-logikken ligger i pensum.html.
*/

window.PENSUM_CONTENT = {
  "subhero": {
    "back": "Tilbake",
    "title": "Pensum",
    "lede": "Her finner du pensumlister for alle emner på filosofi og etikk. Listen oppdateres av styret hvert semester — meld fra om noe mangler eller er utdatert.",
    "meta": [
      "**15** emner",
      "Filosofi · Etikk · Master",
      "Sist oppdatert **V2026**"
    ]
  },

  "sections": [
    { "id": "felles", "label": "Felles for begge retninger" },
    { "id": "filosofi", "label": "Filosofi" },
    { "id": "etikk", "label": "Etikk" },
    { "id": "master", "label": "Master" }
  ],

  "courses": [
    {
      "level": "felles", "code": "FI1001", "name": "Filosofiens og etikkens historie", "semester": "1. sem. · 15 sp",
      "desc": "Virkelighet, kunnskap, etikk — filosofiens grunnspørsmål fra antikken til i dag. Felles for begge studieretninger.",
      "ntnuHref": "https://www.ntnu.no/studier/emner/FI1001",
      "books": [
        { "title": "Staten (Politeia)", "author": "Platon", "detail": "Utvalgte bøker · norsk oversettelse" },
        { "title": "Meditasjoner over filosofiens grunnlag", "author": "Descartes, R.", "detail": "Meditasjoner 1–6" }
      ]
    },
    {
      "level": "felles", "code": "FI1002", "name": "Etikk og politisk filosofi", "semester": "2. sem. · 7,5 sp",
      "desc": "Klassiske og samtidige teorier om moral og politikk. Felles for begge studieretninger.",
      "ntnuHref": "https://www.ntnu.no/studier/emner/FI1002",
      "books": [
        { "title": "A Theory of Justice (utdrag)", "author": "Rawls, J.", "detail": "Del I–II · engelsk" }
      ]
    },
    {
      "level": "felles", "code": "FI1003", "name": "Kunnskaps- og vitenskapsteori", "semester": "2. sem. · 7,5 sp",
      "desc": "Hva er kunnskap, og hva skiller vitenskap fra andre former for innsikt? Felles for begge studieretninger.",
      "ntnuHref": "https://www.ntnu.no/studier/emner/FI1003",
      "books": [
        { "title": "Vitenskapsteori for nybegynnere", "author": "Gilje, N. & Grimen, H.", "detail": "Universitetsforlaget · utvalgte kap." }
      ]
    },
    {
      "level": "felles", "code": "FI2002", "name": "Bacheloroppgave", "semester": "5./6. sem. · 15 sp",
      "desc": "Selvstendig skriftlig arbeid som avslutter bachelorstudiet. Felles emne for begge retninger.",
      "ntnuHref": "https://www.ntnu.no/studier/emner/FI2002/2025",
      "empty": { "title": "Eget pensum per student", "body": "Bacheloroppgaven har individuelt pensum etter valgt tema — satt opp i samråd med veileder." }
    },
    {
      "level": "filosofi", "code": "EXPH0100", "name": "Examen philosophicum for humaniora", "semester": "1. sem. · 7,5 sp",
      "desc": "Obligatorisk innføringsemne for studenter ved humaniora og estetiske fag.",
      "note": "Sjekk med faglærer — pensum varierer noe mellom gruppene",
      "ntnuHref": "https://www.ntnu.no/studier/emner/EXPH0100",
      "books": [
        { "title": "Filosofihistorie", "author": "Skirbekk, G. & Gilje, N.", "detail": "Universitetsforlaget · utvalgte kap." }
      ]
    },
    {
      "level": "filosofi", "code": "FI1101", "name": "Samtidens filosofi — en introduksjon", "semester": "1. sem. · 7,5 sp",
      "desc": "1900- og 2000-tallets viktigste retninger: fenomenologi, eksistensialisme, analytisk filosofi og kritisk teori.",
      "ntnuHref": "https://www.ntnu.no/studier/emner/FI1101",
      "books": [
        { "title": "Being and Time (utdrag)", "author": "Heidegger, M.", "detail": "Utvalgte seksjoner · engelsk" }
      ]
    },
    {
      "level": "filosofi", "code": "FI1004", "name": "Metafysikk og bevissthetsfilosofi", "semester": "2. sem. · 7,5 sp",
      "desc": "Grunnleggende spørsmål om virkelighet, eksistens og bevissthet.",
      "ntnuHref": "https://www.ntnu.no/studier/emner/FI1004",
      "empty": { "title": "Pensumliste kommer", "body": "Ikke registrert ennå. Sitter du på lista? [Send oss et tips](index.html#kontakt) — så legger vi den ut." }
    },
    {
      "level": "filosofi", "code": "FI1005", "name": "Logikk", "semester": "2. sem. · 7,5 sp",
      "desc": "Innføring i formell logikk og argumentasjonsteori. Grunnlag for presis filosofisk tenkning.",
      "ntnuHref": "https://www.ntnu.no/studier/emner/FI1005",
      "empty": { "title": "Pensumliste kommer", "body": "Ikke registrert ennå. Sitter du på lista? [Send oss et tips](index.html#kontakt) — så legger vi den ut." }
    },
    {
      "level": "filosofi", "code": "FI2111", "name": "Fordypning 1", "semester": "3. sem. · 15 sp",
      "desc": "Fordypning i valgt tema innen filosofi. Alternativt FI2211 Sosial- og rettsfilosofi.",
      "ntnuHref": "https://www.ntnu.no/studier/emner/FI2111",
      "empty": { "title": "Varierer med semester", "body": "Pensum settes per tilbud — se emnesiden på ntnu.no for aktuelt semester." }
    },
    {
      "level": "etikk", "code": "EXPH0200", "name": "Examen philosophicum for samfunnsvitenskap", "semester": "1. sem. · 7,5 sp",
      "desc": "Obligatorisk innføringsemne for studenter ved samfunnsvitenskap.",
      "note": "Sjekk med faglærer — pensum varierer noe mellom gruppene",
      "ntnuHref": "https://www.ntnu.no/studier/emner/EXPH0200",
      "empty": { "title": "Pensumliste kommer", "body": "Ikke registrert ennå. Sitter du på lista? [Send oss et tips](index.html#kontakt) — så legger vi den ut." }
    },
    {
      "level": "etikk", "code": "FI1210", "name": "Innføring i etikk og metaetikk", "semester": "1. sem. · 7,5 sp",
      "desc": "De klassiske etiske teoriene og metaetikkens grunnspørsmål: dydsetikk, pliktetikk og konsekvensetikk.",
      "ntnuHref": "https://www.ntnu.no/studier/emner/FI1210",
      "books": [
        { "title": "Den nikomakiske etikk (utdrag)", "author": "Aristoteles", "detail": "Bok I, II & X · norsk oversettelse" },
        { "title": "Utilitarisme", "author": "Mill, J.S.", "detail": "Komplett · norsk oversettelse" }
      ]
    },
    {
      "level": "etikk", "code": "FI1211", "name": "Etikkprosjekt og metode", "semester": "2. sem. · 15 sp",
      "desc": "Prosjektbasert fordypning i etisk analyse og metodikk.",
      "ntnuHref": "https://www.ntnu.no/studier/emner/FI1211",
      "empty": { "title": "Pensumliste kommer", "body": "Ikke registrert ennå. Sitter du på lista? [Send oss et tips](index.html#kontakt) — så legger vi den ut." }
    },
    {
      "level": "etikk", "code": "FI2211", "name": "Sosial- og rettsfilosofi", "semester": "5. sem. · 15 sp",
      "desc": "Rettferdighet, makt og rettslige strukturer. Filosofiske perspektiver på samfunnet og dets institusjoner.",
      "ntnuHref": "https://www.ntnu.no/studier/emner/FI2211",
      "empty": { "title": "Pensumliste kommer", "body": "Ikke registrert ennå. Sitter du på lista? [Send oss et tips](index.html#kontakt) — så legger vi den ut." }
    },
    {
      "level": "master", "code": "FILOS/ETIKK 3xxx", "name": "Fordypningsemner", "semester": "1.–3. sem.",
      "desc": "Pensum varierer etter valgt fordypning og semesterets tilbud.",
      "ntnuLabel": "Finn emner på ntnu.no", "ntnuHref": "https://www.ntnu.no/studier/ressurser/emner",
      "empty": { "title": "Avhenger av valgt fordypning", "body": "Pensum varierer med emnetilbudet hvert semester — se de aktuelle emnesidene på [ntnu.no](https://www.ntnu.no), eller spør styret." }
    },
    {
      "level": "master", "code": "FILOS/ETIKK 8001", "name": "Vitenskapsteori og metode", "semester": "Alle sem.",
      "desc": "Obligatorisk masterseminar. Vitenskapsteori for humanistiske fag.",
      "ntnuLabel": "Finn emner på ntnu.no", "ntnuHref": "https://www.ntnu.no/studier/ressurser/emner",
      "empty": { "title": "Pensumliste kommer", "body": "Ikke registrert ennå. Sitter du på lista? [Send oss et tips](index.html#kontakt) — så legger vi den ut." }
    }
  ],

  "teaser": {
    "tag": "Kommer snart",
    "heading": "Pensum-markedet",
    "body": "Vil du selge eller gi bort pensum til neste kull, eller kjøpe brukte bøker til en rimelig pris? Vi jobber med et marked for kjøp og bytte av pensum.",
    "ctaLabel": "Se hva som kommer",
    "ctaHref": "marked.html"
  },

  "note1": "Pensumlister er ikke offisielle — sjekk alltid emnesidene på Canvas for oppdatert og bindende informasjon. Feil eller mangler? Send oss en mail.",

  "tracksIntro": {
    "eyebrow": "Hva du kan studere",
    "heading": "Studieretningene",
    "lede": "På både bachelor og master velger du mellom to studieretninger: filosofi og etikk. Her er hva de handler om."
  },

  "tracks": [
    {
      "glyph": "Φ", "level": "Studieretning", "title": "Filosofi",
      "body": "For deg som vil jobbe med de grunnleggende spørsmålene om mennesket, verden og kunnskap. Studieretningen vektlegger systematisk refleksjon og diskusjon som forstår og utfordrer etablerte svar — og tar for seg alt fra erkjennelse og virkelighet til kunst, religion, mening og menneskelig eksistens.",
      "points": [
        "Filosofihistorie, samtidsfilosofi og vitenskapsteori (FI1001, FI1101, FI1003)",
        "Metafysikk, bevissthetsfilosofi og logikk (FI1004, FI1005)",
        "Valgfri fordypning og bacheloroppgave (FI2111/FI2211, FI2002)"
      ]
    },
    {
      "glyph": "Η", "level": "Studieretning", "title": "Etikk",
      "body": "For deg som vil forstå hvordan vi bør handle og leve — som individer og fellesskap. Studieretningen vinkler filosofien mot praktiske og anvendte spørsmål: vårt ansvar overfor hverandre, dyr og naturen, og de etisk-politiske dilemmaene samtiden faktisk strever med.",
      "points": [
        "Innføring i etikk, metaetikk og etikkprosjekt (FI1210, FI1211)",
        "Etikk og politisk filosofi (FI1002)",
        "Sosial- og rettsfilosofi og bacheloroppgave (FI2211, FI2002)"
      ]
    }
  ],

  "graderHeading": "Grader & løp",

  "programs": [
    {
      "num": "I", "level": "Årsstudium", "sp": "60 studiepoeng · 1 år", "title": "Årsstudium i filosofi",
      "desc": "I filosofien stiller vi spørsmål om mennesket, virkeligheten og om hva som er godt og ondt, rett og galt. Årsstudiet gir et grunnriss av filosofiske problemstillinger fra antikken til i dag — innen både teoretisk og praktisk filosofi. Kan også brukes som valgfrie emner eller fag 2 i en annen bachelorgrad.",
      "chips": [
        "Examen philosophicum (EXPH0100)",
        "Filosofiens og etikkens historie (FI1001)",
        "Samtidens filosofi (FI1101)",
        "Etikk og politisk filosofi (FI1002)",
        "Kunnskaps- og vitenskapsteori (FI1003)"
      ]
    },
    {
      "num": "II", "level": "Årsstudium", "sp": "60 studiepoeng · 1 år (også deltid over 2 år)", "title": "Årsstudium i etikk",
      "desc": "Passer for deg som er engasjert i etiske utfordringer og viktige samfunnsspørsmål. Studiet gir et faglig grunnlag for å håndtere spørsmål om ansvar, rettferdighet og verdier — som privatperson, yrkesutøver eller samfunnsborger. Særlig godt tilrettelagt som videre- og tilleggsutdanning. Kan inngå som fag 2 i en bachelorgrad, eller som første år av bachelor i filosofi og etikk.",
      "chips": [
        "Examen philosophicum (EXPH0200)",
        "Filosofiens og etikkens historie (FI1001)",
        "Innføring i etikk og metaetikk (FI1210)",
        "Etikk og politisk filosofi (FI1002)",
        "Etikkprosjekt og metode (FI1211)"
      ]
    },
    {
      "num": "III", "level": "Bachelor", "sp": "180 studiepoeng · 3 år · to studieretninger", "title": "Bachelor i filosofi og etikk",
      "desc": "Bachelorstudiet tar opp grunnleggende spørsmål om mennesket, samfunnet og naturen, og utfordrer både det vi tror vi vet og hvordan vi bør leve. Du velger studieretning filosofi eller etikk når du søker via Samordna opptak, og avslutter med en bacheloroppgave — gjerne med et utvekslingsopphold underveis.",
      "chips": [
        "Examen philosophicum",
        "Filosofiens og etikkens historie (FI1001)",
        "Kunnskaps- og vitenskapsteori (FI1003)",
        "Etikk og politisk filosofi (FI1002)",
        "Fag 2 · 60 sp valgfritt",
        "Bacheloroppgave (FI2002)"
      ]
    },
    {
      "num": "IV", "level": "Master", "sp": "120 studiepoeng · 2 år · to studieretninger", "title": "Master i filosofi og etikk",
      "desc": "Toårig fordypning med de samme to studieretningene — filosofi og etikk. Du spisser fagprofilen din, deltar i forskningsseminar og skriver en masteroppgave. Etikkretningen er tverrfaglig og åpen for studenter med ulik bakgrunn, mens filosofiretningen bygger videre på filosofifaget.",
      "chips": [
        "Fordypningsemner",
        "Forskningsseminar",
        "Vitenskapsteori & metode",
        "Masteroppgave"
      ]
    }
  ],

  "note2": "Studiepoeng og normert studietid følger NTNUs studieplaner (2025/26). Emnelistene er et utvalg. Se ntnu.no for fullstendig pensum og oppdaterte krav."
};
