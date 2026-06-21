/* Innhold for Oppnåelser-siden (oppnaelser.html).
   Sist oppdatert: 18.6.2026
   Rediger direkte her, eller åpne Admin-senteret → Oppnåelser for visuell redigering.

   awards[].img   : "assets/oppnaelser/filnavn.webp", base64-bilde fra admin, eller null.
   awards[].medal : resultatet, vises som merke (f.eks. «Sølv»).
   awards[].giver : hvem som delte ut / arrangerte.
   awards[].accent: fargestripe — palettnavn ("" = gull) eller { light, dark }. */

window.OPPNAELSER_CONTENT = {
  "intro": {
    "back": "Tilbake",
    "backHref": "index.html",
    "eyebrow": "Pokalhylla",
    "heading": "Oppnåelser",
    "lede": "Filosofer er ikke bare flinke til å tenke. Her er premiene, pokalene og bragdene Apeiron har dratt i land — beviset på at vi også kan vinne ting."
  },
  "awards": [
    {
      "id": "a1",
      "title": "Volleyballcup 2026",
      "medal": "Sølv",
      "giver": "NTNUI",
      "year": "2026",
      "img": "assets/oppnaelser/Volleyball26.webp",
      "accent": "gold",
      "desc": "Andreplass i NTNUIs volleyballcup 2026. Et lag bygget på vennskap, vågale servinger og en urokkelig tro på at etikere og filosofer kan smæshe."
    },
    {
      "id": "a2",
      "title": "Best oppmøte",
      "medal": "Vinner",
      "giver": "Dionysos",
      "year": "2025",
      "img": null,
      "accent": "maroon",
      "desc": "Kåret av søsterforeningen Dionysos for det beste oppmøtet... for deres egne arrangementer. Når etikerne og filosofene møter opp, møter de opp i flokk!"
    }
  ]
};
