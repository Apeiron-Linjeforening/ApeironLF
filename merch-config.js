/* ============================================================
   merch-config.js — innstillinger for merch-bestilling
   Lim inn web-app-URL fra Google Apps Script (se
   docs/apps-script-oppsett.md). La stå tom for e-post-fallback.
   ============================================================ */
window.MERCH_ORDER_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx2TxuxvVGl6OSx2wtyp5hpLpiX8r_MJDVMPnaS0_Ot3Hi4rDi7nYdqBAw97CzS55CzZw/exec';
window.MERCH_ORDER_EMAIL = 'apeironlinjeforening@gmail.com';
// Vises i handlekurven for å gjøre det tydelig at betaling skjer via Vipps.
window.MERCH_VIPPS = '#551937 «Apeiron»';
// Enkel delt token mot spam. Sett SAMME streng her og i Apps Script (ORDER_TOKEN).
// Velg en tilfeldig streng, f.eks. 24+ tegn. La stå tom for å slå av sjekken.
window.MERCH_ORDER_TOKEN = 'xJNo-ZwaV77FLkjTQxI76ryAltX2s79a';
