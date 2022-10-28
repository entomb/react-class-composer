# React Class Composer
![image](https://user-images.githubusercontent.com/57768/198602737-edb226d8-e482-48a1-b7e6-d1b61821108f.png)

Simple tool to compose css classnames based on component props

## How does it work?

use `createComponent()` we can create and forward a native HTML component:

```ts
import { HTMLAttributes } from 'react';
import { createComponent } from 'react-class-composer';

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
import React from 'react';
import { useClassComposer } from 'react-class-composer';

interface Props {
  size: 'small' | 'medium' | 'large',
  something: React.ReactNode
}

export const YourComponent: React.FC<Props> = (props) => {

  const { className } = useClassComposer<Pick<Props, 'size'>>({
    base: 'base-class',
    options: {
      size: {
        small: 'small-class',
        medium: 'medium-class',
        large: 'large-class',
      },
    }
  }, props)

  return <div className={className}>
    your component
    {props.something}
  </div>
}
```


# Full Example
```ts
import { ButtonHTMLAttributes } from 'react';
import { createComponent, mixAddClass, mixFunction, mixRemoveClass } from 'react-class-composer';

type ButtonProps = {
  size: 'tiny' | 'small' | 'medium' | 'large';
  variant?: 'none' | 'outline' | 'filled'
  rounded?: boolean;
  anotherOption?: "on" | "off";
  dynamicOptions?: number;
} & Partial<{ // alias: 
  round: ButtonProps["rounded"],
  v: ButtonProps["variant"],
}>

export const Button = createComponent<ButtonProps, HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>("button", {
  base: [
    "btn",
    { hover: ['btn-hover', 'text-bold'] },
    () => "btn-base"
  ],
  mix: [
    mixAddClass(['size.tiny', 'variant.outline'], 'size-tiny-outline-mix'),
    mixRemoveClass(['size.tiny', 'variant.filled'], ['btn-base', { hover: 'btn-hover' }, 'hover:text-bold']),
    mixRemoveClass(['data-something.a'], ['btn-base']),
    mixFunction(['anotherOption.*', 'disabled.true'], (css) => css.add("any-anotherOptions-disabled-true")),
    { when: ['type.reset'], run: (css) => css.add("btn-reset") }
  ],
  alias: {
    v: "variant",
    round: "rounded"
  },
  options: {
    size: {
      tiny: 'padding-tiny margin-tiny',
      small: ['padding-medium', 'margin-medium', ['text-medium', 'font-something']],
      medium: () => `medium-stuff class-returned-by-function`,
      large: { large: ['text', 'font', 'padding'], key: { abc: ['a', 'b', 'c'], num: ["n1", "n2", "n3"] } },
    },
    $type: {
      submit: 'btn-submit',
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
      if (value < 50) return "less-than-50";
      if (value > 50) return "more-than-50";
      return ["value-is-50", "dynamic-options-50"]
    },
    rounded: "rounded-2xl",
    $disabled: "btn-disabled",
    $$autoFocus: "",
    $$title: "btn-has-title",
    'data-something': {
      a: "something-a",
      b: "something-b",
    }
  },
}, {
  variant: "none",
}) 

```


