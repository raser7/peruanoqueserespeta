export const themes = ['pink', 'yellow', 'paper', 'lime', 'blue'] as const;
export const rotationInterval = 2 * 60 * 60 * 1000;
export function rotationSlot(now = Date.now()) {
  return Math.floor(now / rotationInterval);
}
export function automaticTheme(position: number): typeof themes[number] {
  return themes[Math.max(0, Math.floor(position)) % themes.length];
}
// A cyclic rotation moves every card and lets all cards take the first position.
export function rotateCards<T>(cards: readonly T[], slot = rotationSlot()): T[] {
  if (cards.length < 2) return [...cards];
  const offset = ((slot % cards.length) + cards.length) % cards.length;
  return [...cards.slice(offset), ...cards.slice(0, offset)];
}
