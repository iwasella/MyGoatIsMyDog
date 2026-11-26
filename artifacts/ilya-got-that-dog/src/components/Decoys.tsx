export type DecoyKind =
  | "creeper" | "bird" | "olive" | "clef" | "cross" | "wing" | "parsnip" | "skull"
  | "star" | "diamond" | "chicken" | "bubble" | "pickaxe" | "heart" | "slime" | "note";

export const DECOY_KINDS: DecoyKind[] = [
  "creeper", "bird", "olive", "clef", "cross", "wing", "parsnip", "skull",
  "star", "diamond", "chicken", "bubble", "pickaxe", "heart", "slime", "note",
];

export const MISS_LINES: Record<DecoyKind | "void", string[]> = {
  creeper: ["Creeper, aww man.", "So we back in the mine. No dog though."],
  bird: ["That is Binky the BIRD. He bites. Ask my finger.", "Wrong Binky. This one draws blood."],
  olive: ["Garden of the Olive flashback. I am holding your hair again.", "Breadsticks were a mistake. Not a dog."],
  clef: ["Very cultured, I'll Yuh. Still not a dog.", "Classical era Ilya detected. Zero dogs."],
  cross: ["Affliction tee energy. Zero dogs.", "Rhinestone cross. Holy, not canine."],
  wing: ["Those are mall wings, Eel ee yar.", "Wings. On a shirt. In 2007. Not a dog."],
  parsnip: ["A parsnip. Stardew brain rot.", "Sell it to Pierre. Keep looking."],
  skull: ["Skull. Very tough. Very not dog.", "You stared at this skull too long."],
  star: ["Sparkle. No bark.", "Y2K star. Zero fur."],
  diamond: ["A diamond. Do not mine it. Find the dog.", "Diamonds! Wrong game, Eel ee yar."],
  chicken: ["That's a chicken. Feed her later.", "Bawk. Not woof."],
  bubble: ["BAKA. Tapping text bubbles now?", "The speech bubble is roasting you."],
  pickaxe: ["Pickaxe. Mining for clues?", "Nice tool. Wrong target."],
  heart: ["Aw. Still not a dog.", "Affection detected. Dog not detected."],
  slime: ["Slime. Gross. Stardew mines. No.", "It jiggled. Dogs don't jiggle like that."],
  note: ["A note. Very Chopin. No dog.", "Doesn't bark in C minor."],
  void: ["That's nothing. Literally nothing, I'll Yuh.", "You tapped the void.", "Empty. Like your fridge in 8th grade."],
};

export function DecoyArt({ kind }: { kind: DecoyKind }) {
  const s = { width: "100%", height: "100%", display: "block" } as const;
  switch (kind) {
    case "creeper":
      return (
        <svg viewBox="0 0 8 8" style={s} shapeRendering="crispEdges">
          <rect width="8" height="8" fill="#4caf3a" />
          <rect x="1" y="1" width="2" height="1" fill="#6fd65a" /><rect x="5" y="5" width="2" height="2" fill="#3a8a2c" />
          <rect x="1" y="2" width="2" height="2" fill="#0c0c0c" /><rect x="5" y="2" width="2" height="2" fill="#0c0c0c" />
          <rect x="3" y="4" width="2" height="1" fill="#0c0c0c" /><rect x="2" y="5" width="4" height="2" fill="#0c0c0c" />
          <rect x="3" y="7" width="2" height="1" fill="#4caf3a" />
        </svg>
      );
    case "bird":
      return (
        <svg viewBox="0 0 40 40" style={s}>
          <ellipse cx="20" cy="24" rx="12" ry="10" fill="#7dd3c0" stroke="#111" strokeWidth="2" />
          <circle cx="25" cy="15" r="8" fill="#f4e04d" stroke="#111" strokeWidth="2" />
          <circle cx="27" cy="13" r="1.8" fill="#111" />
          <path d="M32 15 L38 17 L32 19 Z" fill="#f08a3c" stroke="#111" strokeWidth="1.5" />
          <path d="M10 24 Q4 30 8 34" stroke="#111" strokeWidth="2" fill="none" />
          <circle cx="22" cy="19" r="2" fill="#ff7aa8" />
        </svg>
      );
    case "olive":
      return (
        <svg viewBox="0 0 40 40" style={s}>
          <path d="M4 36 Q20 20 36 4" stroke="#a7b07a" strokeWidth="2" fill="none" />
          {[8, 15, 22, 29].map((t, i) => (
            <ellipse key={i} cx={t + 2} cy={36 - t - 4} rx="5" ry="2.2" fill="#8a9a52" transform={`rotate(${i % 2 ? 40 : -40} ${t + 2} ${32 - t})`} />
          ))}
          <ellipse cx="14" cy="28" rx="3" ry="4" fill="#2b3a1a" stroke="#c9d39b" strokeWidth=".8" />
          <ellipse cx="27" cy="14" rx="3" ry="4" fill="#3d4f23" stroke="#c9d39b" strokeWidth=".8" />
        </svg>
      );
    case "clef":
      return (
        <svg viewBox="0 0 40 60" style={s}>
          <path d="M22 56 Q14 56 15 49 Q17 44 22 47 M22 56 L22 6 Q30 10 22 22 Q8 32 12 42 Q18 50 28 44 Q34 36 24 32 Q14 32 17 40"
            stroke="#e9e7d8" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "cross":
      return (
        <svg viewBox="0 0 40 50" style={s}>
          <path d="M15 2h10v13h13v10H25v23H15V25H2V15h13z" fill="#cfd2c6" stroke="#111" strokeWidth="1.5" />
          {[[20, 8], [20, 20], [8, 20], [32, 20], [20, 32], [20, 42]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2" fill="#ff3d8b" />
          ))}
        </svg>
      );
    case "wing":
      return (
        <svg viewBox="0 0 60 40" style={s}>
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M30 34 Q${22 - i * 5} ${26 - i * 5} ${4 + i * 2} ${8 + i * 3} Q${16 - i} ${24 - i * 2} 30 34`} fill="none" stroke="#dcdccf" strokeWidth="1.6" />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={"r" + i} d={`M30 34 Q${38 + i * 5} ${26 - i * 5} ${56 - i * 2} ${8 + i * 3} Q${44 + i} ${24 - i * 2} 30 34`} fill="none" stroke="#dcdccf" strokeWidth="1.6" />
          ))}
          <circle cx="30" cy="34" r="3" fill="#c6ff2e" />
        </svg>
      );
    case "parsnip":
      return (
        <svg viewBox="0 0 30 50" style={s}>
          <path d="M8 16 Q15 12 22 16 L16 48 Q15 50 14 48 Z" fill="#f2e2b0" stroke="#111" strokeWidth="1.5" />
          <path d="M15 14 L10 2 M15 14 L15 0 M15 14 L21 3" stroke="#6bbf4a" strokeWidth="3" strokeLinecap="round" />
          <path d="M11 24h5M13 32h4" stroke="#b9a47a" strokeWidth="1" />
        </svg>
      );
    case "skull":
      return (
        <svg viewBox="0 0 40 44" style={s}>
          <path d="M20 2 C6 2 2 12 4 22 C5 28 9 30 10 32 L10 40 L30 40 L30 32 C31 30 35 28 36 22 C38 12 34 2 20 2Z" fill="#e8e6d6" stroke="#111" strokeWidth="2" />
          <circle cx="13" cy="20" r="5" fill="#111" /><circle cx="27" cy="20" r="5" fill="#111" />
          <path d="M20 26 L17 31 H23 Z" fill="#111" />
          <path d="M15 40V35M20 40V35M25 40V35" stroke="#111" strokeWidth="1.5" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 40 40" style={s}>
          <path d="M20 0 L24 16 L40 20 L24 24 L20 40 L16 24 L0 20 L16 16 Z" fill="#f4f2e6" />
          <circle cx="20" cy="20" r="3" fill="#ff3d8b" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 8 8" style={s} shapeRendering="crispEdges">
          <rect x="3" y="0" width="2" height="1" fill="#9ef6f0" /><rect x="2" y="1" width="4" height="1" fill="#5fe3dc" />
          <rect x="1" y="2" width="6" height="2" fill="#2bc4bd" /><rect x="2" y="4" width="4" height="1" fill="#1b9e98" />
          <rect x="3" y="5" width="2" height="2" fill="#137a75" /><rect x="2" y="2" width="1" height="1" fill="#e6fffd" />
        </svg>
      );
    case "chicken":
      return (
        <svg viewBox="0 0 40 40" style={s}>
          <ellipse cx="18" cy="26" rx="13" ry="10" fill="#f5f0e1" stroke="#111" strokeWidth="2" />
          <circle cx="28" cy="14" r="7" fill="#f5f0e1" stroke="#111" strokeWidth="2" />
          <path d="M26 6 Q28 2 30 6 Q32 3 32 8" fill="#e5383b" />
          <path d="M34 14 L39 16 L34 17Z" fill="#f2a93b" />
          <circle cx="30" cy="13" r="1.4" fill="#111" />
          <path d="M14 36 L13 40 M22 36 L23 40" stroke="#f2a93b" strokeWidth="2" />
        </svg>
      );
    case "bubble":
      return (
        <svg viewBox="0 0 60 40" style={s}>
          <path d="M4 4 H56 V28 H24 L12 38 L16 28 H4 Z" fill="#f4f2e6" stroke="#111" strokeWidth="2" />
          <text x="30" y="22" textAnchor="middle" fontFamily="Pirata One, serif" fontSize="15" fill="#111">BAKA</text>
        </svg>
      );
    case "pickaxe":
      return (
        <svg viewBox="0 0 10 10" style={s} shapeRendering="crispEdges">
          <rect x="2" y="1" width="6" height="1" fill="#7fe0d6" /><rect x="1" y="2" width="1" height="2" fill="#7fe0d6" />
          <rect x="8" y="2" width="1" height="2" fill="#7fe0d6" />
          {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={6 - i} y={2 + i} width="1" height="1" fill="#8a5a2b" />)}
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 40 36" style={s}>
          <path d="M20 34 L4 18 C-2 10 6 0 14 4 L20 9 L26 4 C34 0 42 10 36 18 Z" fill="#ff3d8b" stroke="#111" strokeWidth="2" />
          <path d="M10 10 Q12 7 15 8" stroke="#fff4" strokeWidth="2" fill="none" />
        </svg>
      );
    case "slime":
      return (
        <svg viewBox="0 0 40 34" style={s}>
          <path d="M4 32 Q2 8 20 4 Q38 8 36 32 Z" fill="#9ae54a" stroke="#111" strokeWidth="2" opacity=".95" />
          <circle cx="15" cy="18" r="2.4" fill="#111" /><circle cx="25" cy="18" r="2.4" fill="#111" />
          <path d="M10 10 Q14 7 17 8" stroke="#e8ffd0" strokeWidth="2" fill="none" />
        </svg>
      );
    case "note":
      return (
        <svg viewBox="0 0 40 40" style={s}>
          <path d="M14 30 V6 L34 2 V26" stroke="#e9e7d8" strokeWidth="3" fill="none" />
          <ellipse cx="10" cy="31" rx="6" ry="4.5" fill="#e9e7d8" /><ellipse cx="30" cy="27" rx="6" ry="4.5" fill="#e9e7d8" />
        </svg>
      );
  }
}
