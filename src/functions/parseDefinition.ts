import { CustomAttributeValue, FragmentDefinition } from "../types";


export function parseDefinition(propValue: CustomAttributeValue, propDefinition: FragmentDefinition, prefix: string = ""): string[] {
  if (typeof propDefinition === 'string') { // prop: string
    if (propValue === true) {
      return propDefinition.split(" ").map(s => prefix + s) // split string into multiple parts because we always return array of single classes
    }
  } else if (propDefinition instanceof Array) { //  prop: string[]
    if (propValue === true) {
      return propDefinition.map(d => parseDefinition(true, d, prefix)).flat()
    }
  } else if (typeof propDefinition === 'function') {

    return parseDefinition(true, propDefinition(propValue), prefix)

  } else if (propDefinition.toString() === "[object Object]") {//  prop: {key: value?} 

    // test if propValue exists in propDefinition
    const maybeObj = propDefinition?.[("" + propValue)]
    if (maybeObj) {
      return parseDefinition(true, maybeObj, prefix)
    }

    // prop: {pseudo: value}
    return Object.keys(propDefinition).map(key => {
      return parseDefinition(propValue, propDefinition[key], prefix + `${key}:`)
    }).flat()
  }

  return []
}  