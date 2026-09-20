# 2048

A browser 2048 game built with Vite + TypeScript (strict) + vitest. No other
runtime dependencies.

All game logic lives in `src/game/` as pure functions with no DOM access.
Randomness is injected as `rng: () => number`, so `Math.random` is never called
inside `src/game/` (only the UI in `src/main.ts` supplies it).

## Install

```sh
npm install
```

## Test

```sh
npm test
```

## Build

```sh
npm run build
```

## Lint / typecheck

```sh
npm run lint
```

## Run the game (development)

```sh
npm run dev
```

Then open the printed URL (usually <http://localhost:5173>). Use the arrow keys
to move the tiles, and the "New game" button to restart. Merge tiles to reach
2048.
