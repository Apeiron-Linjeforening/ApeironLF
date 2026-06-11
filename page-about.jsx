// ============ OM OSS ============
function PageHead({ eyebrow, title, intro, children }){
  return (
    <section style={{padding:'72px 0 30px', borderBottom:'1.5px solid var(--line)'}}>
      <div className="wrap">
        <Reveal><div className="eyebrow">{eyebrow}</div></Reveal>
        <Reveal delay={.06}><h1 style={{fontSize:'clamp(46px,7vw,86px)', margin:'14px 0 0', letterSpacing:'.01em'}}>{title}</h1></Reveal>
        {intro && <Reveal delay={.12}><p style={{fontSize:21, color:'var(--ink-soft)', maxWidth:'58ch', marginTop:18, lineHeight:1.6}}>{intro}</p></Reveal>}
        {children}
      </div>
    </section>
  );
}

function About({ go }){
  const D = window.APEIRON_DATA;
  const timeline = [
    ['2014','Apeiron stiftes av en håndfull filosofistudenter på Dragvoll.'],
    ['2017','Første Symposion-fest — i dag semesterets høydepunkt.'],
    ['2021','Lesesirkelen formaliseres som fast komité.'],
    ['2026','Over 150 medlemmer og åtte aktive komiteer.'],
  ];
  const values = [
    ['Nysgjerrighet','Vi tror på spørsmålet mer enn svaret. Her er det lov å lure høyt.'],
    ['Raushet','Ingen er for fersk og intet spørsmål for naivt. Døra står på gløtt.'],
    ['Samtale','De beste tankene oppstår mellom mennesker — ikke i ensomhet på lesesalen.'],
  ];
  return (
    <div className="fade-in">
      <PageHead eyebrow="Ἕνωσις · Forent siden 2014" title="Om oss"
        intro="Apeiron er linjeforeningen for filosofi og etikk ved NTNU. Vi finnes for at studietiden skal bli mer enn pensum — et fellesskap rundt undringen som først førte oss hit." />

      <section className="band">
        <div className="wrap" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'center'}}>
          <Reveal>
            <Eyebrow>Navnet</Eyebrow>
            <h2 style={{fontSize:'clamp(32px,4vw,48px)', margin:'14px 0 18px'}}>Ἄπειρον — det grenseløse</h2>
            <p style={{fontSize:17.5, color:'var(--ink-soft)', lineHeight:1.7, marginBottom:16}}>Den greske filosofen Anaximander mente at alt som finnes springer ut av <em>apeiron</em> — det uendelige, ubestemte og grenseløse. Ikke vann, ikke ild, men selve muligheten bak alt.</p>
            <p style={{fontSize:17.5, color:'var(--ink-soft)', lineHeight:1.7}}>Vi tok navnet fordi det passet: et sted der ingen tanke er for stor, og ingen kveld for kort. Timeglasset i seglet minner oss om at tiden renner — men ideene består.</p>
          </Reveal>
          <Reveal delay={.12} style={{display:'flex', justifyContent:'center'}}>
            <div style={{textAlign:'center', padding:'44px 50px', background:'var(--card)', border:'1.5px solid var(--line)', borderRadius:6, boxShadow:'var(--shadow)'}}>
              <Hourglass size={120}/>
              <p style={{fontFamily:'var(--display)', fontStyle:'italic', fontSize:26, marginTop:22}}>«Γραμμικὴ Ἕνωσις<br/>Φιλοσοφίας καὶ Ἠθικῆς»</p>
              <p style={{fontFamily:'var(--mono)', fontSize:11.5, letterSpacing:'.16em', textTransform:'uppercase', color:'var(--gold-deep)', marginTop:14, lineHeight:1.7}}>Lineær forening for<br/>filosofi og etikk —<br/>«linjeforening» på gresk</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="band ink">
        <div className="wrap">
          <SecHead eyebrow="Det vi står for" title="Tre ting vi tror på" light />
          <div className="cardgrid" style={{gridTemplateColumns:'repeat(3,1fr)', marginTop:46}}>
            {values.map(([t,d],i)=>
              <Reveal key={i} delay={i*.08} style={{padding:'30px', border:'1.5px solid rgba(247,239,218,.18)', borderRadius:5}}>
                <div style={{fontFamily:'var(--display)', fontSize:46, color:'var(--gold)', lineHeight:1}}>{String(i+1).padStart(2,'0')}</div>
                <h3 style={{fontSize:27, margin:'14px 0 10px'}}>{t}</h3>
                <p style={{color:'rgba(247,239,218,.74)', fontSize:15.5, lineHeight:1.6}}>{d}</p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <SecHead eyebrow="Vår historie" title="Fra fire stoler til et fellesskap" />
          <div style={{marginTop:48, display:'grid', gap:0}}>
            {timeline.map(([y,d],i)=>
              <Reveal key={i} delay={i*.06} style={{display:'grid', gridTemplateColumns:'160px 1fr', gap:30, padding:'26px 0', borderTop:'1.5px solid var(--line)', alignItems:'baseline'}}>
                <div style={{fontFamily:'var(--display)', fontSize:40, fontWeight:700, color:'var(--maroon)'}}>{y}</div>
                <p style={{fontSize:18.5, color:'var(--ink-soft)', lineHeight:1.6, paddingTop:6}}>{d}</p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="band maroon" style={{textAlign:'center'}}>
        <div className="wrap" style={{maxWidth:680}}>
          <h2 style={{fontSize:'clamp(34px,4.6vw,52px)'}}>Vil du bli en av oss?</h2>
          <p style={{fontSize:19, color:'rgba(247,239,218,.85)', margin:'16px auto 30px', maxWidth:'44ch'}}>Medlemskapet varer hele studieløpet og koster mindre enn to kaffe latte.</p>
          <a className="btn btn--gold" onClick={()=>go('medlem')}>Bli medlem ∞</a>
        </div>
      </section>
      <style>{`@media(max-width:820px){.band .wrap[style*="1fr 1fr"]{grid-template-columns:1fr!important}.cardgrid[style*="repeat(3"]{grid-template-columns:1fr!important}.band .wrap [style*="160px 1fr"]{grid-template-columns:90px 1fr!important}}`}</style>
    </div>
  );
}
Object.assign(window,{ About, PageHead });
