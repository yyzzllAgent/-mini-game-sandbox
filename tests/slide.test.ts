import { describe, expect, it } from "vitest";

import { slide } from "../src/game/slide";

describe("slide", () => {
  it("compacts and merges a full row of equal tiles to two tiles", () => {
    expect(slide([2, 2, 2, 2])).toEqual({ result: [4, 4, 0, 0], gained: 8 });
  });

  it("does not merge a tile created by a merge again in the same move", () => {
    expect(slide([2, 2, 4, 0])).toEqual({ result: [4, 4, 0, 0], gained: 4 });
  });

  it("leaves an already compacted line unchanged", () => {
    expect(slide([2, 0, 4, 0])).toEqual({ result: [2, 4, 0, 0], gained: 0 });
  });

  it("handles an empty line", () => {
    expect(slide([0, 0, 0, 0])).toEqual({ result: [0, 0, 0, 0], gained: 0 });
  });
});
