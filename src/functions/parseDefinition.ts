import { CustomAttributeValue, ClassDefinition } from "../types";


export function parseDefinition(propValue: CustomAttributeValue, propDefinition: ClassDefinition, prefix: string = ""): string[] {
  if (typeof propDefinition === 'string') { // prop: string
    if (propValue === true && propDefinition) {
      return propDefinition.split(/\s+/).map(s => prefix + s.trim()) // split string into multiple parts because we always return array of single classes
    }
  } else if (propDefinition instanceof Array) { //  prop: string[]
    if (propValue === true) {
      return propDefinition.flatMap(d => parseDefinition(true, d, prefix))
    }
  } else if (typeof propDefinition === 'function') {

    return parseDefinition(true, propDefinition(propValue), prefix)
  } else if (typeof propDefinition === 'object') {//  prop: {key: value?}  // propDefinition.toString() === "[object Object]" 

    // test if propValue exists in propDefinition
    if (propDefinition.hasOwnProperty("" + propValue)) {
      return parseDefinition(true, propDefinition[("" + propValue)], prefix)
    }

    // prop: {pseudo: value}
    return Object.keys(propDefinition).flatMap(key => {
      return parseDefinition(propValue, propDefinition[key], prefix + `${key}:`)
    })
  }

  return []
}