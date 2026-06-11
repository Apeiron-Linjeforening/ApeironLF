// ============ Delte komponenter ============
const { useState, useEffect, useRef } = React;

function Logo({ size=42 }){
  return <img src="assets/apeiron-logo.png" alt="Apeiron" width={size} height={size} style={{borderRadius:'50%'}} />;
}

function Rule(){
  return <div className="rule"><span className="inf">∞</span></div>;
}

function Eyebrow({ children }){ return <div className="eyebrow">{children}</div>; }

function Ph({ label, style, className='' }){
  return <div className={'ph '+className} style={style}><span>{label}</span></div>;
}

// Reveal-on-mount via pure CSS animation (robust; no IntersectionObserver/rAF)
function Reveal({ children, delay=0, as='div', className='', style }){
  const El = as;
  return <El className={'rev '+className} style={{ ...style, animationDelay:delay+'s' }}>{children}</El>;
}

function SecHead({ eyebrow, title, intro, light }){
  return (
    <div className="sec-head">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {intro && <p style={{fontSize:'19px', color:light?'rgba(247,239,218,.82)':'var(--ink-soft)', lineHeight:1.6, maxWidth:'58ch'}}>{intro}</p>}
    </div>
  );
}

// Big decorative hourglass drawn with simple shapes (CSS), used as motif
function Hourglass({ size=120, color='var(--gold)' }){
  return (
    <svg width={size} height={size*1.25} viewBox="0 0 100 125" fill="none" style={{display:'block'}} aria-hidden="true">
      <rect x="14" y="6" width="72" height="7" rx="2" fill={color}/>
      <rect x="14" y="112" width="72" height="7" rx="2" fill={color}/>
      <path d="M24 13 C24 45, 50 52, 50 62 C50 72, 24 79, 24 112" stroke={color} strokeWidth="2.4" fill="none"/>
      <path d="M76 13 C76 45, 50 52, 50 62 C50 72, 76 79, 76 112" stroke={color} strokeWidth="2.4" fill="none"/>
      <path d="M31 100 C31 86, 69 86, 69 100 L69 110 L31 110 Z" fill={color} opacity=".55"/>
      <circle cx="50" cy="62" r="2.4" fill={color}/>
    </svg>
  );
}

function Footer({ go }){
  return (
    <footer className="foot">
      <div className="wrap" style={{display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr', gap:'44px'}}>
        <div>
          <div style={{display:'flex', alignItems:'center', gap:13, marginBottom:18}}>
            <Logo size={48}/>
            <div>
              <b style={{fontFamily:'var(--display)', fontSize:26, letterSpacing:'.06em', display:'block', lineHeight:1}}>APEIRON</b>
              <small style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.18em', color:'rgba(247,239,218,.6)'}}>FILOSOFI &amp; ETIKK · NTNU</small>
            </div>
          </div>
          <p style={{color:'rgba(247,239,218,.66)', maxWidth:'34ch', fontSize:15}}>Γραμμικὴ Ἕνωσις Φιλοσοφίας καὶ Ἠθικῆς — linjeforeningen for filosofi og etikk ved NTNU Dragvoll.</p>
        </div>
        <div>
          <div className="eyebrow" style={{color:'var(--gold)', marginBottom:16}}>Sider</div>
          <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:11}}>
            {[['hjem','Forside'],['om','Om oss'],['styret','Styret'],['arrangementer','Arrangementer'],['komiteer','Komiteer'],['medlem','Bli medlem'],['kontakt','Kontakt']].map(([k,l])=>
              <li key={k}><a onClick={()=>go(k)} style={{color:'rgba(247,239,218,.78)', cursor:'pointer', fontSize:15, fontFamily:'var(--mono)'}}>{l}</a></li>
            )}
          </ul>
        </div>
        <div>
          <div className="eyebrow" style={{color:'var(--gold)', marginBottom:16}}>Hold kontakten</div>
          <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:11, color:'rgba(247,239,218,.78)', fontSize:15, fontFamily:'var(--mono)'}}>
            <li>post@apeiron.no</li>
            <li>@apeiron.ntnu</li>
            <li>Dragvoll, Trondheim</li>
          </ul>
        </div>
      </div>
      <div className="wrap" style={{marginTop:48, paddingTop:24, borderTop:'1px solid rgba(247,239,218,.16)', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12, fontFamily:'var(--mono)', fontSize:11, letterSpacing:'.1em', color:'rgba(247,239,218,.5)'}}>
        <span>© {new Date().getFullYear()} APEIRON LINJEFORENING</span>
        <span>∞ DET GRENSELØSE BEGYNNER HER</span>
      </div>
    </footer>
  );
}

Object.assign(window, { Logo, Rule, Eyebrow, Ph, Reveal, SecHead, Hourglass, Footer });
