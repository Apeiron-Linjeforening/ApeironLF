/* Innhold for forsiden (index.html / «Hjem») — TEKST-delene som endres ofte.
   Sist oppdatert: 18.6.2026
   Rediger direkte her, eller åpne index-admin.html for visuell redigering.

   Dekker forsiden (Hjem):
     hero    : eyebrow, undertittel, ingress, to knapper + «under oppbygging»-banner
     kontakt : kontaktboksen (e-post, adresse, nettside + sosiale lenker)

   Disse delene STYRES ANNETSTEDS og ligger derfor IKKE her:
     - «Om oss» + FAQ → om-content.js (om-oss-admin.html)
     - Arrangementer / Aporetisk Aften / Fadderuke → Google Kalender
     - Nyhetsstriper → Google Sheet «Nyheter»
     - Oppslagstavla → oppslag-content.js (oppslagstavla-admin.html)
     - Bli medlem (priser/steg) → membership-config.js (medlemskap-admin.html)
     - Styret, Samarbeid, Lesesalen, Møt styret → egne sider/filer
*/

window.INDEX_CONTENT = {
  "hero": {
    "eyebrow": "LINJEFORENING SIDEN 1981 · ",
    "tag": "det grenseløse fellesskapet",
    "lede": "Vi er linjeforeningen for filosofi og etikk ved NTNU. Vi tenker de store tankene, stiller de vanskelige spørsmålene og tar oss en kaffe på det etterpå.",
    "cta1": { "label": "Bli medlem", "href": "#bli-medlem" },
    "cta2": { "label": "Se hva som skjer", "href": "#oppslagstavla-teaser" },
    "wip": {
      "show": true,
      "text": "⚠ Siden er under oppbygging — innholdet er foreløpig og ikke endelig ⚠"
    }
  },

  "kontakt": {
    "heading": "Ta kontakt",
    "email": "apeironlinjeforening@gmail.com",
    "address": "Låven, Dragvoll allé 40 · NTNU Trondheim",
    "web": "apeironlf.pages.dev",
    "webHref": "https://apeironlf.pages.dev",
    // Sosiale/medie-lenker nederst i kontaktboksen. icon = nøkkel fra
    // footer-icons.js (instagram, facebook, youtube, tiktok, discord,
    // linkedin, x, github, email, web). Legg til / fjern fritt i admin.
    "socials": [
      { "label": "Instagram", "href": "https://www.instagram.com/apeiron_linjeforening_ntnu/", "icon": "instagram" },
      { "label": "Meme", "href": "https://www.instagram.com/apeironmeme/", "icon": "instagram" },
      { "label": "Facebook", "href": "https://www.facebook.com/ApeironNTNU/", "icon": "facebook" },
      { "label": "E-post", "href": "mailto:apeironlinjeforening@gmail.com", "icon": "email" }
    ],
    // Kort FAQ vist ved siden av kontaktboksen på Hjem (den fulle FAQ-en ligger på Om oss).
    "faqHeading": "Ta kontakt & vanlige spørsmål",
    "faq": [
      {
        "q": "Hvordan kan jeg engasjere meg mer?",
        "a": "Bli med i en komité! Det er den enkleste veien inn. Si fra til en i styret, eller send oss en melding på Instagram, så kobler vi deg på."
      },
      {
        "q": "Hva er S.A.K?",
        "a": "S.A.K — Sosiale Arrangement Komité — er styrets hjelpemiddel for å gi studenter en lavterskel måte å ta del i planlegging og gjennomføring av det sosiale på. Vil du engasjere deg uten å sitte i styret, er dette den enkleste veien inn."
      },
      {
        "q": "Hva er Begrep?",
        "a": "Begrep er et studentdrevet filosofitidsskrift laget av nåværende og tidligere filosofi- og etikkstudenter. Det springer ut av det samme studentmiljøet — alle kan sende inn bidrag og få redaksjonell tilbakemelding."
      }
    ]
  }
};
