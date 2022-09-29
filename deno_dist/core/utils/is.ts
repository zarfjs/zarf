export const isPromise = (promise: any) => typeof promise?.then === 'function'
export const isObject = (item: any) => typeof item === "object" && !Array.isArray(item) && item !== null
export const isAsyncFn = (fn: Function) => isFn(fn) && fn.constructor.name === 'AsyncFunction'
export const isFn = (fn: Function) => typeof fn === 'function'
