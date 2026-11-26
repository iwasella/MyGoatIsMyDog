import { useCallback, useState } from 'react';

const hints = [
  "Binky is a dog this time. Look for floppy ears and a little nose.",
  "Slow down and inspect the illustrated scene. Not everything here is just decoration.",
  "Still looking? Binky now has a little glow. Tap the dog, not the bird.",
];

export function useDogHunt() {
  const [found, setFound] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [round, setRound] = useState(0);

  const findDog = useCallback(() => {
    setFound(true);
  }, []);

  const miss = useCallback(() => {
    if (!found) setAttempts((value) => value + 1);
  }, [found]);

  const requestHint = useCallback(() => {
    if (!found) setHintsUsed((value) => Math.min(value + 1, hints.length));
  }, [found]);

  const replay = useCallback(() => {
    setFound(false);
    setAttempts(0);
    setHintsUsed(0);
    setRound((value) => value + 1);
  }, []);

  return {
    found,
    attempts,
    hintsUsed,
    hint: hintsUsed > 0 ? hints[hintsUsed - 1] : null,
    round,
    findDog,
    miss,
    requestHint,
    replay,
  };
}
