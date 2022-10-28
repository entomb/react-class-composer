import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Component } from './Example/Component'


describe("useClassComposer", () => {

  it("should work as a hook", () => {
    expect(Component).not.toBeUndefined()
    const target = TestRenderer.create(<>
      <Component size="small" something={<p>hello world</p>} />
    </>
    );
    expect(target).toMatchInlineSnapshot(`
<div
  className="base-class small-class"
>
  your component
  <p>
    hello world
  </p>
</div>
`)
  })

})
