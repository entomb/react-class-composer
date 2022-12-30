import { shouldMix } from "../src/functions/mixFunctions";

const propArray: string[] = [
  "prop.value",
  "another.prop",
  "third.prop",
  "another.one",
  "match.a",
  "match.b",
  "match.c",
];

describe("shouldMix()", () => {
  it("should exist", () => {
    expect(shouldMix).not.toBe(undefined);
  });

  describe("should return true", () => {
    [
      [],
      ["prop.value"],
      ["prop.value", "another.prop"],
      ["prop.value", "another.prop", "third.prop"],
      ["match.*", "another.*"],
    ].forEach((target: string[]) => {
      it("when matching: " + JSON.stringify(target), () => {
        expect(shouldMix(target, propArray)).toEqual(true);
      });
    });

    describe("when matching with * wildcard", () => {
      it("and found one", () => {
        expect(shouldMix(["match.*"], propArray.slice(-2))).toEqual(true);
      });
      it("and found all", () => {
        expect(shouldMix(["match.*"], propArray)).toEqual(true);
      });
    });
  });

  describe("should return false", () => {
    [
      [true],
      [false],
      [undefined],
      [{ object: 1 }],
      [""],
      ["*"],
      ["*.value"],
      ["missing.prop"],
      ["missing.prop", "prop.value"],
      ["missing.*", "prop.value"],
      ["missing.*", "match.*", "prop.value"],
    ].forEach((target: any[]) => {
      it("when matching: " + JSON.stringify(target), () => {
        expect(shouldMix(target, propArray)).toEqual(false);
      });
    });
  });
});
