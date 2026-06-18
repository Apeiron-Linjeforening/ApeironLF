## Slik fungerer publisering (Cloudflare Pages + GitHub)

Nettsiden er koblet opp slik:

```
Du redigerer en fil  →  pusher til GitHub  →  Cloudflare Pages oppdaterer siden automatisk
```

Du trenger altså **ikke** å gjøre noe på Cloudflare manuelt. Det skjer av seg selv når du lagrer endringer til GitHub-repoet. Vanligvis tar det under ett minutt fra du pusher til siden er live.

### Endre en fil og publisere (steg for steg)

**Alternativ A: direkte på GitHub.com (enklest, ingen installasjon):**

1. Gå til repoet på [github.com](https://github.com)
2. Klikk på filen du vil endre (f.eks. `index.html`)
3. Trykk på blyant-ikonet (✏️ «Edit this file») øverst til høyre
4. Gjør endringen din
5. Rull ned og trykk **«Commit changes»**
6. Ferdig! Cloudflare Pages plukker opp endringen og oppdaterer siden automatisk

**Alternativ B: lokalt på PC (for større endringer):**

```bash
# Last ned siste versjon
git pull

# Gjør endringene dine i en teksteditor (f.eks. VS Codium)

# Last opp endringene
git add .
git commit -m "Kort beskrivelse av hva du endret"
git push
# Ferdig — Cloudflare Pages oppdaterer siden automatisk
```

**Pro Tip: Claude Sonnet og Opus kan og bør brukes for å spare deg timer, om ikke dager av arbeid om du skal gjøre store endringer. Ellers bruk admin metoden.** 

---

## Lokal kjøring på PC (VS Codium + GitHub Desktop)

For større endringer anbefaler vi å jobbe lokalt på egen PC. Vi anbefaler **GitHub Desktop** (for å laste ned og opp endringer) og **VS Codium** (for å redigere filene).

**Engangsoppsett:**

1. Installer [GitHub Desktop](https://desktop.github.com/) og logg inn med GitHub-kontoen din
2. Installer [VS Codium](https://vscodium.com/)
3. I GitHub Desktop: **File → Clone repository** → velg Apeiron-repoet → velg en mappe på PC-en → **Clone**

**Slik jobber du (hver gang):**

1. Åpne GitHub Desktop og trykk **«Fetch origin» / «Pull origin»** for å hente siste versjon
2. Trykk **«Open in VS Codium»** (eller åpne mappen i VS Codium manuelt)
3. Gjør endringene dine og lagre filene
4. Se endringen lokalt i nettleseren (se under)
5. Gå tilbake til GitHub Desktop — endringene vises i listen til venstre
6. Skriv en kort beskrivelse nederst til venstre og trykk **«Commit to main»**
7. Trykk **«Push origin»** øverst — ferdig, Cloudflare Pages oppdaterer siden automatisk

**Se siden lokalt før du pusher:**

Åpne `index.html` direkte i nettleseren — enten via filutforskeren, eller lim inn stien i adressefeltet: `file:///[mappe]/ApeironLF/index.html`

**Lagre admin-endringer rett til repo-fila (lokalt, anbefalt):**

Admin-panelene kan skrive den oppdaterte datafila (f.eks. `merch-products.js`) **direkte til den lokale repo-fila** i stedet for å havne i nedlastingsmappa. Da kan du se og teste endringen lokalt med en gang, og selv velge når du vil committe/pushe til GitHub.

Dette krever at admin åpnes via en **lokal server** (nettleserens fil-skrive-API virker ikke når siden åpnes som `file://`):

1. I terminalen, stå i repo-mappa og kjør: `python3 -m http.server`
2. Åpne f.eks. `http://localhost:8000/merch-admin.html`
3. Klikk «Last ned …» → **velg datafila i repoet din én gang** → godkjenn skrivetilgang
4. Heretter lagres endringene rett til den lokale fila (toast: «Lagret direkte … ✓»). Filvalget huskes mellom økter.

Endringen ligger nå **kun lokalt** — den er ikke på GitHub/nettsiden før du committer og pusher. Slik kan du teste i fred først. Åpnes admin uten lokal server (eller i en nettleser uten støtte), faller den automatisk tilbake til vanlig nedlasting.

---

## Hva kan du redigere, og hvor?

### 📅 Arrangementer
**Ingen kodeendring nødvendig.**
Legg til, endre eller slett arrangementer direkte i **Google Kalenderene** til Apeiron.
Aktivitetskalender er for alt som ikke går inn i de følgende kalenderene: Aporetisk Aften, Fadderukene.
Nettsiden henter arrangementene automatisk og oppdaterer seg selv.

- Skriv kategorien først i tittelen med kolon for å tagge dem: `Fagkveld: Etikk & KI`
- Sted hentes fra «Sted»-feltet i kalenderhendelssen

### 🎓 Fadderuke
**Ingen kodeendring nødvendig.**
Samme prinsipp som arrangementer — legg inn postene i **fadderuke-kalenderen** i Google Kalender.
Skriv type med kolon: `Grill: Bli-kjent-kveld`

### 👥 Styret
Styremedlemmene og vervbeskrivelsene styres via filen `styret-content.js` — **ikke** direkte i `styret.html` eller `index.html`. Begge sidene leser fra samme fil, så du oppdaterer alt ett sted.

#### Enklest: bruk admin-panelet (`styret-admin.html`)

Åpne `styret-admin.html` i nettleseren (lokalt eller på nettsiden ved å legge til `/styret-admin.html` i adressefeltet).
Du logger inn med passordet — spør styret.

I admin-panelet kan du:
- Legge til, endre og slette styremedlemmer og verv («Hva gjør vi»)
- Sette navn, rolle, initialer og tilleggsverv (chips) på hvert medlem
- Dra inn et portrettbilde på medlemskortet (lagres som innebygd base64 — ingen ekstern fil nødvendig)
- Endre rekkefølge
- Trykk **«Eksporter styret-content.js»** — last ned filen og erstatt `styret-content.js` i repoet, så er siden oppdatert

#### Manuelt: rediger `styret-content.js` direkte

Filen inneholder `window.STYRET_CONTENT` med seksjonene `board` og `verv` (overskrifter), `members` (styremedlemmer) og `roles` (vervbeskrivelser).

- `members[]`: `name`, `role`, `initials`, `img` og `tags` (tilleggsverv som chips, med `label` og `color`: `""` nøytral, `"maroon"` eller `"gold"`)
- `roles[]`: `name`, `desc`, `resp` (liste med ansvarspunkter), `eyebrow` og `accent` (fargestripe)
- Bilder kan være `null` (viser initialer), `"assets/Styremedlemmer/filnavn.jpg"` (fra repoet) eller base64 fra admin-panelet

> Initialene vises i den runde avataren helt til et foto er lagt inn.

### 📚 Pensum
Rediger `pensum.html`. Hver emneblokk er en `<div class="course-block">` med tittel, emnekode og pensumliste.
Vi skal snakke med instituttet for å se om det er mulig å få en API til NTNU sine nettsider, slik at dette også kan gå automatisk.

### 🛍️ Merch
Merch-produkter styres via filen `merch-products.js` — **ikke** direkte i `merch.html`.

#### Enklest: bruk admin-panelet (`merch-admin.html`)

Åpne `merch-admin.html` i nettleseren (lokalt eller på nettsiden). Dette gjør du ved å legge til `/merch-admin.html` på slutten av nettadressen (https://apeironlf.pages.dev/merch-admin.html).
Du logger inn med passordet — spør sosialansvarlig eller sjekk med styret.

I admin-panelet kan du:
- Legge til, endre og slette produkter
- Dra inn et bilde på produktkortet (lagres som innebygd base64 — ingen ekstern fil nødvendig)
- Endre rekkefølge
- Trykk **«Eksporter merch-products.js»** — last ned filen og erstatt `merch-products.js` i repoet, så er siden oppdatert

#### Manuelt: rediger `merch-products.js` direkte

Hvert produkt er et objekt i `window.MERCH_PRODUCTS`-arrayen:

```js
{
  id: "unikt-id",            // brukes internt
  badge: "Snart utsolgt",    // egendefinert badge-tekst (kun når badgeType er null)
  badgeType: "new",          // "new" | "bestseller" | "limited" | null (preset, fast tekst)
  badgeGlow: null,           // eget glød-/fargevalg på badgen, f.eks. { anim: "ember-soft" } eller null
  category: "Klær",
  name: "Produktnavn",
  desc: "Kort beskrivelse.",
  price: 299,                // null = skjuler pris og viser «Kommer snart» i stedet for kjøp
  memberPrice: 249,          // utelat/null hvis ingen medlemspris
  sizes: ["S", "M", "L"],    // valgfrie varianter (nedtrekksmeny i handlekurven), eller null
  colors: ["Marineblå"],     // valgfrie varianter, eller null
  img: null,                 // null = viser segl-watermark
                             // "assets/merch/filnavn.jpg" = bilde fra repoet
                             // (base64-streng fra admin-panel også støttet)
}
```

> **Badge:** velg **enten** en preset (`badgeType`) **eller** egendefinert tekst (`badge`) — ikke begge. `badgeGlow` er et eget, uavhengig valg for animert glød/farge rundt merkelappen.

#### Bestilling: handlekurv + Google Sheet

Merch bestilles via en **handlekurv** på `merch.html`: kunden velger variant/antall, legger i kurv og sender bestillingen med navn og e-post. Bestillingen lagres i et **Google Sheet** og styret varsles på e-post. Betaling skjer via **Vipps** etter at styret har bekreftet. Se [Merch-bestilling: Google Sheet + Apps Script](#merch-bestilling-google-sheet--apps-script) for teknisk oppsett.

**Bilder (tre alternativer):**
1. **Ingen bilde** (`img: null`) — viser Apeiron-seglet som watermark
2. **Bilde fra repoet** — legg bildefilen i `assets/merch/` og sett `img: "assets/merch/filnavn.jpg"`
3. **Innebygd bilde via admin** — last opp i `merch-admin.html`, eksporter JS-filen; bildet er da lagret direkte i `merch-products.js` (ingen ekstern fil nødvendig)

### 📰 Begrep
Innholdet på Begrep-siden styres via `begrep-content.js` — **ikke** direkte i `begrep.html`.

#### Enklest: bruk admin-panelet (`begrep-admin.html`)

Åpne `begrep-admin.html` i nettleseren (lokalt eller på nettsiden ved å legge til `/begrep-admin.html` i adressefeltet).
Du logger inn med passordet — spør styret.

I admin-panelet kan du:
- Legge til, endre og slette utgaver, podkast-sesonger, filmer og julekalender-innslag
- Dra inn bilder på kortene (lagres som innebygd base64)
- Oppdatere statistikk (grunnlagtår, antall julekalenderepisoder)
- Trykk **«Eksporter begrep-content.js»** — last ned filen og erstatt `begrep-content.js` i repoet

#### Manuelt: rediger `begrep-content.js` direkte

Filen inneholder `window.BEGREP_CONTENT` med følgende seksjoner: `meta`, `issues`, `podcasts`, `films`, `christmas`.
Bilder kan være `null` (viser plassholder), `"assets/begrep/filnavn.png"` (fra repoet) eller base64 fra admin-panelet.

---

### 🆘 Hjelp & ressurser
Innholdet på Hjelp-siden styres via `hjelp-content.js` — **ikke** direkte i `hjelp.html`.

#### Enklest: bruk admin-panelet (`hjelp-admin.html`)

Åpne `hjelp-admin.html` i nettleseren (lokalt eller på nettsiden ved å legge til `/hjelp-admin.html` i adressefeltet).
Du logger inn med passordet — spør styret.

I admin-panelet kan du:
- Redigere topptekst og hurtignav-kortene øverst på siden
- Legge til, endre, omrokere og slette ressurskort i hver seksjon (Si fra, Faglig hjelp, Psykisk helse, Fysisk helse)
- Redigere «Si fra»-kortene og nødnummer-kortene under Akutt hjelp
- Legge til punkter og kontaktlinjer på hvert kort (kontaktlinjer og «Si fra»-tekst tillater HTML, f.eks. lenker og `<strong>`)
- Trykk **«Last ned hjelp-content.js»** — last ned filen og erstatt `hjelp-content.js` i repoet

#### Manuelt: rediger `hjelp-content.js` direkte

Filen inneholder `window.HJELP_CONTENT` med seksjonene `hero`, `sifra`, `studier`, `helse`, `fysisk` og `akutt`.
Ressurskort (`*.cards[]`) har feltene `eyebrow`, `accent` (fargestripe), `name`, `desc`, `resp[]` (punkter), `contacts[]`, `noteTop`, `note`, `btnLabel` og `btnHref`. Tom linje i `desc` gir nytt avsnitt.

---

### 📷 Galleri
**Du trenger aldri å røre koden for å oppdatere galleriet.**
Alt styres fra én delt Google Drive-mappe. Nettsiden leser den hver gang noen åpner galleri-siden, så endringer du gjør i Drive dukker opp på nettsiden av seg selv.

#### Hvordan mappene må ligge

Det aller viktigste å forstå: mappene må ligge i **nøyaktig tre nivåer nedover**, som esker inni esker. Hopper du over et nivå eller legger ting feil sted, vises de ikke på nettsiden.

```
📁 ALT SOM LASTES OPP HER ...        ← NIVÅ 1: hovedmappen (legg aldri bilder rett her)
   │
   ├── 📁 2025/2026                  ← NIVÅ 2: ett skoleår. Blir en fane øverst i galleriet.
   │      │
   │      ├── 📁 Halloweenfest       ← NIVÅ 3: ett arrangement. Blir ett bildekort.
   │      │      ├── 🖼️ bilde1.jpg    ← bildene selv ligger HER, helt innerst
   │      │      ├── 🖼️ bilde2.jpg
   │      │      └── 🖼️ bilde3.jpg
   │      │
   │      └── 📁 Sommerfest
   │             └── 🖼️ ...
   │
   └── 📁 2024/2025
          └── 📁 Fadderukefest
                 └── 🖼️ ...
```

Forklart i ord:
1. **Hovedmappen** er den styret har delt. Inni den lager du ikke bilder direkte, bare skoleår-mapper.
2. **Skoleår-mappene** (nivå 2) lager du inni hovedmappen. Navnet du gir mappen, f.eks. `2025/2026`, blir teksten på fanen øverst i galleriet. Bruk alltid samme navneform, så ser fanene like ut.
3. **Arrangement-mappene** (nivå 3) lager du inni en skoleår-mappe. Navnet du gir mappen blir tittelen som vises på bildekortet. Kall den noe folk kjenner igjen, f.eks. `Fadderukefest` eller `Juleavslutning`.
4. **Bildene** legger du helt innerst, rett inni arrangement-mappen.

#### Tre ting som er lett å gjøre feil

- **Bilder må ligge inni en arrangement-mappe.** Legger du bilder løst rett i en skoleår-mappe (eller i hovedmappen), blir de hoppet over. De må ligge ett nivå lenger inn.
- **Forsidebildet på kortet blir det bildet som kommer først alfabetisk** etter filnavn. Vil du bestemme hvilket bilde som vises utenpå kortet, gi det et filnavn som havner først, f.eks. `01.jpg` eller `aaa-forside.jpg`. Resten kan hete hva som helst.
- **Nyeste skoleår vises først.** Fanene sorteres baklengs på navn, så `2025/2026` legger seg foran `2024/2025` helt av seg selv. Du trenger ikke gjøre noe for å styre rekkefølgen.

#### Slik legger du til bilder fra et nytt arrangement (steg for steg)

1. Åpne Google Drive og gå inn i den delte hovedmappen (spør styret om lenken hvis du ikke har den)
2. Finn mappen for inneværende skoleår, f.eks. `2025/2026`. Finnes den ikke ennå, lag en ny mappe med akkurat det navnet.
3. Gå **inn i** skoleår-mappen og lag en ny mappe der, med navnet på arrangementet, f.eks. `Vårfest`
4. Gå **inn i** den nye arrangement-mappen og last opp bildene dit
5. Ferdig. Neste gang noen åpner galleriet på nettsiden er bildene der.

> **Viktig om deling:** Hovedmappen og alt som ligger inni den må være delt som «Alle med lenken kan se». Er en mappe satt til privat, klarer ikke nettsiden å hente bildene, og de vises ikke. Er du usikker, spør styret før du laster opp.

### 🪑 Lesesalen — bilder

Bildene av lesesalen på forsiden ligger i mappen `assets/lesesalen/` og følger navnemønsteret `lesesal1.jpg`, `lesesal2.jpg`, `lesesal3.jpg` osv.

- `lesesal1.jpg` brukes som det store hovedbildet
- `lesesal2.jpg` og oppover vises i den rullende bildestripen under

Siden oppdager automatisk alle bildene i sekvens — du trenger ikke røre koden.

**Slik legger du til eller bytter ut et bilde:**

1. Endre navn på bildet til `lesesalX.jpg` der `X` er neste ledige nummer (f.eks. `lesesal7.jpg`)
2. Legg filen i mappen `assets/lesesalen/` i repoet
3. Push til GitHub — siden plukker det opp automatisk

**Slik fjerner du et bilde:**

Slett den aktuelle filen fra `assets/lesesalen/`. Pass på at det ikke oppstår hull i nummereringen — hvis du fjerner f.eks. `lesesal3.jpg`, vil alt fra `lesesal4.jpg` og oppover slutte å vises. Rename i så fall filene så sekvensen er sammenhengende (1, 2, 3 ...).

**Slik bytter du hovedbilde:**

Gi det ønskede bildet navn `lesesal1.jpg` (overskriv eller slett det gamle).

> **Støttede formater:** `.jpg` / `.jpeg`. Bruk rimelig komprimerte bilder (under 1–2 MB per fil) for at siden skal laste raskt.

### 📰 Nyheter / hastebeskjeder på forsiden
Du kan legge ut generelle nyheter og hastebeskjeder på forsiden **uten å røre koden** —
du skriver dem i et Google Sheet «Nyheter» fra mobil eller PC, og de dukker opp på
siden innen noen få minutter.

- **Plasseringer:** `topp` (tynn stripe rett under menyen), `hovedoppslag` (boks i
  forsidebildet), `arrangement`, `aporetisk` og `fadderuke`. Du velger per nyhet i arket.
- **Hastegrad:** velg `Hast` i rullegardinen for en tydelig vinrød markering, `Normal` gir vanlig gull-stil.
- **Tidsvindu:** valgfrie `Fra`- og `Til`-datoer på formen `åå.mm.dd` (år.måned.dag,
  altså året først, f.eks. `26.01.31`). Tom `Til` = blir stående til du fjerner den;
  `Til` i fortid = forsvinner av seg selv; fjern avhukingen i `Synlig` = skjules uten å slette.
- **Formatering i teksten:** `**fet**`, `*kursiv*`, `_understrek_`,
  `[lenketekst](https://...)` og linjeskift.

Nyhetene ligger i et **eget regneark** («Apeiron Nyheter») med sitt **eget, separate
Apps Script**, helt adskilt fra merch, så det er lett å finne og vanskelig å glemme.
Oppsett (eget regneark + eget skript, gjøres én gang) er beskrevet i
[docs/apps-script-oppsett.md](docs/apps-script-oppsett.md), seksjonen «Nyheter».
URL settes i `news-config.js` (la den stå tom for å slå funksjonen av). Der ligger
også et valgfritt `NEWS_TOKEN`, et lite bot-filter (ikke sikkerhet, se docs), som
må være samme streng som i Apps Script.

### 📖 Om oss / øvrig tekst
All annen tekst (om oss, studiene, FAQ, kontakt osv.) redigeres direkte i `index.html`.
Finn riktig seksjon ved hjelp av kommentarene: `<!-- ============ OM OSS ============ -->` osv.

---

## Merch-bestilling: Google Sheet + Apps Script

Nettsiden er statisk og har ingen egen server. Merch-bestillinger håndteres derfor med Google sine gratis-verktøy:

- **Handlekurven** på `merch.html` (`merch-cart.js`) samler produkter/varianter og sender bestillingen som JSON.
- Et **Google Apps Script** (en «web-app») tar imot bestillingen, skriver den som en rad i et **Google Sheet**, og sender et **e-postvarsel** til styret.
- `merch-config.js` peker på web-app-adressen og holder Vipps-info + bot-filter-token.

```
Handlekurv (merch.html) ──POST JSON──▶ Apps Script (/exec) ──▶ Google Sheet + e-post til styret
```

Hvis web-app-adressen ikke er satt i `merch-config.js`, faller siden tilbake til en ferdig utfylt **e-post-bestilling**, så «Send bestilling» aldri blir død.

### Innstillinger i `merch-config.js`

```js
window.MERCH_ORDER_ENDPOINT = '';          // web-app-URL fra Apps Script (slutter på /exec)
window.MERCH_ORDER_EMAIL    = 'DIN_EPOST'; // brukes til e-post-fallback
window.MERCH_VIPPS          = '#XXXXXX «Apeiron»'; // vises i kurven (betaling via Vipps)
window.MERCH_ORDER_TOKEN    = '';          // bot-filter-token (samme streng som i Apps Script)
```

### Bot-filter (mot spam-bestillinger)

Endepunktet må være offentlig for at nettsiden skal kunne sende inn, men det kan **kun skrive** bestillinger — ingen kan lese ut data via lenken. To enkle lag filtrerer bort bots:

1. **Delt token:** sett samme tilfeldige streng i `MERCH_ORDER_TOKEN` (`merch-config.js`) og `ORDER_TOKEN` (Apps Script). Skriptet avviser innsendinger uten riktig token.
2. **Honeypot:** handlekurven har et skjult felt som bots fyller ut, men ikke mennesker. Slike innsendinger forkastes automatisk.

> Dette er et **bot-filter, ikke ekte sikkerhet:** token-en ligger åpent i klient-koden, så en målrettet person kan kopiere den. Men siden dette er et **skriv**-endepunkt, har filteret reell verdi: det fjerner nær sagt all automatisk drive-by-spam (falske bestillinger + e-postvarsler). **Ikke** lim den ekte `SHEET_ID`-en eller `/exec`-URL-en inn i offentlige filer som denne README-en.

### Oppsett (kort)

Full steg-for-steg-guide ligger i [`docs/apps-script-oppsett.md`](docs/apps-script-oppsett.md). Kort fortalt:

1. Lag et Google Sheet med overskriftene `Tidspunkt | Navn | E-post | Telefon | Bestilling | Kommentar | Total` (A1–G1).
2. **Utvidelser → Apps Script**, lim inn koden under (bytt ut plassholderne), lagre.
3. **Distribuer → Ny distribusjon → Web-app**: «Kjør som: Meg», «Hvem har tilgang: Alle». Godkjenn tilgang.
4. Kopier web-app-URL-en (`…/exec`) inn i `MERCH_ORDER_ENDPOINT`.
5. Endrer du skriptet senere: **Distribuer → Administrer distribusjoner → Ny versjon** (URL-en forblir den samme).

<details>
<summary><b>Hele Apps Script-koden (klikk for å vise)</b></summary>

```javascript
// ── Apeiron — mottak av merch-bestillinger ──
// Skriver hver bestilling til arket og varsler styret på e-post.

var STYRE_EPOST = 'DIN_STYRE_EPOST@example.com';   // ← hvem som skal varsles
var SHEET_ID    = 'DITT_GOOGLE_SHEET_ID';          // ← ID fra Sheet-URL-en (…/d/DETTE/edit)
var ORDER_TOKEN = 'EN_HEMMELIG_TILFELDIG_STRENG';  // ← samme streng som MERCH_ORDER_TOKEN i merch-config.js

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Bot-filter (ikke sikkerhet): avvis hvis token ikke stemmer (når token er satt).
    if (ORDER_TOKEN && data.token !== ORDER_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Bygg en lesbar oppsummering av handlekurven, med pris per linje
    var linjer = (data.items || []).map(function (it) {
      var v = [];
      if (it.size)  v.push('str: ' + it.size);
      if (it.color) v.push('farge: ' + it.color);
      var variant = v.length ? ' (' + v.join(', ') + ')' : '';
      var linjepris = (it.lineTotal != null) ? it.lineTotal
                    : (it.price != null ? it.price * it.qty : null);
      var pris = (linjepris != null) ? ' – ' + linjepris + ',–' : '';
      return '• ' + it.qty + '× ' + it.name + variant + pris;
    }).join('\n');

    var total = (data.total != null) ? data.total : '';

    // Åpne arket via ID (mer robust enn getActiveSpreadsheet i web-app)
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.phone || '',
      linjer,
      data.comment || '',
      total
    ]);

    // E-postvarsel til styret
    MailApp.sendEmail({
      to: STYRE_EPOST,
      subject: 'Ny merch-bestilling fra ' + (data.name || 'ukjent'),
      body: 'Ny bestilling mottatt:\n\n'
        + 'Navn: ' + (data.name || '') + '\n'
        + 'E-post: ' + (data.email || '') + '\n'
        + 'Telefon: ' + (data.phone || '') + '\n\n'
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

</details>

---

## Filstruktur
<details>
<summary><b>Hele filstrukturen og kort forklaring av hva filene er (klikk for å vise)</b></summary>

| Fil                           | Hva det er                                                                       |
| -------------------------------| ----------------------------------------------------------------------------------|
| `index.html`                  | Forsiden (hoveddelen av nettsiden)                                               |
| `pensum.html`                 | Pensum-oversikt                                                                  |
| `merch.html`                  | Merch-side (produkter hentes fra `merch-products.js`)                            |
| `merch-admin.html`            | 'Passordbeskyttet' admin-panel for å redigere merch                              |
| `merch-products.js`           | Produktdata for merch (redigeres via admin-panel)                                |
| `merch-cart.js`               | Handlekurv + bestilling på merch-siden                                           |
| `merch-config.js`             | Innstillinger for merch-bestilling (Apps Script-URL, Vipps, bot-filter-token)    |
| `apeiron-news.js`             | Henter «trådløse» nyheter til forsiden fra «Apeiron Nyheter» (Apps Script)       |
| `news-config.js`              | Innstillinger for nyheter (eget Apps Script-URL + bot-filter-token)              |
| `medlemskap-admin.html`       | 'Passordbeskyttet' admin-panel for medlemskapspriser                             |
| `membership-config.js`        | Medlemskapsdata (priser/Vipps/steg — redigeres via admin-panel)                  |
| `membership.js`               | Fyller «Bli medlem»-kortet på forsiden fra `membership-config.js`                |
| `admin-common.js`             | Delt admin-logikk: innlogging, «logg ut», varsler, hjelpebobler, fillagring      |
| `admin-common.css`            | Delt stil for admin-panelene                                                     |
| `docs/apps-script-oppsett.md` | Steg-for-steg-guide for Google Sheet + Apps Script (merch-bestilling + nyheter)  |
| `galleri.html`                | Bildegalleri (henter automatisk fra Google Drive)                                |
| `marked.html`                 | Kjøp & bytte (pensum-marked)                                                     |
| `begrep.html`                 | Side for Begrep-tidsskriftet (utgaver, podkast, film, julekalender)              |
| `begrep-admin.html`           | 'Passordbeskyttet' admin-panel for å redigere Begrep-innhold                     |
| `begrep-content.js`           | Innholdsdata for Begrep-siden (redigeres via admin-panel)                        |
| `hjelp.html`                  | Hjelp & ressurser (leser fra `hjelp-content.js`)                                 |
| `hjelp-admin.html`            | 'Passordbeskyttet' admin-panel for å redigere Hjelp-siden                        |
| `hjelp-content.js`            | Innholdsdata for Hjelp-siden (redigeres via admin-panel)                         |
| `styret.html`                 | Styret og beskrivelse av alle styreverv (leser fra `styret-content.js`)          |
| `styret-admin.html`           | 'Passordbeskyttet' admin-panel for å redigere styret og verv                     |
| `styret-content.js`           | Innholdsdata for styret-siden (redigeres via admin-panel)                        |
| `styles.css`                  | All styling                                                                      |
| `app.js`                      | Meny, scroll-animasjoner og generell funksjonalitet                              |
| `theme.js`                    | Lys/mørk-modus: setter `data-mode` på `<html>` før første paint og binder toggle |
| `apeiron-events.js`           | Henter arrangementer fra Google Kalender                                         |
| `apeiron-fadder.js`           | Henter fadderuke-program fra Google Kalender                                     |
| `aporetisk-cal.js`            | Kalender for Aporetisk Aften                                                     |
| `site-search.js`              | Søkefunksjon                                                                     |
| `image-slot.js`               | Gjenbrukbar bildekomponent (`<image-slot>`), bl.a. for styrebilder               |
| `assets/merch/`               | Bilder for merch-produkter (alternativ til base64)                               |
| `assets/begrep/`              | Bilder for Begrep-utgaver og -innhold                                            |
| `assets/Styremedlemmer/`      | Portrettbilder av styremedlemmer (alternativ til base64)                         |
| `assets/`                     | Logo og andre bilder                                                             |
| `_headers`                    | Cloudflare Pages — HTTP-sikkerhetsheadere                                        |
</details>


---

## Første gangs oppsett (om noe skulle skje hos Cloudflare)

Hvis repoet ikke er koblet til Cloudflare Pages, eller om man ønsker å bytte Cloudflare-bruker:

1. Last opp filene til et GitHub-repo
2. Gå til [dash.cloudflare.com](https://dash.cloudflare.com) → «Workers & Pages» → «Create» → «Pages» → «Connect to Git» → velg repoet
3. Sett «Framework preset» til «None» og la «Build command» stå tom. «Build output directory» settes til `/`.
4. Trykk «Save and Deploy» — fra nå av skjer alt automatisk