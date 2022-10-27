import { parseDefinition } from '../src/functions/parseDefinition';
import { ComposerConfigOptions } from '../src/types';

type TestProps = {
  simple: boolean;
  size: 'small' | 'medium' | 'large';
}

const definitions: ComposerConfigOptions<TestProps> = {
  simple: "css-simple-toggle",
  simpleArr: ["css1", "css2", "css3"],
  simpleDeepArr: [
    "css1",
    [
      "css22",
      [
        "css23",
        "css233",
        "css2333"
      ],
      "css24"
    ],
    "css3"
  ],
  functional: (value) => `parsed=${value}`,
  multiFunctional: (value) => ["a_" + value, "b_" + value, { hover: 'c_' + value }],
  obj: {
    small: "css-size-small",
    medium: [
      "css-size-medium-1",
      "css-size-medium-2",
      "css-size-medium-3",
    ],
    large: [
      "some-css",
      { dark: "dark-css" },
      { dark: "another-dark-css" },
      { hover: "hover-css" }
    ]
  },
  mixed: [
    "a",
    ["b", "c"],
    "d",
    { mix: "e" },
    { mix: { another: "f" } },
    { mix: "g" },
    [{ mix: "j" }, { mix: "k" }],
    { deep: ["l", "m", "n"] },
    { mix: { deep: ["O", "P", "Q"] } },
  ]
}

describe('parseDefinition()', () => {


  it('should exist', () => {
    expect(parseDefinition).not.toBe(undefined);
  });

  it("should return classes from simple prop if boolean prop is TRUE", () => {
    const result = parseDefinition(true, definitions.simple)
    expect(result.join(" ")).toBe("css-simple-toggle")
  })

  it("should return classes from simple array prop if boolean prop is TRUE", () => {
    const result = parseDefinition(true, definitions.simpleArr)
    expect(result.join(" ")).toBe("css1 css2 css3")
  })

  it("should return classes from deep array prop if boolean prop is TRUE", () => {
    const result = parseDefinition(true, definitions.simpleDeepArr)
    expect(result.join(" ")).toBe("css1 css22 css23 css233 css2333 css24 css3")
  })

  it("should return empty from simple prop if boolean prop is FALSE", () => {
    const result = parseDefinition(false, definitions.simple)
    expect(result.join(" ")).toBe("")
  })

  it("should return classes if defined as a string option", () => {
    const result = parseDefinition("small", definitions.obj)
    expect(result.join(" ")).toBe("css-size-small")
  })

  it("should return classes if defined as a array option", () => {
    const result = parseDefinition("medium", definitions.obj)
    expect(result.join(" ")).toBe("css-size-medium-1 css-size-medium-2 css-size-medium-3")
  })

  it("should parse if option has pseudo definitions", () => {
    const result = parseDefinition("large", definitions.obj)
    expect(result.join(" ")).toBe("some-css dark:dark-css dark:another-dark-css hover:hover-css")
  })

  it("should parse deep recursive definitions", () => {
    const result = parseDefinition(true, definitions.mixed)
    expect(result.join(" ")).toBe("a b c d mix:e mix:another:f mix:g mix:j mix:k deep:l deep:m deep:n mix:deep:O mix:deep:P mix:deep:Q")
  })

  it("should parse functional definitions", () => {
    const result = parseDefinition("val", definitions.functional)
    expect(result.join(" ")).toBe("parsed=val")
  })

  it("should parse functional definitions that return other definitions", () => {
    const result = parseDefinition("val", definitions.multiFunctional)
    expect(result.join(" ")).toBe("a_val b_val hover:c_val")
  })
});

