## Siste endringer

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

**13.06.26 — Sjekket ut `github.com/dotkom/monoweb`**
- Sammenlignet med monoweb for å se hva vi kunne lære. Se under for hva vi valgte å implementere fra monoweb.

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

**13.06.26 — Fullstendig mørk modus («marine») for alle offentlige sider**
- Ny fil `theme.js` lastes blokkerende øverst i `<head>` på alle 7 offentlige sider (`index`, `pensum`, `styret`, `galleri`, `hjelp`, `merch`, `marked`) slik at temaet settes før første paint og blinking (FOUC) unngås. `begrep.html` er bevisst utelatt.
- Mørk modus aktiveres nå globalt via `data-mode`-attributt på `<html>` (ikke `<body>`) og virker på navigasjon, skuff/mobilmeny og alle undersider.
- Semantisk token-refaktor i `styles.css`: nye tokens `--card`, `--line`, `--line-2`, `--fill-soft`, `--on-dark` og `--warm`. I lyst tema er `--warm` = maroon (vinrød); i mørkt tema flippes den til gull, slik at alle aksenter forblir lesbare mot den mørkeblå bakgrunnen.
- Alle `color:var(--maroon)`-referanser migrert til `color:var(--warm)` (31 steder). Alle `body[data-mode="marine"]`-selektorer migrert til `html[data-mode="marine"]`.
- Re-pin-regel sikrer at alltid-mørke flater (hero, nav, skuff, footer, kontaktboks, fadder m.fl.) beholder lys tekst i begge moduser.
- Gull-fyll for heldekkende maroon-chips (`.prog__level`, `.ev-signup`) i mørk modus.
- API-varsler (aporetisk, arrangement, fadder) bruker gull-tonet boks i stedet for rød i mørk modus.
- Standardtema er alltid lyst; brukerens valg huskes i `localStorage`.

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

**13.06.26 — Kalender-feilstater: API-feil vs. tom kalender**
- Alle tre kalender-integrasjonene skiller nå tydelig mellom API-nøkkel ugyldig/ikke satt (innrammet ⚠-melding med lenke til README og kontaktsiden) og tilkoblet kalender uten hendelser (vennlig «kommer snart»-melding).
- Arrangementer: alle tre visninger (Liste, Rutenett, Oversikt) dekket. Filterknapper skjules ved API-feil. Bug-aktig statusbanner fjernet. Rutenett-meldingen sentrert over alle kolonner.
- Aporetisk Aften: «Når»-feltet viser «—» ved API-feil og «Dato kommer» ved tom kalender. Genererte torsdagsdatoer vises ikke lenger ved API-feil.
- Fadderukene: skjelett-plassholderen erstattet med feilmelding ved API-feil.

**14.06.26 — Felles fargesystem med lys/mørk-varianter for admin**
- Ny fil `palette.js`: én kilde til sannhet for alle navngitte farger, hver med kuratert lys- OG mørk-variant. Lastes før render-scriptene på offentlige sider og før admin-koden. Erstatter fire tidligere duplikate fargedefinisjoner (member-tag-klasser, stripe-klasser og to `ACCENT_HEX`-tabeller).
- Tre frihetsnivåer i ett delt admin-element (`createColorControl`): velg ferdig tema (gir lys+mørk automatisk), miks lys og mørk hver for seg, eller skriv inn rå hex via fargehjul (`<input type="color">`). Per-modus.
- Alle farger rendres nå via inline CSS-variabler (`--c-l`/`--c-d`) som `html[data-mode]` plukker automatisk — ingen egne override-regler per farge.
- `resolveColor()` håndterer alle dataformer bakoverkompatibelt: temanavn (string), `{light,dark}`-objekt og rå hex — eksisterende data trenger ingen migrering.
- Rullet ut i `styret`/`styret-admin` (member-tags + vervkort-aksent), `hjelp`/`hjelp-admin` (kort-aksent) og `begrep`/`begrep-admin` (podkast-kort, bruker palettens mørk-variant siden siden alltid er mørk).

**14.06.26 — Merch: fritt fargevalg, animert kortkant og redigerbar knapp**
- Fritt fargevalg (palett / miks / rå hex, med lys+mørk) for badge, kortkant og «Bestill»-knapp i `merch-admin.html`.
- Animerte glød-presets rundt hele produktkortet (Aurora / Ember / Neon / Regnbue, hver i dempet og tydelig). Implementert som et wrapper-element (`.pglow`) med `::before` utenfor kortets `overflow:hidden`, slik at gløden blir en ekte lysende kant rundt kortet og ikke lyser gjennom fyllet. Egendefinert kantfarge gir en rolig puls i valgt farge.
- Badge-type gjort meningsfull: hver type har nå distinkt farge (Bestselger = gull, Nyhet = grønn, Begrenset = rust). Tidligere så Bestselger og Begrenset identiske ut. Fri badge-farge overstyrer typen.
- Redigerbar knappetekst (f.eks. «Bestill» → «Utsolgt») via nytt tekstfelt i admin.
- `@media (prefers-reduced-motion: reduce)` demper/stopper alle glød-animasjoner.

---

© 2026 Apeiron Linjeforening
