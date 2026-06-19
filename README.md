# Apeiron Linjeforenings Nettside

Nettsiden for Apeiron, linjeforeningen for filosofi og etikk ved NTNU.
Statisk nettside (HTML/CSS/JS). Ingen byggesteg, ingen avhengigheter å installere.
**Vibrasjonskoding har aldri vært så effektivt!**

Se [HVORDAN.md](/HVORDAN.md) for hvordan man kan redigere og bruke nettsiden, samt meget rotete informasjon om den.

Se [CHANGELOG.md](/CHANGELOG.md) for hva som har blitt gjort.

Se [Plan F.html](/Plan%20F.html) for veikartet videre (git-CMS → klonbar mal) og en handoff av hvor vi står.

---
## Slik er nettsiden bygd (kort)

Statisk side (HTML/CSS/JS), ingen byggesteg. Meny og footer bygges sentralt fra
`nav-content.js` / `site-content.js` via `site-chrome.js` og injiseres på alle sider.
Sideinnhold ligger i data-filer (`*-content.js` / `*-config.js`), ikke hardkodet i HTML.

**All redigering skjer i ett samlet Admin-senter (`admin.html`):** et skall som
mounter tynne editor-moduler fra `admin-modules/<område>.js`. Modulene deler
`admin-common.js` (datalager `createStore`, drag-sortering, hjelpebobler, `saveFile`,
panel-registeret `AdminPanels`) og `admin-modules.css` (klasse-scopet stil per modul).
Hver modul har live forhåndsvisning og en «↓ Last ned»-knapp; redigeringsløkka er
*rediger → last ned data-fil → commit/push → Cloudflare bygger (~1 min)*.
Full arkitekturforklaring: [docs/admin-arkitektur.md](/docs/admin-arkitektur.md).

# OBS!: 
**Nettsiden er under oppbygging. Det som står på siden burde tas kun som plassholdere.**

---
## Kjente begrensninger og usikkerheter

Ting vi vet om, men er usikre på om det er verdt å gjøre noe med. Ført opp så de ikke glemmes - ikke nødvendigvis feil som må fikses.

- **Merch: én farge kan bare kobles til ett bilde.** Har du to bilder av samme farge (f.eks. for- og bakside av samme genser), kan bare det ene knyttes til fargen. Velger man samme farge på bilde nummer to, flyttes koblingen dit. Lite problem i praksis (kunden ser uansett hele galleriet via miniatyrstripa). Å støtte flere bilder pr. farge ville kreve en mer kompleks datamodell.
- **Meny og footer vises et lite øyeblikk etter at siden lastes.** De bygges av `site-chrome.js` i nettleseren (for å slippe byggesteg og holde alt i én fil). På treg forbindelse kan man så vidt se at de «popper inn». Menyen er fast posisjonert, så selve innholdet hopper ikke. Alternativet (byggesteg) ble vurdert og valgt bort, se diskusjon i commit-historikk.
- **Footer/meny krever JavaScript.** Med JS avslått vises ikke meny/footer. Gjelder en svært liten andel besøkende; resten av siden bruker uansett JS (kalender, søk, kurv).
- **README-seksjonen «Lagre admin-endringer rett til repo-fila» (over) er utdatert.** Den direkte-lagrings-funksjonen (File System Access) ble fjernet fordi den feilet på enkelte systemer; admin-panelene laster nå alltid ned fila. Avsnittet bør ryddes ved anledning.
- **Bilder lagres som base64 i datafilene.** Mange/store produktbilder gjør `merch-products.js` stor. Admin skalerer ned til maks 900px webp, men mange bilder kan likevel bli tungt. Vurder eksterne bildefiler (`assets/merch/...`) hvis filene blir veldig store. Vil ikke å lagre de eksternt bare gjøre bildene større? -> lagre de i base64 i egen fil?

---
## To do

Kritisk:
- [ ] Sjekke at "Legg til fadderukeprogrammet i din kalender" fungerer: iCal og Google Kalender.
- [ ] Revamp av Hero.
- [ ] Ny måte å legge inn 'nyheter' / informasjon på. Google sheets er for treg. -> Redesign av hvordan nyhetene vises. -> Gamle nyheter må kunne fremdeles vises / gå til et arkiv e.l.

Medium:
- [ ] Be HF studentrådet om å oppdatere sidene deres og gi oss mer informasjon om hva de faktisk gjør. 
      - [ ] Hva gjør egentlig en PTV, ITV og FTV? 
      - [ ] Hvordan får vi kontakt med våre egne TVer?
- [ ] Lage egen Admin for index. - Halvveis gjort.
- [ ] Finne en bedre måte å vise arrangement og plakater på -> Måte å vise nyheter/informasjon på.
- [ ] Legge til side for møtereferat -> Kan tas i egen wiki, muligens.
- [ ] Live forhåndsvisning i alle admin-paneler (som i `footer-admin.html`). Merch, Index, Meny, Begrep, Hjelp, og Styret er gjort -> Mangler Utmerkelser, Oppnåelser. Footer preview må oppdateres. 
- [ ] Sammenlign med https://www.mfplacebo.no/
- [x] Oppslagstavla på index er i liten oppløsning og ser litt grumsete ut.

Lav:
- [ ] Fylle ut SAK / utvide den.
- [ ] Sette opp et arkiv.
- [ ] Full revamp av hvordan hele siden redigeres: mer square space aktig.
      Hva kan ikke gjøres per nå: Endre av logo - Flytte om på seksjoner - Flytte seksjoner mellom sider - Endre alt fra én admin side - Visuell endring direkte i et preview.

Ønsker:
- [ ] Snakke med IFR/NTNU om API for automatisk oppdatering av emner for studiene.
- [ ] Burde det være en direkte måte for TVene ved IFR å legge ved oppdateringer på nettsiden vår?
- [ ] Kunne trykke på emne under hvert studie og bli tatt til emnet i pensumlistene - kan bli slitsomt å oppdatere i admin.
- [ ] Automatisk tema endring av sidene: Jul, 17. mai, påske, halloween, fadderukene, frigjøringsdagen, HMS bursdag (legge dette til i en admin fil, muligens... HMS er gammel) + mulighet til å skru de av, endre bilder, farger osv.

Må gjøres før vi slapper av med å bygge nettsiden:
- [ ] Sjekke at alle admin sider fungerer.
- [ ] Kvadrupelsjekk at informasjon under Hjelp er helt riktig!! Sjekk numre og eposter!
- [ ] Sjekke på nytt hvordan alt oppfører seg på mobil og smalere skjermer.
- [ ] Fjern WIP banneret.
- [ ] Lage en ordentlig How-To.
- [ ] Rydde opp i Readme og sette inn i Readme hva som er gjort og hvordan alt fungerer
- [ ] Oppdater søkeindex

Skjelett Prosjekt:
- [ ] Gjøre om prosjektet til et nytt repo som kan klones og lett gjøres om til andre linjeforeninger.
- [ ] Må lages en readme som sier hva man må gjøre for å starte.

Domene:
- [ ] Vurdere om vi skal få bedre domene.
**NTNU-alternativ (`apeiron.org.ntnu.no`) viser nå til nettsiden**

| Domene                 | Status      | Pris       | Registrar            |
| ------------------------| -------------| ------------| ----------------------|
| apeiron.no             | **Tatt**    | —          | —                    |
| apeiron.org            | **Tatt**    | —          | —                    |
| apeironntnu.no         | **Ledig** ✅ | 149 kr/år  | Loopia               |
| apeironntnu.org        | **Ledig** ✅ | 169 kr/år  | Loopia               |
| apeironntnu.org        | **Ledig** ✅ | 275 kr/år  | Domeneshop           |
| apeironntnu.org        | **Ledig** ✅ | $11.20 /år | Cloudflare Registrar |
| apeironntnu.com        | **Ledig** ✅ | $10.46 /år | Cloudflare Registrar |
| apeironntnu.net        | **Ledig** ✅ | $11.86 /år | Cloudflare Registrar |
| apeironntnu.online     | **Ledig** ✅ | 9 kr /år   | Loopia               |
| apeironlf.org          | **Ledig** ✅ | $11.20 /år | Cloudflare Registrar |
| apeironlf.com          | **Ledig** ✅ | $10.46 /år | Cloudflare Registrar |
| apeironlf.no           | **Ledig** ✅ | 99 kr /år  | Domeneshop           |
| apeironlf.no + .online | **Ledig** ✅ | 99 kr /år  | Domeneshop           |

Merk: Cloudflare Registrar støtter ikke .no-domener. For .org er Cloudflare billigst.



## Lisens
---
[MIT License](LICENSE)

                                  |
                                 |||
                                |||||
                  |    |    |   |||||||
                 )_)  )_)  )_)   ~|~
                )___))___))___)\  |
               )____)____)_____)\\|
             _____|____|____|_____\\\__
             \                       /
       ~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~
               ~^~  all aboard!  ~^~
       ~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~~^~^~

---

© 2026 Apeiron Linjeforening
