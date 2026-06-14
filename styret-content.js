/* Innhold for Styret-siden (styret.html).
   Sist oppdatert: 14.6.2026
   Rediger direkte her, eller åpne styret-admin.html for visuell redigering.

   members[].img : "assets/Styremedlemmer/filnavn.jpg", base64-bilde fra admin, eller null.
   members[].tags: tilleggsverv som chips. color = palettnavn ("maroon"),
                    eller { light, dark } med palettnavn/hex for egendefinert.
   roles[].accent: fargestripe — palettnavn ("" = gull) eller { light, dark }.
   roles[].resp : punktliste under beskrivelsen. */

window.STYRET_CONTENT = {
  "board": {
    "eyebrow": "Hvem er vi",
    "heading": "Styret 2025/26",
    "lede": "Den gjengen som holder hjulene i gang og kaffekjelen varm."
  },
  "verv": {
    "eyebrow": "Rollene",
    "heading": "Hva gjør vi?",
    "lede": "Hvert verv har et klart ansvar og bidrar til at Apeiron fungerer som fellesskap og organisasjon."
  },
  "members": [
    {
      "id": "m1",
      "name": "Stian Lauritzen",
      "role": "Leder",
      "initials": "SL",
      "img": "assets/Styremedlemmer/Stian.jpg",
      "tags": [
        {
          "label": "ITV",
          "color": "gold"
        }
      ]
    },
    {
      "id": "m2",
      "name": "Dennis Cleophas",
      "role": "Nestleder",
      "initials": "DC",
      "img": "assets/Styremedlemmer/Dennis.jpg",
      "tags": [
        {
          "label": "HIV",
          "color": "navy"
        }
      ]
    },
    {
      "id": "m3",
      "name": "Dagny Flakne",
      "role": "Økonomiansvarlig",
      "initials": "DN",
      "img": "assets/Styremedlemmer/Dagny.jpg",
      "tags": [
        {
          "label": "HIV",
          "color": "navy"
        }
      ]
    },
    {
      "id": "m4",
      "name": "Iver N. Edvardsen",
      "role": "Sosialansvarlig",
      "initials": "INE",
      "img": "assets/Styremedlemmer/Iver.jpg",
      "tags": [
        {
          "label": "S.A.K",
          "color": "maroon"
        },
        {
          "label": "ASAP",
          "color": "maroon"
        },
        {
          "label": "HIV",
          "color": "navy"
        },
        {
          "label": "web",
          "color": "blue"
        }
      ]
    },
    {
      "id": "m5",
      "name": "Natalie Bellingmo",
      "role": "PR-ansvarlig",
      "initials": "NB",
      "img": "assets/Styremedlemmer/Natalie.jpg",
      "tags": []
    },
    {
      "id": "m6",
      "name": "Anna Fagerli",
      "role": "Faddersjef",
      "initials": "AF",
      "img": "assets/Styremedlemmer/AnnaF.jpg",
      "tags": []
    },
    {
      "id": "m7",
      "name": "Robin M. Søraker",
      "role": "Fagansvarlig",
      "initials": "RMS",
      "img": "assets/Styremedlemmer/Robin.jpg",
      "tags": []
    },
    {
      "id": "m8",
      "name": "Martin R. Skauge",
      "role": "Potet",
      "initials": "MRS",
      "img": "assets/Styremedlemmer/Martin.png",
      "tags": [
        {
          "label": "PTV",
          "color": "gold"
        }
      ]
    },
    {
      "id": "m9",
      "name": "Helene P. Ruud",
      "role": "Potet",
      "initials": "HPR",
      "img": "assets/Styremedlemmer/Helene.jpg",
      "tags": []
    },
    {
      "id": "m10",
      "name": "Karoline B. Holthe",
      "role": "Potet",
      "initials": "KBH",
      "img": "assets/Styremedlemmer/Karoline.jpg",
      "tags": []
    },
    {
      "id": "m11",
      "name": "Fredrik C.F. Rosenfors",
      "role": "S.A.K",
      "initials": "FCFR",
      "img": "assets/Styremedlemmer/Fredrik2.jpg",
      "tags": [
        {
          "label": "ASAP",
          "color": "maroon"
        }
      ]
    }
  ],
  "roles": [
    {
      "id": "r1",
      "name": "Leder",
      "accent": "",
      "desc": "Lederen har det overordnede ansvaret for linjeforeningen — holder i trådene, setter agendaen og er Apeirons ansikt utad.",
      "resp": [
        "Leder styremøter og sørger for at vedtak følges opp",
        "Representerer Apeiron overfor NTNU, IFR og andre aktører",
        "Koordinerer mellom styrets ulike verv",
        "Overordnet ansvar for at foreningens drift fungerer"
      ]
    },
    {
      "id": "r2",
      "name": "Nestleder",
      "accent": "",
      "desc": "Nestlederen støtter leder i det daglige og overtar ansvaret ved fravær — et allsidig verv med fingeren i mange gryter.",
      "resp": [
        "Overtar lederrollen ved fravær",
        "Støtter leder i planlegging og koordinering",
        "Bistår med interne oppgaver på tvers av styret",
        "Holder oversikt over pågående prosjekter og frister"
      ]
    },
    {
      "id": "r3",
      "name": "Økonomiansvarlig",
      "accent": "maroon",
      "desc": "Økonomiansvarlig holder orden på kroner og øre — fra regnskap og budsjett til søknader om støtte.",
      "resp": [
        "Fører regnskap og holder oversikt over budsjett",
        "Håndterer innbetalinger og Vipps-konto",
        "Søker om støtte og stipend fra NTNU og andre instanser",
        "Legger frem økonomirapporter på styremøter"
      ]
    },
    {
      "id": "r4",
      "name": "Sosialansvarlig",
      "accent": "maroon",
      "desc": "Sosialansvarlig har overordnet ansvar for det sosiale i Apeiron — fra ukentlige ølkvelder til koordinering av S.A.K.",
      "resp": [
        "Har overordnet ansvar for S.A.K (Sosiale Arrangement Komité)",
        "Arrangerer sosialstipendpilskvelder annenhver onsdag — to ganger i måneden",
        "Samarbeider tett med S.A.K om planlegging og gjennomføring",
        "Bidrar til godt sosialt miljø blant studentene"
      ]
    },
    {
      "id": "r5",
      "name": "PR-ansvarlig",
      "accent": "",
      "desc": "PR-ansvarlig sørger for at Apeiron synes — på sosiale medier, i plakater og i alt som kommuniserer hvem vi er.",
      "resp": [
        "Driver Apeirons sosiale medier (Instagram m.fl.)",
        "Lager plakater, innhold og informasjonsmateriell for arrangementer",
        "Markedsfører verv og arrangement utad",
        "Viderefører og forvalter Apeirons visuelle profil"
      ]
    },
    {
      "id": "r6",
      "name": "Faddersjef",
      "accent": "",
      "desc": "Faddersjef koordinerer mottaket av nye studenter og sikrer at de første ukene på NTNU blir en opplevelse å huske.",
      "resp": [
        "Planlegger og koordinerer fadderukeprogrammet",
        "Rekrutterer og organiserer faddere",
        "Sikrer et godt og inkluderende mottak for nye studenter",
        "Samarbeider med NTNU og instituttet om fadderopplegg"
      ]
    },
    {
      "id": "r7",
      "name": "Fagansvarlig",
      "accent": "navy",
      "desc": "Fagansvarlig holder det intellektuelle liv i Apeiron i gang — fra storstilte kveldsdebatter til praktisk faglig hjelp.",
      "resp": [
        "Ansvarlig for Aporetisk Aften — Apeirons flaggskiparrangement for åpne filosofiske diskusjoner",
        "Koordinerer Logikk Panikk hvert vårsemester: tidligere logikkstudenter hjelper nåværende med emnet",
        "Planlegger og gjennomfører andre faglige arrangementer gjennom semesteret",
        "Bygger bro mellom det faglige og sosiale i Apeiron"
      ]
    },
    {
      "id": "r8",
      "name": "Potet",
      "accent": "",
      "desc": "Poteten er styrets allrounder — alltid klar til å ta tak der det trengs, uten fast portefølje.",
      "resp": [
        "Bistår andre styremedlemmer ved behov",
        "Tar tak i praktiske oppgaver der det trengs — ingen dag er lik",
        "Kan involveres i arrangementer, kommunikasjon eller andre styreoppgaver"
      ]
    },
    {
      "id": "r9",
      "name": "S.A.K — Sosiale Arrangement Komité",
      "accent": "maroon",
      "desc": "S.A.K er en åpen komité som gir alle studenter mulighet til å bidra til det sosiale livet — uten å sitte i styret. Grunnlagt mars 2026 av Fredrik og Iver for å bygge bro mellom studieretningene og holde et ellers godt studiemiljø samlet.",
      "resp": [
        "Organiserer spontane og lavterskel sosiale arrangementer",
        "Åpen for alle studenter på filosofi og etikk",
        "Samarbeider tett med sosialansvarlig i styret",
        "Viser du engasjement, blir du en ekte ASAP — Apeirons Superdupre Ansvarlige Persons"
      ]
    },
    {
      "id": "r10",
      "name": "H.I.V",
      "accent": "",
      "desc": "Hjerne, Intelligens, Verdiskapelse — Apeirons kreative komité. H.I.V har ansvaret for alt visuelt og kreativt i foreningen: identitet, design og gjenstander som bærer Apeiron ut i verden.",
      "resp": [
        "Utviklet den nye Apeiron-logoen (2026)",
        "Designet den nye Apeiron-pinnen",
        "Arbeider med merch — gensere, kopper og muligens bøker",
        "Forvalter Apeirons visuelle identitet"
      ]
    }
  ]
};
