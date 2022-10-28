import { ButtonHTMLAttributes } from 'react';
import { createComponent } from '../../src/functions/createComponent';
import { mixAddClass, mixFunction, mixRemoveClass } from '../../src/functions/mixFunctions';

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
  /**
   * Base: base classes, will allways be applied
   */
  base: [
    "btn",
    { hover: ['btn-hover', 'text-bold'] }, // {key: 'value'} pairs will be exploded into prefixed classes like `key:value`
    () => "btn-base" // you can use functions to return a string or @ClassDefinition object
  ],
  /**
   * Mix: mix functions allow for conditional class toggling based on the multiple props.
   */
  mix: [
    // mixAddClass will add classes if all the conditions are true
    mixAddClass(['size.tiny', 'variant.outline'], 'size-tiny-outline-mix'),
    // mixRemoveClass will remove a class if all the conditions are true
    mixRemoveClass(['size.tiny', 'variant.filled'], ['btn-base', { hover: 'btn-hover' }, 'hover:text-bold']),
    // mix functions supprt wild card checks:
    mixRemoveClass(['data-something.a'], ['btn-base']),
    // you can run your own mix functions
    mixFunction(['anotherOption.*', 'disabled.true'], (css) => css.add("any-anotherOptions-disabled-true")),
    // or simply just pass in a mix object.
    { when: ['type.reset'], run: (css) => css.add("btn-reset") }
  ],
  /**
   * Alias: prop shortcuts for other options
   */
  alias: {
    v: "variant", // v="outline" is interpreted as variant="outline"
    round: "rounded"
  },
  /**
   * Options: options are [key,value] pairs, where the key is the prop name
   */
  options: {
    size: { // the value of the prop
      tiny: 'padding-tiny margin-tiny', // you can use string
      small: ['padding-medium', 'margin-medium', ['text-medium', 'font-something']], // or any combination of string[]
      medium: () => `medium-stuff class-returned-by-function`, // also suports () => string
      large: { large: ['text', 'font', 'padding'], key: { abc: ['a', 'b', 'c'], num: ["n1", "n2", "n3"] } }, // any object key will be parsed as "prefixed" class name
    },
    $type: { // use $ as a prefix to mark a prop as "native" (comes from the native HTML element we are extending) 
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
    $disabled: "btn-disabled", // use $ as a prefix to mark a prop as "native" (comes from the native HTML element we are extending) 
    $$title: "btn-has-title", // use $$ as a prefix to apply classes if a prop is present, ignoring what value it has
    'data-something': { // we can also target data-attributes:
      a: "something-a",
      b: "something-b",
    }
  },
}, {
  variant: "none",
}) 
