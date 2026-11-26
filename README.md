# Ilya’s Late Walk

A small, personal browser game made as a gift for Ilya. Explore a nighttime pixel world, discover places and inside jokes, and find Binky the dog. The game pairs a dark emo aesthetic and gothic lettering with keyboard and phone-friendly controls.

## Tech stack

- **React 19 + TypeScript** for the interface and game state
- **Vite** for local development and builds
- **Tailwind CSS** for styling
- **SVG** for pixel-art terrain and characters
- **Framer Motion** for transitions and animations
- **Wouter** for routing
- **pnpm workspaces** for repository organization

The game runs entirely in the browser. No backend, database, account, or API keys are required.

## Run locally

Install **Node.js 24** and **pnpm 10**, then run these commands from the repository root:

```sh
pnpm install
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/ilya-got-that-dog run dev
```

Open **http://localhost:3000**.

Both `PORT` and `BASE_PATH` are required by the Vite configuration. The command above uses POSIX shell syntax; in PowerShell, start the app with:

```powershell
$env:PORT = "3000"
$env:BASE_PATH = "/"
pnpm --filter @workspace/ilya-got-that-dog run dev
```

### Controls

- **Arrow keys / WASD:** walk
- **E / Enter / Space:** interact with a nearby character or object
- **Escape:** close a conversation
- **Phone:** use the on-screen directional pad and **poke** button

## Project location

The game lives in `artifacts/ilya-got-that-dog/`. Its `src/game/` directory contains the world, dialogue, and game rules; `src/components/world/` contains the pixel-art sprites.
