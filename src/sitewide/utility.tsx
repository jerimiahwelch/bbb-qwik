import { decode } from 'html-entities'

export const decodeProps = (obj: any, props: Array<string>) => {
  for (const prop of props) {
    obj[prop] = decode(obj[prop], { level: 'html5' })
  }
}
