/* ============================================================
   membership-config.js — medlemskapspriser og innmeldingsinfo
   Redigeres via medlemskap-admin.html (last ned og erstatt denne filen).
   ============================================================ */
window.MEMBERSHIP_CONFIG = {
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
