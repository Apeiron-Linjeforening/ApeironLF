# Apeiron Linjeforening — nettside

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

Du trenger altså **ikke** å gjøre noe på Cloudflare manuelt — det skjer av seg selv når du lagrer endringer til GitHub-repoet. Vanligvis tar det under ett minutt fra du pusher til siden er live.

### Endre en fil og publisere (steg for steg)

**Alternativ A — direkte på GitHub.com (enklest, ingen installasjon):**

1. Gå til repoet på [github.com](https://github.com)
2. Klikk på filen du vil endre (f.eks. `index.html`)
3. Trykk på blyant-ikonet (✏️ «Edit this file») øverst til høyre
4. Gjør endringen din
5. Rull ned og trykk **«Commit changes»**
6. Ferdig! Cloudflare Pages plukker opp endringen og oppdaterer siden automatisk

**Alternativ B — lokalt på PC (for større endringer):**

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

**Pro Tip: Claude Sonnet og Opus kan og bør brukes for å spare deg timer, om ikke dager av arbeid.** 

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
Rediger direkte i `index.html`, i seksjonen merket `<!-- ============ STYRET ============ -->` (ca. linje 404).

For hvert styremedlem finner du en blokk som ser slik ut:
```html
<div class="member reveal">
  <div class="member__ph">
    <span class="member__initials">SL</span>
    <image-slot id="b1" shape="circle" placeholder="Foto"></image-slot>
  </div>
  <h3 class="member__name">Navn Navnesen</h3>
  <p class="member__role">Leder</p>
  <a class="member__mail" href="mailto:epost@example.com">epost@example.com</a>
</div>
```

- Bytt ut initialer, navn, rolle og e-postadresse

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

### 📷 Galleri
**Ingen kodeendring nødvendig.**
Galleriet henter bilder automatisk fra en delt Google Drive-mappe via Google Drive API.

**Slik fungerer mappestrukturen:**
```
📁 ALT SOM LASTES OPP HER BLIR LAGT UT PÅ NETTSIDEN/       ← rot-mappe (delt med «Alle med lenken»)
  📁 Halloweenfest 2025/                                   ← én mappe = ett event-kort i galleriet
  📁 Sommerfest 2025/
  📁 Fadderukefest 2024/
```

- Årstallet i mappenavnet brukes til å lage år-faner automatisk
- Første bilde i mappen vises som forsidebilde på event-kortet
- Alle bilder i mappen vises i lysbildefremviser når man klikker på kortet

**For å legge til bilder:**
1. Gå til rot-mappen i Google Drive (spør styret om tilgang)
2. Opprett en ny mappe med navn og årstall, f.eks. `Vårfest 2077`
3. Last opp bildene direkte i den nye mappen
4. Ferdig — galleriet oppdaterer seg selv neste gang siden lastes

> **NB:** Rot-mappen og alle event-mappene må være delt som «Alle med lenken kan se». Uten dette vil API-kallet feile og bildene vises ikke.

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

| Fil                               | Hva det er                                                         |
| -----------------------------------| --------------------------------------------------------------------|
| `index.html`                      | Forsiden (hoveddelen av nettsiden)                                 |
| `pensum.html`                     | Pensum-oversikt                                                    |
| `merch.html`                      | Merch-side (produkter hentes fra `merch-products.js`)              |
| `merch-admin.html`                | 'Passordbeskyttet' admin-panel for å redigere merch                |
| `merch-products.js`               | Produktdata for merch (redigeres via admin-panel)                  |
| `galleri.html`                    | Bildegalleri (henter automatisk fra Google Drive)                  |
| `marked.html`                     | Kjøp & bytte (pensum-marked)                                       |
| `styles.css`                      | All styling                                                        |
| `app.js`                          | Meny, scroll-animasjoner og generell funksjonalitet                |
| `apeiron-events.js`               | Henter arrangementer fra Google Kalender                           |
| `apeiron-fadder.js`               | Henter fadderuke-program fra Google Kalender                       |
| `aporetisk-cal.js`                | Kalender for Aporetisk Aften                                       |
| `site-search.js`                  | Søkefunksjon                                                       |
| `image-slot.js`                   | Gjenbrukbar bildekomponent (`<image-slot>`), bl.a. for styrebilder |
| `tweaks.jsx` / `tweaks-panel.jsx` | Internt design-/utviklingsverktøy — ikke en del av selve nettsiden |
| `assets/merch/`                   | Bilder for merch-produkter (alternativ til base64)                 |
| `assets/`                         | Logo og andre bilder                                               |
| `_headers`                        | Cloudflare Pages — HTTP-sikkerhetsheadere                          |

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
- [ ] Fikse bedre sikkerhet for API-nøkkelen.

Medium:
- [ ] Stressteste Galleriet
- [ ] Telefon: Menyen er for stor/lang.
- [ ] Telefon: Søkefeltet er identisk med desktop.
- [ ] Legge til egen Begrep side.

Hadde vært kult:
- [ ] Snakke med IFR/NTNU om API for automatisk oppdatering av emner for studiene
- [ ] Få eget domene → Spør NTNU

Lav:
- [ ] Legge til forklaring av vervene i styret: Leder, nestleder, økonomiansvarlig, sosialansvarlig, PR-ansvarlig, Faddersjef, Fagansvarlig, Potet, (PTV, ITV), S.A.K, H.I.V. -> Dette krever en egen side for Styret.

Fulfført:
- [x] Å trykke på "Arrangement", "Studiene" eller "Styret" burde ta deg rett til siden, og ikke tvinge brukeren til å velge "Arrangement", "Studiene" eller "Styret" i menyen som dukker opp.
- [x] Søkefeltet i egne sider (Pensum og Merch) må endres.
- [x] Legge til informasjon og bilder om Lesesalen
- [x] Bildefremvisning av sosiale ting - Sjekke om dette kan gjøres med API eller automatisk med en enkel mappe i Github. Det er lettere for fremtidige styrer å laste opp bilder til en mappe.
- [x] Når man er på "Bli medlem" blir fremdeles "Lesealen" markert i menyen.
- [x] Migrere til en mer fast løsning: Cloudflare

---

© 2026 Apeiron Linjeforening
