// Reusable UI components for GIGAKILLS portfolio.
const { useState, useEffect, useRef, useMemo } = React;

// ---- Top Nav ----
function TopNav({ mode, onSwitchMode, soundOn, setSoundOn }) {
  const isMobile = window.innerWidth <= 768;
  const links = ['Home', 'Projects', 'Dossier', 'Contact'];
  const scrollToSection = (index) => {
    const ids = ['01-home', '02-projects', '03-dossier', '04-contact'];
    const elem = document.getElementById(ids[index]);
    if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 50,
      padding: '14px 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 18,
      background: 'linear-gradient(180deg, rgba(0,0,0,0.88), rgba(0,0,0,0.0))',
      borderBottom: '1px solid var(--panel-border)',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, flexShrink: 0 }}>
        <div className="wordmark" style={{ fontSize: 24, color: 'var(--text)', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>
          GIGAKILLS
        </div>
        <span className="h-mono nav-eyebrow" style={{ borderLeft:'1px solid var(--panel-border)', paddingLeft:12, whiteSpace:'nowrap' }}>
          {mode === 'graveyard' ? 'NODE // GV-REALM' : 'NODE // MX-SECTOR-07'}
        </span>
      </div>
      <nav className="nav-links" style={{ display:'flex', gap: 22 }}>
        {links.map((l, i) => (
          <button key={l} onClick={() => scrollToSection(i)} style={{
            fontFamily:'var(--mono)',
            fontSize: 11, letterSpacing:'0.22em',
            textTransform:'uppercase',
            color: i === 0 ? 'var(--accent)' : 'var(--text-dim)',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: 0,
            position: 'relative',
          }}>
            <span style={{opacity:0.5, marginRight:6}}>{String(i+1).padStart(2,'0')}</span>
            {l}
          </button>
        ))}
      </nav>
      <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink: 0 }}>
        <button className="btn nav-sound" disabled style={{padding:'8px 12px', whiteSpace:'nowrap', opacity:0.5, cursor:'not-allowed'}}>
          <span className="dot" style={{background: 'var(--text-dim)'}}/>
          Enable Sound
        </button>
        {!isMobile && (
          <button className="btn nav-switch" onClick={onSwitchMode} style={{padding:'8px 12px', borderColor:'var(--accent)', color:'var(--accent)', whiteSpace:'nowrap'}}>
            ⌘ Breach
          </button>
        )}
        <div style={{
          width:36, height:36,
          border:'1px solid var(--panel-border)',
          display:'grid', placeItems:'center',
          color:'var(--text-dim)',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M0 2h14M0 7h14M0 12h14" stroke="currentColor" strokeWidth="1.4"/></svg>
        </div>
      </div>
    </header>
  );
}

// ---- Mode selector (bottom dock for desktop) ----
function ModeSelector({ mode, onSelect }) {
  const isMobile = window.innerWidth <= 768;
  if (isMobile) return null;

  const opts = [
    { key:'graveyard', label:'Graveyard Realm', sub:'DARK FANTASY // RPG', accent:'var(--gv-blood)' },
    { key:'matrix',    label:'Matrix Sector',   sub:'CYBER // OPERATOR',  accent:'var(--mx-green)' },
  ];
  return (
    <div className="mode-dock" style={{
      position:'fixed', bottom: 24, left: '50%', transform:'translateX(-50%)',
      zIndex: 40, width: 'auto', display:'flex', gap:12,
    }}>
      <div className="mode-options" style={{display:'flex', flexDirection:'row', gap:12, alignItems:'center'}}>
        {opts.map(o => {
          const active = mode === o.key;
          return (
            <button
              key={o.key}
              onClick={()=>onSelect(o.key)}
              className="panel brackets"
              style={{
                textAlign:'left',
                padding:'12px 14px',
                cursor:'pointer',
                color: active ? o.accent : 'var(--text)',
                borderColor: active ? o.accent : 'var(--panel-border)',
                boxShadow: active ? `0 0 24px ${o.accent}55, inset 0 0 18px ${o.accent}20` : null,
                fontFamily:'inherit',
                position:'relative',
                whiteSpace:'nowrap',
              }}>
              <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:0}}>
                <span className="dot" style={{background:o.accent, opacity: active?1:0.4}}/>
                <div>
                  <div className="h-mono" style={{color: active?o.accent:'var(--text-dim)', fontSize:10}}>{o.sub}</div>
                  <div className="h-display" style={{fontSize:14, color: active?o.accent:'var(--text)', lineHeight:1.2}}>
                    {o.label}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Hero ----
// Future 3D cockpit background will be inserted here:
// Replace the scene-layer canvas or inject via Three.js/Babylon.js on scene-graveyard/scene-matrix
function Hero({ mode, onSwitchMode }) {
  const scrollToProjects = () => {
    const elem = document.getElementById('02-projects');
    if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const scrollToContact = () => {
    const elem = document.getElementById('04-contact');
    if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="01-home" style={{
      minHeight: '100vh',
      paddingTop: 120,
      paddingBottom: 60,
      display: 'flex', alignItems: 'center', justifyContent:'center',
      position: 'relative',
    }}>
      <div className="container hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr', gap:40, width:'100%', paddingLeft: 296 }}>
        <div>
          {/* Wordmark */}
          <div className="wordmark" style={{
            fontSize: 'clamp(96px, 14vw, 220px)',
            lineHeight: 0.86,
            letterSpacing: '-0.01em',
            color: 'var(--text)',
            textShadow: mode === 'matrix'
              ? '0 0 24px rgba(124,255,94,0.35), 0 0 60px rgba(61,240,255,0.18)'
              : '0 4px 0 rgba(0,0,0,0.5), 0 0 60px rgba(138,23,38,0.25)',
            marginBottom: 18,
            position: 'relative',
          }}>
            GIGA<span style={{color:'var(--accent)'}}>KILLS</span>
            <span style={{
              position:'absolute',
              right: 0, top: '-12px',
              fontFamily:'var(--mono)', fontSize: 11, letterSpacing:'0.2em',
              color:'var(--text-dim)', opacity:0.7,
            }}>// RUN_ID 0xA1F</span>
          </div>

          {/* Tagline */}
          <h1 className="h-display" style={{
            fontSize: 'clamp(28px, 3.2vw, 44px)',
            margin: 0, marginBottom: 14,
            color:'var(--text)', maxWidth: 880,
          }}>
            Ushering in the greatest generation of gaming ever
          </h1>
          <p style={{
            fontSize: 18, lineHeight: 1.6,
            color:'var(--text-dim)', maxWidth: 640,
            margin: 0, marginBottom: 32,
            fontFamily: mode==='matrix' ? 'var(--body)' : 'IM Fell English, serif',
            fontStyle: mode==='matrix' ? 'normal' : 'italic',
          }}>
            Once you enter, you'll never leave.
          </p>

          {/* CTAs */}
          <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
            <button className="btn primary" onClick={scrollToProjects}>▶ View Projects</button>
            <button className="btn" disabled style={{opacity:0.5, cursor:'not-allowed'}}>◐ Enable Sound</button>
            <button className="btn" onClick={scrollToContact}>⟡ Services</button>
            {window.innerWidth > 768 && (
              <button className="btn" onClick={onSwitchMode} style={{borderColor:'var(--accent)', color:'var(--accent)'}}>
                ⚡ Red Pill
              </button>
            )}
          </div>

          {/* Skills strip */}
          <div style={{
            marginTop: 48, paddingTop:18,
            borderTop:'1px solid var(--panel-border)',
            display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:24, maxWidth: 720,
          }}>
            {[
              ['ROBLOX STUDIO', ''],
              ['VS CODE', ''],
              ['BLENDER', ''],
              ['UNITY', ''],
            ].map(([k,v])=>(
              <div key={k}>
                <div className="h-display" style={{fontSize:18}}>{k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Video Showcase Panels ----
function VideoShowcase({ mode }) {
  const panels = [
    { id:'obelith-video', title:'Featured', caption:'Obelith', tag:'GAMEPLAY // OBELITH', video: 'Obelith.mp4', link: 'https://www.roblox.com/games/130659708845553/ObelithLite' },
    { id:'xercues-video', title:'Cinematic', caption:'Xercues\' Peak', tag:'INTRO // XERCUES-PEAK', video: 'ZercIntro.mp4', link: 'https://www.roblox.com/games/18238733402/Xercues-Demo' },
  ];
  return (
    <section style={{padding: '40px 0 80px'}}>
      <div className="container">
        <SectionHead eyebrow="// LIVE FEEDS" title="Showcase Channels" mode={mode}/>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
          {panels.map((p, i)=>(
            <div key={p.id} className="panel brackets" style={{padding:0, position:'relative'}}>
              {/* feed header */}
              <div style={{
                display:'flex', justifyContent:'space-between',
                padding:'10px 14px',
                borderBottom:'1px solid var(--panel-border)',
                fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.2em',
                color:'var(--text-dim)',
              }}>
                <span style={{display:'flex', gap:8, alignItems:'center'}}>
                  <span className="dot" style={{background:'var(--text-dim)'}}/> {p.tag}
                </span>
                <span>FEED 0{i+1}</span>
              </div>

              {/* video player */}
              <div style={{position:'relative', aspectRatio:'16/9', background:'#040608', overflow:'hidden'}}>
                <video
                  src={p.video}
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
                  controls
                  muted
                  loop
                />
              </div>

              {/* caption row */}
              <div style={{
                padding:'18px 18px 16px',
                display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:16,
              }}>
                <div>
                  <div className="h-mono" style={{marginBottom:6}}>{p.title}</div>
                  <div className="h-display" style={{fontSize:24}}>{p.caption}</div>
                </div>
                <button className="btn" onClick={() => window.open(p.link, '_blank', 'noopener,noreferrer')}>View →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section header
function SectionHead({ eyebrow, title, mode, after }) {
  return (
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24}}>
      <div>
        <div className="h-mono" style={{marginBottom:8, color:'var(--accent)'}}>{eyebrow}</div>
        <h2 className="h-display" style={{fontSize: 'clamp(36px, 4vw, 56px)', margin:0}}>{title}</h2>
      </div>
      {after}
    </div>
  );
}

// ---- Featured Projects ----
const PROJECTS = [
  {
    name: 'Obelith',
    type: 'Dark Fantasy RPG',
    tags: ['Combat', 'Inventory', 'RPG'],
    blurb: 'A classic dark fantasy open-world MMORPG with unrestricted global PVP & a player-driven dynamic world',
    status: 'LIVE',
    statusColor: '#7cff5e',
    code: 'PRJ-001',
    link: 'https://www.roblox.com/games/130659708845553/ObelithLite',
    thumbnail: 'OB thumbnail.png'
  },
  {
    name: 'Xercues\' Peak',
    type: 'Action RPG',
    tags: ['ARPG', 'Procedurally generated dungeons', 'Extraction style PVP'],
    blurb: 'Xercues\' Peak is a hack and slash extreme action role-playing game. Endless hordes to slaughter, countless secrets to uncover, untold power to gain, and behemoth creatures to cut down.',
    status: 'BETA',
    statusColor: '#ffb454',
    code: 'PRJ-002',
    link: 'https://www.roblox.com/games/18238733402/Xercues-Demo'
  },
  {
    name: 'Seadogs',
    type: 'Pirate Combat',
    tags: ['Pirate combat', 'Ship combat', 'Extraction'],
    blurb: 'Risk-and-reward extraction adventure on the high seas. Deploy ships, engage in naval warfare, survive as a pirate crew.',
    status: 'ALPHA',
    statusColor: '#3df0ff',
    code: 'PRJ-003',
    link: 'https://www.roblox.com/games/113830720475203/SeaDogs-ClosedAlpha'
  },
  {
    name: 'Dev Plugins',
    type: 'Tools & Productivity',
    tags: ['Development plug-ins', 'ADHD tools', 'Productivity apps'],
    blurb: 'Personal apps and plug-ins for workflow optimization and development assistance.',
    status: 'ARCHIVE',
    statusColor: '#8a6f47',
    code: 'PRJ-004',
    video: 'WarRoom.mp4'
  },
];

function FeaturedProjects({ mode }) {
  return (
    <section id="02-projects" style={{padding:'40px 0 80px'}}>
      <div className="container">
        <SectionHead eyebrow="// VAULT_03" title="Featured Projects" mode={mode}
          after={<button className="btn">All projects [12] →</button>} />
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:18}}>
          {PROJECTS.map((p, i) => (
            <article key={p.name} className="panel brackets" style={{
              padding:0, display:'flex', flexDirection:'column',
              transition:'transform 250ms ease, border-color 250ms ease',
              cursor:'pointer',
            }}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
            onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}
            >
              {/* header strip */}
              <div style={{
                display:'flex', justifyContent:'space-between',
                padding:'10px 14px',
                borderBottom:'1px solid var(--panel-border)',
                fontFamily:'var(--mono)', fontSize:9, letterSpacing:'0.2em',
                color:'var(--text-dim)',
              }}>
                <span>{p.code}</span>
                <span style={{display:'flex', alignItems:'center', gap:6}}>
                  <span className="dot" style={{background:p.statusColor}}/>{p.status}
                </span>
              </div>
              {/* thumbnail / media */}
              <div style={{position:'relative', aspectRatio:'4/3', background:'#040608', overflow:'hidden'}}>
                {p.thumbnail ? (
                  <img src={p.thumbnail} style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover'}} alt={p.name}/>
                ) : p.video ? (
                  <video src={p.video} style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover'}} />
                ) : (
                  <div style={{position:'absolute', inset:0, display:'grid', placeItems:'center', color:'var(--text-dim)', fontFamily:'var(--mono)', fontSize:12}}>
                    Coming Soon
                  </div>
                )}
                <div style={{
                  position:'absolute', left:10, bottom:10,
                  fontFamily:'var(--mono)', fontSize:9, letterSpacing:'0.18em',
                  color:'var(--accent)',
                  background:'rgba(0,0,0,0.6)', border:'1px solid var(--panel-border)',
                  padding:'4px 8px',
                }}>{p.type.toUpperCase()}</div>
              </div>
              {/* body */}
              <div style={{padding:'16px 16px 14px', flex:1, display:'flex', flexDirection:'column'}}>
                <h3 className="h-display" style={{fontSize:24, margin:0, marginBottom:6}}>{p.name}</h3>
                <p style={{
                  fontSize:13, lineHeight:1.5,
                  color:'var(--text-dim)', margin:0, marginBottom:14, flex:1,
                  fontFamily: mode==='matrix' ? 'var(--body)' : 'IM Fell English, serif',
                  fontStyle: mode==='matrix' ? 'normal':'italic',
                }}>{p.blurb}</p>
                <div style={{display:'flex', flexWrap:'wrap', gap:6, marginBottom:14}}>
                  {p.tags.map(t=> <span key={t} className="chip" style={{fontSize:9, padding:'3px 7px'}}>{t}</span>)}
                </div>
                <button className="btn" onClick={() => p.link && window.open(p.link, '_blank', 'noopener,noreferrer')} disabled={!p.link} style={{width:'100%', justifyContent:'center', opacity: p.link ? 1 : 0.5, cursor: p.link ? 'pointer' : 'not-allowed'}}>View Project →</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Systems & Tools ----
const SKILL_CATEGORIES = [
  {
    category: 'PLATFORMS & LANGUAGES',
    skills: ['Roblox Studio', 'VS Code', 'Blender', 'Unity', 'Lua', 'Python', 'C++'],
  },
  {
    category: 'GAME SYSTEMS',
    skills: ['Inventory', 'Combat', 'Targeting', 'NPCs', 'Intros', 'DataStores'],
  },
  {
    category: 'PIPELINE & CRAFT',
    skills: ['PCVR', 'Vibe coding', '3D artist', 'Hacker', 'Full stack', 'Engineering', 'Rojo', 'Codex', 'Claude'],
  },
];

function SystemsPanel({ mode }) {
  return (
    <section id="03-dossier" style={{padding:'40px 0 80px'}}>
      <div className="container">
        <SectionHead eyebrow="// DOSSIER" title="Skills & Systems" mode={mode}
          after={<div className="h-mono" style={{textAlign:'right'}}>OPERATOR // GIGAKILLS<br/>CLEARANCE: TIER-3</div>}/>
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:24,
        }}>
          {SKILL_CATEGORIES.map((cat, i) => (
            <div key={cat.category} className="panel" style={{padding:24}}>
              <div className="h-mono" style={{marginBottom:16, color:'var(--accent)', fontSize:'11px', letterSpacing:'0.15em'}}>
                {cat.category}
              </div>
              <div style={{display:'flex', flexWrap:'wrap', gap:10}}>
                {cat.skills.map((skill) => (
                  <span key={skill} className="chip" style={{fontSize:11, padding:'6px 10px', flex: 'none'}}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Contact CTA ----
function ContactCTA({ mode }) {
  const isMobile = window.innerWidth <= 768;
  const links = [
    { name:'Discord', handle:'discord.gg/t4q6Ru55AC', url:'https://discord.gg/t4q6Ru55AC' },
    { name:'Roblox',  handle:'gigakills profile', url:'https://www.roblox.com/users/8842626/profile' },
    { name:'Instagram', handle:'@gigakills', url:'https://www.instagram.com/gigakills?igsh=MWtwbjZwMzRzd2hkZA==' },
  ];
  return (
    <section id="04-contact" style={{padding:'40px 0 80px'}}>
      <div className="container">
        <div className="panel brackets" style={{padding:isMobile?'32px 16px 24px':'56px 56px 48px', position:'relative', overflow:'hidden'}}>
          {/* background mark */}
          <div className="wordmark" style={{
            position:'absolute', right:-30, bottom:-60,
            fontSize: 280, lineHeight:1,
            color:'var(--accent)', opacity:0.06,
            pointerEvents:'none',
          }}>GK</div>
          <div className="h-mono" style={{marginBottom:14, color:'var(--accent)'}}>// HANDSHAKE_OPEN</div>
          <h2 className="h-display" style={{fontSize:isMobile?'28px':'clamp(40px, 5vw, 72px)', margin:0, marginBottom:24, maxWidth:900}}>
            Ready to collaborate?
          </h2>
          <p style={{
            fontSize:isMobile?14:18, color:'var(--accent)', margin:0, marginBottom:32, maxWidth:700,
            fontFamily: mode==='matrix' ? 'var(--body)' : 'IM Fell English, serif',
            fontStyle: mode==='matrix' ? 'normal':'italic',
          }}>
            I show you how deep the rabbit hole goes.
          </p>
          <div style={{
            display:'grid', gridTemplateColumns:isMobile?'1fr':`repeat(${links.length}, 1fr)`,
            border:'1px solid var(--panel-border)',
          }}>
            {links.map((l, i) => (
              <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer" style={{
                padding:isMobile?'14px 12px':'18px',
                borderRight: isMobile ? 'none' : (i < links.length-1 ? '1px solid var(--panel-border)' : 'none'),
                borderBottom: isMobile && i < links.length-1 ? '1px solid var(--panel-border)' : 'none',
                textDecoration:'none',
                color:'var(--text)',
                display:'flex', flexDirection:'column', gap:6,
                background:'rgba(0,0,0,0.3)',
                transition:'background 200ms',
              }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(0,0,0,0.6)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(0,0,0,0.3)'}>
                <span className="h-mono" style={{fontSize:isMobile?9:undefined}}>{l.name}</span>
                <span className="h-display" style={{fontSize:isMobile?13:16}}>{l.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Footer status bar ----
function StatusBar({ mode, soundOn }) {
  const [t, setT] = useState(new Date());
  useEffect(()=>{ const id = setInterval(()=>setT(new Date()), 1000); return ()=>clearInterval(id); },[]);
  const time = t.toISOString().slice(11,19);
  return (
    <>
      <div style={{padding:'20px 0 30px', borderTop:'1px solid var(--panel-border)', marginTop:20}}>
        <div className="container" style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:24}}>
          <div className="h-mono" style={{display:'flex', gap:18, flexWrap:'wrap'}}>
            <span><span className="dot live" style={{marginRight:6}}/>SYSTEM STATUS: ONLINE</span>
            <span style={{color:'var(--text-dim)'}}>CONNECTION: SECURE</span>
            <span style={{color:'var(--text-dim)'}}>USER: GUEST_001</span>
            <span style={{color:'var(--text-dim)'}}>NODE: {mode==='matrix'?'M-07':'GV-03'}</span>
            <span style={{color:'var(--text-dim)'}}>SOUND: MUTE</span>
          </div>
          <div className="h-mono" style={{color:'var(--accent)'}}>{time} UTC</div>
        </div>
        <div className="container" style={{marginTop:14, textAlign:'center'}}>
          <p className="h-mono" style={{
            fontSize:'clamp(14px, 1.4vw, 18px)', margin:0,
            color:'var(--text)', opacity:0.85, letterSpacing:'0.02em',
          }}>
            print("goodbye world")
          </p>
        </div>
      </div>
    </>
  );
}

Object.assign(window, {
  TopNav, ModeSelector, Hero, VideoShowcase, FeaturedProjects, SystemsPanel, ContactCTA, StatusBar
});
