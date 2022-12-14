import { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes, PropsWithChildren, ComponentProps } from "react";

export type AsProp = { as?: keyof JSX.IntrinsicElements }
export type ExtendableElement = keyof JSX.IntrinsicElements | React.ElementType | React.ComponentType<any>

export type ComponentAttributes = Record<any, any>
export type CustomAttributes = { [k: string]: CustomAttributeValue | undefined }
export type CustomAttributeValue = string | number | boolean

/**
 * A Special type that does not allow on @S any key from @T
 *
 * @export
 * @typedef {Exclude}
 * @template S
 * @template T
 */
export type Exclude<S, T> = S & { [K in keyof T]?: never }


/**
 * A class definition can be any of the following:
 * - A string with a single word: 'btn'
 * - A multiple word string: 'btn btn-primary'
 * - An array with more ClassDefinition[]
 * - A {key: ClassDefinition} object, where `key` will be used as a prefix
 * - A function that returns a ClassDefinition: () => ['a','b']
 * 
 * Any ClassDefinition will be recursively parsed until it is just a string.
 * 
 * @example: {
 *   a: 'btn',
 *   b: 'btn btn-primary',
 *   c: ['a', 'b', 'c'],
 *   d: ['a', { hover: 'b' }, ['c', 'd'], () => ({ dark: ['x', 'y', 'z'] })]
 * }
 * 
 * @export
 * @typedef {ClassDefinition}
 */
type Falsy = undefined | null | false | 0 | ""
export type ClassDefinition = Falsy | string | ClassDefinitionFn | { [key: string]: ClassDefinition } | ClassDefinition[];
export type ClassDefinitionFn = ((value: CustomAttributeValue) => ClassDefinition)
export type ComposerConfigOptions<T> = {
  [K in T as string]: ClassDefinition;
}
export type OptionAlias<T> = { [key: string]: keyof T }


export type ClassMixerFactory<T> = (when: string[], arg: T) => ClassMixer
export type ClassMixerFn = (css: Set<string>) => void
export type ClassMixer = {
  when: string[],
  run: ClassMixerFn
}


export interface ComposerConfig<
  P extends ComponentAttributes,
  EL extends ExtendableElement = "div"
> {
  /**
   * base classes, will always be applied
   *
   * @type {ClassDefinition}
   * @see {ClassDefinition}
   */
  base: ClassDefinition;
  /**
   * options are `[key,value]` pairs, where the key is the prop name.
   * 
   * - `key` should be present in the native HTML element props 
   * - to use a native prop, prefix it with `$`
   * - to check if a prop is present, prefix it with `$$`
   *
   * @type {ExcludeFromHTMLElement<ComposerConfigOptions<P>, ComponentProps<EL> & AsProp>}
   */
  options: Exclude<ComposerConfigOptions<P>, ComponentProps<EL> & AsProp>;
  /**
   * A mixer is an object that looks like {when: [], run: () => {}} 
   * and runs the function when the props match what was defined in the in the array
   * 
   * Conditions can be specific like when: ['disabled.true'] or generic like ['title.*']
   *
   * @type {?ClassMixer[]}
   */
  mix?: ClassMixer[];
  /**
   * a simple {key: value} object, where value must be a key of {options}
   *
   * @type {?OptionAlias<P>}
   */
  alias?: OptionAlias<P>
}


/**
 * Returns the classnames parsed from the options object and a set of properties to forward
 *
 * @export
 * @interface ClassComposerReturns
 * @typedef {ClassComposerReturns}
 * @template E extends ExtendableElement
 */
export interface ClassComposerReturns<
  EL extends ExtendableElement
> {
  /**
   * a string with css classnames 
   */
  className: string;
  /**
   * Contains any prop that is native to the HTML Element being forwarded
   * 
   * @type {PropsWithChildren<ComponentProps<EL>>}
   */
  forwardProps: PropsWithChildren<ComponentProps<EL>>
}


/**
 * A component that was created using createComponent, will be an instance of EL and  allow any property present in P and A 
 *
 * @export
 * @typedef {ComposedComponent}
 * @template P extends CustomAttributes
 * @template EL extends ExtendableElement
 */
export type ComposedComponent<
  P extends CustomAttributes,
  EL extends ExtendableElement
> = ForwardRefExoticComponent<PropsWithoutRef<ComposedComponentProps<P, EL>> & RefAttributes<EL>>

/**
 * Combines Props P with Component Pros from element EL and the {as?: ""} prop
 *
 * @export
 * @typedef {ComposedComponentProps}
 * @template P extends CustomAttributes
 * @template EL extends ExtendableElement
 */
export type ComposedComponentProps<
  P extends CustomAttributes,
  EL extends ExtendableElement
> = P & AsProp & ComponentProps<EL>