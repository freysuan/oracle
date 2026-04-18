import { useState, useCallback } from 'react'
import Cabinet from './components/Cabinet'
import Screen from './components/Screen'
import SpriteArea from './components/SpriteArea'
import CategorySelect from './components/CategorySelect'
import { fetchWisdom, getCategories, OracleState } from './components/oracle-wisdom-adapter'

const DEFAULT_COLOR = '#00ff88'

export default function App() {
  const categories = getCategories()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [oracleState, setOracleState] = useState<OracleState>('idle')
  const [message, setMessage] = useState('')
  const [coins, setCoins] = useState(3)

  const selectedCat = categories.find((c) => c.id === selectedCategory)
  const accentColor = selectedCat?.color ?? DEFAULT_COLOR

  const handleAsk = useCallback(() => {
    if (!selectedCategory || oracleState !== 'idle' || coins <= 0) return

    setCoins((c) => c - 1)
    setOracleState('awakening')

    const wisdom = fetchWisdom(selectedCategory)

    setTimeout(() => {
      setMessage(wisdom)
      setOracleState('speaking')
    }, 2200)

    const msgLength = wisdom.replace(/\n/g, '').length
    const speakDuration = 2200 + msgLength * 45 + 800

    setTimeout(() => {
      setOracleState('cooldown')
    }, speakDuration)

    setTimeout(() => {
      setOracleState('idle')
    }, speakDuration + 2500)
  }, [selectedCategory, oracleState, coins])

  const handleInsertCoin = () => {
    setCoins((c) => Math.min(c + 1, 9))
  }

  const isAsking = oracleState !== 'idle'
  const canAsk = selectedCategory !== null && !isAsking && coins > 0

  return (
    <div className="app-root">
      {/* Stars background */}
      <div className="stars-bg" />

      <Cabinet accentColor={accentColor}>
        {/* Screen area */}
        <Screen
          message={message}
          state={oracleState}
          categoryColor={accentColor}
          categoryLabel={selectedCat?.label ?? null}
        />

        {/* Sprite + controls row */}
        <div className="controls-row">
          {/* Oracle sprite */}
          <SpriteArea state={oracleState} categoryColor={accentColor} />

          {/* Category selector + ask button */}
          <div className="controls-right">
            <div className="font-pixel controls-label" style={{ color: `${accentColor}88` }}>
              SELECT CATEGORY
            </div>
            <CategorySelect
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              disabled={isAsking}
            />

            {/* Ask button */}
            <button
              onClick={handleAsk}
              disabled={!canAsk}
              className={`ask-btn font-pixel ${canAsk ? 'ask-btn-active' : 'ask-btn-disabled'}`}
              style={canAsk ? {
                borderColor: accentColor,
                color: accentColor,
                boxShadow: `0 0 20px ${accentColor}88, inset 0 0 20px ${accentColor}22`,
                background: `${accentColor}11`,
              } : {}}
            >
              {oracleState === 'awakening' && '◈ CHANNELING...'}
              {oracleState === 'speaking' && '◈ SPEAKING...'}
              {oracleState === 'cooldown' && '◈ RECOVERING...'}
              {oracleState === 'idle' && (coins === 0 ? 'NO COINS' : '▶ ASK THE ORACLE')}
            </button>
          </div>
        </div>

        {/* Coin tray */}
        <div className="coin-tray">
          <button onClick={handleInsertCoin} className="coin-btn font-pixel" style={{ color: '#ffcc00', borderColor: '#ffcc0066' }}>
            + INSERT COIN
          </button>
          <div className="coin-display font-pixel" style={{ color: '#ffcc00' }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} style={{ opacity: i < coins ? 1 : 0.15 }}>●</span>
            ))}
          </div>
        </div>
      </Cabinet>

      {/* Version tag */}
      <div className="version-tag font-pixel">v1.0 — ORACLE MACHINE</div>
    </div>
  )
}
