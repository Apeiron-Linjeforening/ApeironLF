/* ============================================================
   membership-config.js — medlemskapspriser og innmeldingsinfo
   Redigeres via Admin-senteret → Medlemskap (last ned og erstatt denne filen).
   ============================================================ */
window.MEMBERSHIP_CONFIG = {
  // Intro-teksten i «Bli medlem»-seksjonen (venstre kolonne på forsiden).
  eyebrow: "Bli en av oss",
  heading: "Bli medlem i Apeiron",
  lede: "Studerer du filosofi eller etikk ved NTNU? Da hører du hjemme her. Ett medlemskap, et helt fellesskap.",
  benefits: [
    "Rabattert inngang på alle arrangementer",
    "Gratis kaffe på lesesalen, og rabatt på Apeiron-pins",
    "Et fellesskap av nysgjerrige folk på tvers av kull",
    "Mulighet til å sitte i komité eller styre"
  ],
  vippsNumber: "#551937",
  vippsName: "Apeiron",
  // Innmeldingssteg. {pris} byttes ikke ut automatisk — bruk generell tekst.
  steps: [
    "Vipps riktig beløp (se over) til {vipps} «{navn}»",
    "Skriv navn og studieprogram i meldingen",
    "Følg oss på Instagram for oppdateringer"
  ],
  // Prisnivåer. Vises i rekkefølgen under.
  tiers: [
    { id: "year",  label: "Ett studieår",       price: 100, note: "Gjelder ett studieår (høst + vår)." },
    { id: "study", label: "Hele studietiden",   price: 150, note: "Engangsbeløp som varer så lenge du studerer." }
  ]
};
