import type { Controller, Route, RouteMethod  } from './types'
import { ROUTE_OPTION_DEFAULT } from './types'
import { AppContext } from './context'
import { MiddlewareFunction, exec, MiddlewareType } from './middleware'
import { isObject } from './utils/is'


interface BunTeaOptions {
    port?: number,
    development?: boolean,
    hostname?: string
}


export class BunTea<S extends Record<string, any> = {}> {
    private routes: Record<RouteMethod, Array<Route>> = {
        'get': [],
        'post': [],
        'put': [],
        'patch': [],
        'delete': []
    }

    private middlewares: Record<MiddlewareType, Array<MiddlewareFunction<S>>> = {
        'before': [],
        'after': [],
        'error': []
    }

    notFoundHandler = (): Response | Promise<Response> => {
        return new Response("404 Not Found", {
          status: 404,
        });
    };

    /**
     *
     * @param method
     * @param url
     * @param args
     * @returns
     */
    private register(method: RouteMethod, url: string, ...args: any) {

        let id = url.toString()
        // Prepare route options
        let options: Record<string | symbol, string | Record<string, string>> = {}
        if(isObject(args.at(-1))) {
            options = args.pop()
        }
        options[ROUTE_OPTION_DEFAULT] = options[ROUTE_OPTION_DEFAULT] || {}

        let controller: Controller;
        let middlewares: Array<MiddlewareFunction> = []
        if(args.length === 1) {
            controller = args.pop()
        } else if(args.length === 2) {
            controller = args.pop()
            middlewares = args.pop()
        } else {
            return new Error('too many arguments provided')
        }

        const parts = url.split("/").filter(part => part !== "")
        const vars: Array<string> = []

        const regExpParts = parts.map(part => {
            if(part[0] === ':') {
                vars.push(part.slice(1))
                return `([a-zA-Z0-9]+)`
            } else if (parts[0] === '*') {
                vars.push(part.slice(1))
                return `(.*)`
            } else {
                return part
            }
        })
        const regExp = regExpParts.join("/")

        this.routes[method].push({
            id,
            matcher: new RegExp(`^/${regExp}$`),
            vars,
            controller,
            options,
            middlewares
        })
    }

    /**
     *
     * @param method
     * @param path
     * @returns
     */
    private resolve(method: RouteMethod, path: string) {

        const route = this.routes[method].find(route => route.matcher.test(path))
        if(!route) return undefined

        const matches = route.matcher.exec(path)

        const options = route.options
        const params: {[key: string]: string } = options[ROUTE_OPTION_DEFAULT] || {}

        if(matches) {
            route.vars.forEach((val, index) => {
                if(matches[index + 1]){
                    params[val] = decodeURIComponent(matches[index + 1])
                }
            })
        }

        return {
            ...route,
            params
        }
    }

    /**
     *
     * @param req
     * @returns
     */
    private async handle(req: Request) {
        const ctx = new AppContext<S>(req)
        const { path, method, url } = ctx

        if(this.middlewares.before.length) {
            const resp = await exec(ctx, this.middlewares.before)
        }

        const route = this.resolve(method, path)
        if(route) {
            // use middlewares
            if(route.middlewares && route.middlewares.length) {
                try {
                    const resp = await exec(ctx, route.middlewares)
                    if(resp || ctx.isImmediate) return resp as Response
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        return new Response(error.message, { status: 400 });
                    }
                }
            }
            if(route.controller) {
                try {
                    const response = await route.controller(ctx as AppContext<S>, {...route.params, ...{}})
                    if(ctx.isImmediate) return response
                    /**
                     * Run after middleware here
                     */
                    if(this.middlewares.after.length) {
                        ctx.response = response
                        const resp = await exec(ctx, this.middlewares.after)
                        if(resp) return resp
                    }
                    return response;
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        return new Response(error.message, { status: 400 });
                    }
                }
            }
        }
        return new Response("No matching routes discovered!", { status: 404 })
    }

    /**
     *
     * @param path
     * @param controller
     */
    get<T extends Record<string, string> = {}>(path: string, controller: Controller<T, S>): void;
    get<T extends Record<string, string> = {}>(path: string, middlewares: Array<MiddlewareFunction>, controller: Controller<T, S>): void;
    get<T extends Record<string, string> = {}>(path: string, ...args: Array<Controller<T, S> | Array<MiddlewareFunction>>) {
        this.register('get', path, ...args);
        return this
    }

    /**
     *
     * @param path
     * @param controller
     */
    post<T extends Record<string, string> = {}>(path: string, controller: Controller<T, S>): void;
    post<T extends Record<string, string> = {}>(path: string, middlewares: Array<MiddlewareFunction>, controller: Controller<T, S>): void;
    post<T extends Record<string, string> = {}>(path: string, ...args: Array<Controller<T, S> | Array<MiddlewareFunction>>) {
        this.register('post', path, ...args);
        return this
    }

    /**
     *
     * @param path
     * @param controller
     */
    put<T extends Record<string, string> = {}>(path: string, controller: Controller<T, S>): void;
    put<T extends Record<string, string> = {}>(path: string, middlewares: Array<MiddlewareFunction>, controller: Controller<T, S>): void;
    put<T extends Record<string, string> = {}>(path: string, ...args: Array<Controller<T, S> | Array<MiddlewareFunction>>) {
        this.register('put', path, ...args)
        return this
    }

    /**
     *
     * @param path
     * @param controller
     */
    patch<T extends Record<string, string> = {}>(path: string, controller: Controller<T, S>): void;
    patch<T extends Record<string, string> = {}>(path: string, middlewares: Array<MiddlewareFunction>, controller: Controller<T, S>): void;
    patch<T extends Record<string, string> = {}>(path: string, ...args: Array<Controller<T, S> | Array<MiddlewareFunction>>) {
        this.register('patch', path, ...args)
        return this
    }

    /**
     *
     * @param path
     * @param controller
     */
    del<T extends Record<string, string> = {}>(path: string, controller: Controller<T, S>): void;
    del<T extends Record<string, string> = {}>(path: string, middlewares: Array<MiddlewareFunction>, controller: Controller<T, S>): void;
    del<T extends Record<string, string> = {}>(path: string, ...args: Array<Controller<T, S> | Array<MiddlewareFunction>>) {
        this.register('delete', path, ...args)
        return this
    }


    /**
     *
     * @param middleware
     * @param type
     * @returns
     */
    use (middleware: MiddlewareFunction<S>, type: MiddlewareType = 'before') {
        this.middlewares[type].push(middleware)
        return this
    }

    listen({
        port = 3333,
        development = false,
        hostname = '0.0.0.0'
    }: BunTeaOptions) {
        const self = this
        if (!Bun) throw new Error('Bun-Tea required Bun to run')
        const server = Bun.serve({
            port,
            hostname,
            development: process.env.NODE_ENV !== "production" || development,
            async fetch(request: Request) {
                return await self.handle(request)
            },
            error(error: Error) {
                return new Response("Uh oh!!\n" + error.toString(), { status: 500 });
            }
        })
        console.info(`Bun Tea started on the port: ${server.port}`)
        return server
    }
}
