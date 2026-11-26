import type { Direction, Terrain } from "@/game/world";

type R = [number, number, number, number, string];
const px = (rs: R[], key = "") =>
  rs.map(([x, y, w, h, f], i) => <rect key={key + i} x={x} y={y} width={w} height={h} fill={f} />);

const hash = (x: number, y: number) => ((x * 73856093) ^ (y * 19349663)) >>> 0;

export function TerrainTile({ t, x, y }: { t: Terrain; x: number; y: number }) {
  const h = hash(x, y);
  const g = h % 3 === 0 ? "#1d2a2c" : h % 3 === 1 ? "#1a2629" : "#1f2d2f";
  const base = <rect width="16" height="16" fill={g} />;
  if (t === "grass")
    return (
      <>
        {base}
        {px([[h % 12, (h >> 3) % 12, 1, 2, "#2d4241"], [(h >> 5) % 13 + 1, (h >> 7) % 12 + 2, 1, 1, "#33494a"]])}
        {h % 9 === 0 && px([[7, 7, 1, 1, "#d9b8ff"], [6, 8, 3, 1, "#d9b8ff"], [7, 8, 1, 1, "#ff4f93"]])}
      </>
    );
  if (t === "path")
    return (
      <>
        <rect width="16" height="16" fill="#3a3142" />
        {px([[2, 3, 4, 3, "#463b50"], [9, 1, 5, 4, "#4a3f55"], [4, 9, 5, 4, "#463b50"], [11, 10, 3, 3, "#4a3f55"], [1, 14, 2, 1, "#2c2533"]])}
      </>
    );
  if (t === "water")
    return (
      <>
        <rect width="16" height="16" fill="#13203a" />
        <g className="ripple" style={{ animationDelay: `${(h % 5) * 0.4}s` }}>
          {px([[2 + (h % 4), 4, 4, 1, "#5d6f9c"], [8, 10 + (h % 3), 5, 1, "#3f5283"]])}
        </g>
        {h % 7 === 0 && px([[11, 3, 1, 1, "#e6e9f2"]])}
      </>
    );
  return (
    <>
      {base}
      {px([
        [3, 13, 10, 2, "#0b1112"],
        [7, 11, 2, 4, "#3a2a2a"],
        [4, 2, 8, 2, "#1d4a3c"], [2, 4, 12, 5, "#163a30"], [3, 9, 10, 3, "#112d26"],
        [5, 3, 3, 2, "#2c6a52"], [4, 5, 2, 2, "#245a46"], [10, 6, 2, 2, "#0d241e"],
      ])}
    </>
  );
}

export function Cottage() {
  return (
    <g>
      {px([
        [0, 14, 16, 2, "#0b0a10"],
        [1, 5, 14, 2, "#4a3156"], [0, 7, 16, 2, "#3b2645"], [3, 3, 10, 2, "#5a3d68"],
        [2, 9, 12, 6, "#2a2232"], [2, 9, 12, 1, "#8d91a0"],
        [4, 10, 3, 3, "#ffcf5a"], [5, 10, 1, 3, "#c58a2b"], [4, 11, 3, 1, "#c58a2b"],
        [9, 10, 3, 5, "#120f17"], [11, 12, 1, 1, "#c9ccd6"], [11, 2, 2, 3, "#2a2232"],
      ])}
    </g>
  );
}

export function Bird() {
  return (
    <g>
      {px([[1, 13, 14, 2, "#0b0a10"], [3, 11, 10, 1, "#6b4a3a"], [7, 12, 1, 3, "#4a3328"]])}
      <g className="bop">
        {px([
          [5, 6, 6, 5, "#3a8bff"], [6, 4, 4, 3, "#5aa8ff"], [9, 5, 1, 1, "#0d0b14"],
          [10, 6, 2, 1, "#f2c14e"], [4, 8, 2, 2, "#2563c9"], [6, 9, 3, 1, "#b8dcff"], [6, 11, 1, 1, "#f2c14e"], [9, 11, 1, 1, "#f2c14e"],
        ])}
      </g>
      <g className="note">{px([[13, 2, 1, 3, "#c9ccd6"], [12, 4, 1, 1, "#c9ccd6"], [14, 2, 1, 1, "#c9ccd6"]])}</g>
      <g className="note" style={{ animationDelay: ".9s" }}>{px([[1, 3, 1, 3, "#c6ff2e"], [0, 5, 1, 1, "#c6ff2e"]])}</g>
    </g>
  );
}

export function Takeout() {
  return (
    <g>
      {px([
        [0, 14, 16, 2, "#0b0a10"],
        [1, 3, 14, 2, "#d9283c"], [1, 3, 2, 2, "#f6e7c8"], [5, 3, 2, 2, "#f6e7c8"], [9, 3, 2, 2, "#f6e7c8"], [13, 3, 2, 2, "#f6e7c8"],
        [2, 5, 1, 9, "#8d91a0"], [13, 5, 1, 9, "#8d91a0"], [1, 10, 14, 4, "#2a2232"], [1, 10, 14, 1, "#c9ccd6"],
        [3, 7, 4, 3, "#f2c14e"], [3, 7, 4, 1, "#d9283c"],
        [8, 8, 2, 2, "#e8b26a"],
        [11, 5, 2, 5, "#fff3a6"], [11, 5, 2, 1, "#c9ccd6"], [12, 3, 1, 2, "#ff4f93"],
      ])}
    </g>
  );
}

export function Messages() {
  return (
    <g>
      {px([
        [3, 14, 10, 2, "#0b0a10"], [7, 8, 2, 7, "#5b5f6c"],
        [3, 4, 10, 5, "#8d91a0"], [3, 4, 10, 1, "#e6e9f2"], [4, 6, 8, 1, "#3a3c46"], [12, 1, 1, 4, "#ff4f93"], [13, 1, 2, 2, "#ff4f93"],
      ])}
      <g className="twinkle">{px([[0, 0, 5, 3, "#e6e9f2"], [1, 3, 1, 1, "#e6e9f2"], [1, 1, 3, 1, "#3a3c46"]])}</g>
    </g>
  );
}

export function Garden() {
  return (
    <g>
      {px([
        [1, 9, 14, 6, "#2a2232"], [1, 9, 14, 1, "#4a3f55"],
        [3, 6, 1, 4, "#2c6a52"], [2, 4, 3, 2, "#c6ff2e"], [3, 5, 1, 1, "#0d0b14"],
        [7, 7, 1, 3, "#2c6a52"], [6, 5, 3, 2, "#ff4f93"], [7, 6, 1, 1, "#ffd1e3"],
        [11, 6, 1, 4, "#2c6a52"], [10, 4, 3, 2, "#d9b8ff"], [11, 5, 1, 1, "#fff"],
        [4, 11, 2, 2, "#4c6b3a"], [9, 12, 3, 1, "#4c6b3a"],
      ])}
    </g>
  );
}

export function PeaceStone() {
  const ring: R[] = [
    [5, 2, 6, 1, "#e6e9f2"], [3, 3, 2, 1, "#e6e9f2"], [11, 3, 2, 1, "#c9ccd6"], [2, 4, 1, 2, "#e6e9f2"], [13, 4, 1, 2, "#a7abb8"],
    [1, 6, 1, 4, "#c9ccd6"], [14, 6, 1, 4, "#8d91a0"], [2, 10, 1, 2, "#a7abb8"], [13, 10, 1, 2, "#8d91a0"],
    [3, 12, 2, 1, "#8d91a0"], [11, 12, 2, 1, "#5b5f6c"], [5, 13, 6, 1, "#5b5f6c"],
    [7, 3, 2, 10, "#c9ccd6"], [6, 9, 1, 1, "#c9ccd6"], [5, 10, 1, 1, "#c9ccd6"], [4, 11, 1, 1, "#a7abb8"],
    [9, 9, 1, 1, "#a7abb8"], [10, 10, 1, 1, "#a7abb8"], [11, 11, 1, 1, "#8d91a0"],
  ];
  return (
    <g>
      {px([[2, 14, 12, 2, "#0b0a10"]])}
      <g className="twinkle">{px([[4, 4, 1, 1, "#fff"]])}</g>
      {px(ring)}
    </g>
  );
}

export function Player({ facing }: { facing: Direction }) {
  const side = facing === "left" || facing === "right";
  const back = facing === "up";
  return (
    <g transform={facing === "left" ? "translate(16 0) scale(-1 1)" : undefined}>
      {px([[3, 14, 10, 2, "#05040a"]])}
      <g className="bob">
        {px([
          [4, 1, 8, 5, "#0d0b14"], [3, 2, 1, 4, "#0d0b14"],
          [5, 3, 6, 4, "#f0d3be"],
          ...(back ? ([[4, 2, 8, 5, "#0d0b14"]] as R[]) : side ? ([[5, 2, 3, 3, "#0d0b14"], [9, 4, 1, 1, "#0d0b14"]] as R[]) : ([[4, 2, 5, 3, "#0d0b14"], [9, 5, 1, 1, "#0d0b14"], [7, 5, 1, 1, "#3a3c46"]] as R[])),
          [4, 7, 8, 5, "#1a1822"], [4, 7, 8, 1, "#2a2833"],
          [6, 8, 1, 1, "#c9ccd6"], [7, 9, 2, 1, "#e6e9f2"], [9, 8, 1, 1, "#c9ccd6"],
          [3, 8, 1, 3, "#1a1822"], [12, 8, 1, 3, "#1a1822"], [3, 11, 1, 1, "#c9ccd6"],
          [5, 12, 2, 2, "#2b2f45"], [9, 12, 2, 2, "#2b2f45"], [4, 14, 3, 1, "#0d0b14"], [9, 14, 3, 1, "#0d0b14"],
        ])}
      </g>
    </g>
  );
}

export function Dog({ found }: { found: boolean }) {
  return (
    <g>
      {px([[2, 14, 12, 2, "#05040a"]])}
      <g className={found ? "bop" : "bob"}>
        {px([
          [3, 8, 10, 5, "#c79a62"], [4, 8, 4, 2, "#e9c793"], [11, 6, 2, 2, "#c79a62"], [12, 5, 1, 1, "#7a5a36"],
          [3, 13, 2, 2, "#8a6a42"], [10, 13, 2, 2, "#8a6a42"],
          [0, 4, 7, 5, "#c79a62"], [1, 5, 4, 3, "#e9c793"],
          [-1, 3, 2, 6, "#6b4a2e"], [6, 2, 2, 2, "#6b4a2e"], [7, 1, 2, 1, "#6b4a2e"],
          [1, 5, 2, 2, "#fff"], [2, 6, 1, 1, "#0d0b14"], [4, 5, 1, 1, "#3a8bff"],
          [-1, 7, 2, 1, "#0d0b14"], [0, 8, 2, 2, "#ff4f93"],
          [5, 8, 3, 1, "#c9ccd6"],
        ])}
      </g>
    </g>
  );
}

export function GlossySmiley({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="sm" cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#fbffd0" />
          <stop offset=".45" stopColor="#c6ff2e" />
          <stop offset="1" stopColor="#4c7a08" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#sm)" stroke="#0d0b14" strokeWidth="1.5" />
      <ellipse cx="14" cy="11" rx="7" ry="4" fill="#fff" opacity=".55" transform="rotate(-25 14 11)" />
      <ellipse cx="14" cy="17" rx="2.2" ry="3.6" fill="#0d0b14" />
      <ellipse cx="26" cy="17" rx="2.2" ry="3.6" fill="#0d0b14" />
      <path d="M10 23 Q20 33 30 23" stroke="#0d0b14" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}
