import React from "react";
import TestRenderer from "react-test-renderer";
import { Button } from "./Example/Button";
import { Box } from "./Example/Box";

describe("createComponent", () => {
  it("should parse any kind of option", () => {
    expect(Button).not.toBeUndefined();
    const target = TestRenderer.create(
      <>
        <Button size="tiny">text</Button>
        <Button size="small">text</Button>
        <Button size="medium">text</Button>
        <Button size="large">text</Button>
      </>
    );
    expect(target).toMatchInlineSnapshot(`
[
  <button
    className="btn hover:btn-hover hover:text-bold btn-base padding-tiny margin-tiny"
  >
    text
  </button>,
  <button
    className="btn hover:btn-hover hover:text-bold btn-base padding-medium margin-medium text-medium font-something"
  >
    text
  </button>,
  <button
    className="btn hover:btn-hover hover:text-bold btn-base medium-stuff class-returned-by-function"
  >
    text
  </button>,
  <button
    className="btn hover:btn-hover hover:text-bold btn-base large:text large:font large:padding key:abc:a key:abc:b key:abc:c key:num:n1 key:num:n2 key:num:n3"
  >
    text
  </button>,
]
`);
  });

  it("should support as=`` prop", () => {
    const target = TestRenderer.create(
      <>
        <Button as="div" title="hello" size="tiny">
          text
        </Button>
        <Button as="span" onClick={() => {}} size="tiny">
          text
        </Button>
        <Button as="p" color="red" size="tiny">
          text
        </Button>
      </>
    );
    expect(target).toMatchInlineSnapshot(`
[
  <div
    className="btn hover:btn-hover hover:text-bold btn-base btn-has-title padding-tiny margin-tiny"
    title="hello"
  >
    text
  </div>,
  <span
    className="btn hover:btn-hover hover:text-bold btn-base padding-tiny margin-tiny"
    onClick={[Function]}
  >
    text
  </span>,
  <p
    className="btn hover:btn-hover hover:text-bold btn-base padding-tiny margin-tiny"
    color="red"
  >
    text
  </p>,
]
`);
  });

  it("should forward any native prop", () => {
    const target = TestRenderer.create(
      <Button
        size="tiny"
        title="something"
        disabled={true}
        type="submit"
        autoFocus={true}
        formNoValidate
        onClick={() => alert(1)}
      >
        text
      </Button>
    );
    expect(target).toMatchInlineSnapshot(`
<button
  autoFocus={true}
  className="btn hover:btn-hover hover:text-bold btn-base padding-tiny margin-tiny btn-has-title btn-disabled btn-submit form-no-validate"
  disabled={true}
  formNoValidate={true}
  onClick={[Function]}
  title="something"
  type="submit"
>
  text
</button>
`);
  });

  it("should apply variants and addClass mixers", () => {
    const target = TestRenderer.create(
      <Button size="tiny" variant="outline" type="reset">
        text
      </Button>
    );
    expect(target).toMatchInlineSnapshot(`
<button
  className="btn hover:btn-hover hover:text-bold btn-base bg-white-500 text-black border border-gray-400 padding-tiny margin-tiny size-tiny-outline-mix btn-reset"
  type="reset"
>
  text
</button>
`);
  });

  it("should apply variants and removeClass mixers", () => {
    const target = TestRenderer.create(
      <Button size="tiny" variant="filled" type="button">
        text
      </Button>
    );
    expect(target).toMatchInlineSnapshot(`
<button
  className="btn bg-teal-200 text-white padding-tiny margin-tiny"
  type="button"
>
  text
</button>
`);
  });

  it("should forward more classnames without repeating", () => {
    const target = TestRenderer.create(
      <Button size="tiny" className="btn another-class more-classes">
        text
      </Button>
    );
    expect(target).toMatchInlineSnapshot(`
<button
  className="btn hover:btn-hover hover:text-bold btn-base padding-tiny margin-tiny another-class more-classes"
>
  text
</button>
`);
  });

  it("should word with alias", () => {
    const target = TestRenderer.create(
      <Button size="tiny" v="outline" round>
        text
      </Button>
    );
    expect(target).toMatchInlineSnapshot(`
<button
  className="btn hover:btn-hover hover:text-bold btn-base padding-tiny margin-tiny bg-white-500 text-black border border-gray-400 rounded-2xl"
>
  text
</button>
`);
  });

  it("should mix with multiple options", () => {
    const target = TestRenderer.create(
      <>
        <Button size="medium" anotherOption="on" disabled>
          text
        </Button>
        <Button size="medium" anotherOption="off" disabled>
          text
        </Button>
      </>
    );
    expect(target).toMatchInlineSnapshot(`
[
  <button
    className="btn hover:btn-hover hover:text-bold btn-base medium-stuff class-returned-by-function option-on btn-disabled any-anotherOptions-disabled-true"
    disabled={true}
  >
    text
  </button>,
  <button
    className="btn hover:btn-hover hover:text-bold btn-base medium-stuff class-returned-by-function options-off btn-disabled any-anotherOptions-disabled-true"
    disabled={true}
  >
    text
  </button>,
]
`);
  });

  it("should react to data attribute values", () => {
    const target = TestRenderer.create(
      <>
        <Button size="medium" data-something="a">
          text
        </Button>
        <Button size="medium" data-something="b">
          text
        </Button>
      </>
    );
    expect(target).toMatchInlineSnapshot(`
[
  <button
    className="btn hover:btn-hover hover:text-bold medium-stuff class-returned-by-function something-a"
  >
    text
  </button>,
  <button
    className="btn hover:btn-hover hover:text-bold btn-base medium-stuff class-returned-by-function something-b"
  >
    text
  </button>,
]
`);
  });

  it("should work with dynamic values", () => {
    const target = TestRenderer.create(
      <>
        <Button size="medium" dynamicOptions={1}>
          text
        </Button>
        <Button size="medium" dynamicOptions={99}>
          text
        </Button>
        <Button size="medium" dynamicOptions={50}>
          text
        </Button>
      </>
    );
    expect(target).toMatchInlineSnapshot(`
[
  <button
    className="btn hover:btn-hover hover:text-bold btn-base medium-stuff class-returned-by-function less-than-50"
  >
    text
  </button>,
  <button
    className="btn hover:btn-hover hover:text-bold btn-base medium-stuff class-returned-by-function more-than-50"
  >
    text
  </button>,
  <button
    className="btn hover:btn-hover hover:text-bold btn-base medium-stuff class-returned-by-function value-is-50 dynamic-options-50"
  >
    text
  </button>,
]
`);
  });

  it("should parse simple component config", () => {
    const target = TestRenderer.create(
      <Box>
        <Box display="flex" />
        <Box display="inline" />
        <Box display="block" />
      </Box>
    );
    expect(target).toMatchInlineSnapshot(`
<div
  className="box-base"
>
  <div
    className="box-base display-flex"
  />
  <div
    className="box-base display-inline"
  />
  <div
    className="box-base display-block"
  />
</div>
`);
  });
});
