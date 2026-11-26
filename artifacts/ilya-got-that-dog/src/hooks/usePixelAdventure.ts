import { useCallback, useEffect, useReducer, useRef } from 'react';
import { adventureReducer, dogForRound, initialAdventure, nearbyAt } from '../game/adventure';
import type { Direction } from '../game/world';

const movementKeys: Record<string, Direction> = {
  ArrowUp: 'up', w: 'up', W: 'up',
  ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
};

export function usePixelAdventure() {
  const [state, dispatch] = useReducer(adventureReducer, undefined, () => initialAdventure());
  const moveTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const move = useCallback((direction: Direction) => dispatch({ type: 'move', direction }), []);
  const interact = useCallback(() => dispatch({ type: 'interact' }), []);
  const closeDialog = useCallback(() => dispatch({ type: 'closeDialog' }), []);
  const stopMoving = useCallback(() => {
    if (moveTimer.current !== null) {
      clearInterval(moveTimer.current);
      moveTimer.current = null;
    }
  }, []);

  const startMoving = useCallback((direction: Direction) => {
    stopMoving();
    move(direction);
    moveTimer.current = setInterval(() => move(direction), 140);
  }, [move, stopMoving]);

  const replay = useCallback(() => {
    stopMoving();
    dispatch({ type: 'replay' });
  }, [stopMoving]);

  useEffect(() => {
    if (state.found || state.dialog) stopMoving();
  }, [state.found, state.dialog, stopMoving]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      const element = event.target instanceof HTMLElement ? event.target : null;
      if (element?.closest('input,textarea,select,[contenteditable="true"]')) return;
      const direction = movementKeys[event.key];
      if (direction) {
        event.preventDefault();
        move(direction);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeDialog();
      } else if (['e', 'E', 'Enter', ' '].includes(event.key)) {
        // Keep normal keyboard activation for focused UI controls.
        if (['Enter', ' '].includes(event.key) && element?.closest('button,a,[role="button"]')) return;
        event.preventDefault();
        if (!event.repeat) {
          if (state.dialog) closeDialog();
          else interact();
        }
      }
    };
    const onVisibility = () => { if (document.hidden) stopMoving(); };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('blur', stopMoving);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('blur', stopMoving);
      document.removeEventListener('visibilitychange', onVisibility);
      stopMoving();
    };
  }, [move, interact, closeDialog, state.dialog, stopMoving]);

  return {
    ...state,
    dog: dogForRound(state.round),
    nearby: nearbyAt(state),
    move, startMoving, stopMoving, interact, closeDialog, replay,
  };
}
