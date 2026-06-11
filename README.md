# Apeiron Linjeforening — nettside

Nettsiden for Apeiron, linjeforeningen for filosofi og etikk ved NTNU.
Statisk nettside (HTML/CSS/JS) — ingen byggesteg, ingen avhengigheter å installere.

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

# Gjør endringene dine i en teksteditor (f.eks. VS Code)

# Last opp endringene
git add .
git commit -m "Kort beskrivelse av hva du endret"
git push
```

---

## Hva kan du redigere, og hvor?

### 📅 Arrangementer
**Ingen kodeendring nødvendig.**
Legg til, endre eller slett arrangementer direkte i **Google Kalender** (apeironlinjeforening@gmail.com).
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
- Bilder kan dras inn i sirkel-plassholderen på nettsiden (de lagres lokalt i nettleseren)

### 📚 Pensum
Rediger `pensum.html`. Hver emneblokk er en `<div class="course-block">` med tittel, emnekode og pensumliste.

### 🛍️ Merch
Rediger `merch.html`. Hvert produkt er et `<div class="merch-card">` — bytt ut navn, pris og beskrivelse.

### 📖 Om oss / øvrig tekst
All annen tekst (hero, om oss, studiene, FAQ, kontakt osv.) redigeres direkte i `index.html`.
Finn riktig seksjon ved hjelp av kommentarene: `<!-- ============ OM OSS ============ -->` osv.

---

## Filstruktur

| Fil | Hva det er |
|-----|-----------|
| `index.html` | Forsiden (hoveddelen av nettsiden) |
| `pensum.html` | Pensum-oversikt |
| `merch.html` | Merch-side |
| `marked.html` | Kjøp & bytte (pensum-marked) |
| `styles.css` | All styling |
| `app.js` | Meny, scroll-animasjoner og generell funksjonalitet |
| `apeiron-events.js` | Henter arrangementer fra Google Kalender |
| `apeiron-fadder.js` | Henter fadderuke-program fra Google Kalender |
| `aporetisk-cal.js` | Kalender for Aporetisk Aften |
| `site-search.js` | Søkefunksjon |
| `image-slot.js` | Dra-og-slipp bilde-plassholde for styremedlemmer |
| `assets/` | Logo og bilder |
| `netlify.toml` | Netlify-konfigurasjon (trenger normalt ikke røres) |

---

## Første gangs oppsett (kun én gang)

Hvis repoet ikke er koblet til Netlify ennå:

1. Last opp filene til et GitHub-repo
2. Gå til [app.netlify.com](https://app.netlify.com) → «Add new site» → «Import an existing project» → velg repoet
3. La «Publish directory» stå som `.` (allerede satt i `netlify.toml`). Ingen build-kommando trengs.
4. Trykk «Deploy» — fra nå av skjer alt automatisk

### Last opp til GitHub første gang

```bash
git init
git add .
git commit -m "Apeiron nettside"
git branch -M main
git remote add origin https://github.com/BRUKERNAVN/apeiron-nettside.git
git push -u origin main
```

(Bytt ut `BRUKERNAVN` og repo-navnet med ditt eget.)

---

© 2026 Apeiron Linjeforening
