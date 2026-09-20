import { SIZE } from "./layout";

/**
 * Compacts a line toward index 0: values slide to the left, adjacent equal
 * values merge once (left to right), and empty cells are filled with 0.
 * Each tile merges at most once per move, so e.g. [2,2,4] becomes [4,4,0].
 */
export function slide(line: readonly number[]): {
  result: number[];
  gained: number;
} {
  const out: number[] = new Array(SIZE).fill(0);
  const merged = new Array<boolean>(SIZE).fill(false);
  let write = 0;
  let gained = 0;

  for (const value of line) {
    if (value === 0) {
      continue;
    }
    if (write > 0 && out[write - 1] === value && !merged[write - 1]) {
      out[write - 1] = value * 2;
      merged[write - 1] = true;
      gained += value * 2;
    } else {
      out[write] = value;
      write += 1;
    }
  }

  return { result: out, gained };
}
