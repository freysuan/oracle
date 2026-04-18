import { useState, useRef, useCallback, useEffect } from "react";
import Cabinet from "./components/Cabinet";
import { SpriteArea, SpriteState } from "./components/SpriteArea";
import CategorySelect from "./components/CategorySelect";
import { wisdom, WisdomCategory, WisdomEntry, shuffle } from "./components/oracle-wisdom-adapter";
import { useSound } from "./hooks/useSound";

type AppState = "idle" | "coinDrop" | "categories" | "responding" | "done";

// 60 background stars with deterministic positions
const BG_STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: (i * 137.508) % 100,
  y: (i * 97.34)   % 100,
  delay: (i * 0.3) % 5,
}));

// ── Inline Screen ──────────────────────────────────────────────────────────────
type ScreenProps = {
  appState: AppState;
  displayedBody: string;
  displayedProphecy: string;
  bodyDone: boolean;
  prophecyDone: boolean;
  showWarmUp: boolean;
  onSelectCategory: (id: string) => void;
  onSkip: () => void;
};

function Screen({
  appState, displayedBody, displayedProphecy,
  bodyDone, prophecyDone, showWarmUp,
  onSelectCategory, onSkip,
}: ScreenProps) {
  const spriteState: SpriteState =
    appState === "categories" ? "input"
    : appState === "responding" ? "responding"
    : "idle";

  return (
    <div style={{
      position:"relative",
      margin:"0 12px",
      background:"var(--bg-screen)",
      border:`1px solid var(--border)`,
      borderRadius:6,
      overflow:"hidden",
      animation:"crtFlicker 6s ease-in-out infinite",
      minHeight:340,
    }}>
      {/* CRT overlays */}
      <div className="scanlines"/>
      <div className="moving-scan"/>
      <div className="crt-vignette"/>

      {/* Screen warm-up flash */}
      {showWarmUp && (
        <div style={{
          position:"absolute", inset:0, zIndex:20,
          animation:"screenWarmUp 0.95s ease forwards",
          pointerEvents:"none",
        }}/>
      )}

      {/* Content */}
      <div style={{
        position:"relative", zIndex:5,
        display:"flex", flexDirection:"column",
        alignItems:"center",
        padding:"18px 16px 14px",
        gap:10,
      }}>
        {/* Crystal ball */}
        <SpriteArea state={spriteState} compact={appState === "responding" || appState === "done"}/>

        {/* State-specific content */}
        {appState === "idle" && (
          <div style={{ textAlign:"center", animation:"slideUp 0.4s ease" }}>
            <div className="font-title" style={{
              fontSize:8, color:"var(--accent)",
              animation:"accentGlow 2.5s ease-in-out infinite",
              marginBottom:14, letterSpacing:2,
            }}>
              ✦ THE ORACLE AWAITS ✦
            </div>
            <div className="font-title" style={{
              fontSize:10, letterSpacing:2,
              animation:"blink 1s step-start infinite, coinGlow 2s ease-in-out infinite",
              marginBottom:14,
            }}>
              ► INSERT COIN ◄
            </div>
            <div className="font-vt" style={{
              fontSize:16, color:"var(--accent)",
              letterSpacing:2, marginBottom:2,
            }}>
              LOVE · QUESTS
            </div>
            <div className="font-vt" style={{
              fontSize:16, color:"var(--accent)",
              letterSpacing:2,
            }}>
              BOSS FIGHTS · DESTINY
            </div>
          </div>
        )}

        {appState === "coinDrop" && (
          <div className="font-title" style={{
            fontSize:8, color:"var(--coin-color)",
            animation:"blink 0.4s step-start infinite",
          }}>
            COIN INSERTED...
          </div>
        )}

        {appState === "categories" && (
          <div style={{ animation:"slideUp 0.35s ease", width:"100%" }}>
            <CategorySelect onSelect={onSelectCategory}/>
          </div>
        )}

        {(appState === "responding" || appState === "done") && (
          <div style={{ width:"100%", animation:"slideUp 0.4s ease" }}>
            <div className="font-title" style={{
              fontSize:6, color:"var(--accent)",
              textAlign:"center", marginBottom:10,
              animation:"accentGlow 2.5s ease-in-out infinite",
            }}>
              — THE ORACLE SPEAKS —
            </div>

            {/* Body text box */}
            <div style={{
              background:"rgba(0,0,0,0.45)",
              border:`1px solid var(--border)`,
              borderRadius:4, padding:"10px 12px",
              marginBottom:8, minHeight:60,
            }}>
              <span className="font-vt" style={{ fontSize:18, color:"var(--text-primary)", lineHeight:1.4 }}>
                {displayedBody}
              </span>
              {!bodyDone && (
                <span className="font-vt" style={{
                  fontSize:18, color:"var(--accent)",
                  animation:"blink 0.5s step-start infinite",
                }}>▋</span>
              )}
            </div>

            {/* Prophecy */}
            {(displayedProphecy || bodyDone) && (
              <div style={{
                textAlign:"center", padding:"6px 8px",
                animation:"prophecyReveal 0.5s ease",
              }}>
                <span className="font-vt" style={{
                  fontSize:20,
                  animation:"prophecyGlow 2s ease-in-out infinite",
                }}>
                  {displayedProphecy}
                </span>
                {bodyDone && !prophecyDone && (
                  <span className="font-vt" style={{
                    fontSize:20, color:"var(--text-prophecy)",
                    animation:"blink 0.5s step-start infinite",
                  }}>▋</span>
                )}
              </div>
            )}

            {/* Skip / done button */}
            {appState === "done" ? (
              <button onClick={onSkip} className="font-title" style={{
                display:"block", width:"100%", marginTop:10,
                padding:"8px", fontSize:7, letterSpacing:2,
                color:"var(--accent)", border:`1px solid var(--accent)`,
                borderRadius:4, background:"transparent",
                animation:"accentGlow 2s ease-in-out infinite",
                cursor:"pointer",
              }}>
                ✦ CONSULT AGAIN ✦
              </button>
            ) : (
              <button onClick={onSkip} className="font-vt" style={{
                display:"block", width:"100%", marginTop:6,
                padding:"4px", fontSize:14,
                color:"var(--text-primary-dim)", border:"none",
                background:"transparent", cursor:"pointer",
              }}>
                [skip]
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── ControlsBar ────────────────────────────────────────────────────────────────
function ControlsBar({ appState, onInsertCoin }: { appState: AppState; onInsertCoin: () => void }) {
  return (
    <div style={{
      textAlign:"center", padding:"12px 12px 0",
    }}>
      {appState === "idle" && (
        <button onClick={onInsertCoin} className="font-title" style={{
          fontSize:10, color:"var(--coin-color)",
          animation:"coinGlow 1.8s ease-in-out infinite",
          border:`2px solid var(--coin-color)`,
          borderRadius:4,
          background:"rgba(0,0,0,0.3)",
          cursor:"pointer",
          padding:"12px 16px",
          width:"100%",
          letterSpacing:3,
          boxShadow:"0 0 12px rgba(255,215,0,0.25), inset 0 0 8px rgba(255,215,0,0.12)",
        }}>
          ◆ INSERT COIN ◆
        </button>
      )}
      {appState === "coinDrop" && (
        <div className="font-title" style={{
          fontSize:7, color:"var(--accent)",
          animation:"accentGlow 2s ease-in-out infinite",
          padding:"12px 0",
        }}>
          READING THE MISTS...
        </div>
      )}
      {appState === "categories" && (
        <div className="font-title" style={{
          fontSize:7, color:"var(--text-primary-dim)",
          letterSpacing:2, padding:"12px 0",
        }}>
          TAP A CATEGORY TO CONSULT
        </div>
      )}
      {appState === "responding" && (
        <div className="font-title" style={{
          fontSize:7, color:"var(--accent)",
          animation:"accentGlow 2s ease-in-out infinite",
          padding:"12px 0",
        }}>
          READING THE MISTS...
        </div>
      )}
      {appState === "done" && (
        <div className="font-title" style={{
          fontSize:7, color:"var(--text-primary-dim)",
          letterSpacing:2, padding:"12px 0",
        }}>
          ✦ CONSULT AGAIN ✦
        </div>
      )}
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [appState,          setAppState]          = useState<AppState>("idle");
  const [displayedBody,     setDisplayedBody]     = useState("");
  const [displayedProphecy, setDisplayedProphecy] = useState("");
  const [bodyDone,          setBodyDone]          = useState(false);
  const [prophecyDone,      setProphecyDone]      = useState(false);
  const [showWarmUp,        setShowWarmUp]        = useState(false);
  const [coinDrop,          setCoinDrop]          = useState(false);
  const [coinSlotFlashing,  setCoinSlotFlashing]  = useState(false);

  const { muted, toggleMute, playCoin, playWarmUp, playSelect, playType, playChime, playReset } = useSound();

  // Per-category shuffled decks
  const decks = useRef<Record<WisdomCategory, WisdomEntry[]>>({
    love: [], quests: [], boss: [], destiny: [],
  });

  function pickFromDeck(cat: WisdomCategory): WisdomEntry {
    if (decks.current[cat].length === 0) {
      decks.current[cat] = shuffle([...(wisdom[cat] ?? [])]);
    }
    return decks.current[cat].pop()!;
  }

  const typeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runTypewriter = useCallback((entry: WisdomEntry) => {
    let bi = 0;
    let pi = 0;
    setDisplayedBody("");
    setDisplayedProphecy("");
    setBodyDone(false);
    setProphecyDone(false);

    const typeBody = () => {
      if (bi < entry.r.length) {
        bi++;
        setDisplayedBody(entry.r.slice(0, bi));
        if (bi % 2 === 0) playType();
        typeTimer.current = setTimeout(typeBody, 22);
      } else {
        setBodyDone(true);
        playChime();
        typeTimer.current = setTimeout(typeProphecy, 800);
      }
    };

    const typeProphecy = () => {
      if (pi < entry.p.length) {
        pi++;
        setDisplayedProphecy(entry.p.slice(0, pi));
        if (pi % 2 === 0) playType();
        typeTimer.current = setTimeout(typeProphecy, 40);
      } else {
        setProphecyDone(true);
        setAppState("done");
      }
    };

    typeTimer.current = setTimeout(typeBody, 22);
  }, [playType, playChime]);

  const handleInsertCoin = useCallback(() => {
    if (appState !== "idle") return;
    playCoin();
    setCoinDrop(true);
    setTimeout(() => {
      setCoinSlotFlashing(true);
      setTimeout(() => setCoinSlotFlashing(false), 600);
    }, 640);
    setTimeout(() => {
      setCoinDrop(false);
      setShowWarmUp(true);
      playWarmUp();
      setAppState("categories");
      setTimeout(() => setShowWarmUp(false), 950);
    }, 950);
  }, [appState, playCoin, playWarmUp]);

  const handleCategorySelect = useCallback((id: string) => {
    if (appState !== "categories") return;
    const cat = id as WisdomCategory;
    const entry = pickFromDeck(cat);
    playSelect();
    setAppState("responding");
    setTimeout(() => runTypewriter(entry), 400);
  }, [appState, runTypewriter, playSelect]);

  const handleReset = useCallback(() => {
    if (typeTimer.current) clearTimeout(typeTimer.current);
    playReset();
    setDisplayedBody("");
    setDisplayedProphecy("");
    setBodyDone(false);
    setProphecyDone(false);
    setAppState("idle");
  }, [playReset]);

  // Cleanup on unmount
  useEffect(() => () => { if (typeTimer.current) clearTimeout(typeTimer.current); }, []);

  return (
    <div style={{
      minHeight:"100vh",
      background:"radial-gradient(ellipse at 50% 40%, #1a0a2e 0%, #0a0015 60%, #050008 100%)",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      padding:20,
      position:"relative",
      overflow:"hidden",
    }}>
      {/* Mute toggle */}
      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute sound" : "Mute sound"}
        title={muted ? "Unmute" : "Mute"}
        className="font-title"
        style={{
          position:"fixed", top:16, right:16, zIndex:100,
          width:44, height:44,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:16,
          color: muted ? "var(--text-primary-dim)" : "var(--coin-color)",
          background:"rgba(10,0,21,0.6)",
          border:`2px solid ${muted ? "var(--border)" : "var(--coin-color)"}`,
          borderRadius:6,
          cursor:"pointer",
          letterSpacing:0,
          boxShadow: muted ? "none" : "0 0 10px rgba(255,215,0,0.25)",
          transition:"all 0.15s ease",
        }}
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* Background stars */}
      {BG_STARS.map(s => (
        <div key={s.id} style={{
          position:"fixed",
          left:`${s.x}%`,
          top:`${s.y}%`,
          width:2, height:2,
          borderRadius:"50%",
          background:"#fff",
          opacity: 0.06 + 0.05 * (s.id % 4),
          animation:`twinkle ${2.5 + s.delay}s ease-in-out infinite`,
          animationDelay:`${s.delay}s`,
          pointerEvents:"none",
        }}/>
      ))}

      {/* Cabinet wrapper with coin drop overlay */}
      <div style={{ position:"relative" }}>
        {/* Coin drop animation */}
        {coinDrop && (
          <div style={{
            position:"absolute",
            left:30, top:-30,
            transform:"translateX(-50%)",
            zIndex:50, pointerEvents:"none",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="11" fill="#ffd700"
                stroke="#cc9900" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="7" fill="none"
                stroke="#cc9900" strokeWidth="1"/>
              <text x="12" y="16" textAnchor="middle"
                fontFamily="'Press Start 2P',monospace"
                fontSize="8" fill="#cc9900">$</text>
              <animateTransform attributeName="transform" type="translate"
                values="0,0; 0,570" dur="0.82s"
                calcMode="spline" keySplines="0.55 0 0.8 0.8"
                fill="freeze"/>
            </svg>
          </div>
        )}

        <Cabinet isActive={appState !== "idle"} coinSlotFlashing={coinSlotFlashing}>
          <Screen
            appState={appState}
            displayedBody={displayedBody}
            displayedProphecy={displayedProphecy}
            bodyDone={bodyDone}
            prophecyDone={prophecyDone}
            showWarmUp={showWarmUp}
            onSelectCategory={handleCategorySelect}
            onSkip={handleReset}
          />
          <ControlsBar appState={appState} onInsertCoin={handleInsertCoin}/>
        </Cabinet>
      </div>
    </div>
  );
}
