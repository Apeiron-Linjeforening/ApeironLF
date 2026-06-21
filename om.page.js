/* ============================================================
   om.page.js — «Om oss» som DATA (Apeiron Page Builder)
   ------------------------------------------------------------
   Hele siden er én ordnet liste av typede seksjoner. Motoren
   (section-engine.js) tegner lista; typene bor i om-sections.js.

   Hver seksjon:
     id      stabil nøkkel (også DOM-anker / #lenke-mål)
     type    hvilken seksjonstype som tegnes
     tone    'auto' (veksler lys/mørk) eller pinnet 'paper'|'navy'|'accent'
     enabled valgfri — false skjuler seksjonen på publisert side
     props   innholdet, formet av typen

   REDIGERING: tekst endres her inntil det nye seksjons-baserte
   admin-panelet er på plass. Bilder ligger i assets/lesesalen/;
   medlemskort (priser/steg) styres av membership-config.js.
   ============================================================ */
window.OM_PAGE = {
  meta: { title: 'Om oss', slug: 'om-oss' },

  sections: [
    /* ── Topp-banner (alltid øverst) ──────────────────────── */
    {
      id: 'banner', type: 'banner', tone: 'navy', pinned: true,
      props: {
        back: 'Til forsiden',
        backHref: 'index.html',
        title: 'Om oss',
        lede: 'Hvem vi er, hvem vi henger med, og det lille tilfluktsstedet vårt på Dragvoll — alt om Apeiron, samlet på ett sted.'
      }
    },

    /* ── «Hva er apeiron?» ────────────────────────────────── */
    {
      id: 'om', type: 'about', tone: 'auto',
      props: {
        eyebrow: 'Om oss',
        greek: '\u1F04\u03C0\u03B5\u03B9\u03C1\u03BF\u03BD',
        greekSmall: 'a-pei-ron \u00B7 \u00ABdet grensel\u00F8se\u00BB',
        paras: [
          'Ordet kommer fra filosofen Anaximander, som mente at alt som finnes springer ut av apeiron, det uendelige og ubestemte urstoffet bak verden. For oss betyr dette et fellesskap uten faste grenser, der enhver tanke f\u00E5r plass.',
          'Apeiron er linjeforeningen for deg som studerer filosofi eller etikk ved NTNU. Vi arrangerer fagkvelder, lesesirkler, fester, turer og lange kveldssamtaler for alle som liker \u00E5 lure p\u00E5 hvordan ting egentlig henger sammen.',
          'Hos oss trenger du ikke ha lest hele Kant for \u00E5 henge med. Du trenger bare nysgjerrighet og lyst til \u00E5 v\u00E6re med.'
        ],
        card: {
          title: 'Hvorfor timeglasset?',
          body: 'Seglet v\u00E5rt b\u00E6rer et timeglass, et gammelt symbol for tid, forgjengelighet og det \u00E5 bruke tiden sin p\u00E5 noe som betyr noe. For oss handler studietiden om akkurat det: gode samtaler, gode venner og sp\u00F8rsm\u00E5l verdt \u00E5 sitte oppe til langt p\u00E5 natt med.'
        },
        teaser: {
          eyebrow: 'St\u00F8rre enn oss selv',
          title: 'Fellesskap & samarbeid',
          body: 'Apeiron st\u00E5r ikke alene. Sammen med de andre linjeforeningene p\u00E5 Dragvoll skaper vi et st\u00F8rre milj\u00F8 med flere fester, st\u00F8rre arrangementer og et bredere nettverk.',
          linkLabel: 'Les mer om samarbeidet',
          linkHref: '#samarbeid'
        },
        stats: [
          { num: '1981', lbl: 'Grunnlagt' },
          { num: '180+', lbl: 'Medlemmer' },
          { num: '25', lbl: 'Arrangementer i \u00E5ret' },
          { num: '\u221E', lbl: 'Kanner kaffe' }
        ]
      }
    },

    /* ── Fellesskap & samarbeid ───────────────────────────── */
    {
      id: 'samarbeid', type: 'cardgrid', tone: 'auto',
      props: {
        screenLabel: 'Samarbeid',
        eyebrow: 'St\u00F8rre enn oss selv',
        heading: 'Fellesskap & samarbeid',
        lede: 'Apeiron st\u00E5r ikke alene. Vi er del av et st\u00F8rre studentmilj\u00F8 p\u00E5 Dragvoll \u2014 tett p\u00E5 v\u00E5r egen s\u00F8sterforening, studenttidsskriftet og linjeforeningene rundt oss.',
        cards: [
          {
            glyph: '\u204B', level: 'Samarbeid', title: 'Unionen',
            body: 'Apeiron er med i Unionen \u2014 samarbeidet mellom linjeforeningene p\u00E5 Dragvoll. Sammen arrangerer vi p\u00E5 tvers av fagene, deler erfaringer og gj\u00F8r studentstemmen sterkere inn mot institutt og fakultet. Det gir flere fester, st\u00F8rre arrangementer og et bredere nettverk enn \u00E9tt studieprogram f\u00E5r til alene.',
            links: [{ label: 'Instagram', href: 'https://www.instagram.com/unionen.ntnu/' }]
          },
          {
            glyph: '\u0394', level: 'S\u00F8sterforening', title: 'Dionysos',
            body: 'V\u00E5r n\u00E6re s\u00F8sterforening er Dionysos, linjeforeningen for religionsvitenskap. Vi deler institutt \u2014 Institutt for filosofi og religionsvitenskap (IFR) \u2014 og holder til p\u00E5 samme campus. Siden 2012 har de samlet religionsstudentene til faglige og sosiale treff, og vi finner ofte sammen om alt fra fagkvelder til fest.',
            links: [{ label: 'Instagram', href: 'https://www.instagram.com/dionysos_ntnu/' }, { label: 'Facebook', href: 'https://www.facebook.com/LinjeforeningenDionysos/' }]
          },
          {
            glyph: '\u0392', level: 'Studenttidsskrift', title: 'Begrep',
            body: 'Begrep er et studentdrevet filosofitidsskrift laget hovedsakelig av n\u00E5v\u00E6rende og tidligere filosofi og etikk studenter. Det er ikke en del av Apeiron, men springer ut av det samme studentmilj\u00F8et. Begrep gir ut et tidsskrift i semesteret, og har i tillegg laget en film (Grev van Orton), en julekalender (Hilbert Hotell) og en p\u00E5skekrim. Alle kan sende inn bidrag til tidsskriftet og f\u00E5 redaksjonell tilbakemelding.',
            links: [{ label: 'Linktree', href: 'https://linktr.ee/begrep' }, { label: 'YouTube', href: 'https://www.youtube.com/@BegrepTidsskrift' }, { label: 'Instagram', href: 'https://www.instagram.com/begrep.filosoftidsskrift/' }]
          }
        ]
      }
    },

    /* ── Lesesalen ────────────────────────────────────────── */
    {
      id: 'lesesalen', type: 'lesesal', tone: 'auto',
      props: {
        eyebrow: 'En skjult perle p\u00E5 Dragvoll',
        heading: 'Lesesalen',
        lede: 'De fleste vet ikke at den finnes, men om du gj\u00F8r det, er den vanskelig \u00E5 gi fra seg. Lesesalen er filosofi og etikk studentenes eget lille tilfluktssted p\u00E5 Dragvoll: lun, romslig og med alt du trenger for en god studie\u00F8kt eller godt selskap.',
        mainImage: 'assets/lesesalen/lesesal1.jpg',
        features: [
          { title: 'Eget bibliotek', body: 'Hyllevis med filosofi, etikk og tilst\u00F8tende fag \u2014 pent sortert og fritt tilgjengelig.' },
          { title: 'Gratis kaffe for medlemmer', body: 'Alltid en varm kanne klar. En av de sm\u00E5 godene ved \u00E5 ha et Apeiron-kort i lomma.' },
          { title: 'To sofaer og god plass', body: 'Luftig lokale med to sofaer, god arbeidsplass og en atmosf\u00E6re som faktisk innbyr til \u00E5 sette seg ned.' }
        ]
      }
    },

    /* ── Møt styret ───────────────────────────────────────── */
    {
      id: 'mot-styret', type: 'cardgrid', tone: 'auto',
      props: {
        screenLabel: 'M\u00F8t styret',
        eyebrow: 'Folkene bak',
        heading: 'M\u00F8t styret',
        lede: 'Apeiron drives av studenter som deg. Bli kjent med dem som holder hjulene i gang \u2014 og se hvordan du selv kan ta et verv.',
        cards: [
          {
            glyph: '\u03A3', level: 'Styret', title: 'Styret 2025/26',
            body: 'Leder, nestleder, \u00F8konomi, sosialansvarlig, faddersjef, fagansvarlig og resten av gjengen som driver foreningen gjennom \u00E5ret.',
            links: [{ label: 'Se styret', href: 'styret.html' }]
          },
          {
            glyph: '\u03A8', level: 'Tillitsvalgte', title: 'Tillitsvalgte',
            body: 'Studentenes stemme inn mot institutt og program \u2014 de som tar med seg tilbakemeldingene dine dit beslutningene tas.',
            links: [{ label: 'Se tillitsvalgte', href: 'styret.html#tillitsvalgte' }]
          },
          {
            glyph: '\u0394', level: 'Engasjer deg', title: 'Verv & komiteer',
            body: 'Lyst til \u00E5 bidra? Det finnes mange m\u00E5ter \u00E5 engasjere seg p\u00E5 \u2014 fra komit\u00E9 til styreverv. Se hva som finnes og hvordan du blir med.',
            links: [{ label: 'Se vervene', href: 'styret.html#vervene' }]
          }
        ]
      }
    },

    /* ── Bli medlem ───────────────────────────────────────── */
    {
      id: 'bli-medlem', type: 'join', tone: 'accent',
      props: {
        eyebrow: 'Bli en av oss',
        heading: 'Bli medlem i Apeiron',
        lede: 'Studerer du filosofi eller etikk ved NTNU? Da h\u00F8rer du hjemme her. Ett medlemskap, et helt fellesskap.',
        cardTitle: 'Medlemskap',
        ctaLabel: 'Meld deg inn i dag',
        ctaHref: 'index.html#kontakt',
        benefits: [
          'Rabattert inngang p\u00E5 alle arrangementer',
          'Gratis kaffe p\u00E5 lesesalen, og rabatt p\u00E5 Apeiron-pins',
          'Et fellesskap av nysgjerrige folk p\u00E5 tvers av kull',
          'Mulighet til \u00E5 sitte i komit\u00E9 eller styre'
        ]
      }
    },

    /* ── FAQ ──────────────────────────────────────────────── */
    {
      id: 'faq', type: 'faq', tone: 'auto',
      props: {
        eyebrow: 'Sp\u00F8rsm\u00E5l?',
        heading: 'Ofte stilte sp\u00F8rsm\u00E5l',
        items: [
          { q: 'M\u00E5 jeg studere filosofi for \u00E5 bli med?', a: 'Nei! Vi favner bredt. Studerer du filosofi eller etikk er du selvsagt midt i m\u00E5lgruppa, men er du bare nysgjerrig p\u00E5 de store sp\u00F8rsm\u00E5lene, er du like velkommen.' },
          { q: 'Jeg er fersk student \u2014 passer det for meg?', a: 'Absolutt. Mange blir med allerede i fadderuka. Du trenger ingen forkunnskaper \u2014 bare m\u00F8t opp p\u00E5 et arrangement, s\u00E5 finner du fort noen \u00E5 prate med.' },
          { q: 'Hvordan kan jeg engasjere meg mer?', a: 'Bli med i en komit\u00E9! Det er den enkleste veien inn. Si fra til en i styret, eller send oss en melding p\u00E5 Instagram, s\u00E5 kobler vi deg p\u00E5.' },
          { q: 'Er dere et fadderlag ogs\u00E5?', a: 'Ja \u2014 vi arrangerer fadderuke for de nye studentene hver h\u00F8st. Det er den beste m\u00E5ten \u00E5 bli kjent med b\u00E5de studiet og folka p\u00E5.' },
          { q: 'Hva er S.A.K?', a: 'S.A.K \u2014 Sosiale Arrangement Komit\u00E9 \u2014 er styrets hjelpemiddel for \u00E5 gi studenter en lavterskel m\u00E5te \u00E5 ta del i planlegging og gjennomf\u00F8ring av det sosiale p\u00E5. Vil du engasjere deg uten \u00E5 sitte i styret, er dette den enkleste veien inn. Si fra til en i styret eller skriv til oss p\u00E5 Instagram.' },
          { q: 'Hva er Begrep?', a: 'Begrep er et studentdrevet filosofitidsskrift laget av n\u00E5v\u00E6rende og tidligere filosofi- og etikkstudenter. Det er ikke en del av Apeiron, men springer ut av det samme studentmilj\u00F8et. Begrep gir ut et tidsskrift i semesteret \u2014 alle kan sende inn bidrag og f\u00E5 redaksjonell tilbakemelding.' }
        ]
      }
    }
  ]
};
