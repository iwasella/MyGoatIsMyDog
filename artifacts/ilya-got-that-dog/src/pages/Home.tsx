import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Lightbulb, RotateCcw, Crosshair } from "lucide-react";
import { useDogHunt } from "@/hooks/useDogHunt";
import { DecoyArt, DECOY_KINDS, MISS_LINES, type DecoyKind } from "@/components/Decoys";

const BASE = import.meta.env.BASE_URL;

const DOG_SPOTS = [
  { x: 71, y: 63, r: -12 },
  { x: 22, y: 34, r: 9 },
  { x: 48, y: 82, r: -6 },
  { x: 84, y: 22, r: 14 },
  { x: 33, y: 68, r: -16 },
  { x: 58, y: 40, r: 7 },
];

function rng(seed: number) {
  let t = seed * 9301 + 49297;
  return () => {
    t = (t * 9301 + 49297) % 233280;
    return t / 233280;
  };
}

type Decoy = { id: number; kind: DecoyKind; x: number; y: number; size: number; r: number; d: number; z: number };

function buildScene(round: number) {
  const dog = DOG_SPOTS[((round % DOG_SPOTS.length) + DOG_SPOTS.length) % DOG_SPOTS.length];
  const rand = rng(round + 7);
  const items: Decoy[] = [];
  let tries = 0;
  while (items.length < 46 && tries < 900) {
    tries++;
    const x = 4 + rand() * 92;
    const y = 5 + rand() * 90;
    const dx = x - dog.x, dy = (y - dog.y) * 0.8;
    const dist = Math.hypot(dx, dy);
    if (dist < 8) continue;
    if (items.some((o) => Math.hypot(o.x - x, o.y - y) < 7.5)) continue;
    items.push({
      id: items.length,
      kind: DECOY_KINDS[Math.floor(rand() * DECOY_KINDS.length)],
      x, y,
      size: 7 + rand() * 7,
      r: -25 + rand() * 50,
      d: 3 + rand() * 4,
      z: dist < 14 ? 3 : 1,
    });
  }
  return { dog, items };
}

type Pop = { id: number; x: number; y: number; text: string };

const MARQUEE = ["I'LL YUH", "EEL EE YAR", "CREEPER, AWW MAN", "BINKY THE BIRD BITES", "GARDEN OF THE OLIVE NEVER FORGET", "NOW ACCEPTING CHOPIN", "FRIENDS SINCE MIDDLE SCHOOL", "FIND THE DOG"];

export default function Home() {
  const { found, attempts, hintsUsed, hint, round, findDog, miss, requestHint, replay } = useDogHunt();
  const reduce = useReducedMotion();
  const { dog, items } = useMemo(() => buildScene(round), [round]);
  const [pops, setPops] = useState<Pop[]>([]);
  const [shakeKey, setShakeKey] = useState(0);
  const [showReveal, setShowReveal] = useState(false);
  const popId = useRef(0);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!found) { setShowReveal(false); return; }
    const t = setTimeout(() => setShowReveal(true), reduce ? 100 : 1100);
    return () => clearTimeout(t);
  }, [found, reduce]);

  const onSceneTap = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (found) return;
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    const el = (e.target as HTMLElement).closest("[data-kind]") as HTMLElement | null;
    const kind = (el?.dataset.kind ?? "void") as DecoyKind | "void";
    const lines = MISS_LINES[kind];
    const text = lines[Math.floor(Math.random() * lines.length)];
    const id = ++popId.current;
    setPops((p) => [...p.slice(-3), { id, x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100, text }]);
    setTimeout(() => setPops((p) => p.filter((q) => q.id !== id)), 1600);
    setShakeKey((k) => k + 1);
    miss();
  }, [found, miss]);

  const onDog = (e: MouseEvent) => {
    e.stopPropagation();
    if (!found) findDog();
  };

  const quadrant = `${dog.x < 50 ? "left" : "right"} ${dog.y < 50 ? "top" : "bottom"}`;

  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground overflow-x-hidden">
      {/* Marquee */}
      <div className="border-b border-primary/40 bg-primary text-primary-foreground overflow-hidden whitespace-nowrap font-px text-xl leading-7">
        <div className="marquee inline-flex">
          {[0, 1].map((k) => (
            <span key={k} className="inline-flex">
              {MARQUEE.map((m) => <span key={m} className="px-4">{m} <span className="opacity-50">+</span></span>)}
            </span>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-3 sm:px-6 pb-12">
        {/* Header */}
        <header className="relative pt-6 pb-4 sm:pt-10 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-px text-lg text-accent tracking-wide">a personal quest issued by your friend since middle school</p>
            <h1 className="font-goth chrome text-[17vw] leading-[.82] sm:text-8xl md:text-[8.5rem]" data-testid="text-title">
              Ilya's Dog Hunt
            </h1>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-muted-foreground">
              Somewhere in this Affliction-tee fever dream is a dog named <span className="text-foreground font-semibold">Binky</span>.
              Not Binky the bird. Binky the bird bites. This Binky is a dog, and he is hiding from you, Eel ee yar.
            </p>
          </div>
          <div className="flex gap-2 md:flex-col md:items-end">
            <Stat label="taps wasted" value={attempts} testid="text-attempts" />
            <Stat label="hints begged" value={hintsUsed} testid="text-hints" />
            <Stat label="round" value={round + 1} testid="text-round" />
          </div>
        </header>

        {/* Scene */}
        <div key={shakeKey} className={shakeKey && !reduce ? "shake" : ""}>
          <div
            ref={sceneRef}
            onClick={onSceneTap}
            data-testid="scene"
            className="relative w-full aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-sm border-2 border-foreground/80 select-none cursor-crosshair shadow-[8px_8px_0_hsl(var(--accent))]"
            style={{ backgroundImage: `url(${BASE}scene-bg.jpg)`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 screentone pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,.7))] pointer-events-none" />
            <span className="absolute left-3 top-2 font-goth text-2xl sm:text-4xl text-foreground/15 pointer-events-none">Chapter {round + 1}</span>
            <span className="absolute right-3 bottom-2 font-px text-sm sm:text-lg text-primary/60 pointer-events-none">tap the dog. only the dog.</span>

            {/* Hint 2+: quadrant spotlight */}
            {hintsUsed >= 2 && !found && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute pointer-events-none border-2 border-dashed border-primary/70 bg-primary/10"
                style={{ left: dog.x < 50 ? 0 : "50%", top: dog.y < 50 ? 0 : "50%", width: "50%", height: "50%" }}
              />
            )}

            {/* Dog */}
            <button
              type="button"
              onClick={onDog}
              aria-label="something in the scene"
              data-testid="button-dog"
              className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={{ left: `${dog.x}%`, top: `${dog.y}%`, width: "9%", zIndex: 2 }}
            >
              {hintsUsed >= 3 && !found && (
                <span className="hunt-ring absolute left-1/2 top-1/2 w-[190%] aspect-square rounded-full border-4 border-accent pointer-events-none" />
              )}
              <motion.img
                src={`${BASE}binky-dog.png`}
                alt=""
                draggable={false}
                className="w-full h-auto"
                style={{ filter: found ? "none" : "grayscale(.55) brightness(.78) contrast(1.1)" }}
                initial={false}
                animate={found ? { scale: reduce ? 1.4 : [1, 2.6, 2.2], rotate: [dog.r, 0] } : { scale: 1, rotate: dog.r }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </button>

            {/* Decoys */}
            {items.map((o) => (
              <div
                key={`${round}-${o.id}`}
                data-kind={o.kind}
                data-testid={`decoy-${o.id}`}
                className="decoy absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[2px_3px_0_rgba(0,0,0,.8)]"
                style={{ left: `${o.x}%`, top: `${o.y}%`, width: `${o.size}%`, zIndex: o.z, ["--r" as string]: `${o.r}deg`, ["--d" as string]: `${o.d}s`, transform: `translate(-50%,-50%) rotate(${o.r}deg)` }}
              >
                <DecoyArt kind={o.kind} />
              </div>
            ))}

            {/* Miss pops */}
            {pops.map((p) => (
              <div
                key={p.id}
                className="float-up absolute z-20 pointer-events-none max-w-[70%] bg-foreground text-background font-px text-lg sm:text-xl leading-5 px-3 py-1.5 border-2 border-background shadow-[4px_4px_0_hsl(var(--accent))]"
                style={{ left: `${Math.min(80, Math.max(20, p.x))}%`, top: `${p.y}%` }}
              >
                {p.text}
              </div>
            ))}

            {found && !showReveal && (
              <div className="absolute inset-0 z-30 grid place-items-center pointer-events-none">
                <span className="slam font-goth text-6xl sm:text-8xl text-primary [text-shadow:4px_4px_0_#000]">BINKY!!</span>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <section className="mt-6 grid gap-3 md:grid-cols-[1fr_auto] items-start">
          <div className="relative min-h-[84px] border-2 border-foreground/70 bg-card p-4 stitch" data-testid="text-hint">
            <span className="absolute -top-3 left-3 bg-background px-2 font-px text-lg text-accent">field notes</span>
            <AnimatePresence mode="wait">
              <motion.p
                key={hint ?? "none"}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="text-sm sm:text-base"
              >
                {hint ?? "No hints yet. You have known me since middle school. Prove you can find one small dog without help."}
                {hintsUsed >= 2 && !found && <span className="block mt-1 font-px text-lg text-primary">The dashed box is the {quadrant}. Mercy granted.</span>}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="flex gap-2 md:flex-col">
            <button
              type="button"
              onClick={requestHint}
              disabled={found}
              data-testid="button-hint"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-px text-2xl px-5 py-2 border-2 border-foreground shadow-[4px_4px_0_hsl(var(--foreground))] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-transform disabled:opacity-40"
            >
              <Lightbulb className="h-5 w-5" /> {hintsUsed === 0 ? "beg for a hint" : hintsUsed >= 3 ? "more hint pls" : "another hint"}
            </button>
            <button
              type="button"
              onClick={replay}
              data-testid="button-reshuffle"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-transparent text-foreground font-px text-2xl px-5 py-2 border-2 border-foreground/70 hover:bg-foreground/10 active:translate-y-[2px] transition-transform"
            >
              <RotateCcw className="h-5 w-5" /> reshuffle
            </button>
          </div>
        </section>

        <footer className="mt-10 grid gap-4 sm:grid-cols-3 text-sm text-muted-foreground">
          <Note title="Rules">Tap Binky the dog. Tapping a creeper, a parsnip, or Binky the bird counts against you. Binky the bird would count against you anyway.</Note>
          <Note title="Known hazards">Rhinestone crosses. Mall wings. One (1) olive branch from Garden of the Olive that knows what it did.</Note>
          <Note title="Dedication">For I'll Yuh, who now listens to classical music and pretends we did not spend 2009 doing whatever that was.</Note>
        </footer>
      </main>

      <AnimatePresence>{showReveal && <Reveal attempts={attempts} hintsUsed={hintsUsed} onReplay={replay} reduce={!!reduce} />}</AnimatePresence>
    </div>
  );
}

function Stat({ label, value, testid }: { label: string; value: number; testid: string }) {
  return (
    <div className="flex-1 md:flex-none min-w-[86px] border border-foreground/30 px-3 py-1 bg-card">
      <div className="font-px text-3xl leading-none text-primary" data-testid={testid}>{value}</div>
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-foreground/20 pt-3">
      <h3 className="font-goth text-2xl text-foreground">{title}</h3>
      <p className="mt-1">{children}</p>
    </div>
  );
}

const CONFETTI_COLORS = ["#c6ff2e", "#ff3d8b", "#f4f2e6", "#4caf3a", "#9ef6f0"];
const STICKERS = ["I'LL YUH", "EEL EE YAR", "AWW MAN", "WOOF?", "BRAVO (CHOPIN VOICE)", "BIRD-FREE ZONE"];

function Reveal({ attempts, hintsUsed, onReplay, reduce }: { attempts: number; hintsUsed: number; onReplay: () => void; reduce: boolean }) {
  const confetti = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    left: (i * 37) % 100, color: CONFETTI_COLORS[i % CONFETTI_COLORS.length], w: 6 + (i % 4) * 3,
    t: `${3 + (i % 5) * 0.7}s`, delay: `${-(i % 10) * 0.4}s`, x: `${((i % 7) - 3) * 30}px`, rot: `${360 + (i % 6) * 120}deg`, px: i % 3 === 0,
  })), []);
  const verdict = attempts === 0 && hintsUsed === 0
    ? "First try. Zero hints. Suspicious, honestly."
    : `${attempts} wrong ${attempts === 1 ? "tap" : "taps"} and ${hintsUsed} ${hintsUsed === 1 ? "hint" : "hints"}. Still faster than ordering at Garden of the Olive.`;

  return (
    <motion.div
      role="dialog" aria-modal="true" aria-label="You found him"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-background/95"
      data-testid="dialog-reveal"
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {!reduce && confetti.map((c, i) => (
          <span key={i} className="confetti absolute top-0" style={{ left: `${c.left}%`, width: c.w, height: c.px ? c.w : c.w * 2, background: c.color, ["--t" as string]: c.t, ["--delay" as string]: c.delay, ["--x" as string]: c.x, ["--rot" as string]: c.rot }} />
        ))}
      </div>
      <div className="absolute inset-0 screentone opacity-60 pointer-events-none" />

      <div className="relative min-h-[100dvh] mx-auto max-w-3xl px-5 py-10 flex flex-col items-center justify-center text-center">
        {STICKERS.map((s, i) => (
          <motion.span
            key={s}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: (i % 2 ? 1 : -1) * (6 + i * 3) }}
            transition={{ delay: reduce ? 0 : 1.2 + i * 0.12, type: "spring", stiffness: 300, damping: 12 }}
            className={`absolute hidden sm:block font-px text-xl px-2 border-2 border-background ${i % 2 ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}
            style={{ left: `${[2, 78, 6, 80, 10, 72][i]}%`, top: `${[8, 12, 70, 64, 88, 86][i]}%` }}
          >
            {s}
          </motion.span>
        ))}

        <motion.img
          src={`${BASE}binky-dog.png`} alt="Binky the dog"
          initial={{ scale: 0.2, rotate: -30, opacity: 0 }} animate={{ scale: 1, rotate: -6, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 10 }}
          className="w-36 sm:w-48 drop-shadow-[6px_6px_0_hsl(var(--accent))]"
        />
        <p className="mt-4 font-px text-2xl text-primary">you found Binky. wait.</p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : 0.6 }}
          className="mt-4 font-goth chrome text-5xl sm:text-7xl leading-[.95]"
          data-testid="text-reveal"
        >
          The dog isn't real.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, scale: 1.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduce ? 0 : 1.4, duration: 0.5 }}
          className="mt-3 font-goth text-4xl sm:text-6xl text-accent leading-[.95] [text-shadow:3px_3px_0_#000]"
        >
          It's been in you all this time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : 2.1 }}
          className="mt-8 max-w-lg border-2 border-foreground/70 bg-card p-5 text-left stitch"
        >
          <p className="text-sm sm:text-base">
            Ilya. I'll Yuh. Eel ee yar. I have known you since middle school. I held your hair at Garden of the Olive.
            I have lost blood to Binky the bird. I built you an entire website to tell you that you are, spiritually, a dog.
            You're welcome. Go put on some Chopin and think about it.
          </p>
          <p className="mt-3 font-goth text-2xl text-primary">from your friend, forever, unfortunately for you</p>
          <p className="mt-2 font-px text-lg text-muted-foreground" data-testid="text-verdict">{verdict}</p>
        </motion.div>

        <motion.button
          type="button" onClick={onReplay} data-testid="button-replay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 2.5 }}
          className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground font-px text-2xl px-6 py-2 border-2 border-foreground shadow-[5px_5px_0_hsl(var(--accent))] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-transform"
        >
          <Crosshair className="h-5 w-5" /> hunt him again (he moved)
        </motion.button>
      </div>
    </motion.div>
  );
}
