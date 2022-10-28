# React Class Composer

![image](https://user-images.githubusercontent.com/57768/198602737-edb226d8-e482-48a1-b7e6-d1b61821108f.png)

Simple tool to compose css classnames based on component props

## How does it work?

use `createComponent()` we can create and forward a native HTML component:

```ts
import { HTMLAttributes } from "react";
import { createComponent } from "react-class-composer";

type BoxProps = {
  display?: "flex" | "block" | "inline";
};

export const Box = createComponent<BoxProps>("div", {
  base: "box-base",
  options: {
    display: {
      flex: "display-flex",
      block: "display-block",
      inline: "display-inline",
    },
  },
});
```

### Using the component:

```jsx
  <Box display='flex'><Box>
  <Box display='inline'><Box>
  <Box display='block'><Box>
```

### HTML Output:

```html
<div className="box-base display-flex"></div>
<div className="box-base display-inline"></div>
<div className="box-base display-block"></div>
```

### alternatively you can use `useClassComposer()` Hook

```tsx
import React from "react";
import { useClassComposer } from "react-class-composer";

interface Props {
  size: "small" | "medium" | "large";
  something: React.ReactNode;
}

export const YourComponent: React.FC<Props> = (props) => {
  const { className } = useClassComposer<Pick<Props, "size">>(
    {
      base: "base-class",
      options: {
        size: {
          small: "small-class",
          medium: "medium-class",
          large: "large-class",
        },
      },
    },
    props
  );

  return (
    <div className={className}>
      your component
      {props.something}
    </div>
  );
};
```

# Full Example

```tsx
import { ButtonHTMLAttributes } from "react";
import {
  createComponent,
  mixAddClass,
  mixFunction,
  mixRemoveClass,
} from "react-class-composer";

type ButtonProps = {
  size: "tiny" | "small" | "medium" | "large";
  variant?: "none" | "outline" | "filled";
  rounded?: boolean;
  anotherOption?: "on" | "off";
  dynamicOptions?: number;
} & Partial<{
  // alias:
  round: ButtonProps["rounded"];
  v: ButtonProps["variant"];
}>;

export const Button = createComponent<
  ButtonProps,
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(
  "button",
  {
    /**
     * Base: base classes, will allways be applied
     */
    base: [
      "btn",
      { hover: ["btn-hover", "text-bold"] }, // {key: 'value'} pairs will be exploded into prefixed classes like `key:value`
      () => "btn-base", // you can use functions to return a string or @ClassDefinition object
    ],
    /**
     * Mix: mix functions allow for conditional class toggling based on the multiple props.
     */
    mix: [
      // mixAddClass will add classes if all the conditions are true
      mixAddClass(["size.tiny", "variant.outline"], "size-tiny-outline-mix"),
      // mixRemoveClass will remove a class if all the conditions are true
      mixRemoveClass(
        ["size.tiny", "variant.filled"],
        ["btn-base", { hover: "btn-hover" }, "hover:text-bold"]
      ),
      // mix functions supprt wild card checks:
      mixRemoveClass(["data-something.a"], ["btn-base"]),
      // you can run your own mix functions
      mixFunction(["anotherOption.*", "disabled.true"], (css) =>
        css.add("any-anotherOptions-disabled-true")
      ),
      // or simply just pass in a mix object.
      { when: ["type.reset"], run: (css) => css.add("btn-reset") },
    ],
    /**
     * Alias: prop shortcuts for other options
     */
    alias: {
      v: "variant", // v="outline" is interpreted as variant="outline"
      round: "rounded",
    },
    /**
     * Options: options are [key,value] pairs, where the key is the prop name
     */
    options: {
      size: {
        // the value of the prop
        tiny: "padding-tiny margin-tiny", // you can use string
        small: [
          "padding-medium",
          "margin-medium",
          ["text-medium", "font-something"],
        ], // or any combination of string[]
        medium: () => `medium-stuff class-returned-by-function`, // also suports () => string
        large: {
          large: ["text", "font", "padding"],
          key: { abc: ["a", "b", "c"], num: ["n1", "n2", "n3"] },
        }, // any object key will be parsed as "prefixed" class name
      },
      $type: {
        // use $ as a prefix to mark a prop as "native" (comes from the native HTML element we are extending)
        submit: "btn-submit",
      },
      variant: {
        none: "",
        outline: "bg-white-500 text-black border border-gray-400",
        filled: "bg-teal-200 text-white",
      },
      anotherOption: {
        on: "option-on",
        off: "options-off",
      },
      dynamicOptions: (value) => {
        // dynamic options via function
        if (value < 50) return "less-than-50";
        if (value > 50) return "more-than-50";
        return ["value-is-50", "dynamic-options-50"];
      },
      rounded: "rounded-2xl",
      $disabled: "btn-disabled", // use $ as a prefix to mark a prop as "native" (comes from the native HTML element we are extending)
      $$title: "btn-has-title", // use $$ as a prefix to apply classes if a prop is present, ignoring what value it has
      "data-something": {
        // we can also target data-attributes:
        a: "something-a",
        b: "something-b",
      },
    },
  },
  {
    variant: "none",
  }
);
```
