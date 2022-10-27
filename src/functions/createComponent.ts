import React, { forwardRef, AllHTMLAttributes, HTMLAttributes } from "react"
import { useComponentConfig } from "../hooks/useClassComposer";
import { ComposedComponent, CustomAttributes, ComposerConfig } from "../types"



export function createComponent<
  P extends CustomAttributes,
  EL extends HTMLElement,
  A extends HTMLAttributes<EL> = AllHTMLAttributes<EL>
>(
  el: React.ElementType,
  config: ComposerConfig<P, A>,
  defaults: Partial<P> = {}
): ComposedComponent<P, EL, A> {

  return forwardRef<EL, P & A>((innerProps, ref) => {
    const { className, forwardProps } = useComponentConfig<P, A>({ config, props: { ...defaults, ...innerProps } });

    return React.createElement(el, { ref, ...forwardProps, className }, innerProps.children)
  })
}
