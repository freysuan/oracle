import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  accentColor: string
}

export default function Cabinet({ children, accentColor }: Props) {
  return (
    <div className="cabinet-wrapper">
      {/* Ambient glow behind cabinet */}
      <div
        className="cabinet-ambient"
        style={{ background: `radial-gradient(ellipse at center, ${accentColor}22 0%, transparent 70%)` }}
      />

      <div className="cabinet-body" style={{ '--accent': accentColor } as React.CSSProperties}>
        {/* Top marquee */}
        <div className="cabinet-marquee" style={{ borderColor: `${accentColor}66`, boxShadow: `0 0 20px ${accentColor}44` }}>
          <div className="marquee-title font-pixel" style={{ color: accentColor, textShadow: `0 0 10px ${accentColor}, 0 0 20px ${accentColor}88` }}>
            ✦ ORACLE MACHINE ✦
          </div>
          <div className="marquee-subtitle font-pixel" style={{ color: `${accentColor}88` }}>
            ASK AND THE VOID SHALL ANSWER
          </div>
        </div>

        {/* Cabinet main body */}
        <div className="cabinet-main">
          {/* Left side panel decoration */}
          <div className="side-panel left-panel" style={{ background: `linear-gradient(to bottom, ${accentColor}11, transparent, ${accentColor}11)` }}>
            <div className="side-stripe" style={{ background: accentColor }} />
          </div>

          {/* Center content */}
          <div className="cabinet-center">
            {children}
          </div>

          {/* Right side panel decoration */}
          <div className="side-panel right-panel" style={{ background: `linear-gradient(to bottom, ${accentColor}11, transparent, ${accentColor}11)` }}>
            <div className="side-stripe" style={{ background: accentColor }} />
          </div>
        </div>

        {/* Bottom base */}
        <div className="cabinet-base" style={{ borderColor: `${accentColor}44` }}>
          <div className="base-lights">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="base-light"
                style={{
                  background: accentColor,
                  boxShadow: `0 0 6px ${accentColor}`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
          <div className="font-pixel text-xs base-text" style={{ color: `${accentColor}55` }}>
            © ORACLE INDUSTRIES 1984
          </div>
        </div>
      </div>
    </div>
  )
}
