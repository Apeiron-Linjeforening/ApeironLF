# Oppsett: Google Sheet + Apps Script (backend for en statisk side)

Nettsiden er statisk og har ingen egen server. To valgfrie funksjoner bruker derfor
Google Sheets + Apps Script som gratis «backend». De er **helt uavhengige** av
hverandre: hvert sitt regneark, hvert sitt skript, hver sin URL og hvert sitt token.
Du kan sette opp den ene, begge, eller ingen.

- **[Del 1: Merch-bestilling](#del-1-merch-bestilling)** - handlekurven sender
  bestillinger til et Sheet og varsler styret på e-post.
- **[Del 2: Nyheter på forsiden](#del-2-nyheter-på-forsiden)** - «trådløse» beskjeder
  dere skriver i et Sheet, som vises live på forsiden.

Hver del er skrevet slik at du kan følge den alene, fra topp til bunn.

---

# Del 1: Merch-bestilling

Når en besøkende sender en bestilling fra handlekurven på `merch.html`, går den til et
**Google Apps Script Web App** som skriver bestillingen som en ny rad i et **Google
Sheet** og sender et **e-postvarsel** til styret.

> Gjør dette **før** handlekurven kobles på siden. Til slutt limer du inn
> web-app-URL-en i koden (steg 4), og bekrefter at en testbestilling dukker opp i arket.

---

## Steg 1 - Opprett Google Sheet

1. Gå til <https://sheets.new> (logg inn med Apeiron sin Google-konto).
2. Gi arket et navn, f.eks. **«Merch-bestillinger»**.
3. Skriv inn disse kolonneoverskriftene i rad 1 (A1–H1):

   | A | B | C | D | E | F | G | H |
   |---|---|---|---|---|---|---|---|
   | Tidspunkt | Navn | E-post | Telefon | Bestilling | Kommentar | Total | Medlem |

   La resten stå tomt - skriptet fyller inn radene.
   (Har du allerede et ark uten «Total»-kolonne: skriv «Total» i celle **G1**.
   Mangler du «Medlem»-kolonnen: skriv «Medlem» i celle **H1**.)

---

## Steg 2 - Opprett Apps Script-prosjektet

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

    // Bot-filter (ikke sikkerhet): avvis hvis token ikke stemmer (når token er satt).
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

## Steg 3 - Deploy som Web App

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

## Steg 4 - Lim URL-en inn i nettsiden

Åpne `merch-config.js` i repoet og lim inn URL-en:

```javascript
window.MERCH_ORDER_ENDPOINT = 'https://script.google.com/macros/s/AKfycb...../exec';
```

Commit/push, så er bestillingsskjemaet aktivt.

> Hvis `MERCH_ORDER_ENDPOINT` står tom, faller siden tilbake til en enkel
> e-post-bestilling, slik at knappen aldri blir «død».

---

## Steg 5 - Test

1. Åpne `merch.html`, legg et produkt i kurven og send en testbestilling.
2. Sjekk at:
   - en ny rad dukker opp i Google Sheet, og
   - styret får e-postvarselet.

Hvis noe feiler: åpne Apps Script → **Utførelser** (Executions) for å se logg/feil.

---

## Bot-filter (anbefalt)

Endepunktet er offentlig (det må det være for at nettsiden skal kunne sende inn).
Det kan kun **skrive** bestillinger - ingen kan lese ut data. Hovedrisikoen er
automatiske spam-bestillinger. To enkle lag filtrerer bort bots:

1. **Delt token:** velg en tilfeldig streng (24+ tegn) og sett den **likt** to steder:
   - `merch-config.js`: `window.MERCH_ORDER_TOKEN = '...'`
   - Apps Script: `var ORDER_TOKEN = '...'`
   Skriptet avviser da forespørsler uten riktig token. Husk **Ny versjon** etter endring.
2. **Honeypot:** handlekurven har et skjult felt som bots fyller ut, men ikke mennesker.
   Slike innsendinger forkastes automatisk i nettleseren. Krever ingenting fra deg.

> Dette er et **bot-filter, ikke ekte sikkerhet:** token-en ligger åpent i
> klient-koden, så en målrettet person kan kopiere den. Men fordi dette er et
> **skriv**-endepunkt har filteret reell verdi: det fjerner nær sagt all automatisk
> drive-by-spam (falske bestillinger + e-postvarsler), som er riktig nivå for en
> linjeforenings-merchside. Ikke lim den ekte `SHEET_ID`-en eller `/exec`-URL-en inn i
> denne guiden (den publiseres) - hold dem i Apps Script og `merch-config.js`.

## Personvern (kort)

Skjemaet samler inn navn, e-post/telefon og bestilling. Nevn i en kort linje ved
skjemaet hva dataene brukes til (å behandle bestillingen) og at de lagres hos
Apeiron. Ikke samle inn mer enn nødvendig.

---

# Del 2: Nyheter på forsiden

Med dette kan dere legge ut generelle nyheter og hastebeskjeder på forsiden
(under menyen, i forsidebildet, eller i seksjonene for Arrangementer, Aporetisk
Aften og Fadderuke) ved å skrive i et Google Sheet **fra mobil eller PC** - uten å
røre koden. Endringen er synlig på siden innen noen få minutter.

Nyhetene ligger i et **eget, separat regneark** («Apeiron Nyheter») med sitt **eget,
separate Apps Script** - helt adskilt fra merch. Da er det lett å finne, vanskelig å
glemme, og de to tingene kan aldri rote til hverandre. Dette nyhets-skriptet har sin
egen web-app-URL (en annen enn merch-URL-en).

> Merk: dette er et annet oppsett enn merch over. Merch og nyheter deler ingenting -
> hvert sitt regneark, hvert sitt skript, hver sin URL og hvert sitt token.

## Steg N1 - Lag det nye regnearket

1. Gå til <https://sheets.new> (logg inn med Apeiron sin Google-konto).
2. Gi regnearket et tydelig navn øverst til venstre, f.eks. **«Apeiron Nyheter»**.
   **Bokmerk det** / lagre lenken et sted styret finner den igjen - det er her dere
   skriver nyheter fra mobil senere.
3. La den første (eneste) fanen være som den er; det er denne koden leser. Skriv
   disse overskriftene i rad 1 (A1–H1), i denne rekkefølgen:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Synlig | Plassering | Hastegrad | Fra (åå.mm.dd) | Til (åå.mm.dd) | Tittel | Tekst | Lenke |

Hva hver kolonne betyr:

- **Synlig** - en **avhukingsboks**. Huk av for å vise raden; la den stå tom for å
  skjule den uten å slette.
- **Plassering** - hvor på siden nyheten vises. Gyldige verdier:
  `topp` (tynn stripe rett under menyen), `hovedoppslag` (boks i forsidebildet),
  `arrangement`, `aporetisk`, `fadderuke`. (Skriv med små bokstaver. Vanlige
  varianter som `aporetisk aften`, `arrangementer` og `fadderukene` godtas også.)
- **Hastegrad** - en **rullegardin** med `Normal` og `Hast`. `Hast` gir en fylt
  vinrød boks med lys tekst og «Viktig»-merke; `Normal` gir et rolig kort med
  gull-aksent. De to ser tydelig forskjellige ut i både lys og mørk modus.
- **Fra** og **Til** - valgfritt tidsvindu. Se «Datoer» rett under.
- **Tittel** - kort overskrift (valgfri).
- **Tekst** - selve meldingen. Støtter enkel formatering, se «Tekst-formatering».
- **Lenke** - valgfri URL. Vises som en «Les mer →»-knapp.

> **Tips - gjør det vanskelig å skrive feil:**
> - **Synlig (A)**: marker kolonnen → meny **Sett inn → Avmerkingsboks**
>   (Insert → Checkbox). Da får hver rad en boks du bare huker av.
> - **Hastegrad (C)**: marker kolonnen → **Data → Datavalidering → Legg til regel →
>   «Rullegardin»** → `Normal`, `Hast`.
> - **Plassering (B)**: marker kolonnen → **Data → Datavalidering → Legg til regel →
>   «Rullegardin»** → skriv inn `topp`, `hovedoppslag`, `arrangement`, `aporetisk`, `fadderuke`.

### Datoer - må skrives helt likt (viktig)

For at koden alltid skal forstå datoene, gjør **begge** disse:

1. **Format kolonnene Fra og Til som ren tekst:** marker kolonne D og E →
   **Format → Tall → Ren tekst** (Format → Number → Plain text). Da lagres det
   du skriver nøyaktig, uten at Sheets gjør om datoen til et tall.
2. **Skriv alltid på formen `åå.mm.dd`** - altså **år.måned.dag** med tosifret år og
   punktum mellom tallene. 31. januar 2026 skrives `26.01.31`.

   > ⚠️ **Året kommer først, ikke dagen.** Dette er motsatt av vanlig norsk
   > dagligtale (`dd.mm.åå`). Skriver du `31.01.26` i den tro at det er 31. januar,
   > leser koden det som **år 2031**. Hovedregel: første tall = år.

Regler:

- **Tom `Fra`** = vises med en gang.
- **Tom `Til`** = blir stående til du fjerner raden eller fjerner avhukingen i `Synlig`.
- **`Til` i fortid** = forsvinner automatisk.

(Skriver du likevel en dato feil, beholdes nyheten synlig i stedet for å forsvinne
uventet - men da gjelder ikke tidsgrensen, så rett den opp.)

### Tekst-formatering

Vanlig celleformatering (fet/kursiv i Sheets) følger **ikke** med. Bruk i stedet
disse kodene rett i `Tekst`-cella:

| Skriv dette | Blir til |
|---|---|
| `**fet tekst**` | **fet tekst** |
| `*kursiv*` | *kursiv* |
| `_understrek_` | <u>understrek</u> |
| `[lenketekst](https://...)` | en klikkbar lenke |
| linjeskift (Alt+Enter i cella) | nytt avsnitt |

Fonten følger alltid sidens design. Skriver du inn HTML eller `<script>` vises det
som ren tekst - det kjøres aldri.

## Steg N2 - Finn ID-en til det nye regnearket

Åpne «Apeiron Nyheter»-regnearket og se på nettleser-URL-en:

```
docs.google.com/spreadsheets/d/DETTE_ER_ID-EN/edit
```

Den lange strengen mellom `/d/` og `/edit` er regnearkets **ID**. Kopier den, du
trenger den i neste steg. (Dette er en annen ID enn merch-arket sin `SHEET_ID`.)

## Steg N3 - Lag skriptet og lim inn koden

Stå i «Apeiron Nyheter»-regnearket og gå til meny **Utvidelser → Apps Script**. Dette
lager et nytt, eget skript knyttet til nettopp dette arket (ikke merch sitt). Slett
det som måtte ligge i `Code.gs` fra før, og lim inn koden under. Bytt ut to ting:

- `LIM_INN_NYHETER_ARK_ID_HER` med ID-en du nettopp kopierte.
- `LIM_INN_NYHETER_TOKEN_HER` med **samme** tilfeldige streng som står i
  `window.NEWS_TOKEN` i `news-config.js` (se «Bot-filter (nyheter)» nederst). La stå
  tom (`''`) for å slå av sjekken.

```javascript
// ── Apeiron — nyheter til forsiden (leses av apeiron-news.js) ──
// Leser det separate «Apeiron Nyheter»-regnearket og returnerer synlige rader som JSON.
var NEWS_SHEET_ID = 'LIM_INN_NYHETER_ARK_ID_HER';   // ← ID fra «Apeiron Nyheter»-URL-en
var NEWS_TOKEN    = 'LIM_INN_NYHETER_TOKEN_HER';    // ← samme streng som NEWS_TOKEN i news-config.js

function doGet(e) {
  try {
    // Bot-filter (ikke sikkerhet): avvis forespørsler uten riktig token når satt.
    if (NEWS_TOKEN && (!e || !e.parameter || e.parameter.token !== NEWS_TOKEN)) {
      return ContentService.createTextOutput('[]')
        .setMimeType(ContentService.MimeType.JSON);
    }

    var cache = CacheService.getScriptCache();
    var hit = cache.get('nyheter');
    if (hit) {
      return ContentService.createTextOutput(hit)
        .setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.openById(NEWS_SHEET_ID);
    var sheet = ss.getSheets()[0]; // første (og eneste) fane i nyhets-regnearket
    var out = [];
    if (sheet) {
      var tz = ss.getSpreadsheetTimeZone() || 'Europe/Oslo';
      var rows = sheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {   // hopp over overskriftsraden
        var r = rows[i];
        if (!isOn_(r[0])) continue;                             // Synlig (avhukingsboks)
        out.push({
          place:  String(r[1] || '').trim().toLowerCase(),        // Plassering
          urgent: isUrgent_(r[2]),                                // Hastegrad ("Hast")
          from:   normDate_(r[3], tz),                            // Fra
          to:     normDate_(r[4], tz),                            // Til
          title:  String(r[5] || ''),                            // Tittel
          text:   String(r[6] || ''),                            // Tekst
          link:   String(r[7] || '').trim()                      // Lenke
        });
      }
    }

    var json = JSON.stringify(out);
    cache.put('nyheter', json, 180); // hurtigbuffer i 3 min (fart + kvote)
    return ContentService.createTextOutput(json)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    // Feiler trygt: tom liste i stedet for feilmelding (siden vises da som før).
    return ContentService.createTextOutput('[]')
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Synlig «på» = avhukingsboks (TRUE), eller teksten "ja"/"x". Tom/usann = av.
function isOn_(v) {
  if (v === true) return true;
  var s = String(v == null ? '' : v).trim().toLowerCase();
  return s === 'ja' || s === 'x' || s === 'true';
}

// Hastegrad «haster» = rullegardin "Hast"/"Haste" (eller en avhukingsboks).
// "Normal" eller tomt = vanlig stil.
function isUrgent_(v) {
  if (v === true) return true;
  var s = String(v == null ? '' : v).trim().toLowerCase();
  return s === 'hast' || s === 'haste' || s === 'true';
}

// Normaliser dato til "åå.mm.dd" (år.måned.dag). Ekte Date → formateres; tekst
// godtas kun på rett form; alt annet → tom (ingen grense).
function normDate_(v, tz) {
  if (v instanceof Date) return Utilities.formatDate(v, tz, 'yy.MM.dd');
  var s = String(v || '').trim();
  return /^\d{2}\.\d{2}\.\d{2}$/.test(s) ? s : '';
}
```

> Endrer du en nyhet og vil se den med en gang, husk at svaret bufres i ~3
> minutter (linjen `cache.put(... 180)`). Sett tallet lavere for raskere
> oppdatering, eller fjern de tre cache-linjene helt.

## Steg N4 - Publiser som Web App

Trykk **Lagre** (diskett-ikonet) i Apps Script. Så, **første gang**:

1. Øverst til høyre: **Distribuer → Ny distribusjon** (Deploy → New deployment).
2. Klikk tannhjulet ved «Velg type» og velg **Web-app** (Web app).
3. Fyll ut:
   - **Kjør som / Execute as:** **Meg** (Apeiron sin konto)
   - **Hvem har tilgang / Who has access:** **Alle / Anyone**
     (må være «Anyone» for at den offentlige nettsiden skal kunne lese)
4. Klikk **Distribuer**. Første gang må du **godkjenne tilgang**: velg konto →
   «Avansert» → «Gå til … (utrygt)» → **Tillat**. Dette er normalt for egne skript.
5. Kopier **web-app-URL-en** (`https://script.google.com/macros/s/.../exec`). Den
   trenger du i steg N5.

> **Senere endringer:** hvis du redigerer skriptet, må du
> **Distribuer → Administrer distribusjoner → rediger (blyant) → Ny versjon →
> Distribuer** for at endringen skal gjelde. URL-en forblir den samme.

## Steg N5 - Koble til nettsiden

I steg N4 kopierte du nyhets-skriptets egen **web-app-URL** (på formen
`https://script.google.com/macros/s/.../exec`). Dette er en **annen** URL enn merch sin
(de er to separate skript), så ikke forveksle dem med `MERCH_ORDER_ENDPOINT`.

Åpne `news-config.js` i repoet og lim inn **din** URL og **ditt** token:

```javascript
window.NEWS_ENDPOINT = 'https://script.google.com/macros/s/DIN_EGEN_URL/exec';
window.NEWS_TOKEN    = 'samme-tilfeldige-streng-som-i-Apps-Script';
```

> ⚠️ Verdiene som ligger i `news-config.js` i dag tilhører **dette** prosjektet.
> Setter du opp ditt eget Apps Script, må du bytte dem ut med dine egne, ellers
> peker siden på feil sted og ingen nyheter vises.

Commit/push, så er nyhetsfunksjonen aktiv. La `NEWS_ENDPOINT` stå tom for å slå
den av helt.

## Steg N6 - Test

1. Legg en rad i «Apeiron Nyheter»: huk av **Synlig**, `Plassering=topp`,
   `Hastegrad=Hast`, `Tittel=Test`, `Tekst=**Viktig** _melding_`.
2. Last forsiden på nytt (vent eventuelt ut cache-vinduet). En stripe under menyen
   skal vise teksten med fet + understrek.
3. Test de andre plasseringene (`hovedoppslag`, `arrangement`, `aporetisk`, `fadderuke`).
4. Sett `Til` til en dato i fortid → nyheten forsvinner. Tom `Til` → blir stående.
   Fjern avhukingen i **Synlig** → skjules.

> Hele funksjonen er valgfri: feiler Google-delen, eller er arket tomt, vises
> forsiden helt som før uten nyhetsbannere.

## Bot-filter (nyheter)

**Vær klar over hva dette er og ikke er.** Nyhets-endepunktet er offentlig (det må
det være for at nettsiden skal kunne lese det), og det kan **kun lese** nyheter, ikke
skrive noe. Innholdet vises uansett åpent på forsiden, så det finnes ingenting
hemmelig å verne.

Token-en (`NEWS_TOKEN`) er derfor **ikke sikkerhet**, bare et lite bot-filter. Den
ligger åpent i `news-config.js`, som sendes til hver nettleser, så hvem som helst kan
kopiere den og kalle endepunktet fritt. Et ekte sikkerhetsskall er umulig på en
statisk side, fordi nettleseren ikke kan holde på en hemmelighet som ikke også kan
leses av en angriper (alt den sender kan fanges og gjentas).

Det token-en faktisk gjør: stopper de dummeste skraperne som treffer `/exec`-URL-en
uten å lese JavaScript-en. Den reelle dempingen mot hamring er **bufferen**
(`CacheService`, ~3 min), som gjør at gjentatte forespørsler ikke treffer regnearket
hver gang. Dette ligger allerede i koden.

Slik settes bot-filteret (valgfritt): velg en tilfeldig streng og sett den **likt**
to steder:
- `news-config.js`: `window.NEWS_TOKEN = '...'`
- Apps Script: `var NEWS_TOKEN = '...'`

Skriptet svarer da med tom liste hvis token mangler eller er feil. Husk **Ny versjon**
etter endring (steg N4). La `NEWS_TOKEN` stå tom **begge** steder for å slå filteret av.

> ⚠️ De to strengene må være helt like (eller begge tomme). Står det en streng i
> `news-config.js` men en annen (eller tom) i Apps Script, får du tom liste og ingen
> nyheter vises, helt stille.

> Trenger dere en gang ekte beskyttelse mot misbruk, krever det en server foran
> endepunktet (f.eks. en Cloudflare Pages Function med rate-limiting). For en
> offentlig nyhetsfeed er det normalt unødvendig.
