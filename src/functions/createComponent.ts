import { createElement, forwardRef, AllHTMLAttributes, HTMLAttributes, ElementType, PropsWithChildren } from "react"
import { useClassComposer } from "../hooks/useClassComposer";
import { ComposedComponent, CustomAttributes, ComposerConfig } from "../types"

/** 
 * Create a React component that extends and creates a forwardRef of native HTML element. 
 *
 *
 * @template P extends CustomAttributes
 * @template EL extends HTMLElement
 * @template A extends HTMLAttributes<EL> = AllHTMLAttributes<EL>
 * @param {ElementType} el  the HTML Element to extend, usually a JSX tagname from {React.IntrinsicElements}
 * @param {ComposerConfig<P, A>} config  the Composer Config object/
 * @param {Partial<P>} [defaults={}]  any defaults to be applied to the parameters.
 * @returns {ComposedComponent<P, EL, A>}
 * 
 * @see {ComposerConfig}
 * @see {ClassDefinition}
 */
export function createComponent<
  P extends CustomAttributes,
  EL extends HTMLElement,
  A extends HTMLAttributes<EL> = AllHTMLAttributes<EL>
>(
  el: ElementType,
  config: ComposerConfig<P, A>,
  defaults: Partial<P> = {}
): ComposedComponent<P, EL, A> {

  return forwardRef<EL, PropsWithChildren<P & A>>((innerProps, ref) => {
    const { className, forwardProps } = useClassComposer<P, A>(config, { ...defaults, ...innerProps });

    return createElement(el, { ref, ...forwardProps, className }, innerProps.children)
  })
}
