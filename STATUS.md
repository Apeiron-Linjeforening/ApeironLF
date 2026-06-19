# Apeiron nettside — Status & Plan

Statisk side (HTML/CSS/JS). Meny bygges sentralt fra `nav-content.js` via
`site-chrome.js`. **All innholdsredigering skjer nå i ett samlet Admin-senter
(`admin.html`):** ett skall + tynne editor-moduler i `admin-modules/`, som deler
`admin-common.js` (datalager, drag-sort, hjelp, toast, saveFile, panel-register
`AdminPanels`) + `admin-common.css`. Ingen innlogging (lokale endringer til du
laster ned og pusher).

## FERDIG

### Klynge C (utvidet) — Samlet Admin-senter (FERDIG, 19.06)
Alle **13** tidligere frittstående `*-admin.html`-paneler er migrert til moduler
i `admin.html` og slettet: medlemskap, footer, hjelp, oppnåelser, utmerkelser,
om-oss, forsiden (index), styret, begrep, oppslag, nyheter, meny, merch.
- **Skall (`admin.html`):** header m/ kontekst «↓ Last ned» + «Se siden», bla-bar
  meny, oversikt (dashboard), og en modul-vert (`#panel-host`) som mounter valgt
  modul inline. Dyp-lenke `#<id>` åpner et panel direkte.
- **Moduler (`admin-modules/<id>.js`):** hver kaller `AdminPanels.define(id, {title,
  see, exportName, mount(host, AC)})`. `mount` bygger editoren i `host` og
  returnerer `{ export, destroy }`. `destroy` rydder lyttere/modaler ved bytte.
- **Felles byggeklosser i `admin-common.js`:** `createStore(lsKey, freshFn)`
  (utkast-lager: auto-lagre, `save/lazySave/reset`), `esc`, `enhanceHelp`,
  `enableDragSort`, `saveFile`, `toast`, og registeret `AdminPanels`.
- **Per-modul CSS** i `admin-modules.css`, klasse-scopet (`.mod-meny`, `.mod-merch` …).
- **Flash-bug fikset:** «Logg inn»-gaten nøytralisert ved kilden i alle sider.
- Meny-modulen beholder dobbel live-preview (desktop nav + mobil-skuff via srcdoc),
  angre/gjør-om og stedvelger; merch-modulen beholder galleri m/ crop/zoom/rotasjon,
  farge-bilde-kobling, badges og fargekontroller; nyheter beholder per-sone-beskjeder.
- **Doc:** `docs/admin-arkitektur.md` beskriver skall+modul-mønsteret og veikartet
  videre (git-CMS → klonbar mal).

### Oppslagstavla-admin forbedringer (18.06)
- **📍 Stedvelger** på lenke-feltet — popover med søkbar side/seksjons-liste (same as `meny-admin`).
- **● Aktiv / ✓ Ferdig-toggle** per plakat: arkiverte plakater vises i ny `#tidligere-oppslag`-seksjon på `oppslagstavla.html` (dempet), men ikke på forsideteaser. Eksporteres som `done: true/false` i `oppslag-content.js`.
- **Bilderediger:** ↻ roter (90°) og ⛶ beskjær/zoom (dra + glidebryter + scrollhjul) på plakatbildet — identisk `merch-admin`-mekanikk.
- **Live-preview-fiks:** `IS_PREVIEW` sjekker `window.self !== window.top` — previewen oppdateres sanntid.
- **localStorage-sync:** `oppslagstavla.html` og `index.html` leser admin-utkastet fra localStorage ved direkte besøk.

### Forsideforbedrener (18.06)
- **Hero CTA #2** peker til `#oppslagstavla-teaser` (var `#arrangementer`).
- **Seksjonspaddingen** redusert: `.section` 104→64 px, `section--tight` 76→48 px, mobil 72→44 px.
- **Arrangementer-seksjonen** mørk navy med lys tekst (identisk mønster som `.fadder`). Re-tokenisert i marine-modus.
- **Oppslagstavla-teaser** bruker `OPPSLAG_CONTENT.intro.heading/lede` fra admin.
- **`index-admin.html`** «Se hjem»: `target="_blank"` fjernet.

### Informasjonsarkitektur (18.06) — «Hjem» + ny «Om oss»-side
Forsiden er lagt om til **nytte-først «Hjem»**, og «bli kjent»-innholdet er flyttet til ny **`om-oss.html`**.
- **Flyttet til `om-oss.html`:** Hva er Apeiron (`#om`), Fellesskap & samarbeid (`#samarbeid`), Lesesalen (`#lesesalen` + lightbox), full FAQ (`#faq`) og en utfyllende «Bli medlem» (`#bli-medlem`).
- **Hjem beholder:** hero (m/ bro «Ny her? Bli kjent med Apeiron →»), Oppslagstavla (løftet helt opp), Arrangementer, Aporetisk, Fadderuke, **kompakt** Bli medlem, Kontakt + **kort** FAQ (3 + lenke til Om oss).
- **Redigering (én admin per side):** Hjem (hero + kontakt + kort FAQ `kontakt.faq`) ligger i `index-content.js` + `apeiron-index.js`, redigeres i `index-admin.html`. Om oss (om + full faq) ligger i `om-content.js` + `apeiron-om.js`, redigeres i `om-oss-admin.html`. Hver admin har egen live-preview (vist i ekte proporsjoner, skalert til å fitte i bredden); krysslenket i topplinja.
- **Meny (`nav-content.js`):** «Hjem» først; «Studiene» foldet inn under «Om oss»-nedtrekket; nytte-først rekkefølge. Repekt anker i footer (`site-content.js`), søk (`site-search.js`, gruppe «Om oss») og `PAGE_SECTIONS` i `meny-admin.html`.

### Klynge A — Meny (komplett)
- **A1** Meny som data: `nav-content.js` (`window.SITE_NAV`) leses av `site-chrome.js` (header + mobil-skuff).
- **A2** Mobilmeny fikset: accordion-CSS i `styles.css` (`.drawer__sec/-head/-body`), burger virker på alle sider (fjernet duplisert handler i subpages), lukke-kryss hevet over nav (z-1001).
- **A3** «Hjelp» → «Hjelp & støtte».
- **A5** Adresse-velger: 📍-knapp ved hvert adressefelt i `meny-admin.html` åpner søkbar popover over sider + seksjoner med lesbare navn (kuratert `PAGE_SECTIONS`, beriket live fra sidene via fetch). Klikk fyller `side.html#anker` og trigger lazySave. Gjelder topp- og underpunkter.
- **A4** `meny-admin.html` — GUI for menyen:
  - Nøstet redigering (toppnivå + underpunkter), dra-sortering på begge nivåer.
  - Synlighet per punkt: begge / kun mobil (`drawerOnly`) / kun desktop (`desktopOnly`).
  - Live forhåndsvisning med ekte `styles.css` + `site-chrome.js` (pilot for Klynge C).
  - Desktop-preview = sticky stripe i full bredde øverst; nedtrekksmenyer vises ved hover (iframe vokser). Mobil-preview = fast sidepanel til høyre.
  - Eksporterer `nav-content.js`.

### Andre menyforbedringer
- Apeiron-merke (logo + navn) øverst i hamburgermenyen.
- Lys/mørk-knapp flyttet inn i hamburgermenyen på mobil (skjult i topplinja der). Drives av `[data-color-toggle]` i `theme.js`.
- Desktop-menylinja: **innholdsbasert kollaps** — `site-chrome.js` måler bredde og bytter til burger automatisk når lenker ikke får plass (uansett antall punkter). 1120px media-query som fallback.
- Menytekst venstrejustert; lenker hugger logoen, søk/modus til høyre.
- **Plassering på linja**: `SITE_NAV_CONFIG = { align }` (0=venstre, 50=sentrert, 100=høyre). Styres i meny-admin med 3 presets + dra-slider med hakk (steg 5). Bruker to flex-spacers rundt `.nav__links`.
- **Angre/Gjør om** i meny-admin: knapper + Ctrl/Cmd+Z / +Shift+Z. Historikk (100 steg) dekker tekst, rekkefølge, underpunkter, plassering.

### Klynge B — Heder (B1 + B2 ferdig)
- **B1** Utmerkelser (personer): `utmerkelser.html` + `utmerkelser-content.js` (`window.UTMERKELSER_CONTENT`) + `utmerkelser-admin.html`. Personkort (portrett/initialer, navn, utmerkelse, år, beskrivelse) i et grid, palette-fargestripe per kort. Seedet med 3 eksempel-maler (bytt ut i admin).
- **B2** Oppnåelser (premier): `oppnaelser.html` + `oppnaelser-content.js` (`window.OPPNAELSER_CONTENT`) + `oppnaelser-admin.html`. Premiekort med plakat/diplom-bilde (landskap), merke/resultat-badge, tildelt av, år, beskrivelse. Seedet med Volleyballcup 2026-sølv (ekte bilde) + Dionysos «best oppmøte».
- Begge admin gjenbruker `admin-common.js` (auth, drag-sort, toast, saveFile) + `palette.js` (createColorControl/paletteStyleVars) — samme mønster som styret-admin.
- **Meny:** ny **«Heder»**-nedtrekksmeny i `nav-content.js` (Utmerkelser + Oppnåelser). Justerbar i meny-admin. Også lagt til i footer (`site-content.js`) og søk (`site-search.js`, ny gruppe «Heder» m/ikon + GROUP_ORDER).

## NESTE (uferdig)
Klynge A + B1/B2 ferdig, **C1 ferdig**, **D2 ferdig** (Begrep «Trykt versjon»-tema),
**D1 ferdig** (Oppslagstavla — alternativ 3, plakat-tavle), **C3 Trinn 1 ferdig**
(Forside-admin for hero/om/FAQ/kontakt), og **B4 ferdig** (Logikk Panikk + Logikk Drikk lagt på oppslagstavla).
Neste: **B3** (møtereferat) etter avklaring, deretter **F1** (resterende statisk tekst redigerbar). Se `Plan F.html` for hele Klynge F-veikartet.

### B4 — Logikk Panikk (FERDIG — via oppslagstavla)
Brukeren ombestemte seg: i stedet for en egen forside-seksjon ligger Logikk Panikk og Logikk Drikk
nå som **plakater på Oppslagstavla** (`oppslag-content.js`). Begge plakatbildene i `assets/logikk-panikk/`.
- «Logikk Drikk» (årets siste, Den gode nabo, 25.05) + «Logikk Panikk» (hver mandag 14–16, Loftet på Låven).
- Seed-plakat «Symposion» fjernet; «Fadderuke 2026» flyttet ett hakk fram. Videre redigering i `oppslagstavla-admin.html`.
- Den tidligere påbegynte forside-seksjonen (`#logikk-panikk`) ble **rullet tilbake** (index.html, index-content.js,
  apeiron-index.js, index-admin.html, styles.css, samt meny/footer/søk).

### C3 — Forside-admin (Trinn 1 FERDIG)
Forsiden følger nå samme content+admin+preview-mønster som de andre sidene, men kun for
TEKST-delene som faktisk endres ofte (planens anbefaling: ikke hele siden på en gang).
- `index-content.js` (`window.INDEX_CONTENT`) holder: **hero** (eyebrow, undertittel, ingress,
  to knapper m/lenke, «under oppbygging»-banner m/på-av), **om oss** (gresk ord + uttale, avsnitt-liste,
  timeglass-kort, samarbeids-teaser, nøkkeltall-liste), **FAQ** (seksjonsoverskrift + spørsmål/svar-liste),
  **kontakt** (e-post, adresse, nettside).
- `apeiron-index.js` gjengir disse fra INDEX_CONTENT (lastes FØR app.js så FAQ-accordion + stat-tellere
  finner ferdig DOM), og lytter etter `apeiron-index-preview` i `?preview=1`-modus. Fallback: HTML-en
  i index.html beholdes hvis et felt mangler.
- `index-admin.html` — panel m/ live preview (`index.html?preview=1`), samme C1-mønster. List-redigerere
  (dra-sorter/legg til/slett) for avsnitt, nøkkeltall og FAQ; av/på-bryter for WIP-banneret; hopp-knapper
  til seksjoner i previewen. Eksporterer `index-content.js`. Admin-passord delt (admin-common).
- **Kontakt-lenker (sosiale/medier):** `kontakt.socials[]` (label/href/icon) er nå redigerbare i admin —
  legg til/fjern/dra-sorter med **ikonvalg** fra det delte settet `footer-icons.js` (`FOOTER_ICONS` +
  `FOOTER_ICON_LABELS`: instagram, facebook, youtube, tiktok, discord, linkedin, x, github, email, web).
  `apeiron-index.js` rendrer dem inn i `#ix-k-socials` med `currentColor`-ikoner (gull, hover→navy).
- **Live-preview-fiks:** `lazySave()` pusher nå til previewen UMIDDELBART (ikke kun via 300 ms debounce),
  så endringer vises ved hvert tastetrykk. (Tidligere virket det, men med merkbar forsinkelse.)
- **STYRES IKKE av dette panelet** (med vilje): arrangementer/aporetisk/fadder (Google Kalender),
  nyhetsstriper (Sheet), oppslagstavla (oppslag-content.js), bli-medlem priser/steg (membership-config.js).
- **Trinn 2 (gjenstår):** resterende statisk forside-tekst — hero-tittel «Apeiron», om-overskriften
  «Hva er apeiron?», bli-medlem fordeler/overskrift, og seksjonsoverskriftene på Arrangementer/Lesesalen/
  Samarbeid. (Kontakt-lenkene er nå ferdige, se over.)
- **Brukerens mål videre — «Squarespace-nivå»:** hver admin-side skal til slutt være fullt tilpassbar.
  Konkrete neste steg mot det: (a) **«Fellesskap & samarbeid»** (#samarbeid, 3 ally-kort) som redigerbar
  liste i index-admin; (b) **legge til / fjerne / sortere hele seksjoner** — største arkitektur-steget
  (seksjonstyper, synlighet av/på, rekkefølge), tas som egen økt.

### D1 — Oppslagstavla (plakat-tavle, FERDIG — alternativ 3)
Dedikert plakat-system etter samme mønster som B1/B2 + C1-preview:
- `oppslagstavla.html` + `oppslag-content.js` (`window.OPPSLAG_CONTENT`) + `oppslagstavla-admin.html`.
- Plakatkort på en mørk «filttavle» (`.board`/`.poster` i `styles.css`, modus-uavhengig): messing-pin,
  lett rotasjon, CSS-columns-masonry (naturlig bildehøyde), retter seg opp + løftes ved hover.
  Tom plakat = typografisk plassholder («bilde kommer»). Felt: tittel, dato (fritekst), undertekst,
  lenke + lenketekst, pin-farge (palette).
- **Forside-teaser:** ny seksjon `#oppslagstavla-teaser` i `index.html` viser de 6 nyeste plakatene
  + «Se hele oppslagstavla»-knapp (laster `palette.js` + `oppslag-content.js` + inline render). Skjuler
  seg selv hvis ingen plakater.
- **Live preview** i admin: `oppslagstavla.html?preview=1`, melding `apeiron-oppslag-preview` — samme
  C1-mønster (ingen CSS gjenskapt).
- **Meny/footer/søk:** «Oppslagstavla» lagt til under Arrangementer-nedtrekket (`nav-content.js`),
  i footer (`site-content.js`) og i søkeindeksen (`site-search.js`, Startside-gruppe).
- Seedet med 3 plassholder-plakater (Aporetisk Aften, Symposion, Fadderuke 2026) — bytt ut i admin
  når ekte plakatbilder kommer. Bildelagring: webp, maks 1200px (plakat-tekst leselig).

### D2 — Begrep-tema «Trykt versjon» (FERDIG)
`begrep.html` har nå en utgave-bryter som erstatter mørk-modus KUN på denne siden.
- Token-refaktor: alle `rgba(240,236,224,X)`-literaler → `rgba(var(--bg-fg-rgb),X)`, og side-tekst-bruk av `var(--bg-paper)` → ny `var(--bg-fg)`. `--bg-paper` beholdes som konstant lys for tekst på mettede farger (CTA/badges).
- `html[data-begrep-mode="print"]` flipper bakgrunns- og tekst-tokens til pergament/blekk; alt annet (kanter, dempet tekst, strekkode-motiv) flippes automatisk via tokenene.
- Re-pin på `.bg-cta` (vinrød) og `.bg-film-card__media` (mørk film-still) holder lys tekst i begge moduser.
- Bryteren gjenbruker site-chrome sin `[data-color-toggle]`-knapp (header + skuff); JS i `begrep.html` bytter ikon (bok ⇄ skjerm) + label («Trykt versjon» / «Digital versjon»), husker valg i `localStorage['begrepEdition']`, og blokkerende `<head>`-script setter `data-begrep-mode` før paint (ingen FOUC). `theme.js` lastes IKKE på begrep — bryteren er helautonom og påvirker ingen andre sider.

### Klynge C — Live forhåndsvisning (C1 FERDIG)
Alle fire in-innholds-paneler viser nå den **ekte** offentlige siden live i en nedskalert
iframe (`side.html?preview=1`). Mønsteret er identisk: siden pakker render-koden i en
re-kjørbar funksjon, lytter etter `postMessage({type:'apeiron-<side>-preview', content})`
og re-renderer; admin sender hele `data` ved hver `saveData()` (debounced) + ved ready/reset,
og skalerer iframen med `fitPreview()`. Ingen CSS er re-implementert — previewen følger
automatisk med på designendringer.
- **merch-admin:** `merch.html?preview=1`, melding `apeiron-merch-preview` (products + info).
- **styret-admin:** `styret.html?preview=1`, melding `apeiron-styret-preview` (content).
- **begrep-admin:** `begrep.html?preview=1`, melding `apeiron-begrep-preview` (content).
- **hjelp-admin:** `hjelp.html?preview=1`, melding `apeiron-hjelp-preview` (content).
- Sidene legger `is-preview`-klasse på `<html>` ved `?preview` (reservert for evt. fremtidig
  krom-skjuling) og tvinger `.reveal`-elementer til `.in` så alt vises uten scroll.

<details><summary>A5-detaljer (ferdig)</summary>

**Mål:** folk skal slippe å gjette ankre (som `#bli-medlem`).

**Design:**
- Bygg et `PAGE_SECTIONS`-kart: side → [{ anker, lesbart navn }]. Hardkodet
  reserveliste i admin, men hent helst seksjonene live fra sidene (`<section id>` +
  nærmeste overskrift) så lista holder seg oppdatert.
- Liten popover/dropdown ved feltet, søkbar; klikk fyller `href` og trigger lazySave.
- Gjelder både toppnivå- og underpunkt-felter.

**Hvor jeg stoppet:** Rakk å hente ALLE eksisterende `<section id>` fra alle sider
(grep er kjørt — dataene finnes i samtalen) og fant `HREF_HELP`-konstanten i
meny-admin (~linje 402) der hjelpeteksten ligger. **Ingen kode er skrevet enda** —
neste steg er å bygge `PAGE_SECTIONS` + popover-UI og koble den på adressefeltene.

### Kjente ankre per side (råmateriale for PAGE_SECTIONS)
- index.html: #top, #om, (studiet/FAQ/kontakt/bli-medlem m.fl. — verifiser navn i index.html)
- Subpages har typisk #top + egne seksjoner. Kjør grep `<section ... id="..."` på nytt ved bygging for fasit.

</details>

## GJENSTÅR (fra opprinnelig plan, se PLAN.html)
- **B3** Møtereferat-side som henter PDF-er fra Google Disk + admin.
- **B4** Logikk Panikk — **FERDIG** (via oppslagstavla). Logikk Panikk + Logikk Drikk lagt inn som plakater i
  `oppslag-content.js` (begge plakatbildene i `assets/logikk-panikk/`); «Symposion» fjernet, «Fadderuke 2026»
  flyttet ett hakk fram. Tidligere forside-seksjon rullet tilbake. Se B4-seksjon over.
- **C1** Live forhåndsvisning i admin-paneler — **FERDIG** (merch + styret + begrep + hjelp).
- **C3** index-admin (størst, tas sist, i to trinn) — **TRINN 1 FERDIG** (hero/om/FAQ/kontakt-tekst,
  se C3-seksjon over). Trinn 2 (resterende statisk forside-tekst) gjenstår.
- **D1** Bedre visning av arrangement/plakater/nyheter — **FERDIG** (Oppslagstavla, alternativ 3). Alt. 4 (samlet «Hva skjer»-side) gjenstår som valgfritt senere steg.
- **D2** Begrep-tema-knapp — **FERDIG** («Trykt versjon» pergament/avispapir-tema, se over).

## ÅPNE SPØRSMÅL TIL BRUKER
- D1: bygget som alt. 3 (oppslagstavle). Vil du ha alt. 4 (samlet «Hva skjer»-side) senere, eller heller holde det enkelt?
- D2: «Trykt versjon»-tema eller tema basert på én bestemt Begrep-utgave?
- B3: manuell liste over referater, eller auto-speiling av hel Disk-mappe?
- B1/B2: dele én meny-plass eller to separate toppnivå-punkter?

## NØKKELFILER
- `admin.html` — **Admin-senter** (skall: meny + oversikt + modul-vert)
- `admin-modules/` — én editor-modul per område (`meny.js`, `merch.js`, `styret.js` …)
- `admin-common.js` / `.css` — delt admin (datalager/`createStore`, drag, hjelp, toast, saveFile, `AdminPanels`-register)
- `admin-modules.css` — per-modul CSS (klasse-scopet)
- `docs/admin-arkitektur.md` — skall+modul-arkitektur + veikart (git-CMS → klonbar mal)
- `nav-content.js` — meny-data + `SITE_NAV_CONFIG`
- `site-chrome.js` — bygger meny/skuff/footer, kollaps, align
- `styles.css` — nav + drawer (`.nav`, `.drawer__*`)
- `theme.js` — lys/mørk via `[data-color-toggle]`
- `utmerkelser.html` / `-content.js` — B1 (heder: personer)
- `oppnaelser.html` / `-content.js` — B2 (heder: premier)
- `oppslagstavla.html` / `oppslag-content.js` — D1 (plakat-tavle)
- `index-content.js` / `apeiron-index.js` — Hjem (hero + kontakt)
- `om-content.js` / `apeiron-om.js` — Om oss («Hva er apeiron?» + FAQ)
- `om-oss.html` — Om oss-side (Om oss + Samarbeid + Lesesalen + Møt styret + FAQ + Bli medlem)
- `Plan F.html` — fremtidsplan for Klynge F (F1–F5)
