# VEDLIKEHOLD.md — teknisk dokumentasjon

Denne fila er for de som **drifter koden** bak Apeiron-nettsiden: publisering, oppsett,
filstruktur, manuell redigering og de tekniske integrasjonene (Google Kalender/Drive,
Apps Script).

> 👉 Skal du bare **endre innhold** (nyheter, styret, merch, bilder osv.)? Da hører du
> hjemme i **brukerveiledningen i [README.md](README.md)** — alt innhold redigeres i
> Admin-senteret, uten å røre kode. Vanlige brukere skal **aldri** redigere kodefiler direkte på GitHub.

**Innhold**
1. [Slik fungerer publisering (Cloudflare + GitHub)](#slik-fungerer-publisering-cloudflare-pages--github)
2. [Endre filer — på GitHub eller lokalt](#endre-filer--på-github-eller-lokalt)
3. [Admin-arkitektur](#admin-arkitektur)
4. [Manuell redigering av innholdsfilene](#manuell-redigering-av-innholdsfilene)
5. [Pensum](#pensum)
6. [Lesesalen — bilder](#lesesalen--bilder)
7. [Slik fungerer søket](#slik-fungerer-søket)
8. [Merch-bestilling: Google Sheet + Apps Script](#merch-bestilling-google-sheet--apps-script)
9. [Filstruktur](#filstruktur)
10. [Sikkerhet og konfigurasjon](#sikkerhet-og-konfigurasjon)
11. [Første gangs oppsett (Cloudflare)](#første-gangs-oppsett-cloudflare)

---

## Slik fungerer publisering (Cloudflare Pages + GitHub)

Nettsiden er koblet opp slik:

```
Du redigerer/erstatter en fil  →  pusher til GitHub  →  Cloudflare Pages oppdaterer siden automatisk
```

Du trenger **ikke** å gjøre noe på Cloudflare manuelt. Det skjer av seg selv når
endringer pushes til GitHub-repoet. Vanligvis tar det under ett minutt fra push til
siden er live.

Admin-senteret skriver aldri til serveren selv — det **laster ned** ferdige filer som
en innholdsredaktør så legger inn i GitHub. Det er denne opplastingen som utløser en ny
Cloudflare-deploy.

---

## Endre filer — på GitHub eller lokalt

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
sin `*-content.js`-fil — nyttig for drift, feilsøk og bulk-endringer.

### 👥 Styret — `styret-content.js`

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
  bildefiler** (én og én, ingen zip) ved publisering — legg dem i `assets/styret/`.
  Tomt `img` = bare initialer.

### 🛍️ Merch — `merch-products.js`

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

### 📰 Begrep — `begrep-content.js`

`window.BEGREP_CONTENT` med seksjonene `meta`, `issues`, `podcasts`, `films`,
`christmas`. Bilder: `null` (plassholder), `"assets/begrep/fil.png"` eller base64 fra
admin. `meta` rommer bl.a. `email` og `orderFormUrl`.

### 🆘 Hjelp — `hjelp-content.js`

`window.HJELP_CONTENT` med seksjonene `hero`, `sifra`, `studier`, `helse`, `fysisk`,
`akutt`. Ressurskort (`*.cards[]`): `eyebrow`, `accent`, `name`, `desc`, `resp[]`,
`contacts[]`, `noteTop`, `note`, `btnLabel`, `btnHref`. Tom linje i `desc` = nytt avsnitt.
`contacts` og «Si fra»-tekst tillater HTML (lenker, `<strong>`).

### 📰 Nyheter — `news-content.js`

`window.NEWS_CONTENT = { items: [...] }`. Felt per nyhet (forklart øverst i fila):
`place` (`panel`/`arrangement`/`aporetisk`/`fadderuke`), `urgent`, `title`, `text`
(støtter `**fet**`, `*kursiv*`, `_understrek_`, `[tekst](url)`, linjeskift), `date`,
`link`, `linkLabel`, `done` (arkivert). Nyheter lastes umiddelbart fra repoet — det gamle
Google Sheet-systemet er borte.

> **Neste arrangement** i «Akkurat nå»-kortet hentes automatisk fra
> arrangementskalenderen — det legges ikke inn som nyhet.

### 🏛️ Forsiden / 📖 Om oss

Forsidens tekster (toppbilde, om-seksjon, FAQ, kontakt) ligger i `index-content.js`;
Om oss-siden i `om-content.js`. Begge redigeres i Admin-senteret med live preview.

---

## Pensum

Pensum har **ingen admin-modul** ennå — `pensum.html` redigeres direkte. Hver emneblokk
er en `<div class="course-block">` med tittel, emnekode og pensumliste.

> Ambisjon: koble mot en NTNU-API slik at pensum oppdateres automatisk. Inntil da er
> dette en drifter-oppgave.

---

## Lesesalen — bilder

Bildene på forsiden ligger i `assets/lesesalen/` med mønsteret `lesesal1.jpg`,
`lesesal2.jpg`, … Siden oppdager hele sekvensen automatisk.

- `lesesal1.jpg` = stort hovedbilde; `lesesal2.jpg`+ = den rullende stripa under
- **Legg til/bytt:** gi bildet `lesesalX.jpg` (neste ledige nummer), legg i mappa, push
- **Fjern:** slett fila — men unngå hull i nummereringen (fjernes `lesesal3.jpg` slutter
  alt fra `lesesal4.jpg` å vises). Rename så sekvensen er sammenhengende.
- **Bytt hovedbilde:** gi ønsket bilde navnet `lesesal1.jpg`
- **Format:** `.jpg`/`.jpeg`, helst under 1–2 MB per fil

---

## Slik fungerer søket

Søket (forstørrelsesglasset, eller **Ctrl/Cmd + K**) leter gjennom en **søkeindeks**.
Den regenereres automatisk når du publiserer fra Admin-senteret.

| Fil | Hva den er | Redigeres |
| --- | --- | --- |
| `site-search.js` | Selve søkefunksjonen (overlay, tastatur, scoring) | Sjelden — kun ved endret *oppførsel* |
| `search-index.js` | **Auto-generert** liste over alle treff. Lastes på alle sider | **Aldri for hånd** — genereres ved «Publiser» |
| `search-base.js` | Statiske treff som *ikke* kommer fra en admin-modul (sider, seksjoner, emner) | For hånd, ved behov |

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

> ⚠️ **Rediger aldri `search-index.js` direkte** — den overskrives ved neste publisering.

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

Endepunktet er offentlig (skriv-bare — ingen kan lese ut data). To lag:

1. **Delt token:** samme tilfeldige streng i `MERCH_ORDER_TOKEN` og `ORDER_TOKEN` (Apps
   Script). Innsendinger uten riktig token avvises.
2. **Honeypot:** et skjult felt som bots fyller ut, men ikke mennesker.

> Dette er et **bot-filter, ikke ekte sikkerhet** — token-en ligger i klient-koden. Men
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
// ── Apeiron — mottak av merch-bestillinger ──
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
| `index.html` | Forsiden «Hjem» — toppbilde, om, FAQ, kontakt (tekst fra `index-content.js`) |
| `om-oss.html` | «Om oss»-siden (fra `om-content.js`) |
| `nyheter.html` | Nyhetsside med arkiv |
| `oppslagstavla.html` | Oppslagstavla — plakater (fra `oppslag-content.js`) |
| `pensum.html` | Pensum-oversikt (redigeres direkte) |
| `styret.html` | Styret og styreverv (fra `styret-content.js`) |
| `styret-arkiv.html` | Arkiv over tidligere styrer (fra `archive[]` i `styret-content.js`) |
| `begrep.html` | Begrep-tidsskriftet (fra `begrep-content.js`) |
| `merch.html` | Merch-butikk (fra `merch-products.js`) |
| `marked.html` | Kjøp & bytte (pensum-marked) |
| `galleri.html` | Bildegalleri (henter automatisk fra Google Drive) |
| `hjelp.html` | Hjelp & ressurser (fra `hjelp-content.js`) |
| `oppnaelser.html` | Oppnåelser / milepæler (fra `oppnaelser-content.js`) |
| `utmerkelser.html` | Utmerkelser / priser (fra `utmerkelser-content.js`) |
| `admin.html` | **Admin-senter** — én inngang for all redigering; mounter modulene |

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
| `site-search.js` | Søkefunksjon (overlay + scoring) |
| `search-base.js` | Statiske søketreff — input til indeksen |
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
| `VEDLIKEHOLD.md` | Denne fila — teknisk drift og dokumentasjon |
| `CHANGELOG.md` | Logg over hva som er gjort |
| `docs/admin-arkitektur.md` | Skall+modul-arkitekturen for Admin-senteret |
| `docs/apps-script-oppsett.md` | Google Sheet + Apps Script-guide (merch-bestilling) |
| `.gitignore` | Hva git hopper over (bl.a. `api-config.js`, `Plan F.html`) |
| `.github/dependabot.yml` | Ukentlig sjekk av GitHub Actions-avhengigheter |
| `_headers` | Cloudflare Pages — HTTP-sikkerhetsheadere (trygg basis, uten CSP) |

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

## Sikkerhet og konfigurasjon

- **`api-config.js`** er en gitignorert lokal stub for Google-API-nøkkelen. I produksjon
  injiseres nøkkelen av Cloudflare — **commit aldri** en ekte nøkkel.
- **Bot-filter-token** (`MERCH_ORDER_TOKEN`) er et drive-by-spam-filter, ikke
  ekte sikkerhet. Hold ekte `SHEET_ID` / `/exec`-URL utenfor offentlige filer.
- **`_headers`** gir HTTP-sikkerhetsheadere via Cloudflare Pages (trygg basis, uten CSP).
- Galleri bruker en Google-API-nøkkel via `window.GOOGLE_API_KEY`; Drive-mappa må deles
  «Alle med lenken kan se».

---

## Første gangs oppsett (Cloudflare)

Hvis repoet ikke er koblet til Cloudflare Pages, eller man vil bytte Cloudflare-bruker:

1. Last opp filene til et GitHub-repo
2. [dash.cloudflare.com](https://dash.cloudflare.com) → «Workers & Pages» → «Create» →
   «Pages» → «Connect to Git» → velg repoet
3. «Framework preset» = «None», «Build command» tom, «Build output directory» = `/`
4. «Save and Deploy» — fra nå skjer alt automatisk
