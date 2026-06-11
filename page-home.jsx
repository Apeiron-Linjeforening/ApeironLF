// ============ FORSIDE ============
function Hero({ variant, go }){
  const D = window.APEIRON_DATA;
  const Common = (
    <>
      <a className="btn btn--solid" onClick={()=>go('medlem')}>Bli medlem ∞</a>
      <a className="btn btn--ghost" onClick={()=>go('arrangementer')}>Se arrangementer</a>
    </>
  );

  if(variant==='sitat'){
    return (
      <section style={{padding:'120px 0 96px', textAlign:'center', position:'relative'}}>
        <div className="wrap" style={{maxWidth:880}}>
          <Reveal><div className="eyebrow" style={{justifyContent:'center', textAlign:'center'}}>Ἄπειρον · Det grenseløse</div></Reveal>
          <Reveal delay={.08}><p style={{fontFamily:'var(--display)', fontStyle:'italic', fontSize:'clamp(36px,6.4vw,76px)', lineHeight:1.08, margin:'26px 0 18px', letterSpacing:'.01em'}}>«Det eneste jeg vet,<br/>er at jeg intet vet.»</p></Reveal>
          <Reveal delay={.16}><p style={{fontFamily:'var(--mono)', letterSpacing:'.2em', textTransform:'uppercase', fontSize:13, color:'var(--maroon)'}}>— Sokrates, og enhver førsteårsstudent</p></Reveal>
          <Reveal delay={.24}><p style={{fontSize:20, color:'var(--ink-soft)', maxWidth:'52ch', margin:'30px auto 36px', lineHeight:1.6}}>Apeiron er linjeforeningen for filosofi og etikk ved NTNU — et fristed for de store spørsmålene, de lange kveldene og de gode vennskapene.</p></Reveal>
          <Reveal delay={.3}><div style={{display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap'}}>{Common}</div></Reveal>
        </div>
      </section>
    );
  }

  if(variant==='timeglass'){
    return (
      <section style={{padding:'96px 0', position:'relative', overflow:'hidden'}}>
        <div className="wrap" style={{display:'grid', gridTemplateColumns:'1.15fr .85fr', gap:50, alignItems:'center'}}>
          <div>
            <Reveal><div className="eyebrow">Linjeforening · Filosofi &amp; Etikk · NTNU</div></Reveal>
            <Reveal delay={.08}><h1 style={{fontSize:'clamp(52px,8vw,104px)', margin:'18px 0 4px', letterSpacing:'.02em'}}>Tenk<br/>grenseløst.</h1></Reveal>
            <Reveal delay={.16}><p style={{fontSize:21, color:'var(--ink-soft)', maxWidth:'40ch', margin:'18px 0 36px', lineHeight:1.6}}>Vi samler studenter som heller diskuterer det gode liv enn pensum — over kaffe, øl og altfor lange kvelder på Dragvoll.</p></Reveal>
            <Reveal delay={.24}><div style={{display:'flex', gap:14, flexWrap:'wrap'}}>{Common}</div></Reveal>
          </div>
          <Reveal delay={.2} style={{display:'flex', justifyContent:'center'}}>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:20, padding:'40px 56px', border:'1.5px solid var(--line)', borderRadius:6, background:'var(--card)', boxShadow:'var(--shadow)'}}>
              <div style={{animation:'flip 14s linear infinite'}}><Hourglass size={132}/></div>
              <div style={{fontFamily:'var(--mono)', fontSize:11, letterSpacing:'.22em', textTransform:'uppercase', color:'var(--gold-deep)'}}>Tiden renner · ideene består</div>
            </div>
          </Reveal>
        </div>
        <style>{`@keyframes flip{0%,42%{transform:rotate(0)}50%,92%{transform:rotate(180deg)}100%{transform:rotate(360deg)}}@media(max-width:880px){section .wrap{grid-template-columns:1fr!important}}`}</style>
      </section>
    );
  }

  // default: 'segl'
  return (
    <section style={{padding:'92px 0 84px', textAlign:'center', position:'relative'}}>
      <div className="wrap" style={{maxWidth:920}}>
        <Reveal style={{display:'flex', justifyContent:'center', marginBottom:30}}>
          <div style={{position:'relative'}}>
            <img src="assets/apeiron-logo.png" alt="Apeiron-seglet" width={188} height={188} style={{borderRadius:'50%', boxShadow:'0 30px 60px -30px rgba(35,39,64,.7)', animation:'breathe 7s ease-in-out infinite'}}/>
          </div>
        </Reveal>
        <Reveal delay={.1}><div className="eyebrow" style={{justifyContent:'center'}}>Ἕνωσις · Forent siden begynnelsen</div></Reveal>
        <Reveal delay={.16}><h1 style={{fontSize:'clamp(58px,10vw,128px)', letterSpacing:'.06em', margin:'12px 0 6px'}}>APEIRON</h1></Reveal>
        <Reveal delay={.22}><p style={{fontFamily:'var(--display)', fontStyle:'italic', fontSize:'clamp(22px,3.4vw,32px)', color:'var(--maroon-2)'}}>Linjeforeningen for filosofi og etikk ved NTNU</p></Reveal>
        <Reveal delay={.3}><p style={{fontSize:19, color:'var(--ink-soft)', maxWidth:'52ch', margin:'24px auto 34px', lineHeight:1.6}}>Et fristed for de store spørsmålene, de lange kveldene og de gode vennskapene — der ingen tanke er for stor og ingen kveld for kort.</p></Reveal>
        <Reveal delay={.36}><div style={{display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap'}}>{Common}</div></Reveal>
      </div>
      <style>{`@keyframes breathe{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-9px) rotate(-1.5deg)}}`}</style>
    </section>
  );
}

function StatStrip(){
  const stats = [['∞','spørsmål, null fasit'],['150','medlemmer & voksende'],['8','komiteer & verv'],['2014','forent på Dragvoll']];
  return (
    <div className="wrap">
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0, border:'1.5px solid var(--line)', borderRadius:4, overflow:'hidden', background:'var(--card)'}}>
        {stats.map(([n,l],i)=>
          <div key={i} style={{padding:'26px 22px', textAlign:'center', borderLeft:i?'1.5px solid var(--line)':'none'}}>
            <div style={{fontFamily:'var(--display)', fontSize:42, fontWeight:700, color:'var(--maroon)', lineHeight:1}}>{n}</div>
            <div style={{fontFamily:'var(--mono)', fontSize:11, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--ink-soft)', marginTop:8}}>{l}</div>
          </div>
        )}
      </div>
      <style>{`@media(max-width:760px){.wrap > div[style*="repeat(4"]{grid-template-columns:1fr 1fr!important}}`}</style>
    </div>
  );
}

function FeaturedEvent({ go }){
  const e = window.APEIRON_DATA.events[0];
  return (
    <section className="band ink">
      <div className="wrap" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:54, alignItems:'center'}}>
        <Reveal>
          <div className="eyebrow">Neste på programmet</div>
          <h2 style={{fontSize:'clamp(34px,4.4vw,52px)', margin:'14px 0 16px'}}>{e.title}</h2>
          <p style={{fontSize:18, color:'rgba(247,239,218,.78)', lineHeight:1.6, maxWidth:'44ch', marginBottom:26}}>{e.desc}</p>
          <div style={{display:'flex', gap:10, flexWrap:'wrap', marginBottom:30}}>
            <span className="tag">📅 {e.day} {e.date}</span>
            <span className="tag">⏰ {e.time}</span>
            <span className="tag">📍 {e.place}</span>
          </div>
          <a className="btn btn--gold" onClick={()=>go('arrangementer')}>Meld deg på</a>
        </Reveal>
        <Reveal delay={.12}>
          <Ph label="Foto: forrige sokratiske kafé" style={{aspectRatio:'4/3', borderRadius:6, '--paper-2':'#2c3150', '--paper-3':'#343a5c'}}/>
        </Reveal>
      </div>
      <style>{`@media(max-width:820px){.band.ink .wrap{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

function NewsRow({ go }){
  const D = window.APEIRON_DATA;
  return (
    <section className="band">
      <div className="wrap">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:20, marginBottom:44, flexWrap:'wrap'}}>
          <SecHead eyebrow="Fra foreningen" title="Siste nytt" />
          <a className="btn btn--ghost" onClick={()=>go('om')}>Om oss</a>
        </div>
        <div className="cardgrid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
          {D.news.map((n,i)=>
            <Reveal key={i} delay={i*.08} className="card" style={{padding:'26px', display:'flex', flexDirection:'column', gap:14}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span className="tag" style={{color:'var(--maroon)', borderColor:'var(--maroon)'}}>{n.tag}</span>
                <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--ink-faint)', letterSpacing:'.1em'}}>{n.date}</span>
              </div>
              <h3 style={{fontSize:26}}>{n.title}</h3>
              <p style={{color:'var(--ink-soft)', fontSize:15.5, lineHeight:1.55}}>{n.desc}</p>
            </Reveal>
          )}
        </div>
      </div>
      <style>{`@media(max-width:820px){.cardgrid[style*="repeat(3"]{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

function QuoteBand(){
  const q = window.APEIRON_DATA.quotes[1];
  return (
    <section className="band maroon" style={{textAlign:'center', padding:'104px 0'}}>
      <div className="wrap" style={{maxWidth:860}}>
        <div style={{fontSize:54, color:'var(--gold)', fontFamily:'var(--display)', lineHeight:0, marginBottom:10}}>“</div>
        <Reveal><p style={{fontFamily:'var(--display)', fontStyle:'italic', fontSize:'clamp(30px,4.6vw,50px)', lineHeight:1.2}}>{q.t}</p></Reveal>
        <p style={{fontFamily:'var(--mono)', letterSpacing:'.22em', textTransform:'uppercase', fontSize:13, color:'var(--gold)', marginTop:22}}>— {q.a}</p>
      </div>
    </section>
  );
}

function Home({ go, hero }){
  return (
    <div className="fade-in">
      <Hero variant={hero} go={go}/>
      <div style={{marginBottom:0, paddingBottom:80}}><StatStrip/></div>
      <FeaturedEvent go={go}/>
      <QuoteBand/>
      <NewsRow go={go}/>
    </div>
  );
}
window.Home = Home;
