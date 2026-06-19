/* Mock-innhold for forslag-nyheter.html — kun for designvisning. */
window.NYHET_MOCKS = (function () {
  var nav =
    '<div class="m-nav">'
    + '<div class="m-brand"><img src="assets/apeiron-logo.png" alt="" /><span><span class="nm">Apeiron</span><span class="sub">Filosofi &amp; etikk · NTNU</span></span></div>'
    + '<div class="m-links"><a class="is-active">Hjem</a><a>Om oss</a><a>Arrangementer</a><a>Merch</a><a>Begrep</a><a class="cta">Bli medlem</a></div>'
    + '</div>';

  var idA =
    '<div class="mh__id">'
    + '<span class="m-eyebrow">Linjeforening siden 1981</span>'
    + '<h1 class="m-word">Apeir<span class="o">o</span>n</h1>'
    + '<p class="m-tag">det grenseløse fellesskapet</p>'
    + '<p class="m-lede">Linjeforeningen for filosofi og etikk ved NTNU. Vi tenker de store tankene — og tar en kaffe på det etterpå.</p>'
    + '<div class="m-cta"><a class="m-btn m-btn--gold">Bli medlem →</a><a class="m-btn m-btn--ghost">Se hva som skjer</a></div>'
    + '</div>';

  var nowPanel =
    '<aside class="now">'
    + '<div class="now__head"><span class="now__kick">Akkurat nå</span></div>'
    + '<div class="now__urgent">Aporetisk i kveld er flyttet til Loftet · 19:00</div>'
    + '<a class="now__row"><span class="now__date"><b>20</b><span>JUN</span></span><span class="now__body"><span class="now__lbl">Neste arrangement</span><span class="now__ttl">Fagkveld: Etikk &amp; KI</span><span class="now__meta">18:00 · Låven, Dragvoll</span></span></a>'
    + '<a class="now__row"><span class="now__body"><span class="now__lbl">Kunngjøring</span><span class="now__ttl">Påmelding til Symposion er åpen</span></span><span class="now__arr">→</span></a>'
    + '<a class="now__row"><span class="now__body"><span class="now__lbl">Nytt</span><span class="now__ttl">Begrep #4 er ute nå</span></span><span class="now__arr">→</span></a>'
    + '<a class="now__all">Se alle oppslag &amp; arkiv →</a>'
    + '</aside>';

  var a =
    '<div class="mh mh--a"><img class="mh__seal" src="assets/apeiron-logo.png" alt="" />'
    + nav
    + '<div class="mh__inner"><div class="grid-a">' + idA + nowPanel + '</div></div></div>';

  var b =
    '<div class="mh mh--b"><img class="mh__seal" src="assets/apeiron-logo.png" alt="" />'
    + nav
    + '<div class="mh__inner">'
    + '<span class="m-eyebrow">Linjeforening for filosofi &amp; etikk · NTNU siden 1981</span>'
    + '<h1 class="m-word">Apeir<span class="o">o</span>n</h1>'
    + '<p class="m-tag">det grenseløse fellesskapet</p>'
    + '<div class="m-cta"><a class="m-btn m-btn--gold">Bli medlem →</a><a class="m-btn m-btn--ghost">Se hva som skjer</a></div>'
    + '<div class="brad">'
    + '<div class="brad__urgent">Aporetisk i kveld er flyttet til Loftet · 19:00</div>'
    + '<div class="brad__tiles">'
    + '<a class="brad__tile"><span class="brad__date"><b>20</b><span>JUN</span></span><span><span class="brad__lbl">Neste arrangement</span><span class="brad__ttl">Fagkveld: Etikk &amp; KI</span></span></a>'
    + '<a class="brad__tile"><span><span class="brad__lbl">Siste nytt</span><span class="brad__ttl">Påmelding til Symposion åpen</span></span></a>'
    + '<a class="brad__more">Mer →</a>'
    + '</div></div>'
    + '</div></div>';

  var idC =
    '<div class="mh__id">'
    + '<span class="m-eyebrow">Linjeforening siden 1981</span>'
    + '<h1 class="m-word">Apeir<span class="o">o</span>n</h1>'
    + '<p class="m-tag">det grenseløse fellesskapet</p>'
    + '<p class="m-lede">Filosofi og etikk ved NTNU. Fagkvelder, det legendariske symposion, lesesirkler og lange samtaler.</p>'
    + '<div class="m-cta"><a class="m-btn m-btn--gold">Bli medlem →</a><a class="m-btn m-btn--ghost">Om oss</a></div>'
    + '</div>';

  var tavla =
    '<aside class="tavla">'
    + '<div class="tavla__head"><b>Fra tavla</b><span>nyeste først</span></div>'
    + '<a class="slip slip--urgent"><span class="slip__lbl">Viktig</span><span class="slip__ttl">Aporetisk flyttet til Loftet</span><span class="slip__meta">I kveld · 19:00</span></a>'
    + '<a class="slip"><span class="slip__lbl">Neste arrangement · 20. juni</span><span class="slip__ttl">Fagkveld: Etikk &amp; KI</span><span class="slip__meta">18:00 · Låven</span></a>'
    + '<a class="slip"><span class="slip__lbl">Kunngjøring</span><span class="slip__ttl">Påmelding til Symposion er åpen</span></a>'
    + '<a class="tavla__all">Hele tavla &amp; arkiv →</a>'
    + '</aside>';

  var c =
    '<div class="mh mh--c"><img class="mh__seal" src="assets/apeiron-logo.png" alt="" />'
    + nav
    + '<div class="mh__inner"><div class="grid-c">' + idC + tavla + '</div></div></div>';

  function wrap(note, inner) {
    return '<div class="secd">'
      + '<div class="secd__head"><span class="m-eyebrow">Hva skjer</span><h2 class="sec-h">Arrangementer</h2></div>'
      + '<p class="secd__note">' + note + '</p>'
      + inner
      + '<div class="secd__faux"><div></div><div></div><div></div><div></div><div></div><div></div></div>'
      + '</div>';
  }

  // 1 · Enkel (slank notis)
  var beskjed = wrap(
    '↓ Slank notis — rolig gull når den er vanlig, fylt vinrød når den haster.',
    '<div class="beskjed"><span class="beskjed__tag">Beskjed</span><div class="beskjed__body"><b>Fagkvelden 20. juni er flyttet</b> til Loftet på Låven — samme tid, 18:00. <a>Se detaljer →</a></div></div>'
    + '<div class="beskjed beskjed--urgent"><span class="beskjed__tag">Viktig</span><div class="beskjed__body"><b>Symposion er fullt</b> — venteliste er åpnet for medlemmer. <a>Sett deg på lista →</a></div></div>'
  );

  // 2 · Dato + handling (full bredde, tydelig knapp)
  var beskjed2 = wrap(
    '↓ Datoblokk + tittel + handling — fyller bredden og gir én tydelig knapp (påmelding, skjema, detaljer).',
    '<div class="bsk2"><div class="bsk2__date"><b>20</b><span>JUN</span></div>'
    + '<div class="bsk2__main"><span class="bsk2__tag">Beskjed · arrangement flyttet</span><h3 class="bsk2__ttl">Fagkvelden flyttes til Loftet på Låven</h3><p class="bsk2__txt">Samme tid, 18:00. Plass til flere — ta med en venn.</p></div>'
    + '<a class="bsk2__act">Se detaljer →</a></div>'
    + '<div class="bsk2 bsk2--urgent"><div class="bsk2__date"><b>!</b><span>NÅ</span></div>'
    + '<div class="bsk2__main"><span class="bsk2__tag">Viktig · venteliste</span><h3 class="bsk2__ttl">Symposion er fullt</h3><p class="bsk2__txt">Venteliste er åpnet for medlemmer — først til mølla.</p></div>'
    + '<a class="bsk2__act">Sett deg på lista →</a></div>'
  );

  // 3 · Side-om-side (flere beskjeder deler én rad)
  var beskjed3 = wrap(
    '↓ Flere beskjeder deler én rad i stedet for å stable seg høyt — bra når det er mye på gang.',
    '<div class="bsk3">'
    + '<a class="bsk3__card bsk3__card--urgent"><span class="lbl">Viktig</span><span class="ttl">Aporetisk flyttet til Loftet</span><span class="meta">I kveld · 19:00</span></a>'
    + '<a class="bsk3__card"><span class="lbl">Kunngjøring</span><span class="ttl">Påmelding til Symposion åpen</span><span class="meta">Frist 25. juni</span></a>'
    + '<a class="bsk3__card"><span class="lbl">Nytt</span><span class="ttl">Begrep #4 er ute</span><span class="meta">Hent på Låven</span></a>'
    + '</div>'
  );

  // 4 · Bred banner med segl
  var beskjed4 = wrap(
    '↓ Bredt banner med seglet i bakgrunnen — til den ene store kunngjøringen som fortjener oppmerksomhet.',
    '<div class="bsk4"><img class="bsk4__seal" src="assets/apeiron-logo.png" alt="" />'
    + '<div class="bsk4__content"><span class="bsk4__tag">Kunngjøring</span><h3 class="bsk4__ttl">Symposion 2026 — påmeldingen er åpen</h3><p class="bsk4__txt">Årets store kveld med tale, vin og samtale på Låven. Begrenset antall plasser; medlemmer slipper til først.</p><a class="bsk4__act">Meld deg på →</a></div>'
    + '</div>'
  );

  return { a: a, b: b, c: c, beskjed: beskjed, beskjed2: beskjed2, beskjed3: beskjed3, beskjed4: beskjed4 };
})();
