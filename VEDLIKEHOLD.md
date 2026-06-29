# VEDLIKEHOLD.md: teknisk dokumentasjon

Denne fila er for de som **drifter koden** bak Apeiron-nettsiden: publisering, oppsett,
filstruktur, manuell redigering og de tekniske integrasjonene (Google Kalender/Drive,
Apps Script).

> 👉 Skal du bare **endre innhold** (nyheter, styret, merch, bilder osv.)? Da hører du
> hjemme i **brukerveiledningen i [README.md](README.md)**. Alt innhold redigeres i
> Admin-senteret, uten å røre kode. Vanlige brukere skal **aldri** redigere kodefiler direkte på GitHub.

**Innhold**
1. [Slik fungerer publisering (Cloudflare + GitHub)](#slik-fungerer-publisering-cloudflare-pages--github)
2. [Endre filer på GitHub eller lokalt](#endre-filer-på-github-eller-lokalt)
3. [Admin-arkitektur](#admin-arkitektur)
4. [Manuell redigering av innholdsfilene](#manuell-redigering-av-innholdsfilene)
5. [Pensum](#pensum)
6. [Lesesalen: bilder](#lesesalen-bilder)
7. [Slik fungerer søket](#slik-fungerer-søket)
8. [Merch-bestilling: Google Sheet + Apps Script](#merch-bestilling-google-sheet--apps-script)
9. [Filstruktur](#filstruktur)
10. [Synlighet i søkemotorer og KI (SEO)](#synlighet-i-søkemotorer-og-ki-seo)
11. [Sikkerhet og konfigurasjon](#sikkerhet-og-konfigurasjon)
12. [Første gangs oppsett (Cloudflare)](#første-gangs-oppsett-cloudflare)

---

## Slik fungerer publisering (Cloudflare Pages + GitHub)

Nettsiden er koblet opp slik:

```
Du redigerer/erstatter en fil  →  pusher til GitHub  →  Cloudflare Pages oppdaterer siden automatisk
```

Du trenger **ikke** å gjøre noe på Cloudflare manuelt. Det skjer av seg selv når
endringer pushes til GitHub-repoet. Vanligvis tar det under ett minutt fra push til
siden er live.

**Publisering fra Admin-senteret (G1):** med GitHub-innlogging committer admin
endringene **rett til repoet** når du trykker «☁ Publiser til GitHub», uten
nedlasting og uten manuell push. Innloggingen kjører server-løst på Cloudflare Pages
Functions (`functions/api/github/`); tokenet ligger i en httpOnly-cookie og når aldri
nettleseren. Cookien varer **30 dager** (`setCookie(…, 2592000)` i `callback.js`, og
standard i `_common.js`), så redaktører slipper å logge inn på nytt hver økt. Engangs-
oppsett (GitHub OAuth-app + miljøvariabler) er beskrevet i
[docs/g1-oppsett.md](docs/g1-oppsett.md).

**Konfliktsjekk ved samtidig redigering:** rett før en commit spør admin
`/api/github/latest` (se `functions/api/github/latest.js`) om branchen har flyttet seg
siden admin ble åpnet. Har en annen redaktør publisert **de samme innholdsfilene** i
mellomtiden, vises et varsel med valget «↻ Last inn på nytt» eller «Publiser likevel»,
så man ikke uforvarende overskriver andres publiserte arbeid. Redigeres ulike filer,
flettes de automatisk (`base_tree` i `commit.js`). Endepunktet driver også «Sist
publisert: navn · tidspunkt» i admin-toppen. *(Dette forhindrer ikke samtidig
redigering, men gjør en stille overskriving synlig.)*

**Angre siste publisering:** på **Oversikt**, under «Slik publiserer du», ligger
**↩ Angre siste publisering** (kun synlig når man er innlogget på GitHub). Den ruller
hele nettsiden tilbake til slik den var **før den siste publiseringen**, ved å lage en
ny commit som peker på forrige tre (`functions/api/github/revert.js`). GitHub beholder
all historikk — angringen er bare nok en commit på toppen, og kan angres på nytt (klikk
igjen for å hente endringen tilbake). Før den kjører, viser admin nøyaktig hvilken
publisering som angres og hvilken tilstand man havner på (`history.js`), og en konfliktvakt
avbryter hvis en annen redaktør har publisert i mellomtiden («last inn på nytt»). Som
all annen publisering utløser angringen en ny Cloudflare-deploy — live innen ~1 minutt.

**Reserveløsning:** «↓ Last ned alle endrede» (i admin: **Oversikt → «Publisering
virker ikke?»**) laster fortsatt ned de ferdige filene, slik at en redaktør kan legge
dem inn i GitHub manuelt hvis publiseringen ikke virker. Det er denne opplastingen,
eller G1-commiten, som utløser en ny Cloudflare-deploy.

---

## Endre filer på GitHub eller lokalt

> Dette er drifter-arbeid. Innholdsredaktører gjør alt i Admin-senteret og laster bare
> opp de nedlastede filene (steg 3 i brukerveiledningen i [README.md](README.md)).

**Alternativ A: direkte på GitHub.com (enklest, ingen installasjon):**

1. Gå til repoet på [github.com](https://github.com)
2. Klikk på filen du vil endre (f.eks. `index.html`)
3. Trykk på blyant-ikonet (✏️ «Edit this file») øverst til høyre
4. Gjør endringen
5. Rull ned og trykk **«Commit changes»**
6. Cloudflare Pages plukker opp endringen automatisk

For å **erstatte** en fil (slik en nedlastet admin-fil legges inn): gå til mappa på
GitHub → **Add file → Upload files** → dra inn fila med samme navn → **Commit**.

**Alternativ B: lokalt på PC (for større endringer):**

```bash
git pull                 # hent siste versjon
# gjør endringene i en teksteditor (f.eks. VS Codium)
git add .
git commit -m "Kort beskrivelse av hva du endret"
git push                 # Cloudflare oppdaterer siden automatisk
```

> 💡 Claude (Sonnet/Opus) kan spare deg timer på større endringer. Til vanlig
> innholdsarbeid bruk Admin-senteret.

### Lokal kjøring (VS Codium + GitHub Desktop)

**Engangsoppsett:**

1. Installer [GitHub Desktop](https://desktop.github.com/) og logg inn
2. Installer [VS Codium](https://vscodium.com/)
3. I GitHub Desktop: **File → Clone repository** → velg Apeiron-repoet → velg mappe → **Clone**

**Hver gang:**

1. **Fetch / Pull origin** for å hente siste versjon
2. **Open in VS Codium** og gjør endringene
3. Se siden lokalt (under)
4. Skriv en beskrivelse → **Commit to main** → **Push origin**

**Se siden lokalt:** åpne `index.html` i nettleseren, eller lim inn stien i adressefeltet:
`file:///[mappe]/ApeironLF/index.html`

**Se en admin-endring lokalt før push:** admin-panelene laster alltid **ned** den
oppdaterte datafila (f.eks. `merch-products.js`). Legg den nedlastede fila over den
tilsvarende fila i din lokale klone og oppdater nettleseren.

> Tidligere fantes en «skriv rett til repo-fila»-funksjon (File System Access), men den
> ble fjernet fordi den feilet på enkelte systemer. Admin laster nå **alltid** ned fila.

---

## Admin-arkitektur

`admin.html` er et **skall** som mounter editor-moduler inline. De 13 panelene ligger i
`admin-modules/<id>.js` og deler fundament gjennom `admin-common.js` (datalager
`createStore`, drag-sortering, hjelpebobler, nedlasting, panel-registeret `AdminPanels`).
Per-modul-CSS ligger klasse-scopet i `admin-modules.css`.

Full beskrivelse: [`docs/admin-arkitektur.md`](docs/admin-arkitektur.md).

Hver modul med søkbart innhold har en `searchEntries()`-funksjon som mater søkeindeksen
(se [Slik fungerer søket](#slik-fungerer-søket)).

---

## Manuell redigering av innholdsfilene

Alt dette gjøres normalt i Admin-senteret. Men hver del kan også redigeres for hånd i
sin `*-content.js`-fil, nyttig for drift, feilsøk og bulk-endringer.

### 👥 Styret: `styret-content.js`

Både `styret.html` og `styret-arkiv.html` (og forside-teaseren) leser fra denne fila.
`window.STYRET_CONTENT` har seksjonene `board`/`verv` (overskrifter), `members`, `roles`
og `archive`.

- `members[]`: `name`, `role`, `initials`, `img`, `tags` (chips med `label` og `color`:
  `""` nøytral, `"maroon"`, `"gold"`, eller `{ light, dark }`)
- `roles[]`: `name`, `desc`, `resp[]`, `eyebrow`, `accent` (fargestripe)
- `archive[]`: tidligere styrer `{ period, heading, summary, highlights[], members[] }`
- **Bilder lagres som egne filer, ikke base64.** `img` er en sti: eldre bilder i
  `assets/Styremedlemmer/filnavn.jpg`, nye fra admin i `assets/styret/<id>.webp`
  (arkivbilder i `assets/styret/arkiv/`). Admin laster portrettene ned som **egne
  bildefiler** (én og én, ingen zip) ved publisering. Legg dem i `assets/styret/`.
  Tomt `img` = bare initialer.

### 🛍️ Merch: `merch-products.js`

Hvert produkt er et objekt i `window.MERCH_PRODUCTS`:

```js
{
  id: "unikt-id",
  badge: "Snart utsolgt",    // egendefinert badge-tekst (kun når badgeType er null)
  badgeType: "new",          // "new" | "bestseller" | "limited" | null (preset)
  badgeGlow: null,           // animert glød, f.eks. { anim: "ember-soft" } eller null
  category: "Klær",
  name: "Produktnavn",
  desc: "Kort beskrivelse.",
  price: 299,                // null = skjuler pris, viser «Kommer snart»
  memberPrice: 249,          // utelat/null hvis ingen medlemspris
  sizes: ["S", "M", "L"],    // varianter (nedtrekk i kurven), eller null
  colors: ["Marineblå"],     // varianter, eller null
  img: null,                 // null = segl-watermark; "assets/merch/fil.jpg";
                             // eller base64-streng fra admin
}
```

> **Badge:** velg **enten** preset (`badgeType`) **eller** egendefinert (`badge`). For
> merch lagres admin-bilder som **base64** i `images[]`/`img` (eller stier til
> `assets/merch/...`). Hoved = `images[0]`. `colorImages: { "Fargenavn": indeks }` bytter
> hovedbildet når en farge velges.

### 📰 Begrep: `begrep-content.js`

`window.BEGREP_CONTENT` med seksjonene `meta`, `issues`, `podcasts`, `films`,
`christmas`. Bilder: `null` (plassholder), `"assets/begrep/fil.png"` eller base64 fra
admin. `meta` rommer bl.a. `email` og `orderFormUrl`.

### 🆘 Hjelp: `hjelp-content.js`

`window.HJELP_CONTENT` med seksjonene `hero`, `sifra`, `studier`, `helse`, `fysisk`,
`akutt`. Ressurskort (`*.cards[]`): `eyebrow`, `accent`, `name`, `desc`, `resp[]`,
`contacts[]`, `noteTop`, `note`, `btnLabel`, `btnHref`. Tom linje i `desc` = nytt avsnitt.
`contacts` og «Si fra»-tekst tillater HTML (lenker, `<strong>`).

### 📰 Nyheter: `news-content.js`

`window.NEWS_CONTENT = { items: [...] }`. Felt per nyhet (forklart øverst i fila):
`place` (`panel`/`arrangement`/`aporetisk`/`fadderuke`), `urgent`, `title`, `text`
(støtter `**fet**`, `*kursiv*`, `_understrek_`, `[tekst](url)`, linjeskift), `date`,
`link`, `linkLabel`, `done` (arkivert). Nyheter lastes umiddelbart fra repoet. Det gamle
Google Sheet-systemet er borte.

> **Neste arrangement** i «Akkurat nå»-kortet hentes automatisk fra
> arrangementskalenderen, og legges ikke inn som nyhet.

### 🏛️ Forsiden / 📖 Om oss

Forsidens tekster (toppbilde, om-seksjon, FAQ, kontakt) ligger i `index-content.js`;
Om oss-siden i `om-content.js`. Begge redigeres i Admin-senteret med live preview.

**Galleribilder på forsiden.** Admin → Forsiden har et eget panel som kan vise
bilder fra galleriet på forsiden, **av som standard**. Innstillingene ligger i
`heroGallery` i `index-content.js`; `apeiron-hero-gallery.js` (+ `hero-gallery.css`)
rendrer dem og henter bilder **tilfeldig fra hele Drive-galleriet** (samme
`ROOT_FOLDER_ID` som Galleri-siden), bufret 6 t i nettleseren. Fire stiler
(A rullende bånd · B mosaikk · C polaroider · D svevende bak hero), fem D-animasjoner
(diagonal, loddrett, Ken Burns, krysstoning, DVD-sprett) og DVD-motiv som kan bytte
mellom logovarianter (`assets/dvd-logos/`). Injeksjonspunkter i `index.html`:
`#hg-top` (under hero) og `#hg-before-medlem`; stil D legges rett i `.hero`. Motoren
leser også admin-utkastet fra `localStorage` ved vanlige sidelastinger, så
forhåndsvisningen overlever navigasjon.

---

## Pensum

Pensum redigeres i **Admin-senteret → Pensum** (eget panel siden 21.06.26). Innholdet
ligger i `pensum-content.js` (`window.PENSUM_CONTENT`) og gjengis av `apeiron-pensum.js`;
søk/filter/trekkspill-logikken bor i `pensum.html`.

- **Emner** er gruppert per **seksjon** og redigeres som sammenleggbare kort (kode, navn,
  semester, beskrivelse, ntnu-lenke + enten bokliste eller en «melding/tom-tilstand»).
- **Seksjonene** (`sections`-lista: `{ id, label, short, color }`) er studieretningene
  emnene deles inn i. De kan legges til, slettes, endre navn, sorteres og farges i panelet.
  Vil man skille f.eks. årsstudium fra bachelor, eller master i etikk fra master i filosofi,
  legger man bare til en ny seksjon og flytter emnene dit (via «Seksjon» på hvert emne).
- Filter-fanene, fargemerkene og gruppeoverskriftene på `pensum.html` **bygges dynamisk**
  fra `sections`. Nye/delte seksjoner får sin egen fane og merke automatisk, ingen
  kodeendring nødvendig.

> Ambisjon: koble mot en NTNU-API slik at emnene oppdateres automatisk. Inntil da
> vedlikeholdes pensum i admin.

---

## Lesesalen: bilder

Bildene på forsiden ligger i `assets/lesesalen/` med mønsteret `lesesal1.jpg`,
`lesesal2.jpg`, … Siden oppdager hele sekvensen automatisk.

- `lesesal1.jpg` = stort hovedbilde; `lesesal2.jpg`+ = den rullende stripa under
- **Legg til/bytt:** gi bildet `lesesalX.jpg` (neste ledige nummer), legg i mappa, push
- **Fjern:** slett fila, men unngå hull i nummereringen (fjernes `lesesal3.jpg` slutter
  alt fra `lesesal4.jpg` å vises). Rename så sekvensen er sammenhengende.
- **Bytt hovedbilde:** gi ønsket bilde navnet `lesesal1.jpg`
- **Format:** `.jpg`/`.jpeg`, helst under 1–2 MB per fil

---

## Slik fungerer søket

Søket (forstørrelsesglasset, eller **Ctrl/Cmd + K**) leter gjennom en **søkeindeks**.
Den regenereres automatisk når du publiserer fra Admin-senteret.

| Fil | Hva den er | Redigeres |
| --- | --- | --- |
| `site-search.js` | Selve søkefunksjonen (overlay, tastatur, MiniSearch-motor) | Sjelden, kun ved endret *oppførsel* |
| `minisearch.min.js` | Søkemotor-biblioteket (MiniSearch v7, vendet inn, ingen CDN). Lastes **før** `site-search.js` | Aldri, bytt kun ved versjonsoppgradering |
| `search-index.js` | **Auto-generert** liste over alle treff. Lastes på alle sider | **Aldri for hånd**, genereres ved «Publiser» |
| `search-base.js` | Statiske treff som *ikke* kommer fra en admin-modul (sider, seksjoner, emner) | For hånd, ved behov |

**Motoren:** søket bruker **MiniSearch** med en norsk stemmer (bøyning: «studieretninger»
finner «studieretning») og fuzzy-treff (skrivefeil: «filosfi» finner «filosofi»). Faller
automatisk tilbake til enkel delstreng-scoring hvis biblioteket ikke skulle laste. Indeksen
bygges i nettleseren fra `search-index.js` ved hver sidelast, så nytt publisert innhold er
automatisk søkbart. Uregelmessige ord stemmeren bommer på legges i `SYN`-lista øverst i
`site-search.js`.

> Nye sider må laste `minisearch.min.js` **før** `site-search.js` (rett etter `search-index.js`).

- **Dynamiske treff** kommer fra modulenes `searchEntries()` (styremedlemmer,
  merch-produkter, Begrep-podkast, oppnåelser, utmerkelser, nyheter).
- **Statiske treff** (Forsiden/Om oss/Galleri, seksjoner, pensum-emner) ligger i
  `search-base.js`.

**Oppdatering (automatisk):** ved «↓ Last ned» / «Last ned alle endrede» lastes
`search-index.js` ned i tillegg **hvis** søkeinnholdet har endret seg. Legg den ved
committen.

**Rediger `search-base.js` for hånd** kun ved nytt som ikke finnes i en admin-modul (ny
side, ny seksjon, nytt emne):

```js
{ t: 'Tittel som vises', d: 'Kort beskrivelse (søkbar).', u: 'side.html#anker', g: 'Pensum' }
```

`g` må være en kjent gruppe: `Startside`, `Nyheter`, `Om oss`, `Styret`, `Heder`,
`Pensum`, `Merch`, `Begrep`, `Galleri`. (Ny gruppe må også legges i `ICONS` og
`GROUP_ORDER` øverst i `site-search.js`.)

> ⚠️ **Rediger aldri `search-index.js` direkte**. Den overskrives ved neste publisering.

### Oppdatere søkemotoren (MiniSearch): kun ved behov

`minisearch.min.js` er **frosset** på én versjon (MiniSearch v7) og oppdateres aldri av
seg selv. Du trenger **ikke** vedlikeholde den. Biblioteket kjører i nettleseren på våre
egne statiske data, så det er ingen sikkerhetsgrunn til å oppgradere. Gjør det **bare** hvis
en nyere versjon gir noe dere faktisk vil ha, eller for å rette en konkret feil.

Slik oppdaterer du (engangsjobb: «bytt ut den ene fila og test»):

1. **Hent det nye UMD-bygget.** Last ned fra et CDN og bytt versjonsnummeret til det nyeste:
   `https://cdn.jsdelivr.net/npm/minisearch@7.1.0/dist/umd/index.min.js`
   (fila som starter med `!function(t,e)…` og definerer `window.MiniSearch`).
2. **Lagre den over `minisearch.min.js`**, *samme filnavn*. Da slipper du å røre de 14
   sidene; de peker allerede på det navnet.
3. **Test søket:** åpne en side, trykk **⌘/Ctrl + K**, og søk på noe med bøyning
   («studieretninger» skal finne «studieretning») og en skrivefeil («filosfi» skal finne
   «filosofi»). Virker det som før, er du i mål.
4. **Commit/push** den ene fila.

> ⚠️ **Hovedversjon-hopp (f.eks. v7 → v8)** kan endre hvordan biblioteket kalles.
> `site-search.js` bruker tre ting: `new MiniSearch({…})`, `.addAll(…)` og
> `.search(q, { prefix, fuzzy, boost, combineWith })`. Endrer en storversjon noen av disse,
> må `site-search.js` justeres tilsvarende. Innenfor samme storversjon (v7.x) er det et rent
> drop-in-bytte. Er du i tvil, la utvikleren ta hovedversjon-hopp så API-et sjekkes samtidig.

---

## Merch-bestilling: Google Sheet + Apps Script

Nettsiden er statisk og har ingen egen server. Merch-bestillinger håndteres med Googles
gratisverktøy:

- **Handlekurven** på `merch.html` (`merch-cart.js`) sender bestillingen som JSON.
- Et **Google Apps Script** (web-app) skriver den til et **Google Sheet** og sender
  **e-postvarsel** til styret.
- `merch-config.js` peker på web-app-adressen + Vipps-info + bot-filter-token.

```
Handlekurv (merch.html) ──POST JSON──▶ Apps Script (/exec) ──▶ Google Sheet + e-post
```

Er web-app-adressen ikke satt, faller siden tilbake til en ferdigutfylt
**e-post-bestilling**, så «Send bestilling» aldri blir død.

### Innstillinger i `merch-config.js`

```js
window.MERCH_ORDER_ENDPOINT = '';          // web-app-URL (slutter på /exec)
window.MERCH_ORDER_EMAIL    = 'DIN_EPOST'; // e-post-fallback
window.MERCH_VIPPS          = '#XXXXXX «Apeiron»';
window.MERCH_ORDER_TOKEN    = '';          // bot-filter-token (samme som i Apps Script)
```

### Bot-filter (mot spam)

Endepunktet er offentlig (skriv-bare, ingen kan lese ut data). To lag:

1. **Delt token:** samme tilfeldige streng i `MERCH_ORDER_TOKEN` og `ORDER_TOKEN` (Apps
   Script). Innsendinger uten riktig token avvises.
2. **Honeypot:** et skjult felt som bots fyller ut, men ikke mennesker.

> Dette er et **bot-filter, ikke ekte sikkerhet**, token-en ligger i klient-koden. Men
> som skriv-endepunkt har det reell verdi mot drive-by-spam. **Ikke** lim den ekte
> `SHEET_ID` eller `/exec`-URL inn i offentlige filer.

### Oppsett (kort)

Full guide: [`docs/apps-script-oppsett.md`](docs/apps-script-oppsett.md). Kort:

1. Google Sheet med overskrifter `Tidspunkt | Navn | E-post | Telefon | Bestilling | Kommentar | Total` (A1–G1)
2. **Utvidelser → Apps Script**, lim inn koden (bytt plassholdere), lagre
3. **Distribuer → Web-app**: «Kjør som: Meg», «Tilgang: Alle». Godkjenn
4. Kopier `…/exec`-URL inn i `MERCH_ORDER_ENDPOINT`
5. Senere endringer: **Distribuer → Administrer distribusjoner → Ny versjon** (samme URL)

<details>
<summary><b>Hele Apps Script-koden (klikk for å vise)</b></summary>

```javascript
// ── Apeiron: mottak av merch-bestillinger ──
var STYRE_EPOST = 'DIN_STYRE_EPOST@example.com';   // ← hvem som varsles
var SHEET_ID    = 'DITT_GOOGLE_SHEET_ID';          // ← ID fra Sheet-URL (…/d/DETTE/edit)
var ORDER_TOKEN = 'EN_HEMMELIG_TILFELDIG_STRENG';  // ← samme som MERCH_ORDER_TOKEN

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (ORDER_TOKEN && data.token !== ORDER_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

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

    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    sheet.appendRow([
      new Date(), data.name || '', data.email || '', data.phone || '',
      linjer, data.comment || '', total
    ]);

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

**Sider (HTML)**

| Fil | Hva det er |
| --- | --- |
| `index.html` | Forsiden «Hjem»: toppbilde, om, FAQ, kontakt (tekst fra `index-content.js`) |
| `om-oss.html` | «Om oss»-siden (fra `om-content.js`) |
| `nyheter.html` | Nyhetsside med arkiv |
| `oppslagstavla.html` | Oppslagstavla: plakater (fra `oppslag-content.js`) |
| `pensum.html` | Pensum-oversikt (fra `pensum-content.js`) |
| `styret.html` | Styret og styreverv (fra `styret-content.js`) |
| `styret-arkiv.html` | Arkiv over tidligere styrer (fra `archive[]` i `styret-content.js`) |
| `begrep.html` | Begrep-tidsskriftet (fra `begrep-content.js`) |
| `merch.html` | Merch-butikk (fra `merch-products.js`) |
| `marked.html` | Kjøp & bytte (pensum-marked) |
| `galleri.html` | Bildegalleri (henter automatisk fra Google Drive) |
| `hjelp.html` | Hjelp & ressurser (fra `hjelp-content.js`) |
| `oppnaelser.html` | Oppnåelser / milepæler (fra `oppnaelser-content.js`) |
| `utmerkelser.html` | Utmerkelser / priser (fra `utmerkelser-content.js`) |
| `admin.html` | **Admin-senter**: én inngang for all redigering; mounter modulene |

**Innholds- og innstillingsfiler (redigeres via Admin-senteret)**

| Fil | Hva det er |
| --- | --- |
| `index-content.js` | Forsidens tekster (Admin → Forsiden) |
| `om-content.js` | Om oss-innhold (Admin → Om oss) |
| `news-content.js` | Nyheter/beskjeder (Admin → Nyheter) |
| `oppslag-content.js` | Oppslagstavla-plakater (Admin → Oppslagstavla) |
| `styret-content.js` | Styremedlemmer og verv (Admin → Styret) |
| `begrep-content.js` | Begrep-siden (Admin → Begrep) |
| `hjelp-content.js` | Hjelp-siden (Admin → Hjelp) |
| `oppnaelser-content.js` | Oppnåelser (Admin → Oppnåelser) |
| `utmerkelser-content.js` | Utmerkelser (Admin → Utmerkelser) |
| `merch-products.js` | Merch-produkter (Admin → Merch) |
| `membership-config.js` | Medlemskap: priser/Vipps/steg (Admin → Medlemskap) |
| `nav-content.js` | Lenkene i hovedmenyen (Admin → Meny) |
| `site-content.js` | Footer-lenker og sosiale ikoner (Admin → Footer) |
| `merch-config.js` | Merch-bestilling: Apps Script-URL, Vipps, token |
| `api-config.js` | Lokal stub for Google-API-nøkkel (gitignorert; settes i prod av Cloudflare) |

**Renderere og funksjonalitet (røres normalt ikke)**

| Fil | Hva det er |
| --- | --- |
| `site-chrome.js` | Bygger meny + footer på alle sider |
| `apeiron-index.js` | Rendrer forsiden fra `index-content.js` |
| `apeiron-hero-gallery.js` | Galleribilder på forsiden (stil A/B/C/D + DVD), live fra Drive. Styres av `heroGallery` i `index-content.js`; krever `hero-gallery.css`. Av som standard |
| `apeiron-om.js` | Rendrer Om oss-siden fra `om-content.js` |
| `apeiron-news.js` | «Akkurat nå»-kort + beskjeder (leser `news-content.js`) |
| `apeiron-events.js` | Henter arrangementer fra Google Kalender |
| `apeiron-fadder.js` | Henter fadderuke-program fra Google Kalender |
| `aporetisk-cal.js` | Kalender for Aporetisk Aften |
| `membership.js` | Fyller «Bli medlem»-kortet fra `membership-config.js` |
| `merch-cart.js` | Handlekurv + bestilling på merch-siden |
| `report.js` | «Rapporter en feil»-boksen (alle sider) |
| `app.js` | Forside-interaksjoner: FAQ, scroll-reveal, statistikk-teller |
| `theme.js` | Lys/mørk-modus: setter `data-mode` før første paint |
| `palette.js` | Felles fargesystem (lys/mørk per navngitt farge) |
| `footer-icons.js` | Delt ikonsett for footeren |
| `image-slot.js` | Gjenbrukbar bildekomponent (`<image-slot>`) |
| `site-search.js` | Søkefunksjon (overlay + MiniSearch-motor) |
| `minisearch.min.js` | Søkemotor-bibliotek (MiniSearch v7, vendet inn) |
| `search-base.js` | Statiske søketreff: input til indeksen |
| `search-index.js` | Auto-generert søkeindeks (rediger aldri for hånd) |
| `styles.css` | All styling for de offentlige sidene |

**Admin (Admin-senteret)**

| Fil | Hva det er |
| --- | --- |
| `admin-common.js` | Delt admin-logikk: `createStore`, drag-sortering, hjelpebobler, nedlasting, `AdminPanels` |
| `admin-image-editor.js` | Gjenbrukbart bilderedigeringsvindu (flytt/zoom/roter/speilvend/lys/kontrast) |
| `admin-common.css` | Delt stil for admin-skallet |
| `admin-modules.css` | Per-modul admin-stil (klasse-scopet, f.eks. `.mod-merch`) |
| `admin-modules/` | Én fil per editor (13 moduler: nyheter, oppslag, forsiden, om-oss, styret, merch, begrep, medlemskap, hjelp, meny, footer, oppnaelser, utmerkelser) |

**Dokumentasjon og oppsett**

| Fil | Hva det er |
| --- | --- |
| `README.md` | Oversikt + brukerveiledning (endre innhold via Admin-senteret), to-do og domene-status |
| `VEDLIKEHOLD.md` | Denne fila: teknisk drift og dokumentasjon |
| `CHANGELOG.md` | Logg over hva som er gjort |
| `docs/admin-arkitektur.md` | Skall+modul-arkitekturen for Admin-senteret |
| `docs/apps-script-oppsett.md` | Google Sheet + Apps Script-guide (merch-bestilling) |
| `.gitignore` | Hva git hopper over (bl.a. `api-config.js`, `Plan F.html`) |
| `.github/dependabot.yml` | Ukentlig sjekk av GitHub Actions-avhengigheter |
| `_headers` | Cloudflare Pages: HTTP-sikkerhetsheadere (trygg basis, uten CSP) |
| `robots.txt` | Crawler-regler: slipper inn søkemotorer/KI, holder admin+api ute, peker til sitemap |
| `sitemap.xml` | Liste over alle offentlige sider (oppdateres manuelt — se [SEO](#synlighet-i-søkemotorer-og-ki-seo)) |

**Bilder**

| Mappe | Hva det er |
| --- | --- |
| `assets/Styremedlemmer/` | Eldre/manuelt opplastede styreportretter (nye legges i `assets/styret/`) |
| `assets/styret/` | Styreportretter fra admin (`<id>.webp`); arkivbilder i `assets/styret/arkiv/` |
| `assets/begrep/` | Bilder for Begrep-innhold |
| `assets/merch/` | Bilder for merch-produkter (alternativ til base64) |
| `assets/lesesalen/` | Lesesal-bildene på forsiden (`lesesal1.jpg` …) |
| `assets/logikk-panikk/` | Plakatbilder brukt på oppslagstavla |
| `assets/oppnaelser/` | Bilder for oppnåelser-siden |
| `assets/apeiron-logo.png` | Logoen |

---

## Synlighet i søkemotorer og KI (SEO)

Tiltakene under gjør siden lettere å finne i søkemotorer (Google, Bing) og i KI/LLM-er
som søker på vegne av brukere (ChatGPT-søk, Perplexity, Google AI o.l.). Alt er
**maskinlesbar metadata** — ingenting av dette vises for besøkende, og det rører verken
admin, publisering eller hvordan siden ser ut.

> ⚠️ **Ikke skjult tekst i `<body>`.** Søkeordstappet, menneske-usynlig brødtekst
> (white-on-white, `display:none`, 0px-font) er en «black hat»-teknikk som Google og
> store LLM-er straffer (nedrangering/avindeksering). Den lovlige «usynlige» kanalen er
> JSON-LD og meta-tagger under — bruk dem, ikke skjult body-tekst.

**Hva som er på plass**

| Hva | Hvor | Rolle |
| --- | --- | --- |
| `robots.txt` | rot | Slipper inn alle crawlere (også KI), nekter `/admin.html` + `/api/`, peker til sitemap |
| `sitemap.xml` | rot | Liste over de 14 offentlige sidene med `lastmod`/`priority` |
| JSON-LD (`Organization`) | `index.html` `<head>` | Forteller hvem Apeiron er (NTNU, Dragvoll, 1981, sosiale lenker) |
| JSON-LD (`AboutPage`) | `om-oss.html` `<head>` | Fyldig, ærlig beskrivelse av foreningen + `knowsAbout` (fagområder) |
| `<link rel="canonical">` | alle 14 sider | Offisiell adresse per side — hindrer duplikat-telling |
| `og:*` + `twitter:*` | alle 14 sider | Pene delingskort på Facebook/LinkedIn/X |
| `google-site-verification` | `index.html` `<head>` | Verifiserer eierskap i Google Search Console — **må ikke fjernes** |

**Vedlikehold — to ting å huske:**

1. **Ny eller fjernet side?** Oppdater `sitemap.xml` manuelt (siden har ikke byggesteg,
   så den genereres ikke automatisk). Legg/fjern en `<url>`-blokk og sett riktig `<loc>`.
   Robots.txt trenger normalt ingen endring.
2. **Bytter dere domene?** Alle absolutte URL-er peker i dag på `https://apeironlf.pages.dev`.
   Ved nytt domene må basis-URL-en byttes i `robots.txt`, `sitemap.xml` og i `<head>`
   (`canonical`, `og:url`, `og:image`, `twitter:image`, JSON-LD) på alle sider. Finn alle
   forekomstene med:
   ```
   grep -rn "apeironlf.pages.dev" *.html robots.txt sitemap.xml
   ```

**Engangsoppsett hos søkemotorene (gjøres i nettleser, ikke i koden):**

- **Google Search Console** ([search.google.com/search-console](https://search.google.com/search-console)):
  legg til eiendommen `https://apeironlf.pages.dev`, verifiser via HTML-tag (allerede i
  `index.html`), og send inn `sitemap.xml` under «Sitemaps». Gir innsikt i søkeord,
  indeksering og feil.
- **Bing Webmaster Tools** ([bing.com/webmasters](https://www.bing.com/webmasters)):
  samme prinsipp. Bing driver søket bak ChatGPT, så dette treffer KI-synligheten direkte.

> 💡 Crawlere kjører ikke JavaScript, så de utløser **ikke** Google Calendar/Drive-API-kallene
> (de skjer klient-side). Å slippe crawlere inn belaster derfor ikke API-kvoten; statiske
> bilder serveres uansett av Cloudflares CDN.

---

## Sikkerhet og konfigurasjon

- **`api-config.js`** er en gitignorert lokal stub for Google-API-nøkkelen. I produksjon
  injiseres nøkkelen av Cloudflare, og **commit aldri** en ekte nøkkel. Nøkkelen er
  offentlig synlig i klienten og **må** derfor være låst i Google Cloud Console til
  riktig domene (HTTP-referrer) og kun Calendar + Drive API.
- **Bot-filter-token** (`MERCH_ORDER_TOKEN`) er et drive-by-spam-filter, ikke
  ekte sikkerhet. Hold ekte `SHEET_ID` / `/exec`-URL utenfor offentlige filer.
- **`_headers`** gir HTTP-sikkerhetsheadere via Cloudflare Pages, inkludert en
  **Content-Security-Policy (CSP)** skreddersydd for sidens kilder (Google Fonts,
  Calendar/Drive-API, merch-skjema, egne inline-skript). Legger du til en ny ekstern
  tjeneste eller embed, må riktig kilde inn i CSP-en, ellers blokkeres den. Clickjacking
  styres av `frame-ancestors 'self'` (erstatter `X-Frame-Options`).
- **Admin-publisering er begrenset til innhold.** `functions/api/github/commit.js` har en
  forbudt-liste (`isForbiddenPath`) som avviser skriving til `functions/`, `.github/`,
  `_headers`, `_redirects`, `api-config.js`, `.gitignore`, `wrangler.toml` og stier med
  `..`. Disse filene endres **kun via vanlig git-push** av en utvikler, aldri via admin.
  Skal admin kunne publisere en ny type fil, må lista justeres tilsvarende.
- **Ingen klient-passord på admin.** Admin-UI er åpent, men selve publiseringen krever
  GitHub-innlogging på serveren (`functions/api/github/`) + `ALLOWED_LOGINS`. Den ekte
  beskyttelsen er altså server-side, ikke i nettleseren.
- **Automatisk skanning:** CodeQL (`.github/workflows/codeql.yml`, `security-extended`),
  Dependabot og Dependency Review kjører på GitHub. Anbefalt i tillegg: 2FA på alle
  GitHub-kontoer i `ALLOWED_LOGINS` + Cloudflare, og en ruleset på `main` som blokkerer
  force-push og sletting.
- Galleri bruker en Google-API-nøkkel via `window.GOOGLE_API_KEY`; Drive-mappa må deles
  «Alle med lenken kan se».

---

## Første gangs oppsett (Cloudflare)

Hvis repoet ikke er koblet til Cloudflare Pages, eller man vil bytte Cloudflare-bruker:

1. Last opp filene til et GitHub-repo
2. [dash.cloudflare.com](https://dash.cloudflare.com) → «Workers & Pages» → «Create» →
   «Pages» → «Connect to Git» → velg repoet
3. «Framework preset» = «None», «Build command» tom, «Build output directory» = `/`
4. «Save and Deploy». Fra nå skjer alt automatisk
