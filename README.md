# Apeiron Linjeforening — nettside

Nettsiden for Apeiron, linjeforeningen for filosofi og etikk ved NTNU.
Statisk nettside (HTML/CSS/JS) — ingen byggesteg, ingen avhengigheter å installere.

## Innhold

| Fil | Hva det er |
|-----|-----------|
| `index.html` | Forsiden |
| `pensum.html` | Pensum-oversikt |
| `merch.html` | Merch-side |
| `marked.html` | Kjøp & bytte (pensum-marked) |
| `styles.css` | All styling |
| `app.js`, `apeiron-events.js`, `aporetisk-cal.js`, `apeiron-fadder.js` | Funksjonalitet (meny, arrangementer, kalender, fadderuke) |
| `image-slot.js`, `site-search.js`, `tweaks-panel.jsx`, `tweaks.jsx` | Bilde-felter, søk og tilpasningspanel |
| `assets/apeiron-logo.png` | Logo / segl |
| `netlify.toml` | Netlify-konfigurasjon |

## Legg ut på Netlify

**Enkleste vei (dra og slipp):**
1. Gå til <https://app.netlify.com/drop>
2. Dra hele denne mappen inn i vinduet.
3. Ferdig — Netlify gir deg en adresse med en gang.

**Via GitHub (anbefalt for videre redigering):**
1. Last opp dette til et GitHub-repo (se under).
2. På Netlify: «Add new site» → «Import an existing project» → velg repoet.
3. La «Publish directory» stå som `.` (allerede satt i `netlify.toml`). Ingen build-kommando trengs.
4. Trykk «Deploy».

## Last opp til GitHub

I en terminal, i denne mappen:

```bash
git init
git add .
git commit -m "Apeiron nettside"
git branch -M main
git remote add origin https://github.com/BRUKERNAVN/apeiron-nettside.git
git push -u origin main
```

(Bytt ut `BRUKERNAVN` og repo-navnet med ditt eget.)

Eller bruk GitHubs nettside: «Add file» → «Upload files» → dra inn alle filene.

---

© 2026 Apeiron Linjeforening
