/* «Om oss» som DATA — Apeiron Page Builder (om.page.js)
   Sist oppdatert: 21.6.2026
   Hver seksjon: { id, type, tone, enabled?, props }. Motoren (section-engine.js)
   tegner lista; typene bor i om-sections.js. Rediger i Admin → Om oss.
   Bilder: assets/lesesalen/ · medlemspriser: membership-config.js
*/

window.OM_PAGE = {
  "meta": {
    "title": "Om oss",
    "slug": "om-oss"
  },
  "sections": [
    {
      "id": "banner",
      "type": "banner",
      "tone": "navy",
      "pinned": true,
      "props": {
        "back": "Til forsiden",
        "backHref": "index.html",
        "title": "Om oss",
        "lede": "Hvem vi er, hvem vi henger med, og det lille tilfluktsstedet vårt på Dragvoll: alt om Apeiron, samlet på ett sted.",
        "toc": true
      }
    },
    {
      "id": "om",
      "type": "about",
      "tone": "auto",
      "props": {
        "eyebrow": "Om oss",
        "greek": "ἄπειρον",
        "greekSmall": "a-pei-ron · «det grenseløse»",
        "paras": [
          "Ordet kommer fra filosofen Anaximander, som mente at alt som finnes springer ut av apeiron, det uendelige og ubestemte urstoffet bak verden. For oss betyr dette et fellesskap uten faste grenser, der enhver tanke får plass.",
          "Apeiron er linjeforeningen for deg som studerer filosofi eller etikk ved NTNU. Vi arrangerer fagkvelder, lesesirkler, fester, turer og lange kveldssamtaler for alle som liker å lure på hvordan ting egentlig henger sammen.",
          "Hos oss trenger du ikke ha lest hele Kant for å henge med. Du trenger bare nysgjerrighet og lyst til å være med."
        ],
        "card": {
          "title": "Hvorfor timeglasset?",
          "body": "Seglet vårt bærer et timeglass, et gammelt symbol for tid, forgjengelighet og det å bruke tiden sin på noe som betyr noe. For oss handler studietiden om akkurat det: gode samtaler, gode venner og spørsmål verdt å sitte oppe til langt på natt med."
        },
        "teaser": {
          "eyebrow": "Større enn oss selv",
          "title": "Fellesskap & samarbeid",
          "body": "Apeiron står ikke alene. Sammen med de andre linjeforeningene på Dragvoll skaper vi et større miljø med flere fester, større arrangementer og et bredere nettverk.",
          "linkLabel": "Les mer om samarbeidet",
          "linkHref": "#samarbeid"
        },
        "stats": [
          {
            "num": "1981",
            "lbl": "Grunnlagt"
          },
          {
            "num": "180+",
            "lbl": "Medlemmer"
          },
          {
            "num": "25",
            "lbl": "Arrangementer i året"
          },
          {
            "num": "∞",
            "lbl": "Kanner kaffe"
          }
        ]
      }
    },
    {
      "id": "samarbeid",
      "type": "cardgrid",
      "tone": "paper",
      "props": {
        "screenLabel": "Samarbeid",
        "eyebrow": "Større enn oss selv",
        "heading": "Fellesskap & samarbeid",
        "lede": "Apeiron står ikke alene. Vi er del av et større studentmiljø på Dragvoll, tett på vår egen søsterforening, studenttidsskriftet og linjeforeningene rundt oss.",
        "cards": [
          {
            "glyph": "⁋",
            "level": "Samarbeid",
            "title": "Unionen",
            "body": "Apeiron er med i Unionen, samarbeidet mellom linjeforeningene på Dragvoll. Sammen arrangerer vi på tvers av fagene, deler erfaringer og gjør studentstemmen sterkere inn mot institutt og fakultet. Det gir flere fester, større arrangementer og et bredere nettverk enn étt studieprogram får til alene.",
            "links": [
              {
                "label": "Instagram",
                "href": "https://www.instagram.com/unionen.ntnu/"
              }
            ]
          },
          {
            "glyph": "Δ",
            "level": "Søsterforening",
            "title": "Dionysos",
            "body": "Vår nære søsterforening er Dionysos, linjeforeningen for religionsvitenskap. Vi deler institutt, Institutt for filosofi og religionsvitenskap (IFR), og holder til på samme campus. Siden 2012 har de samlet religionsstudentene til faglige og sosiale treff, og vi finner ofte sammen om alt fra fagkvelder til fest.",
            "links": [
              {
                "label": "Instagram",
                "href": "https://www.instagram.com/dionysos_ntnu/"
              },
              {
                "label": "Facebook",
                "href": "https://www.facebook.com/LinjeforeningenDionysos/"
              }
            ]
          },
          {
            "glyph": "Β",
            "level": "Studenttidsskrift",
            "title": "Begrep",
            "body": "Begrep er et studentdrevet filosofitidsskrift laget hovedsakelig av nåværende og tidligere filosofi og etikk studenter. Det er ikke en del av Apeiron, men springer ut av det samme studentmiljøet. Begrep gir ut et tidsskrift i semesteret, og har i tillegg laget en film (Grev van Orton), en julekalender (Hilbert Hotell) og en påskekrim. Alle kan sende inn bidrag til tidsskriftet og få redaksjonell tilbakemelding.",
            "links": [
              {
                "label": "Linktree",
                "href": "https://linktr.ee/begrep"
              },
              {
                "label": "YouTube",
                "href": "https://www.youtube.com/@BegrepTidsskrift"
              },
              {
                "label": "Instagram",
                "href": "https://www.instagram.com/begrep.filosoftidsskrift/"
              }
            ]
          }
        ]
      }
    },
    {
      "id": "lesesalen",
      "type": "lesesal",
      "tone": "paper",
      "props": {
        "eyebrow": "En skjult perle på Dragvoll",
        "heading": "Lesesalen",
        "lede": "De fleste vet ikke at den finnes, men om du gjør det, er den vanskelig å gi fra seg. Lesesalen er filosofi og etikk studentenes eget lille tilfluktssted på Dragvoll: lun, romslig og med alt du trenger for en god studieøkt eller godt selskap.",
        "mainImage": "assets/lesesalen/lesesal1.jpg",
        "features": [
          {
            "title": "Eget bibliotek",
            "body": "Hyllevis med filosofi, etikk og tilstøtende fag, pent sortert og fritt tilgjengelig."
          },
          {
            "title": "Gratis kaffe for medlemmer",
            "body": "Alltid en varm kanne klar. En av de små godene ved å ha et Apeiron-kort i lomma."
          },
          {
            "title": "To sofaer og god plass",
            "body": "Luftig lokale med to sofaer, god arbeidsplass og en atmosfære som faktisk innbyr til å sette seg ned."
          }
        ]
      }
    },
    {
      "id": "mot-styret",
      "type": "cardgrid",
      "tone": "navy",
      "props": {
        "screenLabel": "Møt styret",
        "eyebrow": "Folkene bak",
        "heading": "Møt styret",
        "lede": "Apeiron drives av studenter som deg. Bli kjent med dem som holder hjulene i gang, og se hvordan du selv kan ta et verv.",
        "cards": [
          {
            "glyph": "Σ",
            "level": "Styret",
            "title": "Styret 2025/26",
            "images": [
              "assets/Styremedlemmer/Iver.jpg",
              "assets/Styremedlemmer/Dagny.jpg",
              "assets/Styremedlemmer/Dennis.jpg",
              "assets/Styremedlemmer/Helene.jpg"
            ],
            "imagesMore": "+7",
            "body": "Leder, nestleder, økonomi, sosialansvarlig, faddersjef, fagansvarlig og resten av gjengen som driver foreningen gjennom året.",
            "links": [
              {
                "label": "Se styret",
                "href": "styret.html"
              }
            ]
          },
          {
            "glyph": "Ψ",
            "level": "Tillitsvalgte",
            "title": "Tillitsvalgte",
            "imagesFrom": "tillitsvalgte",
            "images": [
              "assets/Styremedlemmer/AnnaF.jpg",
              "assets/Styremedlemmer/Fredrik.jpg",
              "assets/Styremedlemmer/Karoline.jpg"
            ],
            "body": "Studentenes stemme inn mot institutt og program, de som tar med seg tilbakemeldingene dine dit beslutningene tas.",
            "links": [
              {
                "label": "Se tillitsvalgte",
                "href": "styret.html#tillitsvalgte"
              }
            ]
          },
          {
            "glyph": "Δ",
            "level": "Engasjer deg",
            "title": "Verv & komiteer",
            "imagesMore": "Deg?",
            "body": "Lyst til å bidra? Det finnes mange måter å engasjere seg på, fra komité til styreverv. Se hva som finnes og hvordan du blir med.",
            "links": [
              {
                "label": "Se vervene",
                "href": "styret.html#vervene"
              }
            ]
          }
        ]
      }
    },
    {
      "id": "bli-medlem",
      "type": "join",
      "tone": "accent",
      "props": {
        "eyebrow": "Bli en av oss",
        "heading": "Bli medlem i Apeiron",
        "lede": "Studerer du filosofi eller etikk ved NTNU? Da hører du hjemme her. Ett medlemskap, et helt fellesskap.",
        "cardTitle": "Medlemskap",
        "ctaLabel": "Meld deg inn i dag",
        "ctaHref": "index.html#kontakt",
        "benefits": [
          "Rabattert inngang på alle arrangementer",
          "Gratis kaffe på lesesalen, og rabatt på Apeiron-pins",
          "Et fellesskap av nysgjerrige folk på tvers av kull",
          "Mulighet til å sitte i komité eller styre"
        ]
      }
    },
    {
      "id": "faq",
      "type": "faq",
      "tone": "paper",
      "props": {
        "eyebrow": "Spørsmål?",
        "heading": "Ofte stilte spørsmål",
        "items": [
          {
            "q": "Må jeg studere filosofi for å bli med?",
            "a": "Nei! Vi favner bredt. Studerer du filosofi eller etikk er du selvsagt midt i målgruppa, men er du bare nysgjerrig på de store spørsmålene, er du like velkommen."
          },
          {
            "q": "Jeg er fersk student, passer det for meg?",
            "a": "Absolutt. Mange blir med allerede i fadderuka. Du trenger ingen forkunnskaper, bare møt opp på et arrangement, så finner du fort noen å prate med."
          },
          {
            "q": "Hvordan kan jeg engasjere meg mer?",
            "a": "Bli med i en komité! Det er den enkleste veien inn. Si fra til en i styret, eller send oss en melding på Instagram, så kobler vi deg på."
          },
          {
            "q": "Er dere et fadderlag også?",
            "a": "Ja, vi arrangerer fadderuke for de nye studentene hver høst. Det er den beste måten å bli kjent med både studiet og folka på."
          },
          {
            "q": "Hva er S.A.K?",
            "a": "S.A.K (Sosiale Arrangement Komité) er styrets hjelpemiddel for å gi studenter en lavterskel måte å ta del i planlegging og gjennomføring av det sosiale på. Vil du engasjere deg uten å sitte i styret, er dette den enkleste veien inn. Si fra til en i styret eller skriv til oss på Instagram."
          },
          {
            "q": "Hva er Begrep?",
            "a": "Begrep er et studentdrevet filosofitidsskrift laget av nåværende og tidligere filosofi- og etikkstudenter. Det er ikke en del av Apeiron, men springer ut av det samme studentmiljøet. Begrep gir ut et tidsskrift i semesteret, og alle kan sende inn bidrag og få redaksjonell tilbakemelding."
          }
        ]
      }
    }
  ]
};
