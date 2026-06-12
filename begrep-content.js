/* Innhold for Begrep-siden (begrep.html).
   Sist oppdatert: 12.06.2026
   Rediger direkte her, eller åpne begrep-admin.html for visuell redigering.

   img: "assets/begrep/filnavn.png" for bilder i repoet,
        base64-bilde fra admin, eller null (viser plassholder).

   Tall i statistikk-stripen telles automatisk:
   - Utgaver          = antall issues
   - Podkast-sesonger = antall podcasts der countsAsSeason !== false
   - Julekalender     = settes via meta.julekalenderEpisodes
   - Grunnlagt        = meta.founded */

window.BEGREP_CONTENT = {
  meta: {
    founded: 2019,
    julekalenderEpisodes: 24
  },

  issues: [
    { id: 'i1', year: 'Vår 2019',  title: '1. Årgang', img: 'assets/begrep/1.png', roman: 'I' },
    { id: 'i2', year: 'Høst 2020', title: '2. Årgang', img: 'assets/begrep/2.png', roman: 'II' },
    { id: 'i3', year: 'Vår 2021',  title: '3. Årgang', img: 'assets/begrep/3.png', roman: 'III' },
    { id: 'i4', year: 'Høst 2021', title: '4. Årgang', img: 'assets/begrep/4.png', roman: 'IV' },
    { id: 'i5', year: 'Vår 2022',  title: '5. Årgang', img: 'assets/begrep/5.png', roman: 'V' }
  ],

  podcasts: [
    {
      id: 'p1', tag: 'Sesong 1', title: 'Begrep Podcast', accent: 'gold',
      countsAsSeason: true,
      desc: 'Samtaler med forfatterne bak artiklene i Begrep tidsskrift. Vertene går i dybden på tekstene og utforsker ideene videre i samtale.',
      link: 'https://creators.spotify.com/pod/profile/begrep-podcast/'
    },
    {
      id: 'p2', tag: 'Sesong 2', title: 'Begrepsliggjort', accent: 'rust',
      countsAsSeason: true,
      desc: 'Filosofiske samtaler med gjester fra NTNU og utenfor. Tema spenner fra etikk og politisk filosofi til eksistens og hverdagslig undring.',
      link: 'https://creators.spotify.com/pod/profile/begrep-podcast/'
    },
    {
      id: 'p3', tag: 'Julekalender 2025', title: 'Hilbert Hotell', accent: 'green',
      countsAsSeason: false,
      desc: '24 episoder med en filosofisk advent-fortelling om uendelighet, rom og mysterium. Utgitt daglig gjennom desember 2025.',
      link: 'https://creators.spotify.com/pod/profile/begrep-podcast/'
    }
  ],

  films: [
    {
      id: 'f1',
      title: 'Grev van Orton',
      altTitle: 'Grev Van Orton Eller: Hvordan oppdage filosofien, ved et uhell starte en sekt, og sette i gang en liten folkebevegelse som man er uenig med',
      kind: 'Kortfilm', status: 'released',
      year: '2025',
      director: 'Herman Borge og Mons Bille',
      youtube: 'https://youtu.be/3EOhDGOgK2Y?si=37EZBAEy6J2r9MeL',
      poster: 'assets/begrep/grev-van-orton.jpg',
      desc: 'Se opp for den kleptomanske folkebevegelse og dens leder: En greve farlig ute av kontroll. En film av Herman Borge og Mons Bille, presentert av Begrep Tidsskrift.'
    },
    {
      id: 'f2', title: 'Påskekrim', kind: 'Kortfilm', status: 'production',
      year: '2026', director: '', youtube: '',
      desc: 'Under full produksjon: en filosofisk påskekrim fra Begrep. Manus, regi og foto av studenter ved NTNU. Premiere kommer.'
    }
  ]
};
