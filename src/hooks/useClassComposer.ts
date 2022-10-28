import { HTMLAttributes, useMemo } from "react";
import { shouldMix } from "../functions/mixFunctions";
import { parseDefinition } from "../functions/parseDefinition";
import { ClassComposerOptions, ClassComposerReturns, CustomAttributes } from "../types";



export function useClassComposer<
  P extends CustomAttributes,
  A extends HTMLAttributes<any>
>({ config, props }: ClassComposerOptions<P, A>): ClassComposerReturns<A> {
  return useMemo(() => {
    // useMemo does nothing here, this should be an external hook with memoized return values
    const propOptions: string[] = []
    const propCss = new Set<string>();
    const optionEntries = Object.entries(config.$options)
    const optionAlias = Object.entries(config.$alias || [])
    const forwardProps = {} as unknown as React.PropsWithChildren<A>

    // load base
    parseDefinition(true, config.$base).forEach(s => propCss.add(s))

    // load props
    for (const [key, propValue] of Object.entries(props)) {
      const entry = optionEntries
        .find(([k]) => {
          return k === key
            || k === "$" + key
            || k === "$$" + key
            || optionAlias.find(([alias, target]) => alias === key && target === k)
        }) // find key or alias



      if (entry) {
        const [entryKey, entryValue] = entry;
        if (propValue && entryValue) {
          parseDefinition(
            entryKey.startsWith("$$") ? true : propValue,
            entryValue
          ).forEach(s => propCss.add(s))
          propOptions.push(`${key}.${propValue}`)
        } else if (propValue === true) {
          // consider option turned on even if it doesn't result in new classes being added
          propOptions.push(`${key}.${propValue}`)
        }

        if (entryKey.startsWith("$")) { // forward props starting with $
          Object.assign(forwardProps, { [key]: propValue })
        }

      } else {
        // save prop to forward
        Object.assign(forwardProps, { [key]: propValue })
      }
    }

    for (const mixer of config.$mix || []) {
      if (shouldMix(mixer.when, propOptions)) {
        mixer.run(propCss)
      }
    }

    if (props.className) {
      props.className.split(" ").forEach(s => propCss.add(s))
    }

    // merge with overwrite classname
    const className: string = Array.from(propCss).join(" ");

    return {
      forwardProps,
      className,
    }

  }, [props])
}