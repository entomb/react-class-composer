import { HTMLAttributes } from "react";

export type CustomAttributeValue = string | number | boolean | undefined
export type CustomAttributes = Record<string, CustomAttributeValue>

export type ExcludeFromHTMLElement<S, T> = S & { [K in keyof T]?: never }
export type FragmentClassFn = ((value: CustomAttributeValue) => FragmentDefinition)
export type FragmentClass = string | FragmentClassFn | { [pseudo: string]: FragmentClass } | FragmentClass[];

export type FragmentDefinition = Record<string, FragmentClass> | FragmentClass;

export type FragmentOptions<T> = {
  [K in T as string]: FragmentDefinition;
}

export type FragmentMixerFactory<T> = (when: string[], arg: T) => FragmentMixer
export type FragmentMixerFn = (css: Set<string>) => void
export type FragmentMixer = {
  when: string[],
  run: FragmentMixerFn
}

export interface FragmentConfig<T extends CustomAttributes, A = {}> {
  $base: FragmentClass;
  $options: ExcludeFromHTMLElement<FragmentOptions<T>, A>;
  $mix?: FragmentMixer[];
  $alias?: Record<string, string>;
  // $mix?: Array<{
  //   props: string[];
  //   remove: string;
  //   add: FragmentClass;
  // }>;
}

export interface ComponentConfigHookProps<P extends CustomAttributes, A extends HTMLAttributes<any>> {
  config: FragmentConfig<P, A>,
  props: React.PropsWithChildren<P & A>
}

export interface ComponentConfigHookReturns<A extends HTMLAttributes<any>> {
  className: string;
  forwardProps: React.PropsWithChildren<A>
}
