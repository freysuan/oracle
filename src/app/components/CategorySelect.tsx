import { useState } from "react";

const CATEGORIES = [
  { id:"love",    label:"LOVE",        icon:"♥", color:"var(--cat-love)",    glow:"rgba(255,121,198,0.6)", tagline:"Hearts & party\nmembers" },
  { id:"quests",  label:"QUESTS",      icon:"⚔", color:"var(--cat-quests)",  glow:"rgba(68,221,255,0.6)",  tagline:"Jobs, goals &\nside-missions" },
  { id:"boss",    label:"BOSS FIGHTS", icon:"☠", color:"var(--cat-boss)",    glow:"rgba(255,102,85,0.6)",  tagline:"Problems & hard\nencounters" },
  { id:"destiny", label:"DESTINY",     icon:"★", color:"var(--cat-destiny)", glow:"rgba(255,215,0,0.6)",   tagline:"Fate, purpose &\nthe long game" },
];

function CategoryCard({ cat, onSelect }: { cat: typeof CATEGORIES[0]; onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={() => onSelect(cat.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display:"flex", flexDirection:"column", alignItems:"center", gap:4,
        padding:"10px 14px",
        border:`1px solid ${cat.color}`,
        borderRadius:6,
        background: hovered ? `rgba(0,0,0,0.5)` : "rgba(0,0,0,0.3)",
        cursor:"pointer",
        animation:"cardPop 0.35s ease",
        transform: pressed ? "scale(0.95)" : hovered ? "scale(1.04)" : "scale(1)",
        transition:"transform 0.12s ease, background 0.15s ease, box-shadow 0.15s ease",
        boxShadow: hovered ? `0 0 12px ${cat.glow}, inset 0 0 8px rgba(0,0,0,0.3)` : "none",
        minWidth:80,
      }}
    >
      <span style={{ fontSize:26, color:cat.color, textShadow: hovered ? `0 0 12px ${cat.glow}` : "none", lineHeight:1 }}>{cat.icon}</span>
      <span className="font-title" style={{ fontSize:8, color:cat.color, letterSpacing:1 }}>{cat.label}</span>
      <span className="font-vt" style={{ fontSize:13, color:"var(--text-primary-dim)", whiteSpace:"pre", textAlign:"center", lineHeight:1.15 }}>{cat.tagline}</span>
    </button>
  );
}

export default function CategorySelect({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
      <div className="font-title" style={{
        fontSize:7,
        color:"var(--accent)",
        animation:"accentGlow 2.5s ease-in-out infinite",
      }}>
        CHOOSE YOUR QUERY
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {CATEGORIES.map(cat => (
          <CategoryCard key={cat.id} cat={cat} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
