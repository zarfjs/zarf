export const isPromise = (promise: any) => typeof promise?.then === 'function'
export const isObject = (item: any) => typeof item === "object" && !Array.isArray(item) && item !== null
export const isAsyncFn = (fn: Function) => typeof fn === 'function' && fn.constructor.name === 'AsyncFunction'
