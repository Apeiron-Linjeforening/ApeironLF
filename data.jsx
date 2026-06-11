// ============ APEIRON — innholdsdata ============
const APEIRON_DATA = {
  events: [
    { id:'sok', title:'Sokratisk kafé: Hva er et godt liv?', date:'12. SEP', day:'Torsdag', time:'18:00', place:'Lesesalen, Dragvoll', cat:'Samtale', spots:'9 plasser igjen',
      desc:'Vi tar opp en gammel klassiker over kaffe og kanelboller — fri samtale, ingen fasit. Alle nivåer velkomne.' },
    { id:'symp', title:'Symposion — semesterets store fest', date:'27. SEP', day:'Fredag', time:'20:00', place:'Hemmelig lokale', cat:'Fest', spots:'Billetter snart',
      desc:'Tre retter, taler, og dans til daggry. Vår hyllest til Platons gjestebud — bare med mer glitter.' },
    { id:'quiz', title:'Filosofisk pub-quiz', date:'03. OKT', day:'Torsdag', time:'19:00', place:'Café Løkka', cat:'Sosialt', spots:'Drop-in',
      desc:'Lag på inntil fem. Spørsmål fra Sokrates til science fiction. Vinnerlaget tar med seg vandrepokalen.' },
    { id:'les', title:'Lesesirkel: Nietzsche — Slik talte Zarathustra', date:'10. OKT', day:'Torsdag', time:'17:30', place:'Rom 6420, Dragvoll', cat:'Lesesirkel', spots:'12 plasser igjen',
      desc:'Del to av høstens lesesirkel. Vi leser kapittel 3–6 — du trenger ikke ha lest alt for å henge med.' },
    { id:'gjest', title:'Gjesteforelesning: Etikk i KI-alderen', date:'24. OKT', day:'Torsdag', time:'18:00', place:'Aud. D2, Dragvoll', cat:'Foredrag', spots:'Åpent for alle',
      desc:'Hva skylder vi maskinene — og hverandre? En kveld om moralsk ansvar når algoritmene bestemmer.' },
    { id:'hytte', title:'Hyttetur til Bymarka', date:'08. NOV', day:'Fredag', time:'16:00', place:'Avreise Dragvoll', cat:'Tur', spots:'18 plasser',
      desc:'Helg på hytta med bål, brettspill og altfor lange samtaler. Mat og transport inkludert i kr 350.' },
  ],
  board: [
    { role:'Leder', name:'Ingrid Sølvberg', year:'3. året', philosopher:'Hannah Arendt', email:'leder@apeiron.no' },
    { role:'Nestleder', name:'Jonas Five Aune', year:'3. året', philosopher:'David Hume', email:'nestleder@apeiron.no' },
    { role:'Økonomiansvarlig', name:'Amalie Rønning', year:'2. året', philosopher:'Adam Smith', email:'okonomi@apeiron.no' },
    { role:'Arrangementsansvarlig', name:'Sander Bøe', year:'2. året', philosopher:'Epikur', email:'arr@apeiron.no' },
    { role:'PR-ansvarlig', name:'Tuva Lindqvist', year:'2. året', philosopher:'Marshall McLuhan', email:'pr@apeiron.no' },
    { role:'Bedriftskontakt', name:'Mathias Holt', year:'3. året', philosopher:'John Rawls', email:'bedrift@apeiron.no' },
    { role:'Sekretær', name:'Live Hagen', year:'1. året', philosopher:'Simone de Beauvoir', email:'sekretar@apeiron.no' },
    { role:'Fadderansvarlig', name:'Oskar Lie', year:'2. året', philosopher:'Sokrates', email:'fadder@apeiron.no' },
  ],
  committees: [
    { name:'Arrangementskomiteen', short:'Arrk', glyph:'◆', desc:'Hjernen bak hver fest, quiz og kafé. Hvis det skjer noe gøy, har Arrk en finger med i spillet.', tag:'Sosialt' },
    { name:'Lesesirkelen', short:'Les', glyph:'❧', desc:'Møtes annenhver uke rundt én tekst. I høst: eksistensialismen fra Kierkegaard til Camus.', tag:'Faglig' },
    { name:'Symposion', short:'Symp', glyph:'∞', desc:'Festkomiteen med sans for det storslåtte. Står bak halvårsfesten og julebordet.', tag:'Fest' },
    { name:'PR & Foto', short:'PR', glyph:'❂', desc:'Plakater, Instagram og bildene som overlever til neste generasjon. Estetikkens voktere.', tag:'Media' },
    { name:'Bedriftskomiteen', short:'Bedk', glyph:'⬡', desc:'Bygger bro mellom studiet og arbeidslivet — bedriftsbesøk, foredrag og karrierekvelder.', tag:'Karriere' },
    { name:'Turkomiteen', short:'Tur', glyph:'⛰', desc:'Hyttehelger, fjellturer og bål. Der de beste samtalene faktisk skjer — langt fra lesesalen.', tag:'Friluft' },
  ],
  faq: [
    { q:'Må jeg studere filosofi for å bli med?', a:'Nei! Hjertet vårt ligger hos filosofi- og etikkstudentene, men alle som er nysgjerrige på de store spørsmålene er hjertelig velkomne — uansett studieretning.' },
    { q:'Hva koster medlemskapet?', a:'Kr 150 for hele studieløpet — én engangsavgift, ikke per semester. Det dekker rabatterte arrangementer, lesesirkler og en plass i fellesskapet.' },
    { q:'Når og hvor møtes dere?', a:'Det meste skjer på Dragvoll, der filosofi holder til. Faste arrangementer er som regel torsdager, med fest og turer innimellom. Følg kalenderen vår.' },
    { q:'Hvordan blir jeg med i en komité?', a:'Vi rekrutterer ved semesterstart, men dører står alltid på gløtt. Ta kontakt med komitéen direkte eller send oss en melding — vi finner en plass til deg.' },
    { q:'Hva betyr egentlig «Apeiron»?', a:'Ἄπειρον — «det grenseløse». Filosofen Anaximander mente alt stammer fra det uendelige og uavgrensede. Vi syntes det passet godt for et sted der ingen spørsmål er for store.' },
  ],
  quotes: [
    { t:'Det eneste jeg vet, er at jeg intet vet.', a:'Sokrates' },
    { t:'Den som har et hvorfor å leve for, tåler nesten ethvert hvordan.', a:'Friedrich Nietzsche' },
    { t:'Mennesket er dømt til å være fritt.', a:'Jean-Paul Sartre' },
  ],
  news: [
    { tag:'Nytt styre', title:'Apeiron har valgt styre for 2026', date:'4. JUN 2026', desc:'Generalforsamlingen samlet rekordmange — møt de åtte som tar foreningen videre.' },
    { tag:'Lesesirkel', title:'Høstens lesesirkel: eksistensialismen', date:'28. MAI 2026', desc:'Fra Kierkegaards angst til Camus’ opprør. Påmelding åpner i august.' },
    { tag:'Samarbeid', title:'Nytt samarbeid med Filosofisk institutt', date:'14. MAI 2026', desc:'Gjesteforelesninger og lesesalsplasser — tettere bånd til fagmiljøet.' },
  ],
};
window.APEIRON_DATA = APEIRON_DATA;
