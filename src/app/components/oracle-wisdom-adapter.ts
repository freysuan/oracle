import { getWisdom, categories } from '../../imports/oracle-wisdom.js'

export type Category = {
  id: string
  label: string
  color: string
  glow: string
}

export type OracleState = 'idle' | 'awakening' | 'speaking' | 'cooldown'

export function fetchWisdom(categoryId: string): string {
  return getWisdom(categoryId)
}

export function getCategories(): Category[] {
  return categories as Category[]
}

export function getRandomCategory(): Category {
  const cats = getCategories()
  return cats[Math.floor(Math.random() * cats.length)]
}
