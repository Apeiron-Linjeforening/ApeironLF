/* ============================================================
   news-config.js — innstillinger for «trådløse» nyheter på forsiden
   Lim inn web-app-URL fra «Apeiron Nyheter» sitt EGNE Apps Script (se
   docs/apps-script-oppsett.md, seksjonen «Nyheter»). Dette er et eget skript med
   sin egen URL - ikke det samme som merch sin MERCH_ORDER_ENDPOINT.
   La stå tom for å slå av nyhetsfunksjonen (siden vises da som før).
   ============================================================ */
window.NEWS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyVon6_v2OeedZD-Sth_P1S89Bf9bj1Zuhu6Je-K7rP579Cq-_MihocgXCHLyvzgSACZw/exec';

// Enkelt BOT-FILTER (ikke sikkerhet). Token-en ligger åpent i denne fila og kan
// kopieres av hvem som helst, så den gir INGEN reell beskyttelse mot en person.
// Den stopper kun dumme skrapere som treffer endepunktet uten å lese JS-en.
// Må være SAMME streng her og i Apps Script (NEWS_TOKEN). Tom begge steder = av.
window.NEWS_TOKEN = 'J0rfsGnpqZtxvJCmdN9cdZrUC2A1';
