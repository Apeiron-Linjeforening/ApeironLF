/* ============================================================
   ny-student-content.js: innhold for «Ny student?»-siden
   (ny-student.html). Praktisk guide for nye filosofi- og
   etikkstudenter ved NTNU Dragvoll.
   Sist oppdatert: 7.7.2026
   Rediger i Admin-senteret -> Ny student, eller rett her.

   subhero : navy topp-banner (tilbake-lenke, tittel, ingress) +
             help-nav hurtiglenker { title, desc, target }.
   praktisk: nummerert sjekkliste { title, body }.
   blikjent: mørkt velkomstbånd { cards[], engasjer } .
             cards: { icon, title, body, linkLabel, linkHref }.
             engasjer: bredt CTA-felt { icon, title, body, ctaLabel, ctaHref }.
   dragvoll: stedskort på campus { icon, title, body } (ikon inline med tittel).
   faq     : sammenleggbare spørsmål { q, a }.
   ============================================================ */
window.NYSTUDENT_CONTENT = {
  "subhero": {
    "back": "Tilbake til forsiden",
    "backHref": "index.html",
    "heading": "Ny student? Velkommen til Dragvoll",
    "lede": "Gratulerer, du kom inn! Nå kommer en flom av beskjeder, brukernavn og frister. Her har vi samlet det praktiske du faktisk må gjøre før semesterstart, og litt om hvordan du blir en del av Apeiron. Pust ut, vi loser deg gjennom.",
    "nav": [
      { "title": "Det praktiske", "desc": "Sjekklista før semesterstart.", "target": "#praktisk" },
      { "title": "Bli kjent", "desc": "Fadderuke, lesesal og medlemskap.", "target": "#blikjent" },
      { "title": "På Dragvoll", "desc": "Finn fram på campus.", "target": "#dragvoll" },
      { "title": "Spørsmål", "desc": "Ting nye studenter lurer på.", "target": "#faq" }
    ]
  },

  "praktisk": {
    "eyebrow": "Det praktiske først",
    "heading": "Sjekklista før semesterstart",
    "lede": "Seks ting det er lurt å ha på plass. Ingen av dem er vanskelige, men noen har frister det svir å bomme på.",
    "steps": [
      { "title": "Skaff deg et sted å bo", "body": "SiT sine studentboliger er billigst og nærmest, men søk tidlig, de fyller opp fort. Moholt og Lerkendal ligger fint til for Dragvoll; sentrum gir kort vei til byliv og buss opp til campus." },
      { "title": "Søk i Lånekassen", "body": "Søk så snart du har takket ja til studieplassen. Pengene kommer månedlig, og en god del blir stipend når du består emnene. Ikke vent til august." },
      { "title": "Betal semesteravgiften", "body": "Rundt 750 kroner via Studentweb hvert semester. Den må være betalt før du får lån utbetalt, studentbevis og tilgang til eksamen." },
      { "title": "Kom deg på infokanalene", "body": "Meld deg på fadder- og emnelistene, følg Apeiron på Instagram og Facebook, og sjekk Blackboard. Det meste av praktisk info kommer den veien." },
      { "title": "Aktiver IT-konto og studentbevis", "body": "Logg inn med Feide, last ned studentbevis-appen og hent adgangskortet. Kortet gir deg inn på Dragvoll og på lesesalen vår." },
      { "title": "Meld deg opp til emner og eksamen", "body": "Gjøres i Studentweb, og det er egne frister. Sett dem i kalenderen med en gang; det er kjedelig å oppdage en glippet frist i november." }
    ]
  },

  "blikjent": {
    "eyebrow": "Bli en av oss",
    "heading": "Bli kjent med Apeiron",
    "lede": "Studiet blir så mye bedre med folk rundt deg. Her er de enkleste veiene inn i fellesskapet.",
    "cards": [
      { "icon": "🎉", "title": "Fadderuka", "body": "Studiestartens beste uker. Bli kjent med faget, byen og folka. Å møte opp er den enkleste veien inn.", "linkLabel": "Se fadderprogrammet", "linkHref": "index.html#fadderuke" },
      { "icon": "📖", "title": "Lesesalen", "body": "Filosofi- og etikkstudentenes eget tilfluktssted på Dragvoll. Bibliotek, sofaer og gratis kaffe for medlemmer.", "linkLabel": "Om lesesalen", "linkHref": "om-oss.html#lesesalen" },
      { "icon": "✦", "title": "Bli medlem", "body": "Ett studieår 100 kr, hele studietiden 150 kr. Rabatt på arrangementer, kaffe på lesesalen, og et helt fellesskap.", "linkLabel": "Meld deg inn", "linkHref": "index.html#bli-medlem" },
      { "icon": "💬", "title": "Aporetisk Aften", "body": "Én kveld i måneden, ett spørsmål, ingen fasit. Ferskinger og veteraner er like velkomne.", "linkLabel": "Les mer", "linkHref": "index.html#aporetisk" }
    ],
    "engasjer": {
      "icon": "🤝",
      "title": "Lyst til å bidra?",
      "body": "Bli med i en komité eller S.A.K, den enkleste veien inn utover å bare møte opp. Si fra til en i styret eller send oss en melding på Instagram, så kobler vi deg på.",
      "ctaLabel": "Se verv og komiteer",
      "ctaHref": "styret.html#vervene"
    }
  },

  "dragvoll": {
    "eyebrow": "Finn fram",
    "heading": "Slik er det på Dragvoll",
    "lede": "Campusen ligger litt for seg selv, oppe i åsen. Her er de stedene du kommer til å bruke mest.",
    "cards": [
      { "icon": "🏛️", "title": "Låven", "body": "Apeirons tilholdssted, Dragvoll allé 40. Her skjer mye av det sosiale." },
      { "icon": "☕", "title": "Lesesalen", "body": "Der du finner ro, bøker og kaffe mellom forelesningene." },
      { "icon": "📖", "title": "Dragvoll bibliotek", "body": "Universitetsbiblioteket på campus: bøker, databaser, stille lesesaler og grupperom du kan booke." },
      { "icon": "📚", "title": "Akademika", "body": "Bokhandelen på Dragvoll. Her får du pensum, men sjekk Apeirons pensum-marked og bruktmarkedet først, det sparer penger." },
      { "icon": "🍽️", "title": "Kantine og mat", "body": "Dragvoll har flere kantiner og kaféer driftet av SiT. Rimelig studentmat og kaffe mellom øktene." },
      { "icon": "🚌", "title": "Buss til Dragvoll", "body": "Linje 3, 12 og 14 går til Dragvoll. Linje 3 og 14 stopper på Edvard Bulls veg, linje 12 og 3 på Dragvoll. Begge holdeplassene ligger rett ved Dragvoll." }
    ]
  },

  "faq": {
    "eyebrow": "Spørsmål?",
    "heading": "Ting nye lurer på",
    "items": [
      { "q": "Må jeg ha lest Kant for å henge med?", "a": "Nei. Du trenger bare nysgjerrighet og lyst til å være med. Resten kommer underveis, og ingen forventer at du kan alt fra dag én." },
      { "q": "Må jeg være medlem for å ta del i det sosiale?", "a": "Nei. Alle er velkomne på arrangementene våre, medlem eller ikke. Medlemskap gir deg bare avslag på inngang til arrangementer og på utvalgt merch. Selve fellesskapet er åpent for alle." },
      { "q": "Når begynner fadderuka?", "a": "Rundt studiestart i august. Følg Apeiron på Instagram for program og påmelding, det legges ut i god tid før oppstart." },
      { "q": "Hvor finner jeg Apeiron?", "a": "På Låven og lesesalen på Dragvoll, og på Instagram. Kom innom et arrangement, så finner du fort noen å prate med." },
      { "q": "Hva koster det å bli medlem?", "a": "100 kr for ett studieår, eller 150 kr for hele studietiden. Vipps til Apeiron, så er du med." }
    ]
  }
};
