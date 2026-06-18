/* Innhold for Utmerkelser-siden (utmerkelser.html).
   Sist oppdatert: 17.6.2026
   Rediger direkte her, eller åpne utmerkelser-admin.html for visuell redigering.

   Utmerkelser hedrer PERSONER som har stått ut i studentmiljøet eller det
   frivillige arbeidet under IFR. (Premier foreningen har vunnet hører hjemme
   på Oppnåelser-siden — oppnaelser.html.)

   intro          : overskrift øverst på siden.
   people[].img   : "assets/utmerkelser/filnavn.jpg", base64-bilde fra admin, eller null.
   people[].honor : selve utmerkelsen, vises stort (f.eks. «Æresmedlem»).
   people[].accent: fargestripe — palettnavn ("" = gull) eller { light, dark }.

   ⚠︎ Eksemplene under er maler — bytt dem ut med ekte personer i admin. */

window.UTMERKELSER_CONTENT = {
  "intro": {
    "eyebrow": "Heder & ære",
    "heading": "Utmerkelser",
    "lede": "Noen mennesker løfter hele miljøet rundt seg. Her hedrer vi dem som har stått ut — i det frivillige arbeidet, i fellesskapet, og i det å gjøre Apeiron til et sted å høre hjemme."
  },
  "people": [
    {
      "id": "p1",
      "name": "Fornavn Etternavn",
      "initials": "FE",
      "img": null,
      "honor": "Æresmedlem",
      "year": "2026",
      "accent": "gold",
      "desc": "Et eksempelkort. Beskriv kort hva personen har betydd for Apeiron og hvorfor de fortjener heder. Bytt ut navn, bilde og tekst i admin."
    },
    {
      "id": "p2",
      "name": "Fornavn Etternavn",
      "initials": "FE",
      "img": null,
      "honor": "Årets ildsjel",
      "year": "2025",
      "accent": "maroon",
      "desc": "Et eksempelkort. For den som har lagt ned utallige timer i det frivillige — uten å be om noe tilbake. Rediger fritt i admin."
    },
    {
      "id": "p3",
      "name": "Fornavn Etternavn",
      "initials": "FE",
      "img": null,
      "honor": "Årets fadder",
      "year": "2025",
      "accent": "navy",
      "desc": "Et eksempelkort. For den fadderen som gjorde studiestarten trygg og minneverdig for de nye studentene. Rediger fritt i admin."
    }
  ]
};
