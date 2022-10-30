import { createElement, forwardRef } from "react"
import { useClassComposer } from "../hooks/useClassComposer";
import { CustomAttributes, ComposerConfig, ComposedComponent, ComposedComponentProps, ExtendableElement, } from "../types"




/** 
 * Create a React component that extends and creates a forwardRef of native HTML element. 
 *
 *
 * @template P extends CustomAttributes
 * @template EL extends ExtendableElement
 * @param {EL} el defaults to "div"
 * @param {ComposerConfig<P, EL>} config
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
  config: ComposerConfig<P, EL>,
  defaults: Partial<P> = {}
): ComposedComponent<P, EL> {

  return forwardRef<typeof el, ComposedComponentProps<P, EL>>((innerProps, ref) => {
    const ele: ExtendableElement = innerProps.as || el;
    const props = { ...defaults, ...innerProps }
    delete props.as;
    const { className, forwardProps } = useClassComposer<ComposedComponentProps<P, EL>, typeof el>(config, props);

    return createElement(ele, { ref, ...forwardProps, className }, innerProps.children)
  })
}

