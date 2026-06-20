/* Innhold for Oppslagstavla (oppslagstavla.html).
   Sist oppdatert: 18.6.2026
   Rediger direkte her, eller åpne Admin-senteret → Oppslagstavla for visuell redigering.

   posters[].img       : "assets/oppslag/filnavn.webp", base64-bilde fra admin, eller null.
   posters[].date      : fritekst-dato.
   posters[].note      : valgfri kort undertekst.
   posters[].link      : valgfri lenke (side.html#anker eller https://…).
   posters[].linkLabel : tekst på lenken (standard «Les mer»).
   posters[].accent    : pin-/aksentfarge — palettnavn ("" = gull) eller { light, dark }. */

window.OPPSLAG_CONTENT = {
  "intro": {
    "eyebrow": "Oppslagstavla",
    "heading": "Hva henger på tavla?",
    "lede": "Plakatene for det som skjer i Apeiron. Fagkvelder, fester, frister og kunngjøringer. Nyeste oppslag øverst. Klikk en plakat for detaljer."
  },
  "posters": [
    {
      "id": "p1",
      "title": "Aporetisk Aften",
      "date": "Første Aporetisk er i lag med Begrep!",
      "note": "Ett spørsmål, ingen fasit. Åpent for alle. Bare møt opp! ",
      "img": null,
      "link": "index.html#aporetisk",
      "linkLabel": "Les mer",
      "accent": "maroon"
    },
    {
      "id": "p3",
      "title": "Fadderuke 2026",
      "date": "August 2026",
      "note": "Studiestartens beste uker. Programmet er nesten helt klart! Se kalenderen!",
      "img": null,
      "link": "index.html#fadderuke",
      "linkLabel": "Se programmet",
      "accent": "green"
    },
    {
      "id": "lp-drikk",
      "title": "Logikk Drikk",
      "date": "Mandag 25.05 · kl 16.00",
      "note": "Årets siste logikk-panikk — eksamenspanikken på Den gode nabo, med rom for en panikk-pils.",
      "img": "assets/logikk-panikk/logikk-drikk.png",
      "link": "",
      "linkLabel": "",
      "accent": "plum",
      "done": true
    },
    {
      "id": "lp-panikk",
      "title": "Logikk Panikk",
      "date": "Hver mandag · 14–16",
      "note": "Tidligere logikkstudenter hjelper deg gjennom pensum. Loftet på Låven.",
      "img": "assets/logikk-panikk/logikk-panikk.jpg",
      "link": "",
      "linkLabel": "",
      "accent": "blue",
      "done": true
    }
  ]
};
