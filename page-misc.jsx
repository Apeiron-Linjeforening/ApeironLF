// ============ KOMITEER ============
function Committees({ go }){
  const D = window.APEIRON_DATA;
  return (
    <div className="fade-in">
      <PageHead eyebrow="Undergrupper" title="Komiteene"
        intro="Apeiron drives av folk, ikke av styret alene. Her er gjengene som får ting til å skje — bli med i én (eller fem)." />
      <section className="band" style={{paddingTop:56}}>
        <div className="wrap">
          <div className="cardgrid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
            {D.committees.map((c,i)=>
              <Reveal key={i} delay={(i%3)*.07} className="card" style={{padding:'30px', display:'flex', flexDirection:'column', gap:14, minHeight:230}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div style={{width:56, height:56, borderRadius:'50%', border:'1.5px solid var(--gold-deep)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, color:'var(--gold-deep)'}}>{c.glyph}</div>
                  <span className="tag">{c.tag}</span>
                </div>
                <div>
                  <h3 style={{fontSize:26}}>{c.name}</h3>
                  <p style={{fontFamily:'var(--mono)', fontSize:11.5, letterSpacing:'.16em', textTransform:'uppercase', color:'var(--maroon)', marginTop:4}}>«{c.short}»</p>
                </div>
                <p style={{color:'var(--ink-soft)', fontSize:15.5, lineHeight:1.6}}>{c.desc}</p>
              </Reveal>
            )}
          </div>
          <div style={{textAlign:'center', marginTop:54}}>
            <a className="btn btn--ghost" onClick={()=>go('kontakt')}>Vil du bli med i en komité?</a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============ BLI MEDLEM ============
function Join(){
  const D = window.APEIRON_DATA;
  const [done,setDone] = useState(false);
  const perks = [
    ['Rabatt på alt','Lavere pris på fester, turer og middager — medlemskapet tjener seg fort inn.'],
    ['Lesesirkler','Fast plass i sirklene, med tekster, kaffe og samtale annenhver uke.'],
    ['Et nettverk','Bli kjent på tvers av kull — fra ferske førsteårsstudenter til snart-ferdige.'],
    ['Verv & erfaring','Mulighet til å ta verv, lede komiteer og pynte på CV-en med ekte ansvar.'],
  ];
  return (
    <div className="fade-in">
      <PageHead eyebrow="Bli medlem" title="Én avgift. Hele studietiden."
        intro="Kr 150 én gang — så er du med så lenge du studerer. Ingen krav om at du leser filosofi; bare at du er nysgjerrig." />
      <section className="band" style={{paddingTop:56}}>
        <div className="wrap" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'start'}}>
          <div>
            <div className="cardgrid" style={{gridTemplateColumns:'1fr 1fr'}}>
              {perks.map(([t,d],i)=>
                <Reveal key={i} delay={i*.06} style={{padding:'24px', border:'1.5px solid var(--line)', borderRadius:5, background:'var(--card)'}}>
                  <div style={{fontFamily:'var(--display)', fontSize:34, color:'var(--gold-deep)', lineHeight:1}}>{String(i+1).padStart(2,'0')}</div>
                  <h3 style={{fontSize:21, margin:'10px 0 7px'}}>{t}</h3>
                  <p style={{color:'var(--ink-soft)', fontSize:14.5, lineHeight:1.55}}>{d}</p>
                </Reveal>
              )}
            </div>
          </div>
          <Reveal delay={.1} style={{position:'sticky', top:96, background:'var(--ink)', color:'var(--paper)', borderRadius:8, padding:'34px', boxShadow:'var(--shadow)'}}>
            {!done ? <>
              <div className="eyebrow" style={{color:'var(--gold)'}}>Meld deg inn</div>
              <h3 style={{fontSize:30, margin:'10px 0 6px'}}>Velkommen om bord</h3>
              <p style={{color:'rgba(247,239,218,.72)', fontSize:15, marginBottom:22}}>Fyll ut, så tar vi kontakt om betaling (Vipps) og neste arrangement.</p>
              <form onSubmit={e=>{e.preventDefault(); setDone(true);}} style={{display:'flex', flexDirection:'column', gap:14}}>
                <label className="fld" style={{color:'rgba(247,239,218,.7)'}}>Navn<input required placeholder="Ditt navn" style={{background:'rgba(247,239,218,.06)', color:'var(--paper)', borderColor:'rgba(247,239,218,.2)'}}/></label>
                <label className="fld" style={{color:'rgba(247,239,218,.7)'}}>Student-e-post<input required type="email" placeholder="navn@stud.ntnu.no" style={{background:'rgba(247,239,218,.06)', color:'var(--paper)', borderColor:'rgba(247,239,218,.2)'}}/></label>
                <label className="fld" style={{color:'rgba(247,239,218,.7)'}}>Studieretning<input placeholder="Filosofi, etikk, eller …" style={{background:'rgba(247,239,218,.06)', color:'var(--paper)', borderColor:'rgba(247,239,218,.2)'}}/></label>
                <button className="btn btn--gold" style={{justifyContent:'center', marginTop:6}} type="submit">Send innmelding ∞</button>
              </form>
            </> : <div style={{textAlign:'center', padding:'24px 0'}}>
              <div style={{fontSize:52, color:'var(--gold)'}}>∞</div>
              <h3 style={{fontSize:28, margin:'12px 0 8px'}}>Da er du i gang!</h3>
              <p style={{color:'rgba(247,239,218,.75)', fontSize:16}}>Vi sender deg en e-post med betaling og en varm velkomst. Sees på Dragvoll!</p>
            </div>}
          </Reveal>
        </div>
      </section>
      <style>{`@media(max-width:880px){.band .wrap[style*="1fr 1fr"]{grid-template-columns:1fr!important}.band .wrap [style*="sticky"]{position:static!important}}`}</style>
    </div>
  );
}

// ============ KONTAKT / FAQ ============
function Contact(){
  const D = window.APEIRON_DATA;
  const [open,setOpen] = useState(0);
  return (
    <div className="fade-in">
      <PageHead eyebrow="Kontakt &amp; FAQ" title="Si hei"
        intro="Spørsmål, idé eller bare lyst til å henge? Vi er enklere å nå enn Sokrates var å overbevise." />
      <section className="band" style={{paddingTop:56}}>
        <div className="wrap" style={{display:'grid', gridTemplateColumns:'.85fr 1.15fr', gap:56, alignItems:'start'}}>
          <div style={{display:'flex', flexDirection:'column', gap:18}}>
            {[['E-post','post@apeiron.no'],['Instagram','@apeiron.ntnu'],['Facebook','Apeiron Linjeforening'],['Finn oss','Dragvoll, Bygg 5 · Trondheim']].map(([k,v],i)=>
              <Reveal key={i} delay={i*.05} style={{padding:'22px 24px', border:'1.5px solid var(--line)', borderRadius:5, background:'var(--card)'}}>
                <div className="eyebrow" style={{color:'var(--maroon)'}}>{k}</div>
                <p style={{fontFamily:'var(--display)', fontSize:24, marginTop:6}}>{v}</p>
              </Reveal>
            )}
          </div>
          <div>
            <Eyebrow>Ofte stilte spørsmål</Eyebrow>
            <div style={{marginTop:20, borderTop:'1.5px solid var(--line)'}}>
              {D.faq.map((f,i)=>
                <div key={i} style={{borderBottom:'1.5px solid var(--line)'}}>
                  <button onClick={()=>setOpen(open===i?-1:i)} style={{width:'100%', background:'none', border:'none', cursor:'pointer', padding:'22px 0', display:'flex', justifyContent:'space-between', alignItems:'center', gap:20, textAlign:'left', color:'var(--ink)'}}>
                    <span style={{fontFamily:'var(--display)', fontSize:24, fontWeight:600}}>{f.q}</span>
                    <span style={{fontSize:24, color:'var(--maroon)', transition:'transform .25s', transform:open===i?'rotate(45deg)':'none', flexShrink:0}}>+</span>
                  </button>
                  <div style={{maxHeight:open===i?260:0, overflow:'hidden', transition:'max-height .35s ease'}}>
                    <p style={{paddingBottom:24, color:'var(--ink-soft)', fontSize:16.5, lineHeight:1.65, maxWidth:'60ch'}}>{f.a}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <style>{`@media(max-width:880px){.band .wrap[style*=".85fr 1.15fr"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
Object.assign(window,{ Committees, Join, Contact });
