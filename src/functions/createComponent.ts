import { createElement, forwardRef, PropsWithChildren, ComponentProps } from "react"
import { useClassComposer } from "../hooks/useClassComposer";
import { CustomAttributes, ComposerConfig, ComposedComponent, ExtendableElement } from "../types"

/** 
 * Create a React component that extends and creates a forwardRef of native HTML element. 
 *
 *
 * @template P extends CustomAttributes
 * @template EL extends ExtendableElement
 * @param {EL} el defaults to "div"
 * @param {ComposerConfig<P, ComponentProps<EL>>} config
 * @param {Partial<P>} [defaults={}]
 * @returns {ComposedComponent<P, EL>}
 * 
 * @see {ComposerConfig}
 * @see {ClassDefinition} 
 */
export function createComponent<
  P extends CustomAttributes,
  EL extends ExtendableElement = "div",
>(
  el: EL,
  config: ComposerConfig<P, ComponentProps<EL>>,
  defaults: Partial<P> = {}
): ComposedComponent<P, EL> {

  return forwardRef<typeof el, PropsWithChildren<P & ComponentProps<typeof el>>>((innerProps, ref) => {
    const { className, forwardProps } = useClassComposer<P, typeof el>(config, { ...defaults, ...innerProps });

    return createElement(el, { ref, ...forwardProps, className }, innerProps.children)
  })
}