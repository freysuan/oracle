export type CategoryDef = {
  id: string
  label: string
  color: string
  glow: string
}

export declare const categories: CategoryDef[]
export declare function getWisdom(categoryId: string): string
export declare function getAllWisdom(): Record<string, string[]>
