# Oppsett: merch-bestilling via Google Apps Script + Sheet

Denne guiden setter opp «backend» for merch-bestillinger på en statisk side.
Når en besøkende sender en bestilling fra handlekurven på `merch.html`, sendes
den til et **Google Apps Script Web App** som:

1. skriver bestillingen som en ny rad i et **Google Sheet**, og
2. sender et **e-postvarsel** til styret.

> Gjør dette **før** handlekurven kobles på siden. Til slutt limer du inn
> web-app-URL-en i koden (se siste steg), og bekrefter at en testbestilling
> dukker opp i arket.

---

## Steg 1 — Opprett Google Sheet

1. Gå til <https://sheets.new> (logg inn med Apeiron sin Google-konto).
2. Gi arket et navn, f.eks. **«Merch-bestillinger»**.
3. Skriv inn disse kolonneoverskriftene i rad 1 (A1–H1):

   | A | B | C | D | E | F | G | H |
   |---|---|---|---|---|---|---|---|
   | Tidspunkt | Navn | E-post | Telefon | Bestilling | Kommentar | Total | Medlem |

   La resten stå tomt — skriptet fyller inn radene.
   (Har du allerede et ark uten «Total»-kolonne: skriv «Total» i celle **G1**.
   Mangler du «Medlem»-kolonnen: skriv «Medlem» i celle **H1**.)

---

## Steg 2 — Opprett Apps Script-prosjektet

1. I arket: meny **Utvidelser → Apps Script** (Extensions → Apps Script).
2. Slett alt som ligger i `Code.gs` fra før.
3. Lim inn koden under. **Bytt ut**:
   - `STYRE_EPOST` med riktig mottaker-adresse, og
   - `SHEET_ID` med arkets ID. ID-en står i nettleser-URL-en til arket:
     `docs.google.com/spreadsheets/d/`**`DETTE_ER_ID-EN`**`/edit`

```javascript
// ── Apeiron — mottak av merch-bestillinger ──
// Skriver hver bestilling til arket og varsler styret på e-post.

var STYRE_EPOST = 'apeironlinjeforening@gmail.com'; // ← hvem skal varsles
var SHEET_ID    = 'LIM_INN_ARK_ID_HER';            // ← ID fra Sheet-URL-en (se under)
var ORDER_TOKEN = '';                              // ← samme streng som MERCH_ORDER_TOKEN i merch-config.js

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Enkel spam-sperre: avvis hvis token ikke stemmer (når token er satt).
    if (ORDER_TOKEN && data.token !== ORDER_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Brukte kunden medlemspris? (avhukingsboks i handlekurven)
    var erMedlem = data.isMember === true;

    // Bygg en lesbar oppsummering av handlekurven, med pris per linje.
    // it.unitPrice/it.lineTotal er allerede medlemspris når medlem er huket av.
    var linjer = (data.items || []).map(function (it) {
      var v = [];
      if (it.size)  v.push('str: ' + it.size);
      if (it.color) v.push('farge: ' + it.color);
      var variant = v.length ? ' (' + v.join(', ') + ')' : '';
      var linjepris = (it.lineTotal != null) ? it.lineTotal
                    : (it.price != null ? it.price * it.qty : null);
      var pris = (linjepris != null) ? ' – ' + linjepris + ',–' : '';
      // Marker linjer der medlemsprisen faktisk ble brukt.
      var medlemsmerke = (erMedlem && it.memberPrice != null) ? ' (medlemspris)' : '';
      return '• ' + it.qty + '× ' + it.name + variant + pris + medlemsmerke;
    }).join('\n');

    var total = (data.total != null) ? data.total : '';
    var medlemTekst = erMedlem ? 'Ja' : 'Nei';

    // Åpne arket via ID (mer robust enn getActiveSpreadsheet i web-app)
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.phone || '',
      linjer,
      data.comment || '',
      total,
      medlemTekst
    ]);

    // E-postvarsel til styret
    MailApp.sendEmail({
      to: STYRE_EPOST,
      subject: 'Ny merch-bestilling fra ' + (data.name || 'ukjent'),
      body: 'Ny bestilling mottatt:\n\n'
        + 'Navn: ' + (data.name || '') + '\n'
        + 'E-post: ' + (data.email || '') + '\n'
        + 'Telefon: ' + (data.phone || '') + '\n'
        + 'Medlem: ' + medlemTekst + '\n\n'
        + linjer + '\n\n'
        + 'Totalt: ' + total + ',–\n\n'
        + (data.comment ? 'Kommentar: ' + data.comment + '\n\n' : '')
        + 'Se hele oversikten i Google Sheet.'
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Trykk **Lagre** (diskett-ikonet).

---

## Steg 3 — Deploy som Web App

1. Øverst til høyre: **Distribuer → Ny distribusjon** (Deploy → New deployment).
2. Klikk tannhjulet ved «Velg type» og velg **Web-app** (Web app).
3. Fyll ut:
   - **Beskrivelse:** «Merch-bestillinger» (valgfritt)
   - **Kjør som / Execute as:** **Meg** (din/Apeiron sin konto)
   - **Hvem har tilgang / Who has access:** **Alle / Anyone**
     (må være «Anyone» for at den offentlige nettsiden skal kunne sende inn)
4. Klikk **Distribuer**. Første gang må du **godkjenne tilgang**:
   - Velg konto → «Avansert» → «Gå til … (utrygt)» → **Tillat**.
     (Dette er normalt for egne Apps Script-prosjekter.)
5. Kopier **web-app-URL-en** som vises. Den ser slik ut:

   ```
   https://script.google.com/macros/s/AKfycb...../exec
   ```

> **Viktig ved senere endringer:** hvis du redigerer skriptet, må du
> **Distribuer → Administrer distribusjoner → rediger (blyant) → Ny versjon**
> for at endringen skal gjelde. URL-en forblir den samme.

---

## Steg 4 — Lim URL-en inn i nettsiden

Åpne `merch-config.js` i repoet og lim inn URL-en:

```javascript
window.MERCH_ORDER_ENDPOINT = 'https://script.google.com/macros/s/AKfycb...../exec';
```

Commit/push, så er bestillingsskjemaet aktivt.

> Hvis `MERCH_ORDER_ENDPOINT` står tom, faller siden tilbake til en enkel
> e-post-bestilling, slik at knappen aldri blir «død».

---

## Steg 5 — Test

1. Åpne `merch.html`, legg et produkt i kurven og send en testbestilling.
2. Sjekk at:
   - en ny rad dukker opp i Google Sheet, og
   - styret får e-postvarselet.

Hvis noe feiler: åpne Apps Script → **Utførelser** (Executions) for å se logg/feil.

---

## Spam-beskyttelse (anbefalt)

Endepunktet er offentlig (det må det være for at nettsiden skal kunne sende inn).
Det kan kun **skrive** bestillinger — ingen kan lese ut data. Hovedrisikoen er
spam-bestillinger. To enkle lag demper dette:

1. **Delt token:** velg en tilfeldig streng (24+ tegn) og sett den **likt** to steder:
   - `merch-config.js`: `window.MERCH_ORDER_TOKEN = '...'`
   - Apps Script: `var ORDER_TOKEN = '...'`
   Skriptet avviser da forespørsler uten riktig token. Husk **Ny versjon** etter endring.
2. **Honeypot:** handlekurven har et skjult felt som bots fyller ut, men ikke mennesker.
   Slike innsendinger forkastes automatisk i nettleseren. Krever ingenting fra deg.

> Token-en ligger også i klient-koden, så den stopper ikke en målrettet angriper —
> men den fjerner nær sagt all automatisk drive-by-spam. Det er riktig nivå for en
> linjeforenings-merchside. Ikke lim den ekte `SHEET_ID`-en eller `/exec`-URL-en inn i
> denne guiden (den publiseres) — hold dem i Apps Script og `merch-config.js`.

## Personvern (kort)

Skjemaet samler inn navn, e-post/telefon og bestilling. Nevn i en kort linje ved
skjemaet hva dataene brukes til (å behandle bestillingen) og at de lagres hos
Apeiron. Ikke samle inn mer enn nødvendig.
