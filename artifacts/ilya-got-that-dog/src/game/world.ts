export const WORLD_COLS = 18;
export const WORLD_ROWS = 14;

export type Direction = 'up' | 'down' | 'left' | 'right';
export type Point = { x: number; y: number };
export type Terrain = 'grass' | 'path' | 'water' | 'tree';
export type Landmark = Point & {
  id: string;
  kind: 'library' | 'bird' | 'food' | 'messages' | 'car' | 'peace' | 'cat';
  name: string;
  text: string;
};

export const SPAWN: Point = { x: 3, y: 11 };
export const DOG_POSITIONS: Point[] = [
  { x: 14, y: 3 },
  { x: 13, y: 11 },
  { x: 5, y: 6 },
];

export const LANDMARKS: Landmark[] = [
  {
    id: 'library', kind: 'library', x: 6, y: 2,
    name: 'La biblioteca',
    text: 'Second-floor study room. Almost no soundproofing.\nYou: lab report. Me: a Zoom call, no headphones, and YouTube at 2× speed.\nSomehow, we’re both locked in.',
  },
  {
    id: 'bird', kind: 'bird', x: 12, y: 4,
    name: 'Binky. The bird.',
    text: 'Squeak. A little head bop. Rap or classical, he respects the playlist. Watch your fingers.',
  },
  {
    id: 'food', kind: 'food', x: 4, y: 8,
    name: 'Thank you for the foods',
    text: 'Your mom. Literally—saved us all.\nAnd thank you for waiting until we returned all your spoons over time.',
  },
  {
    id: 'messages', kind: 'messages', x: 9, y: 11,
    name: 'One unread message',
    text: '09:04 — hello\n12:47 — ello\n15:32 — food?\n18:08 — okie\n21:16 — okokokok',
  },
  {
    id: 'car', kind: 'car', x: 13, y: 9,
    name: 'The grey Model Y',
    text: 'Inside: a crayon drawing of cats, coconut water, and a bag of pistachios.',
  },
  {
    id: 'peace', kind: 'peace', x: 7, y: 4,
    name: 'Silver peace charm',
    text: 'A little silver. A little peace. Good company. That’s the whole plan.',
  },
  {
    id: 'max', kind: 'cat', x: 10, y: 6,
    name: 'Max',
    text: 'The neighborhood ginger cat.',
  },
];

const trees = new Set([
  '11,2', '12,2', '12,3', '13,2',
  '6,5', '6,6', '7,6',
  '14,11', '15,11', '15,10', '2,10', '2,11',
]);

export function terrainAt(x: number, y: number): Terrain {
  if (x <= 0 || y <= 0 || x >= WORLD_COLS - 1 || y >= WORLD_ROWS - 1) return 'tree';
  if (x >= 2 && x <= 4 && y >= 3 && y <= 5) return 'water';
  if (trees.has(`${x},${y}`)) return 'tree';
  if (
    (x === 8 && y >= 2 && y <= 11) ||
    (y === 8 && x >= 3 && x <= 14) ||
    (y === 11 && x >= 3 && x <= 9) ||
    (y === 3 && x >= 6 && x <= 10)
  ) return 'path';
  return 'grass';
}

export function isWalkable(x: number, y: number): boolean {
  if (!Number.isInteger(x) || !Number.isInteger(y)) return false;
  if (x < 0 || y < 0 || x >= WORLD_COLS || y >= WORLD_ROWS) return false;
  const terrain = terrainAt(x, y);
  return terrain !== 'tree' && terrain !== 'water' &&
    !LANDMARKS.some((landmark) => landmark.x === x && landmark.y === y);
}

export function distance(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
