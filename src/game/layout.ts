import type { Board } from "./types";

export const SIZE = 4;

/** Column-major indices into a flat 16-element board. */
export const COLUMN_INDEXES: readonly (readonly number[])[] = [
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
];

/** Row-major indices into a flat 16-element board. */
export const ROW_INDEXES: readonly (readonly number[])[] = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
];

export function index(row: number, col: number): number {
  return row * SIZE + col;
}

export function valueAt(board: Board, row: number, col: number): number {
  return board[index(row, col)] ?? 0;
}
