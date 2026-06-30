/* ============================================================
   news-content.js — nyheter, kunngjøringer og beskjeder
   Sist oppdatert: 30.6.2026
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
      "id": "n-symposion",
      "place": "panel",
      "urgent": false,
      "title": "God sommer!",
      "text": "Husk å søke om lån!",
      "date": "",
      "kicker": "Kunngjøring",
      "link": "",
      "linkLabel": "",
      "done": false,
      "posted": "2026-06-15"
    }
  ]
};
