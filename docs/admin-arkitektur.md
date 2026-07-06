# Admin-arkitektur & veikart

Dette dokumentet beskriver hvordan admin er bygd opp nå, og planen videre mot
målet: **en klonbar mal der hvilken som helst linjeforening kan bygge sin egen
nettside utelukkende gjennom admin** — gratis og uten server.

---

## Prinsippet i dag (statisk + git)

Nettsiden er ren HTML/CSS/JS på Cloudflare Pages. Alt innhold ligger i
data-filer i repoet (`*-content.js`, `*-config.js`). Redigeringsløkka er:

```
Rediger i admin  →  ☁ Publiser til GitHub (commit via API)  →  Cloudflare bygger (~1 min)
```

Ingen server, ingen database, ingen løpende kostnad. Det overlever at styret
byttes ut hvert år, og alt ligger versjonert i git. (En nedlastings-backup for
manuell commit finnes som reserveløsning — se [VEDLIKEHOLD.md](../VEDLIKEHOLD.md).)

**Forhåndsvisning bor på sidene, ikke i admin.** Hvert admin-panel legger den
ekte siden i en ramme med `?preview=1`; sidens eget innholds-script lytter på
endringene og tegner om. Derfor påvirker endringer i admin *aldri* hvordan
previewene fungerer.

---

## C — skall + moduler (FERDIG)

**Mål (oppnådd):** samle alle editorene i ett skall (`admin.html`) med tynne
moduler, i stedet for frittstående `*-admin.html`-filer som dupliserte ramme,
innlogging, varsler og eksport. Alle panelene er nå moduler, og samtlige
frittstående `*-admin.html`-filer er slettet.

### Slik er det bygd

- **`admin.html`** — skallet. Header, bla-bar meny, oversikt (dashboard), og
  en modul-vert (`#panel-host`). Panel-registeret (`PANELS`) lister hvert
  område; alle mountes nå inline som moduler (den gamle `file`-iframe-veien
  for ikke-migrerte paneler er ikke lenger i bruk).
- **`js/admin/admin-common.js`** — delt logikk. Nye byggeklosser for moduler:
  - `AdminCommon.createStore(lsKey, freshFn)` — utkast-lager (auto-lagre i
    localStorage, `save/lazySave/reset`).
  - `AdminCommon.esc`, `enhanceHelp`, `enableDragSort`, `saveFile`, `toast`.
  - `window.AdminPanels` — register. Moduler kaller `AdminPanels.define(id, def)`.
- **`css/admin-common.css`** — delt stil.
- **`js/admin/modules/<id>.js`** — én modul per editor. Hver definerer
  `{ title, see, exportName, mount(host, AC) }`. `mount` bygger editoren inn i
  `host`, kobler opp alt, og returnerer `{ export }` som skallets «Last ned»-
  knapp kaller.
- **`js/admin/admin-image-editor.js`** — delt bilderedigerer (beskjær, roter,
  filtre). Komprimerer alt ved opplasting i nettleseren: nedskalering + webp med
  et størrelsestak per panel (`targetKB`, default 150 kB; portretter 30, merch/
  plakat 250). Bytene lagres i IndexedDB og pakkes/committes ved publisering, så
  innholdsfilene holder seg små. Detaljer og tak-tabell:
  [VEDLIKEHOLD.md → Bildekomprimering](../VEDLIKEHOLD.md#bildekomprimering-skjer-automatisk-ved-opplasting).

### Migrering — fullført

Alle panelene er migrert til moduler, og de frittstående `*-admin.html`-filene
er slettet. Nye paneler har kommet til etter migreringen (pensum, galleri,
marked, snarveier) — den autoritative lista er filstruktur-tabellen i
[VEDLIKEHOLD.md](../VEDLIKEHOLD.md#filstruktur).

I tillegg deler alle panelene nå to redigeringsvisninger via
`js/admin/admin-panel-shell.js` (**PanelShell**): «Liste + detalj» (smal, søkbar
navigator + ett skjema om gangen) og «Klassisk» (kort i full bredde).
PanelShell gjenbruker modulenes egne kort-byggere, så bilder, lagring, angre og
publisering er felles logikk mellom visningene.

### Hvorfor C er riktig fundament

Når hvert panel er en registrert modul med felles datalager og eksport, blir
«legg til en ny side/seksjon» bare *en ny rad i registeret + en liten modul* —
i stedet for å kopiere en hel HTML-fil. Det er forutsetningen for de neste to
stegene.

---

## G1 — git-basert CMS-følelse (FERDIG)

**Smerten som var:** «lagre» betydde last-ned-fil + manuell commit. Det føltes
ikke som Squarespace.

**Løsningen (i drift):** «Lagre» **committer direkte til GitHub** via GitHubs
API og en OAuth-innlogging — fortsatt statisk, fortsatt gratis på Cloudflare
(Pages Functions i `functions/api/github/`). Redaktøren ser bare
«☁ Publiser til GitHub → live om et minutt». Rundt dette finnes også
konfliktsjekk ved samtidig redigering, «Sist publisert»-visning og
«↩ Angre siste publisering». C-modulene beholdt sin `export` (den driver
nedlastings-backupen) og fikk commit-veien i tillegg.

Engangsoppsettet (OAuth-app + miljøvariabler) står i
[github-publisering-oppsett.md](github-publisering-oppsett.md);
driftsdetaljene i [VEDLIKEHOLD.md](../VEDLIKEHOLD.md).

---

## Målet: klonbar mal for enhver forening (FREMTID)

Når (a) alt innhold er data-drevet, (b) admin kan legge til/fjerne/sortere sider
og seksjoner, og (c) tema/merkevare (farger, fonter, logo) er redigerbart i
admin — da kan en hvilken som helst forening:

```
Klon repoet  →  åpne admin  →  bygg sin egen side  →  publiser
```

Veien dit, byggesteinene i rekkefølge:

1. **C** — modulær admin (fundament). ✅ **ferdig**
2. **G1: Git-CMS-innlogging** — «lagre = commit», så ikke-tekniske styrer slipper
   GitHub helt. ✅ **ferdig**
3. **Sider/seksjoner som data** ← *vi er her nå* — sidelisten og seksjonene i en side blir
   redigerbare data, ikke hardkodet HTML (Om oss-siden er allerede datadrevet via
   seksjonsmotoren). Admin får «+ Ny side / + Ny seksjon».
4. **Tema i admin** — farge-, font- og logo-tokens redigerbare (bygger på at
   siden allerede bruker CSS-variabler).
5. **Oppsett-veiviser** — førstegangs «hva heter foreningen / farger / logo»
   som fyller startdataene ved kloning.

Hvert steg gir verdi alene for Apeiron, og bygger samtidig mot det klonbare
produktet — ingen bortkastet innsats.
