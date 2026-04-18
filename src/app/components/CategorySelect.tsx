import { Category } from './oracle-wisdom-adapter'

type Props = {
  categories: Category[]
  selected: string | null
  onSelect: (id: string) => void
  disabled: boolean
}

export default function CategorySelect({ categories, selected, onSelect, disabled }: Props) {
  return (
    <div className="category-grid">
      {categories.map((cat) => {
        const isSelected = selected === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => !disabled && onSelect(cat.id)}
            disabled={disabled}
            className={`arcade-btn font-pixel ${isSelected ? 'selected' : ''}`}
            style={{
              '--btn-color': cat.color,
              '--btn-glow': cat.glow,
              borderColor: isSelected ? cat.color : '#333',
              color: isSelected ? cat.color : '#666',
              boxShadow: isSelected
                ? `0 0 12px ${cat.glow}, inset 0 0 12px ${cat.glow}33`
                : 'none',
              background: isSelected ? `${cat.color}11` : '#0a0015',
            } as React.CSSProperties}
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
