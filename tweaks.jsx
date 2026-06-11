/* Apeiron — Tweaks: fargemodus, aksent, font, tekstur */
const APEIRON_TWEAKS = /*EDITMODE-BEGIN*/{
  "mode": "paper",
  "accent": "gull",
  "display": "cormorant",
  "grain": true,
  "eventsView": "list",
  "fadderLayout": "picker"
}/*EDITMODE-END*/;

const ACCENTS = {
  gull:   { accent: "#d4af37", ink: "#8a6d18" },
  vinrod: { accent: "#76110f", ink: "#76110f" }
};
const DISPLAYS = {
  cormorant: '"Cormorant Garamond", Georgia, serif',
  zilla:     '"Zilla Slab", Georgia, serif',
  spectral:  '"Spectral", Georgia, serif'
};

function ApeironTweaks() {
  const [t, setTweak] = useTweaks(APEIRON_TWEAKS);

  React.useEffect(() => {
    const root = document.documentElement;
    document.body.setAttribute('data-mode', t.mode);
    const a = ACCENTS[t.accent] || ACCENTS.gull;
    root.style.setProperty('--accent', a.accent);
    root.style.setProperty('--accent-ink', t.mode === 'marine' ? '#d4af37' : a.ink);
    root.style.setProperty('--display', DISPLAYS[t.display] || DISPLAYS.cormorant);
    root.style.setProperty('--grain-op', t.grain ? '0.5' : '0');
  }, [t.mode, t.accent, t.display, t.grain]);

  React.useEffect(() => {
    if (window.apeironSetEventsView) window.apeironSetEventsView(t.eventsView);
  }, [t.eventsView]);

  React.useEffect(() => {
    if (window.apeironSetFadderLayout) window.apeironSetFadderLayout(t.fadderLayout);
  }, [t.fadderLayout]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Stemning" />
      <TweakRadio label="Fargemodus" value={t.mode}
        options={[{value:'paper',label:'Pergament'},{value:'marine',label:'Marine'}]}
        onChange={(v) => setTweak('mode', v)} />
      <TweakColor label="Aksentfarge" value={ACCENTS[t.accent].accent}
        options={['#d4af37', '#76110f']}
        onChange={(v) => setTweak('accent', v === '#76110f' ? 'vinrod' : 'gull')} />
      <TweakToggle label="Retro papirtekstur" value={t.grain}
        onChange={(v) => setTweak('grain', v)} />

      <TweakSection label="Typografi" />
      <TweakRadio label="Overskriftsfont" value={t.display}
        options={[{value:'cormorant',label:'Garamond'},{value:'zilla',label:'Slab'},{value:'spectral',label:'Spectral'}]}
        onChange={(v) => setTweak('display', v)} />

      <TweakSection label="Arrangementer" />
      <TweakRadio label="Standardvisning" value={t.eventsView}
        options={[{value:'list',label:'Liste'},{value:'grid',label:'Rutenett'},{value:'calendar',label:'Kalender'}]}
        onChange={(v) => setTweak('eventsView', v)} />

      <TweakSection label="Fadderuke" />
      <TweakRadio label="Visning" value={t.fadderLayout}
        options={[{value:'picker',label:'Dagsvelger'},{value:'accordion',label:'Foldeliste'},{value:'overview',label:'Oversikt'}]}
        onChange={(v) => setTweak('fadderLayout', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<ApeironTweaks />);
