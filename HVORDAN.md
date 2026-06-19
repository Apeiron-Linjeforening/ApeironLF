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

**Se admin-endringen lokalt før du pusher:**

Admin-panelene laster alltid **ned** den oppdaterte datafila (f.eks. `merch-products.js`) til nedlastingsmappa. Vil du teste lokalt før du pusher: legg den nedlastede fila over den tilsvarende fila i din lokale klone av repoet og oppdater nettleseren. Da ser du endringen med en gang, og velger selv når du committer/pusher til GitHub.

> Tidligere fantes en «skriv rett til repo-fila»-funksjon (File System Access), men den ble fjernet fordi den feilet på enkelte systemer. Admin laster nå **alltid** ned fila.

---

## Hva kan du redigere, og hvor?

> **🛠️ Alt innhold redigeres ett sted: Admin-senteret.** Legg til `/admin.html`
> i nettadressen (https://apeironlf.pages.dev/admin.html) — eller kjør lokalt.
> Der finner du **alle** editorene (Nyheter, Oppslagstavla, Forsiden, Om oss,
> Styret, Merch, Begrep, Medlemskap, Hjelp, Meny, Footer, Oppnåelser,
> Utmerkelser) i én bla-bar meny, hver med **live
> forhåndsvisning** og en egen «↓ Last ned»-knapp. Ingen innlogging. De gamle
> frittstående `*-admin.html`-sidene er borte — alt er nå moduler i `admin.html`.
> (Arrangementer/Fadderuke styres fortsatt i Google Kalender, se under.)

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

#### Enklest: bruk Admin-senteret → Styret

Åpne **Admin-senteret** (`admin.html`) og velg **Styret** i menyen. Ingen innlogging. (Alt innhold redigeres nå ett sted — de gamle frittstående `styret-admin.html`-sidene finnes ikke lenger.)

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

#### Enklest: bruk Admin-senteret → Merch

Åpne **Admin-senteret** ved å legge til `/admin.html` på slutten av nettadressen (https://apeironlf.pages.dev/admin.html) og velg **Merch** i menyen. Ingen innlogging.

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
3. **Innebygd bilde via admin** — last opp i Admin-senteret → Merch, eksporter JS-filen; bildet er da lagret direkte i `merch-products.js` (ingen ekstern fil nødvendig)

### 📰 Begrep
Innholdet på Begrep-siden styres via `begrep-content.js` — **ikke** direkte i `begrep.html`.

#### Enklest: bruk Admin-senteret → Begrep

Åpne **Admin-senteret** (`admin.html`) og velg **Begrep** i menyen. Ingen innlogging. (Alt innhold redigeres nå ett sted — de gamle frittstående `begrep-admin.html`-sidene finnes ikke lenger.)

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

#### Enklest: bruk Admin-senteret → Hjelp

Åpne **Admin-senteret** (`admin.html`) og velg **Hjelp** i menyen. Ingen innlogging. (Alt innhold redigeres nå ett sted — de gamle frittstående `hjelp-admin.html`-sidene finnes ikke lenger.)

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

### 📰 Nyheter / kunngjøringer / beskjeder
Nyheter ligger nå i repoet (som styret, merch og oppslagstavla) og lastes
**umiddelbart** — det gamle, trege Google Sheet-systemet er borte. Redigeres
visuelt i **Admin-senteret → Nyheter** (`admin.html`), eller direkte i `news-content.js`.

#### Enklest: bruk Admin-senteret → Nyheter

Åpne **Admin-senteret** (`admin.html`) og velg **Nyheter** i menyen. Ingen
innlogging. Panelet viser nyhetene med **live forhåndsvisning** av forsiden
mens du skriver.

Per nyhet velger du:

- **Vises på:** `Forsiden` (Akkurat nå-kortet i toppbildet), `Arrangementer`,
  `Aporetisk Aften` eller `Fadderukene` (slank beskjed øverst i seksjonen).
- **⚑ Viktig:** tydelig vinrød hastemarkering. Av = rolig gull.
- **Tittel**, valgfri **tekst** (`**fet**`, `*kursiv*`, `_understrek_`,
  `[lenketekst](https://…)`, linjeskift), valgfri **dato** (fritekst) og **lenke**.
- **● Aktiv / ✓ Arkivert:** arkiver gamle nyheter i stedet for å slette dem —
  da flyttes de til arkivet nederst på `nyheter.html`.

Trykk **↓ Last ned news-content.js**, erstatt fila i GitHub og push. Siden
oppdateres innen et minutt.

> **Neste arrangement** i Akkurat nå-kortet hentes **automatisk** fra
> arrangementskalenderen — det legger du ikke inn som nyhet.

#### Lett mobilvei for hastebeskjeder (valgfri, live uten commit)

Skal en hastebeskjed ut **med en gang fra mobil** uten å committe kode, finnes en
egen liten side: **`hastebeskjed.html`** — én tekstboks, «Viktig»-bryter og
«Publiser nå». Dette krever at styret setter opp et lite Apps Script **én gang**
(samme prinsipp som merch-bestilling) og limer `…/exec`-URL-en inn i
`window.NEWS_ENDPOINT` i `news-config.js`. La den stå **tom** for å bruke bare
repo-nyhetene (standard). `NEWS_TOKEN` er et valgfritt bot-filter — samme streng
her og i skriptet.

<details>
<summary><b>Apps Script for hastebeskjed (klikk for å vise)</b></summary>

Lagrer ÉN aktiv hastebeskjed i skriptets egne egenskaper — ingen regneark nødvendig.
**Utvidelser → Apps Script** på et hvilket som helst Google-dokument, lim inn, og
**Distribuer → Web-app** («Kjør som: meg», «Tilgang: alle»). Kopier `…/exec`-URL-en.

```javascript
var NEWS_TOKEN = 'EN_HEMMELIG_TILFELDIG_STRENG'; // = window.NEWS_TOKEN i news-config.js
var PROP = 'apeiron_flash';

function doGet(e) {
  if (NEWS_TOKEN && (!e.parameter || e.parameter.token !== NEWS_TOKEN)) return out([]);
  var raw = PropertiesService.getScriptProperties().getProperty(PROP);
  return out(raw ? [JSON.parse(raw)] : []);
}
function doPost(e) {
  var d = {};
  try { d = JSON.parse(e.postData.contents); } catch (err) {}
  if (NEWS_TOKEN && d.token !== NEWS_TOKEN) return out({ ok: false });
  if (d.hp) return out({ ok: false });               // honeypot
  var props = PropertiesService.getScriptProperties();
  if (d.action === 'clear') { props.deleteProperty(PROP); return out({ ok: true }); }
  props.setProperty(PROP, JSON.stringify({
    place: d.place || 'panel', urgent: !!d.urgent, title: d.title || '',
    text: d.text || '', link: d.link || '', linkLabel: d.linkLabel || 'Les mer'
  }));
  return out({ ok: true });
}
function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
```

</details>

#### Manuelt: rediger `news-content.js` direkte

Filen inneholder `window.NEWS_CONTENT = { items: [...] }`. Feltene er forklart
øverst i fila (`place`, `urgent`, `title`, `text`, `date`, `link`, `linkLabel`, `done`).

### 🏛️ Forsiden og 📖 Om oss
Tekstene på forsiden (toppbildet, om-seksjon, FAQ og kontakt) redigeres i **Admin-senteret → Forsiden** (`index-content.js`). Innholdet på «Om oss»-siden redigeres i **Admin-senteret → Om oss** (`om-content.js`). Begge har live forhåndsvisning.

Pensum/studiene redigeres fortsatt direkte i `pensum.html` (se over).

---

## 🔍 Slik fungerer søket (og hvordan det holder seg oppdatert)

Søket (forstørrelsesglasset i menyen, eller **Ctrl/Cmd + K**) leter gjennom en
**søkeindeks** — en liste over alt som skal kunne finnes på nettstedet. Du
trenger **normalt ikke gjøre noe** for å holde den oppdatert: den regenereres
automatisk når du publiserer fra Admin-senteret.

**Tre filer er involvert:**

| Fil | Hva den er | Redigeres |
| --- | --- | --- |
| `site-search.js` | Selve søke-funksjonen (overlay, tastatur, scoring). | Sjelden — kun ved endring av *oppførsel*. |
| `search-index.js` | **Auto-generert** liste over alle søketreff. Lastes på alle sider. | **Aldri for hånd** — genereres ved «Publiser». |
| `search-base.js` | Statiske treff som *ikke* kommer fra en admin-modul: sider, seksjoner og emner/pensum. | For hånd, ved behov (se under). |

**Hvor treffene kommer fra:**

- **Dynamiske treff** lages automatisk fra innholdet ditt. Hver admin-modul som
  har søkbart innhold har en liten `searchEntries()`-funksjon som plukker ut
  treff fra dataene sine: **styremedlemmer**, **merch-produkter**, **Begrep-podkast**,
  **oppnåelser**, **utmerkelser** og **nyheter/kunngjøringer**. Endrer du noe i
  disse panelene, oppdateres søket automatisk.
- **Statiske treff** (sider som Forsiden/Om oss/Galleri, seksjoner, og
  emnene/pensum) ligger i `search-base.js`, fordi de ikke har en egen
  admin-modul å hente fra.

**Slik oppdateres indeksen (automatisk):**

1. Rediger innhold som vanlig i Admin-senteret.
2. Last ned — enten med panelets egen **«↓ Last ned»** eller med **«Last ned alle
   endrede»**. Uansett hvilken du bruker, lastes `search-index.js` ned i tillegg
   **hvis** søkeinnholdet faktisk har endret seg.
3. Erstatt fila(e) i GitHub og push — akkurat som de andre filene. Ferdig.

> 💡 Du merker dette bare ved at det av og til ligger en `search-index.js` blant
> filene du laster ned. Legg den ved committen, så er søket i synk.

**Når må du redigere `search-base.js` for hånd?**

Bare hvis du legger til/endrer noe som *ikke* finnes i en admin-modul — f.eks. en
**ny side**, en **ny seksjon**, eller et **nytt emne** i pensum. Da legger du til
en linje i lista i `search-base.js`:

```js
{ t: 'Tittel som vises', d: 'Kort beskrivelse (søkbar).', u: 'side.html#anker', g: 'Pensum' }
```

- `t` = tittel, `d` = beskrivelse, `u` = lenken treffet åpner, `g` = gruppe.
- `g` må være en av gruppene søket kjenner: `Startside`, `Nyheter`, `Om oss`,
  `Styret`, `Heder`, `Pensum`, `Merch`, `Begrep`, `Galleri`. (Skal du ha en helt
  ny gruppe, må den også legges til i `ICONS` og `GROUP_ORDER` øverst i
  `site-search.js`.)

Neste gang du publiserer, fletter admin inn den nye statiske linja sammen med de
dynamiske treffene.

> ⚠️ **Rediger aldri `search-index.js` direkte** — den blir overskrevet ved neste
> publisering. Statiske treff hører hjemme i `search-base.js`; alt annet kommer
> fra admin-modulene.

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

**Sider (HTML)**

| Fil | Hva det er |
| --- | --- |
| `index.html` | Forsiden «Hjem» — toppbilde, om, FAQ, kontakt (tekst fra `index-content.js`) |
| `om-oss.html` | «Om oss»-siden — hva er Apeiron, fellesskap, lesesalen, FAQ, bli medlem (fra `om-content.js`) |
| `nyheter.html` | Nyhetsside med arkiv over tidligere oppslag |
| `oppslagstavla.html` | Oppslagstavla — plakater (fra `oppslag-content.js`) |
| `pensum.html` | Pensum-oversikt |
| `styret.html` | Styret og beskrivelse av alle styreverv (fra `styret-content.js`) |
| `begrep.html` | Begrep-tidsskriftet — utgaver, podkast, film, julekalender (fra `begrep-content.js`) |
| `merch.html` | Merch-butikk (produkter fra `merch-products.js`) |
| `marked.html` | Kjøp & bytte (pensum-marked) |
| `galleri.html` | Bildegalleri (henter automatisk fra Google Drive) |
| `hjelp.html` | Hjelp & ressurser (fra `hjelp-content.js`) |
| `oppnaelser.html` | Oppnåelser / milepæler (fra `oppnaelser-content.js`) |
| `utmerkelser.html` | Utmerkelser / priser (fra `utmerkelser-content.js`) |
| `hastebeskjed.html` | Lett mobilside for å legge ut én hastebeskjed live (valgfri Apps Script) |
| `admin.html` | **Admin-senter** — én inngang for ALL redigering; mounter editor-modulene |

**Innholds- og innstillingsfiler (redigeres via Admin-senteret)**

| Fil | Hva det er |
| --- | --- |
| `index-content.js` | Forsidens tekster (Admin → Forsiden) |
| `om-content.js` | Om oss-innhold (Admin → Om oss) |
| `news-content.js` | Nyheter/kunngjøringer/beskjeder (Admin → Nyheter) |
| `oppslag-content.js` | Oppslagstavla-plakater (Admin → Oppslagstavla) |
| `styret-content.js` | Styremedlemmer og verv (Admin → Styret) |
| `begrep-content.js` | Begrep-siden (Admin → Begrep) |
| `hjelp-content.js` | Hjelp-siden (Admin → Hjelp) |
| `oppnaelser-content.js` | Oppnåelser (Admin → Oppnåelser) |
| `utmerkelser-content.js` | Utmerkelser (Admin → Utmerkelser) |
| `merch-products.js` | Merch-produkter (Admin → Merch) |
| `membership-config.js` | Medlemskap: priser/Vipps/steg (Admin → Medlemskap) |
| `nav-content.js` | Lenkene i hovedmenyen (Admin → Meny) |
| `site-content.js` | Bunntekst/footer-lenker og sosiale ikoner (Admin → Footer) |
| `merch-config.js` | Merch-bestilling: Apps Script-URL, Vipps, bot-filter-token |
| `news-config.js` | Valgfri live-kanal for hastebeskjed (Apps Script-URL + token) |
| `api-config.js` | Lokal stub for Google-API-nøkkel (gitignorert; genereres i prod av Cloudflare) |

**Renderere og funksjonalitet (røres normalt ikke)**

| Fil | Hva det er |
| --- | --- |
| `site-chrome.js` | Bygger meny + footer på alle sider (fra `nav-content.js` / `site-content.js`) |
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
| `theme.js` | Lys/mørk-modus: setter `data-mode` på `<html>` før første paint |
| `palette.js` | Felles fargesystem (lys/mørk-variant per navngitt farge) |
| `footer-icons.js` | Delt ikonsett for footeren |
| `image-slot.js` | Gjenbrukbar bildekomponent (`<image-slot>`) |
| `site-search.js` | Søkefunksjon (overlay + scoring) |
| `search-base.js` | Statiske søketreff (sider/seksjoner/emner) — input til indeksen |
| `search-index.js` | Auto-generert søkeindeks (lages ved «Publiser» — rediger aldri for hånd) |
| `styles.css` | All styling for de offentlige sidene |

**Admin (Admin-senteret)**

| Fil | Hva det er |
| --- | --- |
| `admin-common.js` | Delt admin-logikk: datalager (`createStore`), drag-sortering, hjelpebobler, nedlasting, panel-registeret `AdminPanels` |
| `admin-common.css` | Delt stil for admin-skallet |
| `admin-modules.css` | Per-modul admin-stil (klasse-scopet, f.eks. `.mod-merch`) |
| `admin-modules/` | Én fil per editor (13 moduler: nyheter, oppslag, forsiden, om-oss, styret, merch, begrep, medlemskap, hjelp, meny, footer, oppnaelser, utmerkelser) |

**Dokumentasjon og oppsett**

| Fil | Hva det er |
| --- | --- |
| `README.md` | Kort oversikt, to-do og domene-status |
| `HVORDAN.md` | Denne fila — hvordan redigere og publisere |
| `CHANGELOG.md` | Logg over hva som er gjort |
| `docs/admin-arkitektur.md` | Skall+modul-arkitekturen for Admin-senteret |
| `docs/apps-script-oppsett.md` | Google Sheet + Apps Script-guide (merch + nyheter) |
| `.gitignore` | Hva git skal hoppe over (bl.a. `api-config.js`, `Plan F.html`) |
| `.github/dependabot.yml` | Ukentlig sjekk av GitHub Actions-avhengigheter |
| `_headers` | Cloudflare Pages — HTTP-sikkerhetsheadere (trygg basis, uten CSP) |

**Bilder**

| Mappe | Hva det er |
| --- | --- |
| `assets/Styremedlemmer/` | Portrettbilder av styremedlemmer (alternativ til base64) |
| `assets/begrep/` | Bilder for Begrep-utgaver og -innhold |
| `assets/merch/` | Bilder for merch-produkter (alternativ til base64) |
| `assets/lesesalen/` | Lesesal-bildene på forsiden (`lesesal1.jpg`, `lesesal2.jpg` …) |
| `assets/logikk-panikk/` | Plakatbilder brukt på oppslagstavla |
| `assets/oppnaelser/` | Bilder for oppnåelser-siden |
| `assets/apeiron-logo.png` | Logoen |
</details>


---

## Første gangs oppsett (om noe skulle skje hos Cloudflare)

Hvis repoet ikke er koblet til Cloudflare Pages, eller om man ønsker å bytte Cloudflare-bruker:

1. Last opp filene til et GitHub-repo
2. Gå til [dash.cloudflare.com](https://dash.cloudflare.com) → «Workers & Pages» → «Create» → «Pages» → «Connect to Git» → velg repoet
3. Sett «Framework preset» til «None» og la «Build command» stå tom. «Build output directory» settes til `/`.
4. Trykk «Save and Deploy» — fra nå av skjer alt automatisk