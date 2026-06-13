/* Innhold for Hjelp & ressurser-siden (hjelp.html).
   Sist oppdatert: 13.6.2026
   Rediger direkte her, eller åpne hjelp-admin.html for visuell redigering.

   STRUKTUR
   hero.nav[]        : hurtignav-kortene øverst. {title, desc, target, akutt}
   *.cards[]         : ressurskort (role-card). Felt:
       eyebrow       : liten etikett over tittelen
       accent        : fargestripe — "" (gull), "maroon", "navy", "green", "teal", "blue", "plum", "rust"
       name          : tittel på kortet
       desc          : brødtekst. Tom linje (to linjeskift) gir nytt avsnitt.
       resp[]        : punktliste (strekpunkter)
       contacts[]    : kontaktlinjer. HTML er lov, f.eks. <strong>...</strong>
       noteTop       : uthevet merknad (rødbrun) som vises før punktlisten. HTML lov.
       note          : diskré merknad som vises etter punktlisten. HTML lov.
       btnLabel      : tekst på knappen (tom = ingen knapp)
       btnHref       : lenke for knappen
   sifra.items[]     : "Si fra"-kortene. {icon, title, body}  — body tillater HTML/lenker
   sifra.cta         : gull-knappen under Si fra-kortene. {label, href}
   akutt.cards[]     : nødnummer-kort. {name, num, numHref, when, life} */

window.HJELP_CONTENT = {
  "hero": {
    "back": "Tilbake til forsiden",
    "backHref": "index.html",
    "heading": "Hjelp & ressurser",
    "lede": "Her samler vi hjelpen du kan trenge som student, samlet på ett sted: si fra om noe, faglig støtte, psykisk helse, fysisk helse og akutt hjelp. Trykk på et kort under for å hoppe rett til det du leter etter.",
    "nav": [
      { "title": "Si fra", "desc": "Meld fra til NTNU om noe som ikke er som det skal.", "target": "#sifra", "akutt": false },
      { "title": "Faglig hjelp", "desc": "Tillitsvalgte og studentdemokrati for det faglige.", "target": "#studier", "akutt": false },
      { "title": "Psykisk helse", "desc": "Lavterskel samtale og støtte, gratis.", "target": "#helse", "akutt": false },
      { "title": "Fysisk helse", "desc": "Lege, tannlege og helsetjenester for studenter.", "target": "#fysisk", "akutt": false },
      { "title": "Akutt hjelp", "desc": "Viktige nødnumre og når du skal ringe dem.", "target": "#akutt", "akutt": true }
    ]
  },

  "sifra": {
    "eyebrow": "Varsling & tilbakemeldinger",
    "heading": "Si fra til NTNU",
    "lede": "Alle studenter ved NTNU har rett til et trygt og godt læringsmiljø. «Si fra!» er NTNUs system for å melde fra om noe som ikke er som det skal, fra undervisningskvalitet til trakassering. Det er enkelt, og du kan velge å være anonym. Usikker på hvem du skal henvende deg til? Bruk ressursene lenger ned på siden.",
    "items": [
      { "icon": "📚", "title": "Undervisning og læringsmiljø", "body": "Mangler ved undervisningskvalitet, pensum, eksamen eller tilrettelegging. Meld fra via avviksskjema på <a href=\"https://ntnu.extend.no\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit;text-decoration:underline;\">ntnu.extend.no</a>." },
      { "icon": "🏛️", "title": "Bygg og rom", "body": "Problemer med ventilasjon, renhold, belysning eller fysiske forhold på campus. Meld fra via <a href=\"https://lydia.ntnu.no\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit;text-decoration:underline;\">e-vaktmester (Lydia)</a>." },
      { "icon": "🔒", "title": "Informasjonssikkerhet og personvern", "body": "Noen har delt noe om deg uten lov, du har fått e-post med andres data, eller du mistenker et sikkerhetsbrudd. Kontakt personvernombudet (se nedenfor)." },
      { "icon": "⚠️", "title": "Helse, miljø og sikkerhet (HMS)", "body": "Skader, brannfare, hindringer eller andre HMS-avvik på campus. Meld fra via <a href=\"https://ntnu.extend.no\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit;text-decoration:underline;\">ntnu.extend.no</a>." },
      { "icon": "🛡️", "title": "Sikkerhet og beredskap", "body": "Trusler, sikkerhetshendelser eller beredskapssituasjoner på campus." },
      { "icon": "🤝", "title": "Varsling om kritikkverdige forhold", "body": "Mobbing, trakassering, diskriminering eller andre alvorlige brudd på reglene. Varsler sendes til en ekstern, nøytral aktør utenfor NTNU via <a href=\"https://trustcom.pwc.no/ntnu\" target=\"_blank\" rel=\"noopener\" style=\"color:inherit;text-decoration:underline;\">trustcom.pwc.no/ntnu</a>. Du er beskyttet som varsler." }
    ],
    "cta": { "label": "Gå til Si fra!", "href": "https://i.ntnu.no/sifra" },
    "helpersHeading": "Hvem kan hjelpe deg?",
    "helpersLede": "Usikker på hva du kan si fra om, eller trenger noen å snakke med før du melder fra? Her er rådgivere og ombud som er der for deg.",
    "cards": [
      {
        "eyebrow": "NTNU",
        "accent": "navy",
        "name": "Studentombudet",
        "desc": "En uavhengig og konfidensiell støtteperson for studenter. Studentombudet hjelper deg når du mener NTNU har gjort en feil, saksbehandlingen ikke har gått riktig for seg, eller du er usikker på rettighetene dine. Gratis og uforpliktende.",
        "resp": [
          "Klage på eksamensresultat eller vedtak",
          "Spørsmål om tilrettelegging og rettigheter",
          "Formelle og prosessuelle gråsoner"
        ],
        "contacts": [
          "E-post: <strong>studentombudet@ntnu.no</strong>",
          "Tlf. <strong>48 50 50 05</strong> (man–fre 08–16)",
          "Drop-in: man og tirs 12–14, Realfagbygget D1-155"
        ],
        "noteTop": "",
        "note": "",
        "btnLabel": "Les mer",
        "btnHref": "https://i.ntnu.no/wiki/-/wiki/Norsk/Studentombud"
      },
      {
        "eyebrow": "NTNU",
        "accent": "maroon",
        "name": "Personvernombudet",
        "desc": "Thomas Helgesen passer på at NTNU behandler personopplysningene dine på en lovlig og trygg måte. Personopplysninger er alt som kan knyttes til deg som person: navn, studentnummer, karakterer, bilder og lignende.",
        "resp": [
          "Lure på hva NTNU vet om deg, eller be om innsyn",
          "Noen har delt noe om deg uten din tillatelse",
          "Du mistenker at NTNU har håndtert data om deg feil"
        ],
        "contacts": [
          "Kontakt via NTNU Hjelp: <strong>hjelp.ntnu.no</strong>"
        ],
        "noteTop": "",
        "note": "",
        "btnLabel": "Les mer",
        "btnHref": "https://i.ntnu.no/wiki/-/wiki/Norsk/personvernombud+ntnu"
      },
      {
        "eyebrow": "NTNU",
        "accent": "navy",
        "name": "Studieveiledning",
        "desc": "Studieavdelingen og de faglig tilknyttede veilederne kan hjelpe deg med studieopplegg, valg av emner, eksamen, tilrettelegging og karriere. De er ofte første stopp når noe faglig ikke fungerer, og kan også peke deg videre til riktig kanal for å si fra.",
        "resp": [
          "Valg av kurs, fordypning og studieplan",
          "Tilrettelegging ved sykdom eller særskilte behov",
          "Karriereveiledning via NTNU Karriere"
        ],
        "contacts": [
          "Studerer du filosofi eller etikk ved NTNU? Send e-post til studieveilederne ved Institutt for filosofi og religionsvitenskap (IFR):",
          "<strong>studieveiledning-ifr@hf.ntnu.no</strong>"
        ],
        "noteTop": "",
        "note": "",
        "btnLabel": "Les mer",
        "btnHref": "https://i.ntnu.no/veiledning"
      },
      {
        "eyebrow": "Statlig, gratis",
        "accent": "green",
        "name": "Forbrukerrådet",
        "desc": "Som student kjøper du kanskje abonnement, elektronikk eller reiser. Dersom du er misfornøyd og ikke kommer til enighet med selgeren, kan Forbrukerrådet hjelpe deg. De veileder deg gratis og kan megle mellom deg og bedriften.",
        "resp": [
          "Abonnement du ikke klarer å si opp",
          "Nettbutikk som ikke leverer eller gir tilbakebetaling",
          "Mobilhandel, elektronikk eller reisekjøp som gikk galt"
        ],
        "noteTop": "",
        "note": "Merk: Forbrukerrådet hjelper med klager mot private bedrifter, ikke mot NTNU eller offentlige etater.",
        "btnLabel": "Forbrukerrådet",
        "btnHref": "https://www.forbrukerradet.no/"
      }
    ]
  },

  "studier": {
    "eyebrow": "Studiene",
    "heading": "Faglig hjelp og studentdemokrati",
    "lede": "Har du innspill til undervisning, pensum eller eksamensformer? Tillitsvalgte er studentenes stemme inn i NTNUs styrende organer — de er de første du bør kontakte om noe faglig ikke fungerer.",
    "cards": [
      {
        "eyebrow": "Programnivå",
        "accent": "navy",
        "name": "PTV — Programtillitsvalgt",
        "desc": "Representerer studentene på programnivå ved filosofi og etikk. Sitter i programrådsmøter og er bindeleddet mellom studenter og programledelsen.",
        "resp": [
          "Innspill til undervisning, pensum og eksamensformer",
          "Spørsmål og bekymringer knyttet til studieprogrammet"
        ],
        "contacts": [
          "Ta kontakt via Apeiron eller finn PTV på <a href=\"styret.html#styremedlemmer\" style=\"color:inherit;text-decoration:underline;\">styret-siden</a>."
        ],
        "btnLabel": "",
        "btnHref": ""
      },
      {
        "eyebrow": "Instituttnivå · IFR",
        "accent": "navy",
        "name": "ITV — Institutt-tillitsvalgt",
        "desc": "Representerer alle studenter ved Institutt for filosofi og religionsvitenskap. Sitter i instituttstyret og deltar i ansettelsesprosesser.",
        "resp": [
          "Saker som angår hele instituttet",
          "Strategiske beslutninger ved IFR"
        ],
        "contacts": [
          "Kontakt: <strong>hf-ifr@studentrad.ntnu.no</strong>"
        ],
        "btnLabel": "",
        "btnHref": ""
      },
      {
        "eyebrow": "Fakultetsnivå · HF",
        "accent": "maroon",
        "name": "FTV — Fakultetstillitsvalgt",
        "desc": "Representerer alle studenter ved Det humanistiske fakultet. Sitter i fakultetsstyret og er studentenes øverste talspersoner overfor HF-ledelsen.",
        "resp": [
          "Læringsmiljø og internasjonalisering på fakultetsnivå",
          "Saker av stor rekkevidde for alle HF-studenter"
        ],
        "contacts": [
          "Kontakt: <strong>ftv@hf.ntnu.no</strong>"
        ],
        "btnLabel": "",
        "btnHref": ""
      }
    ]
  },

  "helse": {
    "eyebrow": "Psykisk helse",
    "heading": "Støtte og helsetilbud",
    "lede": "Studietiden kan være krevende. Her er lavterskeltilbud du kan bruke, gratis og uten lang ventetid.",
    "cards": [
      {
        "eyebrow": "Studentsamskipnaden i Trondheim",
        "accent": "teal",
        "name": "SIT Helse",
        "desc": "SIT tilbyr lavterskel psykisk helsestøtte for studenter i Trondheim. Alt er gratis.",
        "resp": [
          "Samtaletilbud for dem som trenger å snakke med noen",
          "«Studenter spør»: gratis og anonym spørretjeneste",
          "Kurs og gruppesamtaler om studentlivet",
          "Veiledning til Mental Helses Hjelpetelefon (24/7, gratis og anonym)"
        ],
        "btnLabel": "SIT Helse",
        "btnHref": "https://www.sit.no/helse"
      },
      {
        "eyebrow": "Trondheim kommune",
        "accent": "green",
        "name": "Rask psykisk helsehjelp",
        "desc": "Gratis tilbud for voksne over 18 år bosatt i Trondheim med lettere psykiske plager, som panikkangst, nedstemthet, bekymring eller søvnvansker.",
        "noteTop": "Er du student? Trondheim kommune ber deg sjekke SIT sine tilbud først.",
        "resp": [
          "Introkurs (4 uker, kognitiv terapi-basert)",
          "Veiledet selvhjelp (nettbasert program)",
          "Angstgruppe og søvngruppe",
          "Individuelle samtaler (inntil 7)",
          "Gjennomsnittlig varighet: 6 til 8 uker"
        ],
        "note": "Bestill vurderingssamtale via HelsaMi.<br>Besøksadresse: Holtermanns veg 70, 9. etasje.",
        "btnLabel": "Les mer",
        "btnHref": "https://www.trondheim.kommune.no/tema/helse-og-omsorg/helsetjenester/psykisk-helse/rask-psykisk-helsehjelp/"
      },
      {
        "eyebrow": "NTNU · gratis og konfidensielt",
        "accent": "navy",
        "name": "Studentpresten",
        "desc": "Tilbyr samtaler til alle studenter uansett tro eller livssyn. Nyttig når livet blir overveldende, forventningene for store, eller du kjeder deg med ensomheten. Studentpresten har sorgegrupper for studenter som har opplevd tap.",
        "resp": [
          "Åpent for alle, uavhengig av tro og bakgrunn",
          "Ingen agenda, ingen krav, ingen regning",
          "Dragvoll (man–tors) og Gløshaugen (ons–fre) i Trondheim"
        ],
        "btnLabel": "Les mer",
        "btnHref": "https://i.ntnu.no/wiki/-/wiki/Norsk/Studentprest"
      },
      {
        "eyebrow": "Human-Etisk Forbund / NTNU · gratis og konfidensielt",
        "accent": "green",
        "name": "Studenthumanisten",
        "desc": "En samtalepartner for alle studenter uansett livssyn, uten tro eller religion som premiss. Tilbyr støttesamtaler om livets utfordringer, enten det er stort eller smått. Holder til på Dragvoll og i sentrum (Olav Tryggvasons gate 27).",
        "resp": [
          "Åpent for alle, uavhengig av tro og bakgrunn",
          "Ingen agenda, ingen krav, ingen regning"
        ],
        "btnLabel": "Les mer",
        "btnHref": "https://human.no/studenthumanist-ntnu/"
      }
    ]
  },

  "fysisk": {
    "eyebrow": "Fysisk helse",
    "heading": "Lege, tannlege og helsetjenester",
    "lede": "Også det kroppslige hører hjemme her. Som student i Trondheim har du flere tilbud med kort vei og studentvennlige priser. Husk å være registrert hos en fastlege.",
    "cards": [
      {
        "eyebrow": "Studentsamskipnaden i Trondheim",
        "accent": "teal",
        "name": "SIT: tannhelse og seksuell helse",
        "desc": "SIT har egne helsetjenester for studenter med sentral beliggenhet og studentvennlige priser.",
        "resp": [
          "Tannlege og tannhelsetjeneste for studenter",
          "Helsestasjon: gratis prevensjon, testing for kjønnssykdommer og veiledning om seksuell helse",
          "Treningsveiledning og hjelp til å komme i gang med aktivitet"
        ],
        "note": "Merk: SIT har ikke eget fastlegetilbud. De anbefaler at du bytter fastlege til studiestedet (se kortet om Helsenorge).",
        "btnLabel": "SIT Helse",
        "btnHref": "https://www.sit.no/helse"
      },
      {
        "eyebrow": "Trondheim kommune",
        "accent": "green",
        "name": "Helsestasjon for ungdom og studenter",
        "desc": "Gratis og lavterskel tilbud for unge voksne, der du kan ta opp både fysisk og psykisk helse uten timeavtale.",
        "resp": [
          "Prevensjon, testing og veiledning om seksuell helse",
          "Samtale med helsesykepleier og lege",
          "Ingen henvisning nødvendig, drop-in i åpningstid"
        ],
        "btnLabel": "Les mer",
        "btnHref": "https://www.trondheim.kommune.no/tema/helse-og-omsorg/helsetjenester/helsestasjon/helsestasjon-for-ungdom/"
      },
      {
        "eyebrow": "Fastlege og digital hjelp",
        "accent": "navy",
        "name": "Fastlege og Helsenorge",
        "desc": "Fastlegen din er førstevalget for sykdom, resepter og henvisninger som ikke haster. På Helsenorge styrer du timer, resepter og bytte av fastlege.",
        "resp": [
          "Bestill time og se resepter på nett",
          "Bytt fastlege hvis du har flyttet til Trondheim",
          "Logg inn trygt med BankID"
        ],
        "btnLabel": "Gå til Helsenorge",
        "btnHref": "https://www.helsenorge.no/"
      }
    ]
  },

  "akutt": {
    "eyebrow": "Akutt og krise",
    "heading": "Akutt hjelp: viktige nødnumre",
    "lede": "Trenger du eller noen rundt deg hjelp nå? Her er numrene du skal kjenne til, og en kort forklaring på når du bør ringe hvert enkelt. Du kan trykke på nummeret for å ringe direkte.",
    "cards": [
      { "name": "Medisinsk nødtelefon", "num": "113", "numHref": "tel:113", "when": "Ved akutt og livstruende sykdom eller skade: bevisstløshet, store blødninger, pustestans, eller når noen står i umiddelbar fare for å ta sitt eget liv.", "life": true },
      { "name": "Politi, nød", "num": "112", "numHref": "tel:112", "when": "Ved akutt fare for liv og helse, vold, trusler eller andre farlige situasjoner som skjer akkurat nå.", "life": true },
      { "name": "Brann", "num": "110", "numHref": "tel:110", "when": "Ved brann, eksplosjonsfare, gasslekkasje eller farlige stoffer.", "life": true },
      { "name": "Legevakt", "num": "116117", "numHref": "tel:116117", "when": "Når du trenger rask helsehjelp, men det ikke er livstruende. Sykdom eller skade på kveld, natt og helg når fastlegen er stengt.", "life": false },
      { "name": "Mental Helse Hjelpetelefon", "num": "116123", "numHref": "tel:116123", "when": "Døgnåpen, gratis og anonym. Når du trenger noen å snakke med om psykisk helse eller vanskelige tanker. Du kan også skrive på sidetmedord.no.", "life": false },
      { "name": "Kirkens SOS", "num": "22 40 00 40", "numHref": "tel:22400040", "when": "Døgnåpen samtaletjeneste for alle aldre når livet er vanskelig. Tilbyr også chat og e-post via kirkens-sos.no.", "life": false },
      { "name": "Alarmtelefonen for barn og unge", "num": "116111", "numHref": "tel:116111", "when": "For deg under 18 år. Gratis og anonym hjelp hele døgnet hvis du har det vanskelig hjemme eller trenger noen å snakke med.", "life": false }
    ]
  }
};
