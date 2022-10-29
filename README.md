# ![React Class Composer](https://user-images.githubusercontent.com/57768/198602737-edb226d8-e482-48a1-b7e6-d1b61821108f.png)

Simple tool to compose css classnames based on component props

## Install

```bash
  $ npm install react-class-composer
  $ yarn add react-class-composer
```

## Motivation

**react-class-composer** was built as a tool for creating low level basic building block components for new design systems or UI libraries that use utility classes to style components (like tailwind).

there are definitely other libraries that achieve this, and if you are looking to solve that problem and **react-class-composer** does not fit your needs, I encourage you to check them out: [useFancy](https://www.npmjs.com/package/use-fancy), [use-utility-classes](https://www.npmjs.com/package/use-utility-classes), [React With Class](https://www.npmjs.com/package/react-with-class)

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
  const { className } = useClassComposer<Props>(
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

# the `@ClassDefinition` type

```ts
export type ClassDefinition = string
| ClassDefinition[];
| ((value) => ClassDefinition)
| { [key: string]: ClassDefinition }
```

anytime you can define a class, you can use any combination of the following values:

## `String`

```js
  options: {
      prop: {
        a: "simple",
        b: "multiple classes in the same string" // will be .split(" ") before parsing
      }
  }
```

## `Array`

any array of `@ClassDefinition` values will be flattened and parsed.

```js
  options: {
      prop: {
        a: ["simple", "array"],
        b: ["multi", ["level", "array"]],
        c: [() => "string", {obj: "string"}]
      }
  }
```

## `Functions`

you can use functions to generate dynamic classnames. functions can return any valid `@ClassDefinition` excluding function

```js
  options: {
      prop: {
        a: () => "some-class-name"
      },
      anotherProp: (value) => `prop${value}`
  }
```

## `Objects`

any object beyond the first level (used to parse prop values) will be exploded into prefixed classes like `key:value`. all keys need to be string, but the value can be any `@ClassDefinition`

```js
  options: {
      prop: {
        a: "a-value", // will apply `a-value` if <... prop="a" />
        b: "b-value" // will apply `b-value` if <... prop="b" />
        c: {hover: 'color-red'}// will apply `hover:color-red` if <... prop="c" />
      },

  }
```

# Full Example

([view Button.tsx](test/Example/Button.tsx)) ([view Tests](test/createComponent.test.tsx))

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

export const Button = createComponent<ButtonProps, HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>> (
  "button",
  {
    /**
     * Base: base classes, will always be applied
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

      // mix functions support wild card checks:
      mixRemoveClass(["data-something.a"], ["btn-base"]),

      // you can run your own mix functions
      mixFunction(["anotherOption.*", "disabled.true"], (css) =>
        css.add("any-anotherOptions-disabled-true")
      ),

      // or simply just pass in a mix object.
      { when: ["type.reset"], run: (css) => css.add("btn-reset") },
      // you can match any prop, even if its a native HTML element one
      {
        when: ["formNoValidate.true"],
        run: (css) => css.add("form-no-validate"),
      },
    ],

    /**
     * Alias: prop shortcuts for other options
     */
    alias: {
      // v="outline" is interpreted as variant="outline"
      v: "variant",
      round: "rounded",
    },

    /**
     * Options: options are [key,value] pairs, where the key is the prop name
     */
    options: {
      size: {
        // you can use string
        tiny: "padding-tiny margin-tiny",

        // or any combination of string[]
        small: [
          "padding-medium",
          "margin-medium",
          ["text-medium", "font-something"],
        ],

        // also supports () => string
        medium: () => `medium-stuff class-returned-by-function`,

        // any object key will be parsed as "prefixed" class name
        large: {
          large: ["text", "font", "padding"],
          key: { abc: ["a", "b", "c"], num: ["n1", "n2", "n3"] },
        },
      },

      // use $ as a prefix to mark a prop as "native" (comes from the native HTML element we are extending)
      $type: {
        submit: "btn-submit",
      },

      variant: {
        none: "",
        outline: "bg-white-500 text-black border border-gray-400",
        filled: "bg-teal-200 text-white",
      },
      rounded: "rounded-2xl",
      anotherOption: {
        on: "option-on",
        off: "options-off",
      },

      // dynamic options via function
      dynamicOptions: (value) => {
        if (value < 50) return "less-than-50";
        if (value > 50) return "more-than-50";
        return ["value-is-50", "dynamic-options-50"];
      },

      // use $ as a prefix to mark a prop as "native" (comes from the native HTML element we are extending)
      $disabled: "btn-disabled",

      // use $$ as a prefix to apply classes if a prop is present, ignoring what value it has
      $$title: "btn-has-title",

      // we can also target data-attributes:
      "data-something": {
        a: "something-a",
        b: "something-b",
      },
    },
  },
  {
    // defaults, will apply classes as if <... variant="none">
    variant: "none",
  }
);
```
