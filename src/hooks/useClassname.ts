import { useMemo } from 'react';
import { parseDefinition } from "../functions/parseDefinition";
import { ClassDefinition } from '../types'

export function useClassname(definitions: ClassDefinition): string {
  return useMemo(() => {
    const css = new Set<string>();

    parseDefinition(true, definitions).forEach(s => css.add(s))

    return Array.from(css).join(" ");
  }, [definitions])
}