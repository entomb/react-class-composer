import { HTMLAttributes, PropsWithChildren, useMemo } from "react";
import { shouldMix } from "../functions/mixFunctions";
import { parseDefinition } from "../functions/parseDefinition";
import { ClassComposerReturns, ComposerConfig, ComponentAttributes } from "../types";


/** 
 * Hook that parses a set of parameters based on a configuration object and returns applicable classnames
 *
 *
 * @export
 * @template P extends ComponentAttributes
 * @template A extends HTMLAttributes<any> = HTMLAttributes<any>
 * @param {ComposerConfig<P, A>} config the configuration object
 * @param {(P & A)} props the props to parse
 * @returns {ClassComposerReturns<A>} { className, forwardProps }
 */

export function useClassComposer<
  P extends ComponentAttributes,
  A extends HTMLAttributes<any> = HTMLAttributes<any>
>(config: ComposerConfig<P, A>, props: P & A): ClassComposerReturns<A> {
  return useMemo(() => {
    // useMemo does nothing here, this should be an external hook with memoized return values
    const propOptions: string[] = []
    const propCss = new Set<string>();
    const optionEntries = Object.entries(config.options)
    const optionAlias = Object.entries(config.alias || [])
    const forwardProps = {} as unknown as PropsWithChildren<A>

    // load base
    parseDefinition(true, config.base).forEach(s => propCss.add(s))

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
        }

        if (entryKey.startsWith("$")) { // forward props starting with $
          Object.assign(forwardProps, { [key]: propValue })
        }

      } else {
        // save prop to forward
        propOptions.push(`${key}.${propValue}`)
        Object.assign(forwardProps, { [key]: propValue })
      }
    }

    for (const mixer of config.mix || []) {
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