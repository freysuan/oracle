import { useState, useEffect } from 'react'
import { OracleState } from './oracle-wisdom-adapter'

type Props = {
  message: string
  state: OracleState
  categoryColor: string
  categoryLabel: string | null
}

export default function Screen({ message, state, categoryColor, categoryLabel }: Props) {
  const [displayed, setDisplayed] = useState('')
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (state === 'speaking' && message) {
      setDisplayed('')
      setCharIndex(0)
    }
  }, [message, state])

  useEffect(() => {
    if (state !== 'speaking' || !message) return
    if (charIndex >= message.length) return

    const delay = message[charIndex] === '\n' ? 80 : 40
    const timer = setTimeout(() => {
      setDisplayed((prev) => prev + message[charIndex])
      setCharIndex((i) => i + 1)
    }, delay)

    return () => clearTimeout(timer)
  }, [charIndex, message, state])

  const showCursor = state === 'speaking' && charIndex < message.length

  return (
    <div className="screen-outer">
      {/* CRT bezel */}
      <div className="screen-bezel">
        {/* Scanlines overlay */}
        <div className="scanlines" />

        {/* Screen content */}
        <div
          className="screen-content"
          style={{ '--screen-color': categoryColor } as React.CSSProperties}
        >
          {state === 'idle' && (
            <div className="screen-idle">
              <div className="font-pixel text-xs" style={{ color: '#00ff8844' }}>
                ▸ INSERT COIN
              </div>
              <div className="font-pixel text-xs mt-2 animate-blink" style={{ color: '#00ff8822' }}>
                SELECT CATEGORY
              </div>
              <div className="font-pixel text-xs mt-2" style={{ color: '#00ff8822' }}>
                PRESS ASK
              </div>
            </div>
          )}

          {state === 'awakening' && (
            <div className="screen-awakening font-pixel">
              <div className="awakening-text" style={{ color: categoryColor }}>
                {'> ACCESSING...'.split('').map((c, i) => (
                  <span key={i} style={{ animationDelay: `${i * 0.05}s` }}>{c}</span>
                ))}
              </div>
              <div className="mt-2" style={{ color: `${categoryColor}88` }}>
                {'QUERYING THE VOID'.split('').map((c, i) => (
                  <span key={i} style={{ animationDelay: `${i * 0.03 + 0.5}s` }}>{c}</span>
                ))}
              </div>
            </div>
          )}

          {(state === 'speaking' || state === 'cooldown') && message && (
            <div className="screen-message">
              {categoryLabel && (
                <div className="font-pixel text-xs mb-3" style={{ color: `${categoryColor}99` }}>
                  ▸ {categoryLabel} ORACLE
                </div>
              )}
              <div
                className="font-pixel oracle-text"
                style={{ color: categoryColor, textShadow: `0 0 8px ${categoryColor}` }}
              >
                {displayed.split('\n').map((line, i) => (
                  <div key={i} className="oracle-line">{line}</div>
                ))}
                {showCursor && <span className="oracle-cursor animate-blink">█</span>}
              </div>
            </div>
          )}
        </div>

        {/* CRT reflection */}
        <div className="crt-reflection" />

        {/* Power LED */}
        <div
          className="power-led"
          style={{
            background: state === 'idle' ? '#00ff88' : categoryColor,
            boxShadow: `0 0 6px ${state === 'idle' ? '#00ff88' : categoryColor}`,
          }}
        />
      </div>
    </div>
  )
}
