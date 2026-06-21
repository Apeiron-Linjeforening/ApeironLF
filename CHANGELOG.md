## Siste endringer

**21.06.26 — G1 bygd: «Lagre = commit» (publiser rett til GitHub fra admin)**
- **«☁ Publiser til GitHub»** i admin committer alle endrede data-filer som ÉN commit til `main` — ingen nedlasting, ingen manuell push. Fortsatt 100 % statisk og gratis. **↓ Last ned alle endrede** beholdt som reserve.
- **Ekte innlogging (path B), server-løst på Cloudflare Pages Functions:** GitHub OAuth web-flow. Nye funksjoner under `functions/api/github/`: `login`, `callback`, `me`, `commit`, `logout` (+ `_common.js`). Tokenet lagres i en **httpOnly/Secure/SameSite=Lax-cookie** — når aldri nettleser-JS; alle commits går via `commit`-funksjonen (Git Data API: blob → tree → commit → ref, atomisk). `ALLOWED_LOGINS` begrenser hvem som kan publisere.
- **Additivt og trygt for main-admin:** ny klient `admin-github.js` + en capture-sink i `admin-common.js` (`beginCapture`/`endCapture`) som lar «publiser» fange nøyaktig de samme filene modulenes `export()` ellers laster ned (tekst + binære bilder via base64). Eksisterende nedlastingsflyt er urørt; ingen modul endret.
- **Oppsett kreves én gang** (GitHub OAuth-app + Cloudflare-miljøvariabler) — se `docs/g1-oppsett.md`. Virker kun på den deployede siden (funksjonene kjører på Cloudflare, ikke lokalt).
- Verifisert lokalt: admin laster rent, logger inn-knapp vises, nedlastingsflyt intakt, ingen konsollfeil. Selve OAuth/commit må testes på Cloudflare-deploy med variablene satt.
- Nye filer: `functions/api/github/{_common,login,callback,me,commit,logout}.js`, `admin-github.js`, `docs/g1-oppsett.md`. Endret: `admin-common.js`, `admin.html`.

**21.06.26 — Page Builder: presis live-preview (slutt på flimmer ved fargebytte)**
- **Problem:** previewen bygde HELE siden om ved hver minste endring — også fargebytte — så det flimret, scrollen hoppet, og Lesesalen-bildene ble lastet på nytt hver gang. Fargeredigering føltes ødelagt.
- **Fix:** motoren fikk to inkrementelle metoder — `PageEngine.applyTones()` (oppdaterer kun `data-tone` på seksjonene) og `PageEngine.renderSection()` (tegner kun ÉN seksjon om). `om-oss.html` lytter nå på tre meldinger: `apeiron-page-tone` (fargebytte → kun attributt, myk CSS-overgang), `apeiron-section-update` (tekstredigering → kun den redigerte seksjonen), og `apeiron-page-preview` (struktur: legg til/fjern/sorter → full tegning). Admin-byggeren sender riktig type per handling.
- **Resultat:** fargebytte er nå momentant og uten ombygging; tekstendring tegner bare sin egen seksjon, så resten av siden (scroll-posisjon, Lesesalen-bilder) står helt i ro. Verifisert med probe-attributter: tone-klikk lar nabo-seksjoner stå urørt; tekstedit rører bare egen seksjon.
- Berørte filer: `section-engine.js`, `om-oss.html`, `admin-modules/om-oss.js`.

**21.06.26 — Page Builder G2: tone-system + ny seksjonsbygger i admin**
- **Tonen driver nå bakgrunnen.** Nytt tone-lag i `styles.css` (scopet til `#page` så bare motor-tegnede sider påvirkes — `index.html` o.l. er urørt): `paper` (lys), `navy` (mørk, med mørk kort-variant), `accent` (maroon). `auto` veksler lys/mørk ut fra posisjon så rytmen aldri brekker når seksjoner flyttes. Om oss-rytmen er nå lys → mørk → lys → mørk → maroon → lys (bli-medlem pinnet `accent`).
- **Ny admin-bygger (`admin-modules/om-oss.js` skrevet om, PAGE-native).** Erstatter den gamle OM_CONTENT-editoren. Øverst en **seksjonsbygger**: dra for å sortere, **tone-velger** per seksjon (Auto/Lys/Mørk/Aksent), **+ Ny seksjon** (type-velger), og slett — med en **rytme-vakt** som varsler når to like, pinnede toner havner ved siden av hverandre. Topp-banneret er pinnet. Under bygger­en: ett innholds-panel per seksjon, felter etter type, bundet til `section.props`. Eksporterer **`om.page.js`**, live-preview via `apeiron-page-preview`.
- `membership.js` eksponerer nå `window.renderMembership` så medlemskortet fylles på nytt når motoren re-tegner siden (live-preview). `admin.html` laster `section-engine.js` + `om-sections.js` + `om.page.js` (i stedet for `om-content.js`); Om oss-panelets lagringsnøkkel er `apeiron-om-page-v1`.
- **Slettet** (erstattet, ikke lenger lastet noe sted): `om-content.js`, `apeiron-om.js`.
- Verifisert: bygger viser 7 seksjoner m/ riktige toner, banner pinnet; tone-bytte gir rytme-vakt; «+ Ny seksjon» legger til; live-preview oppdaterer seksjonsantall/tittel/tone og beholder medlemskortet. Berørte filer: `styles.css`, `admin-modules/om-oss.js`, `admin-modules.css`, `admin.html`, `membership.js`, `om.page.js`.

**21.06.26 — Page Builder G1: motoren bygd, Om oss tegnes nå HELT fra data**
- **Retningen er lagt om** (etter designforslaget): en side er ikke lenger fast HTML, men en **ordnet liste av typede seksjoner** som en felles motor tegner. Dette er arkitekturen som gjør prosjektet til en ekte, klonbar sidebygger.
- **Ny motor — `section-engine.js`:** `SectionTypes.define/get/has/list/defaults` (register for seksjonstyper) + `PageEngine.render(page, el, opts)` som filtrerer på `enabled`, regner ut **auto-tone** (veksler lys/mørk så rytmen aldri brekker) og kjører `mount()`-hooks. `PageEngine.toneClashes()` finner naboer med lik pinnet tone (grunnlag for admin-vakt neste steg).
- **Kjernetyper — `om-sections.js`:** `banner`, `about`, `cardgrid`, `lesesal`, `join`, `faq`. Hver `render()` gjenskaper dagens markup/klasser 1:1 (parity), og eier sin egen `defaults`/`mount`. Lesesalens galleri + lightbox er flyttet fra inline-script til typens `mount()`.
- **Siden som data — `om.page.js`:** hele Om oss som `sections: [{ id, type, tone, props }]`. `om-oss.html` er slanket til `<main id="page"></main>` + motor-bootstrap; scriptene er omordnet så motoren tegner FØR `membership.js`/`app.js`, slik at `#joinTiers`/`#joinSteps`, `.reveal` og `.faq__q` finnes når de kobler seg på.
- **Verifisert:** 7 seksjoner tegnet fra data, alle kort/punkter/FAQ/nøkkeltall til stede, medlemskortet fylt, tone-veksling korrekt, ingen konsollfeil. Visuelt identisk med forrige Om oss.
- **Merk (midlertidig):** det gamle **Admin → Om oss**-panelet skriver fortsatt `om-content.js` (gammelt format) og får ikke live-preview mot den nye motoren. Innhold redigeres i `om.page.js` inntil det nye seksjons-baserte panelet er bygd (neste steg). `apeiron-om.js` + `om-content.js` lastes ikke lenger av `om-oss.html`, men beholdes til admin er flyttet over.
- Nye filer: `section-engine.js`, `om-sections.js`, `om.page.js`. Endret: `om-oss.html`.

**21.06.26 — F3 (pilot): dra-sortér seksjoner — Om oss**
- Bygger rett på F2-lista. **Seksjons-rekkefølgen er nå redigerbar**: Seksjoner-panelet i Admin → Om oss fikk dra-håndtak (⠿) på hver rad (`AdminCommon.enableDragSort`, samme mønster som meny/oppslag/styret). Rekkefølgen lagres i `sections`-lista.
- `applySections()` i `apeiron-om.js` ble utvidet: i tillegg til vis/skjul flytter den nå de styrte seksjonene til **listerekkefølge** i DOM-en (reinnsettes rett etter topp-banneret). Idempotent — flytter bare når noe faktisk er ute av rekkefølge, så ekte side (standardrekkefølge) er en no-op.
- Verifisert: omsortering i admin speiles umiddelbart i live-preview (DOM-rekkefølge endres), samtidig som av/på fortsatt virker. Berørte filer: `apeiron-om.js`, `admin-modules/om-oss.js`.

**21.06.26 — F2 (pilot): seksjoner av/på som data — Om oss**
- **Seksjoner er nå data, ikke fast HTML.** Om oss fikk en ordnet `sections`-liste i `om-content.js` (`{ id, label, enabled }`, der `id` = seksjonens DOM-anker). `apeiron-om.js` har en ny `applySections()` som vises/skjuler hver seksjon ut fra `enabled` — kjøres i `renderOm()`, så både ekte side og live-preview følger med.
- **Admin → Om oss** fikk et nytt **Seksjoner**-panel øverst med av/på-bryter per seksjon (gjenbruker `.toggle-row`/`.switch`-stilen fra Forsiden, utvidet til `.mod-om-oss`). Topp-banneret er alltid på. En `mergeSections()` slår lagret liste sammen med kanon: bevarer rekkefølge + valg, reparerer etiketter, legger til manglende og dropper ukjente id-er — robust mot fremtidige endringer. Eksporten skriver `sections` først i `om-content.js`.
- **Lista er bevisst ordnet** så F3 (dra-sortering) blir en liten påbygging: sorter `sections` + rendre seksjonene i den rekkefølgen. **«+ Ny seksjon»** (legge til helt nye) er et separat, større steg senere.
- Verifisert: alle 6 seksjoner synlige som før på ekte side; av-bryter i admin skjuler seksjonen umiddelbart i live-preview. Berørte filer: `om-content.js`, `apeiron-om.js`, `admin-modules/om-oss.js`, `admin-modules.css`.

**21.06.26 — F1 FERDIG: «Tilbake»-lenkene er nå redigerbare — all redaksjonell tekst er data-drevet**
- De siste hardkodede «Tilbake»-lenkene er flyttet til data. **Utmerkelser**, **Oppnåelser** og **Oppslagstavla** fikk `intro.back` + `intro.backHref` i sine content-filer; sidene leser dem inn (`#intro-back`), og panelene fikk «Tilbake-tekst» + «Tilbake-lenke» i topp-banner-feltene. **Hjelp** hadde dette fra før (`hero.back`/`hero.backHref`).
- Berørte filer: `utmerkelser-content.js`, `oppnaelser-content.js`, `oppslag-content.js`, `utmerkelser.html`, `oppnaelser.html`, `oppslagstavla.html`, `admin-modules/utmerkelser.js`, `admin-modules/oppnaelser.js`, `admin-modules/oppslag.js`.
- **Med dette er F1 helt i mål:** ingen redaksjonell tekst på noen side er lenger hardkodet — alt redigeres i admin. Neste: F2 (seksjoner av/på som data).

**21.06.26 — S1: Oppgradert søkemotor (MiniSearch + norsk bøyning + skrivefeil)**
- **Selve match-motoren er byttet.** Søket brukte enkel delstreng-scoring uten bøyning eller feiltoleranse («søke» fant ikke «søk», én skrivefeil ga null treff). Nå kjører det på **MiniSearch** med en **norsk Snowball-stemmer** (bøyning: «studieretninger» → «studieretning», «filosofien» → «filosofi») og **fuzzy-treff** (skrivefeil: «filosfi» → «filosofi», «aporetsik» → «Aporetisk Aften»).
- **Vendet inn, ingen CDN:** biblioteket ligger som `minisearch.min.js` (MiniSearch v7, MIT) i repoet og lastes på alle 14 offentlige sider **før** `site-search.js` (rett etter `search-index.js`). Fortsatt gratis, statisk, uten server — og virker offline / ved kloning.
- **Datakilden er urørt:** kun `score()`/`doSearch()` i `site-search.js` ble byttet. `search-base.js`, modulenes `searchEntries()` og auto-genereringen ved «Publiser» står som før. Indeksen bygges i nettleseren fra `search-index.js` ved hver sidelast, så nytt publisert innhold er automatisk søkbart. Highlighting er nå stamme-bevisst (markerer også bøyde treff). Faller automatisk tilbake til den gamle delstreng-scoringen hvis biblioteket ikke laster.
- **Uregelmessige ord** stemmeren bommer på (f.eks. `bøker → bok`) håndteres av en liten `SYN`-liste øverst i `site-search.js`. Prøvebenk brukt til å velge motor: `Søk-spike — MiniSearch.html`. Berørte filer: `site-search.js`, `minisearch.min.js` (ny), alle 14 offentlige `*.html`, `VEDLIKEHOLD.md`, `Plan F.html`.

**21.06.26 — F1: Merch topp-banner redigerbart — F1 dekker nå alle sidene**
- **Merch** (`merch.html`) fikk topp-banneret (tilbake-lenke, tittel, ingress) flyttet til data (`window.MERCH_SUBHERO` i `merch-products.js`) og redigerbart i Merch-panelet, ved siden av info-teksten. Eksporten skriver nå `MERCH_SUBHERO` + `MERCH_INFO` + `MERCH_PRODUCTS`, og live-forhåndsvisningen oppdaterer banneret. Ny draft-nøkkel `apeiron-merch-subhero-v1` lagt til i panelets `ls`.
- **Med dette er F1 (gjøre all redaksjonell tekst redigerbar) gjennomført for alle sidene** — forsiden (inkl. ordmerket), Om oss, Nyheter, Styret, Merch, Pensum, Galleri, Pensum-markedet, samt sidene som var data-drevet fra før (Oppslagstavla, Utmerkelser, Hjelp, Oppnåelser, Begrep). Gjenstår kun «Tilbake»-lenkene på et fåtall allerede-data-drevne sider (lav verdi).

**21.06.26 — F1: topp-bannere på Nyheter og Styret er nå redigerbare**
- **Nyheter** (`nyheter.html`) og **Styret** (`styret.html`) fikk topp-banneret (tilbake-lenke, tittel, ingress) flyttet til data og redigerbart i sine admin-paneler (`subhero` i `news-content.js` / `styret-content.js`). Nyheter-eksporten ble samtidig fikset så den tar med `subhero` (skrev tidligere bare `items`). Sidene ser uendret ut.

**21.06.26 — F1: hero-ordmerket «Apeiron» er nå redigerbart**
- **Foreningsnavnet** øverst på forsiden (det store «Apeiron» med ∞-stilet o) er flyttet til data (`index-content.js` → `hero.wordmark` = pre/mid/post) og redigeres i **Admin → Forsiden → Hero**: «Tittel (før)», «Spesial-bokstav» (får ∞-stilen — kan stå tom) og «Tittel (etter)». Det gjør at en annen forening kan sette sitt eget navn uten å røre HTML-en — et nøkkelsteg mot den klonbare malen. Gjengis av `apeiron-index.js`; ser identisk ut. Berørte filer: `index-content.js`, `index.html`, `apeiron-index.js`, `admin-modules/forsiden.js`.

**21.06.26 — F1: Pensum + Galleri er nå redigerbare**
- **Pensum (nytt panel).** Hele `pensum.html` er flyttet 1:1 til `pensum-content.js` (gjengis av `apeiron-pensum.js`) og redigeres i et nytt **Admin → Pensum**-panel: topp-banner med meta-punkter, **hele emnekatalogen** (15 emner — kode, navn, semester, beskrivelse, ntnu-lenke og enten **bokliste** eller **melding/tom-tilstand**, valgbart per emne), seksjonsoverskriftene, studieretningene (med punkt-lister), grader & løp (med smakebit-lister), markeds-teaseren og de to ansvarsfraskrivelsene. Søk/filter/trekkspill-logikken i `pensum.html` er urørt og fanger opp de data-gjengitte emnekortene. Støtter `**fet**` og `[tekst](adresse)` i meta og tom-tilstand.
- **Galleri (nytt panel).** Topp-banneret på `galleri.html` er flyttet til `galleri-content.js` (gjengis av `apeiron-galleri.js`), redigeres i **Admin → Galleri**. Bildene hentes fortsatt automatisk fra Google Drive.
- Standardverdiene er identiske med HTML-en, så begge sidene ser uendret ut. Berørte filer: `pensum-content.js`, `apeiron-pensum.js`, `pensum.html`, `admin-modules/pensum.js`, `galleri-content.js`, `apeiron-galleri.js`, `galleri.html`, `admin-modules/galleri.js`, `admin.html`, `admin-common.css`.

**21.06.26 — F1: Pensum-markedet er nå redigerbart (nytt Marked-panel)**
- **Tredje steg av Plan F — første helt nye admin-panel bygget fra bunnen.** Hele `marked.html` (kommer-snart-siden lenket fra Pensum) er flyttet 1:1 til `marked-content.js` (gjengis av `apeiron-marked.js`) og redigeres nå i et nytt **Admin → Marked**-panel: topp-banner (tilbake-lenke, eyebrow, tittel, ingress, merkelapper), intro-blokken, de tre funksjons-kortene (dra-sorterbare) og «Meld interesse»-banneret (overskrift, tekst, to knapper, notis).
- Demonstrerer hele mønsteret for å gjøre en modul-løs side redigerbar: nytt content-fil + render-skript + `admin-modules/marked.js`, registrert i `PANELS` + lastet i `admin.html`. Samme oppskrift kan brukes på Pensum og Galleri. Berørte filer: `marked-content.js`, `apeiron-marked.js`, `marked.html`, `admin-modules/marked.js`, `admin.html`.

**21.06.26 — F1: Om oss er nå fullt redigerbar**
- **Andre steg av Plan F.** All gjenstående hardkodet tekst på Om oss er flyttet 1:1 til `om-content.js` (gjengis av `apeiron-om.js`) og redigeres nå i **Admin → Om oss**:
  - **Topp-banneret** (`subhero`): tilbake-lenke, tittel, ingress.
  - **Fellesskap & samarbeid** (`samarbeid`): intro + kortene (Unionen/Dionysos/Begrep) med symbol, merkelapp, tittel, tekst og **redigerbare lenker** — dra-sorterbart.
  - **Lesesalen** (`lesesalen`): intro + tjeneste-punktene (ikonet følger rekkefølgen).
  - **Møt styret** (`motStyret`): intro + kortene (Styret/Tillitsvalgte/Verv) med lenker.
  - **Bli medlem** (`medlem`): intro + fordels-lista (samme tekst som forsiden, egen versjon på Om oss).
- Ny nøstet lenke-redigerer i kort-listene (`admin-common.css`). Standardverdiene er identiske med HTML-en, så siden ser uendret ut. Lesesalen-bildene ligger fortsatt som filer i `assets/lesesalen/`. Berørte filer: `om-content.js`, `om-oss.html`, `apeiron-om.js`, `admin-modules/om-oss.js`, `admin-common.css`.

**21.06.26 — F1 (start): hele forsidens redaksjonelle tekst er nå redigerbar**
- **Første steg av Plan F.** All hardkodet redaksjonell tekst på Hjem er flyttet 1:1 til data i `index-content.js` (gjengis av `apeiron-index.js`) og redigeres nå i **Admin → Forsiden**:
  - **«Bli medlem»-intro** (`medlem`): eyebrow, overskrift, ingress + den dra-sorterbare **fordels-lista** (de fire punktene med avhuking). Priser/innmeldingssteg styres fortsatt i Medlemskap-panelet.
  - **Seksjons-introer** for **Arrangementer** (`arr`), **Aporetisk Aften** (`apo`, inkl. det greske ordet «ἀπορία», uttale/oversettelse, «For hvem» og side-notatet) og **Fadderukene** (`fadder`) — eyebrow + overskrift + ingress.
  - **Hero** fikk «Ny her?»-broteksten; **Kontakt** fikk seksjons-etiketten.
- Standardverdiene er identiske med den gamle HTML-en, så forsiden ser nøyaktig lik ut. Selve arrangementene/programmet hentes fortsatt fra Google Kalender — kun overskriftene og tekstene rundt dem er flyttet hit. Berørte filer: `index-content.js`, `index.html`, `apeiron-index.js`, `admin-modules/forsiden.js`.

**21.06.26 — Admin: dra-sortering rettet + nullstilling til publisert versjon ved ny økt**
- **Dra-og-slipp fryser ikke lenger.** `AdminCommon.enableDragSort` flyttet `pointermove`/`pointerup`/`pointercancel` fra håndtaket til `document` og droppet `setPointerCapture`. Tidligere ga `pointer-events:none` på det løftede kortet (som inneholder håndtaket) tap av peker-fangst — første dra «frøs», og kortet landet ikke der plassholderen viste. Nå filtreres draget på `pointerId`, og plassholder/slipp samsvarer alltid. Gjelder alle admin-paneler.
- **Admin åpner alltid på publisert versjon.** Upubliserte panel-utkast i `localStorage` tømmes når admin åpnes i en **ny fane/økt** (sessionStorage-flagg). En vanlig oppdatering (refresh) i samme fane beholder utkastene, så man ikke mister arbeid ved et uhell; når fanen lukkes, starter neste åpning rent. Slutt på «gamle, upubliserte endringer dukker opp når jeg åpner admin».
- **Advarsel ved lukking.** Første gang en økt har upubliserte endringer, vises et varsel om at endringer forsvinner hvis de ikke lastes ned/publiseres, med avhukingsboks «Ikke vis dette varselet igjen» (lagres i `apeiron-admin-leave-nowarn`). Samme avhuking skrur også av nettleserens «forlat siden?»-spørsmål ved lukking/oppdatering.

**20.06.26 — Dokumentasjon: README som forside + brukerveiledning, VEDLIKEHOLD for drift**
- **README er nå repoets forside.** Lagt til en dokumentasjon-navigasjon (alle `.md`-filer i én tabell), statusmerker, innholdsfortegnelse og sammenleggbare planleggingsseksjoner (Kjente begrensninger, To-do, Domene). Hele «Slik endrer du innhold»-veiledningen bor nå i README.
- **Ny `VEDLIKEHOLD.md`** samler all teknisk drift (publisering, lokal kjøring, manuell redigering av innholdsfilene, søkeindeks, Apps Script, filstruktur, sikkerhet). Bruker (README) og drift (VEDLIKEHOLD) er nå tydelig skilt. Den gamle `HVORDAN.md` er borte — innholdet er flyttet inn i README, og alle lenker dit er rettet.
- **`docs/admin-arkitektur.md` ajourført:** modul-migreringen er markert ferdig (alle 13 paneler er moduler, ikke «pågår»), og veikart-markøren er flyttet til neste steg.

**20.06.26 — Hastemelding-kanalen via Google Sheets fjernet helt**
- **Fullt erstattet av «Akkurat nå» + Nyheter** (repo-basert via Admin → Nyheter). Slettet `hastebeskjed.html` og `news-config.js`; fjernet `loadLive()` (live-henting fra Apps Script) i `apeiron-news.js`. `index.html`/`admin.html` laster ikke lenger `news-config.js`, og snarveien til hastebeskjed-siden er fjernet.
- **`docs/apps-script-oppsett.md` er nå merch-only** — «Del 2: Nyheter» fjernet, da den dokumenterte den avskaffede Sheets-kanalen.

**20.06.26 — Opprydding: død kode og utdaterte referanser**
- **Fjernet ubrukt `design-canvas.jsx`** (etterlatt starter-komponent, ikke referert noe sted).
- **Død from/to-tidsvindu-kode i `apeiron-news.js`** (`parseDate`/`inWindow`) fjernet — feltene eksponeres ikke lenger i admin, så filtreringen var en no-op.
- **Død utloggings-gren i `admin-common.js`** (mappet `*-admin.html` → `*.html`) fjernet — ingen frittstående admin-sider finnes lenger.
- **Utdaterte kommentarer ajourført** i ~13 innholds-/render-filer: «åpne X-admin.html» → «åpne Admin-senteret → X», og alle «Google Sheet «Nyheter»»-rester fjernet.

**20.06.26 — Styret: portrettbilder lastes ned som egne filer (ikke zip)**
- **Færrest mulig klikk.** Ved publisering lastes styreportrettene nå ned som **egne bildefiler** (én og én) sammen med `styret-content.js`, i stedet for en `styret-bilder.zip` som måtte pakkes ut. Legg `styret-content.js` i repoet og slipp bildefilene rett i `assets/styret/` (arkivbilder i `assets/styret/arkiv/`). Hjelpetekst i panelet oppdatert.

**20.06.26 — Feilsjekk: død lenke og image-slot-advarsler rettet**
- **Død lenke fjernet:** `hastebeskjed.html` pekte til en ikke-eksisterende `nyheter-admin.html` (siden er senere fjernet helt, se over).
- **`<image-slot>`-advarsler:** styre- og utmerkelses-portrettene fikk stabile `id`-er, så konsoll-advarselen «without an id will not persist» er borte.

**20.06.26 — Sikkerhet: tettet «prototype pollution» i admin-editorene**
- **`setPath` i Forsiden- og Om oss-editorene er herdet.** CodeQL meldte to «prototype-polluting function»-varsler (medium) i `admin-modules/forsiden.js` og `admin-modules/om-oss.js`. Funksjonen som skriver et felt ned i datastrukturen via en sti (f.eks. `hero.cta1.label`) avviser nå segmentene `__proto__`, `prototype` og `constructor`, og traverserer/bygger bare egne objekt-egenskaper (`Object.prototype.hasOwnProperty`). Ingen vanlig redigering påvirkes — alle reelle felt-stier bruker trygge nøkler. Lukker varsel #9 og #10.

**20.06.26 — Admin: festet preview dekker nå alt bak seg**
- **Ingenting stikker gjennom lenger.** Når previewen var festet, kunne små knapper fra editoren bak (bl.a. «×» på portrettbildene) stikke gjennom og legge seg oppå previewen. Festet preview løftes nå over alt editor-innhold, så den dekker siden bak fullstendig. Den flytende seksjonsmenyen («På denne siden») ligger fortsatt øverst der de møtes.

**20.06.26 — Admin: festet («📌 Fest») forhåndsvisning er mer kompakt**
- **Festet preview tar mindre plass.** Når du fester forhåndsvisningen øverst, klistret den før en stor blokk over editoren. Nå er festet modus strammere: beskrivelsen skjules, «Forhåndsvisning»-overskriften krymper, toppmargen er tettere, og selve previewen er senket (30vh i stedet for 42vh). Editoren bak får mer plass, og previewen ligger høyere oppe. Gjelder alle paneler (Styret, Nyheter, Merch, osv.).

**20.06.26 — Admin Styret: én forhåndsvisning med bryter (ikke to stablet)**
- **Fikset kolliderende previews.** Styret-panelet hadde to separate innebygde forhåndsvisninger (Styret-siden øverst + arkivsiden nede i arkiv-seksjonen), som kolliderte og så stygge ut. Nå er det **én** preview med en **Styret-siden / Arkivsiden**-bryter øverst — samme grep som ble gjort på Nyheter. Begge er fortsatt live: redigering og arkivering vises umiddelbart i den valgte visningen.

**20.06.26 — Nyheter: justeringer på «Akkurat nå», arkivvisning, live nyhetsside & meny**
- **Tittelen flytter seg opp uten merkelapp.** Setter du merkelapp til «Ingen», var det før et tomrom øverst på «Akkurat nå»-kortet. Nå rykker tittelen opp og deler topplinja med datoen (på samme måte som teksten rykker opp når tittelen mangler).
- **Arkiverte nyheter: Kompakt/Utvidet + sammenleggbart.** Arkiv-seksjonen i Nyheter-panelet har fått samme grep som Styret-arkivet: en **Kompakt/Utvidet**-bryter og en pil per kort. Kompakt (standard) slår hver arkiverte nyhet sammen til én rad (tittel + dato) så lista ikke tar mye plass; Utvidet åpner full redigering. Tilstanden huskes (`apeiron-news-arch-open-v1`).
- **Live forhåndsvisning av hele nyhetssiden.** Previewen har fått en **Forsiden / Nyhetssiden**-bryter (én preview, ikke to stablet), så du kan veksle mellom forsidens «Akkurat nå»-kort og hele `nyheter.html` (med arkiv). Begge er live — arkivering og redigering vises umiddelbart. `nyheter.html` fikk en preview-bro som re-rendrer på `postMessage`.
- **«Nyheter» lagt til i menyen.** Nytt menypunkt **Nyheter** (→ `nyheter.html`, med arkiv) under «Hva skjer» i hoved- og mobilmenyen.

**20.06.26 — Nyheter: arkivseksjon i admin + nytt «Akkurat nå»-oppsett**
- **Arkiverte nyheter vises i egen seksjon i admin.** Når en nyhet settes til **✓ Arkivert**, flyttes den nå til en egen «Arkiverte nyheter»-seksjon nederst i Nyheter-panelet (med eget antall og dempet, stiplet ramme) — likt som arkivet i Styret-panelet. Aktiv-lista viser bare aktive nyheter. Sett tilbake til **● Aktiv** for å flytte den opp igjen. Begge listene kan dra-sorteres, og rekkefølgen flettes riktig tilbake til innholdsfila.
- **Valgfri merkelapp på «Akkurat nå»-kortet.** Nytt **Merkelapp**-felt per nyhet (Ingen · Kunngjøring · Nyhet · Beskjed · Påminnelse · Frist · Egendefinert…). Velger du **«Ingen»**, droppes den lille etiketten helt, og tittelen får plassen. Lagres som `kicker` i `news-content.js` (`"" = ingen`).
- **Tekst-utdrag i stedet for «Lagt ut»-dato.** Der datoen sto nederst på «Akkurat nå»-kortet, vises nå starten av brødteksten (et kort, markdown-renset utdrag, maks 2 linjer).
- **Ny dato-løsning.** Datoen vises nå som et lite, dempet tidsstempel øverst til høyre på kortet. Bruker fritekst-datoen om den er satt, ellers «lagt ut»-datoen automatisk (kortform — årstall droppes når det er inneværende år).

**20.06.26 — Admin: flytende seksjonsmeny i hvert panel**
- **«På denne siden»-meny til høyre.** Hvert admin-panel har nå en flytende seksjonsmeny festet til høyre kant som følger med når du scroller — åpen som standard. Den lister panelets seksjoner (Forhåndsvisning, overskrifter, og hver `.sec`/`.panel`-blokk) med **antalls-merker** (f.eks. «11»), markerer aktiv seksjon mens du scroller (scroll-spy), og et klikk hopper jevnt til seksjonen. Kan minimeres til en liten «☰ Seksjoner»-pille (tilstand huskes i `localStorage`), og skjules automatisk på smale skjermer (< 1100px) så den aldri dekker innholdet.
- **Oppdaterer seg selv.** En `MutationObserver` på panelinnholdet bygger lista på nytt når seksjoner legges til/fjernes eller antall endres — så menyen er alltid i synk med det du redigerer, uten at modulene må endres.
- **Generisk i skallet.** Bygget én gang i `admin.html` (scanner `.preview-top`, `.meta-panel`, `.sec`, `.panel` og frittstående `.sec-head`), så den virker likt på alle paneler (Styret, Nyheter, Begrep, Merch, Medlemskap, Footer m.fl.). Reserverer plass via `.panel-host.has-secnav` så innholdet skyves trygt unna menyen.

**20.06.26 — Årskull/periode: nedtrekksmenyer + sortering & filtrering**
- **Utmerkelser sorteres og filtreres på årskull.** «År»-feltet i admin (Utmerkelser) er byttet fra fritekst til en **nedtrekksmeny for årskull** (2025/2026, 2024/2025 …), generert automatisk rundt inneværende studieår (august-grense) ned til 2014/2015. Eldre/ukjente verdier (f.eks. bare «2026») bevares som eget valg merket «(eldre format)» så ingenting går tapt. På selve Utmerkelser-siden (`utmerkelser.html`) vises en **filterrad med chips** når det finnes minst to årskull («Alle» + hvert kull, nyeste først), og kortene sorteres automatisk etter årskull (nyeste øverst, stabilt innen samme kull). Eksempel­personene er oppdatert til årskull-format.
- **Tidligere styrer: «Periode» er nå en nedtrekksmeny.** Samme grep i Styret-arkivet — periode-feltet er en **årskull-meny** i «2024 / 2025»-format (med mellomrom, som før), automatisk generert. Egendefinerte verdier bevares.
- **Tiår-gruppert periodefilter på arkivsiden.** `styret-arkiv.html` har en «Vis periode»-filterrad som holder seg kompakt uansett hvor mange styrer arkivet vokser til: **«Alle» + de to nyeste årskullene som egne chips**, og alle eldre samlet i **tiår-chips** («2020-tallet», «2010-tallet»). Klikk på et tiår folder ut årene i det (andre nivå); velg så et år for å filtrere. Lukkes et tiår mens et år inni er valgt, markeres tiåret som aktivt så filteret synlig består. Et tiår med bare ett år vises direkte som år-chip. Styrene sorteres automatisk etter periode (nyeste først).
- **Arkivvisning: «Kompakt / Utvidet» erstatter «1/2 i bredden».** To fulle styre-editorer ved siden av hverandre var ubrukelig (den høyre ble klemt/avkuttet), så breddevelgeren i arkiv-seksjonen er byttet med en tetthets-bryter: **Kompakt** slår hvert styre sammen til én rad (periode + medlemstall) for rask oversikt over mange år, **Utvidet** åpner full editor for alle. Bygger på den eksisterende kollaps-mekanikken (pil per kort virker fortsatt); den separate «Åpne alle / Lukk alle»-knappen er foldet inn i bryteren. Nye ikoner `.ic-rows`/`.ic-one` i `admin-modules.css`.

**20.06.26 — Merch: tydeligere bildeknapp**
- **«✎ Rediger» i stedet for et løst ikon.** Beskjær-knappen på produktbildene var bare et `⛶`-ikon som var lett å misforstå. Den er nå en gull **✎ Rediger**-knapp med tekst, så det er åpenbart at den åpner redigeringsvinduet (beskjær, zoom, roter).
- **Fjernet den separate roter-knappen** (↻) fra bildelinja — rotasjon gjøres inne i redigeringsvinduet, så den var overflødig. Bildelinja har nå bare **✎ Rediger** og **✕ Fjern**.

**20.06.26 — Admin: valgbar kortvisning + ensartet bilderedigering på alle paneler**
- **«Visning»-velger på kortlistene.** Over hver kortliste i admin ligger nå en liten verktøylinje der redaktøren velger hvor mange kort som vises i bredden (1 / 2 / 3) — så den brede arbeidsflaten faktisk utnyttes i stedet for én smal kolonne. Styret-medlemmene har i tillegg fire dedikerte oppsett: **Stablet** (som før), **To i bredden** (standard), **Tre kompakt** (liten avatar inline) og **Galleri** (portrett øverst, speiler det publiserte kortet). Bygget som én delt `AdminCommon.viewSwitch({list, key, modes, def})` som legger `.lay-cols-1/2/3` på lista; valget huskes per liste i `localStorage` og påvirker **bare** admin-visningen, ikke den publiserte siden. Stilen ligger i `admin-modules.css` (`.lay-switch`, `.lay-ic`, `.list.lay-cols-*`, `.lst.lay-cols-*`). Innført på Styret (medlemmer, roller, arkiv + arkivmedlemmer), Nyheter, Oppslagstavla, Oppnåelser, Utmerkelser, Begrep (utgaver/podkast/film), Merch, Hjelp (alle 7 kortlister), Forsiden, Om oss, Footer og Medlemskap. Meny er uendret (har eget rutenett).
- **Sammenleggbare tidligere styrer.** Hvert arkivert styre kan nå foldes sammen (pil i kort-toppen) så arkivet ikke vokser i det uendelige — sammenlagt vises bare periode + medlemstall. Alle er lukket som standard; nye arkiv åpnes automatisk. En **▾ Åpne alle / ▸ Lukk alle**-knapp i seksjonstoppen folder alt på én gang, og tilstanden huskes (`apeiron-styret-arch-open-v1`).
- **Samme bildeverktøy overalt.** Alle bildefelt utenom Styret er flyttet til en delt `AdminCommon.wireImageField({zone, get, set, aspect, …})` + `imgFieldHtml()`, som åpner det fulle redigeringsvinduet (`AdminImageEditor`: flytt/zoom/roter/speil/lys/kontrast/metning + beskjær) ved opplasting og redigering. Verktøyknappene (✎ rediger · ✕ fjern) ligger nå i en **linje under bildet** (Merch-stil) i stedet for oppå det, så de ikke dekker motivet. Gjelder Oppslagstavla, Oppnåelser, Utmerkelser og Begrep; Merch sin beskjær-knapp bruker samme vindu. Gammel, ubrukt crop/rotate-modal i `oppslag.js` er fjernet.
- **Runde Styret-portretter med sirkel-crop.** Styret-bildene vises runde i alle fire oppsettene, og redigeringsvinduet viser en **sirkelmaske** (ny `round`-opsjon i `admin-image-editor.js`) når du croper, så du ser nøyaktig hva som havner i den runde rammen.
- **«↶ Angre» på bilder — nå overalt og fikset.** Etter at du bruker/fjerner et bilde dukker angre-stripa opp. Den tok først et for tynt øyeblikksbilde og kunne ende med å *slette* bildet eller hoppe til feil redigering — særlig for allerede publiserte portretter (lastet fra serverfil, ikke fra mellomlageret). Angre tar nå et fullt øyeblikksbilde (både referanse og selve bildebytene) og tegner lista på nytt, verifisert korrekt for både mellomlagrede og publiserte bilder, ved både redigering og fjerning. Merch fikk angre på fjern/beskjær/roter av produktbilder.
- **«Tilbakestill til siste publiserte versjon» (Styret) laster nå bildelageret på nytt**, så den faktisk rydder opp i et rotete bildestatus i stedet for å henge igjen på gamle bytes i minnet.
- **«Nullstill justeringer» i bilderedigereren tilbakestiller alt.** Knappen nullet før bare lys/kontrast/metning; nå tilbakestilles også beskjæring/zoom, rotasjon, speilvending og panorering. Ny **✕ lukk** øverst i hjørnet av redigeringsvinduet (i tillegg til Avbryt / Esc / klikk utenfor) så man alltid kommer ut uten å lagre.
- **Flere forklarende «?».** La til hjelpebobler på felt som manglet det (Initialer, Tilleggsverv, Fargestripe, Ansvar/punkter, Høydepunkter m.fl.).

**20.06.26 — Admin: «↶ Angre» på alle slettinger**
- **Delt angre-snackbar med stabel.** Ny `AdminCommon.undoable(label, undoFn)` + snarveien `undoDelete(arr, idx, label, render, save)` viser en gul «↶ Angre»-stripe nederst når noe slettes — klikk for å gjenopprette elementet på nøyaktig samme plass. Sletter du **flere** ting, legges de på en stabel: en gull-teller viser hvor mange som kan angres, og hvert «Angre»-klikk tar den nyeste først (LIFO). Stabelen tømmes etter ~20 s uten aktivitet eller når du lukker stripa (✕). Stilen ligger i `admin-common.css` (`.undo-snack`).
- **Innført i alle paneler:** Styret (medlemmer, roller, arkiverte styrer + tags/punkter/høydepunkter/arkivmedlemmer), Forsiden (sosiale lenker, FAQ), Om oss (avsnitt, tall, FAQ), Nyheter, Oppslagstavla, Oppnåelser, Utmerkelser, Begrep, Merch (produkter), Medlemskap (nivåer, steg), Hjelp (kort + punkter) og Footer (lenker, sosiale lenker). Meny hadde fra før egen angre/gjør-om-historikk og er uendret.
- **Slutt på «Slett?»-bekreftelser på enkeltelementer.** Siden alt nå kan angres, er de gamle `confirm()`-dialogene på kort/rader fjernet — sletting er ett klikk, og angreknappen er sikkerhetsnettet. Bekreftelser beholdes kun på de store, samlede handlingene («Tøm styret», «Tilbakestill til siste publiserte versjon»).
- **Bilder beholdes ved sletting** (Styret-arkiv) så angre gjenoppretter portrettene òg; ubrukte bilder havner uansett ikke i `styret-bilder.zip`.
- **Tydelig teller for flere slettinger.** Når mer enn én ting ligger på angre-stabelen, vises en gull pille-teller (`.undo-snack__count`) med antallet, og meldingen får hintet «— Angre tar én om gangen». Tidligere var tallet ustilt og knapt synlig, så det så ut som bare den siste slettingen kunne angres; nå er det åpenbart at hvert klikk tar én av gangen (nyeste først).

**20.06.26 — Styret: bilderedigerer, fil-basert bildelagring & styre-arkiv**
- **Fullt redigeringsvindu når du legger til bilde.** Ny gjenbrukbar `admin-image-editor.js` (`AdminImageEditor.open({src, aspect, outSize, onApply})`) åpnes når du laster opp/bytter et portrett i Styret-panelet — med **flytt (dra), zoom (slider + scroll), roter 90°, speilvend vannrett/loddrett og lysstyrke/kontrast/metning**, samt beskjæring til riktig (kvadratisk) format. Alt rendres på canvas, så forhåndsvisningen er nøyaktig det som lagres. Lastes i `admin.html` etter `palette.js`.
- **Bilder lagres som EGNE filer — ikke base64 i innholdsfila.** Tidligere ble hvert portrett lagt inn som en enorm base64-streng rett i `styret-content.js`. Nå får hvert bilde en **sti** (`assets/styret/<id>.webp`); selve bytene ligger i nettleseren (IndexedDB via nye `AdminCommon.imgGet/imgSet/imgDel/imgAll`) og pakkes til **`styret-bilder.zip`** ved «Last ned alle endrede» (ny `zipFiles()`/`dataUrlToBytes()`/`saveBlob()` i `admin-common.js` — ukomprimert «store»-zip, webp er allerede komprimert). Brukeren committer JS-fila + pakker ut zip-en i prosjektmappa. Resultat: `styret-content.js` holder seg liten, og bildene cacher som ekte filer. Initialene vises som fallback til bildet er committet (med `onerror` på preview-bildet).
- **Arkiv over tidligere styrer.** Ny `archive[]` i `styret-content.js`. I Styret-panelet: seksjon «Tidligere styrer» med **«+ Arkivér nåværende styre»** (kopierer dagens styre — navn, hovedverv, **tilleggsverv/chips**, initialer og et øyeblikksbilde av portrettet — som et utkast du skriver videre på), **«+ Tomt arkiv»**, og per styre: periode, valgfri tittel, sammendrag, høydepunkter (punktliste) og medlemmer med **notat om hva hver person gjorde** + eget bilde + tags. Vises som **teaser** på Styret-siden (`#tidligere-styrer`, snittkort med periode/medlemstall/avatarer) og i sin helhet på ny side **`styret-arkiv.html`** (lagt til i menyen under «Foreningen» og i `PAGE_SECTIONS`).
- **Live forhåndsvisning av hele arkivsiden i admin.** I tillegg til den vanlige Styret-previewen (som viser teaseren) embeddes `styret-arkiv.html?preview=1` rett i arkiv-seksjonen, matet av samme `postMessage` — så arkiverte styrer, notater, høydepunkter og bilder vises umiddelbart slik den ferdige arkivsiden blir.
- **«🗑 Tøm styret» med egen Angre.** Knapp som fjerner alle styremedlemmene (roller og arkiv røres ikke) — typisk når et nytt styre tar over. Etterpå vises en gul linje med **↶ Angre** som gjenoppretter alt (inkl. tags). Snapshotet lagres i `localStorage` (`apeiron-styret-undo-v1`), så angre overlever en sideoppdatering. Bevisst adskilt fra «Tilbakestill til siste publiserte versjon» (som forkaster *alle* utkast) — så et uhell koster ikke alt arbeidet.
- **Bildelageret** (`images`-store) lagt til i den eksisterende IndexedDB-basen (`apeiron-admin`, oppgradert til v2).

**20.06.26 — «Til toppen»-knapp på alle sider**
- **Liten sirkel nede til høyre som blar til toppen.** La til en gull-på-navy sirkelknapp (50px desktop / 46px mobil) festet nederst i høyre hjørne, med en pil opp. Den dukker opp først etter ~400px scrolling (faller mykt inn) og blar mykt til toppen ved klikk (hopper direkte ved `prefers-reduced-motion`). Knappen ligger i den delte chrome-koden (`site-chrome.js` → `addToTop()`), så den virker på **alle** sider — forside og undersider, mobil og desktop. Stilen ligger i `styles.css` (`.to-top`), respekterer `env(safe-area-inset-*)` på telefoner og hever seg/snur fargene ved hover.

**20.06.26 — Admin: ensartet mobil-preview i Meny + Nyheter justert**
- **Meny brukte en avvikende mobilvisning.** Forhåndsvisningen lå i et hvitt kort med tynn ramme og nedskalert iframe (`transform: scale(.846)`), i stedet for telefon-rammen de andre panelene bruker. `admin-modules.css`: `.np-mob-wrap`/`#pv-mob` er skrevet om til samme mørke telefon-bezel (390px innhold, 11px navy ramme, 38px hjørner, ingen skalering), og `.preview-pane` er gjort gjennomsiktig (uten hvitt kort/skygge) så Mobil ser identisk ut med resten. Preview-kolonnen er samtidig breddet fra 360 → 412px for å romme rammen.
- **Nyheter sin mobil-preview lå 16px for høyt.** Telefonen er festet (`position: sticky; top: 16px`); i paneler med høy editor-kolonne vises de 16px som luft på toppen, men Nyheter har kort editor, så telefonen ble dratt 16px høyere enn de andre. `admin.html`: la til `.mod-nyheter .pv-box { margin-top: 16px }` (nullet ut i smal-skjerm-modusen) så toppen flukter med de øvrige panelene.

**20.06.26 — Mobilfikser: hero-avkutting, galleri-fart og anker-hopp**
- **Hero/«Akkurat nå» kuttet av på høye, smale skjermer** (rapportert på Fairphone 5, 1224×2700): hero-en var vertikalt sentrert og tvunget til full skjermhøyde (`min-height:100svh; align-items:center`), så når tekst + «Akkurat nå»-kortet ble høyere enn skjermen, havnet kortet under skjermkanten. `styles.css` (`@media max-width:980px`): hero-en topp-justeres nå (`align-items:flex-start`) og vokser med innholdet (`min-height:auto`), med strammere luft mellom tekst og kort (`gap` 48→26px, kortere lede-marginer, padding 120/60→104/44px) så kortet trekkes opp i synsfeltet. «Bla ned»-streken skjules på mobil for å unngå overlapp med kortet. Hjelp-siden bruker samme subhero-mønster, som vokser med innholdet og ikke klipper.
- **Galleri-rullegardinen gikk for fort** (`galleri.html`): marquee-animasjonen senket fra `72s` til `108s` — ⅔ av tidligere fart.
- **Anker-hopp landet feil på mobil** («Bli med i S.A.K» fra styret havnet på *Bli medlem*; «Bli medlem» i mobilmenyen havnet på *Fadderukene*): nettleseren hoppet til ankeret *før* arrangementer/kalendere lastet, og når de fylte seg ut ble `#kontakt`/`#bli-medlem` skjøvet nedover slik at man ble stående for høyt. `index.html` re-justerer nå til ankeret i flere passeringer mens layouten setter seg (kompenserer for nav-høyden via `--nav-h`), og avbryter straks brukeren scroller selv.
- **«Om oss» blar forbi hero** (`nav-content.js`): menypunktet pekte til `om-oss.html#om` og hoppet forbi hero-en på Om oss-siden. Endret til `om-oss.html`, så den lander på toppen som de øvrige sidene.

**19.06.26 — Admin-senter: ensartede forhåndsvisninger + lettere fane-navigasjon**
- **Alle desktop-previews er nå like store.** Tidligere hadde bare Merch og Meny den brede arbeidsflaten (1180px) mens resten var låst til 880px og ble skalert ned — så Forsiden/Om oss virket «særdeles høye» og andre paneler «veldig 1:1». Den delte `.pv-split`-bredden er hevet til 1180px, så samtlige paneler gjengis i samme størrelse som Merch. Per-modul `visibleH` for previewen er også samkjørt (alle bruker nå merch-verdiene 420–680px / `0.66`).
- **Ensartet avstand mellom preview og editor.** `.preview-top` hadde ulik `margin-bottom` per modul (Merch 30px, de fleste 28px, Nyheter 24px) og helt manglende regel på Oppnåelser/Utmerkelser/Medlemskap (≈0 — derfor en trang overlapping). Nå settes 28px ett sted (generisk regel), og alle per-modul-overstyringene er fjernet.
- **Fane-raden er lett å bla i.** La til ‹ ›-bla-knapper som dukker opp kun ved overflyt, falmede kanter som hint, dra-for-å-panorere, musehjul-scroll, og valgt fane scrolles automatisk inn i visning. Det native overlay-rullefeltet (som skjuler seg selv) er byttet ut med et egendefinert, alltid-synlig felt med dragbar knott.
- **Meny: mobil-preview forstørret** (300×470 → 330×600, 390-bredt innhold) så den ligner de andre modulenes mobilvisning; desktop + mobil vises fortsatt samtidig.
- **Panelene i fane-menyen sortert intuitivt** etter nettsidens egen struktur: Forsiden → Nyheter → Oppslagstavla → Om oss → Styret → Oppnåelser → Utmerkelser → Begrep → Merch → Medlemskap → Hjelp → Meny → Footer (sidedekkende ting til slutt).
- **Ryddet i forhåndsvisnings-headeren:** «Hero/Kontakt»- og «Om oss/FAQ»-hurtigknappene over previewen er fjernet (Forsiden + Om oss) — markup, JS og ubrukt CSS.
- **Oversiktssiden:** «Velkommen»-teksten er kortet ned til ren orientering (uten å gjenta publiseringsstegene), og **«Slik publiserer du»** er omskrevet i klart, ikke-teknisk språk med mental modell øverst og lenke til veiledningen.
- **Headeren:** fjernet «Ingen innlogging —» (unødvendig inne i admin); står nå «Endringer er lokale til du laster ned og pusher».
- **«Bla ned»-streken i hero** (`styles.css`): 1px → 2px og hintet hevet over WIP-banneret, så den ikke forsvinner i skalert preview.

**19.06.26 — Opprydding i repoet før push**
- **Slettet utviklingsrusk** som ikke var referert noe sted og bare gjorde repoet rotete: `screenshots/` (50 dev-skjermbilder), `scraps/` (4 skissefiler), `uploads/` (19 ubrukte opplastede bilder) og `mock-nyheter.js` (testdata). Verifisert at ingen av dem var brukt på siden (`grep` på filnavn ga null treff) før sletting.
- **`Plan F.html` lagt til `.gitignore`** — arbeidsdokument/veikart som ikke skal publiseres. Fila ligger fortsatt lokalt, men committes ikke lenger. (README lenker til den; lenken virker lokalt, men fila følger ikke med en fersk klone.)
- **Vurdert, men forkastet: mappestruktur for HTML/JS.** Diskuterte å flytte sidene inn i `/sider/` og JS-filene i undermapper (`/js/innhold/` osv.). Forkastet fordi: (1) Cloudflare Pages fjerner allerede `.html` fra URL-ene (`/nyheter`, ikke `/nyheter.html`) — sidene ligger derfor *riktig* i rota, og en `/sider/`-mappe ville gjort URL-ene styggere, ikke penere; (2) uten byggesteg er disk = URL, så strukturen kan ikke frikobles fra adressene; (3) når en fremtidig redaktør uansett laster en ny `.js` rett til rota, holder ikke en mappestruktur seg ryddig av seg selv. Flat struktur er det mest robuste for et håndredigert repo. Filnavnene er allerede gruppert via prefiks (`*-content.js`, `*-config.js`, `apeiron-*.js`).
- **Dokumentasjonen kryssjekket mot faktisk kode** og ajourført der den hadde drevet ut av synk:
  - **HVORDAN.md filstruktur-tabell skrevet om fra bunnen** — manglet ~25 filer som nå finnes (sidene `om-oss`, `oppslagstavla`, `oppnaelser`, `utmerkelser`; `site-chrome.js`, `palette.js`, `nav-content.js`, `site-content.js`, `report.js`, `footer-icons.js`, `apeiron-index.js`, `apeiron-om.js`, alle `*-content.js`, `admin-modules.css`, `docs/admin-arkitektur.md`, samt asset-mappene `lesesalen`/`logikk-panikk`/`oppnaelser`). Tabellen er nå gruppert (Sider · Innhold · Renderere · Admin · Dokumentasjon · Bilder).
  - **Fjernet utdatert «skriv rett til repo-fila»-omtale** (File System Access) fra HVORDAN — funksjonen finnes ikke i `admin-common.js` lenger; admin laster alltid ned fila.
  - **«Om oss / øvrig tekst redigeres i index.html»** rettet — forsidetekst redigeres nå i Admin → Forsiden (`index-content.js`) og Om oss-siden i Admin → Om oss (`om-content.js`).
  - **Admin-introen** nevner nå alle 13 modulene (nevnte før bare 8).
- **Gjenopprettet `_headers`** (Cloudflare HTTP-sikkerhetsheadere) — fila var referert i dokumentasjonen, men fantes ikke lenger i repoet. Lagt tilbake som en **trygg basisversjon**: `X-Frame-Options: SAMEORIGIN` (ikke DENY, så Admin-senterets iframe-forhåndsvisninger fortsatt virker), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Strict-Transport-Security` og `Permissions-Policy`. **Content-Security-Policy er bevisst utelatt** — den må skreddersys etter Google Calendar/Drive/Fonts og inline-skript før den slås på, ellers brytes egen funksjonalitet.

**19.06.26 — Søkeindeksen oppdateres nå automatisk ved Publiser**
- **Slutt på manuelt vedlikehold:** søketreffene var hardkodet i en `IDX`-liste i `site-search.js` og måtte redigeres for hånd (eget to-do-punkt som lett ble glemt og rotnet ved styrebytte). Nå genereres indeksen fra det faktiske innholdet.
- **`search-index.js` (auto-generert):** lastes på alle sider før `site-search.js`, som leser den (med fallback til den innebygde `IDX` hvis fila mangler).
- **`search-base.js`:** statiske treff som ikke kommer fra en modul (sider, seksjoner, emner/pensum). Redigeres for hånd ved behov; lastes kun i `admin.html`.
- **Dynamiske treff fra modulene:** nye `searchEntries()` i nyheter, styret, merch, begrep, oppnåelser og utmerkelser avleder treff fra publisert/utkast-data (`AdminCommon.readDraftOr`). Nyheter/kunngjøringer, styremedlemmer, produkter, podkast og heder holder seg dermed alltid i synk — og nyheter (egen «Nyheter»-gruppe i søket) dukker nå opp på søk.
- **Ett steg, automatisk:** `admin.html` regenererer `search-index.js` som del av «Publiser» — men laster den bare ned hvis innholdet faktisk har endret seg (ingen unødig git-støy). Ingenting ekstra å huske utover vanlig publisering.
- **Bonus:** «Om oss»-treff (Om oss, Lesesalen, Samarbeid) vises nå i søk — de hadde tidligere en gruppe som ikke var med i visningsrekkefølgen.

**19.06.26 — Samlet Admin-senter: alle 13 paneler er nå moduler (Klynge C ferdig)**
- **Én inngang for all redigering:** `admin.html` er nå et skall som mounter editor-moduler inline. De **13** tidligere frittstående `*-admin.html`-sidene er migrert til `admin-modules/<id>.js` og **slettet**: medlemskap, footer, hjelp, oppnåelser, utmerkelser, om-oss, forsiden (index), styret, begrep, oppslag, nyheter, meny, merch.
- **Felles fundament i `admin-common.js`:** nytt datalager `createStore(lsKey, freshFn)` (auto-lagre utkast i localStorage, `save`/`lazySave`/`reset`), `esc`-hjelper, og panel-registeret `AdminPanels.define(id, {title, see, exportName, mount(host, AC)})`. Hver modul returnerer `{ export, destroy }`; `destroy` rydder lyttere/modaler ved panelbytte (ingen leaks).
- **Per-modul CSS** samlet i `admin-modules.css`, klasse-scopet (`.mod-meny`, `.mod-merch` …). Skallet gir kontekst-knappene «↓ Last ned» + «Se siden» i headeren per modul.
- **Bevart full funksjonalitet:** meny beholder dobbel live-preview (desktop nav + mobil-skuff via srcdoc med ekte `site-chrome.js`), angre/gjør-om og 📍-stedvelger; merch beholder bildegalleri m/ crop/zoom/rotasjon, farge-bilde-kobling, badges og fargekontroller + live butikk-preview; nyheter beholder per-sone-beskjeder + arkiv.
- **Flash-bug fikset:** «Logg inn»-gaten (død markup) blinket ved sidebytte — nå nøytralisert ved kilden (`#gate { display:none }`) i alle filer, uavhengig av cache/lasterekkefølge.
- **Ny doc `docs/admin-arkitektur.md`:** beskriver skall+modul-mønsteret og veikartet videre — git-basert CMS-følelse (lagre = commit, ingen nedlasting) → klonbar mal der enhver linjeforening kan klone repoet og bygge sin egen side gjennom admin (gratis, uten server).
- **`HVORDAN.md`** oppdatert til å peke på Admin-senteret i stedet for de gamle panelene.


**18.06.26 — Oppslagstavla: skarpere plakater, mindre grumsete tavle**
- **Filt-tavla mindre «grumsete»:** støytekstur-overlegget på `.board` (`styles.css`) dempet kraftig — `opacity` .5 → .22, `mix-blend-mode` overlay → soft-light, og grovere/roligere korn (`baseFrequency` 0.9 → 0.42). Tidligere lignet det høyfrekvente kornet kompresjonsstøy / lav oppløsning; nå er det en diskré filt-tekstur. Gjelder både forsidens teaser og `oppslagstavla.html`.
- **Skarpere bildeopplasting i admin:** `oppslagstavla-admin.html` lagrer nå plakater i høyere kvalitet — maks 1200 → 1600 px, webp-kvalitet 0.85 → 0.92, og `imageSmoothingQuality:'high'` på all nedskalering/rotering/beskjæring. Tekstbunge plakater holder seg lesbare.

**18.06.26 — Ryddet opp i README.md**
- **laget HVORDAN.md** for å rydde opp i readme. La oss holde det ryddig slik at readme er det vi trenger å forholde oss til frem til vi kan ta det litt mer med ro.

**18.06.26 — Ryddigere navigasjon (B) + kapittelskiller på forsiden (A)**
- **Toppmenyen slanket fra 10 til 7 synlige valg** (`nav-content.js`), ordnet i fem «verdener»: **Hjem · Hva skjer ▾ · Begrep · Faglig ▾ · Foreningen ▾ · Merch ▾ · Hjelp & støtte** (+ «Bli medlem» i mobilmeny/hero). Ingenting fjernet — alt er omgruppert.
  - **Hva skjer:** Arrangementer · Oppslagstavla · Aporetisk Aften · Fadderuke · Galleri.
  - **Begrep** løftet til eget toppvalg; **Faglig:** Pensum & studieretninger · Grader & løp.
  - **Foreningen:** Om oss · Styret & tillitsvalgte · Verv · Fellesskap & samarbeid · Lesesalen · Utmerkelser · Oppnåelser.
  - **S.A.K** og **Tillitsvalgte** ute av menyen, lever videre på `styret.html` (`#sak` / `#tillitsvalgte`). **Kontakt** ute av toppen, fortsatt i bunnteksten.
- **Tre kapittelskiller på forsiden** (`index.html`): «I · Akkurat nå», «II · Det du kan regne med», «III · Bli med» — kompakt sentrert merke (Cormorant-tall + eyebrow-merkelapp + kort gulltikk).
  - Ligger **inne i seksjonen** de introduserer, så de deler samme bakgrunn (ingen fargeskjøt); lys variant (`--on-dark`) på den rødbrune medlemsseksjonen.
- Forslag-/forhåndsvisningsfiler: `forslag-navigasjon.html`, `forslag-kapittelskiller.html`.

**18.06.26 — Planfiler ryddet**
- `PLAN.html` (full prosjektplan A–F) er fjernet — alle klynger A–E er ferdige og trenger ikke lenger veikart.
- Ny **`Plan F.html`** spunnet ut med kun Klynge F-innholdet (F1–F5 + trinnveikart + åpne spørsmål). Denne er nå eneste gjenstående plan-fil.

**18.06.26 — Oppslagstavla-admin: stedvelger, Ferdig-toggle, bilderediger og live-preview-fiks**
- **📍 Stedvelger på lenke-feltet** i `oppslagstavla-admin.html` — samme popover som `meny-admin`: søkbar liste over alle sider og seksjoner med lesbare navn, fyller `side.html#anker` automatisk.
- **● Aktiv / ✓ Ferdig-toggle** på hver plakat. Klikk for å arkivere — kortet dimmes og strykes over i admin. Arkiverte plakater vises i en ny **«Tidligere oppslag»**-seksjon nederst på `oppslagstavla.html` (dempet/gråtonet), men **ikke** på forsideteaser-en.
- **Bilderediger:** ↻ rotér (90°) og ⛶ beskjær/zoom (dra + glidebryter + scrollhjul) direkte på plakatbildet i admin — identisk mekanikk som `merch-admin`. Knappene vises ved hover over bildesonen.
- **Live-preview-fiks:** `IS_PREVIEW` i `oppslagstavla.html` sjekker nå `window.self !== window.top` i tillegg til `?preview=1` — previewen oppdateres sanntid igjen.
- **localStorage-sync:** `oppslagstavla.html` og `index.html` leser nå admin-utkastet fra `localStorage` (nøkkel `apeiron-oppslag-v1`) ved direkte besøk i samme nettlesersesjon, slik at endringer i admin umiddelbart reflekteres på begge sider uten eksport. Previewen i admin bruker fortsatt postMessage.
- **Oppslagstavla-teaser på index** bruker nå `OPPSLAG_CONTENT.intro.heading` og `.intro.lede` fra admin-innstillingene.

**18.06.26 — Forsiden: CTA, seksjonsrytme og mørk Arrangementer-seksjon**
- **Hero CTA #2** («Se hva som skjer») peker nå til `#oppslagstavla-teaser` i stedet for `#arrangementer` — oppslagstavla er mer visuelt engasjerende som første stopp.
- **Seksjonspaddingen** redusert fra 104 px til 64 px (`styles.css`) — fjerner overdrevne luftlommer mellom alle seksjoner på alle sider. `section--tight`: 76 → 48 px. Mobil: 72 → 44 px.
- **Arrangementer-seksjonen** har nå `background: var(--navy)` med lys tekst — gir siden én tydelig mørk rytme-seksjon mellom de lyse. Alle under-elementer (event-rader, knapper, toolbar, feil-bokser) tilpasset mørk bakgrunn. Gjelder begge moduser (marine legger `.events` til re-tokeniserings-listen slik `.fadder` gjør).
- **`index-admin.html`:** «Se hjem»-lenken fikset — `target="_blank"` fjernet (blokkeres av iframe-sandbox).
- **`oppslag-content.js`:** nytt `done`-felt (`false`/`true`) per plakat (arkivstatus). Bakoverkompatibelt: manglende felt = aktiv.

**18.06.26 — «Om oss» fikk sin egen admin (én admin per side)**
- Splittet innholdet: `index-content.js` dekker nå **kun Hjem** (hero + kontakt); ny **`om-content.js`** (`window.OM_CONTENT`) dekker **Om oss** (om + faq).
- Nye renderere: `apeiron-index.js` trimmet til hero/kontakt; ny **`apeiron-om.js`** gjengir om/faq på `om-oss.html` (preview-protokoll `apeiron-om-preview`).
- **To separate admin-paneler:** `index-admin.html` (Hjem: hero + kontakt → `index-content.js`) og ny **`om-oss-admin.html`** (Om oss: «Hva er apeiron?» + FAQ → `om-content.js`). Hver med egen live-preview; krysslenket i topplinja.
- `om-oss.html` laster nå `om-content.js` + `apeiron-om.js` i stedet for index-filene.
- Den korte FAQ-en ved siden av Kontakt på Hjem er nå redigerbar i **Hjem-admin** (egen liste under Kontakt) — `kontakt.faq` i `index-content.js`.
- **Forhåndsvisning:** begge admin viser nå siden i ekte proporsjoner — hele desktop-layouten skalert så den fitter i bredden, i en høyere boks (var enten nedskalert for smått eller 1:1 som ikke fikk plass).

**18.06.26 — Ny «Om oss»-side + forsiden ryddet til nytte-først «Hjem»**
- **Forsiden = «Hjem»:** Oppslagstavla løftet helt opp (der «Om oss» lå), så «hva skjer nå» møter deg først. Hero fikk en diskré bro «Ny her? Bli kjent med Apeiron →».
- **Ny side `om-oss.html`** samler «bli kjent»-innholdet: Hva er Apeiron, Fellesskap & samarbeid, Lesesalen, full FAQ og en utfyllende «Bli medlem».
- **Begge publikum dekket:** Hjem beholder en kompakt «Bli medlem» (pris + steg) og en kort FAQ (3 praktiske + lenke til Om oss); Kontakt blir på Hjem.
- **Meny:** ny «Hjem» først; «Studiene» foldet inn under «Om oss»-nedtrekket; nytte-først rekkefølge. Footer, søk og adresse-velgeren i `meny-admin.html` oppdatert; alle `index.html#om / #samarbeid / #lesesalen` repekt til `om-oss.html#…`.
- **Egne admin-paneler:** Hjem (hero + kontakt) og Om oss (om + faq) har nå hver sin admin med egen live-preview (se neste oppføring over).

**18.06.26 — Justeringer etter gjennomgang**
- **«Bli medlem» tilbakestilt** til den fyldige vinrøde stripa (fordeler + kort) på Hjem — den kompakte varianten ble for stusselig.
- **Bakgrunnsrytme:** Oppslagstavla-båndet på Hjem fikk dypere pergamenttone (`--paper-2`) så det ikke smelter sammen med Arrangementer.
- **Om oss:** «Ofte stilte spørsmål» flyttet under «Bli medlem», og ny **«Møt styret»**-seksjon (Styret · Tillitsvalgte · Verv) lagt til som veiviser mot styret-siden.

**18.06.26 — B4: Logikk Panikk & Logikk Drikk på oppslagstavla**
- Begge mottatte plakatene lagt inn på **Oppslagstavla** (`oppslag-content.js`): «Logikk Drikk» (årets siste, Den gode nabo) og «Logikk Panikk» (hver mandag 14–16 på Låven). Plakatbildene ligger i `assets/logikk-panikk/`.
- Seed-plakaten «Symposion» fjernet, og «Fadderuke 2026» flyttet ett hakk fram. Redigerbart videre i `oppslagstavla-admin.html`.

**15.06.26 — Visuelle bugfikser og nav-opprydding**
- **Nav-overflyt fikset:** menyen fløt over (~93 px) og klippet søkeknapp og fargebryter på 1184 px-skjermer (typisk 13"-laptop). Link-padding redusert, gap strammet, og burgeren bytter til full desktopvisning fra 1120 px (var 1080 px). Nav har nå 60 px margin ved 1184 px.
- **«Bli medlem» fjernet fra toppmeny:** CTA-knappen i navigasjonslinjen fjernet — «Bli medlem» finnes allerede fremtredende i hero-seksjonen. Lenken er beholdt i mobilmenyen (skuffemenyen) for mobile brukere.
- **WIP-banneret gjort gjennomsiktig:** det animerte advarselsbåndet (gule/svarte striper) er byttet ut med et diskret, gjennomsiktig tekstboks som flyter over hero-bakgrunnen. Lett å fjerne med én linje i `index.html` når siden er klar.
- **«Bla ned»-hintet:** lagt til `white-space:nowrap` så teksten alltid står på én linje.
- **Lesesalen lightbox — løp-betingelse fikset:** den asynkrone bildescan-funksjonen kunne nå `getElementById('lsLbClose')` før lightbox-markupen helt nederst i `<body>` var parset, og kaste en ubehandlet `Promise`-feil. Fikset ved å vente på `DOMContentLoaded` + lagt til null-guard.

**14.06.26 — «Trådløse» nyheter/hastebeskjeder på forsiden**
- **Nyheter uten å røre koden:** forsiden henter nå nyheter live fra et Google Sheet «Apeiron Nyheter» (`apeiron-news.js` + `news-config.js`), redigerbart fra mobil/PC. Endringer er synlige innen cache-vinduet (~3 min). Eget, separat regneark og eget Apps Script (egen `/exec`-URL), helt adskilt fra merch.
- **Fem plasseringer:** stripe under menyen (`topp`), `hovedoppslag` (boks i forsidebildet), og inne i seksjonene Arrangementer, Aporetisk Aften og Fadderuke. Velges per nyhet i arket.
- **Hastegrad + tidsvindu:** `Hast` gir vinrød markering; valgfrie `Fra`/`Til`-datoer (`åå.mm.dd`, år.måned.dag) styrer når nyheten vises; fjernet avhuking i `Synlig` skjuler uten å slette.
- **Enkel formatering, XSS-trygt:** `**fet**`, `*kursiv*`, `_understrek_`, `[tekst](url)` og linjeskift. All tekst escapes før markup; lenke-protokoller valideres.
- **Feiler stille:** mangler endepunkt/ark eller feiler henting, vises forsiden som før uten bannere.
- **Bot-filter + buffer:** valgfritt `NEWS_TOKEN` (samme i `news-config.js` og Apps Script) stopper dumme skrapere, og 3-min buffer demper hamring. Token-en er et bot-filter, ikke sikkerhet (den ligger åpent i klient-koden); endepunktet er kun-lese og innholdet er offentlig uansett.
- `docs/apps-script-oppsett.md` utvidet med «Nyheter»-guide (arkoppsett, `doGet`-kode, datoregler, formateringskoder).

**14.06.26 — Merch: flere bilder pr. produkt, fargekobling og crop/zoom**
- **Bildegalleri pr. produkt:** merch-admin har nå et galleri i stedet for ett bildefelt. Last opp flere bilder, slett, rotér (90°) og dra for å endre rekkefølge. Hovedbildet = første bilde. Datamodellen utvidet med `images[]` og `colorImages` (bakoverkompatibelt - `img` migreres og holdes synket til `images[0]`).
- **Fargekoblede bilder:** hvert bilde kan knyttes til en farge i admin. I butikken byttes hovedbildet automatisk når kunden velger den fargen, og handlekurven bruker det fargekoblede bildet som miniatyr.
- **Butikk-galleri:** produktkort med flere bilder viser en miniatyrstripe under hovedbildet; klikk for å bytte.
- **Crop/zoom-editor:** ⛶-knapp på hver miniatyr åpner en editor (dra for å flytte, glidebryter eller scrollhjul for å zoome) som beskjærer til kvadrat og baker resultatet inn i bildet.
- Ny `footer-icons.js` med felles ikonsett (se forrige oppføring).
- Ny seksjon «Kjente begrensninger og usikkerheter» i README.

**14.06.26 — Delt meny og footer, footer-admin, kurv-fiks og bedre dra-sortering**
- **Felles meny (ett sted):** header-menyen og mobilmenyen bygges nå i `site-chrome.js` og injiseres på alle 8 offentlige sider via `<div id="site-nav">`. Slutt på å vedlikeholde samme meny i 8 filer.
- **Felles footer (ett sted):** footeren bygges av `site-chrome.js` fra data i `site-content.js` og injiseres via `<div id="site-footer">`. Sosial-rad lagt til: GitHub, Facebook, Instagram og meme-Instagram.
- **Ny `footer-admin.html`:** passordbeskyttet panel (samme mønster som de andre) for å redigere footeren fritt - navn, tagline, copyright, generelle lenker (legg til / fjern / dra-sorter), sosiale lenker med ikon, og «Rapporter en feil»-tekst/e-post. Eksporterer `site-content.js`. Live forhåndsvisning innebygd.
- **«Du er her»-markering virker overalt:** nav-logikken (aktiv-markering, dropdown-scrollspy, mobilmeny, sticky) lå tidligere kun i `app.js` på forsiden. Flyttet til `site-chrome.js` så den kjører på alle sider - «Styret» (og øvrige) highlightes nå korrekt på undersidene. `app.js` beholder forside-innhold (FAQ, scroll-reveal, statistikk-teller).
- **Handlekurv-kryss synlig:** kurv-skuffen lå under den faste menyen, så toppen (med ×) ble skjult. Hevet `.cart-overlay`/`.cart-drawer` over menyens z-index.
- **Bedre dra-sortering:** `AdminCommon.enableDragSort` skrevet om - det dratte kortet løftes og følger pekeren, en plassholder viser hvor det lander, listen auto-scroller mot topp/bunn, og en liten terskel skiller klikk fra dra. Gjelder alle admin-paneler.
- **`report.js`:** leser nå e-post/emne fra footer-lenken (som settes i footer-admin) i stedet for fast verdi.
- **Footer-admin finpuss:** felles ikonsett `footer-icons.js` (GitHub, Facebook, Instagram, YouTube, TikTok, Discord, LinkedIn, X, e-post, nettside) som både footeren og ikon-velgeren deler; `?`-hjelpebobler på alle felt (bl.a. forklaring av hvordan Adresse fungerer).
- **Handlekurv:** innholdet flyttet litt ned (større topp-padding) så det sitter mer midt på skuffen og klarer headeren.
- *Gjenstår:* flere/farge-koblede bilder per produkt og interaktiv crop/zoom (egen runde, krever testing i nettleser); eget header/meny-admin; live forhåndsvisning i øvrige admin-paneler.

**14.06.26 — TODO-opprydding: sikkerhet, medlemspris, dra-sortering og badge-/fargefikser**
- **Sikkerhet:**
  - XSS («DOM text reinterpreted as HTML») tettet: `esc()` i `merch-cart.js` escaper nå også anførselstegn, og tall (antall/pris) tvinges til `Number` i attributter (`merch-cart.js`, `medlemskap-admin.html`, `merch-admin.html`). De øvrige flaggede stedene var allerede escapet.
  - API-nøkkel: bekreftet at koden allerede er ren (`apeiron-fadder.js` bruker `window.GOOGLE_API_KEY`); GitHub-varselet kom fra git-historikk. Nøkkel rotert og lagt inn i Cloudflare.
  - `.github/dependabot.yml` lagt til (GitHub Actions, ukentlig).
- **Admin «Logg ut»:** sender deg nå til den offentlige siden i stedet for å låse deg på passord-gaten (`admin-common.js`).
- **Dra-og-slipp sortering:** ekte dra-sortering av kort i ALLE admin-paneler via ny delt `AdminCommon.enableDragSort` (merch, styret, begrep, medlemskap, hjelp). Tidligere fantes kun ↑/↓-knapper.
- **Merch — medlemspris:** avhukingsboks «Jeg er medlem» i handlekurven; normalpris vises først, medlemspris under; total og bestillings-payload er medlems-bevisste. `docs/apps-script-oppsett.md` oppdatert med «Medlem»-kolonne og medlems-felt.
- **Merch — info-banner:** redigerbart info-felt øverst i butikken, styrt fra merch-admin (`window.MERCH_INFO`).
- **Merch-admin eksport:** fjernet File System Access-direktelagring som feilet på enkelte systemer (Linux) og ga to lagre-dialoger; nå alltid én ren nedlasting.
- **Badge-fikser:** badge/glød hevet over produktbildet; badgen ligger nå over gløden (glød vises som skjær rundt kantene); «Egendefinert» badge har alltid farge (fallback vinrød); **ny egen tekstfarge-velger** for badgen (lys/mørk).
- **Bilde-rotasjon:** roter-knapp (90°) på produktbilder i merch-admin.
- **Farger/palett:** tydeligere Skoggrønn, klarere skille mellom Blå og Marineblå, bedre Rødbrun mørk-variant; fargeswatch viser nå delt lys/mørk; egne lys/mørk-gradienter for animert glød.
- **Handlekurv:** fjern-/lukk-kryss tydeligere i lys og mørk modus.
- **«Rapporter en feil»:** åpner nå en liten boks (kopier e-post / åpne e-post) i stedet for å hoppe rett til e-postklienten — ny `report.js` på alle sider.
- **Aporetisk Aften:** lange «Hvor»-adresser vises som «Se adresse»-lenke til kart.
- **Mobil:** berøring av bilder blokkerer ikke lenger scroll/sveip (index/Lesesalen og Galleri) — `touch-action: none` avgrenset til aktiv reframe i `image-slot.js`.
- **Hjelp:** «Legevakt» utdypet til også å gjelde akutte psykiske plager/kriser.
- *Gjenstår fra denne runden:* flere/farge-koblede bilder per produkt, og interaktiv crop/zoom (rotasjon er gjort).

**14.06.26 — Merch-bestilling, admin-fundament og diverse fikser**
- **Merch-bestilling med handlekurv:** ny handlekurv på merch-siden (`merch-cart.js`) med valg av størrelse/farge/antall, produktbilder, «tøm kurv» og tydelig kvittering. Bestillinger sendes til et **Google Apps Script** som skriver til et **Google Sheet** (med pris per linje + totalsum) og varsler styret på e-post. Faller tilbake til e-post hvis endepunkt mangler. Oppsett dokumentert i `docs/apps-script-oppsett.md`.
  - **Spam-beskyttelse:** delt token (`MERCH_ORDER_TOKEN` / `ORDER_TOKEN`) + skjult honeypot-felt.
  - Innstillinger samlet i `merch-config.js` (endepunkt, Vipps-info, token). Betaling via Vipps gjort tydelig i kurven og i «Slik bestiller du».
  - Varianter (`sizes`/`colors`) lagt til produktskjemaet og merch-admin.
- **Delt admin-fundament (`admin-common.js` + `admin-common.css`):** felles innlogging, «Logg ut»-knapp, varsler og «?»-hjelpebobler på tvers av alle admin-paneler.
  - **Fikset innloggingsbug:** innlogging deles nå mellom alle admin-sider (localStorage), og auto-innlogging kjører riktig ved gjenåpning.
  - **Direkte lagring til repo-fila:** ved lokal kjøring (localhost) kan admin skrive datafila rett til den lokale repo-fila i stedet for nedlastingsmappa, så man kan teste før push.
- **Medlemskap:** priser er nå admin-redigerbare med to nivåer (ett studieår / hele studietiden) via `medlemskap-admin.html` → `membership-config.js`, vist på forsiden via `membership.js`.
- **«Om aftenen»:** Aporetisk Aften henter nå beskrivelsen fra kalenderhendelsen.
- **Merch-badge:** preset og egendefinert tekst slått sammen til ett valg; «Begrenset»/«Nyhet» virker nå uavhengig av tekst. Nytt eget glød-/fargevalg på badgen (lys/mørk).
- **Mindre fikser:** GitHub-lenke i footer på alle sider, prisfelt skjules når tomt, dropdown-meny markerer riktig side (inkl. Styret), Netlify → Cloudflare i admin-tekster, mobiltilpasning av handlekurven.

**14.06.26 — Merch: fritt fargevalg, animert kortkant og redigerbar knapp**
- Fritt fargevalg (palett / miks / rå hex, med lys+mørk) for badge, kortkant og «Bestill»-knapp i `merch-admin.html`.
- Animerte glød-presets rundt hele produktkortet (Aurora / Ember / Neon / Regnbue, hver i dempet og tydelig). Implementert som et wrapper-element (`.pglow`) med `::before` utenfor kortets `overflow:hidden`, slik at gløden blir en ekte lysende kant rundt kortet og ikke lyser gjennom fyllet. Egendefinert kantfarge gir en rolig puls i valgt farge.
- Badge-type gjort meningsfull: hver type har nå distinkt farge (Bestselger = gull, Nyhet = grønn, Begrenset = rust). Tidligere så Bestselger og Begrenset identiske ut. Fri badge-farge overstyrer typen.
- Redigerbar knappetekst (f.eks. «Bestill» → «Utsolgt») via nytt tekstfelt i admin.
- `@media (prefers-reduced-motion: reduce)` demper/stopper alle glød-animasjoner.

**14.06.26 — Felles fargesystem med lys/mørk-varianter for admin**
- Ny fil `palette.js`: én kilde til sannhet for alle navngitte farger, hver med kuratert lys- OG mørk-variant. Lastes før render-scriptene på offentlige sider og før admin-koden. Erstatter fire tidligere duplikate fargedefinisjoner (member-tag-klasser, stripe-klasser og to `ACCENT_HEX`-tabeller).
- Tre frihetsnivåer i ett delt admin-element (`createColorControl`): velg ferdig tema (gir lys+mørk automatisk), miks lys og mørk hver for seg, eller skriv inn rå hex via fargehjul (`<input type="color">`). Per-modus.
- Alle farger rendres nå via inline CSS-variabler (`--c-l`/`--c-d`) som `html[data-mode]` plukker automatisk — ingen egne override-regler per farge.
- `resolveColor()` håndterer alle dataformer bakoverkompatibelt: temanavn (string), `{light,dark}`-objekt og rå hex — eksisterende data trenger ingen migrering.
- Rullet ut i `styret`/`styret-admin` (member-tags + vervkort-aksent), `hjelp`/`hjelp-admin` (kort-aksent) og `begrep`/`begrep-admin` (podkast-kort, bruker palettens mørk-variant siden siden alltid er mørk).

**13.06.26 — Kalender-feilstater: API-feil vs. tom kalender**
- Alle tre kalender-integrasjonene skiller nå tydelig mellom API-nøkkel ugyldig/ikke satt (innrammet ⚠-melding med lenke til README og kontaktsiden) og tilkoblet kalender uten hendelser (vennlig «kommer snart»-melding).
- Arrangementer: alle tre visninger (Liste, Rutenett, Oversikt) dekket. Filterknapper skjules ved API-feil. Bug-aktig statusbanner fjernet. Rutenett-meldingen sentrert over alle kolonner.
- Aporetisk Aften: «Når»-feltet viser «—» ved API-feil og «Dato kommer» ved tom kalender. Genererte torsdagsdatoer vises ikke lenger ved API-feil.
- Fadderukene: skjelett-plassholderen erstattet med feilmelding ved API-feil.

**13.06.26 — Fullstendig CSS-tokenmigrering og mørk-modus-opprydding**
- Temalogikken er nå helt flyttet ut av `app.js` og inn i `theme.js`, som lastes blokkerende i `<head>` på alle 7 offentlige sider — eliminerer blink (FOUC) ved oppstart i mørkt tema.
- Alle `body[data-mode="marine"]`-selektorer i `styles.css` migrert til `html[data-mode="marine"]`, slik at temaet er satt før `<body>` rendres.
- Seks nye semantiske CSS-tokens i `:root`: `--card` (korter/hevede flater), `--line` / `--line-2` (kanter), `--fill-soft` (svakt hover-fyll), `--on-dark` (konstant lys tekst på alltid-mørke flater), `--warm` (varm aksent — vinrød i lyst tema, gull i mørkt). Alle flippes automatisk i marine-modus.
- Alle hardkodede `rgba(35,39,64,...)` i `styles.css`, `galleri.html`, `hjelp.html`, `merch.html`, `pensum.html`, `marked.html` og `styret.html` erstattet med semantiske tokens (`var(--line)`, `var(--fill-soft)` osv.).
- Alle `color:var(--maroon)` på tekst/ikoner/kanter migrert til `color:var(--warm)` (gjelder 40+ steder) — aksentfargen skifter nå automatisk til gull i mørkt tema uten egne override-regler.
- `var(--navy)` på løpende tekst migrert til `var(--ink)` (tema-bevisst token) gjennom alle undersider.
- `var(--paper)` på tekst over alltid-mørke flater byttet til `var(--on-dark)` (konstant lys, flippes ikke).
- `var(--paper-2)` på kortbakgrunner byttet til `var(--card)`.
- Re-pin-blokk i `styles.css`: sikrer at alltid-mørke flater (`.hero`, `.nav`, `.drawer`, `.footer`, `.join` m.fl.) beholder lyse tekst-tokens også i marine-modus.
- `@media (prefers-color-scheme: dark)`-blokken i `styles.css` fjernet — systempreferansen håndteres nå eksklusivt av `theme.js` ved oppstart.
- Kalt: gull-tonet varselboks for `.is-offline`-meldinger i marine-modus (erstatter den røde).
- `hjelp.html`: `akutt-card--life` (livstruende numre) får mørk vinrød bakgrunn i marine-modus.

**13.06.26 — Fullstendig mørk modus («marine») for alle offentlige sider**
- Ny fil `theme.js` lastes blokkerende øverst i `<head>` på alle 7 offentlige sider (`index`, `pensum`, `styret`, `galleri`, `hjelp`, `merch`, `marked`) slik at temaet settes før første paint og blinking (FOUC) unngås. `begrep.html` er bevisst utelatt.
- Mørk modus aktiveres nå globalt via `data-mode`-attributt på `<html>` (ikke `<body>`) og virker på navigasjon, skuff/mobilmeny og alle undersider.
- Semantisk token-refaktor i `styles.css`: nye tokens `--card`, `--line`, `--line-2`, `--fill-soft`, `--on-dark` og `--warm`. I lyst tema er `--warm` = maroon (vinrød); i mørkt tema flippes den til gull, slik at alle aksenter forblir lesbare mot den mørkeblå bakgrunnen.
- Alle `color:var(--maroon)`-referanser migrert til `color:var(--warm)` (31 steder). Alle `body[data-mode="marine"]`-selektorer migrert til `html[data-mode="marine"]`.
- Re-pin-regel sikrer at alltid-mørke flater (hero, nav, skuff, footer, kontaktboks, fadder m.fl.) beholder lys tekst i begge moduser.
- Gull-fyll for heldekkende maroon-chips (`.prog__level`, `.ev-signup`) i mørk modus.
- API-varsler (aporetisk, arrangement, fadder) bruker gull-tonet boks i stedet for rød i mørk modus.
- Standardtema er alltid lyst; brukerens valg huskes i `localStorage`.

**13.06.26 — Begrep-siden: kontakt og bidra slått sammen**
- «Meld interesse»-knappen peker nå til `#kontakt`-seksjonen istedenfor Google Forms.
- «Vil du bidra?»- og «Kontakt»-seksjonene slått sammen til én seksjon med rød Begrep-bakgrunn (`--bg-rust`). Skillet mellom seksjonene er fjernet.
- E-postadressen er gjort større og mer fremtredende i den sammenslåtte seksjonen.
- `begrep-content.js`: `meta.email` lagt til — e-postadressen kan nå redigeres direkte i `begrep-admin.html` og eksporteres med resten av innholdet.
- `begrep-admin.html`: nytt e-postfelt i meta-panelet.

**13.06.26 — Sikkerhet, mørkt tema, påmelding og feilrapportering**
- API-nøkkel for Google Kalender og Google Drive fjernet fra kildekoden. Alle tre kalender-filene (`apeiron-events.js`, `aporetisk-cal.js`, `apeiron-fadder.js`) og galleriet (`galleri.html`) leser nå nøkkelen fra `window.GOOGLE_API_KEY`. På Cloudflare Pages settes nøkkelen som miljøvariabel (`Google_API_Key`) og injiseres automatisk av bygg-kommandoen til `api-config.js`. Lokalt: opprett `api-config.js` manuelt med nøkkelen (filen er gitignorert).
- Lys/mørk modus: toggle-knapp (måne/sol-ikon) lagt til i navigasjonen på alle 8 sider. Brukerens valg lagres i `localStorage`. Ved første besøk respekteres systempreferansen (`prefers-color-scheme`). Det mørke temaet («marine») fantes allerede i CSS — knappen gjør det tilgjengelig for brukerne.
- Arrangementspåmelding: om styret legger en Google Forms-lenke i beskrivelsesfeltet på en kalender-hendelse, vises nå en «Meld deg på»-knapp automatisk på arrangementet. Ingen kodeendring nødvendig fremover.
- Feilrapportering: diskret «Rapporter en feil på nettsiden»-lenke lagt til i footeren på alle 8 sider. Åpner e-postklient med `apeironlinjeforening@gmail.com` og forhåndsutfylt emnefelt.

**13.06.26 — Sjekket ut `github.com/dotkom/monoweb`**
- Sammenlignet med monoweb for å se hva vi kunne lære. Se under for hva vi valgte å implementere fra monoweb.

**13.06.26 — Begrep: «Bestill tidsskrift»-knapp**
- «Utgavene»-seksjonen på `begrep.html` har fått en tydelig «Bestill tidsskrift»-knapp (gull) som åpner bestillingsskjema via Google Forms i ny fane.
- Notisboksen under utgave-gridet er gjort om til en flex-rad: teksten «Ønsker du et eksemplar?» til venstre, og knappen + «Ta kontakt med redaksjonen →» til høyre. Stabler seg pent på mobil.

**13.06.26 — Begrep: bestillingslenke via admin**
- `orderFormUrl` lagt til i `meta`-objektet i `begrep-content.js` — URL-en til bestillingsskjemaet (Google Forms) kan nå redigeres i `begrep-admin.html` og eksporteres med resten av innholdet.
- Nytt felt «Bestillingslenke» i meta-panelet i admin; feltet lastes, lagres og eksporteres automatisk.
- `begrep.html`: «Bestill tidsskrift»-knappen har fått id `bg-order-btn` og henter `href` dynamisk fra `meta.orderFormUrl` — ingen hardkodet URL i HTML-en lenger.

**13.06.26 — Arrangementetikett i galleri-marqueen**
- Hvert bilde i den scrollende bilderemsen øverst på `galleri.html` viser nå et lite overlegg nederst med navnet på arrangementet bildet er fra.
- Implementert ved å bytte fra enkel ID-array til `{id, name}`-objekter i `renderMarquee()` — mappenavnet følger bildet gjennom shuffle og duplisering.
- Lightboxen som åpnes ved klikk i marqueen viser nå riktig arrangementnavn i infolinjen (var tidligere alltid «Galleri»).
- Nye mapper i Drive plukkes automatisk opp — ingen kodeendring nødvendig.

**13.06.26 — README-opprydding og galleri-dokumentasjon**
- Fjernet duplikat «Hjelp & ressurser»-seksjon i README (gammel versjon som fortsatt beskrev hjelp.html som hardkodet).
- Galleri-seksjonen i README fullstendig omskrevet: forklarer nå riktig tre-nivå-struktur (hovedmappe → skoleår → arrangement → bilder), at forsidebildet styres av filnavn-alfabetisk rekkefølge, at løse bilder i skoleår-mapper hoppes over, og at fane-sortering er automatisk baklengs.

**13.06.26 — Hjelp-admin og hjelp-content.js**
- Hjelp-siden omgjort til samme mønster som styret/begrep/merch: alt innhold er nå i `hjelp-content.js`, og `hjelp.html` rendres dynamisk fra den.
- Nytt passordbeskyttet admin-panel `hjelp-admin.html`: redigering av alle seksjoner (Si fra, Faglig hjelp, Psykisk helse, Fysisk helse, Akutt hjelp), hurtignav-kortene, nødnumre og alle ressurskort. Støtter HTML i kontaktlinjer og Si fra-tekst.
- Fil-tabell og seksjonsforklaring i README oppdatert med de nye filene.

**13.06.26 — Menyopprydding Styret og footer-synkronisering**
- Fjernet redundant «Styret»-lenke (→ `index.html#styret`) fra alle nav-dropdowns og skuffemenyer på samtlige 8 sider — den gikk til samme sted som dropdown-triggeren.
- «Apeiron styret» er nå første element i Styret-dropdownen; ny lenke «Verv» (→ `styret.html#vervene`) lagt til sist i alle dropdowns og skuffemenyer.
- Fjernet «Styret 2025/26»-seksjonen fra forsiden (`index.html`) — innholdet finnes på `styret.html`.
- Alle footere synkronisert: brutt «Styret»-lenke (→ `index.html#styret`) fjernet, «Verv» lagt til på alle 8 sider. `hjelp.html` manglet S.A.K — lagt til.
- «Tilbake til Styret»-lenken øverst på `styret.html` pekte på den nå fjernede seksjonen — endret til «Tilbake» (→ `index.html`).

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

**13.06.26 — Visuell finpuss på forsiden og styret-siden**
- Forsiden (`index.html` / `styles.css`): myk fokusring for tastatur, stat-tall som teller seg opp når de kommer i syne, jevnere hover på kort (Om oss, studieretninger, samarbeid), finere lenke-detaljer, mykere marquees med fade-kanter, og litt mer dybde i hero-bakgrunnen. Alt respekterer «reduser bevegelse».
- Lyse pixler (støyartefakter) fjernet fra alle hero-bakgrunner: 5 artefakter på forsiden (to nede, én under «etterpå», én over «linjeforening siden», én over Apeiron-logoen) og tilsvarende på øvrige sider.
- Styret-siden (`styret.html`): hover-løft på vervkort og styremedlem-portretter, og samme diskré stjernedryss i topp-banneret som på forsiden.
- README oppdatert: styret-seksjonen beskriver nå admin-panelet (`styret-admin.html` + `styret-content.js`).

**13.06.26 — Hjelp-side, kontaktinfo og footer-oppdatering**
- Ny side `hjelp.html`: tre seksjoner med Si fra! (NTNUs varslingssystem med 6 kategorier forklart), faglig hjelp (PTV/ITV/FTV med synlige e-postadresser), og psykisk helse (SIT Helse og Rask psykisk helsehjelp med innhold hentet direkte fra sidene).
- "Hjelp" lagt til i navigasjon (desktop og mobilmeny) og footer på alle 7 sider.
- `begrep.html`: `begreptidsskrift@gmail.com` vist som lesbar tekst i kontaktseksjonen.
- `styret.html`: FTV- (`ftv@hf.ntnu.no`) og ITV-e-posten (`hf-ifr@studentrad.ntnu.no`) skilt ut som tydelige kontaktlinjer under hvert TVene-kort.
- Alle footere synkronisert: alle sider har nå samme komplette lenkesett (Begrep, Apeiron styret, Tillitsvalgte, Hjelp m.m. var manglende på flere sider).

**13.06.26 — Begrep-hero lesbarhet, "Apeiron styret" og menylenke**
- Begrep-siden (`begrep.html`): eyebrow og undertekst i hero byttet fra mørk brungrå (`#7a7060`) til `rgba(240,236,224,.6)` — merkbart bedre lesbarhet mot den mørke bakgrunnen.
- "Om vervene" omdøpt til "Apeiron styret" i alle nav-dropdowns, mobilmenyer, footere, CTA-knapp på forsiden og `<h1>`/`<title>`/`og:title` i `styret.html`.
- "Styret"-triggeren i toppmenyen peker nå direkte på `styret.html` i stedet for `index.html#styret` — i alle 7 HTML-filer.

**13.06.26 — Menyrestrukturering, bugfikser og kalender-tomtilstander**
- Desktop-navigasjon omstrukturert: 9 toppnivå-elementer med ryddige dropdowns — Om oss▾ (Om oss / Lesesalen / Samarbeid), Studiene▾, Arrangementer▾ (Arrangementer / Aporetisk Aften / Fadderuke), Styret▾ (Styret / Om vervene / Tillitsvalgte / S.A.K), Begrep, Galleri, Merch▾ (Merch / Kjøp & bytte), Kontakt, Bli medlem.
- Mobilmeny omgjort: søke-ikon vises nå direkte i topplinja (var skjult), skuffemenyen er komprimert med gruppeetiketter (FORENINGEN / STUDIENE / ARRANGEMENTER / STYRET / MER) i gullfarge. Hele menyen får plass på korte skjermer (≤700px høyde) uten scrolling.
- Bugfikser: S.A.K-lenker pekte feil (`index.html#sak` → `styret.html#sak`) i alle 5 undersider og søkeindeksen; fadder-footer-knapp pekte på feil anker; kontaktlenke pekte på Netlify i stedet for Cloudflare Pages; «Hilberts Hotell» rettet til «Hilbert Hotell»; «Bli Medlem»-siden viste feilaktig «Lesesalen» som aktiv menylenke.
- Interne vitser fjernet: Dennis/Iver-FAQ-spørsmål slettet, frisen byttet fra «jeg kan ikke lese» til «det gode liv».
- Kalender-tomtilstander: alle tre Google Kalender-integrasjonene (`apeiron-events.js`, `apeiron-fadder.js`, `aporetisk-cal.js`) skiller nå mellom API-feil (viser genererte plassholderdatoer for utviklere) og API-suksess uten hendelser (viser brukervennlig «dato kommer»-melding).
- Søkeindeks utvidet: Lesesalen, Galleri og Fellesskap & samarbeid lagt til som søkbare sider.

**13.06.26 — Domene-oversikt i README**
- README oppdatert med strukturert oversikt over domene-alternativer: tilgjengelighet, priser og registrarer (Loopia, Domeneshop, Cloudflare Registrar).
- Dokumentert status for NTNU-subdomenet (`apeiron.org.ntnu.no`) og SFTP-tilgang.

**12.06.26 — Begrep-siden, styret-siden og diverse**
- Ny side for Begrep-tidsskriftet (`begrep.html`): eget mørkt visuelt uttrykk (svart/gull/rust), seksjoner for utgaver, podkast, film (Grev van Orton) og julekalender (Hilberts Hotell), statistikk-stripe og lenker til sosiale medier.
- Nytt passordbeskyttet admin-panel (`begrep-admin.html`) + datafil (`begrep-content.js`) for å redigere alt innhold på Begrep-siden uten å røre kode — fungerer likt som merch-admin.
- Lagt til bilder for Begrep-utgaver (`assets/begrep/`).
- Ny side for styret og vervbeskrivelser (`styret.html`) med tilhørende admin-panel (`styret-admin.html`) og datafil (`styret-content.js`).
- Begrep, Galleri, Merch, Marked og Pensum fikk søkestøtte (`site-search.js`).
- Fjernet ubrukte prototypefiler (`tweaks-panel.jsx`, `tweaks.jsx`).
- Fjernet for store bildefiler fra merch-assets.

**12.06.26 — Lesesalen-lysbildefremviser og Cloudflare**
- Lesesal-bildene utvidet til 18 bilder (`lesesal7–18.jpg`), med oppdaterte høyere kvalitetsversjoner av de første.
- Lysbildefremviser (lightbox) lagt til lesesal-seksjonen på forsiden — klikk på bilde for å bla gjennom alle.
- Galleriet redesignet med forbedret layout og navigasjon.
- Migrert fra Netlify til **Cloudflare Pages** (`netlify.toml` fjernet, `_headers` lagt til for HTTP-sikkerhetsheadere). Automatisk deploy fra GitHub gjelder fortsatt.

**11.06.26 — Galleri og Lesesalen**
- Nytt bildegalleri (`galleri.html`) med Google Drive-integrasjon: mapper i Drive = event-kort i galleriet, automatisk henting via API, år-faner og lysbildefremviser.
- Lesesalen-seksjonen lagt til forsiden med tekst, ikonliste og bildestripe (de første lesesal-bildene `lesesal1–6.jpg`).
- Forbedringer i `styles.css` for galleri og lesesal-layout.
- `marked.html`, `merch.html` og `pensum.html` fikk navigasjons- og søkeforbedringer.

**11.06.26 — Styrebilder og merch-system**
- Portrettbilder lastet opp for alle styremedlemmer (`assets/Styremedlemmer/`): Anna, Dagny, Dennis, Fredrik, Helene, Iver, Karoline, Martin, Natalie, Robin, Stian.
- Styremedlemmer lagt inn på forsiden med bilder, initialer og roller.
- Nytt merch-system: `merch-admin.html` (passordbeskyttet admin-panel) og `merch-products.js` (datafil). Merch-siden omskrevet til å lese fra datafilen — ingen kodeendring nødvendig for å legge til/endre produkter.
- Søk (`site-search.js`) fikset og rullet ut til Merch og Pensum.

**11.06.26 — Første opplastning av nettsiden**
- Første versjon av hele nettstedet lastet opp: forsiden (`index.html`) med hero, Om oss, Studiene, Arrangementer, Aporetisk Aften, Fadderuke, Styret, Lesesalen, Bli medlem, Kontakt og footer.
- Alle undersider: `pensum.html`, `merch.html`, `marked.html`.
- Alle kjerne-JS-filer: `apeiron-events.js` (Google Kalender-integrasjon), `apeiron-fadder.js`, `aporetisk-cal.js`, `app.js`, `image-slot.js`, `site-search.js`.
- Komplett `styles.css` med hele det visuelle systemet (navy/gull/vinrød/pergament, serif-typografi).
- JSX/React-prototype forkastet til fordel for ren statisk HTML/CSS/JS.

---

© 2026 Apeiron Linjeforening
