import assert from 'node:assert/strict';
import test from 'node:test';
import {
  adventureReducer, dogForRound, initialAdventure, nearbyAt,
  type AdventureAction, type AdventureState,
} from '../src/game/adventure.ts';
import {
  DOG_POSITIONS, LANDMARKS, SPAWN, WORLD_COLS, WORLD_ROWS, distance,
  isWalkable, terrainAt, type Direction, type Point,
} from '../src/game/world.ts';

const directions: Array<[Direction, number, number]> = [
  ['up', 0, -1], ['down', 0, 1], ['left', -1, 0], ['right', 1, 0],
];

function routeTo(target: Point): Direction[] {
  const queue = [{ point: SPAWN, route: [] as Direction[] }];
  const seen = new Set([`${SPAWN.x},${SPAWN.y}`]);
  for (let index = 0; index < queue.length; index++) {
    const { point, route } = queue[index];
    if (distance(point, target) <= 1) return route;
    for (const [direction, dx, dy] of directions) {
      const next = { x: point.x + dx, y: point.y + dy };
      const key = `${next.x},${next.y}`;
      if (seen.has(key) || !isWalkable(next.x, next.y)) continue;
      seen.add(key);
      queue.push({ point: next, route: [...route, direction] });
    }
  }
  assert.fail(`No route to ${JSON.stringify(target)}`);
}

function walk(state: AdventureState, route: Direction[]): AdventureState {
  return route.reduce((current, direction) =>
    adventureReducer(current, { type: 'move', direction }), state);
}

test('the world is small, bounded, and the spawn is walkable', () => {
  assert.equal(WORLD_COLS, 18);
  assert.equal(WORLD_ROWS, 14);
  assert.ok(isWalkable(SPAWN.x, SPAWN.y));
  for (const [x, y] of [[-1, 3], [18, 3], [3, -1], [3, 14], [2.5, 4]]) {
    assert.equal(isWalkable(x, y), false);
  }
});

test('movement cannot pass through trees, water, landmarks or world bounds', () => {
  for (let y = 0; y < WORLD_ROWS; y++) {
    for (let x = 0; x < WORLD_COLS; x++) {
      if (!isWalkable(x, y)) continue;
      for (const [direction, dx, dy] of directions) {
        const state = { ...initialAdventure(), player: { x, y } };
        const next = adventureReducer(state, { type: 'move', direction });
        const allowed = isWalkable(x + dx, y + dy);
        assert.deepEqual(next.player, allowed ? { x: x + dx, y: y + dy } : { x, y });
        assert.equal(next.steps, allowed ? 1 : 0);
        assert.equal(next.facing, direction);
      }
    }
  }
  assert.equal(terrainAt(3, 4), 'water');
});

test('every landmark is reachable and shows its real personalized dialogue', () => {
  for (const landmark of LANDMARKS) {
    const state = walk(initialAdventure(), routeTo(landmark));
    assert.equal(nearbyAt(state)?.id, landmark.id);
    const opened = adventureReducer(state, { type: 'interact' });
    assert.deepEqual(opened.dialog, { title: landmark.name, text: landmark.text });
    assert.ok(opened.visited.includes(landmark.id));
    const closed = adventureReducer(opened, { type: 'closeDialog' });
    const again = adventureReducer(closed, { type: 'interact' });
    assert.equal(again.visited.filter((id) => id === landmark.id).length, 1);
  }
});

test('distant interaction cannot win or open a landmark', () => {
  const state = initialAdventure();
  assert.equal(nearbyAt(state), null);
  assert.strictEqual(adventureReducer(state, { type: 'interact' }), state);
});

test('all Binky hiding spots are reachable; arriving alone does not win', () => {
  DOG_POSITIONS.forEach((dog, round) => {
    assert.ok(isWalkable(dog.x, dog.y));
    const state = walk(initialAdventure(round), routeTo(dog));
    assert.equal(state.found, false);
    assert.equal(nearbyAt(state)?.id, 'dog');
    const won = adventureReducer(state, { type: 'interact' });
    assert.equal(won.found, true);
    assert.equal(won.dialog, null);
  });
});

test('dialogs and the ending freeze movement and interactions', () => {
  const initial = initialAdventure();
  for (const state of [
    { ...initial, found: true },
    { ...initial, dialog: { title: 'hello', text: 'ello' } },
  ]) {
    for (const action of [
      { type: 'move', direction: 'right' }, { type: 'interact' },
    ] as AdventureAction[]) {
      assert.strictEqual(adventureReducer(state, action), state);
    }
  }
});

test('replay clears dialogue, discovery, position, and win state, and moves Binky', () => {
  let state = {
    ...initialAdventure(), player: { x: 14, y: 3 }, found: true,
    visited: ['bird'], steps: 30, dialog: { title: 'hello', text: 'ello' },
  };
  for (let round = 1; round <= 6; round++) {
    const previousDog = dogForRound(state.round);
    const next = adventureReducer(state, { type: 'replay' });
    assert.deepEqual(next, initialAdventure(round));
    assert.notDeepEqual(dogForRound(next.round), previousDog);
    state = { ...next, found: true, dialog: { title: 'hello', text: 'ello' } };
  }
});
