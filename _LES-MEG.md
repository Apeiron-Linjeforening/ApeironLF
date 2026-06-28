# Endringer som mangler i `main` (Apeiron-Linjeforening/ApeironLF)

Arbeidskopien her er nyere enn `main`. Alle filene under må committes/pushes.
Legg dem rett oppå de eksisterende filene i repoet (samme stier som her), commit og push.

## Filer å pushe

**NYTT: Galleribilder på forsiden** (25.06) — admin-styrt, live fra Drive, av som standard
- `hero-gallery.css`            — stiler for stil A/B/C/D + alle animasjoner (NY fil)
- `apeiron-hero-gallery.js`     — motoren: henting fra Drive, rendering, DVD, preview (NY fil)
- `assets/dvd-logos/*.png`      — 10 nedskalerte logoer for DVD-motivet (NYE filer)
- `index.html`                  — CSS/JS-lenke + injeksjonspunkter `#hg-top` / `#hg-before-medlem`
- `index-content.js`            — `heroGallery`-standardconfig (enabled:false)
- `admin-modules/forsiden.js`   — det nye «Galleribilder på forsiden»-panelet

**Pensum-admin omarbeidet + forhåndsvisning-fiks** (22.06)
- `admin-modules/pensum.js`, `apeiron-pensum.js`, `pensum-content.js`, `pensum.html`
- `admin-modules.css` — `.mod-pensum`-styling + generisk `.pv-board-wrap` preview-fiks

**WIP-banner fjernet helt** (22.06)
- `index.html`, `apeiron-index.js`, `index-content.js`, `admin-modules/forsiden.js`, `README.md`
  (allerede dekket av filene over — `index.html`/`index-content.js`/`forsiden.js` inneholder begge endringssettene)

**Mørk modus-fikser** (22.06)
- `styles.css` — usynlig tekst på Om oss + rød-på-blå «Bli medlem» rettet

**Merch: «Merkelapp over teksten»-funksjon**
- `merch-products.js`, `merch.html`, `admin-modules/merch.js`

**Dokumentasjon**
- `CHANGELOG.md`, `VEDLIKEHOLD.md`

## Bevisst utelatt

- **`.gitignore`** — IKKE push den lokale. `main` sin er allerede nyere.
- **Arbeidsdokumenter / prototyper** (ikke en del av nettsiden): `Forsiden — bildevarianter.html`,
  `Plan F.html`, `Urd - Arkitektur og visjon.html`, `Urd-handoff.md`.
- **Gitignorerte mapper**: `screenshots/`, `uploads/`.
- `endrede-filer/` (gammel staging) og `endringer-til-git/` (denne mappa) hører ikke i repoet.

## Merknad

`index.html`, `index-content.js` og `admin-modules/forsiden.js` har endringer fra
**flere** økter (WIP-banner fjernet + galleribilder). Filene her er den komplette,
nyeste versjonen — bare legg dem oppå repoet.
