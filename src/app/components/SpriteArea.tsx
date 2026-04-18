export type SpriteState = "idle" | "input" | "responding";

function CrystalBall({ state }: { state: SpriteState }) {
  const isRes   = state === "responding";
  const isInput = state === "input";
  const anim = state === "idle"
    ? "ballPulseIdle 3s ease-in-out infinite"
    : state === "input"
    ? "ballPulseInput 2s ease-in-out infinite"
    : "ballPulseResponding 1.1s ease-in-out infinite";
  const g1 = isRes ? "#ffdd99" : isInput ? "#aae8ff" : "#e8d0ff";
  const g2 = isRes ? "#cc6600" : isInput ? "#0088bb" : "#8844cc";
  const g3 = isRes ? "#660a00" : isInput ? "#002244" : "#220044";
  const m1 = isRes ? "rgba(255,160,60,0.7)"  : isInput ? "rgba(0,220,255,0.6)"   : "rgba(170,110,255,0.6)";
  const m2 = isRes ? "rgba(255,210,80,0.5)"  : isInput ? "rgba(80,200,255,0.45)" : "rgba(120,180,255,0.45)";
  const s1 = isRes ? "1.4s" : isInput ? "3s"  : "5.5s";
  const s2 = isRes ? "2s"   : isInput ? "4s"  : "7.5s";

  return (
    <svg width="130" height="148" viewBox="0 0 150 170"
      style={{ overflow:"visible", animation:anim, display:"block" }}>
      <defs>
        <radialGradient id={`ballG-${state}`} cx="34%" cy="27%" r="66%">
          <stop offset="0%"   stopColor={g1}/>
          <stop offset="24%"  stopColor={g2}/>
          <stop offset="60%"  stopColor={g3}/>
          <stop offset="100%" stopColor="#050510"/>
        </radialGradient>
        <radialGradient id={`m1-${state}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={m1}/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </radialGradient>
        <radialGradient id={`m2-${state}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={m2}/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </radialGradient>
        <radialGradient id="standG" cx="50%" cy="20%" r="70%">
          <stop offset="0%"   stopColor="#3a1a66"/>
          <stop offset="100%" stopColor="#150022"/>
        </radialGradient>
        <filter id="bg" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="bgBig" x="-55%" y="-55%" width="210%" height="210%">
          <feGaussianBlur stdDeviation="10" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="bc"><circle cx="75" cy="72" r="53"/></clipPath>
      </defs>

      {/* Shadow */}
      <ellipse cx="75" cy="158" rx="29" ry="6" fill="rgba(0,0,0,0.4)"/>

      {/* Stand */}
      <rect x="58" y="137" width="34" height="23" rx="3" fill="url(#standG)"/>
      <rect x="51" y="152" width="48" height="9"  rx="3" fill="url(#standG)"/>

      {/* Stand gem */}
      <rect x="68" y="143" width="14" height="6" rx="1"
        fill={isRes ? "#cc6600" : isInput ? "#0088bb" : "#6633aa"}
        style={{ filter:`drop-shadow(0 0 4px ${isRes ? "#ff9900" : isInput ? "#00ccff" : "#9966cc"})` }}/>

      {/* Outer glow */}
      <circle cx="75" cy="72" r="62"
        fill={isRes ? "rgba(255,120,20,0.1)" : isInput ? "rgba(0,200,255,0.08)" : "rgba(130,70,220,0.08)"}
        filter="url(#bgBig)"/>

      {/* Main ball */}
      <circle cx="75" cy="72" r="53" fill={`url(#ballG-${state})`} filter="url(#bg)"/>

      {/* Orbs inside clipped area */}
      <g clipPath="url(#bc)">
        <g style={{ transformOrigin:"75px 72px", animation:`orbCW ${s1} linear infinite` }}>
          <ellipse cx="75" cy="72" rx="40" ry="18" fill={`url(#m1-${state})`} opacity="0.62"/>
          <ellipse cx="75" cy="72" rx="20" ry="38" fill={`url(#m1-${state})`} opacity="0.38"/>
        </g>
        <g style={{ transformOrigin:"75px 72px", animation:`orbCCW ${s2} linear infinite` }}>
          <ellipse cx="75" cy="72" rx="35" ry="14" fill={`url(#m2-${state})`} opacity="0.52"/>
          <ellipse cx="75" cy="72" rx="16" ry="33" fill={`url(#m2-${state})`} opacity="0.32"/>
        </g>
        {isRes && (
          <>
            <g style={{ transformOrigin:"75px 72px", animation:"orbCW 1s linear infinite" }}>
              <ellipse cx="75" cy="72" rx="26" ry="9" fill="rgba(255,220,100,0.42)"/>
            </g>
            <g style={{ animation:"lightning 3s infinite" }}>
              <polyline points="77,26 64,52 83,52 58,96"
                stroke="#fff8cc" strokeWidth="3.5" fill="none" strokeLinecap="square"/>
              <polyline points="77,26 64,52 83,52 58,96"
                stroke="#ffcc00" strokeWidth="1.8" fill="none" strokeLinecap="square"/>
            </g>
          </>
        )}
      </g>

      {/* Highlights */}
      <ellipse cx="52" cy="46" rx="14" ry="9"  fill="rgba(255,255,255,0.24)"/>
      <ellipse cx="48" cy="44" rx="5"  ry="3.5" fill="rgba(255,255,255,0.41)"/>

      {/* Idle smoke */}
      {state === "idle" && (
        <>
          <ellipse cx="67" cy="17" rx="5" ry="8" fill="rgba(160,100,255,0.2)"
            style={{ animation:"smokeRise 3.2s ease-out infinite" }}/>
          <ellipse cx="83" cy="12" rx="4" ry="7" fill="rgba(160,100,255,0.16)"
            style={{ animation:"smokeRise 3.9s ease-out 1s infinite" }}/>
          <ellipse cx="75" cy="8"  rx="3" ry="5" fill="rgba(160,100,255,0.12)"
            style={{ animation:"smokeRise 4.7s ease-out 1.9s infinite" }}/>
        </>
      )}
    </svg>
  );
}

function OrbitingQuestions() {
  const orbs = [
    { anim:"orbit1 3.4s linear infinite",       c:"#00ddff" },
    { anim:"orbit2 3.4s linear infinite 0.6s",  c:"#aaccff" },
    { anim:"orbit3 3.4s linear infinite 1.2s",  c:"#88aaff" },
  ];
  return (
    <>
      {orbs.map((q, i) => (
        <div key={i} style={{
          position:"absolute", top:"50%", left:"50%",
          marginTop:-10, marginLeft:-8,
          animation:q.anim,
          fontFamily:"'Press Start 2P',monospace",
          fontSize:12,
          color:q.c,
          textShadow:`0 0 8px ${q.c}`,
          pointerEvents:"none",
        }}>?</div>
      ))}
    </>
  );
}

function SparkleField() {
  const defs = [
    { anim:"sparkle1 1.7s ease-in-out infinite",       c:"#ffcc00" },
    { anim:"sparkle2 1.9s ease-in-out infinite 0.2s",  c:"#ff79c6" },
    { anim:"sparkle3 1.6s ease-in-out infinite 0.4s",  c:"#9966cc" },
    { anim:"sparkle4 2.1s ease-in-out infinite 0.1s",  c:"#ffcc00" },
    { anim:"sparkle5 1.8s ease-in-out infinite 0.5s",  c:"#00ccff" },
    { anim:"sparkle6 2.0s ease-in-out infinite 0.3s",  c:"#ff79c6" },
    { anim:"sparkle7 1.5s ease-in-out infinite 0.7s",  c:"#aaffcc" },
    { anim:"sparkle8 1.9s ease-in-out infinite 0.6s",  c:"#9966cc" },
  ];
  return (
    <>
      {defs.map((s, i) => (
        <div key={i} style={{
          position:"absolute", top:"50%", left:"50%",
          marginTop:-4, marginLeft:-4,
          animation:s.anim,
          pointerEvents:"none",
        }}>
          <svg width="8" height="8" viewBox="0 0 8 8">
            <rect x="3" y="0" width="2" height="8" fill={s.c}/>
            <rect x="0" y="3" width="8" height="2" fill={s.c}/>
          </svg>
        </div>
      ))}
    </>
  );
}

export function SpriteArea({ state, compact = false }: { state: SpriteState; compact?: boolean }) {
  return (
    <div style={{
      position:"relative",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      width:  compact ? 110 : 175,
      height: compact ? 110 : 175,
      transition:"width 0.4s ease, height 0.4s ease",
    }}>
      {state === "input"      && <OrbitingQuestions />}
      {state === "responding" && <SparkleField />}
      <div style={{
        transform: compact ? "scale(0.65)" : "scale(1)",
        transformOrigin:"center center",
        transition:"transform 0.4s ease",
      }}>
        <CrystalBall state={state} />
      </div>
    </div>
  );
}
