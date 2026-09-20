import { describe, expect, it } from "vitest";

import {
  createBoard,
  hasWon,
  isGameOver,
  move,
  spawnTile,
} from "../src/game/index";
import type { Board } from "../src/game/types";

function boardFromRows(rows: number[][]): Board {
  return rows.flat();
}

/** A fixed RNG returning values from a queue, then 0.5 forever. */
function rng(values: number[]): () => number {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)] ?? 0.5;
}

describe("createBoard", () => {
  it("starts as a 4x4 board with exactly two non-zero tiles", () => {
    const board = createBoard(rng([0, 0, 0, 0]));
    expect(board).toHaveLength(16);
    expect(board.filter((v) => v !== 0)).toHaveLength(2);
  });
});

describe("spawnTile", () => {
  it("places a 2 when rng is below 0.9", () => {
    // rng()===0 picks the first empty cell; second call 0.5 (<0.9) -> 2.
    const board = spawnTile(new Array(16).fill(0), rng([0, 0.5]));
    expect(board[0]).toBe(2);
    expect(board.filter((v) => v !== 0)).toHaveLength(1);
  });

  it("places a 4 when rng is at least 0.9", () => {
    const board = spawnTile(new Array(16).fill(0), rng([0, 0.95]));
    expect(board[0]).toBe(4);
  });

  it("returns the board unchanged when there are no empty cells", () => {
    const full = boardFromRows([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ]);
    expect(spawnTile(full, rng([0, 0]))).toEqual(full);
  });
});

describe("move", () => {
  it("turns row [2,2,2,2] into [4,4,0,0] moving left", () => {
    const board = boardFromRows([
      [2, 2, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const { board: next, gained, moved } = move(board, "left");
    expect(next.slice(0, 4)).toEqual([4, 4, 0, 0]);
    expect(gained).toBe(8);
    expect(moved).toBe(true);
  });

  it("turns row [2,2,4,0] into [4,4,0,0] moving left without double merging", () => {
    const board = boardFromRows([
      [2, 2, 4, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const { board: next, gained } = move(board, "left");
    expect(next.slice(0, 4)).toEqual([4, 4, 0, 0]);
    expect(gained).toBe(4);
  });

  it("moves right, reversing the merge order", () => {
    const board = boardFromRows([
      [2, 4, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const { board: next } = move(board, "right");
    expect(next.slice(0, 4)).toEqual([0, 0, 2, 4]);
  });

  it("moves up a column", () => {
    const board = boardFromRows([
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [4, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const { board: next, gained } = move(board, "up");
    expect(next[0]).toBe(4);
    expect(next[4]).toBe(4);
    expect(next[8]).toBe(0);
    expect(gained).toBe(4);
  });

  it("moves down a column", () => {
    const board = boardFromRows([
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const { board: next, gained } = move(board, "down");
    expect(next[8]).toBe(0);
    expect(next[12]).toBe(4);
    expect(gained).toBe(4);
  });

  it("returns moved === false when nothing changes", () => {
    const board = boardFromRows([
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    expect(move(board, "left").moved).toBe(false);
  });

  it("returns moved === false when a slide would fail on a full board with no merges", () => {
    const board = boardFromRows([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ]);
    expect(move(board, "left").moved).toBe(false);
    expect(move(board, "right").moved).toBe(false);
    expect(move(board, "up").moved).toBe(false);
    expect(move(board, "down").moved).toBe(false);
  });
});

describe("isGameOver", () => {
  it("is false when there is an empty cell", () => {
    const board = boardFromRows([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 0],
    ]);
    expect(isGameOver(board)).toBe(false);
  });

  it("is true on a full board with no possible merges", () => {
    const board = boardFromRows([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ]);
    expect(isGameOver(board)).toBe(true);
  });

  it("is false on a full board with a possible merge", () => {
    const board = boardFromRows([
      [2, 2, 4, 8],
      [16, 32, 64, 128],
      [256, 512, 1024, 2048],
      [2, 4, 8, 16],
    ]);
    expect(isGameOver(board)).toBe(false);
  });
});

describe("hasWon", () => {
  it("is false when no 2048 tile exists", () => {
    const board = boardFromRows([
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ]);
    expect(hasWon(board)).toBe(false);
  });

  it("is true when a 2048 tile exists", () => {
    const board = boardFromRows([
      [0, 0, 0, 0],
      [0, 2048, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    expect(hasWon(board)).toBe(true);
  });
});
