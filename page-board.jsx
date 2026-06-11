// ============ STYRET ============
function Board({ go }){
  const D = window.APEIRON_DATA;
  const [hover,setHover] = useState(-1);
  return (
    <div className="fade-in">
      <PageHead eyebrow="Styret 2026" title="Møt styret"
        intro="Åtte studenter som bruker altfor mye av fritiden sin på at du skal ha det bra. Ta gjerne kontakt — vi svarer på alt fra arrangementsidéer til eksistensiell tvil." />

      <section className="band" style={{paddingTop:64}}>
        <div className="wrap">
          <div className="cardgrid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
            {D.board.map((m,i)=>
              <Reveal key={i} delay={(i%4)*.06} className="card" style={{overflow:'hidden', display:'flex', flexDirection:'column'}}>
                <div onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(-1)} style={{position:'relative'}}>
                  <Ph label={`Portrett · ${m.role}`} style={{aspectRatio:'1/1'}}/>
                  <div style={{position:'absolute', inset:0, background:'var(--maroon)', color:'#f7efda', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', padding:20, gap:8,
                    opacity:hover===i?1:0, transition:'opacity .25s ease'}}>
                    <div style={{fontFamily:'var(--mono)', fontSize:11, letterSpacing:'.16em', textTransform:'uppercase', color:'var(--gold)'}}>Filosofisk forbilde</div>
                    <div style={{fontFamily:'var(--display)', fontStyle:'italic', fontSize:26, lineHeight:1.1}}>{m.philosopher}</div>
                    <a href={'mailto:'+m.email} style={{fontFamily:'var(--mono)', fontSize:12, marginTop:8, borderBottom:'1px solid var(--gold)', paddingBottom:2}}>{m.email}</a>
                  </div>
                </div>
                <div style={{padding:'18px 20px 22px'}}>
                  <div className="eyebrow" style={{color:'var(--maroon)'}}>{m.role}</div>
                  <h3 style={{fontSize:24, margin:'8px 0 2px'}}>{m.name}</h3>
                  <p style={{fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-faint)', letterSpacing:'.08em'}}>{m.year}</p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="band ink" style={{textAlign:'center'}}>
        <div className="wrap" style={{maxWidth:720}}>
          <Eyebrow>Verv hos oss</Eyebrow>
          <h2 style={{fontSize:'clamp(32px,4.4vw,50px)', margin:'14px 0 16px'}}>Lyst til å sitte i styret?</h2>
          <p style={{fontSize:18.5, color:'rgba(247,239,218,.8)', margin:'0 auto 30px', maxWidth:'48ch', lineHeight:1.6}}>Hvert år velges nytt styre på generalforsamlingen i mai. Verv er den raskeste veien til å bli kjent med folk — og den fineste linja på CV-en.</p>
          <a className="btn btn--gold" onClick={()=>go('kontakt')}>Ta kontakt</a>
        </div>
      </section>
      <style>{`@media(max-width:980px){.cardgrid[style*="repeat(4"]{grid-template-columns:1fr 1fr!important}}@media(max-width:560px){.cardgrid[style*="repeat(4"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
window.Board = Board;
