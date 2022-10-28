import { AllHTMLAttributes, ForwardRefExoticComponent, HTMLAttributes, PropsWithoutRef, RefAttributes, PropsWithChildren } from "react";


export type CustomAttributeValue = string | number | boolean
export type CustomAttributes = { [k: string]: CustomAttributeValue | undefined }
export type ComponentAttributes = Record<any, any>


export type ExcludeFromHTMLElement<S, T> = S & { [K in keyof T]?: never }

export type ClassDefinitionFn = ((value: CustomAttributeValue) => ClassDefinitionObject)
export type ClassDefinition = string | ClassDefinitionFn | { [pseudo: string]: ClassDefinition } | ClassDefinition[];
export type ClassDefinitionObject = Record<string, ClassDefinition> | ClassDefinition;
export type ComposerConfigOptions<T> = {
  [K in T as string]: ClassDefinitionObject;
}

export type ClassDefinitionAlias<T> = { [key: string]: keyof T }

export type ClassMixerFactory<T> = (when: string[], arg: T) => ClassMixer
export type ClassMixerFn = (css: Set<string>) => void
export type ClassMixer = {
  when: string[],
  run: ClassMixerFn
}

export interface ComposerConfig<P extends ComponentAttributes, A = {}> {
  base: ClassDefinition;
  options: ExcludeFromHTMLElement<ComposerConfigOptions<P>, A>;
  mix?: ClassMixer[];
  alias?: ClassDefinitionAlias<P>
}


export interface ClassComposerReturns<A extends HTMLAttributes<any>> {
  className: string;
  forwardProps: PropsWithChildren<A>
}


export type ComposedComponent<
  P extends CustomAttributes,
  EL extends HTMLElement,
  A extends HTMLAttributes<EL> = AllHTMLAttributes<EL>
> = ForwardRefExoticComponent<PropsWithoutRef<P & A> & RefAttributes<EL>>