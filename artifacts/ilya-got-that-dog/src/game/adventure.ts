import {
  DOG_POSITIONS, LANDMARKS, SPAWN, distance, isWalkable,
  type Direction, type Point,
} from './world.ts';

export type AdventureState = {
  player: Point;
  facing: Direction;
  found: boolean;
  dialog: { title: string; text: string } | null;
  visited: string[];
  steps: number;
  round: number;
};

export type AdventureAction =
  | { type: 'move'; direction: Direction }
  | { type: 'interact' }
  | { type: 'closeDialog' }
  | { type: 'replay' };

export function initialAdventure(round = 0): AdventureState {
  return {
    player: { ...SPAWN }, facing: 'down', found: false,
    dialog: null, visited: [], steps: 0, round,
  };
}

export function dogForRound(round: number): Point {
  return DOG_POSITIONS[round % DOG_POSITIONS.length];
}

export function nearbyAt(state: AdventureState): { id: string; name: string } | null {
  if (state.found) return null;
  if (distance(state.player, dogForRound(state.round)) <= 1) {
    return { id: 'dog', name: 'Binky the dog' };
  }
  const landmark = LANDMARKS.find((item) => distance(state.player, item) <= 1);
  return landmark ? { id: landmark.id, name: landmark.name } : null;
}

const deltas: Record<Direction, Point> = {
  up: { x: 0, y: -1 }, down: { x: 0, y: 1 },
  left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
};

export function adventureReducer(state: AdventureState, action: AdventureAction): AdventureState {
  if (action.type === 'replay') return initialAdventure(state.round + 1);
  if (action.type === 'closeDialog') return { ...state, dialog: null };
  if (state.found || state.dialog) return state;

  if (action.type === 'move') {
    const delta = deltas[action.direction];
    const next = { x: state.player.x + delta.x, y: state.player.y + delta.y };
    return isWalkable(next.x, next.y)
      ? { ...state, player: next, facing: action.direction, steps: state.steps + 1 }
      : { ...state, facing: action.direction };
  }

  const nearby = nearbyAt(state);
  if (!nearby) return state;
  if (nearby.id === 'dog') return { ...state, found: true };
  const landmark = LANDMARKS.find((item) => item.id === nearby.id)!;
  return {
    ...state,
    dialog: { title: landmark.name, text: landmark.text },
    visited: state.visited.includes(landmark.id) ? state.visited : [...state.visited, landmark.id],
  };
}
