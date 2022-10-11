import { escapeHtml } from '../oss/escape_html'
export type EscapedString = string & { isEscaped: true }

export const html = (strings: TemplateStringsArray, ...values: any[]): EscapedString => {
  const html = ['']
  for (let i = 0, length = strings.length - 1; i < length; i++) {
    html[0] += strings[i]
    let valueEntries = values[i] instanceof Array ? values[i].flat(Infinity) : [values[i]]
    for (let i = 0, len = valueEntries.length; i < len; i++) {
      const value = valueEntries[i]
      if (typeof value === 'string') {
        html[0] += escapeHtml(value)
      } else if (typeof value === 'boolean' || value === null || value === undefined) {
        continue
      } else if (
        (typeof value === 'object' && (value as EscapedString).isEscaped) ||
        typeof value === 'number'
      ) {
        html[0] += value
      } else if (typeof value === 'function') {
        html[0] += value()
      } else {
        html[0] += escapeHtml(value.toString())
      }
    }
  }

  const escapedString = new String(html[0]) as EscapedString
  escapedString.isEscaped = true

  return escapedString
}
