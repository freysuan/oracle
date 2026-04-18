import { OracleState } from './oracle-wisdom-adapter'

type Props = {
  state: OracleState
  categoryColor: string
}

export default function SpriteArea({ state, categoryColor }: Props) {
  const isActive = state === 'awakening' || state === 'speaking'
  const isCooldown = state === 'cooldown'

  return (
    <div className="sprite-container" style={{ '--oracle-color': categoryColor } as React.CSSProperties}>
      <div className={`oracle-sprite ${isActive ? 'animate-float' : ''} ${state === 'awakening' ? 'awakening' : ''}`}>
        {/* Oracle Eye */}
        <div className="oracle-eye-outer" style={{ borderColor: categoryColor, boxShadow: `0 0 20px ${categoryColor}, 0 0 40px ${categoryColor}44` }}>
          <div className={`oracle-eye-inner ${isActive ? 'eye-open' : 'eye-closed'}`} style={{ background: isActive ? categoryColor : '#111' }}>
            {isActive && (
              <div className="oracle-pupil" />
            )}
          </div>
        </div>

        {/* Energy rings */}
        {isActive && (
          <>
            <div className="energy-ring ring-1" style={{ borderColor: categoryColor }} />
            <div className="energy-ring ring-2" style={{ borderColor: categoryColor }} />
            <div className="energy-ring ring-3" style={{ borderColor: categoryColor }} />
          </>
        )}

        {/* Particles */}
        {isActive && (
          <div className="particles">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`particle particle-${i + 1}`} style={{ background: categoryColor }} />
            ))}
          </div>
        )}

        {/* Idle / cooldown state */}
        {!isActive && (
          <div className="sprite-idle-glow" style={{ background: isCooldown ? '#ff2266' : '#22004466' }} />
        )}
      </div>

      {/* Label */}
      <div className="sprite-label font-pixel text-xs mt-3" style={{ color: isActive ? categoryColor : '#444', textShadow: isActive ? `0 0 10px ${categoryColor}` : 'none' }}>
        {state === 'idle' && '— DORMANT —'}
        {state === 'awakening' && '◈ AWAKENING ◈'}
        {state === 'speaking' && '◈ CHANNELING ◈'}
        {state === 'cooldown' && '— RESTING —'}
      </div>
    </div>
  )
}
