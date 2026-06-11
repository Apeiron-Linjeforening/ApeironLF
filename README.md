# Apeiron Linjeforening — nettside

Nettsiden for Apeiron, linjeforeningen for filosofi og etikk ved NTNU.
Statisk nettside (HTML/CSS/JS) — ingen byggesteg, ingen avhengigheter å installere.

# OBS!: 
## Nettsiden er under oppbygging. Det som står på siden burde tas kun som plassholdere. Netlify er en midlertidig løsning.

---

## Slik fungerer publisering (Netlify + GitHub)

Nettsiden er koblet opp slik:

```
Du redigerer en fil  →  pusher til GitHub  →  Netlify oppdaterer siden automatisk
```

Du trenger altså **ikke** å gjøre noe på Netlify manuelt — det skjer av seg selv når du lagrer endringer til GitHub-repoet. Vanligvis tar det under ett minutt fra du pusher til siden er live.

### Endre en fil og publisere (steg for steg)

**Alternativ A — direkte på GitHub.com (enklest, ingen installasjon):**

1. Gå til repoet på [github.com](https://github.com)
2. Klikk på filen du vil endre (f.eks. `index.html`)
3. Trykk på blyant-ikonet (✏️ «Edit this file») øverst til høyre
4. Gjør endringen din
5. Rull ned og trykk **«Commit changes»**
6. Ferdig — Netlify plukker opp endringen og oppdaterer siden automatisk

**Alternativ B — lokalt på PC (for større endringer):**

```bash
# Last ned siste versjon
git pull

# Gjør endringene dine i en teksteditor (f.eks. VS Codium)

# Last opp endringene
git add .
git commit -m "Kort beskrivelse av hva du endret"
git push
```

**Alternativ B.2 - Lokalt på PC med hjelp av KI Modeller**
Ta kontakt med Sosialansvarlig Iver N. Edvardsen for hjelp med dette.

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
Merch-produkter redigeres i `merch.html`. Bilder må legges inn i `assets/merch/` mappen.

**For å legge til et produkt:**
```html
<article class="product reveal">
  <div class="product__img">
    <span class="product__badge product__badge--new">Nyhet</span> <!-- --new | --sold | (ingen = Begrenset) -->
    <img src="assets/merch/bilde-navn.jpg" alt="Produktnavn" class="product__image">
  </div>
  <div class="product__body">
    <span class="product__cat">Kategori</span>
    <h3>Produktnavn</h3>
    <p class="product__desc">Beskrivelse.</p>
    <div class="product__footer">
      <div class="product__price">100,– <small>kr · <em>90,– medlem</em></small></div>
      <a class="btn btn--maroon" href="mailto:?subject=Bestilling%3A%20Produktnavn">Bestill</a>
    </div>
  </div>
</article>
```

**Badge-typer:**
- `.product__badge--new` → "Nyhet" (gullfarge)
- `.product__badge--sold` → "Utsolgt" (grå)
- (ingen klasse) → "Begrenset" (maroon)

### 📖 Om oss / øvrig tekst
All annen tekst (om oss, studiene, FAQ, kontakt osv.) redigeres direkte i `index.html`.
Finn riktig seksjon ved hjelp av kommentarene: `<!-- ============ OM OSS ============ -->` osv.

---

## Filstruktur

| Fil                 | Hva det er                                          |
| ---------------------| -----------------------------------------------------|
| `index.html`        | Forsiden (hoveddelen av nettsiden)                  |
| `pensum.html`       | Pensum-oversikt                                     |
| `merch.html`        | Merch-side                                          |
| `marked.html`       | Kjøp & bytte (pensum-marked)                        |
| `styles.css`        | All styling                                         |
| `app.js`            | Meny, scroll-animasjoner og generell funksjonalitet |
| `apeiron-events.js` | Henter arrangementer fra Google Kalender            |
| `apeiron-fadder.js` | Henter fadderuke-program fra Google Kalender        |
| `aporetisk-cal.js`  | Kalender for Aporetisk Aften                        |
| `site-search.js`    | Søkefunksjon                                        |
| `assets/merch/`     | Bilder for merch-produkter                          |
| `assets/`           | Logo og andre bilder                                |
| `netlify.toml`      | Netlify-konfigurasjon (trenger normalt ikke røres)  |

---

## Første gangs oppsett (om noe skulle skje hos Netlify)

Hvis repoet ikke er koblet til Netlify, eller om man ønsker å bytte Netlify bruker:

1. Last opp filene til et GitHub-repo
2. Gå til [app.netlify.com](https://app.netlify.com) → «Add new site» → «Import an existing project» → velg repoet
3. La «Publish directory» stå som `.` (allerede satt i `netlify.toml`). Ingen build-kommando trengs.
4. Trykk «Deploy» — fra nå av skjer alt automatisk
---
## To do
- [ ] - Snakke med IFR/NTNU om API for automatisk oppdatering av Emner for studiene
- [ ] - Legge til informasjon om Lesesalen
- [ ] - Bildefremvisning av sosiale ting - Sjekke om dette kan gjøres med API eller automatisk med en enkel mappe i Github. Det er lettere for fremtidige styrer å laste opp bilder til en mappe.
- [ ] - Legge til forklaring av vervene i styrene: Leder, nestleder, økonomiansvarlig, sosialansvarlig, PR-Ansvarlig, Faddersjef, Fagansvarlig, Potet, (PTV, ITV), S.A.K, H.I.V.
- [ ] - Å trykke på "Arrangement", "Studiene" eller "Styret" burde ta deg rett til siden, og ikke tvinge brukeren til å velge "Arrangement", "Studiene" eller "Styret" i menyen som dukker opp.
- [ ] Søkefeltet i egne sider (Pensum og Merch) må endres.


---

© 2026 Apeiron Linjeforening
