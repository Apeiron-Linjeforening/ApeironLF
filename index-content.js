/* Innhold for forsiden (index.html / «Hjem») — TEKST-delene som endres ofte.
   Sist oppdatert: 18.6.2026
   Rediger direkte her, eller åpne Admin-senteret → Forsiden for visuell redigering.

   Dekker forsiden (Hjem):
     hero    : eyebrow, undertittel, ingress, to knapper, «Ny her?»-bro + «under oppbygging»-banner
     arr     : seksjons-intro for Arrangementer (eyebrow, overskrift, ingress)
     apo     : seksjons-intro for Aporetisk Aften (+ gresk side-boks)
     fadder  : seksjons-intro for Fadderukene (eyebrow, overskrift, ingress)
     medlem  : intro-teksten i «Bli medlem» (eyebrow, overskrift, ingress, fordeler)
     kontakt : kontaktboksen (e-post, adresse, nettside + sosiale lenker)

   Disse delene STYRES ANNETSTEDS og ligger derfor IKKE her:
     - «Om oss» + FAQ → om-content.js (Admin → Om oss)
     - Arrangementer / Aporetisk Aften / Fadderuke (selve programmet) → Google Kalender
       (men seksjons-introene — overskrift + tekst — ligger her, under arr/apo/fadder)
     - Nyheter / beskjeder → news-content.js (Admin → Nyheter)
     - Oppslagstavla → oppslag-content.js (Admin → Oppslagstavla)
     - Bli medlem (priser/steg) → membership-config.js (Admin → Medlemskap)
       (men intro-teksten + fordels-lista i «Bli medlem» ligger her, under «medlem»)
     - Styret, Samarbeid, Lesesalen, Møt styret → egne sider/filer
*/

window.INDEX_CONTENT = {
  "hero": {
    "wordmark": { "pre": "Apeir", "mid": "o", "post": "n" },
    "eyebrow": "LINJEFORENING SIDEN 1981 · ",
    "tag": "det grenseløse fellesskapet",
    "lede": "Vi er linjeforeningen for filosofi og etikk ved NTNU. Vi tenker de store tankene, stiller de vanskelige spørsmålene og tar oss en kaffe på det etterpå.",
    "cta1": { "label": "Bli medlem", "href": "#bli-medlem" },
    "cta2": { "label": "Se hva som skjer", "href": "#oppslagstavla-teaser" },
    "bridge": "Ny her? Bli kjent med Apeiron",
    "wip": {
      "show": true,
      "text": "⚠ Siden er under oppbygging — innholdet er foreløpig og ikke endelig ⚠"
    }
  },

  "arr": {
    "eyebrow": "Hva skjer",
    "heading": "Arrangementer",
    "lede": "Fra dyptpløyende fagkvelder til legendariske symposion. Se hele semesterprogrammet som liste, rutenett eller helhetlig oversikt — og legg det rett inn i din egen kalender."
  },

  "apo": {
    "eyebrow": "Fast hver måned",
    "title": "Aporetisk Aften",
    "lede": "Én kveld i måneden samler vi oss rundt ett eneste spørsmål — uten pensum og uten fasit. Vi tenker høyt, er uenige i godt selskap, og går hjem med flere spørsmål enn vi kom med. Ferskinger og veteraner er like velkomne.",
    "forWhom": "Åpent for alle",
    "greek": "ἀπορία",
    "greekSub": "a-po-ri-a · «rådvillhet»",
    "note": "En aporia er øyeblikket der svarene tar slutt og den ekte tenkningen begynner. Akkurat der vil vi være."
  },

  "fadder": {
    "eyebrow": "Velkommen til Dragvoll",
    "heading": "Fadderukene",
    "lede": "Studiestartens beste uker — bli kjent med faget, byen og hverandre. Velg en dag for å se programmet."
  },

  "medlem": {
    "eyebrow": "Bli en av oss",
    "heading": "Bli medlem i Apeiron",
    "lede": "Studerer du filosofi eller etikk ved NTNU? Da hører du hjemme her. Ett medlemskap, et helt fellesskap.",
    // Fordelene i venstre kolonne av «Bli medlem». Hvert punkt er bare tekst
    // (avhukings-ikonet legges til automatisk). Priser og innmeldingssteg
    // styres separat i membership-config.js (Admin → Medlemskap).
    "benefits": [
      "Rabattert inngang på alle arrangementer",
      "Gratis kaffe på lesesalen, og rabatt på Apeiron-pins",
      "Et fellesskap av nysgjerrige folk på tvers av kull",
      "Mulighet til å sitte i komité eller styre"
    ]
  },

  "kontakt": {
    "eyebrow": "Kontakt",
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
