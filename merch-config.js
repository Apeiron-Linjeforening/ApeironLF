/* ============================================================
   merch-config.js — innstillinger for merch-bestilling
   Lim inn web-app-URL fra Google Apps Script (se
   docs/apps-script-oppsett.md). La stå tom for e-post-fallback.
   ============================================================ */
window.MERCH_ORDER_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyZEa3-JoT1qI6NTHCKsyY8WEPwdDKhHf61DSjSWO1LH1VV-YmrG-jU1Zxd-j3srHc5QA/exec';
window.MERCH_ORDER_EMAIL = 'apeironlinjeforening@gmail.com';
// Vises i handlekurven for å gjøre det tydelig at betaling skjer via Vipps.
window.MERCH_VIPPS = '#551937 «Apeiron»';
// Delt token som BOT-FILTER (ikke sikkerhet). Ligger åpent i denne fila, så den
// stopper ikke en målrettet person, men blokkerer automatiske bots fra å sende inn
// søppel-bestillinger (nyttig her fordi dette er et skriv-endepunkt). Sett SAMME
// streng her og i Apps Script (ORDER_TOKEN); 24+ tegn. La stå tom for å slå av.
window.MERCH_ORDER_TOKEN = 'xJNo-ZwaV77FLkjTQxI76ryAltX2s79a';
