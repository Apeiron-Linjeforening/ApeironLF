# To-do og veikart

Arbeidslista for nettsiden. Flyttet hit fra README.md så «utstillingsvinduet» slipper
git-støy hver gang et punkt endres. Kryss av med `[x]`, og datostemple gjerne påstander
som kan bli utdaterte (priser, statuser) med *«sjekket DD.MM.ÅÅ»*.

> 🗺️ Det større veikartet (klonbar mal for enhver linjeforening) ligger i
> [docs/admin-arkitektur.md](docs/admin-arkitektur.md).

---

## Kritisk

- [ ] Sjekke hvordan alt fungerer på mobil. (Husk å sjekke flere forskjellige størrelser på skjermer)
- [ ] "Medlemskap" i medlemskap under "om oss" i Lys-modus er i en veldig svak farge. Dette kan hinte til en feil i koden. Medlemskap seksjonene burde være identiske utifra Admin.
- [ ] Forhåndsvisning for mobil i admin suger og er ikke standarisert over alle panelene.

## Medium

- [ ] Sjekke at "Legg til fadderukeprogrammet i din kalender" fungerer: iCal og Google Kalender.

## Lav

- [ ] Be HF studentrådet om å oppdatere sidene deres og gi oss mer informasjon om hva de faktisk gjør.
      - [ ] Hva gjør egentlig en PTV, ITV og FTV?
      - [ ] Hvordan får vi kontakt med våre egne TVer?
- [ ] Legge til side for møtereferat -> Kan tas i egen wiki, muligens. Fylle ut SAK / utvide den kan tas på denne wiki siden.
- [ ] Sammenlign med https://www.mfplacebo.no/
- [ ] Avklare lagring av merch-bilder hvis `content/merch-products.js` blir stor: eksterne filer i `assets/merch/` vs. base64 i egen fil? (Base64 er ~33 % større enn binærfil — eksterne filer er mindre totalt, men krever at admin publiserer bildefiler ved siden av datafila, slik Styret-panelet alt gjør.)

## Venter på svar
 - [ ] Vi har sendt melding til IFR om å muligens få API til studieretninger, emner og pensum. 

## Ønsker

- [ ] Snakke med IFR/NTNU om API for automatisk oppdatering av emner for studiene.
- [ ] Automatisk tema endring av sidene: Jul, 17. mai, påske, halloween, fadderukene, frigjøringsdagen, HMS bursdag (legge dette til i en admin fil, muligens... HMS er gammel) + mulighet til å skru de av, endre bilder, farger osv.

## Må gjøres før vi slapper av med å bygge nettsiden

- [ ] Sjekke på nytt hvordan alt oppfører seg på mobil og smalere skjermer.

---

## Domene

- [ ] Vurdere om vi skal få bedre domene.

**NTNU-alternativ (`apeiron.org.ntnu.no`) viser nå til nettsiden**

> 🔁 **Sjekk at redirecten er 301 (permanent), ikke 302 (midlertidig).** En 301 lar
> NTNU-domenets autoritet «arve» over til nettsiden i søkemotorer; en 302 gjør det ikke.
> Test i terminal:
> ```
> curl -sI https://apeiron.org.ntnu.no | grep -i "^HTTP\|^location"
> ```
> Se etter `HTTP/.. 301` (bra) eller `308` (også permanent). Får du `302`/`307`, be den
> som satte opp redirecten (IT/IFR) om å gjøre den permanent.

<details>
<summary><b>Domene-status og priser</b> <i>(sjekket ca. 04.07.26 — priser og ledighet endrer seg)</i></summary>

| Domene                 | Status      | Pris       | Registrar            |
| ------------------------| -------------| ------------| ----------------------|
| apeiron.no             | **Tatt**    | –          | –                    |
| apeiron.org            | **Tatt**    | –          | –                    |
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

</details>
