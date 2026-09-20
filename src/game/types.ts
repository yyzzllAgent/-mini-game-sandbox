export type Board = readonly number[];

export type Direction = "left" | "right" | "up" | "down";

/** A deterministic random number generator in [0, 1). */
export type Rng = () => number;

export interface MoveResult {
  /** The board after the move (already merged and compacted, no new tile spawned). */
  board: Board;
  /** Points gained from merges in this move. */
  gained: number;
  /** True when at least one tile changed position or merged. */
  moved: boolean;
}
