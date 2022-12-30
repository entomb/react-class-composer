import { ClassDefinition, ClassMixerFactory, ClassMixerFn } from "../types";
import { parseDefinition } from "./parseDefinition";

export const shouldMix = (when: string[], optionArr: string[]): boolean => {
  return when.every((w) => {
    if (typeof w !== "string") {
      return false;
    }

    if (w.endsWith("*")) {
      // allow wildcards
      return optionArr.some(
        (o) => o.split(".").shift() === w.split(".").shift()
      );
    }

    return optionArr.some((o) => o === w); // simnple find
  });
};

export const mixFunction: ClassMixerFactory<ClassMixerFn> = (when, run) => ({
  when,
  run,
});

export const mixAddClass: ClassMixerFactory<ClassDefinition> = (when, arg) => {
  return {
    when,
    run: (css) => {
      const argCss = parseDefinition(true, arg);
      argCss.forEach((s) => css.add(s));
    },
  };
};

export const mixRemoveClass: ClassMixerFactory<ClassDefinition> = (
  when,
  arg
) => {
  return {
    when,
    run: (css) => {
      const argCss = parseDefinition(true, arg);
      argCss.forEach((s) => css.delete(s));
    },
  };
};
