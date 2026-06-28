# G1 — «Lagre = commit»: oppsett av GitHub-publisering

Med G1 kan styret trykke **☁ Publiser til GitHub** i admin, og endringene
committes rett til repoet — ingen nedlasting, ingen manuell push. Fortsatt
100 % statisk og gratis (Cloudflare Pages Functions + GitHub OAuth).

Dette må settes opp **én gang**. Tokenet bor i en sikker httpOnly-cookie på
serveren og når aldri nettleseren.

> Virker bare på den **publiserte** siden (Cloudflare Pages), ikke når du åpner
> `admin.html` som en lokal fil — funksjonene under `/functions` kjører kun på
> Cloudflare.

---

## 1. Lag en GitHub OAuth-app

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
   (eller via organisasjonen som eier repoet).
2. Fyll inn:
   - **Application name:** `Apeiron Admin`
   - **Homepage URL:** `https://DIN-SIDE` (f.eks. `https://apeiron.pages.dev` eller eget domene)
   - **Authorization callback URL:** `https://DIN-SIDE/api/github/callback`
3. Opprett appen. Noter **Client ID**, og klikk **Generate a new client secret**
   og kopier hemmeligheten (vises bare én gang).

---

## 2. Sett miljøvariabler i Cloudflare Pages

Cloudflare-dashbordet → ditt Pages-prosjekt → **Settings → Environment variables**
→ **Production** (legg gjerne til **Preview** også). Legg til:

| Variabel | Verdi | Merknad |
|---|---|---|
| `GITHUB_CLIENT_ID` | fra OAuth-appen | |
| `GITHUB_CLIENT_SECRET` | fra OAuth-appen | merk som **Encrypt** |
| `GITHUB_REPO` | `eier/repo-navn` | f.eks. `apeiron-ntnu/nettside` |
| `GITHUB_BRANCH` | `main` | valgfri (default `main`) |
| `GITHUB_SCOPE` | `public_repo` | bruk `repo` hvis repoet er **privat** |
| `ALLOWED_LOGINS` | `brukernavn1,brukernavn2` | valgfri, men **anbefalt** — kun disse GitHub-brukerne får publisere |

Lagre og **redeploy** prosjektet (eller push en commit) så variablene tas i bruk.

---

## 3. Deploy

`/functions`-mappa committes med repoet. Cloudflare Pages oppdager og bygger
funksjonene automatisk — ingen ekstra konfigurasjon. Etter neste deploy svarer:

- `GET /api/github/login` → starter innlogging
- `GET /api/github/callback` → fullfører innlogging
- `GET /api/github/me` → innloggingsstatus
- `GET /api/github/latest` → siste commit (+ endrede filer) — driver «Sist publisert» + konfliktsjekk
- `GET /api/github/history` → siste commits — driver «Angre siste publisering»
- `POST /api/github/commit` → committer filer
- `POST /api/github/revert` → angrer siste publisering (ruller branchen tilbake til forrige tre)
- `POST /api/github/logout` → logg ut

---

## 4. Bruk

1. Åpne **admin** på den publiserte siden.
2. Klikk **☁ Logg inn for å publisere** (øverst til høyre) og godkjenn på GitHub.
3. Rediger som vanlig. Når du er fornøyd: **☁ Publiser til GitHub**.
4. Cloudflare bygger siden på nytt automatisk — live innen ~1 minutt.

**↓ Last ned alle endrede** (i Oversikt, bak «Publisering virker ikke?») finnes
fortsatt som reserveløsning hvis du heller vil laste ned filene og pushe manuelt.

---

## Sikkerhet — kort

- OAuth-tokenet lagres i en **httpOnly, Secure, SameSite=Lax-cookie** med **30 dagers**
  levetid (`callback.js`). Nettleser-JS kan ikke lese det; alle commits går gjennom
  server-funksjonen. Vil du ha kortere/lengre økt, juster `Max-Age` i `setCookie`-kallet.
- `ALLOWED_LOGINS` begrenser hvem som kan publisere, selv om de har GitHub-konto.
- `GITHUB_SCOPE=public_repo` gir kun tilgang til offentlige repo. Bruk `repo` kun
  hvis repoet er privat (videre tilgang).
- Client-secret ligger **kun** som kryptert miljøvariabel i Cloudflare — aldri i repoet.

---

## Feilsøking

| Symptom | Sannsynlig årsak |
|---|---|
| «GitHub-innlogging feilet (state)» | Callback-URL i OAuth-appen matcher ikke `…/api/github/callback` |
| «GitHub-innlogging feilet (token)» | Feil `GITHUB_CLIENT_SECRET` |
| Knappen «Logg inn» gjør ingenting lokalt | Du åpner admin som lokal fil — bruk den deployede siden |
| «ingen tilgang (navn)» | Brukernavnet er ikke i `ALLOWED_LOGINS` |
| `repo_not_configured` ved publisering | `GITHUB_REPO` mangler eller har feil format (`eier/navn`) |
| `ref_failed` | Feil `GITHUB_BRANCH`, eller tokenet mangler skrivetilgang til repoet |
