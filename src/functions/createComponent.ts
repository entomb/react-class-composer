import React, { forwardRef, AllHTMLAttributes, HTMLAttributes } from "react"
import { useComponentConfig } from "../hooks/useComponentConfig";
import { CustomAttributes, FragmentConfig } from "../types"


export function createComponent<
  P extends CustomAttributes,
  EL extends HTMLElement,
  A extends HTMLAttributes<EL> = AllHTMLAttributes<EL>
>(
  Element: React.ElementType,
  config: FragmentConfig<P, A>,
  defaults: Partial<P> = {}
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P & A> & React.RefAttributes<EL>> {

  return forwardRef<EL, P & A>((innerProps, ref) => {
    const { className, forwardProps } = useComponentConfig<P, A>({ config, props: { ...defaults, ...innerProps } });

    return React.createElement(Element, { ref, ...forwardProps, className }, innerProps.children)
  })
}
