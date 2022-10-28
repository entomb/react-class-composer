import React, { forwardRef, AllHTMLAttributes, HTMLAttributes, ElementType } from "react"
import { useClassComposer } from "../hooks/useClassComposer";
import { ComposedComponent, CustomAttributes, ComposerConfig } from "../types"

export function createComponent<
  P extends CustomAttributes,
  EL extends HTMLElement,
  A extends HTMLAttributes<EL> = AllHTMLAttributes<EL>
>(
  el: ElementType,
  config: ComposerConfig<P, A>,
  defaults: Partial<P> = {}
): ComposedComponent<P, EL, A> {

  return forwardRef<EL, P & A>((innerProps, ref) => {
    const { className, forwardProps } = useClassComposer<P, A>({ config, props: { ...defaults, ...innerProps } });

    return React.createElement(el, { ref, ...forwardProps, className }, innerProps.children)
  })
}
