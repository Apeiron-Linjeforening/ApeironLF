/* Produktdata for Apeiron merch-siden.
   Sist oppdatert: 14.6.2026
   Rediger direkte her, eller åpne merch-admin.html for visuell redigering.

   badgeType: "bestseller" | "new" | "limited" | null
   btnLabel : tekst på handlekurv-knappen (tom = "Legg i kurv")
   sizes/colors: array av varianter (f.eks. ["S","M","L"]) eller null
   price: null skjuler pris og gir «Kommer snart» i stedet for kjøp
   Farger (alle valgfrie) — palettnavn, { light, dark }, eller rå hex:
     badgeColor     : fri badge-farge (overstyrer typefargen)
     badgeTextColor : fri tekstfarge på badgen (tom = hvit)
     badgeGlow      : glød bak badgen — fast farge ELLER { anim: "..." }
     btnColor   : fri knappefarge
     edge       : farget kant rundt kortet, ELLER { anim: "aurora-bold" }
                  for animert glød (se APEIRON_ANIMATED i palette.js)
   img: null (viser segl-watermark), base64-bilde fra admin,
        eller "assets/merch/filnavn.jpg" for bilder i repoet */

window.MERCH_INFO = "";

window.MERCH_PRODUCTS = [
  {
    "id": "segl-pin",
    "badge": "Kommer Snart!",
    "badgeType": null,
    "category": "Klær",
    "name": "Gensere er på vei!",
    "desc": "HIV er i gang med å designe gensere, kopper og muligens skrivebøker.\nFølg med!",
    "price": null,
    "memberPrice": null,
    "img": null,
    "emailSubject": "Bestilling: Segl-pin",
    "emailBody": "",
    "edge": null,
    "badgeColor": "maroon",
    "btnColor": null,
    "btnLabel": null,
    "sizes": null,
    "colors": null,
    "badgeGlow": null
  },
  {
    "id": "pmqdgyn8o5o5",
    "badge": "Kommer snart!",
    "badgeType": null,
    "category": "Tilbehør",
    "name": "Emaljekopp",
    "desc": "HIV er i gang med å designe gensere, kopper og muligens skrivebøker.\nFølg med!",
    "price": null,
    "memberPrice": null,
    "img": null,
    "sizes": null,
    "colors": null,
    "badgeGlow": null,
    "emailSubject": "Bestilling: ",
    "emailBody": "",
    "badgeColor": "maroon"
  }
];
