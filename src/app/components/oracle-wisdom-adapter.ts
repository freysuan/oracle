// @ts-ignore
import _wisdom from "../../imports/oracle-wisdom.js";

export interface WisdomEntry { r: string; p: string; }
export type WisdomCategory = "love" | "quests" | "boss" | "destiny";
export const wisdom = _wisdom as Record<WisdomCategory, WisdomEntry[]>;

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
