import { COLUMN_INDEXES, ROW_INDEXES, SIZE } from "./layout";
import { slide } from "./slide";
import type { Board, Direction, MoveResult, Rng } from "./types";

export type { Board, Direction, MoveResult, Rng } from "./types";

/**
 * Creates an empty 4x4 board ready for the two starting tiles.
 */
export function createEmptyBoard(): Board {
  return new Array<number>(SIZE * SIZE).fill(0);
}

/**
 * Places a 2 (90%) or 4 (10%) on a random empty cell.
 * When there are no empty cells, returns the board unchanged.
 */
export function spawnTile(board: Board, rng: Rng): Board {
  const empty = board.reduce<number[]>(
    (acc, value, i) => (value === 0 ? [...acc, i] : acc),
    [],
  );
  if (empty.length === 0) {
    return board;
  }
  const spot = empty[Math.floor(rng() * empty.length)]!;
  const value = rng() < 0.9 ? 2 : 4;
  const next = board.slice();
  next[spot] = value;
  return next;
}

/**
 * Creates a 4x4 board with two randomly placed starting tiles.
 */
export function createBoard(rng: Rng): Board {
  return spawnTile(spawnTile(createEmptyBoard(), rng), rng);
}

/**
 * Slides and merges every line of the board in the given direction.
 * Returns the resulting board together with the points gained and whether
 * anything moved. New tiles are spawned separately via `spawnTile`.
 */
export function move(board: Board, dir: Direction): MoveResult {
  const lines =
    dir === "left" || dir === "right" ? ROW_INDEXES : COLUMN_INDEXES;

  const next = board.slice();
  let gained = 0;

  for (const line of lines) {
    const reversed = dir === "right" || dir === "down";
    const values = line.map((i) => board[i] ?? 0);
    if (reversed) {
      values.reverse();
    }
    const slid = slide(values);
    gained += slid.gained;
    const placed = reversed ? slid.result.reverse() : slid.result;
    line.forEach((i, j) => {
      next[i] = placed[j] ?? 0;
    });
  }

  return { board: next, gained, moved: next.some((v, i) => v !== board[i]) };
}

/**
 * True when there are no empty cells and no two equal neighbours.
 */
export function isGameOver(board: Board): boolean {
  if (board.some((value) => value === 0)) {
    return false;
  }
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const value = board[row * SIZE + col]!;
      if (col + 1 < SIZE && board[row * SIZE + col + 1] === value) {
        return false;
      }
      if (row + 1 < SIZE && board[(row + 1) * SIZE + col] === value) {
        return false;
      }
    }
  }
  return true;
}

/**
 * True when a 2048 tile exists on the board.
 */
export function hasWon(board: Board): boolean {
  return board.some((value) => value >= 2048);
}
