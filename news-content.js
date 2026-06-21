/* ============================================================
   news-content.js — nyheter, kunngjøringer og beskjeder
   Sist oppdatert: 19.6.2026
   Redigeres i Admin-senteret → Nyheter, eller rett her.

   place: "panel" (Akkurat nå-kortet) | "arrangement" | "aporetisk" | "fadderuke"
   kicker: merkelapp på «Akkurat nå»-kortet ("" = ingen, da får tittelen plassen).
   date: liten tidsstempel-tekst øverst til høyre (tom = «lagt ut»-dato brukes).
   urgent: true = vinrød «Viktig». text: **fet** *kursiv* _understrek_ [tekst](url).
   done: true = arkivert (vises i arkivet på nyheter.html, ikke på forsiden).
   ============================================================ */

window.NEWS_CONTENT = {
  "subhero": {
    "back": "Tilbake",
    "title": "Nyheter",
    "lede": "Kunngjøringer og beskjeder fra Apeiron — det som er aktuelt nå øverst, og et arkiv over tidligere oppslag lenger ned."
  },
  "items": [
    {
      "id": "n-symposion",
      "place": "panel",
      "urgent": false,
      "title": "God sommer!",
      "text": "Vi håper dere har en finfin sommer og at dere har noen artige planer!\nHilsen Apeiron",
      "date": "",
      "kicker": "Kunngjøring",
      "link": "index.html#arrangementer",
      "linkLabel": "Meld deg på",
      "done": false,
      "posted": "2026-06-15"
    }
  ]
};
