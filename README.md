# Apeiron Linjeforenings Nettside

Nettsiden for Apeiron, linjeforeningen for filosofi og etikk ved NTNU.
Statisk nettside (HTML/CSS/JS). Ingen byggesteg, ingen avhengigheter å installere.
**Vibrasjonskoding har aldri vært så effektivt!**

# OBS!: 
**Nettsiden er under oppbygging. Det som står på siden burde tas kun som plassholdere.**

---

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
  badge: "Nyhet",            // tekst på badge, eller null
  badgeType: "new",          // "new" (gull) | "bestseller" (maroon) | null
  category: "Klær",
  name: "Produktnavn",
  desc: "Kort beskrivelse.",
  price: 299,
  memberPrice: 249,          // utelat hvis ingen medlemspris
  img: null,                 // null = viser segl-watermark
                             // "assets/merch/filnavn.jpg" = bilde fra repoet
                             // (base64-streng fra admin-panel også støttet)
}
```

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

### 📖 Om oss / øvrig tekst
All annen tekst (om oss, studiene, FAQ, kontakt osv.) redigeres direkte i `index.html`.
Finn riktig seksjon ved hjelp av kommentarene: `<!-- ============ OM OSS ============ -->` osv.

---

## Filstruktur

| Fil                      | Hva det er                                                                          |
| --------------------------| -------------------------------------------------------------------------------------|
| `index.html`             | Forsiden (hoveddelen av nettsiden)                                                  |
| `pensum.html`            | Pensum-oversikt                                                                     |
| `merch.html`             | Merch-side (produkter hentes fra `merch-products.js`)                               |
| `merch-admin.html`       | 'Passordbeskyttet' admin-panel for å redigere merch                                 |
| `merch-products.js`      | Produktdata for merch (redigeres via admin-panel)                                   |
| `galleri.html`           | Bildegalleri (henter automatisk fra Google Drive)                                   |
| `marked.html`            | Kjøp & bytte (pensum-marked)                                                        |
| `begrep.html`            | Side for Begrep-tidsskriftet (utgaver, podkast, film, julekalender)                 |
| `begrep-admin.html`      | 'Passordbeskyttet' admin-panel for å redigere Begrep-innhold                        |
| `begrep-content.js`      | Innholdsdata for Begrep-siden (redigeres via admin-panel)                           |
| `hjelp.html`             | Hjelp & ressurser (leser fra `hjelp-content.js`)                                    |
| `hjelp-admin.html`       | 'Passordbeskyttet' admin-panel for å redigere Hjelp-siden                           |
| `hjelp-content.js`       | Innholdsdata for Hjelp-siden (redigeres via admin-panel)                            |
| `styret.html`            | Styret og beskrivelse av alle styreverv (leser fra `styret-content.js`)             |
| `styret-admin.html`      | 'Passordbeskyttet' admin-panel for å redigere styret og verv                        |
| `styret-content.js`      | Innholdsdata for styret-siden (redigeres via admin-panel)                           |
| `styles.css`             | All styling                                                                         |
| `app.js`                 | Meny, scroll-animasjoner og generell funksjonalitet                                 |
| `theme.js`               | Lys/mørk-modus: setter `data-mode` på `<html>` før første paint og binder toggle   |
| `apeiron-events.js`      | Henter arrangementer fra Google Kalender                                            |
| `apeiron-fadder.js`      | Henter fadderuke-program fra Google Kalender                                        |
| `aporetisk-cal.js`       | Kalender for Aporetisk Aften                                                        |
| `site-search.js`         | Søkefunksjon                                                                        |
| `image-slot.js`          | Gjenbrukbar bildekomponent (`<image-slot>`), bl.a. for styrebilder                  |
| `assets/merch/`          | Bilder for merch-produkter (alternativ til base64)                                  |
| `assets/begrep/`         | Bilder for Begrep-utgaver og -innhold                                               |
| `assets/Styremedlemmer/` | Portrettbilder av styremedlemmer (alternativ til base64)                            |
| `assets/`                | Logo og andre bilder                                                                |
| `_headers`               | Cloudflare Pages — HTTP-sikkerhetsheadere                                           |

---

## Første gangs oppsett (om noe skulle skje hos Cloudflare)

Hvis repoet ikke er koblet til Cloudflare Pages, eller om man ønsker å bytte Cloudflare-bruker:

1. Last opp filene til et GitHub-repo
2. Gå til [dash.cloudflare.com](https://dash.cloudflare.com) → «Workers & Pages» → «Create» → «Pages» → «Connect to Git» → velg repoet
3. Sett «Framework preset» til «None» og la «Build command» stå tom. «Build output directory» settes til `/`.
4. Trykk «Save and Deploy» — fra nå av skjer alt automatisk
---
## To do

Kritisk:
- [ ] Fikse domene - Se "Domene" nedenfor.
- [ ] Kvadrupelsjekk at informasjon under Hjelp er helt riktig!! Sjekk numre og eposter!
- [ ] Endre medlemskapsprisen: to priser: ett-års (100kr) og studietid (150kr).
- [ ] Fikse admin-bug: Om man logger inn på en admin side, og ikke lukker nettsiden helt etterpå, vil man ikke kunne se en annen admin side.
- [ ] Endre "Hjelp" i menyen med noe annet som uttrykker mer direkte hva siden er om.
- [ ] Merch: "Bestill" knappen burde gjøre noe annet enn å åpne eposten i en nettside. -> Google forms?
- [x] ~~Fikse mørk modus - Nå er det kun en shitty mørk modus på index. Meny/NAV må passes på her.~~
- [ ] Fikse menyen / NAV slik at den fungerer bedre på smalere skjermer og mobil.
- [ ] Legge til et informasjonsfelt for Fadderukene hvor man kan fylle inn generell info.
- [ ] Sjekke at "Legg til fadderukeprogrammet i din kalender" fungerer: iCal og Google Kalender.
- [ ] Aporetisk Aften kalender: Ta beskrivelsen fra kalenderen og gjøre det om til et "Om Aftenen".
- [ ] Legge til '?' i admin som forklarer hva hvert felt og mulighet gjør.
- [ ] Passe på at alle admin-filene er konsistente.
- [ ] Merch: "Begrenset" badge funker ikke, "Nyhet" badge funker kun om det står "Nyhet" i badge tekst feltet. Gjør admin feltene om til ett felt: velg en av presetene eller skriv egen. Ingen begge.
- [ ] Merch: Legge til animert farge/lys på badge.

Medium:
- [ ] Be HF studentrådet om å oppdatere sidene deres og gi oss mer informasjon om hva de faktisk gjør. 
      - [ ] Hva gjør egentlig en PTV, ITV og FTV? 
      - [ ] Hvordan får vi kontakt med våre egne TVer?
- [ ] Be HF studentrådet om å fikse "Bli kjent med oss" og "Kontakt oss" lenkene deres. Jeg har nå funnet ut at de ikke er ødelagt, de legger bare til eposten deres på slutten av nettsiden... så https://www.hf-studentrad.no/ blir til https://www.hf-studentrad.no/ftv@hf.ntnu.no. Dette kan vi fikse for de.
- [ ] Legge til side for Utmerkelser for personer som har stått ut i studentmiljøet eller det frivillige under IFR.
- [ ] Legge til side for møtereferat -> Kan tas i egen wiki, muligens.
- [ ] Lage egen Admin for index.
- [ ] Utdype "Legevakt" til å inkludere psykiske lidelser som kan være akutt. 
- [ ] Siden føles litt kommersiell ut....
- [ ] Legg til Logikk Panikk.
- [ ] Finne en bedre måte å vise arrangement og plakater på -> Måte å vise nyheter/informasjon på.
- [ ] Se om vi kan få menyen til å være en og samme entitet over alle sidene -> for å slippe å oppdatere hver en meny for hver side.

Lav:
- [ ] Side eller plassering for "Oppnåelser" (Premier vi har fått, som sølv i håndball og "best oppmøte" fra Dionysos)
- [ ] Fylle ut SAK / utvide den.
- [ ] Sette opp et arkiv.
- [ ] Sammenlign med https://www.mfplacebo.no/
- [ ] Gjøre om admin filene til å gi nærest full kontroll over oppsett over sidene.
- [ ] Menyen: Dropdown menyene skal endre seg for å vise hvor du er (Styret fungerer ikke).

Hadde vært kult:
- [ ] Snakke med IFR/NTNU om API for automatisk oppdatering av emner for studiene.
- [ ] Bygge KKI for Apeiron.
- [ ] Burde det være en direkte måte for TVene ved IFR å legge ved oppdateringer på nettsiden vår?
- [ ] Kunne trykke på emne under hvert studie og bli tatt til emnet i pensumlistene - kan bli et problem for admin filene.
- [ ] Egen knapp på Begrep siden (ikke automatisk Mørk modus) som gir et spesielt tema.
- [ ] Automatisk tema endring av sidene: Jul, 17. mai, påske, halloween, fadderukene, frigjøringsdagen, HMS bursdag (legge dette til i en admin fil, muligens... HMS er gammel) + mulighet til å skru de av, endre bilder, farger osv.

Forslag:
- [ ] Mer velkommen / koselig forside? Bilder av tidligere arrangement å index. Siden føles kanskje litt kald/som om den prøver å selge noe. -> Bilder fra galleri på forsiden eller på "om oss"?

Må gjøres før vi slapper av med å bygge nettsiden:
- [ ] Sjekke at alle admin sider fungerer.
- [ ] Kvadrupelsjekk at informasjon under Hjelp er helt riktig!! Sjekk numre og eposter!
- [ ] Sjekke på nytt hvordan alt oppfører seg på mobil og smalere skjermer.
- [ ] Fjern WIP banneret.
- [ ] Rydde opp i Readme.
- [ ] Lage en ordentlig How-To.

Domene:
- [ ] Få bedre domene

**Status per 13.06.26:**

| Domene                 | Status      | Pris       | Registrar            |
| ------------------------| -------------| ------------| ----------------------|
| apeiron.no             | **Tatt**    | —          | —                    |
| apeiron.org            | **Tatt**    | —          | —                    |
| apeironntnu.no         | **Ledig** ✅ | 149 kr/år  | Loopia               |
| apeironntnu.org        | **Ledig** ✅ | 169 kr/år  | Loopia               |
| apeironntnu.org        | **Ledig** ✅ | 275 kr/år  | Domeneshop           |
| apeironntnu.org        | **Ledig** ✅ | $11.20 /år | Cloudflare Registrar |
| apeironntnu.com        | **Ledig** ✅ | $10.46 /år | Cloudflare Registrar |
| apeironntnu.net        | **Ledig** ✅ | $11.86 /år | Cloudflare Registrar |
| apeironntnu.online     | **Ledig** ✅ | 9 kr /år   | Loopia               |
| apeironlf.org          | **Ledig** ✅ | $11.20 /år | Cloudflare Registrar |
| apeironlf.com          | **Ledig** ✅ | $10.46 /år | Cloudflare Registrar |
| apeironlf.no           | **Ledig** ✅ | 99 kr /år  | Domeneshop           |
| apeironlf.no + .online | **Ledig** ✅ | 99 kr /år  | Domeneshop           |

Merk: Cloudflare Registrar støtter ikke .no-domener. For .org er Cloudflare billigst.

**NTNU-alternativ (`apeiron.org.ntnu.no`):**
- Adressen er gjenopplivet, men fungerer som en filserver (NTNU sitt mappesystem), ikke som et vanlig domene.
- Forsøkt omdirigering med `.htaccess` (`RedirectMatch (.*) https://apeironlf.pages.dev/`) — fungerte ikke.
- Tilgang: For tilgang via sftp, skriv `sftp://dittbrukernavn@login.stud.ntnu.no/home/groups/apeiron` i filutforskeren (Linux). Per nå er det kun sosialansvarlig Iver (25/26) som har tilgang.
- Avventer svar fra NTNU om muligheten for videre hjelp.

---

© 2026 Apeiron Linjeforening
