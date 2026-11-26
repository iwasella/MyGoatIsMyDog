import { useEffect, useMemo, useState } from "react";
import type { PointerEvent, MouseEvent, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { WORLD_COLS, WORLD_ROWS, LANDMARKS, terrainAt, type Direction } from "@/game/world";
import { usePixelAdventure } from "@/hooks/usePixelAdventure";
import { TerrainTile, Cottage, Bird, Takeout, Messages, Garden, PeaceStone, Player, Dog, GlossySmiley } from "@/components/world/Sprites";

const T = 16;
const ENDING = "Maybe the real dog was the one you had in you all along bro";

const LANDMARK_ART: Record<string, () => ReactNode> = {
  cottage: Cottage, bird: Bird, takeout: Takeout, messages: Messages, garden: Garden, peace: PeaceStone,
};

export default function Home() {
  const g = usePixelAdventure();
  const reduce = useReducedMotion();
  const [showEnd, setShowEnd] = useState(false);

  useEffect(() => {
    if (!g.found) { setShowEnd(false); return; }
    const t = setTimeout(() => setShowEnd(true), reduce ? 150 : 1400);
    return () => clearTimeout(t);
  }, [g.found, reduce]);

  const tiles = useMemo(() => {
    const out: ReactNode[] = [];
    for (let y = 0; y < WORLD_ROWS; y++)
      for (let x = 0; x < WORLD_COLS; x++)
        out.push(
          <g key={`${x}-${y}`} transform={`translate(${x * T} ${y * T})`} data-terrain={terrainAt(x, y)}>
            <TerrainTile t={terrainAt(x, y)} x={x} y={y} />
          </g>,
        );
    return out;
  }, []);

  const dogDist = Math.abs(g.dog.x - g.player.x) + Math.abs(g.dog.y - g.player.y);
  const dogVisible = g.found || dogDist <= 3;
  const W = WORLD_COLS * T, H = WORLD_ROWS * T;

  const prompt = g.found
    ? "Binky. Found. Absolutely feral."
    : g.nearby
      ? `Press E / Enter or tap the action button: ${g.nearby.name}`
      : dogDist <= 5
        ? "Something nearby is snuffling in the dark."
        : "Walk around. Arrows or WASD. Something wild is loose out here.";

  return (
    <div className="min-h-[100dvh] w-full text-foreground overflow-x-hidden bg-[radial-gradient(ellipse_at_top,#2a1f3a_0%,#0d0b14_60%)]">
      <main className="mx-auto max-w-5xl px-3 sm:px-6 pt-5 pb-10">
        <header className="flex items-end justify-between gap-3">
          <div>
            <p className="font-px text-base sm:text-lg text-[#a7abb8] tracking-wide">a little late-night detour</p>
            <h1 className="font-goth chrome text-5xl sm:text-7xl md:text-8xl leading-[.85]" data-testid="text-title">
              Ilya's Late Walk
            </h1>
            <p className="mt-3 font-px text-lg sm:text-xl text-[#c9ccd6]">Find Binky. No rush, bro.</p>
          </div>
          <GlossySmiley className="smiley w-10 h-10 sm:w-16 sm:h-16 shrink-0 drop-shadow-[3px_4px_0_#000]" />
        </header>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_310px] items-start">
          <section className="relative frame p-1.5 sm:p-2">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="pixel block w-full h-auto"
              role="img"
              aria-label={`Night map. You are at column ${g.player.x}, row ${g.player.y}.`}
              data-testid="world-map"
              data-cols={WORLD_COLS}
              data-rows={WORLD_ROWS}
            >
              {tiles}
              {LANDMARKS.map((l) => {
                const Art = LANDMARK_ART[l.kind];
                const seen = g.visited.includes(l.id);
                return (
                  <g key={l.id} transform={`translate(${l.x * T} ${l.y * T})`} data-testid={`landmark-${l.id}`} data-x={l.x} data-y={l.y} data-kind={l.kind}>
                    <Art />
                    {seen && <rect x="14" y="0" width="2" height="2" fill="#c6ff2e" />}
                  </g>
                );
              })}
              <g
                className="mover"
                style={{ transform: `translate(${g.dog.x * T}px, ${g.dog.y * T}px)`, opacity: dogVisible ? 1 : 0, transition: reduce ? "none" : "opacity .4s, transform 150ms steps(3,end)" }}
                data-testid="sprite-dog"
                data-x={g.dog.x}
                data-y={g.dog.y}
                data-visible={dogVisible}
              >
                <Dog found={g.found} />
              </g>
              <g
                className="mover"
                style={{ transform: `translate(${g.player.x * T}px, ${g.player.y * T}px)` }}
                data-testid="sprite-player"
                data-x={g.player.x}
                data-y={g.player.y}
                data-facing={g.facing}
              >
                <Player facing={g.facing} />
                {g.nearby && !g.found && !g.dialog && (
                  <g className="bob">{[[6, -6, 4, 4, "#c6ff2e"], [7, -5, 2, 1, "#0d0b14"], [7, -3, 2, 1, "#0d0b14"]].map(([x, y, w, h, f], i) => <rect key={i} x={x} y={y} width={w} height={h} fill={f as string} />)}</g>
                )}
              </g>
              <rect width={W} height={H} fill="url(#vig)" pointerEvents="none" />
              <defs>
                <radialGradient id="vig" cx=".5" cy=".5" r=".75">
                  <stop offset=".55" stopColor="#0d0b14" stopOpacity="0" />
                  <stop offset="1" stopColor="#0d0b14" stopOpacity=".75" />
                </radialGradient>
              </defs>
            </svg>

            <AnimatePresence>
              {g.found && !showEnd && (
                <motion.div initial={{ opacity: 0, scale: 1.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 grid place-items-center pointer-events-none">
                  <span className="font-goth text-6xl sm:text-8xl text-[#c6ff2e] [text-shadow:4px_4px_0_#000]">BINKY!</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {g.dialog && (
                <motion.div
                  key={g.dialog.title}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: reduce ? 0 : 0.18 }}
                  role="dialog" aria-live="polite" aria-label={g.dialog.title}
                  className="absolute left-2 right-2 bottom-2 sm:left-6 sm:right-6 sm:bottom-5 frame p-3 sm:p-4"
                  data-testid="dialog-landmark"
                >
                  <h2 className="font-goth text-2xl sm:text-3xl chrome leading-none" data-testid="text-dialog-title">{g.dialog.title}</h2>
                  <p className="mt-1.5 whitespace-pre-line font-px text-xl sm:text-2xl leading-6 text-[#e6e9f2]" data-testid="text-dialog">{g.dialog.text}</p>
                  <div className="mt-2 flex justify-end">
                    <button type="button" onClick={g.closeDialog} data-testid="button-close-dialog"
                      className="font-px text-xl px-3 border-2 border-[#c9ccd6] text-[#c9ccd6] hover:bg-[#c9ccd6] hover:text-[#0d0b14] focus-visible:outline-2 focus-visible:outline-[#c6ff2e]">
                      ok (esc)
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <aside className="grid gap-3">
            <div className="frame p-3 min-h-[76px]" aria-live="polite">
              <p className="font-px text-xl leading-6 text-[#e6e9f2]" data-testid="text-prompt">{prompt}</p>
            </div>
            <div className="frame px-3 py-1 sm:p-3 flex items-center justify-between font-px text-lg text-[#a7abb8]">
              <span>spots wandered</span>
              <span className="text-2xl text-[#c6ff2e]" data-testid="text-visited">{g.visited.length}/{LANDMARKS.length}</span>
            </div>
            <Pad g={g} />
            <p className="hidden lg:block font-px text-lg text-[#6b6f7c] leading-5">arrows / WASD walk. E, Enter or Space to poke at stuff. Esc closes.</p>
          </aside>
        </div>
      </main>

      <AnimatePresence>
        {showEnd && (
          <motion.div
            role="dialog" aria-modal="true" aria-label="Ending"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.6 }}
            className="fixed inset-0 z-50 grid place-items-center bg-[#0d0b14]/95 px-6"
            data-testid="dialog-ending"
          >
            <div className="max-w-2xl text-center">
              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : 0.3, duration: reduce ? 0 : 0.7 }}
                className="font-goth chrome text-5xl sm:text-7xl leading-[.95]" data-testid="text-ending"
              >
                {ENDING}
              </motion.p>
              <motion.button
                type="button" onClick={g.replay} autoFocus data-testid="button-replay" aria-label="Replay"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 1.2 }}
                className="mt-10 inline-flex items-center gap-2 font-px text-2xl px-5 py-1.5 border-2 border-[#c9ccd6] text-[#c9ccd6] hover:bg-[#c9ccd6] hover:text-[#0d0b14] focus-visible:outline-2 focus-visible:outline-[#c6ff2e]"
              >
                <RotateCcw className="h-5 w-5" /> replay
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type G = ReturnType<typeof usePixelAdventure>;

function Pad({ g }: { g: G }) {
  const btn = (d: Direction, Icon: typeof ChevronUp, cls: string) => {
    const down = (e: PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      g.startMoving(d);
    };
    const click = (e: MouseEvent<HTMLButtonElement>) => { if (e.detail === 0) g.move(d); };
    return (
      <button type="button" aria-label={`Walk ${d}`} data-testid={`button-move-${d}`}
        onPointerDown={down} onPointerUp={g.stopMoving} onPointerCancel={g.stopMoving} onLostPointerCapture={g.stopMoving}
        onClick={click} onContextMenu={(e) => e.preventDefault()}
        className={`${cls} grid place-items-center h-14 w-14 bg-[#2a2433] border-2 border-[#8d91a0] text-[#e6e9f2] active:bg-[#c9ccd6] active:text-[#0d0b14] focus-visible:outline-2 focus-visible:outline-[#c6ff2e] shadow-[3px_3px_0_#000]`}>
        <Icon className="h-7 w-7" />
      </button>
    );
  };
  return (
    <div className="dpad frame p-3 flex items-center justify-between gap-3">
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        {btn("up", ChevronUp, "col-start-2 row-start-1")}
        {btn("left", ChevronLeft, "col-start-1 row-start-2")}
        {btn("right", ChevronRight, "col-start-3 row-start-2")}
        {btn("down", ChevronDown, "col-start-2 row-start-3")}
      </div>
      <button type="button" onClick={g.interact} aria-label="Interact" data-testid="button-interact"
        className={`h-20 w-20 rounded-full font-goth text-3xl border-2 border-[#0d0b14] shadow-[3px_3px_0_#000] focus-visible:outline-2 focus-visible:outline-[#c6ff2e] transition-transform active:scale-95 ${g.nearby ? "bg-[#c6ff2e] text-[#0d0b14]" : "bg-[#5b5f6c] text-[#c9ccd6]"}`}>
        poke
      </button>
    </div>
  );
}
