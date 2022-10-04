import type { AppContext } from "./context";

// `Middleware` configs
export type MiddlewareType = 'before' | 'after' | 'error'
export const NoOpMiddleware: MiddlewareFunction = (_, next) => next();
export type MiddlewareMeta = {
    isFirst: boolean,
    isLast: boolean
}

// `Middleware` return types
export type MiddlewareFuncResp = void | Response;
export type MiddlewareNextFunc = () => Promise<MiddlewareFuncResp>;

// `Middleware` function types
export type MiddlewareFunction<M extends Record<string, any> = {}> = (
	context: AppContext<M>,
	next: MiddlewareNextFunc,
    meta?: MiddlewareMeta
) => Promise<MiddlewareFuncResp>;
export type MiddlewareFunctionInitializer<
    T extends Record<string, string|boolean|number|Function|Object > = {},
    S extends Record<string, any> = {}> = (options?: T) => MiddlewareFunction<S>

/**
 * Execute a sequence of middlewares
 * @param context
 * @param middlewares
 * @returns
 */
export async function exec<M extends Record<string, any> = {}>(context: AppContext<M>, middlewares: Array<MiddlewareFunction<M>>) {
    let prevIndexAt: number = -1;

    async function runner(indexAt: number): Promise<MiddlewareFuncResp> {
      if (indexAt <= prevIndexAt) {
        throw new Error(`next() called multiple times by middleware #${indexAt}`)
      }

      prevIndexAt = indexAt;
      const middleware = middlewares[indexAt];
      if (middleware) {
        const resp = await middleware(context, () => {
            return runner(indexAt + 1);
        }, {
            isFirst: indexAt === 0,
            isLast: indexAt === middlewares.length - 1,
        });
        if (resp) return resp;
     }
    }

    return runner(0)
}
