// ============ APP: nav + router + tweaks ============
const NAV = [
  ['hjem','Forside'],['om','Om oss'],['styret','Styret'],
  ['arrangementer','Arrangementer'],['komiteer','Komiteer'],['medlem','Bli medlem'],['kontakt','Kontakt'],
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "light",
  "hero": "segl",
  "font": "cormorant",
  "grain": true
}/*EDITMODE-END*/;

function Nav({ page, go }){
  const [open,setOpen] = useState(false);
  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <div className="nav__brand" onClick={()=>go('hjem')}>
          <Logo size={42}/>
          <div>
            <b>APEIRON</b>
            <small>Filosofi &amp; Etikk · NTNU</small>
          </div>
        </div>
        <nav className={'nav__links'+(open?' open':'')}>
          {NAV.map(([k,l])=>
            <a key={k} className={page===k?'active':''} onClick={()=>{go(k); setOpen(false);}}>{l}</a>
          )}
        </nav>
        <button className="nav__burger" onClick={()=>setOpen(o=>!o)} aria-label="Meny">{open?'✕':'☰'}</button>
      </div>
    </header>
  );
}

function App(){
  const [t,setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page,setPage] = useState(()=> (location.hash||'#hjem').slice(1));

  useEffect(()=>{
    const r = document.documentElement;
    r.setAttribute('data-mode', t.mode);
    r.setAttribute('data-font', t.font);
    r.setAttribute('data-grain', t.grain?'on':'off');
  },[t.mode,t.font,t.grain]);

  const go = (p)=>{ setPage(p); location.hash=p; window.scrollTo({top:0,behavior:'instant'}); };
  useEffect(()=>{
    const onHash=()=>setPage((location.hash||'#hjem').slice(1));
    window.addEventListener('hashchange',onHash); return ()=>window.removeEventListener('hashchange',onHash);
  },[]);

  const Page = ({
    hjem: <Home go={go} hero={t.hero}/>,
    om: <About go={go}/>,
    styret: <Board go={go}/>,
    arrangementer: <Events go={go}/>,
    komiteer: <Committees go={go}/>,
    medlem: <Join go={go}/>,
    kontakt: <Contact go={go}/>,
  })[page] || <Home go={go} hero={t.hero}/>;

  return (
    <>
      <Nav page={page} go={go}/>
      <main>{Page}</main>
      <Footer go={go}/>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Stemning" />
        <TweakRadio label="Modus" value={t.mode}
          options={[{value:'light',label:'Pergament'},{value:'dark',label:'Lesesal'}]}
          onChange={(v)=>setTweak('mode',v)} />
        <TweakToggle label="Papirkorn" value={t.grain} onChange={(v)=>setTweak('grain',v)} />

        <TweakSection label="Forside" />
        <TweakSelect label="Hero-stil" value={t.hero}
          options={[{value:'segl',label:'Segl & wordmark'},{value:'timeglass',label:'Timeglass-motiv'},{value:'sitat',label:'Filosofisk sitat'}]}
          onChange={(v)=>setTweak('hero',v)} />

        <TweakSection label="Typografi" />
        <TweakSelect label="Display-font" value={t.font}
          options={[{value:'cormorant',label:'Cormorant Garamond'},{value:'playfair',label:'Playfair Display'},{value:'dm',label:'DM Serif Display'}]}
          onChange={(v)=>setTweak('font',v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
