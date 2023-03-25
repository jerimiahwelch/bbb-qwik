import { decode } from 'html-entities'

/**
 * Decode html entities across a set of properties
 * @param obj - Object with string properties to be html decoded
 * @param props - which properties to decode
 * @returns undefined
 */
export const decodeProps = (obj: any, props: string[]) => {
  for (const prop of props) {
    obj[prop] = decode(obj[prop], { level: 'html5' })
  }
}

/**
 * Prepares a value for inclusion in a string literal.
 * Prevents this kind of unexpected behavior:
 *   `${undefined}` => 'undefined'
 *   `${null}` => 'null'
 * @param value - anything at all
 * @returns stringified value
 */
export const valOrEmptyString = (value: any | undefined | null) => {
  return `${value || ''}`
}
