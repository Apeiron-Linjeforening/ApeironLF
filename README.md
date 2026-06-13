# Apeiron Linjeforenings Nettside

Nettsiden for Apeiron, linjeforeningen for filosofi og etikk ved NTNU.
Statisk nettside (HTML/CSS/JS). Ingen byggesteg, ingen avhengigheter å installere.

# OBS!: 
## Nettsiden er under oppbygging. Det som står på siden burde tas kun som plassholdere.

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
- [ ] Endre medlemskapsprisen.
- [ ] Fikse admin-bug: Om man logger inn på en admin side, og ikke lukker nettsiden helt etterpå, vil man ikke kunne se en annen admin side.
- [ ] Endre "Hjelp" i menyen med noe annet som uttrykker mer direkte hva siden er om.
- [ ] Merch: "Bestill" knappen burde gjøre noe annet enn å åpne eposten i en nettside. -> Google forms?
- [ ] Fikse mørk modus - Nå er det kun en shitty mørk modus på index. 
- [ ] Fikse menyen / NAV slik at den fungerer bedre på smalere skjermer og mobil.

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

Hadde vært kult:
- [ ] Snakke med IFR/NTNU om API for automatisk oppdatering av emner for studiene.
- [ ] Bygge KKI for Apeiron.
- [ ] Burde det være en direkte måte for TVene ved IFR å legge ved oppdateringer på nettsiden vår?
- [ ] Kunne trykke på emne under hvert studie og bli tatt til emnet i pensumlistene - kan bli et problem for admin filene.

Forslag:
- [ ] Mer velkommen / koselig forside? Bilder av tidligere arrangement å index. Siden føles kanskje litt kald/som om den prøver å selge noe. -> Bilder fra galleri på forsiden eller på "om oss"?

Må gjøres før vi slapper av med å bygge nettsiden:
- [ ] Sjekke at alle admin sider fungerer.
- [ ] Kvadrupelsjekk at informasjon under Hjelp er helt riktig!! Sjekk numre og eposter!
- [ ] Sjekke på nytt hvordan alt oppfører seg på mobil.
- [ ] Fjern WIP banneret.

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

## Siste endringer

**11.06.26 — Første opplastning av nettsiden**
- Første versjon av hele nettstedet lastet opp: forsiden (`index.html`) med hero, Om oss, Studiene, Arrangementer, Aporetisk Aften, Fadderuke, Styret, Lesesalen, Bli medlem, Kontakt og footer.
- Alle undersider: `pensum.html`, `merch.html`, `marked.html`.
- Alle kjerne-JS-filer: `apeiron-events.js` (Google Kalender-integrasjon), `apeiron-fadder.js`, `aporetisk-cal.js`, `app.js`, `image-slot.js`, `site-search.js`.
- Komplett `styles.css` med hele det visuelle systemet (navy/gull/vinrød/pergament, serif-typografi).
- JSX/React-prototype forkastet til fordel for ren statisk HTML/CSS/JS.

**11.06.26 — Styrebilder og merch-system**
- Portrettbilder lastet opp for alle styremedlemmer (`assets/Styremedlemmer/`): Anna, Dagny, Dennis, Fredrik, Helene, Iver, Karoline, Martin, Natalie, Robin, Stian.
- Styremedlemmer lagt inn på forsiden med bilder, initialer og roller.
- Nytt merch-system: `merch-admin.html` (passordbeskyttet admin-panel) og `merch-products.js` (datafil). Merch-siden omskrevet til å lese fra datafilen — ingen kodeendring nødvendig for å legge til/endre produkter.
- Søk (`site-search.js`) fikset og rullet ut til Merch og Pensum.

**11.06.26 — Galleri og Lesesalen**
- Nytt bildegalleri (`galleri.html`) med Google Drive-integrasjon: mapper i Drive = event-kort i galleriet, automatisk henting via API, år-faner og lysbildefremviser.
- Lesesalen-seksjonen lagt til forsiden med tekst, ikonliste og bildestripe (de første lesesal-bildene `lesesal1–6.jpg`).
- Forbedringer i `styles.css` for galleri og lesesal-layout.
- `marked.html`, `merch.html` og `pensum.html` fikk navigasjons- og søkeforbedringer.

**12.06.26 — Lesesalen-lysbildefremviser og Cloudflare**
- Lesesal-bildene utvidet til 18 bilder (`lesesal7–18.jpg`), med oppdaterte høyere kvalitetsversjoner av de første.
- Lysbildefremviser (lightbox) lagt til lesesal-seksjonen på forsiden — klikk på bilde for å bla gjennom alle.
- Galleriet redesignet med forbedret layout og navigasjon.
- Migrert fra Netlify til **Cloudflare Pages** (`netlify.toml` fjernet, `_headers` lagt til for HTTP-sikkerhetsheadere). Automatisk deploy fra GitHub gjelder fortsatt.

**12.06.26 — Begrep-siden, styret-siden og diverse**
- Ny side for Begrep-tidsskriftet (`begrep.html`): eget mørkt visuelt uttrykk (svart/gull/rust), seksjoner for utgaver, podkast, film (Grev van Orton) og julekalender (Hilberts Hotell), statistikk-stripe og lenker til sosiale medier.
- Nytt passordbeskyttet admin-panel (`begrep-admin.html`) + datafil (`begrep-content.js`) for å redigere alt innhold på Begrep-siden uten å røre kode — fungerer likt som merch-admin.
- Lagt til bilder for Begrep-utgaver (`assets/begrep/`).
- Ny side for styret og vervbeskrivelser (`styret.html`) med tilhørende admin-panel (`styret-admin.html`) og datafil (`styret-content.js`).
- Begrep, Galleri, Merch, Marked og Pensum fikk søkestøtte (`site-search.js`).
- Fjernet ubrukte prototypefiler (`tweaks-panel.jsx`, `tweaks.jsx`).
- Fjernet for store bildefiler fra merch-assets.

**13.06.26 — Domene-oversikt i README**
- README oppdatert med strukturert oversikt over domene-alternativer: tilgjengelighet, priser og registrarer (Loopia, Domeneshop, Cloudflare Registrar).
- Dokumentert status for NTNU-subdomenet (`apeiron.org.ntnu.no`) og SFTP-tilgang.

**13.06.26 — Menyrestrukturering, bugfikser og kalender-tomtilstander**
- Desktop-navigasjon omstrukturert: 9 toppnivå-elementer med ryddige dropdowns — Om oss▾ (Om oss / Lesesalen / Samarbeid), Studiene▾, Arrangementer▾ (Arrangementer / Aporetisk Aften / Fadderuke), Styret▾ (Styret / Om vervene / Tillitsvalgte / S.A.K), Begrep, Galleri, Merch▾ (Merch / Kjøp & bytte), Kontakt, Bli medlem.
- Mobilmeny omgjort: søke-ikon vises nå direkte i topplinja (var skjult), skuffeменyen er komprimert med gruppeetiketter (FORENINGEN / STUDIENE / ARRANGEMENTER / STYRET / MER) i gullfarge. Hele menyen får plass på korte skjermer (≤700px høyde) uten scrolling.
- Bugfikser: S.A.K-lenker pekte feil (`index.html#sak` → `styret.html#sak`) i alle 5 undersider og søkeindeksen; fadder-footer-knapp pekte på feil anker; kontaktlenke pekte på Netlify i stedet for Cloudflare Pages; «Hilberts Hotell» rettet til «Hilbert Hotell»; «Bli Medlem»-siden viste feilaktig «Lesesalen» som aktiv menylenke.
- Interne vitser fjernet: Dennis/Iver-FAQ-spørsmål slettet, frisen byttet fra «jeg kan ikke lese» til «det gode liv».
- Kalender-tomtilstander: alle tre Google Kalender-integrasjonene (`apeiron-events.js`, `apeiron-fadder.js`, `aporetisk-cal.js`) skiller nå mellom API-feil (viser genererte plassholderdatoer for utviklere) og API-suksess uten hendelser (viser brukervennlig «dato kommer»-melding).
- Søkeindeks utvidet: Lesesalen, Galleri og Fellesskap & samarbeid lagt til som søkbare sider.

**13.06.26 — Begrep-hero lesbarhet, "Apeiron styret" og menylenke**
- Begrep-siden (`begrep.html`): eyebrow og undertekst i hero byttet fra mørk brungrå (`#7a7060`) til `rgba(240,236,224,.6)` — merkbart bedre lesbarhet mot den mørke bakgrunnen.
- "Om vervene" omdøpt til "Apeiron styret" i alle nav-dropdowns, mobilmenyer, footere, CTA-knapp på forsiden og `<h1>`/`<title>`/`og:title` i `styret.html`.
- "Styret"-triggeren i toppmenyen peker nå direkte på `styret.html` i stedet for `index.html#styret` — i alle 7 HTML-filer.

**13.06.26 — Hjelp-side, kontaktinfo og footer-oppdatering**
- Ny side `hjelp.html`: tre seksjoner med Si fra! (NTNUs varslingssystem med 6 kategorier forklart), faglig hjelp (PTV/ITV/FTV med synlige e-postadresser), og psykisk helse (SIT Helse og Rask psykisk helsehjelp med innhold hentet direkte fra sidene).
- "Hjelp" lagt til i navigasjon (desktop og mobilmeny) og footer på alle 7 sider.
- `begrep.html`: `begreptidsskrift@gmail.com` vist som lesbar tekst i kontaktseksjonen.
- `styret.html`: FTV- (`ftv@hf.ntnu.no`) og ITV-e-posten (`hf-ifr@studentrad.ntnu.no`) skilt ut som tydelige kontaktlinjer under hvert TVene-kort.
- Alle footere synkronisert: alle sider har nå samme komplette lenkesett (Begrep, Apeiron styret, Tillitsvalgte, Hjelp m.m. var manglende på flere sider).

**13.06.26 — Visuell finpuss på forsiden og styret-siden**
- Forsiden (`index.html` / `styles.css`): myk fokusring for tastatur, stat-tall som teller seg opp når de kommer i syne, jevnere hover på kort (Om oss, studieretninger, samarbeid), finere lenke-detaljer, mykere marquees med fade-kanter, og litt mer dybde i hero-bakgrunnen. Alt respekterer «reduser bevegelse».
- Lyse pixler (støyartefakter) fjernet fra alle hero-bakgrunner: 5 artefakter på forsiden (to nede, én under «etterpå», én over «linjeforening siden», én over Apeiron-logoen) og tilsvarende på øvrige sider.
- Styret-siden (`styret.html`): hover-løft på vervkort og styremedlem-portretter, og samme diskré stjernedryss i topp-banneret som på forsiden.
- README oppdatert: styret-seksjonen beskriver nå admin-panelet (`styret-admin.html` + `styret-content.js`).

**13.06.26 — Hjelp-siden: full utvidelse og omstrukturering**
- Hjelp-siden utvidet fra 3 til 5 seksjoner: lagt til **Fysisk helse** (`#fysisk`) og **Akutt hjelp** (`#akutt`).
- Hurtignav-kort rett under tittelen i subhero: ett klikkbart kort per seksjon (Si fra, Faglig hjelp, Psykisk helse, Fysisk helse, Akutt hjelp). Akutt-kortet fremhevet i maroon.
- **Si fra-seksjonen** kraftig utvidet: kategori-flisene har nå direktelenker til avviksskjema (`ntnu.extend.no`), e-vaktmester (Lydia) og ekstern varslingkanal (`trustcom.pwc.no/ntnu`). Fire nye støttekort lagt til: Studentombudet (med tlf., e-post og drop-in-tid), Personvernombudet (studentvennlig forklaring uten fagsjargong), Studieveiledning ved IFR (`studieveiledning-ifr@hf.ntnu.no` for filosofi- og etikkstudenter) og Forbrukerrådet (med konkrete studenteksempler).
- **Psykisk helse-seksjonen** utvidet med to nye kort: Studentpresten og Studenthumanisten — begge gratis, konfidensielle og åpne for alle uansett tro.
- **Fysisk helse-seksjonen** lagt til: SIT tannhelse og seksuell helse (med merknad om at SIT ikke har eget fastlegetilbud), Helsestasjon for ungdom (Trondheim kommune) og Helsenorge/fastlege.
- **Akutt hjelp-seksjonen** lagt til: nødnumre 113, 112, 110, 116117, 116123, Kirkens SOS (22 40 00 40) og 116111 — alle som klikkbare `tel:`-lenker med forklaring på når man ringer hvert enkelt. Livstruende numre visuelt skilt fra samtaletjenestene.
- Rask psykisk helsehjelp-kortet fikk fremhevet merknad: «Trondheim kommune ber studenter sjekke SIT sine tilbud først.» (hentet direkte fra kommunens side).
- SIT Fysisk helse-kortet rettet: fjernet feil påstand om legekontor (SIT har ikke eget fastlegetilbud), korrigert til tannhelse, seksuell helse og treningsveiledning.
- Seksjonsspacing komprimert: `.section` padding redusert fra 104px til 72px (kun på denne siden).
- Alle URL-tekster under knapper fjernet — de gjentok bare lenke-adressen og så ut som en bug.
- Akutt-kortene fikk hover-animasjon (løft + skygge + mørkere venstrekant), og navn-etikettene ble gjort større og mørkere (fra grået-ut 0,7rem til full navy 1rem).

**13.06.26 — Menyopprydding Styret og footer-synkronisering**
- Fjernet redundant «Styret»-lenke (→ `index.html#styret`) fra alle nav-dropdowns og skuffemenyer på samtlige 8 sider — den gikk til samme sted som dropdown-triggeren.
- «Apeiron styret» er nå første element i Styret-dropdownen; ny lenke «Verv» (→ `styret.html#vervene`) lagt til sist i alle dropdowns og skuffemenyer.
- Fjernet «Styret 2025/26»-seksjonen fra forsiden (`index.html`) — innholdet finnes på `styret.html`.
- Alle footere synkronisert: brutt «Styret»-lenke (→ `index.html#styret`) fjernet, «Verv» lagt til på alle 8 sider. `hjelp.html` manglet S.A.K — lagt til.
- «Tilbake til Styret»-lenken øverst på `styret.html` pekte på den nå fjernede seksjonen — endret til «Tilbake» (→ `index.html`).

**13.06.26 — Hjelp-admin og hjelp-content.js**
- Hjelp-siden omgjort til samme mønster som styret/begrep/merch: alt innhold er nå i `hjelp-content.js`, og `hjelp.html` rendres dynamisk fra den.
- Nytt passordbeskyttet admin-panel `hjelp-admin.html`: redigering av alle seksjoner (Si fra, Faglig hjelp, Psykisk helse, Fysisk helse, Akutt hjelp), hurtignav-kortene, nødnumre og alle ressurskort. Støtter HTML i kontaktlinjer og Si fra-tekst.
- Fil-tabell og seksjonsforklaring i README oppdatert med de nye filene.

**13.06.26 — README-opprydding og galleri-dokumentasjon**
- Fjernet duplikat «Hjelp & ressurser»-seksjon i README (gammel versjon som fortsatt beskrev hjelp.html som hardkodet).
- Galleri-seksjonen i README fullstendig omskrevet: forklarer nå riktig tre-nivå-struktur (hovedmappe → skoleår → arrangement → bilder), at forsidebildet styres av filnavn-alfabetisk rekkefølge, at løse bilder i skoleår-mapper hoppes over, og at fane-sortering er automatisk baklengs.

**13.06.26 — Arrangementetikett i galleri-marqueen**
- Hvert bilde i den scrollende bilderemsen øverst på `galleri.html` viser nå et lite overlegg nederst med navnet på arrangementet bildet er fra.
- Implementert ved å bytte fra enkel ID-array til `{id, name}`-objekter i `renderMarquee()` — mappenavnet følger bildet gjennom shuffle og duplisering.
- Lightboxen som åpnes ved klikk i marqueen viser nå riktig arrangementnavn i infolinjen (var tidligere alltid «Galleri»).
- Nye mapper i Drive plukkes automatisk opp — ingen kodeendring nødvendig.

**13.06.26 — Begrep: bestillingslenke via admin**
- `orderFormUrl` lagt til i `meta`-objektet i `begrep-content.js` — URL-en til bestillingsskjemaet (Google Forms) kan nå redigeres i `begrep-admin.html` og eksporteres med resten av innholdet.
- Nytt felt «Bestillingslenke» i meta-panelet i admin; feltet lastes, lagres og eksporteres automatisk.
- `begrep.html`: «Bestill tidsskrift»-knappen har fått id `bg-order-btn` og henter `href` dynamisk fra `meta.orderFormUrl` — ingen hardkodet URL i HTML-en lenger.

**13.06.26 — Begrep: «Bestill tidsskrift»-knapp**
- «Utgavene»-seksjonen på `begrep.html` har fått en tydelig «Bestill tidsskrift»-knapp (gull) som åpner bestillingsskjema via Google Forms i ny fane.
- Notisboksen under utgave-gridet er gjort om til en flex-rad: teksten «Ønsker du et eksemplar?» til venstre, og knappen + «Ta kontakt med redaksjonen →» til høyre. Stabler seg pent på mobil.

**13.06.26 — Sikkerhet, mørkt tema, påmelding og feilrapportering**
- API-nøkkel for Google Kalender og Google Drive fjernet fra kildekoden. Alle tre kalender-filene (`apeiron-events.js`, `aporetisk-cal.js`, `apeiron-fadder.js`) og galleriet (`galleri.html`) leser nå nøkkelen fra `window.GOOGLE_API_KEY`. På Cloudflare Pages settes nøkkelen som miljøvariabel (`Google_API_Key`) og injiseres automatisk av bygg-kommandoen til `api-config.js`. Lokalt: opprett `api-config.js` manuelt med nøkkelen (filen er gitignorert).
- Lys/mørk modus: toggle-knapp (måne/sol-ikon) lagt til i navigasjonen på alle 8 sider. Brukerens valg lagres i `localStorage`. Ved første besøk respekteres systempreferansen (`prefers-color-scheme`). Det mørke temaet («marine») fantes allerede i CSS — knappen gjør det tilgjengelig for brukerne.
- Arrangementspåmelding: om styret legger en Google Forms-lenke i beskrivelsesfeltet på en kalender-hendelse, vises nå en «Meld deg på»-knapp automatisk på arrangementet. Ingen kodeendring nødvendig fremover.
- Feilrapportering: diskret «Rapporter en feil på nettsiden»-lenke lagt til i footeren på alle 8 sider. Åpner e-postklient med `apeironlinjeforening@gmail.com` og forhåndsutfylt emnefelt.

**13.06.26 — Begrep-siden: kontakt og bidra slått sammen**
- «Meld interesse»-knappen peker nå til `#kontakt`-seksjonen istedenfor Google Forms.
- «Vil du bidra?»- og «Kontakt»-seksjonene slått sammen til én seksjon med rød Begrep-bakgrunn (`--bg-rust`). Skillet mellom seksjonene er fjernet.
- E-postadressen er gjort større og mer fremtredende i den sammenslåtte seksjonen.
- `begrep-content.js`: `meta.email` lagt til — e-postadressen kan nå redigeres direkte i `begrep-admin.html` og eksporteres med resten av innholdet.
- `begrep-admin.html`: nytt e-postfelt i meta-panelet.

**13.06.26 — Kalender-feilstater: API-feil vs. tom kalender**
- Alle tre kalender-integrasjonene skiller nå tydelig mellom API-nøkkel ugyldig/ikke satt (innrammet ⚠-melding med lenke til README og kontaktsiden) og tilkoblet kalender uten hendelser (vennlig «kommer snart»-melding).
- Arrangementer: alle tre visninger (Liste, Rutenett, Oversikt) dekket. Filterknapper skjules ved API-feil. Bug-aktig statusbanner fjernet. Rutenett-meldingen sentrert over alle kolonner.
- Aporetisk Aften: «Når»-feltet viser «—» ved API-feil og «Dato kommer» ved tom kalender. Genererte torsdagsdatoer vises ikke lenger ved API-feil.
- Fadderukene: skjelett-plassholderen erstattet med feilmelding ved API-feil.

---

© 2026 Apeiron Linjeforening
