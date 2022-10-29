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

export const Button = createComponent<ButtonProps, "button">("button", {
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
    { when: ['type.reset'], run: (css) => css.add("btn-reset") },
    { when: ['formNoValidate.true'], run: (css) => css.add("form-no-validate") }
  ],
  alias: {
    v: "variant", // v="outline" is interpreted as variant="outline"
    round: "rounded"
  },
  options: {
    size: {
      tiny: 'padding-tiny margin-tiny', // you can use string
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
    $$title: "btn-has-title",
    'data-something': {
      a: "something-a",
      b: "something-b",
    }
  },
}, {
  variant: "none",
}) 
