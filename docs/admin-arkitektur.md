# Admin-arkitektur & veikart

Dette dokumentet beskriver hvordan admin er bygd opp nå, og planen videre mot
målet: **en klonbar mal der hvilken som helst linjeforening kan bygge sin egen
nettside utelukkende gjennom admin** — gratis og uten server.

---

## Prinsippet i dag (statisk + git)

Nettsiden er ren HTML/CSS/JS på Cloudflare Pages. Alt innhold ligger i
data-filer i repoet (`*-content.js`, `*-config.js`). Redigeringsløkka er:

```
Rediger i admin  →  Last ned data-fil  →  commit/push til GitHub  →  Cloudflare bygger (~1 min)
```

Ingen server, ingen database, ingen løpende kostnad. Det overlever at styret
byttes ut hvert år, og alt ligger versjonert i git.

**Forhåndsvisning bor på sidene, ikke i admin.** Hvert admin-panel legger den
ekte siden i en ramme med `?preview=1`; sidens eget innholds-script lytter på
endringene og tegner om. Derfor påvirker endringer i admin *aldri* hvordan
previewene fungerer.

---

## C — skall + moduler (FERDIG)

**Mål (oppnådd):** samle alle editorene i ett skall (`admin.html`) med tynne
moduler, i stedet for 13 frittstående `*-admin.html`-filer som dupliserte ramme,
innlogging, varsler og eksport. Alle 13 panelene er nå moduler, og samtlige
frittstående `*-admin.html`-filer er slettet.

### Slik er det bygd

- **`admin.html`** — skallet. Header, bla-bar meny, oversikt (dashboard), og
  en modul-vert (`#panel-host`). Panel-registeret (`PANELS`) lister hvert
  område; alle mountes nå inline som moduler (den gamle `file`-iframe-veien
  for ikke-migrerte paneler er ikke lenger i bruk).
- **`admin-common.js`** — delt logikk. Nye byggeklosser for moduler:
  - `AdminCommon.createStore(lsKey, freshFn)` — utkast-lager (auto-lagre i
    localStorage, `save/lazySave/reset`).
  - `AdminCommon.esc`, `enhanceHelp`, `enableDragSort`, `saveFile`, `toast`.
  - `window.AdminPanels` — register. Moduler kaller `AdminPanels.define(id, def)`.
- **`admin-common.css`** — delt stil.
- **`admin-modules/<id>.js`** — én modul per editor. Hver definerer
  `{ title, see, exportName, mount(host, AC) }`. `mount` bygger editoren inn i
  `host`, kobler opp alt, og returnerer `{ export }` som skallets «Last ned»-
  knapp kaller.

### Migrering — fullført

Alle 13 panelene er migrert til moduler, og de frittstående `*-admin.html`-filene
er slettet:

- [x] medlemskap, hjelp, meny, footer
- [x] styret, begrep, om-oss, forsiden (index), oppslagstavla, nyheter
- [x] merch (størst — egen `.pcard`-struktur)
- [x] oppnåelser, utmerkelser

### Hvorfor C er riktig fundament

Når hvert panel er en registrert modul med felles datalager og eksport, blir
«legg til en ny side/seksjon» bare *en ny rad i registeret + en liten modul* —
i stedet for å kopiere en hel HTML-fil. Det er forutsetningen for de neste to
stegene.

---

## Neste: git-basert CMS-følelse (FREMTID)

**Smerten i dag:** «lagre» betyr last-ned-fil + commit. Det føles ikke som
Squarespace.

**Løsning uten server:** et git-basert CMS (f.eks. Decap/TinaCMS-mønsteret) der
«Lagre» **committer direkte til GitHub** via GitHub sin API og en OAuth-innlogging
— fortsatt statisk, fortsatt gratis på Cloudflare. Da forsvinner nedlasting +
manuell commit; redaktøren ser bare «Lagre → live om et minutt».

Dette er så nær Squarespace-følelsen man kommer uten å ta på seg en server og
løpende kostnad. C-modulene kan beholde sin `export`, men få i tillegg en
`commit`-vei.

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
2. **Sider/seksjoner som data** ← *vi er her nå* — sidelisten og seksjonene i en side blir
   redigerbare data, ikke hardkodet HTML. Admin får «+ Ny side / + Ny seksjon».
3. **Tema i admin** — farge-, font- og logo-tokens redigerbare (bygger på at
   siden allerede bruker CSS-variabler).
4. **Git-CMS-innlogging** — «lagre = commit», så ikke-tekniske styrer slipper
   GitHub helt.
5. **Oppsett-veiviser** — førstegangs «hva heter foreningen / farger / logo»
   som fyller startdataene ved kloning.

Hvert steg gir verdi alene for Apeiron, og bygger samtidig mot det klonbare
produktet — ingen bortkastet innsats.
