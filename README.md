# 🌐 Apeiron: Linjeforeningens nettside

Nettsiden for **Apeiron**, linjeforeningen for filosofi og etikk ved NTNU.
Statisk side (HTML/CSS/JS) på Cloudflare Pages, uten byggesteg og uten avhengigheter å installere.
**Vibrasjonskoding har aldri vært så effektivt!**

[![Live](https://img.shields.io/badge/live-apeironlf.pages.dev-2ea44f?style=flat-square)](https://apeironlf.pages.dev)
[![Admin](https://img.shields.io/badge/admin-senteret-d4af37?style=flat-square)](https://apeironlf.pages.dev/admin.html)
[![Lisens](https://img.shields.io/badge/lisens-MIT-blue?style=flat-square)](LICENSE)

---

## 📚 Dokumentasjon

| Dokument | For hvem | Hva det er |
| --- | --- | --- |
| 📖 **README** (du er her) | Styret | Oversikt + **brukerveiledning**: endre innhold via Admin-senteret |
| 🔧 **[VEDLIKEHOLD.md](VEDLIKEHOLD.md)** | Drifter | Teknisk drift: publisering, lokal kjøring, manuell redigering, filstruktur, Apps Script |
| 🗝️ **[docs/eierskap-og-overlevering.template.md](docs/eierskap-og-overlevering.template.md)** | Styret | «Nøkkelknippet»: hvem eier hva + sjekkliste ved styreskifte (mal — den utfylte kopien holdes privat) |
| 🏗️ **[docs/admin-arkitektur.md](docs/admin-arkitektur.md)** | Drifter | Hvordan Admin-senteret er bygd + veikart mot klonbar mal |
| ☁️ **[docs/github-publisering-oppsett.md](docs/github-publisering-oppsett.md)** | Drifter | Engangsoppsett av «Publiser til GitHub» (OAuth + Cloudflare-miljøvariabler) |
| 🛒 **[docs/apps-script-oppsett.md](docs/apps-script-oppsett.md)** | Drifter | Steg-for-steg: merch-bestilling (Google Sheet + Apps Script) |
| ✅ **[TODO.md](TODO.md)** | Begge | To-do-lista og domene-status |
| 📝 **[CHANGELOG.md](CHANGELOG.md)** | Begge | Logg over hva som er gjort |

> 🗺️ `Plan F.html` (lokalt, gitignorert) holder veikartet videre: WYSIWYG-redigering →
> klonbar mal, og en handoff av hvor vi står.

---

## 🧭 Innhold

**For redaktører (styret):**
- [Slik endrer du innhold](#slik-endrer-du-innhold-på-apeiron-nettsiden) — Admin-senteret: redigere og publisere
- [Hva styrer hva](#4-hva-styrer-hva) — hvilket panel som styrer hvilken del av siden
- [Deler som styres utenfor Admin-senteret](#5-deler-som-styres-utenfor-admin-senteret) — arrangementer, fadderuke, galleri

**For utviklere / drift:**
- [Slik er nettsiden bygd (kort)](#slik-er-nettsiden-bygd-kort)
- [Synlighet i søkemotorer og KI](#synlighet-i-søkemotorer-og-ki)
- [Kjente begrensninger og usikkerheter](#kjente-begrensninger-og-usikkerheter)
- [To-do og domene-status → TODO.md](TODO.md)
- [Lisens](#lisens)

---

# Slik endrer du innhold på Apeiron-nettsiden

Alt innhold på nettsiden redigeres **ett sted: Admin-senteret**, rett i nettleseren.
Du trenger ingen programmer, og du skal **aldri åpne eller endre en kodefil**. Du
redigerer i Admin-senteret og trykker **☁ Publiser til GitHub** når endringene skal bli
synlige for alle. Første gang logger du inn med GitHub-kontoen din; etter det husker
nettleseren deg i **30 dager**.

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

Du møter en meny med alle delene av siden du kan endre. Selve redigeringen og
forhåndsvisningen krever **ingen innlogging**, du logger bare inn med GitHub når du
vil **publisere** (knappen øverst til høyre).

---

## 2. Slik redigerer du

1. **Velg en del** i menyen (Nyheter, Forsiden, Styret, Merch …).
2. **Rediger feltene.** En **live forhåndsvisning** ved siden viser hvordan det blir.
3. Det du skriver lever i **din egen nettleser** mens du jobber og vises i
   forhåndsvisningen, men det er **ikke publisert** ennå. Lukker du admin uten å
   publisere, starter den fra den publiserte versjonen neste gang, så **publiser før du
   forlater** (admin minner deg på det hvis du har upubliserte endringer).

De fleste paneler lar deg legge til, slette og **dra for å endre rekkefølge** på kort
(medlemmer, produkter, nyheter osv.), og laste opp bilder ved å klikke på bildefeltet
eller dra et bilde inn.

---

## 3. Slik publiserer du (gjør endringene synlige for alle)

Med GitHub-innlogging publiserer du **rett fra Admin-senteret**, uten filer å laste ned
eller pushe manuelt.

1. **Logg inn** med GitHub-kontoen din, via knappen **☁ Logg inn for å publisere** øverst til
   høyre. (Bare første gang; du holder deg innlogget i **30 dager**.)
2. **Rediger** i panelene som vanlig. Alt vises live i forhåndsvisningen mens du jobber.
3. Trykk **☁ Publiser til GitHub** øverst til høyre. Endringene skrives rett til nettsidens
   repo (én samlet «commit»).
4. Vent ca. ett minutt. Nettsiden oppdaterer seg selv automatisk.

> 💡 **Hvem kan publisere?** Bare GitHub-kontoer som er satt opp med tilgang (se
> [docs/github-publisering-oppsett.md](docs/github-publisering-oppsett.md)). Hver publisering merkes med hvem som gjorde den,
> og toppen viser **«Sist publisert: navn · tidspunkt»**.

> 👥 **Jobber dere flere samtidig?** Har noen andre publisert de samme sidene etter at du
> åpnet admin, varsler admin deg **før** du publiserer, så du ikke uforvarende overskriver
> arbeidet deres. Velg da **«↻ Last inn på nytt»** for å hente deres versjon først.

> 🛟 **Reserveløsning:** skulle publisering svikte, finnes en backup som laster ned filene
> for manuell opplasting til GitHub. Den trenger du normalt ikke. Full framgangsmåte for
> drift står i [VEDLIKEHOLD.md](VEDLIKEHOLD.md).

---

## 4. Hva styrer hva

Hver del i menyen styrer én del av nettsiden:

| Panel | Styrer |
| --- | --- |
| **Forsiden** | Toppbildet, «Om oss»-teksten, FAQ og kontaktinfo på forsiden |
| **Om oss** | Innholdet på Om oss-siden: seksjoner, lys/mørk tone per seksjon, og minimenyen «På denne siden» i toppbanneret |
| **Nyheter** | Kunngjøringer og beskjeder (på forsiden + arkiv på Nyheter-siden) |
| **Oppslagstavla** | Plakatene på oppslagstavla og forside-teaseren |
| **Styret** | Styremedlemmer, portretter og beskrivelse av vervene |
| **Merch** | Produktene i nettbutikken |
| **Begrep** | Begrep-tidsskriftet: utgaver, podkast, film, julekalender |
| **Medlemskap** | Priser, Vipps-nummer og innmeldingssteg |
| **Hjelp** | Hjelp & ressurser-siden |
| **Meny** | Lenkene i hovedmenyen (topp + mobil). Et underpunkt kan òg være en **gruppeoverskrift** («+ Overskrift») for å dele opp en lang nedtrekksmeny |
| **Footer** | Bunnteksten og de sosiale lenkene |
| **Oppnåelser** | Milepæler / oppnåelser |
| **Utmerkelser** | Utmerkelser og priser |

Publiser alt på én gang med **☁ Publiser til GitHub** øverst til høyre.

> 💡 **Hastebeskjed?** En kjapp viktig melding (for eksempel «Aporetisk i kveld er flyttet»)
> legger du ut i **Nyheter**-panelet. Skru på **⚑ Viktig** og velg hvor den skal vises.
> Den dukker opp i «Akkurat nå»-kortet på forsiden.

> 💡 **Hvor mange arrangement i «Akkurat nå»-kortet?** I **Forsiden → Hero** velger du om
> kortet skal vise kun neste arrangement, de neste to eller de neste tre. Arrangementene
> hentes automatisk fra kalenderne — du trenger ikke legge dem inn manuelt.

---

## 5. Deler som styres utenfor Admin-senteret

Noen ting er enda enklere, og de oppdateres helt uten kode, men i et annet verktøy enn
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
   tittelen på bildekortet. Kall den noe gjenkjennelig, f.eks. `Fadderukefest`.
4. **Bildene** legger du helt innerst, rett inni arrangement-mappen.

#### Tre ting som er lett å gjøre feil

- **Bilder må ligge inni en arrangement-mappe.** Løse bilder i en skoleår-mappe (eller i
  hovedmappen) blir hoppet over.
- **Forsidebildet på kortet blir det bildet som kommer først alfabetisk** på filnavn.
  Vil du styre det, gi det et navn som havner først, f.eks. `01.jpg` eller `aaa-forside.jpg`.
- **Nyeste skoleår vises først** av seg selv: `2025/2026` legger seg foran `2024/2025`.

#### Legg til bilder fra et nytt arrangement

1. Åpne den delte hovedmappen i Google Drive (spør styret om lenken).
2. Finn mappen for inneværende skoleår, f.eks. `2025/2026`. Finnes den ikke, lag den.
3. Gå **inn i** skoleår-mappen og lag en ny mappe med navnet på arrangementet.
4. Gå **inn i** arrangement-mappen og last opp bildene dit.
5. Ferdig. Neste gang noen åpner galleriet er bildene der.

> **Viktig om deling:** Hovedmappen og alt inni den må være delt som «Alle med lenken
> kan se». Er en mappe privat, klarer ikke nettsiden å hente bildene. Spør styret hvis
> du er usikker.

---

## 6. Trenger du noe mer avansert?

Lesesalsbildene på forsiden, oppsett av merch-bestilling, hele filstrukturen og hvordan
publiseringen fungerer under panseret. Alt det ligger i
**[VEDLIKEHOLD.md](VEDLIKEHOLD.md)**, ment for de som drifter koden.

> 💡 **Pensum & studieretninger** redigeres nå i **Admin → Pensum**: emnene er gruppert per
> studieretning (Felles · Filosofi · Etikk · Master), og du kan legge til, dele opp eller
> gi nye farger til seksjonene, og fanene og merkene på siden følger automatisk med.

Lurer du på noe som ikke står her, spør styret, den KI-modellen som er best på koding idet du leser dette, eller den som vedlikeholder nettsiden.

---

## Slik er nettsiden bygd (kort)

Statisk side (HTML/CSS/JS), ingen byggesteg. Meny og footer bygges sentralt fra
`nav-content.js` / `site-content.js` via `js/site-chrome.js` og injiseres på alle sider.
Sideinnhold ligger i data-filer (`*-content.js` / `*-config.js`), ikke hardkodet i HTML.

**All redigering skjer i ett samlet Admin-senter (`admin.html`):** et skall som
mounter tynne editor-moduler fra `js/admin/modules/<område>.js`. Modulene deler
`js/admin/admin-common.js` (datalager `createStore`, drag-sortering, hjelpebobler, `saveFile`,
panel-registeret `AdminPanels`) og `css/admin-modules.css` (klasse-scopet stil per modul).
Hver modul har live forhåndsvisning. Redigeringsløkka er
*rediger → **☁ Publiser til GitHub** → Cloudflare bygger (~1 min)*; en nedlastings-backup
finnes for manuell publisering (se [VEDLIKEHOLD.md](VEDLIKEHOLD.md)).
Full arkitekturforklaring: [docs/admin-arkitektur.md](docs/admin-arkitektur.md).

**To redigeringsvisninger (Oversikt → «Panelvisning»):** alle panelene kan vises som
**Liste + detalj**, et delt `js/admin/admin-panel-shell.js` (PanelShell) med en smal, søkbar
navigator + ett skjema om gangen, eller som **Klassisk (Legacy)**, den opprinnelige
visningen med kort i full bredde. Valget lagres i nettleseren. PanelShell gjenbruker
modulenes egne kort-byggere, så all logikk (bilder, lagring, angre, publisering) er felles
mellom visningene. Skallet velger «rail-type» per panel (samlinger / enkeltliste /
status-filter / seksjoner / liste-i-detalj). Global **Ctrl/Cmd+Z** angrer både slettinger
og tillegg.

---

## Synlighet i søkemotorer og KI

Siden er satt opp for å bli funnet i søkemotorer (Google, Bing) og av KI/LLM-er som
søker på vegne av brukere: `robots.txt`, `sitemap.xml`, kanoniske URL-er, delingskort
(`og:`/`twitter:`) og maskinlesbare strukturerte data (JSON-LD) som beskriver hvem
Apeiron er. Alt er usynlig for besøkende og rører ikke admin. Full forklaring + hva som
må vedlikeholdes (særlig: oppdater `sitemap.xml` ved nye sider, og bytt basis-URL ved
nytt domene) står i **[VEDLIKEHOLD.md → Synlighet i søkemotorer og KI (SEO)](VEDLIKEHOLD.md#synlighet-i-søkemotorer-og-ki-seo)**.

---

## Kjente begrensninger og usikkerheter

Ting vi vet om, men er usikre på om det er verdt å gjøre noe med. Ført opp så de ikke glemmes, ikke nødvendigvis feil som må fikses.

<details>
<summary><b>Vis de fire punktene</b></summary>

- **Merch: én farge kan bare kobles til ett bilde.** Har du to bilder av samme farge (f.eks. for- og bakside av samme genser), kan bare det ene knyttes til fargen. Velger man samme farge på bilde nummer to, flyttes koblingen dit. Lite problem i praksis (kunden ser uansett hele galleriet via miniatyrstripa). Å støtte flere bilder pr. farge ville kreve en mer kompleks datamodell.
- **Meny og footer vises et lite øyeblikk etter at siden lastes.** De bygges av `js/site-chrome.js` i nettleseren (for å slippe byggesteg og holde alt i én fil). På treg forbindelse kan man så vidt se at de «popper inn». Menyen er fast posisjonert, så selve innholdet hopper ikke. Alternativet (byggesteg) ble vurdert og valgt bort, se diskusjon i commit-historikk.
- **Footer/meny krever JavaScript.** Med JS avslått vises ikke meny/footer. Gjelder en svært liten andel besøkende; resten av siden bruker uansett JS (kalender, søk, kurv).
- **Bilder lagres som base64 i datafilene.** Mange/store produktbilder gjør `merch-products.js` stor. Admin skalerer ned til maks 900px webp, men mange bilder kan likevel bli tungt. Vurder eksterne bildefiler (`assets/merch/...`) hvis filene blir veldig store (vurdering ligger i [TODO.md](TODO.md)).

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
