/* ============================================================
   membership-config.js — medlemskapspriser og innmeldingsinfo
   Redigeres via Admin-senteret → Medlemskap (last ned og erstatt denne filen).
   ============================================================ */
window.MEMBERSHIP_CONFIG = {
  "vippsNumber": "#551937",
  "vippsName": "Apeiron",
  "steps": [
    "Vipps riktig beløp (se over) til {vipps} «{navn}»",
    "Skriv navn og studieretning i meldingen",
    "Kontakt av oss i styret eller send Apeiron en melding på epost, Instagram eller Facebook for å få ditt medlemskort"
  ],
  "tiers": [
    {
      "id": "year",
      "label": "Ett studieår",
      "price": 100,
      "note": "Gjelder ett studieår (høst + vår)."
    },
    {
      "id": "study",
      "label": "Hele studietiden",
      "price": 150,
      "note": "Engangsbeløp som varer så lenge du studerer."
    }
  ]
};
