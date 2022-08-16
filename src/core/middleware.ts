import type { AppContext } from "./context";

export type MiddlewareFuncResp = void | Response;
export type MiddlewareNextFunc = () => Promise<MiddlewareFuncResp>;
export type MiddlewareFunction<S extends Record<string, any> = {}> = (
	context: AppContext<S>,
	next: MiddlewareNextFunc
) => Promise<MiddlewareFuncResp>;
export type MiddlewareFunctionInitializer<
    T extends Record<string, string|boolean|number|Function > = {},
    S extends Record<string, any> = {}> = (options?: T) => MiddlewareFunction<S>

export type MiddlewareType = 'before' | 'after' | 'error'
export const NoOpMiddleware: MiddlewareFunction = (_, next) => next();

export async function exec<T extends Record<string, any> = {}, S extends Record<string, any> = {}>(context: AppContext<S>, middlewares: Array<MiddlewareFunction<S>>) {
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
        });
        if (resp) return resp;
     }
    }

    return runner(0)
}
