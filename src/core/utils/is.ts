export const isPromise = (promise: any) => typeof promise?.then === 'function'
export const isObject = (value: unknown) => typeof value === "object" && !Array.isArray(value) && value !== null
export const isAsyncFn = (fn: Function) => isFn(fn) && fn.constructor.name === 'AsyncFunction'
export const isFn = (fn: Function) => typeof fn === 'function'
export const isIterable = <T>(value?: unknown): value is (object & Iterable<T>) => typeof value === 'object' && value !== null && Symbol.iterator in value;
export const isAsyncIterable = <T>(value?: unknown): value is (object & AsyncIterable<T>) => typeof value === 'object' && value !== null && Symbol.asyncIterator in value;
