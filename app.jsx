// Main app: assembles the GIGAKILLS portfolio, drives mode switching + glitch transition.
const { useState: uS, useEffect: uE, useRef: uR, useMemo: uM, useCallback: uC } = React;

function isLowEndDevice() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallViewport = window.innerWidth <= 768;
  const isSlowConnection = navigator.connection && (navigator.connection.effectiveType === '4g' || navigator.connection.effectiveType === '3g' || navigator.connection.effectiveType === 'slow-2g');
  return isMobile || (isSmallViewport && isSlowConnection);
}

function App() {
  const [mode, setMode] = uS('graveyard');
  const [transitioning, setTransitioning] = uS(false);
  const [soundOn, setSoundOn] = uS(false);

  // Tweaks
  const tweakDefaults = /*EDITMODE-BEGIN*/{
    "showRift": true,
    "scanlines": true,
    "fogIntensity": 1.0,
    "rainDensity": 1.0,
    "mode": "graveyard",
    "palette": "default"
  }/*EDITMODE-END*/;
  const [t, setTweak] = useTweaks(tweakDefaults);

  // sync mode <-> tweaks panel selection
  uE(()=>{
    if (t.mode && t.mode !== mode) doSwitch(t.mode);
    // eslint-disable-next-line
  }, [t.mode]);

  uE(()=>{
    document.body.dataset.mode = mode;
    if (window.__graveyardScene) window.__graveyardScene.setVisible(mode==='graveyard');
    if (window.__matrixScene)    window.__matrixScene.setVisible(mode==='matrix');
  }, [mode]);

  function runBreachAnimation(then) {
    const overlay = document.getElementById('glitchOverlay');
    const breach  = document.getElementById('breachPanel');
    if (!overlay) { then(); return; }
    overlay.classList.add('active');
    document.body.classList.add('transitioning');
    breach.style.display = 'block';

    const uplinkEl = document.getElementById('b-uplink');
    const subEl    = document.getElementById('b-substrate');
    const csEl     = document.getElementById('b-checksum');
    const start = Date.now();
    const id = setInterval(()=>{
      const p = Math.min(1, (Date.now()-start)/1500);
      if (uplinkEl) uplinkEl.textContent = `${(p*100).toFixed(1)}% LOCKED`;
      if (csEl)     csEl.textContent     = '0x' + Math.floor(Math.random()*0xFFFFFFFF).toString(16).toUpperCase().padStart(8,'0');
      if (subEl)    subEl.textContent    = mode==='graveyard' ? 'FANTASY → CYBER' : 'CYBER → FANTASY';
    }, 80);

    setTimeout(()=>{ clearInterval(id); then(); }, 1100);
    setTimeout(()=>{
      overlay.classList.remove('active');
      breach.style.display = 'none';
      document.body.classList.remove('transitioning');
    }, 2000);
  }

  function doSwitch(target) {
    const next = target || (mode === 'graveyard' ? 'matrix' : 'graveyard');
    if (next === mode || transitioning) return;
    if (next === 'matrix' && isLowEndDevice()) {
      console.warn('Matrix mode is not supported on mobile/low-end devices');
      return;
    }
    setTransitioning(true);
    runBreachAnimation(()=>{
      setMode(next);
      setTimeout(()=>setTransitioning(false), 800);
    });
  }

  // Attach 'B' shortcut for breach (disabled on mobile)
  uE(()=>{
    if (isLowEndDevice()) return;
    const onKey = (e)=>{
      if (e.key === 'b' || e.key === 'B') doSwitch();
    };
    window.addEventListener('keydown', onKey);
    return ()=>window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line
  }, [mode, transitioning]);

  return (
    <div data-screen-label="01 GIGAKILLS Landing">
      <TopNav mode={mode} onSwitchMode={()=>{ setTweak('mode', mode==='graveyard'?'matrix':'graveyard'); doSwitch(); }} soundOn={soundOn} setSoundOn={setSoundOn}/>
      <ModeSelector mode={mode} onSelect={(k)=>{ setTweak('mode', k); doSwitch(k); }}/>

      <Hero mode={mode} onSwitchMode={()=>{ setTweak('mode', mode==='graveyard'?'matrix':'graveyard'); doSwitch(); }}/>
      <VideoShowcase mode={mode}/>
      <FeaturedProjects mode={mode}/>
      <SystemsPanel mode={mode}/>
      <ContactCTA mode={mode}/>
      <StatusBar mode={mode} soundOn={soundOn}/>

      <TweaksPanel title="Tweaks">
        {!isLowEndDevice() && (
          <TweakSection title="Reality">
            <TweakRadio
              label="Active mode"
              value={t.mode}
              onChange={(v)=>setTweak('mode', v)}
              options={[
                { value:'graveyard', label:'Graveyard' },
                { value:'matrix',    label:'Matrix' },
              ]}/>
            <TweakButton onClick={()=>doSwitch()}>⚡ Trigger reality breach</TweakButton>
          </TweakSection>
        )}
        <TweakSection title="Atmosphere">
          <TweakToggle label="Scanlines (matrix)" value={t.scanlines} onChange={(v)=>setTweak('scanlines', v)}/>
          <TweakToggle label="Show rift transition" value={t.showRift} onChange={(v)=>setTweak('showRift', v)}/>
          <TweakSlider label="Fog intensity" min={0} max={2} step={0.1} value={t.fogIntensity} onChange={(v)=>setTweak('fogIntensity', v)}/>
          <TweakSlider label="Rain density" min={0.4} max={2} step={0.1} value={t.rainDensity} onChange={(v)=>setTweak('rainDensity', v)}/>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// Apply tweak side-effects to the page
function ApplyTweaks() {
  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
