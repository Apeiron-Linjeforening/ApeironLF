/* ============================================================
   content/news-content.js — nyheter, kunngjøringer og beskjeder
   Sist oppdatert: 21.7.2026
   Redigeres i Admin-senteret → Nyheter, eller rett her.

   place: "panel" (Akkurat nå-kortet) | "arrangement" | "aporetisk" | "fadderuke"
   kicker: merkelapp på «Akkurat nå»-kortet ("" = ingen). date: liten tidsstempel-tekst (tom = lagt ut-dato).
   urgent: true = vinrød «Viktig». text: **fet** *kursiv* _understrek_ [tekst](url).
   done: true = arkivert (vises i arkivet på nyheter.html, ikke på forsiden).
   subhero: topp-banneret (tilbake-lenke, tittel, ingress).
   ============================================================ */

window.NEWS_CONTENT = {
  "subhero": {
    "back": "Tilbake",
    "title": "Nyheter",
    "lede": "Kunngjøringer og beskjeder fra Apeiron. Det som er aktuelt nå ligger øverst, og et arkiv over tidligere oppslag lenger ned."
  },
  "items": [
    {
      "id": "nmrur4vij6jk",
      "place": "panel",
      "urgent": false,
      "title": "Vi trenger design og brukerorienterte hjerner!",
      "text": "Vi bygger en nettsidebygger for små organisasjoner og foreninger, og vi trenger hjelp til design, innslag for brukervennlighet og testere.\nØnsker du å være med på et prosjekt som vil løfte alle de små linjeforeningene ved NTNU - ta kontakt og spør etter vår sosialansvarlig Iver!\n\nSe mer av prosjekter her: https://github.com/Artiscow/Urd",
      "date": "",
      "kicker": "",
      "link": "",
      "linkLabel": "",
      "done": false,
      "posted": "2026-07-21"
    },
    {
      "id": "n-symposion",
      "place": "panel",
      "urgent": false,
      "title": "God sommer!",
      "text": "Husk å søke om lån!",
      "date": "",
      "kicker": "Kunngjøring",
      "link": "",
      "linkLabel": "",
      "done": true,
      "posted": "2026-06-15",
      "archivedAt": 1784644530647
    }
  ]
};
