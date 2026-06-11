// ============ ARRANGEMENTER ============
function SignupModal({ ev, onClose }){
  const [done,setDone] = useState(false);
  if(!ev) return null;
  return (
    <div onClick={onClose} style={{position:'fixed', inset:0, zIndex:200, background:'rgba(20,22,38,.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20, animation:'fade .25s both'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'var(--paper)', border:'1.5px solid var(--line)', borderRadius:8, maxWidth:480, width:'100%', padding:'34px', boxShadow:'0 40px 80px -30px rgba(0,0,0,.6)'}}>
        {!done ? <>
          <div className="eyebrow" style={{color:'var(--maroon)'}}>{ev.day} {ev.date} · {ev.time}</div>
          <h3 style={{fontSize:30, margin:'10px 0 6px'}}>{ev.title}</h3>
          <p style={{color:'var(--ink-soft)', fontSize:15, marginBottom:22}}>{ev.place} · {ev.spots}</p>
          <form onSubmit={e=>{e.preventDefault(); setDone(true);}} style={{display:'flex', flexDirection:'column', gap:14}}>
            <label className="fld">Navn<input required placeholder="Ditt navn"/></label>
            <label className="fld">E-post<input required type="email" placeholder="navn@stud.ntnu.no"/></label>
            <label className="fld">Allergier eller annet?<input placeholder="Valgfritt"/></label>
            <button className="btn btn--solid" style={{justifyContent:'center', marginTop:6}} type="submit">Meld meg på ∞</button>
          </form>
        </> : <div style={{textAlign:'center', padding:'10px 0'}}>
          <div style={{fontSize:46, color:'var(--gold)'}}>∞</div>
          <h3 style={{fontSize:28, margin:'10px 0 8px'}}>Du er påmeldt!</h3>
          <p style={{color:'var(--ink-soft)', fontSize:16, marginBottom:24}}>Vi gleder oss til å se deg på «{ev.title}». Bekreftelse er på vei til innboksen din.</p>
          <button className="btn btn--ghost" style={{justifyContent:'center'}} onClick={onClose}>Lukk</button>
        </div>}
      </div>
    </div>
  );
}

function Events(){
  const D = window.APEIRON_DATA;
  const cats = ['Alle', ...Array.from(new Set(D.events.map(e=>e.cat)))];
  const [cat,setCat] = useState('Alle');
  const [modal,setModal] = useState(null);
  const list = cat==='Alle' ? D.events : D.events.filter(e=>e.cat===cat);
  return (
    <div className="fade-in">
      <PageHead eyebrow="Semesterprogram · Høst 2026" title="Arrangementer"
        intro="Fra sokratiske kaféer til fest i hemmelig lokale. Det meste skjer på torsdager — meld deg på, eller bare dukk opp." />

      <section className="band" style={{paddingTop:48}}>
        <div className="wrap">
          <div style={{display:'flex', gap:10, flexWrap:'wrap', marginBottom:40}}>
            {cats.map(c=>
              <button key={c} onClick={()=>setCat(c)} className="tag" style={{cursor:'pointer', background:cat===c?'var(--ink)':'transparent', color:cat===c?'var(--paper)':'var(--ink-soft)', borderColor:cat===c?'var(--ink)':'var(--line)'}}>{c}</button>
            )}
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:18}}>
            {list.map((e,i)=>
              <Reveal key={e.id} delay={(i%6)*.05} className="card" style={{display:'grid', gridTemplateColumns:'120px 1fr auto', gap:28, alignItems:'center', padding:'24px 28px'}}>
                <div style={{textAlign:'center', borderRight:'1.5px solid var(--line)', paddingRight:20}}>
                  <div style={{fontFamily:'var(--display)', fontSize:34, fontWeight:700, color:'var(--maroon)', lineHeight:1}}>{e.date.split(' ')[0]}</div>
                  <div style={{fontFamily:'var(--mono)', fontSize:12, letterSpacing:'.18em', color:'var(--ink-faint)'}}>{e.date.split(' ')[1]}</div>
                </div>
                <div>
                  <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:7, flexWrap:'wrap'}}>
                    <span className="tag" style={{color:'var(--maroon)', borderColor:'var(--maroon)'}}>{e.cat}</span>
                    <span style={{fontFamily:'var(--mono)', fontSize:11.5, color:'var(--ink-faint)', letterSpacing:'.06em'}}>{e.day} · {e.time} · {e.place}</span>
                  </div>
                  <h3 style={{fontSize:25, marginBottom:6}}>{e.title}</h3>
                  <p style={{color:'var(--ink-soft)', fontSize:15, lineHeight:1.55, maxWidth:'60ch'}}>{e.desc}</p>
                </div>
                <div style={{textAlign:'right', display:'flex', flexDirection:'column', gap:10, alignItems:'flex-end'}}>
                  <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--gold-deep)', letterSpacing:'.08em', textTransform:'uppercase'}}>{e.spots}</span>
                  <button className="btn btn--solid" style={{padding:'11px 18px'}} onClick={()=>setModal(e)}>Meld på</button>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
      <SignupModal ev={modal} onClose={()=>setModal(null)}/>
      <style>{`@media(max-width:780px){.card[style*="120px 1fr auto"]{grid-template-columns:80px 1fr!important}.card[style*="120px 1fr auto"]>div:last-child{grid-column:1/-1; flex-direction:row!important; justify-content:space-between; align-items:center; text-align:left!important}}`}</style>
    </div>
  );
}
window.Events = Events;
