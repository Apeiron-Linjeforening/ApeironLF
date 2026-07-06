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
12. [Vedlikehold av dokumentasjonen](#vedlikehold-av-dokumentasjonen)
13. [Første gangs oppsett (Cloudflare)](#første-gangs-oppsett-cloudflare)

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
[docs/github-publisering-oppsett.md](docs/github-publisering-oppsett.md).

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

### Caching: når blir en endring synlig for besøkende? (kort: automatisk, ved neste sidelast)

**Du trenger ikke gjøre noe for at endringer skal vises.** Cloudflare Pages serverer
*hver* fil — både innhold (`*-content.js`) og kode (`css/styles.css`, `css/admin-modules.css`
osv.) — med denne HTTP-headeren:

```
cache-control: public, max-age=0, must-revalidate
etag: "<fingeravtrykk av filinnholdet>"
```

`max-age=0, must-revalidate` betyr at nettleseren *alltid* må spørre serveren «har denne
fila endret seg?» før den bruker en lagret kopi. `etag`-en er filens fingeravtrykk:
serveren svarer enten **`304 Not Modified`** (bittelite svar uten selve fila → bruk
kopien, raskt) eller **`200`** med den nye fila. Resultatet: en publisert endring vises
for besøkende ved **neste sidelast**, uten forsinkelse fra gammel cache. Det finnes
heller **ingen service worker** som kunne overstyrt dette og holdt på gamle filer.

**`?v=…`-stemplene på kodefilene** (f.eks. `css/admin-modules.css?v=20260705a` i `admin.html`)
er derfor et «bånd og bukseseler»-tiltak, ikke en nødvendighet på dette oppsettet — de
tvinger en garantert hard oppfriskning, men Cloudflares revalidering ordner ferskhet
uansett. Endrer du en kodefil, kan du gjerne bumpe stempelet til ny verdi (dato +
løpende bokstav, f.eks. `20260705a` → `20260705b`), men glemmer du det, når endringen
likevel frem. Verdien betyr ingenting teknisk; det eneste som teller er at den er
**annerledes enn forrige gang**.

> Avveiningen Cloudflare har valgt er **alltid fersk** framfor **maksimalt raskt**: hver
> fil koster én liten «har dette endret seg?»-forespørsel per sidelast (tomt `304`-svar
> når intet er endret). For en side av denne størrelsen er det riktig prioritering, og
> derfor er det ikke satt opp — eller nødvendig med — noe automatisk cache-busting eller
> byggesteg. *(Sjekket mot live `apeironlf.pages.dev` 05.07.26.)*

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
oppdaterte datafila (f.eks. `content/merch-products.js`). Legg den nedlastede fila over den
tilsvarende fila i din lokale klone og oppdater nettleseren.

> Tidligere fantes en «skriv rett til repo-fila»-funksjon (File System Access), men den
> ble fjernet fordi den feilet på enkelte systemer. Admin laster nå **alltid** ned fila.

---

## Admin-arkitektur

`admin.html` er et **skall** som mounter editor-moduler inline. Panelene ligger i
`js/admin/modules/<id>.js` (én fil per editor — se lista i [Filstruktur](#filstruktur)) og
deler fundament gjennom `js/admin/admin-common.js` (datalager `createStore`, drag-sortering,
hjelpebobler, nedlasting, panel-registeret `AdminPanels`). Per-modul-CSS ligger
klasse-scopet i `css/admin-modules.css`. Visningen «Liste + detalj» (Oversikt →
«Panelvisning») deles av alle panelene via `js/admin/admin-panel-shell.js` (PanelShell).

Full beskrivelse: [`docs/admin-arkitektur.md`](docs/admin-arkitektur.md).

Hver modul med søkbart innhold har en `searchEntries()`-funksjon som mater søkeindeksen
(se [Slik fungerer søket](#slik-fungerer-søket)).

---

## Manuell redigering av innholdsfilene

Alt dette gjøres normalt i Admin-senteret. Men hver del kan også redigeres for hånd i
sin `*-content.js`-fil, nyttig for drift, feilsøk og bulk-endringer.

### 👥 Styret: `content/styret-content.js`

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

### 🛍️ Merch: `content/merch-products.js`

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

### 📰 Begrep: `content/begrep-content.js`

`window.BEGREP_CONTENT` med seksjonene `meta`, `issues`, `podcasts`, `films`,
`christmas`. Bilder: `null` (plassholder), `"assets/begrep/fil.png"` eller base64 fra
admin. `meta` rommer bl.a. `email` og `orderFormUrl`.

### 🆘 Hjelp: `content/hjelp-content.js`

`window.HJELP_CONTENT` med seksjonene `hero`, `sifra`, `studier`, `helse`, `fysisk`,
`akutt`. Ressurskort (`*.cards[]`): `eyebrow`, `accent`, `name`, `desc`, `resp[]`,
`contacts[]`, `noteTop`, `note`, `btnLabel`, `btnHref`. Tom linje i `desc` = nytt avsnitt.
`contacts` og «Si fra»-tekst tillater HTML (lenker, `<strong>`).

### 📰 Nyheter: `content/news-content.js`

`window.NEWS_CONTENT = { items: [...] }`. Felt per nyhet (forklart øverst i fila):
`place` (`panel`/`arrangement`/`aporetisk`/`fadderuke`), `urgent`, `title`, `text`
(støtter `**fet**`, `*kursiv*`, `_understrek_`, `[tekst](url)`, linjeskift), `date`,
`link`, `linkLabel`, `done` (arkivert). Nyheter lastes umiddelbart fra repoet. Det gamle
Google Sheet-systemet er borte.

> **Neste arrangement** i «Akkurat nå»-kortet hentes automatisk fra
> arrangementskalenderne (aktivitet/aporetisk/fadder), og legges ikke inn som nyhet.
> Kortet kan vise de neste **1–3** arrangementene — antallet velges i
> **Admin → Forsiden → Hero** og lagres som `newsPanel.maxEvents` i `content/index-content.js`.
> `js/apeiron-news.js` slår sammen kildene, sorterer på tid og deduperer samme hendelse
> som står i flere kalendere.

### 🏛️ Forsiden

Forsidens tekster (toppbilde, om-seksjon, FAQ, kontakt) ligger i `content/index-content.js` og
redigeres i Admin → Forsiden med live preview. Samme fil har `newsPanel.maxEvents`
(1–3) som styrer hvor mange kommende arrangement «Akkurat nå»-kortet lister.

### 📖 Om oss (Page Builder)

Om oss-siden er **datadrevet via en seksjonsmotor**, ikke én fast HTML-mal. Tre filer:

- `content/om.page.js` (`window.OM_PAGE`) — en ordnet liste av typede seksjoner
  `{ id, type, tone, enabled?, props }`. Dette er innholdet, redigert i Admin → Om oss.
- `js/om-sections.js` — registrerer seksjons**typene** (`banner`, `about`, `cardgrid`,
  `lesesal`, `join`, `faq`); hver eier sin `defaults`/`render`/`mount` ett sted.
- `js/section-engine.js` — motoren som tegner lista og setter `data-tone` per seksjon.

**Tone-rytme:** hver seksjon har en `tone` (`auto`/`paper`/`navy`/`accent`). Motoren
regner ut faktisk tone og setter `data-tone` på seksjonen; `css/styles.css` maler
`data-tone="navy"` som et mørkt bånd (token-re-pinning). `auto` veksler lys/mørk så to
like ikke havner ved siden av hverandre. Velg fast tone i admin for å bestemme selv;
rytme-vakten i admin varsler kun når to naboer faktisk får **samme synlige flate**.

**Minimeny i banneret («På denne siden»):** banner-seksjonen har en `toc`-prop (av/på-
bryter i Admin → Om oss, banner-panelet). Er den på, bygges en innholdsmeny automatisk
fra seksjonenes `data-screen-label` — legg til, skjul eller flytt en seksjon, og menyen
følger med uten videre redigering. Glasspanel på desktop (posisjon måles av JS for lik
luft på hver side), chips under ingressen på mobil.

**Avatar-rader i kort:** `cardgrid`-kort tar valgfrie `images` (liste av bildestier) og
`imagesMore` (tekst-boble, f.eks. «+7» eller «Deg?»), redigerbare per kort i admin.

> Bildene til «Møt styret»-kortene gjenbruker styreportrettene i
> `assets/Styremedlemmer/`. Lesesal-galleriet: se [Lesesalen: bilder](#lesesalen-bilder).

**Galleribilder på forsiden.** Admin → Forsiden har et eget panel som kan vise
bilder fra galleriet på forsiden, **av som standard**. Innstillingene ligger i
`heroGallery` i `content/index-content.js`; `js/apeiron-hero-gallery.js` (+ `css/hero-gallery.css`)
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
ligger i `content/pensum-content.js` (`window.PENSUM_CONTENT`) og gjengis av `js/apeiron-pensum.js`;
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
| `js/site-search.js` | Selve søkefunksjonen (overlay, tastatur, MiniSearch-motor) | Sjelden, kun ved endret *oppførsel* |
| `js/vendor/minisearch.min.js` | Søkemotor-biblioteket (MiniSearch v7, vendet inn, ingen CDN). Lastes **før** `js/site-search.js` | Aldri, bytt kun ved versjonsoppgradering |
| `js/search-index.js` | **Auto-generert** liste over alle treff. Lastes på alle sider | **Aldri for hånd**, genereres ved «Publiser» |
| `js/search-base.js` | Statiske treff som *ikke* kommer fra en admin-modul (sider, seksjoner, emner) | For hånd, ved behov |

**Motoren:** søket bruker **MiniSearch** med en norsk stemmer (bøyning: «studieretninger»
finner «studieretning») og fuzzy-treff (skrivefeil: «filosfi» finner «filosofi»). Faller
automatisk tilbake til enkel delstreng-scoring hvis biblioteket ikke skulle laste. Indeksen
bygges i nettleseren fra `js/search-index.js` ved hver sidelast, så nytt publisert innhold er
automatisk søkbart. Uregelmessige ord stemmeren bommer på legges i `SYN`-lista øverst i
`js/site-search.js`.

> Nye sider må laste `js/vendor/minisearch.min.js` **før** `js/site-search.js` (rett etter `js/search-index.js`).

- **Dynamiske treff** kommer fra modulenes `searchEntries()` (styremedlemmer,
  merch-produkter, Begrep-podkast, oppnåelser, utmerkelser, nyheter).
- **Statiske treff** (Forsiden/Om oss/Galleri, seksjoner, pensum-emner) ligger i
  `js/search-base.js`.

**Oppdatering (automatisk):** ved «↓ Last ned» / «Last ned alle endrede» lastes
`js/search-index.js` ned i tillegg **hvis** søkeinnholdet har endret seg. Legg den ved
committen.

**Rediger `js/search-base.js` for hånd** kun ved nytt som ikke finnes i en admin-modul (ny
side, ny seksjon, nytt emne):

```js
{ t: 'Tittel som vises', d: 'Kort beskrivelse (søkbar).', u: 'side.html#anker', g: 'Pensum' }
```

`g` må være en kjent gruppe: `Startside`, `Nyheter`, `Om oss`, `Styret`, `Heder`,
`Pensum`, `Merch`, `Begrep`, `Galleri`. (Ny gruppe må også legges i `ICONS` og
`GROUP_ORDER` øverst i `js/site-search.js`.)

> ⚠️ **Rediger aldri `js/search-index.js` direkte**. Den overskrives ved neste publisering.

### Oppdatere søkemotoren (MiniSearch): kun ved behov

`js/vendor/minisearch.min.js` er **frosset** på én versjon (MiniSearch v7) og oppdateres aldri av
seg selv. Du trenger **ikke** vedlikeholde den. Biblioteket kjører i nettleseren på våre
egne statiske data, så det er ingen sikkerhetsgrunn til å oppgradere. Gjør det **bare** hvis
en nyere versjon gir noe dere faktisk vil ha, eller for å rette en konkret feil.

Slik oppdaterer du (engangsjobb: «bytt ut den ene fila og test»):

1. **Hent det nye UMD-bygget.** Last ned fra et CDN og bytt versjonsnummeret til det nyeste:
   `https://cdn.jsdelivr.net/npm/minisearch@7.1.0/dist/umd/index.min.js`
   (fila som starter med `!function(t,e)…` og definerer `window.MiniSearch`).
2. **Lagre den over `js/vendor/minisearch.min.js`**, *samme filnavn*. Da slipper du å røre
   sidene; alle peker allerede på det navnet.
3. **Test søket:** åpne en side, trykk **⌘/Ctrl + K**, og søk på noe med bøyning
   («studieretninger» skal finne «studieretning») og en skrivefeil («filosfi» skal finne
   «filosofi»). Virker det som før, er du i mål.
4. **Commit/push** den ene fila.

> ⚠️ **Hovedversjon-hopp (f.eks. v7 → v8)** kan endre hvordan biblioteket kalles.
> `js/site-search.js` bruker tre ting: `new MiniSearch({…})`, `.addAll(…)` og
> `.search(q, { prefix, fuzzy, boost, combineWith })`. Endrer en storversjon noen av disse,
> må `js/site-search.js` justeres tilsvarende. Innenfor samme storversjon (v7.x) er det et rent
> drop-in-bytte. Er du i tvil, la utvikleren ta hovedversjon-hopp så API-et sjekkes samtidig.

---

## Merch-bestilling: Google Sheet + Apps Script

Nettsiden er statisk og har ingen egen server. Merch-bestillinger håndteres med Googles
gratisverktøy:

- **Handlekurven** på `merch.html` (`js/merch-cart.js`) sender bestillingen som JSON.
- Et **Google Apps Script** (web-app) skriver den til et **Google Sheet** og sender
  **e-postvarsel** til styret.
- `js/merch-config.js` peker på web-app-adressen + Vipps-info + bot-filter-token.

```
Handlekurv (merch.html) ──POST JSON──▶ Apps Script (/exec) ──▶ Google Sheet + e-post
```

Er web-app-adressen ikke satt, faller siden tilbake til en ferdigutfylt
**e-post-bestilling**, så «Send bestilling» aldri blir død.

### Innstillinger i `js/merch-config.js`

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

Full guide — **inkludert selve Apps Script-koden og kolonneoverskriftene** — ligger
ett sted: [`docs/apps-script-oppsett.md`](docs/apps-script-oppsett.md). (Koden
gjengis ikke her, så den ikke drifter fra guiden.) Kort:

1. Google Sheet med kolonneoverskriftene fra guiden
2. **Utvidelser → Apps Script**, lim inn koden fra guiden (bytt plassholdere), lagre
3. **Distribuer → Web-app**: «Kjør som: Meg», «Tilgang: Alle». Godkjenn
4. Kopier `…/exec`-URL inn i `MERCH_ORDER_ENDPOINT`
5. Senere endringer: **Distribuer → Administrer distribusjoner → Ny versjon** (samme URL)

---

## Filstruktur

Repoet er organisert i mapper etter rolle. **Viktig:** filene i `content/` er
de Admin-senteret publiserer til GitHub — stien står hardkodet i tilhørende
admin-modul (`exportName`/`saveFile`). Flyttes eller omdøpes en innholdsfil, må
stien endres i modulen samtidig, ellers publiserer admin til feil sti. HTML-sidene
ligger på rot med vilje (URL-ene til de publiserte sidene skal ikke endres), og
`api-config.js` må ligge på rot (sperrelista i `functions/api/github/commit.js`
blokkerer den ved eksakt rotsti, og Cloudflare injiserer nøkkelen der).

```
ApeironLF/
├── *.html              Sidene (URL-ene er uendret)
├── api-config.js       Gitignorert stub; Cloudflare injiserer nøkkelen i prod
├── content/            Innholdsfiler som publiseres via Admin-senteret
├── css/                All CSS (styles.css, admin-*.css, hero-gallery.css)
├── js/                 Renderere og funksjonalitet for de offentlige sidene
│   ├── vendor/         Tredjepartsbibliotek (minisearch.min.js)
│   └── admin/          Admin-senterets kode
│       └── modules/    Én editor-modul per område
├── assets/             Bilder
├── docs/               Teknisk dokumentasjon og oppsettsguider
└── functions/          Cloudflare Pages Functions (GitHub-publisering, server-side)
```

**Sider (HTML)**

| Fil | Hva det er |
| --- | --- |
| `index.html` | Forsiden «Hjem»: toppbilde, om, FAQ, kontakt (tekst fra `content/index-content.js`) |
| `om-oss.html` | «Om oss»-siden (skall; tegnes av Page Builder fra `content/om.page.js`) |
| `nyheter.html` | Nyhetsside med arkiv |
| `oppslagstavla.html` | Oppslagstavla: plakater (fra `content/oppslag-content.js`) |
| `pensum.html` | Pensum-oversikt (fra `content/pensum-content.js`) |
| `styret.html` | Styret og styreverv (fra `content/styret-content.js`) |
| `styret-arkiv.html` | Arkiv over tidligere styrer (fra `archive[]` i `content/styret-content.js`) |
| `begrep.html` | Begrep-tidsskriftet (fra `content/begrep-content.js`) |
| `merch.html` | Merch-butikk (fra `content/merch-products.js`) |
| `marked.html` | Kjøp & bytte (pensum-marked) |
| `galleri.html` | Bildegalleri (henter automatisk fra Google Drive) |
| `hjelp.html` | Hjelp & ressurser (fra `content/hjelp-content.js`) |
| `oppnaelser.html` | Oppnåelser / milepæler (fra `content/oppnaelser-content.js`) |
| `utmerkelser.html` | Utmerkelser / priser (fra `content/utmerkelser-content.js`) |
| `admin.html` | **Admin-senter**: én inngang for all redigering; mounter modulene |

**Innholds- og innstillingsfiler (redigeres via Admin-senteret)**

| Fil | Hva det er |
| --- | --- |
| `content/index-content.js` | Forsidens tekster (Admin → Forsiden) |
| `content/om.page.js` | Om oss-innhold som typede seksjoner (Admin → Om oss, Page Builder) |
| `content/news-content.js` | Nyheter/beskjeder (Admin → Nyheter) |
| `content/oppslag-content.js` | Oppslagstavla-plakater (Admin → Oppslagstavla) |
| `content/styret-content.js` | Styremedlemmer og verv (Admin → Styret) |
| `content/begrep-content.js` | Begrep-siden (Admin → Begrep) |
| `content/hjelp-content.js` | Hjelp-siden (Admin → Hjelp) |
| `content/oppnaelser-content.js` | Oppnåelser (Admin → Oppnåelser) |
| `content/utmerkelser-content.js` | Utmerkelser (Admin → Utmerkelser) |
| `content/merch-products.js` | Merch-produkter (Admin → Merch) |
| `content/membership-config.js` | Medlemskap: priser/Vipps/steg (Admin → Medlemskap) |
| `content/nav-content.js` | Lenkene i hovedmenyen (Admin → Meny). Undermeny-barn er `{label, href}`, eller `{label, heading:true}` = ikke-klikkbar gruppeoverskrift |
| `content/site-content.js` | Footer-lenker og sosiale ikoner (Admin → Footer) |
| `js/merch-config.js` | Merch-bestilling: Apps Script-URL, Vipps, token |
| `api-config.js` | Lokal stub for Google-API-nøkkel (gitignorert; settes i prod av Cloudflare) |

**Renderere og funksjonalitet (røres normalt ikke)**

| Fil | Hva det er |
| --- | --- |
| `js/site-chrome.js` | Bygger meny + footer på alle sider |
| `js/apeiron-index.js` | Rendrer forsiden fra `content/index-content.js` |
| `js/apeiron-hero-gallery.js` | Galleribilder på forsiden (stil A/B/C/D + DVD), live fra Drive. Styres av `heroGallery` i `content/index-content.js`; krever `css/hero-gallery.css`. Av som standard |
| `js/section-engine.js` | Page Builder-motor: tegner en seksjonsliste, setter `data-tone` (Om oss) |
| `js/om-sections.js` | Seksjonstypene for Om oss (banner, about, cardgrid, lesesal, join, faq) |
| `content/om.page.js` | Om oss som data (seksjonsliste); redigeres i Admin → Om oss |
| `js/apeiron-news.js` | «Akkurat nå»-kort + beskjeder (leser `content/news-content.js`) |
| `js/apeiron-events.js` | Henter arrangementer fra Google Kalender |
| `js/apeiron-fadder.js` | Henter fadderuke-program fra Google Kalender |
| `js/aporetisk-cal.js` | Kalender for Aporetisk Aften |
| `js/membership.js` | Fyller «Bli medlem»-kortet fra `content/membership-config.js` |
| `js/merch-cart.js` | Handlekurv + bestilling på merch-siden |
| `js/report.js` | «Rapporter en feil»-boksen (alle sider) |
| `js/app.js` | Forside-interaksjoner: FAQ, scroll-reveal, statistikk-teller |
| `js/theme.js` | Lys/mørk-modus: setter `data-mode` før første paint |
| `js/palette.js` | Felles fargesystem (lys/mørk per navngitt farge) |
| `js/footer-icons.js` | Delt ikonsett for footeren |
| `js/image-slot.js` | Gjenbrukbar bildekomponent (`<image-slot>`) |
| `js/site-search.js` | Søkefunksjon (overlay + MiniSearch-motor) |
| `js/vendor/minisearch.min.js` | Søkemotor-bibliotek (MiniSearch v7, vendet inn) |
| `js/search-base.js` | Statiske søketreff: input til indeksen |
| `js/search-index.js` | Auto-generert søkeindeks (rediger aldri for hånd) |
| `css/styles.css` | All styling for de offentlige sidene. Rommer den **felles** `.subhero`-toppbanner-stilen (per-side avvik ligger inline i den enkelte HTML-en) |

**Admin (Admin-senteret)**

| Fil | Hva det er |
| --- | --- |
| `js/admin/admin-common.js` | Delt admin-logikk: `createStore`, drag-sortering, hjelpebobler, nedlasting, `AdminPanels` |
| `js/admin/admin-panel-shell.js` | PanelShell: «Liste + detalj»-visningen (søkbar navigator + ett skjema om gangen), delt av alle panelene |
| `js/admin/admin-image-editor.js` | Gjenbrukbart bilderedigeringsvindu (flytt/zoom/roter/speilvend/lys/kontrast) |
| `js/admin/admin-github.js` | Klient-siden av GitHub-publiseringen (snakker med `functions/api/github/`) |
| `content/admin-shortcuts.js` | Egendefinerte snarveier i Admin-senteret (publiseres via `js/admin/modules/shortcuts.js`) |
| `css/admin-common.css` | Delt stil for admin-skallet |
| `css/admin-modules.css` | Per-modul admin-stil (klasse-scopet, f.eks. `.mod-merch`) |
| `js/admin/modules/` | Én fil per editor: nyheter, oppslag, forsiden, om-oss, styret, merch, begrep, medlemskap, hjelp, meny, footer, oppnaelser, utmerkelser, pensum, galleri, marked — pluss `shortcuts` (usynlig, kun publisering av snarveier) |

**Dokumentasjon og oppsett**

| Fil | Hva det er |
| --- | --- |
| `README.md` | Oversikt + brukerveiledning (endre innhold via Admin-senteret) |
| `VEDLIKEHOLD.md` | Denne fila: teknisk drift og dokumentasjon |
| `TODO.md` | To-do-lista og domene-status |
| `CHANGELOG.md` | Logg over hva som er gjort (siste periode) |
| `docs/changelog-arkiv/` | Arkiverte changelog-perioder (eldre oppføringer flyttes hit, én fil per periode) |
| `docs/admin-arkitektur.md` | Skall+modul-arkitekturen for Admin-senteret + veikart mot klonbar mal |
| `docs/apps-script-oppsett.md` | Google Sheet + Apps Script-guide (merch-bestilling) — **eneste** sted Apps Script-koden vedlikeholdes |
| `docs/github-publisering-oppsett.md` | Engangsoppsett av «Publiser til GitHub» (OAuth-app + Cloudflare-miljøvariabler) |
| `docs/eierskap-og-overlevering.template.md` | Tom mal: hvem eier hva + sjekkliste ved styreskifte (utfylt kopi holdes privat, gitignorert) |
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
| `sitemap.xml` | rot | Liste over alle offentlige sider med `lastmod`/`priority` |
| JSON-LD (`Organization`) | `index.html` `<head>` | Forteller hvem Apeiron er (NTNU, Dragvoll, 1981, sosiale lenker) |
| JSON-LD (`AboutPage`) | `om-oss.html` `<head>` | Fyldig, ærlig beskrivelse av foreningen + `knowsAbout` (fagområder) |
| `<link rel="canonical">` | alle offentlige sider | Offisiell adresse per side — hindrer duplikat-telling |
| `og:*` + `twitter:*` | alle offentlige sider | Pene delingskort på Facebook/LinkedIn/X |
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

> 👉 **Hvem eier hva, og hvordan overleveres det til neste styre?** Se
> [docs/eierskap-og-overlevering.template.md](docs/eierskap-og-overlevering.template.md) — en ikke-teknisk
> oversikt over kontoer (domene, Cloudflare, GitHub, Google), hvor innlogginger ligger,
> løpende vedlikehold og en sjekkliste for styreskifte. Malen er tom med vilje: styret
> bruker den **utfylte, private kopien** (`docs/eierskap-og-overlevering.md`, gitignorert
> — skal også ligge i foreningens Drive/passordmanager).

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
- **Live-forhåndsvisning (postMessage) verifiserer avsender.** Admin laster de offentlige
  sidene i en iframe (`?preview=1`) og utveksler `postMessage` begge veier (innhold inn,
  høyde/«ready» tilbake). Hver `message`-lytter starter derfor med
  `if (e.origin !== window.location.origin) return;` — admin og sidene deler origin, så
  forhåndsvisningen virker som normalt, men en fremmed innbygging kan ikke sende falske
  meldinger inn. **Legger du til en ny forhåndsvisning eller `message`-handler, ta med
  samme origin-sjekk som første linje** — ellers flagger CodeQL den («Missing origin
  verification in postMessage handler»).
- **Automatisk skanning:** CodeQL (`.github/workflows/codeql.yml`, `security-extended`),
  Dependabot og Dependency Review kjører på GitHub. Anbefalt i tillegg: 2FA på alle
  GitHub-kontoer i `ALLOWED_LOGINS` + Cloudflare, og en ruleset på `main` som blokkerer
  force-push og sletting.
- Galleri bruker en Google-API-nøkkel via `window.GOOGLE_API_KEY`; Drive-mappa må deles
  «Alle med lenken kan se».

---

## Vedlikehold av dokumentasjonen

Dokumentasjonen har historisk hatt lett for å drifte fra koden (paneltall, dupliserte
kodesnutter, utdaterte begrensninger). Tre regler holder den frisk:

1. **Én kilde per faktum.** Tall, lister og kode skal stå **ett** sted; alle andre
   steder lenker dit. Eksempler: modul-lista bor i [Filstruktur](#filstruktur),
   Apps Script-koden bor kun i [docs/apps-script-oppsett.md](docs/apps-script-oppsett.md).
   Unngå å hardkode antall («13 paneler») i løpende tekst — skriv «alle panelene».
2. **Datostemple flyktige påstander.** Priser, statuser og «sjekket mot live»-utsagn
   merkes med *«sjekket DD.MM.ÅÅ»*, slik cache-avsnittet og domene-tabellen i
   [TODO.md](TODO.md) gjør. Da ser leseren selv når noe bør sjekkes på nytt.
3. **Les docs mot koden ved styreskifte.** Sjekklista i eierskaps-malen har et eget
   punkt for dette. En automatisk lenkesjekk
   (`.github/workflows/md-links.yml`) fanger dessuten brutte interne lenker og ankre i
   `.md`-filene ved hver push.

---

## Første gangs oppsett (Cloudflare)

Hvis repoet ikke er koblet til Cloudflare Pages, eller man vil bytte Cloudflare-bruker:

1. Last opp filene til et GitHub-repo
2. [dash.cloudflare.com](https://dash.cloudflare.com) → «Workers & Pages» → «Create» →
   «Pages» → «Connect to Git» → velg repoet
3. «Framework preset» = «None», «Build command» tom, «Build output directory» = `/`
4. «Save and Deploy». Fra nå skjer alt automatisk
