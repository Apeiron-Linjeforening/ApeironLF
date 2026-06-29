# Eierskap og overlevering — MAL

**Sist oppdatert:** `__.__.____`  ·  **Oppdatert av:** `__________________`

> ### 📋 Dette er en TOM MAL
> Denne fila ligger i det **offentlige** repoet og skal forbli tom (kun `____`-felt).
> Den dokumenterer *hva* foreningen bør holde styr på.
>
> **Den UTFYLTE versjonen** (med ekte detaljer) skal IKKE ligge her. Lag en kopi som
> heter `docs/eierskap-og-overlevering.md` (den er git-ignorert, så den pushes aldri),
> eller — best — legg den i foreningens **private Google Drive / passordmanager** der
> styret nnår den. Aldri skriv ekte detaljer inn i *denne* fila.

**Hva er dette?** En oversikt over *hvem som eier hva* bak Apeiron-nettsiden, og en
sjekkliste for å overlevere det trygt til neste styre. Du trenger **ikke** å være teknisk
for å bruke den. Tenk på den som «nøkkelknippet» til nettsiden, med en forklaring på hva
hver nøkkel låser opp.

> ### ⚠️ Den viktigste regelen
> Nettsiden er gratis og nesten vedlikeholdsfri. Den store risikoen er **ikke** at koden
> ryker, men at foreningen **mister tilgang** fordi alt lå på én students personlige
> konto, og den studenten ble uteksaminert. Da kan man i verste fall miste hele nettsiden
> og domenet. **Alt skal eies av kontoer foreningen kontrollerer over tid**, ikke av en
> enkeltperson.

> ### 🔒 Skriv ALDRI passord
> Selv i den private, utfylte kopien: skriv **hvor** innloggingene finnes (i foreningens
> passordmanager), aldri selve passordene eller hemmelige nøkler.

---

## Innhold
1. [Kort forklaring: hvordan henger det sammen?](#1-kort-forklaring-hvordan-henger-det-sammen)
2. [Eierskaps-oversikt (fyll inn)](#2-eierskaps-oversikt-fyll-inn)
3. [Hvor ligger innlogginger og hemmeligheter?](#3-hvor-ligger-innlogginger-og-hemmeligheter)
4. [Hvem har tilgang til å publisere? (fyll inn)](#4-hvem-har-tilgang-til-å-publisere-fyll-inn)
5. [Løpende vedlikehold (hvem gjør hva, hvor ofte)](#5-løpende-vedlikehold-hvem-gjør-hva-hvor-ofte)
6. [Sjekkliste ved styreskifte](#6-sjekkliste-ved-styreskifte)
7. [Hvis noe slutter å virke](#7-hvis-noe-slutter-å-virke)
8. [Nødssituasjon: utestengt fra noe](#8-nødssituasjon-utestengt-fra-noe)

---

## 1. Kort forklaring: hvordan henger det sammen?

Nettsiden er satt sammen av noen gratis tjenester som snakker med hverandre. Du trenger
ikke forstå detaljene, men det hjelper å vite hvilke «bokser» som finnes:

| «Boks» | Hva den gjør, i klartekst |
|---|---|
| **Domenet** (adressen folk skriver) | Selve nettadressen, f.eks. `apeiron…no`. Må **fornyes og betales** jevnlig, ellers forsvinner den. |
| **GitHub** | Her bor selve nettsiden (all teksten, bildene, koden). «Publiser» i admin lagrer hit. |
| **Cloudflare Pages** | Viser nettsiden ut til verden. Henter automatisk fra GitHub hver gang noe publiseres. |
| **Google-konto + Google Cloud** | Eier kalenderen, bildemappa (Drive) og «nøkkelen» som lar siden hente dem. |
| **Google Apps Script** | Tar imot merch-bestillinger og legger dem i et regneark. |
| **Foreningens Gmail** | `apeironlinjeforening@gmail.com` — knyttet til mye av det over. |
| **Passordmanager** | Der alle innloggingene over *bør* ligge trygt, delt med styret. |

Når et nytt styre «bare publiserer», bruker de bare GitHub + admin. Men **noen** må eie
alle boksene over, ellers stopper ting opp over tid.

---

## 2. Eierskaps-oversikt (fyll inn)

Fyll inn dette i den **private** kopien og hold det oppdatert. *Ikke* skriv passord her —
bare hvem som eier og hvor det administreres.

> ✅ **Slik krysser du av:** der det står `[ ] Ja  [ ] Nei`, setter du en `x` mellom
> klammene på det som stemmer — f.eks. `[x] Ja  [ ] Nei`. (La det andre stå tomt.)

### Domenet (nettadressen)
| Felt | Verdi |
|---|---|
| Domenenavn | `__________________` |
| Hvor er det kjøpt (registrar, f.eks. Domeneshop/Cloudflare) | `__________________` |
| Konto domenet ligger på | `__________________` |
| Når må det fornyes / utløpsdato | `__________________` |
| Hvem betaler / hvordan | `__________________` |
| Auto-fornyelse på? | [ ] Ja  [ ] Nei |

> 💡 Sett **auto-fornyelse PÅ** og bruk en betalingsmåte som ikke utløper med en
> enkeltperson. Et tapt domene er den dyreste og vanskeligste feilen å rette.

### Cloudflare (viser nettsiden)
| Felt | Verdi |
|---|---|
| Cloudflare-konto (e-post) | `__________________` |
| Navn på Pages-prosjektet | `__________________` |
| Hvem har tilgang i dag | `__________________` |

### GitHub (her bor nettsiden)
| Felt | Verdi |
|---|---|
| Eier av repoet (bruker eller organisasjon) | `__________________` |
| Repo-navn | `__________________` |
| Er det en GitHub-**organisasjon** for foreningen? | [ ] Ja  [ ] Nei |

> 💡 Aller helst bør repoet ligge i en **GitHub-organisasjon** som foreningen eier, ikke
> på en privatperson. Da kan eierskap overføres uten å flytte selve koden.

### Google (kalender, bilder, API-nøkkel)
| Felt | Verdi |
|---|---|
| Google-konto som eier kalender + Drive | `__________________` |
| Google Cloud-prosjekt (for API-nøkkelen) | `__________________` |
| Drive-mappa for galleribilder (lenke) | `__________________` |
| Er Drive-mappa delt «Alle med lenken kan se»? | [ ] Ja  [ ] Nei |

### Merch-bestilling (Google Apps Script + regneark)
| Felt | Verdi |
|---|---|
| Google-konto som eier Apps Script + regneark | `__________________` |
| Lenke til bestillings-regnearket | `__________________` |
| Hvor merch-bestillinger varsles (e-post) | `__________________` |

### Foreningens Gmail
| Felt | Verdi |
|---|---|
| Adresse | `__________________` |
| Hvem kjenner innloggingen | `__________________` |
| 2FA (tofaktor) på? | [ ] Ja  [ ] Nei |

---

## 3. Hvor ligger innlogginger og hemmeligheter?

Selve passordene og de hemmelige nøklene skal ligge i en **passordmanager** som styret
deler (f.eks. Bitwarden — gratis, eller 1Password). Skriv her *hvor*, ikke *hva*:

| Felt | Verdi |
|---|---|
| Hvilken passordmanager bruker foreningen | `__________________` |
| Hvem har tilgang til den i dag | `__________________` |
| Ligger ALLE kontoene fra del 2 inne der? | [ ] Ja  [ ] Nei |

**De hemmelige nøklene som finnes (alle bor i Cloudflare, ikke i koden):**

Disse er satt opp én gang og styres i Cloudflare-dashbordet
(*Pages-prosjektet → Settings → Environment variables*). Du trenger normalt aldri å røre
dem, men det er greit å vite at de finnes:

| Navn | Hva det er | Hvor det settes |
|---|---|---|
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Lar admin-«Publiser» snakke med GitHub | Cloudflare-miljøvariabler |
| `GITHUB_REPO` / `GITHUB_BRANCH` | Hvilket repo og gren det publiseres til | Cloudflare-miljøvariabler |
| `ALLOWED_LOGINS` | Hvem som får publisere (GitHub-brukernavn) | Cloudflare-miljøvariabler |
| Google API-nøkkel | Lar siden hente kalender og bilder | Cloudflare (injiseres som `api-config.js`) |

> Detaljert teknisk oppsett: [g1-oppsett.md](g1-oppsett.md) (GitHub-publisering) og
> [apps-script-oppsett.md](apps-script-oppsett.md) (merch). Disse trengs bare hvis noe
> skal settes opp på nytt.

---

## 4. Hvem har tilgang til å publisere? (fyll inn)

«Publiser» i admin krever GitHub-innlogging, og kun brukernavn i listen `ALLOWED_LOGINS`
(i Cloudflare) får lov. Hold denne oppdatert ved hvert styreskifte.

| Navn | GitHub-brukernavn | Rolle / verv | La til (dato) | Skal fjernes når |
|---|---|---|---|---|
| `__________` | `__________` | `__________` | `________` | `________` |
| `__________` | `__________` | `__________` | `________` | `________` |
| `__________` | `__________` | `__________` | `________` | `________` |

> ⚠️ **Fjern folk som går ut av styret.** Ellers beholder de publiseringstilgang etter at
> de har sluttet. Endres i Cloudflare → miljøvariabelen `ALLOWED_LOGINS` (komma mellom
> brukernavn), og deretter en redeploy.

---

## 5. Løpende vedlikehold (hvem gjør hva, hvor ofte)

Et styre som «bare publiserer» klarer alt innhold uten dette. Men utpek **én teknisk
ansvarlig** per periode som tar punktene under. De er enkle, men noen må gjøre dem.

| Hvor ofte | Oppgave | Hvorfor |
|---|---|---|
| **Ved styreskifte** | Kjør hele [sjekklista i del 6](#6-sjekkliste-ved-styreskifte) | Tilganger og eierskap rullerer ikke av seg selv |
| **~Månedlig** | Gå til GitHub → **Pull requests** og merge «Dependabot»-forslagene (trykk «Merge») | Holder de automatiske verktøyene oppdatert så de ikke slutter å virke |
| **~Månedlig** | Gå til GitHub → **Security**-fanen og se om det er nye varsler | Ingen varsler deg ellers om en sårbarhet |
| **Årlig** | Sjekk at domenet ikke er nær utløp og at betaling virker | Et tapt domene er verste utfall |
| **Ved behov** | Hold Drive-bildemappa delt «Alle med lenken kan se» | Ellers blir galleriet tomt |

Du trenger **ikke** å oppdatere selve koden jevnlig. Den er statisk og ruster ikke.

---

## 6. Sjekkliste ved styreskifte

Gå gjennom denne sammen — gammelt og nytt styre — én gang i året.

**Tilganger:**
- [ ] Lagt til nye redaktørers GitHub-brukernavn i `ALLOWED_LOGINS` (Cloudflare) + redeploy
- [ ] **Fjernet** avgåtte medlemmer fra `ALLOWED_LOGINS`
- [ ] Oppdatert tabellen i [del 4](#4-hvem-har-tilgang-til-å-publisere-fyll-inn) i den private kopien
- [ ] Slått på **2FA (tofaktor)** for alle nye med tilgang — på GitHub *og* Cloudflare

**Eierskap og innlogginger:**
- [ ] Ny teknisk ansvarlig har tilgang til foreningens **passordmanager**
- [ ] Bekreftet at domene, Cloudflare, GitHub og Google-kontoen IKKE er låst til en person som slutter
- [ ] Alle felt i [del 2](#2-eierskaps-oversikt-fyll-inn) og [del 3](#3-hvor-ligger-innlogginger-og-hemmeligheter) er fylt ut og stemmer

**Sikkerhet (bekreft at vernet står på):**
- [ ] Branch-regel på `main` står fortsatt (GitHub → Settings → Rules): «Block force pushes» + «Restrict deletions»
- [ ] Google API-nøkkelen er fortsatt låst til riktig domene (Google Cloud Console)

**Kunnskap:**
- [ ] Ny teknisk ansvarlig har lest [README.md](../README.md) (innhold) og [VEDLIKEHOLD.md](../VEDLIKEHOLD.md) (drift)
- [ ] Avtroppende har vist hvordan man publiserer og angrer en publisering

---

## 7. Hvis noe slutter å virke

| Symptom | Sannsynlig årsak | Hva du gjør |
|---|---|---|
| Galleriet er tomt / bilder mangler | Drive-mappa er ikke lenger delt offentlig, eller et enkeltbilde er privat | Sett delingen til «Alle med lenken kan se» |
| Kalenderen viser ingen arrangementer | API-nøkkel utløpt/feil, eller kalenderen ikke delt | Sjekk Google Cloud-prosjektet og at kalenderen er offentlig |
| «Publiser» i admin gir feil | Utlogget, eller brukernavn ikke i `ALLOWED_LOGINS` | Logg inn på nytt; sjekk `ALLOWED_LOGINS` i Cloudflare |
| «Publiser» sier `forbidden_path` | Admin prøver å skrive en systemfil (skal ikke skje normalt) | Kontakt teknisk ansvarlig — kan trenge en kodejustering |
| Merch-bestilling kommer ikke frem | Apps Script trenger ny godkjenning, eller URL endret | Se [apps-script-oppsett.md](apps-script-oppsett.md) |
| Hele siden er nede | Domene utløpt, eller Cloudflare-problem | Sjekk domenets utløpsdato først, så Cloudflare-statusen |

Større endringer eller feilsøk: en KI-assistent som Claude kan hjelpe en ikke-teknisk
person steg for steg — beskriv problemet og pek på denne fila og [VEDLIKEHOLD.md](../VEDLIKEHOLD.md).

---

## 8. Nødssituasjon: utestengt fra noe

Hvis foreningen har mistet tilgang til en konto (personen som eide den er borte):

- **Domenet:** kontakt registraren (der domenet ble kjøpt) med dokumentasjon på at dere
  representerer foreningen. Haster hvis det er nær utløp.
- **Google-kontoen / Gmail:** prøv Googles kontogjenoppretting. Derfor er det viktig at
  gjenopprettings-e-post/telefon peker på noe foreningen styrer, ikke en privatperson.
- **GitHub / Cloudflare:** hvis dere har *noen* med tilgang igjen, kan de legge til nye
  eiere før den siste mister tilgang. Har dere ingen igjen, kontakt tjenestens støtte.
- **Verste fall (alt tapt):** nettsiden kan bygges opp igjen fra koden hvis dere fortsatt
  har en kopi av GitHub-repoet (last gjerne ned en zip av repoet og ta vare på den).
  Domenet er det vanskeligste å få tilbake — derfor topp-prioritet å aldri miste det.

> **Forebygging slår alltid gjenoppretting:** hold del 2–4 oppdatert, bruk en delt
> passordmanager, og knytt aldri noe kritisk til kun én persons private konto.
