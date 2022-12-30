import React from "react";
import TestRenderer from "react-test-renderer";
import { useClassname } from "../src/hooks/useClassname";
import { ClassDefinition } from "../src/types";

const ComponentWithClass = ({ config }: { config: ClassDefinition }) => {
  const classname = useClassname(config);
  return <div className={classname}></div>;
};

describe("useClassname()", () => {
  it("should exist", () => {
    expect(useClassname).not.toBe(undefined);
  });

  it("should work with string", () => {
    const config: ClassDefinition = "some classes here";
    const target = TestRenderer.create(<ComponentWithClass config={config} />);

    expect(target).toMatchInlineSnapshot(`
<div
  className="some classes here"
/>
`);
  });

  it("should work with arrays", () => {
    const config: ClassDefinition = ["a", "b", ["c", ["d", ["e", "f"]]]];
    const target = TestRenderer.create(<ComponentWithClass config={config} />);

    expect(target).toMatchInlineSnapshot(`
<div
  className="a b c d e f"
/>
`);
  });

  it("should work with single object", () => {
    const config: ClassDefinition = { a: "b" };
    const target = TestRenderer.create(<ComponentWithClass config={config} />);

    expect(target).toMatchInlineSnapshot(`
<div
  className="a:b"
/>
`);
  });

  it("should not work with the word `true` due to how we treat the first level object", () => {
    const config: ClassDefinition = { true: { true: "aaaa" } };
    const target = TestRenderer.create(<ComponentWithClass config={config} />);

    expect(target).toMatchInlineSnapshot(`
<div
  className="aaaa"
/>
`);
  });

  it("should work with deep array of object", () => {
    const config: ClassDefinition = [
      { a: "a" },
      { b: ["b", "c", "d"] },
      { c: "e f g" },
      { c: { d: { e: ["1", "2"] } } },
      "z",
    ];
    const target = TestRenderer.create(<ComponentWithClass config={config} />);

    expect(target).toMatchInlineSnapshot(`
<div
  className="a:a b:b b:c b:d c:e c:f c:g c:d:e:1 c:d:e:2 z"
/>
`);
  });

  it("should work with functions", () => {
    const config: ClassDefinition = [
      "a",
      () => "b",
      "c",
      () => ["d", "e", "f"],
      () => ({ z: "x" }),
      () => ({ y: ["a", "b", "c"] }),
      (value) => `${value}`,
    ];
    const target = TestRenderer.create(<ComponentWithClass config={config} />);

    expect(target).toMatchInlineSnapshot(`
<div
  className="a b c d e f z:x y:a y:b y:c true"
/>
`);
  });

  it("should only return uniq classnames", () => {
    const config: ClassDefinition = [
      "a a",
      "a",
      ["a", "a", "a"],
      ["a", ["a", "a"]],
      { a: "a" },
      { a: "a" },
      { a: ["a", { a: "a" }, "a", "a"] },
      () => "a",
      () => "a a",
      () => ["a", "a", "a"],
      () => "a:a:a",
      () => "a:a",
    ];
    const target = TestRenderer.create(<ComponentWithClass config={config} />);

    expect(target).toMatchInlineSnapshot(`
<div
  className="a a:a a:a:a"
/>
`);
  });

  it("should discard falsy values", () => {
    const config: ClassDefinition = [
      "valid-a",
      false && "invalid",
      0 && "invalid",
      0,
      [0, false, "something | else", false],
      false,
      null,
      undefined,
      { hover: [false, "hello", 0, "world"] },
      () => undefined,
      () => null,
      () => false,
      () => 0,
      () => "",
      "|",
      "",
      "",
      "valid-b",
    ];
    const target = TestRenderer.create(<ComponentWithClass config={config} />);

    expect(target).toMatchInlineSnapshot(`
<div
  className="valid-a something | else hover:hello hover:world valid-b"
/>
`);
  });
});
