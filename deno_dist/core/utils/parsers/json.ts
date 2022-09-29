export const jsonSafeParse = (text: string | Record<string, any>, reviver: ((this: any, key: string, value: any) => any) | undefined = undefined) => {
    if (typeof text !== 'string') return text
    const firstChar = text[0]
    if (firstChar !== '{' && firstChar !== '[' && firstChar !== '"') return text
    try {
      return JSON.parse(text, reviver)
    } catch (e) {}

    return text
  }

export const jsonSafeStringify = (value: any, replacer: any, space: any) => {
    try {
      return JSON.stringify(value, replacer, space)
    } catch (e) {}
    return value
}
