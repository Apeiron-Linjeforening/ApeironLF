/* ============================================================
   search-base.js — STATISKE søketreff (sider, emner, seksjoner)
   som ikke kommer fra en admin-modul. Redigeres for hånd her.
   Dynamiske treff (styremedlemmer, produkter, podkast, heder)
   genereres fra modulenes searchEntries() ved Publiser.
   Lastes kun i admin.html — input til search-index-byggingen.
   ============================================================ */

window.SEARCH_STATIC = [
  {
    "t": "Studiet",
    "d": "Studieretningene filosofi og etikk, grader og løp ved NTNU.",
    "u": "pensum.html",
    "g": "Startside"
  },
  {
    "t": "Filosofi — studieretning",
    "d": "Grunnleggende spørsmål om mennesket, verden og kunnskap. FI1001, FI1101, FI1003, FI1004, FI1005.",
    "u": "pensum.html",
    "g": "Startside"
  },
  {
    "t": "Etikk — studieretning",
    "d": "Hvordan vi bør handle og leve — som individer og fellesskap. FI1210, FI1211, FI1002, FI2211.",
    "u": "pensum.html",
    "g": "Startside"
  },
  {
    "t": "Årsstudium i filosofi",
    "d": "60 studiepoeng · 1 år · kan brukes som valgfrie emner i annen grad.",
    "u": "pensum.html",
    "g": "Startside"
  },
  {
    "t": "Årsstudium i etikk",
    "d": "60 studiepoeng · 1 år (også deltid). Særlig godt for videre- og tilleggsutdanning.",
    "u": "pensum.html",
    "g": "Startside"
  },
  {
    "t": "Bachelor i filosofi og etikk",
    "d": "180 studiepoeng · 3 år · to studieretninger · bacheloroppgave.",
    "u": "pensum.html",
    "g": "Startside"
  },
  {
    "t": "Master i filosofi og etikk",
    "d": "120 studiepoeng · 2 år · masteroppgave og forskningsseminar.",
    "u": "pensum.html",
    "g": "Startside"
  },
  {
    "t": "Arrangementer",
    "d": "Fagkvelder, symposion, lesesirkler og mer. Se hele semesterprogrammet.",
    "u": "index.html#arrangementer",
    "g": "Startside"
  },
  {
    "t": "Aporetisk Aften",
    "d": "Én kveld i måneden rundt ett filosofisk spørsmål — uten pensum og uten fasit. Åpent for alle.",
    "u": "index.html#aporetisk",
    "g": "Startside"
  },
  {
    "t": "Fadderuke",
    "d": "Studiestartens beste uker — bli kjent med faget, byen og medstudentene.",
    "u": "index.html#fadderuke",
    "g": "Startside"
  },
  {
    "t": "Oppslagstavla",
    "d": "Plakatene for det som skjer i Apeiron — fagkvelder, fester, frister og kunngjøringer.",
    "u": "oppslagstavla.html",
    "g": "Startside"
  },
  {
    "t": "Styret 2025/26",
    "d": "Leder, nestleder, økonomi, sosialansvarlig, faddersjef, fagansvarlig og mer.",
    "u": "index.html#styret",
    "g": "Startside"
  },
  {
    "t": "S.A.K",
    "d": "Sosiale Arrangement Komité — lavterskel engasjement for alle studenter.",
    "u": "styret.html#sak",
    "g": "Startside"
  },
  {
    "t": "Bli medlem",
    "d": "Meld deg inn i Apeiron og få fullt utbytte av alt vi tilbyr.",
    "u": "index.html#bli-medlem",
    "g": "Startside"
  },
  {
    "t": "Kontakt",
    "d": "Ta kontakt med styret på e-post eller sosiale medier. apeironlinjeforening@gmail.com",
    "u": "index.html#kontakt",
    "g": "Startside"
  },
  {
    "t": "Om oss",
    "d": "Apeiron er linjeforeningen for filosofi og etikk ved NTNU siden 1981 — et fellesskap uten faste grenser.",
    "u": "om-oss.html#om",
    "g": "Om oss"
  },
  {
    "t": "Lesesalen",
    "d": "Filosofi- og etikkstudentenes eget tilfluktssted på Dragvoll — bibliotek, gratis kaffe for medlemmer og god plass.",
    "u": "om-oss.html#lesesalen",
    "g": "Om oss"
  },
  {
    "t": "Fellesskap & samarbeid",
    "d": "Unionen, søsterforeningen Dionysos og studenttidsskriftet Begrep.",
    "u": "om-oss.html#samarbeid",
    "g": "Om oss"
  },
  {
    "t": "Galleri",
    "d": "Bilder fra fester, fagkvelder og fadderuker — automatisk hentet fra Google Drive.",
    "u": "galleri.html",
    "g": "Galleri"
  },
  {
    "t": "Pensum",
    "d": "Pensumlister for alle emner på filosofi og etikk ved NTNU.",
    "u": "pensum.html",
    "g": "Pensum"
  },
  {
    "t": "FI1001 — Filosofiens og etikkens historie",
    "d": "Felles · 15 sp · Platon: Staten · Descartes: Meditasjoner",
    "u": "pensum.html",
    "g": "Pensum"
  },
  {
    "t": "FI1002 — Etikk og politisk filosofi",
    "d": "Felles · 7,5 sp · Rawls: A Theory of Justice",
    "u": "pensum.html",
    "g": "Pensum"
  },
  {
    "t": "FI1003 — Kunnskaps- og vitenskapsteori",
    "d": "Felles · 7,5 sp · Gilje & Grimen: Vitenskapsteori for nybegynnere",
    "u": "pensum.html",
    "g": "Pensum"
  },
  {
    "t": "FI1004 — Metafysikk og bevissthetsfilosofi",
    "d": "Filosofi · 7,5 sp · virkelighet, eksistens og bevissthet",
    "u": "pensum.html",
    "g": "Pensum"
  },
  {
    "t": "FI1005 — Logikk",
    "d": "Filosofi · 7,5 sp · formell logikk og argumentasjonsteori",
    "u": "pensum.html",
    "g": "Pensum"
  },
  {
    "t": "FI1101 — Samtidens filosofi",
    "d": "Filosofi · 7,5 sp · Heidegger: Being and Time · fenomenologi, eksistensialisme",
    "u": "pensum.html",
    "g": "Pensum"
  },
  {
    "t": "FI1210 — Innføring i etikk og metaetikk",
    "d": "Etikk · 7,5 sp · Aristoteles: Den nikomakiske etikk · Mill: Utilitarisme",
    "u": "pensum.html",
    "g": "Pensum"
  },
  {
    "t": "FI1211 — Etikkprosjekt og metode",
    "d": "Etikk · 15 sp · prosjektbasert fordypning i etisk analyse",
    "u": "pensum.html",
    "g": "Pensum"
  },
  {
    "t": "FI2002 — Bacheloroppgave",
    "d": "Felles · 15 sp · selvstendig skriftlig arbeid, individuelt pensum",
    "u": "pensum.html",
    "g": "Pensum"
  },
  {
    "t": "FI2111 — Fordypning 1",
    "d": "Filosofi · 15 sp · fordypning i valgt tema, varierer per semester",
    "u": "pensum.html",
    "g": "Pensum"
  },
  {
    "t": "FI2211 — Sosial- og rettsfilosofi",
    "d": "Etikk · 15 sp · rettferdighet, makt og rettslige strukturer",
    "u": "pensum.html",
    "g": "Pensum"
  },
  {
    "t": "EXPH0100 — Examen philosophicum (humaniora)",
    "d": "Filosofi · 7,5 sp · Skirbekk & Gilje: Filosofihistorie",
    "u": "pensum.html",
    "g": "Pensum"
  },
  {
    "t": "EXPH0200 — Examen philosophicum (samfunn)",
    "d": "Etikk · 7,5 sp · obligatorisk innføring for samfunnsvitenskap",
    "u": "pensum.html",
    "g": "Pensum"
  },
  {
    "t": "Merch",
    "d": "Apeiron-merch i begrenset opplag. Bestill via e-post, hent på lesesalen.",
    "u": "merch.html",
    "g": "Merch"
  },
  {
    "t": "Pensum-markedet",
    "d": "Kjøp og bytte av brukt pensum — kommer snart.",
    "u": "marked.html",
    "g": "Merch"
  },
  {
    "t": "Begrep",
    "d": "Studentdrevet filosofisk tidsskrift ved NTNU. Utgaver, podkast, film og mer.",
    "u": "begrep.html",
    "g": "Begrep"
  },
  {
    "t": "Bidra i Begrep",
    "d": "Skriv for tidsskriftet eller bli med i redaksjonen.",
    "u": "begrep.html#bidra",
    "g": "Begrep"
  }
];
