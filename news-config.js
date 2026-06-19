/* ============================================================
   news-config.js — VALGFRI live-kanal for hastebeskjeder
   ============================================================
   Nyheter ligger nå i repoet (news-content.js, redigeres i nyheter-admin.html)
   og lastes umiddelbart — ingen treg Google Sheets-henting lenger.

   Dette endepunktet er KUN en valgfri ekstrakanal: en lett mobilvei der en
   hastebeskjed kan legges ut LIVE uten å committe kode (se hastebeskjed.html og
   HVORDAN.md → «Lett mobilvei for hastebeskjeder»). La den stå TOM for å bruke
   bare repo-nyhetene (anbefalt standard).

   Endepunktet kan kun returnere beskjeder på samme format som news-content.js
   sine items (place/urgent/title/text/date/link/linkLabel). De legges først,
   foran repo-nyhetene.
   ============================================================ */
window.NEWS_ENDPOINT = '';   // tom = av. Lim inn Apps Script /exec-URL for live mobilvei.

// Valgfritt bot-filter (ikke sikkerhet) — samme streng her og i Apps Script.
window.NEWS_TOKEN = '';
