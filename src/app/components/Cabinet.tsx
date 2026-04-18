import { ReactNode } from "react";

const LIGHT_ANIMS = [
  "mLightA", "mLightB", "mLightC", "mLightA",
  "mLightB", "mLightC", "mLightA", "mLightB",
  "mLightC", "mLightA", "mLightB", "mLightC",
];

function MarqueeRow() {
  return (
    <div style={{ display:"flex", justifyContent:"center", gap:10, marginBottom:8 }}>
      {LIGHT_ANIMS.map((anim, i) => (
        <div key={i} style={{
          width:6, height:6, borderRadius:"50%",
          animation:`${anim} 1.6s ease-in-out infinite`,
          animationDelay:`${i * 0.22}s`,
        }}/>
      ))}
    </div>
  );
}

const RAIL_STRIPE = `repeating-linear-gradient(
  90deg,
  rgba(153,102,204,0.35) 0px, rgba(153,102,204,0.35) 4px,
  transparent 4px, transparent 10px
)`;

type Props = {
  children: ReactNode;
  isActive: boolean;
  coinSlotFlashing: boolean;
};

export default function Cabinet({ children, isActive, coinSlotFlashing }: Props) {
  return (
    <div style={{
      width:340,
      background:"var(--bg-cabinet)",
      border:`2px solid var(--border)`,
      borderRadius:8,
      padding:"0 0 12px",
      animation: isActive
        ? "cabinetAuraActive 2s ease-in-out infinite"
        : "cabinetAura 3s ease-in-out infinite",
      position:"relative",
    }}>
      {/* Top rail */}
      <div style={{ height:6, background:RAIL_STRIPE, borderRadius:"6px 6px 0 0", marginBottom:0 }}/>

      {/* Marquee */}
      <div style={{ padding:"10px 12px 8px", textAlign:"center", borderBottom:`1px solid var(--border)` }}>
        <MarqueeRow />
        <div className="font-title" style={{
          fontSize:20, letterSpacing:6,
          color:"var(--accent)",
          animation:"accentGlow 2.5s ease-in-out infinite",
          marginBottom:6,
        }}>
          ORACLE
        </div>
        <div className="font-title" style={{
          fontSize:6, letterSpacing:4,
          color:"var(--accent)",
          marginBottom:8,
        }}>
          8-BIT FORTUNE MACHINE
        </div>
        <MarqueeRow />
      </div>

      {/* Screen area */}
      <div style={{ padding:"12px 0 0" }}>
        {children}
      </div>

      {/* Bottom rail */}
      <div style={{ height:8, background:RAIL_STRIPE, margin:"10px 0 8px" }}/>

      {/* Foot */}
      <div style={{
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        padding:"0 14px",
      }}>
        {/* Coin slot */}
        <div style={{
          width:32, height:7,
          background:"#0a0015",
          border:"1px solid var(--border)",
          borderRadius:3,
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          animation: coinSlotFlashing ? "coinSlotFlash 0.6s ease" : "none",
        }}>
          <span className="font-title" style={{ fontSize:4, color:"var(--border)", letterSpacing:1 }}>SLOT</span>
        </div>

        {/* Speaker grille */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,6px)", gap:3 }}>
          {Array.from({ length:24 }).map((_, i) => (
            <div key={i} style={{ width:3, height:3, borderRadius:"50%", background:"var(--border)" }}/>
          ))}
        </div>

        {/* Copyright */}
        <div className="font-vt" style={{
          fontSize:10, color:"var(--border)",
          textAlign:"center", lineHeight:1.3,
          whiteSpace:"pre",
        }}>{"© 1984 MYSTIC\nARCADE CO."}</div>
      </div>
    </div>
  );
}
