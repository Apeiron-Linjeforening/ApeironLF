## Siste endringer

**06.07.26 · Dokumentasjon: brukerveiledningen skilt ut i egen `BRUKERVEILEDNING.md` — README er nå en kort landingsside**

- **`BRUKERVEILEDNING.md` (ny):** hele redaktørveiledningen fra README (Admin-senteret, publisering, «Hva styrer hva», kalender/fadderuke, galleri) + to nye deler: en «Hva vil du gjøre?»-tabell øverst og en **Feilsøking**-seksjon med de vanligste spørsmålene (ser ikke endringen min, får ikke publisert, konfliktvarsel, angre publisering, mistet utkast, arrangement/galleribilder vises ikke). Fem skjermbilder av admin er lagt inn (`assets/docs/admin-{oversikt,redigering,forhandsvisning,publisering,endringer}.webp`), og README har fått skjermbilde av forsiden (`assets/docs/forside.webp`).
- **Dokumentasjonen matcher nå den faktiske admin-toppen:** knappen omtales som **☁ Publiser** (ikke «☁ Publiser til GitHub») og innlogging som **Logg inn**; «… upubliserte endringer»-oversikten og **↺ Angre alle** er beskrevet; «Panelvisning» refereres til Innstillinger (⚙), ikke Oversikt.
- **`README.md` slanket til landingsside:** hva prosjektet er + «Hva vil du gjøre?»-triage + dokumentasjonstabell + «Slik er nettsiden bygd», SEO og kjente begrensninger. «Vibrasjonskoding»-linja flyttet ned til bunnen; Plan F-notatet flyttet til VEDLIKEHOLD → «Vedlikehold av dokumentasjonen».
- **Referanser oppdatert:** VEDLIKEHOLD (3 steder + dok-tabellen), eierskaps-malen (sjekklista), admin.html (snarveien «Veiledning» peker nå på `BRUKERVEILEDNING.md`, samt kodekommentar), og `md-links.yml` sjekker den nye fila. Verifisert med lokal lenke-/ankersjekk over alle `.md`-filene.

**06.07.26 · Filstruktur-rydding del 2: innholdsfilene → `content/` — publiseringsstiene i admin-modulene oppdatert tilsvarende**

*Flytting (git mv, historikken følger med)*
- **`content/`** rommer nå alle 17 filene Admin-senteret publiserer: `*-content.js` (begrep, galleri, hjelp, index, marked, news, oppnaelser, oppslag, pensum, site, styret, utmerkelser), `om.page.js`, `nav-content.js`, `merch-products.js`, `membership-config.js` og `admin-shortcuts.js`. Rot har nå bare HTML-sidene + `api-config.js` og topp-dokumentene.
- **`api-config.js` blir fortsatt på rot** — Cloudflare injiserer Google-API-nøkkelen på den stien i prod (kalender/Drive er avhengig av den), og sperrelista i `functions/api/github/commit.js` blokkerer den ved eksakt rotsti.

*Publiseringen følger med (dette er hele poenget med runden)*
- **Hver admin-moduls `exportName`/`saveFile`/`downloadBlob`-sti er oppdatert til `content/…`** — verifisert at alle 17 publiseringsstier peker på eksisterende filer. `functions/` (serverkoden) er uendret; `commit.js` har ingen sti-liste og godtar `content/` som før.
- **Nedlastingsnavn ved manuell eksport:** `downloadBlob` bruker nå siste ledd av stien som filnavn, så manuell nedlasting fortsatt gir `begrep-content.js` (ikke `content_begrep-content.js`). Repostien brukes kun ved publisering. Hjelpetekstene modulene genererer («Erstatt … i GitHub-repoet») viser nå `content/`-stien.
- **iCal/kalender og Cloudflare upåvirket:** kalenderskriptene (`js/apeiron-events.js`, `js/apeiron-fadder.js`, `js/aporetisk-cal.js`) går mot eksterne Google-URL-er og leser nøkkelen fra `window` (api-config) — ingen lokale sti-avhengigheter. `_headers` (CSP), `robots.txt`, `sitemap.xml` og `.gitignore` er uendret.

*Referanser og docs*
- Alle `src`-referanser i HTML-sidene peker på `content/…`; sidescriptene leser som før via `window`-globaler (omtalene der er bare kommentarer).
- Docs: `content/`-stier i README, VEDLIKEHOLD (inkl. nytt mappetre og omskrevet advarsel: innholdsfil og admin-modul må alltid flyttes i takt), TODO og `docs/`. Historiske CHANGELOG-oppføringer står urørt.
- Verifisert med statisk referansesjekk (alle `src`/`href` → eksisterende fil), lokal servertest (200 på alt) og kontroll av alle publiseringsstier.
- **NB etter deploy:** admin-faner som var åpne før deployen må lastes på nytt — en gammel fane ville publisert til de gamle rotstiene. Test med en liten publisering rett etter deploy.
- Berørt: 17 filer flyttet til `content/`, `src`-referanser i alle HTML-sidene, alle `js/admin/modules/*.js`, `js/admin/admin-common.js` (nedlastingsnavn), `README.md`, `VEDLIKEHOLD.md`, `TODO.md`, `docs/admin-arkitektur.md`.

**06.07.26 · Filstruktur-rydding: CSS → `css/`, sidescript → `js/`, admin-kode → `js/admin/` — publiseringen urørt**

*Ny mappestruktur (alt flyttet med `git mv`, så historikken følger med)*
- **`css/`** — `styles.css`, `hero-gallery.css`, `admin-common.css`, `admin-modules.css`.
- **`js/`** — alle renderere og sidescript (`apeiron-*.js`, `site-chrome.js`, `theme.js`, `palette.js`, `section-engine.js`, `om-sections.js`, `search-*.js`, `site-search.js`, `membership.js`, `merch-cart.js`, `merch-config.js`, `image-slot.js`, `footer-icons.js`, `report.js`, `app.js`, `aporetisk-cal.js`).
- **`js/vendor/`** — `minisearch.min.js` (tredjepartsbibliotek for seg).
- **`js/admin/`** — `admin-common.js`, `admin-panel-shell.js`, `admin-github.js`, `admin-image-editor.js`; **`admin-modules/` → `js/admin/modules/`**.
- Rot gikk fra ~60 løse filer til HTML-sidene + innholdsfilene.

*Bevisst IKKE flyttet (publiseringen fungerer nøyaktig som før)*
- **Alle HTML-sidene blir på rot** — URL-ene til de publiserte sidene er uendret (sitemap/SEO/bokmerker upåvirket).
- **De 17 filene Admin-senteret publiserer til GitHub blir på rot:** `*-content.js`, `om.page.js`, `nav-content.js`, `site-content.js`, `merch-products.js`, `membership-config.js`, `admin-shortcuts.js`. Admin-modulenes `exportName`/`saveFile`-stier er dermed urørt, og `functions/` (serverkoden) er ikke endret med én linje. Verifisert: alle 17 publiseringsstier peker fortsatt på eksisterende filer.
- **`api-config.js` blir på rot** — sperrelista i `functions/api/github/commit.js` blokkerer den ved eksakt rotsti, så en flytting ville svekket vaktholdet.

*Referanse-oppdateringer*
- Alle `src`/`href` i samtlige HTML-sider peker på de nye stiene (`?v=`-stemplene er beholdt).
- Forhåndsvisningene i Admin → Meny/Footer bygger preview-HTML med `css/styles.css`, `js/footer-icons.js` og `js/site-chrome.js`.
- CSS-filene hadde ingen relative `url()`-bildereferanser, så flyttingen til `css/` endrer ingen bildestier.
- Docs: sti-omtaler oppdatert i `README.md`, `VEDLIKEHOLD.md`, `TODO.md` og `docs/`; filstruktur-seksjonen i VEDLIKEHOLD har fått mappetre + advarsel om at rotfilene admin publiserer ikke kan flyttes uten å endre admin-modulene. Historiske omtaler her i CHANGELOG står med vilje urørt.
- Verifisert med statisk referansesjekk (alle `src`/`href` → eksisterende fil) og lokal servertest (200 på alle sider og flyttede ressurser).
- **NB etter deploy:** alle som har admin åpen i nettleseren må laste siden på nytt (nye script-stier); test gjerne med en liten publisering.
- Berørt: 48 filer flyttet, referanser oppdatert i alle HTML-sidene, `js/admin/modules/meny.js`, `js/admin/modules/footer.js`, `README.md`, `VEDLIKEHOLD.md`, `TODO.md`, `docs/admin-arkitektur.md`, `docs/github-publisering-oppsett.md`, `docs/apps-script-oppsett.md`.

**06.07.26 · Dokumentasjonsrydding: faktarettinger, TODO.md, avduplisering og lenkesjekk i CI**

*Faktarettinger (docs hadde seilt fra koden)*
- **CSP-punktet i README fjernet fra «Kjente begrensninger»** — `_headers` har hatt full Content-Security-Policy en stund, og VEDLIKEHOLD beskrev den allerede korrekt. README motsa både koden og VEDLIKEHOLD.
- **Paneltallet spriket tre veier** (README: 16, VEDLIKEHOLD og admin-arkitektur: 13; faktisk: 16 + usynlig `shortcuts`). Tall i løpende tekst er byttet med «alle panelene»; den autoritative lista er filstruktur-tabellen i VEDLIKEHOLD, som nå nevner alle modulene (pensum, galleri, marked, shortcuts manglet) samt `admin-panel-shell.js`, `admin-github.js` og `admin-shortcuts.js`.
- **`docs/admin-arkitektur.md` hentet inn til nåtid:** redigeringsløkka viser «☁ Publiser til GitHub» (ikke last-ned + manuell push), git-CMS-seksjonen er omdøpt «G1 (FERDIG)» med det som faktisk er i drift (konfliktsjekk, «Sist publisert», angre-publisering), veikartet har G1 som ✅ steg 2, og PanelShell er beskrevet.
- **Duplisert Apps Script-kode fjernet fra VEDLIKEHOLD** — kopien der hadde driftet (7 kolonner, uten `Medlem`-feltet). Koden og kolonneoverskriftene vedlikeholdes nå **kun** i `docs/apps-script-oppsett.md`; VEDLIKEHOLD lenker dit.

*Struktur og nye filer*
- **Ny `TODO.md`:** to-do-lista og hele Domene-seksjonen (redirect-sjekk + pristabell, nå datostemplet) er flyttet ut av README, så «utstillingsvinduet» slipper git-støy. Nytt punkt: arkivere eldre CHANGELOG-perioder.
- **README:** komplett dokumentasjonstabell (la til eierskaps-malen, publiserings-oppsettet og TODO.md, med «For hvem»-kolonne) og kort håndskrevet innholdsfortegnelse i stedet for den auto-genererte (duplikater, selvreferanse, døde ankre).
- **`docs/g1-oppsett.md` → `docs/github-publisering-oppsett.md`** (git mv). «G1» var internt kodenavn for første Git-milepæl («Lagre = commit») og sa ingenting om innholdet; fila har en note om det gamle navnet, og alle levende referanser er oppdatert (README ×2, VEDLIKEHOLD ×2, admin-arkitektur, eierskaps-mal + privat kopi). Historiske G1-omtaler i denne loggen står urørt. Eksempelverdiene i guiden er byttet til de reelle (`apeironlf.pages.dev`, `Apeiron-Linjeforening/ApeironLF`).
- **Ny seksjon «Vedlikehold av dokumentasjonen» i VEDLIKEHOLD:** én kilde per faktum, datostempling av flyktige påstander, docs-sjekk ved styreskifte (nytt punkt i eierskaps-sjekklista).
- **Ny CI: `.github/workflows/md-links.yml`** — lychee-lenkesjekk av interne lenker/ankre i .md-filene ved hver push/PR som endrer dem (`--offline`, så eksterne URL-er aldri gir røde kryss; CHANGELOG og `docs/changelog-arkiv/` er utelatt med vilje).
- Småplukk: skrivefeil i eierskaps-malen («nnår»), komma i «spør styret …»-setningen, én absolutt lenke gjort relativ.

*Runde to (samme dag)*
- **«📘 Veiledning»-snarveien i Admin → Oversikt peker nå på GitHub-visningen av README** (`…/ApeironLF#readme`). Før pekte den på `README.md` på den publiserte siden, som serveres som rå, uformatert tekst — vegg av `**stjerner**` for et ikke-teknisk styremedlem. `data-keep-token` er fjernet fra lenken (tokenet skal ikke ut til eksterne adresser).
- **CHANGELOG arkivert:** juni-oppføringene (11.06–29.06.26, ~130 KB) er flyttet til `docs/changelog-arkiv/2026-06.md` med lenke i bunnen av hovedfila; hovedfila er nå ~30 KB. Arkivene har egen mappe så de ikke fyller opp `docs/` — fremtidige perioder legges som `docs/changelog-arkiv/<ÅÅÅÅ-MM>.md`. Hele mappa er unntatt lenkesjekken (historiske lenker vedlikeholdes ikke); relative lenker i arkivet ble justert etter flyttingen.
- **Åpent designspørsmål flyttet ut av README:** notatet om base64 vs. eksterne merch-bilder i «Kjente begrensninger» er nå et eget punkt i TODO.md — begrensningslista er ren fakta.
- **Flere hardkodede tall fjernet:** «de 14 sidene» / «alle 14 sider» i VEDLIKEHOLD (SEO- og MiniSearch-seksjonene) er byttet med «alle offentlige sider» — samme drift-felle som paneltallet.
- Berørt: `README.md`, `VEDLIKEHOLD.md`, `TODO.md` (ny), `CHANGELOG.md`, `admin.html`, `docs/admin-arkitektur.md`, `docs/github-publisering-oppsett.md` (omdøpt), `docs/apps-script-oppsett.md` (uendret, nå eneste kilde), `docs/eierskap-og-overlevering.template.md`, `docs/changelog-arkiv/2026-06.md` (ny), `.github/workflows/md-links.yml` (ny).

**06.07.26 · Footer-admin: samme forhåndsvisning som meny (kompakt, ut av dokken, fold + mobil + 90-graders)**

*Forhåndsvisning (Admin → Footer)*
- **Flyttet ut av bunn-dokken**, opp mellom «Footer»-hodet (`.aps__head`) og innholdet (`.aps__md`), samme grep som meny. `previewDock` er slått av; skallets egen preview-knapp skjules.
- **Kortere inline-preview:** logo, «APEIRON» og taglinen skjules i desktop-previewen (injisert CSS), så den starter rett på lenkene.
- **«▾ Skjul forhåndsvisning»:** fold-knapp som skjuler previewen for mer redigeringsplass. Knappene i hodet er alltid høyrestilt, også på mobil (der skallet ellers venstrestiller dem fordi `.aps__sp`-spaceren skjules).
- **«📱 Vis mobil»:** åpner footeren i mobilbredde (telefon-ramme, 430px) som overlegg, med branding (den ekte mobil-footeren), og en rød merknad om at footeren varierer mellom mobiler.
- **«🔄 90° visning»** (alltid synlig): åpner footeren rotert 90° som overlegg, slik meny sin roterte visning gjør, så den brede desktop-footeren får plass på en smal skjerm via skjermhøyden. Høyden måles og strimmelen tilpasses automatisk.
- Berørt: `admin-modules/footer.js`.

*Delte fikser (meny + footer)*
- **Klikk-og-dra for å scrolle i mobil-previewen** (simulerer touch), aktiveres bare når innholdet er høyere enn ruta.
- **✕ Lukk holder seg alltid tilgjengelig** i overleggene: modal-hodet er sticky og kortet scroller internt, så knappen ikke dyttes av toppen på små skjermer.
- **Bugfiks (footer):** var previewen foldet og bredden endret seg, ble høyden feil ved utfolding (avkuttet). Nå måles ikke høyden mens den er foldet, og den re-måles ved utfolding.
- **Bugfiks (meny):** baren ble litt for lav hvis man redigerte mens den var kollapset (høyden ble målt på en skjult iframe). Nå måles den ikke mens baren er skjult, og re-måles når den vises igjen.
- Berørt: `admin-modules/footer.js`, `admin-modules/meny.js`.

**06.07.26 · Meny-admin: ny forhåndsvisning av menylinja (kompakt, flyttet ut av bunn-dokken, rotert på smal skjerm)**

*Forhåndsvisning (Admin → Meny)*
- **Desktop-forhåndsvisningen viser nå kun det redaktøren styrer: logoen + menypunktene.** Modus-knapp, søk og hamburger skjules (injisert CSS i preview-iframen), og logoen er skalert ned så den står mer på linje med menytekstene. Nav-spacerne beholdes, så «Plassering på menylinja» (venstre/sentrert/høyre) gjenspeiles i previewen.
- **Flyttet ut av bunn-dokken.** `previewDock` er slått av for meny; menylinja ligger nå som en tett stripe **rett under «Meny»-hodet, over rail + «Menypunkter»** (satt inn mellom `.aps__head` og `.aps__md`), uten luft rundt.
- **Knappene «📱 Vis mobil» og «🖥 Desktop» ligger i panel-hodet** ved siden av «Oversikt». «Vis mobil» åpner den ekte hamburgerskuffen som overlegg (låst åpen); «Desktop» åpner menylinja **rotert 90°** som overlegg. Den bruker skjermhøyden i stedet for bredden, så hele den brede linja får plass på en smal skjerm.
- **Innholdsbasert kollaps uten flimring:** når logo + menypunkter ikke får plass i panelet, skjules inline-stripa og «🖥 Desktop» dukker opp. Iframen melder nødvendig bredde (`needW`), og admin sammenligner mot tilgjengelig bredde, og måler aldri en skjult iframe, så terskelen skifter kun én gang hver vei.
- Nedtrekk vises på hover (stripa vokser nedover og legger seg oppå uten å reflowe); mobilskuffen er låst (✕ er død); scrollbars skjult i previewen. Berørt: `admin-modules/meny.js`.

**05.07.26 · Admin dra-og-slipp: auto-scroll virker igjen, så store kort kan sorteres**

*Bugfiks (alle admin-paneler)*
- **Store kort/seksjoner kunne ikke flyttes, og det var ingen auto-scroll under draget** (f.eks. Meny → «Hva skjer»/«Om oss» med mange underpunkter blir høyere enn skjermen). Én rotårsak, to symptomer: auto-scroll i `enableDragSort` kalte `window.scrollBy(...)`, men panelene ruller **internt i `.panel-host`** (`position:absolute; overflow-y:auto`) — vinduet selv ruller aldri, så scroll-kallet traff ingenting. Uten scrolling under draget når man aldri slippepunktet for et kort som er høyere enn skjermen.
- Nå finner draget nærmeste faktisk scrollbare forelder (`scrollParent`) og ruller den; kantsonene øverst/nederst måles mot scrollerens synlige flate, ikke hele vinduet. Faller tilbake på `window` om ingen intern scroller finnes, så offentlige/andre lister er upåvirket. Gjelder alle paneler, siden de deler `AC.enableDragSort`. Berørt: `admin-common.js`.

**05.07.26 · Tillitsvalgte (PTV/ITV/FTV): innehaver settes i Hjelp og portrettene følger med overalt — + dra-fiks i Hjelp**

*Tillitsvalgte-innehaver*
- **Notat + hurtiglenke i Styret-panelet:** PTV/ITV/FTV redigeres under Hjelp → «Faglig hjelp», ikke i Styret. Notatet vises både i klassisk visning og i «Hvor vil du begynne?»-oversikten (ny `overviewNote`-hook i PanelShell), med en knapp som hopper rett dit (`window.AdminNav`).
- **Nytt felt «Hvem har vervet nå?» på FTV/ITV/PTV-kortene:** koble kortet til et styremedlem (henter navn + portrett automatisk fra Styret) eller skriv et fritt navn for personer utenfor styret. Vises som en «Nåværende: …»-pille (med portrett når det er koblet) på Hjelp-siden. Berørt: `admin-modules/hjelp.js`, `admin-panel-shell.js`, `admin.html`, `admin-modules.css`, `hjelp.html`.
- **«Om oss» → Tillitsvalgte-teaseren henter nå portrettene automatisk** fra de samme innehaverne (`imagesFrom: "tillitsvalgte"` på kortet). Faller tilbake til manuelt valgte avatarer hvis ingen innehaver er satt. Oppdateres når Hjelp publiseres. Berørt: `om-sections.js`, `om.page.js`, `om-oss.html`, `admin-modules/om-oss.js`.

*Bugfiks*
- **Et vanlig klikk på et kort i Hjelp-panelet startet et dra** (samme feil som ble rettet for Meny/Footer 04.07.26), så man ikke fikk redigert felt. Hjelp-kortene er fulle redigeringsskjema med eget ⠿-håndtak, men `enableDragSort` manglet `handleOnly`, så hele kortet var gripbart. Nå armerer **kun ⠿-håndtaket** et dra; resten av kortet er til redigering/valg. Berørt: `admin-modules/hjelp.js`.

**05.07.26 · Admin «Liste + detalj»: side-scroll fikset, fargevelgeren i chip-raden reparert, temabevisste felt**

*Side-scroll og overlappende bokser (Styret m.fl.)*
- **Bugfiks: man kunne scrolle vannrett ut av siden i «liste + detalj»-paneler** (f.eks. Styret → et styremedlem), og på smal skjerm gled bokser inn i hverandre. Rotårsaken var en gammel regel `.subed-row select { flex: 0 0 120px }` skrevet for da chip-raden hadde en enkel `<select>` som direkte barn — som *descendant*-selektor kapret den også `<select>`-en **inne i** fargevelgeren (`.ape-color`) og låste den til 120px uten krympemulighet. Den fløt da ut av fargevelger-boksen, la seg bak ✕-knappen/fargeruta og presset raden bredere enn ruta (= side-scroll). Reglene er nå avgrenset til direkte barn (`> input`/`> select`), så fargevelgerens innmat styres av sin egen CSS.
- **Innholdslista krymper FØR editoren.** Master–detalj-gitteret var `286px 1fr` (der `1fr` aldri kan bli smalere enn innholdet); nå er nav-kolonnen `clamp(160px, 20vw, 286px)` og detaljruta `minmax(0, 1fr)` — kolonnene summerer alltid til rammens bredde, så vannrett overflyt er umulig, og det man redigerer beholder plassen når det blir trangt. Detaljruta har i tillegg `overflow: hidden auto` (aldri vannrett scrollefelt), og kortoverskrift, feltrader og bildegitter fikk `min-width: 0`/`flex-wrap` så innholdet faktisk får plass.
- **Chip-raden (Tilleggsverv) fikk balansert plassfordeling.** Fargevelgeren ble sultefôret ned til ~30px fordi den fikk inline `flex: 1` (basis 0) mot tekstfeltets 140px-basis; nå starter begge fra rimelig basis (140/150px), og ved trange bredder bryter fargevelger + slett samlet til egen linje i stedet for å klemmes.
- Verifisert med hodeløs nettleser (Playwright) på 880/1055/1400px: ingen overlapp, ingen overflyt, selecten leselig i alle bredder.

*Temabevisste redigeringsfelt (alle paneler)*
- **Redigerbare felt og småknapper gikk i ett med bakgrunnen** — panelene og feltene delte samme `--surface`-farge, mens fargevelgeren stakk seg ut som ren hvit (hardkodet `#fff`). Nye temavariabler `--field`/`--field-border` (et hakk lysere enn flaten per tema: varm `#fffdf6`, sval `#ffffff`, salvie `#fdfffa`) brukes nå av alle inputs/selects/textareas, chip-felt, ✕/✎/↑↓-knapper, søkefeltet og skall-knappene — konsistent løftet fra flaten, i alle tre temaer. Aksentknapper (gull/navy/maroon) og fokusramme er urørt.
- **`palette.js` følger admin-temaet:** fargevelgerens hardkodede farger er byttet til `var(--field, #fff)` osv. — temastyrt i admin, uendret utseende på offentlige sider som ikke definerer variablene.
- Cache-versjonering: `palette.js` lastes nå med versjonsparameter (var tidligere uversjonert, så fikser nådde ikke nettleseren).
- Berørte filer: `admin-modules.css`, `admin.html`, `palette.js`, `admin-modules/styret.js`.

**05.07.26 · Admin-senteret: gjennomgang av mobilvisningen (skuffmeny, drill-down, per-side angre)**

*«Liste + detalj» på mobil*
- **Ekte drill-down i stedet for to stablede ruter.** På smal skjerm ble søke-/innholdsmenyen og redigeringsskjemaet lagt oppå hverandre, så menyen spiste øvre halvdel av skjermen og man måtte scrolle forbi den hver gang. Nå vises **enten** listen **eller** detaljen: man lander på den søkbare listen (fyller høyden), åpner et element → detaljen fyller skjermen og scroller til topp, og en **«← Liste»**-knapp i skall-hodet tar deg tilbake. På bred skjerm er alt uendret (begge ruter side om side). Styres av klassen `aps--mob-detail` som skallet setter/fjerner.
- **Skall-hodet rydder på mobil:** tittel og handlingsknapper flyter jevnt venstrejustert i stedet for å dyttes ujevnt til høyre, og «Oversikt»/«Forhåndsvisning»/«← Liste» er større og lettere å treffe.
- **Den lille undertittelen ved siden av paneltittelen er fjernet** (`.aps__sub` — «3 samlinger», «Sidetekster», «Bygg siden» osv.) for alle paneler.
- **«↩ Husker hvor du var»-merket er fjernet.**

*Sidemenyen som skuff*
- **På mobil ble sidemenyen tvunget til en 58px ikon-stripe uten etiketter** som spiste ~15 % av bredden og var vanskelig å tyde. Den ligger nå utenfor skjermen og åpnes som en **skuff via ☰-knappen** i toppen — med lesbare panelnavn, og lukkes automatisk når man velger et panel, trykker på bakteppet eller Esc. Hele bredden går til redigering.
- **Sidemeny + «Liste + detalj» er nå standard på mobil** (uten å overstyre desktop, som beholder faner/klassisk) — smart standard basert på skjermbredde når intet er valgt.

*Topplinja*
- **Logoen er klikkbar → tilbake til nettsiden**, både desktop og mobil (bevarer innloggings-token). Den vesle «←»-pila er fjernet på mobil siden logoen tar over, og logoen fungerer samtidig som avstandsholder så «Logg inn»/⚙ ikke lenger dyttes ut av skjermen.

*Upubliserte endringer*
- **Endringsmerket vises nå også på mobil**, kompakt som «[N] Endringer» (var skjult før). Et klikk åpner som før oversikten over hva som er endret.
- **Per-side «↺ Angre» i endrings-oversikten.** Hver endret side har egen angre-knapp som tilbakestiller *bare* den til sist publiserte versjon — reversibelt via angre-snackbaren, og den åpne siden re-monteres så feltene faktisk revertes. «↺ Angre alle» ligger fortsatt nederst. Topplinjas «Angre alle» er skjult på mobil (ligger i oversikten i stedet), så toppen ikke blir overfylt.
- Den delte bekreftelses-modalen (`apModal`) har fått en valgfri tredje knapp (`extraLabel`) og en `onMount`-hook for egendefinert innhold.

*Diverse fikser*
- **Bugfiks: en «strek» nederst på siden (både mobil og desktop).** `#toast` manglet all CSS, så varsel-teksten ble skrevet inn nederst i vanlig sideflyt og aldri fjernet — siste varsel ble stående igjen. Varselet er nå en fast, sentrert pille som er skjult til den faktisk vises.
- **Lukk-krysset (✕) i Innstillinger holder seg alltid i øvre høyre hjørne** når man blar i en lang modal (null-høyde sticky-lag), mens «Innstillinger»-tittelen scroller normalt.
- **«Til toppen»-pil på mobil**, samme stil som på nettsiden — dukker opp når man har scrollet ned, og ruller riktig indre container (oversikt, panel eller detalj-rute) til topps.
- Berørte filer: `admin.html`, `admin-panel-shell.js`, `admin-common.js`, `admin-modules.css`.

**05.07.26 · «Akkurat nå»: eget «Senere»-oppsett for flere arrangement, klikkbar kunngjøring og tett kort i alle bredder**

*«Akkurat nå»-kortet (forsiden)*
- **Nytt oppsett når kortet viser flere arrangement.** Det neste arrangementet står som hovedhendelse med stort datokort og «Neste arrangement»-merkelapp; arrangement 2–3 samles i en svakt tonet «Senere»-blokk knyttet til en tynn gull-tidslinje (prikkene sentreres per rad, så de sitter riktig uansett radhøyde — og ved bare ett «senere»-arrangement vises kun prikken, ingen løs strek). Tidligere gjentok hver rad samme store datokort og merkelapp, som ble repetitivt og høyt.
- **Hele kunngjøringsraden er nå klikkbar**, akkurat som arrangement-radene: til sin egen lenke om den har en, ellers til nyhetsarkivet (`nyheter.html`). Den gamle «Alle nyheter & arkiv»-knappen nederst i kortet er fjernet, og skillelinja på siste rad er strøket så kortets avrundede bunn blir ren.
- **Kortet holder seg som en tett, avgrenset blokk i alle bredder** (samme prinsipp som merch-bestillingskortet) i stedet for å strekke seg fullt ut når hero-en stables. Ved ≤860px blir det en ryddig `max-width:440px`-blokk mot venstre — `width:100%` fyller automatisk smalere mobilskjermer og avgrenser bredere, så korte rader ikke lenger får store tomrom mellom tekst og pil.

*Admin → Forsiden*
- **«Akkurat nå»-innstillingen ligger nå på linje med «Hero øverst på Hjem»-overskriften** i stedet for nede blant Hero-feltene. Kompakt etikett + nedtrekk, høyrestilt i detalj-baren.
- **Ny generisk mekanisme i «liste + detalj»-skallet:** et element merket `data-aps-head` inne i et seksjons-panel flyttes opp på detalj-overskriftens linje mens seksjonen er åpen, og tilbake til panelet når man forlater den. Elementet *flyttes* (aldri gjenskapes), så felt-id-er og hendelseslyttere holder seg intakte. Gjenbrukbart for andre paneler.
- Innstillingen selv er uendret (`arr-maxevents` → `newsPanel.maxEvents`).
- Berørte filer: `apeiron-news.js`, `styles.css`, `admin-modules/forsiden.js`, `admin-panel-shell.js`, `admin-modules.css`.

**04.07.26 · Om oss: seksjonslenker lander nå presist rett under nav-en**

*Anker-scroll (gjelder alle sider)*
- **Bugfiks: `#seksjon`-lenker på Om oss tok deg litt for høyt** — en stripe av forrige seksjon ble synlig over den du hoppet til, og landingen var ujevn fra seksjon til seksjon. Årsaken: Om oss tegnes av JavaScript (`PageEngine`) *etter* at nettleseren gjør sitt native fragment-hopp, så den innebygde `scroll-padding-top`-landingen kappløp med rendringen og traff upresist.
- **Ny `wireHashScroll` i `site-chrome.js` styrer anker-scrollet selv.** Den bruker nav-ens *faktiske* høyde som offset (ikke en fast `84px`-gjetning) og kjører på klikk, `hashchange` og innlasting med `#anker` — sistnevnte på nytt etter `load` + `fonts.ready`, så landingen blir presis når alt er lagt ut. Håndterer også modifiserte klikk, `href="#"`-plassholdere, kryss-side-lenker og allerede-håndterte hendelser, så nav/skuff/søk er urørt.
- **Måler nav-en i «is-stuck»-tilstand.** Etter et scroll er nav-en alltid krympet (`padding:14px → 10px`), så den utvidede høyden ga ~8px for stor offset. Høyden måles nå usynlig i stuck-tilstand (transition av, les, gjenopprett — før neste maling). Et ekstra `+2px` tucker seksjonstoppen så vidt inn under nav-kanten, siden `offsetHeight` er avrundet til heltall mens den malte høyden kan være brøkdels-px (ellers lekker en 1px-stripe).
- **`scroll-padding-top` er koblet til den målte nav-høyden:** `var(--nav-h, 84px)` i stedet for hardkodet `84px`, som fallback for ikke-JS/første maling.
- Berørte filer: `site-chrome.js`, `styles.css`, samt cache-bust-versjonering av `styles.css`/`site-chrome.js` på alle sidene.

**04.07.26 · Admin → Meny: et klikk på et menypunkt havner ikke lenger i dra-og-slipp**

*Menyeditoren (liste + detalj)*
- **Bugfiks: et vanlig klikk på et menypunkt starter ikke lenger et dra.** Menypunktene tegnes som fulle redigeringskort, og *hele* kortet var sorterbart — trykket man et sted på kortet som ikke var et felt (etikett, luft, undermeny-området) og pekeren skalv bare > 4 px, gled kortet inn i dra-og-slipp. Da ble det umulig å bare redigere tekst eller endre synlighet uten å dra. Nå kan et dra **kun** startes fra draghåndtaket `⠿`; resten av kortet er til redigering/valg som forventet.
- **Ny `handleOnly`-modus i den delte dra-sorteringen (`enableDragSort`).** Når den er på, ignoreres «dra hele kortet»-oppførselen, og bare håndtaket armerer et dra. Slått på som standard for alle «liste + detalj»-paneler (Meny og Footer), siden radene der alltid er redigeringsskjema med eget `⠿`-håndtak. Kan overstyres per gruppe med `reorderHandleOnly: false`.
- Berørte filer: `admin-common.js`, `admin-panel-shell.js`, `admin-modules/meny.js`.

**04.07.26 · Forside + merch: «Akkurat nå» kan vise flere arrangement, ryddet kapittelbrudd, bestilling opp i merch-toppbildet**

*«Akkurat nå»-kortet (forsiden)*
- **Kortet kan nå vise de neste 1–3 arrangementene**, ikke bare det aller neste. Antallet velges i **Admin → Forsiden → Hero** («Kun neste arrangement» / «Neste to» / «Neste tre») og lagres i `index-content.js` som `newsPanel.maxEvents` (standard = 1, som før).
- **Kalenderne melder nå inn hele lista** med kommende arrangement, ikke bare det første. `apeiron-news.js` slår sammen kildene (aktivitet/aporetisk/fadder), sorterer på tid, deduperer samme hendelse på tvers av kalendere, og viser de N øverste. Datainntaket (`apeironNewsNextEvent`) tar imot både ett arrangement (som før) og en liste — bakoverkompatibelt.
- **Live forhåndsvisning:** når antallet endres i admin, tegner `apeiron-index.js` kortet på nytt (`window.apeironNewsRender`).

*Forsiden — ryddet kapittelbrudd*
- **«Akkurat nå»-kapittelbruddet over Oppslagstavla-teaseren er fjernet**, og **«Det du kan regne med» over Aporetisk Aften er fjernet**. Begge var rene dekor-etiketter (`.chapbreak`) uten funksjon; seksjonene beholder sitt eget innhold.

*Merch — bestilling opp i toppbildet*
- **«Slik bestiller du» er flyttet fra bunnen av merch-siden opp i toppbildet**, ved siden av «Merch»-tittelen (over seglet). Bestillings-banden er en kompakt utgave med de 4 stegene i et 2×2-rutenett, kortere intro og strammere padding, så den får plass uten å sprenge seksjonen. Produktrutenettet ligger som før øverst i produktseksjonen.
- **Responsivt oppsett i tre trinn:** ≥ 980px står tittel og kort side om side, sentrert som ett par med fast avstand (ikke to like kolonner som driver fra hverandre, så det ikke blir stort tomrom på brede skjermer). Under 980px stables kortet under tittelen som en tett blokk (maks 600px, ikke strukket utover — seglet fyller høyre side). Under 560px går stegene til én kolonne. Terskelverdiene ble finjustert etter visuell gjennomgang på flere bredder.
- Berørte filer: `index.html`, `merch.html`, `index-content.js`, `apeiron-news.js`, `apeiron-index.js`, `apeiron-events.js`, `apeiron-fadder.js`, `aporetisk-cal.js`, `admin-modules/forsiden.js`.

**04.07.26 · Admin: snarveier peker nå inn i Admin-senteret, ikke til den publiserte siden**

*Snarveier (Oversikt)*
- **«Legg til som snarvei» lager nå en snarvei INN i Admin-senteret.** Før pekte snarveiene på den *publiserte* siden (`index.html#aporetisk`) og åpnet den i ny fane — altså den ferdige nettsiden, ikke redigeringsflaten. Nå peker de på det matchende panelet/seksjonen i admin (`admin.html#forsiden/aporetisk`), og et klikk hopper rett dit i samme fane. Gjelder både «+ Legg til snarvei»-plukkeren på Oversikt og «🔗 Legg til som snarvei»-knappen inne i en seksjon.
- **Nytt href-format for snarveier:** `admin.html#<panel>` for et helt panel, `admin.html#<panel>/<seksjon>` for én seksjon. Deles globalt via `admin-shortcuts.js` som før. Den ene eksisterende snarveien (Aporetisk Aften) er migrert til det nye formatet.
- **Hvert panel er nå sin egen «hel side»-snarvei.** Før ble Forsiden/Meny/Footer slått sammen til én oppføring fordi de alle pekte på `index.html`; nå får hvert synlige panel sin egen snarvei siden målet er panelet, ikke den delte siden.
- **Dyp-lenking til seksjon.** Admin-senteret forstår nå `admin.html#<panel>/<seksjon>` ved oppstart, og «Liste + detalj»-skallet plukker opp ønsket seksjon ved mount (eller hopper dit via en hendelse hvis panelet allerede er åpent). Eldre snarveier som fremdeles peker på den publiserte siden åpnes som før i ny fane (bakoverkompatibelt).
- Berørte filer: `admin.html`, `admin-panel-shell.js`, `admin-modules/shortcuts.js`, `admin-shortcuts.js`.

**04.07.26 · Navigasjon + Om oss: ryddet meny, minimeny i banneret, lys/mørk rytme og subhero-konsolidering**

*Hovedmenyen*
- **«Foreningen» heter nå «Om oss»** og nedtrekket er omorganisert: de fem egne sidene (Om oss, Styret & tillitsvalgte, Tidligere styrer, Utmerkelser, Oppnåelser) står først, deretter de tre anker-snarveiene (Verv, Fellesskap & samarbeid, Lesesalen). Før sto sider og ankere blandet, så menyen så dobbelt så stor ut som innholdet den pekte til.
- **Ny meny-byggekloss: gruppeoverskrift.** Et undermenypunkt kan nå være `{label, heading:true}` — en ikke-klikkbar overskrift med skillelinje, i både desktop-nedtrekk og mobilskuff. Brukes ikke i dagens meny (ble prøvd og valgt bort), men støttes fullt ut i Admin → Meny («+ Overskrift»-knapp, eget gulltonet kort) og overlever utkast/angre/eksport. Scrollspy og aktiv-markering er upåvirket (spør kun etter lenker).

*Om oss-siden (visuelt løft)*
- **Tone-systemet er koblet til bakgrunnene.** Seksjonsmotoren har alltid regnet ut `data-tone` per seksjon, men ingen CSS brukte den — hele midtdelen var én flat kremflate. Nå males `data-tone="navy"`-seksjoner som mørke bånd (token-re-pinning, samme oppskrift som marine-modusens alltid-mørke flater). «Møt styret» er første mørke bånd; tone-velgeren i Admin → Om oss har dermed endelig synlig effekt.
- **Minimeny i banneret («På denne siden»).** Banner-seksjonen kan vise en gruppert innholdsmeny: glasspanel med gullkant på desktop (posisjon måles av JS så det alltid er lik luft mellom ingressen og vinduskanten), runde chips under ingressen på mobil. Bygges automatisk fra seksjonenes `data-screen-label` — skjules/flyttes en seksjon i admin, følger menyen med. Slås av/på per side i banner-panelet (`props.toc`).
- **FAQ har fått eget bakgrunnsbånd** (`.faq-sec`, dypere pergament + hårlinje via `var(--line)` så den synes i begge fargemoduser) — siden slutter bevisst i stedet for å fade inn i footeren.
- **Avatar-rader i kort.** Cardgrid-kort støtter valgfrie `images`/`imagesMore`-props som rendres som en rad overlappende, runde bilder (+ «+7»/«Deg?»-boble). Tatt i bruk i «Møt styret» med styrebilder; redigeres per kort i Admin → Om oss (kommaseparerte stier + boble-tekst). Kort uten bilder ser ut som før.

*Admin*
- **Banner-panelet i Om oss er ryddet.** «Tilbake-lenke (tekst)» og «Tilbake-lenke (URL)» ligger nå side ved side på én rad, med Tittel og Ingress i full bredde under — panelet er kortere og lettere å skanne.
- **Minimeny-bryteren er gjort tydelig.** Av/på-valget for minimenyen er en egen gull-aksentert rad nederst i banner-panelet: tittel og forklaring til venstre, «PÅ»/«AV»-status og gull-glidebryter (delt `.switch`-komponent) til høyre. Hele boksen dempes til grå når menyen er avslått, så tilstanden synes på avstand. Forhåndsvisningen oppdateres live ved vipping.
- **Rytme-vakten varsler nå på synlig flate, ikke tone-kategori.** Den gamle vakten ropte «samme tone» selv når naboseksjonene faktisk hadde ulik bakgrunn (lys tone gir ulik grunnflate per type: about = pergament, cardgrid/faq = dyp pergament, lesesal = krem). Nå regnes den faktiske flaten ut per seksjon, og varselet kommer kun når to naboer reelt flyter sammen — et varsel man kan ignorere skal ikke finnes. Hjelpeteksten over seksjonsbyggeren er oppdatert tilsvarende.

*Kodeopprydding (ingen synlig endring)*
- **Subhero-CSS samlet til én kanonisk blokk i `styles.css`.** Topp-banneret lå som klipp-og-lim-kopi i 12 HTML-sider, med reell drift mellom kopiene. Hver sides regler ble diffet mot referansen; kun tegn-for-tegn-identiske regler ble fjernet, mens ekte avvik står igjen som små inline-overstyringer med forklarende kommentar (gull tilbake-lenke på galleri/marked/merch/pensum, glød-effekt på hjelp/styret/oppnåelser/utmerkelser, smalere ingress m.m.). Fremtidige bannerendringer gjøres nå ett sted.
- **Inline-stiler ut av seksjonsrendrerne.** Hardkodede `style="…"`-attributter i `om-sections.js` er erstattet med navngitte klasser med identiske verdier: `.center--head`, `.faq--narrow`, `.btn--full`, `.about__p-first`. Luft og bredder justeres heretter i `styles.css`, og kan nå overstyres i media queries.
- Berørte filer: `nav-content.js`, `site-chrome.js`, `styles.css`, `om-sections.js`, `om.page.js`, `admin-modules/meny.js`, `admin-modules/om-oss.js`, `admin-modules.css`, samt subhero-opprydding i `om-oss.html`, `nyheter.html`, `oppslagstavla.html`, `galleri.html`, `hjelp.html`, `marked.html`, `merch.html`, `pensum.html`, `styret.html`, `styret-arkiv.html`, `oppnaelser.html`, `utmerkelser.html`.

---

Eldre oppføringer (11.06.26–29.06.26) ligger i [docs/changelog-arkiv/2026-06.md](docs/changelog-arkiv/2026-06.md).

© 2026 Apeiron Linjeforening
