# 🌐 Apeiron — Linjeforeningens nettside

Nettsiden for **Apeiron**, linjeforeningen for filosofi og etikk ved NTNU.
Statisk side (HTML/CSS/JS) på Cloudflare Pages — ingen byggesteg, ingen avhengigheter å installere.
**Vibrasjonskoding har aldri vært så effektivt!**

[![Live](https://img.shields.io/badge/live-apeironlf.pages.dev-2ea44f?style=flat-square)](https://apeironlf.pages.dev)
[![Admin](https://img.shields.io/badge/admin-senteret-d4af37?style=flat-square)](https://apeironlf.pages.dev/admin.html)
[![Status](https://img.shields.io/badge/status-under%20oppbygging-orange?style=flat-square)](#)
[![Lisens](https://img.shields.io/badge/lisens-MIT-blue?style=flat-square)](LICENSE)

> ⚠️ **Under oppbygging.** Innholdet på den publiserte siden er foreløpig — ta det som plassholdere.

---

## 📚 Dokumentasjon

| Dokument | Hva det er |
| --- | --- |
| 📖 **README** (du er her) | Oversikt + **brukerveiledning** — endre innhold via Admin-senteret |
| 🔧 **[VEDLIKEHOLD.md](VEDLIKEHOLD.md)** | Teknisk drift: publisering, lokal kjøring, manuell redigering, filstruktur, Apps Script |
| 🏗️ **[docs/admin-arkitektur.md](docs/admin-arkitektur.md)** | Hvordan Admin-senteret er bygd + veikart mot klonbar mal |
| 🛒 **[docs/apps-script-oppsett.md](docs/apps-script-oppsett.md)** | Steg-for-steg: merch-bestilling (Google Sheet + Apps Script) |
| 📝 **[CHANGELOG.md](CHANGELOG.md)** | Logg over hva som er gjort |

> 🗺️ `Plan F.html` (lokalt, gitignorert) holder veikartet videre: git-CMS → klonbar mal, og en handoff av hvor vi står.

---

## 🧭 Innhold

**For redaktører (styret):**
- [Slik endrer du innhold](#slik-endrer-du-innhold-på-apeiron-nettsiden)
  - [1. Åpne Admin-senteret](#1-åpne-admin-senteret)
  - [2. Slik redigerer du](#2-slik-redigerer-du)
  - [3. Slik publiserer du](#3-slik-publiserer-du-gjør-endringene-synlige-for-alle)
  - [4. Hva styrer hva](#4-hva-styrer-hva)
  - [5. Deler som styres utenfor Admin-senteret](#5-deler-som-styres-utenfor-admin-senteret)
  - [6. Trenger du noe mer avansert?](#6-trenger-du-noe-mer-avansert)

**For utviklere / drift:**
- [Slik er nettsiden bygd (kort)](#slik-er-nettsiden-bygd-kort)
- [Kjente begrensninger og usikkerheter](#kjente-begrensninger-og-usikkerheter)
- [To-do og veikart](#to-do)
- [Domene](#domene)
- [Lisens](#lisens)

---

# Slik endrer du innhold på Apeiron-nettsiden

Alt innhold på nettsiden redigeres **ett sted: Admin-senteret**, rett i nettleseren.
Du trenger ingen programmer og ingen innlogging — og du skal **aldri åpne eller endre
en kodefil**. Skriver du i Admin-senteret, lager det ferdige filer for deg; du laster
dem bare opp uendret når du vil publisere.

> 🧑‍🔧 **Den ene regelen:** Hvis du ikke vedlikeholder selve koden, skal du aldri gå
> inn i en fil på GitHub og redigere teksten i den. All redigering skjer i
> Admin-senteret.
>
> Drifter du koden? Da er teknisk dokumentasjon samlet i
> **[VEDLIKEHOLD.md](VEDLIKEHOLD.md)** (publisering, oppsett, filstruktur, Apps Script osv.).

---

## 1. Åpne Admin-senteret

Bla ned til bunnen av siden og trykk på "Admin", eller legg til `/admin.html` på slutten av nettadressen:

```
https://apeironlf.pages.dev/admin.html
```

Ingen innlogging. Du møter en meny med alle delene av siden du kan endre.

---

## 2. Slik redigerer du

1. **Velg en del** i menyen (Nyheter, Forsiden, Styret, Merch …).
2. **Rediger feltene.** En **live forhåndsvisning** ved siden viser hvordan det blir.
3. Alt du skriver **lagres automatisk i din egen nettleser** mens du jobber — så du
   mister ingenting om du lukker fanen. Men det er **ikke publisert** ennå (se neste steg).

De fleste paneler lar deg legge til, slette og **dra for å endre rekkefølge** på kort
(medlemmer, produkter, nyheter osv.), og laste opp bilder ved å klikke på bildefeltet
eller dra et bilde inn.

---

## 3. Slik publiserer du (gjør endringene synlige for alle)

Tre steg. Du redigerer aldri kode — du flytter bare ferdige filer.

1. Trykk **↓ Last ned alle endrede** øverst til høyre. De endrede filene (og eventuelle
   bilder) lastes ned til maskinen din.
2. **Last filene opp til GitHub** — der nettsiden «bor». Du **erstatter** hele filer
   med de nye; du åpner dem aldri for å skrive i dem.
3. Vent ca. ett minutt. Nettsiden oppdaterer seg selv automatisk.

> 💡 **Usikker på GitHub-steget?** Det er det eneste som krever litt teknisk tilgang —
> selve redigeringen har du allerede gjort i Admin-senteret. Spør den som drifter
> nettsiden, så tar de opplastingen. Full framgangsmåte for opplasting ligger i
> [VEDLIKEHOLD.md](VEDLIKEHOLD.md).

---

## 4. Hva styrer hva

Hver del i menyen styrer én del av nettsiden:

| Panel | Styrer |
| --- | --- |
| **Forsiden** | Toppbildet, «Om oss»-teksten, FAQ og kontaktinfo på forsiden |
| **Om oss** | Innholdet på Om oss-siden |
| **Nyheter** | Kunngjøringer og beskjeder (på forsiden + arkiv på Nyheter-siden) |
| **Oppslagstavla** | Plakatene på oppslagstavla og forside-teaseren |
| **Styret** | Styremedlemmer, portretter og beskrivelse av vervene |
| **Merch** | Produktene i nettbutikken |
| **Begrep** | Begrep-tidsskriftet: utgaver, podkast, film, julekalender |
| **Medlemskap** | Priser, Vipps-nummer og innmeldingssteg |
| **Hjelp** | Hjelp & ressurser-siden |
| **Meny** | Lenkene i hovedmenyen (topp + mobil) |
| **Footer** | Bunnteksten og de sosiale lenkene |
| **Oppnåelser** | Milepæler / oppnåelser |
| **Utmerkelser** | Utmerkelser og priser |

Hvert panel har sin egen **↓ Last ned**-knapp hvis du bare vil publisere den ene delen,
eller bruk **↓ Last ned alle endrede** for å ta alt på én gang.

> 💡 **Hastebeskjed?** En kjapp viktig melding (for eksempel «Aporetisk i kveld er flyttet»)
> legger du ut i **Nyheter**-panelet — skru på **⚑ Viktig** og velg hvor den skal vises.
> Den dukker opp i «Akkurat nå»-kortet på forsiden.

---

## 5. Deler som styres utenfor Admin-senteret

Noen ting er enda enklere — de oppdateres helt uten kode, men i et annet verktøy enn
Admin-senteret:

### 📅 Arrangementer → Google Kalender

Legg til, endre eller slett arrangementer direkte i **Google Kalenderne** til Apeiron.
Nettsiden henter dem automatisk og oppdaterer seg selv.

- Skriv kategorien først i tittelen, med kolon, for å tagge: `Fagkveld: Etikk & KI`
- Sted hentes fra «Sted»-feltet i kalenderhendelsen
- Aktivitetskalenderen er for alt som ikke hører til Aporetisk Aften eller Fadderukene
  (de har egne kalendere)

### 🎓 Fadderuke → Google Kalender

Samme prinsipp: legg postene i **fadderuke-kalenderen**. Skriv type med kolon:
`Grill: Bli-kjent-kveld`

### 📷 Galleri → Google Drive

**Du trenger aldri å røre koden for å oppdatere galleriet.** Alt styres fra én delt
Google Drive-mappe. Nettsiden leser den hver gang noen åpner galleri-siden, så
endringer du gjør i Drive dukker opp på nettsiden av seg selv.

#### Hvordan mappene må ligge

Det viktigste å forstå: mappene må ligge i **nøyaktig tre nivåer nedover**, som esker
inni esker. Hopper du over et nivå, vises ikke bildene.

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

1. **Hovedmappen** er den styret har delt. Inni den lager du bare skoleår-mapper.
2. **Skoleår-mappene** (nivå 2) lager du inni hovedmappen. Navnet, f.eks. `2025/2026`,
   blir teksten på fanen øverst i galleriet. Bruk alltid samme navneform.
3. **Arrangement-mappene** (nivå 3) lager du inni en skoleår-mappe. Navnet blir
   tittelen på bildekortet — kall den noe gjenkjennelig, f.eks. `Fadderukefest`.
4. **Bildene** legger du helt innerst, rett inni arrangement-mappen.

#### Tre ting som er lett å gjøre feil

- **Bilder må ligge inni en arrangement-mappe.** Løse bilder i en skoleår-mappe (eller i
  hovedmappen) blir hoppet over.
- **Forsidebildet på kortet blir det bildet som kommer først alfabetisk** på filnavn.
  Vil du styre det, gi det et navn som havner først, f.eks. `01.jpg` eller `aaa-forside.jpg`.
- **Nyeste skoleår vises først** av seg selv — `2025/2026` legger seg foran `2024/2025`.

#### Legg til bilder fra et nytt arrangement

1. Åpne den delte hovedmappen i Google Drive (spør styret om lenken).
2. Finn mappen for inneværende skoleår, f.eks. `2025/2026`. Finnes den ikke, lag den.
3. Gå **inn i** skoleår-mappen og lag en ny mappe med navnet på arrangementet.
4. Gå **inn i** arrangement-mappen og last opp bildene dit.
5. Ferdig — neste gang noen åpner galleriet er bildene der.

> **Viktig om deling:** Hovedmappen og alt inni den må være delt som «Alle med lenken
> kan se». Er en mappe privat, klarer ikke nettsiden å hente bildene. Spør styret hvis
> du er usikker.

---

## 6. Trenger du noe mer avansert?

Pensumlister, lesesalsbildene på forsiden, oppsett av merch-bestilling, hele
filstrukturen og hvordan publiseringen fungerer under panseret — alt det ligger i
**[VEDLIKEHOLD.md](VEDLIKEHOLD.md)**, ment for de som drifter koden.

Lurer du på noe som ikke står her, spør styret, den KI modellen som er best på koding i den tid du leser dette eller den som vedlikeholder nettsiden.

---

## Slik er nettsiden bygd (kort)

Statisk side (HTML/CSS/JS), ingen byggesteg. Meny og footer bygges sentralt fra
`nav-content.js` / `site-content.js` via `site-chrome.js` og injiseres på alle sider.
Sideinnhold ligger i data-filer (`*-content.js` / `*-config.js`), ikke hardkodet i HTML.

**All redigering skjer i ett samlet Admin-senter (`admin.html`):** et skall som
mounter tynne editor-moduler fra `admin-modules/<område>.js`. Modulene deler
`admin-common.js` (datalager `createStore`, drag-sortering, hjelpebobler, `saveFile`,
panel-registeret `AdminPanels`) og `admin-modules.css` (klasse-scopet stil per modul).
Hver modul har live forhåndsvisning og en «↓ Last ned»-knapp; redigeringsløkka er
*rediger → last ned data-fil → commit/push → Cloudflare bygger (~1 min)*.
Full arkitekturforklaring: [docs/admin-arkitektur.md](/docs/admin-arkitektur.md).

---

## Kjente begrensninger og usikkerheter

Ting vi vet om, men er usikre på om det er verdt å gjøre noe med. Ført opp så de ikke glemmes — ikke nødvendigvis feil som må fikses.

<details>
<summary><b>Vis de fem punktene</b></summary>

- **Merch: én farge kan bare kobles til ett bilde.** Har du to bilder av samme farge (f.eks. for- og bakside av samme genser), kan bare det ene knyttes til fargen. Velger man samme farge på bilde nummer to, flyttes koblingen dit. Lite problem i praksis (kunden ser uansett hele galleriet via miniatyrstripa). Å støtte flere bilder pr. farge ville kreve en mer kompleks datamodell.
- **Meny og footer vises et lite øyeblikk etter at siden lastes.** De bygges av `site-chrome.js` i nettleseren (for å slippe byggesteg og holde alt i én fil). På treg forbindelse kan man så vidt se at de «popper inn». Menyen er fast posisjonert, så selve innholdet hopper ikke. Alternativet (byggesteg) ble vurdert og valgt bort, se diskusjon i commit-historikk.
- **Footer/meny krever JavaScript.** Med JS avslått vises ikke meny/footer. Gjelder en svært liten andel besøkende; resten av siden bruker uansett JS (kalender, søk, kurv).
- **`_headers` har ingen Content-Security-Policy (CSP).** Fila er gjenopprettet med en trygg basisversjon (X-Frame-Options, nosniff, Referrer-Policy, HSTS, Permissions-Policy), men *uten* CSP. En CSP må skreddersys etter Google Calendar/Drive/Fonts og inline-skriptene siden bruker, ellers blokkeres egen funksjonalitet. Kan legges til senere ved behov (krever testing).
- **Bilder lagres som base64 i datafilene.** Mange/store produktbilder gjør `merch-products.js` stor. Admin skalerer ned til maks 900px webp, men mange bilder kan likevel bli tungt. Vurder eksterne bildefiler (`assets/merch/...`) hvis filene blir veldig store. Vil ikke å lagre de eksternt bare gjøre bildene større? -> lagre de i base64 i egen fil?

</details>

---

## To-do

<details>
<summary><b>Åpne to-do-lista</b></summary>

Kritisk:
- [ ] Sjekke at "Legg til fadderukeprogrammet i din kalender" fungerer: iCal og Google Kalender.
- [ ] Revamp av Hero. - ish gjort.
- [ ] Admin bug fix: Drag and drop for sortering i admin er veldig buggy- Første gang man drar fryser det opp + det man drar samsvarer ikke med hvor man slipper det.
- [ ] Admin bug fix: admin har ofte allerde upubliserte endringer når man åpner en opp. Hver gang man lukker/åpner admin burde ting automatisk bli satt til hvordan publiserte versjonen er (sett inn varsel for når man første gang lukker admin siden med en sjekk boks for "ikke vis meg dette varselet igjen")

Medium:
- [ ] Be HF studentrådet om å oppdatere sidene deres og gi oss mer informasjon om hva de faktisk gjør. 
      - [ ] Hva gjør egentlig en PTV, ITV og FTV? 
      - [ ] Hvordan får vi kontakt med våre egne TVer?
- [ ] Legge til side for møtereferat -> Kan tas i egen wiki, muligens. Fylle ut SAK / utvide den kan tas på denne wiki siden.
- [ ] Sammenlign med https://www.mfplacebo.no/

Lav:
- [ ] Full revamp av hvordan hele siden redigeres: mer square space aktig.
      Hva kan ikke gjøres per nå: Endre av logo - Flytte om på seksjoner - Flytte seksjoner mellom sider - Endre alt fra én admin side - Visuell endring direkte i et preview.

Ønsker:
- [ ] Snakke med IFR/NTNU om API for automatisk oppdatering av emner for studiene.
- [ ] Automatisk tema endring av sidene: Jul, 17. mai, påske, halloween, fadderukene, frigjøringsdagen, HMS bursdag (legge dette til i en admin fil, muligens... HMS er gammel) + mulighet til å skru de av, endre bilder, farger osv.

Må gjøres før vi slapper av med å bygge nettsiden:
- [ ] Sjekke at alle admin sider fungerer.
- [ ] Sjekke på nytt hvordan alt oppfører seg på mobil og smalere skjermer.
- [ ] Fjern WIP banneret.

Skjelett Prosjekt:
- [ ] Gjøre om prosjektet til et nytt repo som kan klones og lett gjøres om til andre linjeforeninger.
- [ ] Må lages en readme som sier hva man må gjøre for å starte.

</details>

---

## Domene

- [ ] Vurdere om vi skal få bedre domene.

**NTNU-alternativ (`apeiron.org.ntnu.no`) viser nå til nettsiden**

<details>
<summary><b>Domene-status og priser</b></summary>

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

</details>

---

## Lisens

[MIT License](LICENSE)

```
                                  |
                                 |||
                                |||||
                  |    |    |   |||||||
                 )_)  )_)  )_)   ~|~
                )___))___))___)\  |
               )____)____)_____)\\|
             _____|____|____|_____\\\__
             \                       /
       ~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~
               ~^~  all aboard!  ~^~
       ~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~
```

© 2026 Apeiron Linjeforening
