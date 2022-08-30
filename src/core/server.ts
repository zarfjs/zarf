import type { Errorlike, Server } from 'bun'
import type { BunTeaConfig, BunTeaOptions, RouteStack, Controller, Route, RouteMethod  } from './types'

import { AppContext } from './context'
import { MiddlewareFunction, exec, MiddlewareType } from './middleware'

import { isObject } from './utils/is'
import { getMountPath } from './utils/app'

import { ROUTE_OPTION_DEFAULT } from './constants'
import { HTTP_STATUS_CODES } from './constants/codes'

export class BunTea<S extends Record<string, any> = {}> {
    /**
     * App Config
     */
    private readonly config: BunTeaConfig
    private server?: Server
    /**
     * App stores
     */
    private appList: Record<string, BunTea<any>> = {}
    /**
     * Route stores
     */
    private routes: Partial<Record<RouteMethod, Array<Route>>> = {}

    /**
     * Middleware stores
     */
    private middlewares: Record<MiddlewareType, Array<MiddlewareFunction<S>>> = {
        'before': [],
        'after': [],
        'error': []
    }

    private pathMiddlewares: Record<string, Record<MiddlewareType, Array<MiddlewareFunction<S>>>> = {}
    private pathWithMiddlewares: Array<string> = []

    /**
     * App Constructor
     * @param param0
     */
    constructor({
        appName = 'BunTeaRoot',
        serverHeader = `Bun-Tea`,
        strictRouting = false,
        getOnly = false,
        errorHandler = defaultErrorHandler
    }: BunTeaConfig = {}){
        this.config = {
            appName,
            serverHeader,
            strictRouting,
            getOnly,
            errorHandler
        }
    }

    /// SERVER ERROR HANDLERS ///
    /**
     *
     * @returns
     */
    private notFoundHandler = (): Response | Promise<Response> => {
        return new Response("No matching routes discovered!", {
          status: 404,
        });
    }

    // wrapper around the application's error handler method.
    // It maps a set of errors to app errors before calling the application's error handler method.
    // @TODO: Intercept all the error types
    serverErrorHandler = (err: Errorlike): Response | Promise<Response> | Promise<undefined> | undefined => {
        return new Response(err.message.toString(), { status: 500 });
        // check for errors like
        // - Header fields too large
        // - Request/Processing Timeout
        // - Request Body/Entity too large
        // - Method not allowed (for GET only requests)
        // - Or, just Bad request
        // and call the `app.errorHandler`
        // return this.errorHandler(ctx, error)
    }

    /**
     * Central error handler
     * @param ctx
     * @param error
     * @returns
     */
    errorHandler = (ctx: AppContext, error: Errorlike): Response | Promise<Response> | Promise<undefined> | undefined => {
        const path = ctx.request?.url || ''
        const basePath = path.substring(0, path.lastIndexOf('/'))
        if(basePath && this.appList[basePath]) {
            return this.appList[basePath].errorHandler(ctx, error)
        }else {
            return this.config.errorHandler?.(ctx, error)
        }
    }

    /// ROUTE METHODS ///

    /**
     * Register a new route
     * @param method the `verb` to listen to
     * @param url the relative path to listen to
     * @param args all the other arguments like
     * @returns
     */
    private register(method: RouteMethod, url: string, ...args: any): Error | undefined {

        let id = url.toString()

        // Prepare route options
        let options: Record<string | symbol, string | Record<string, string>> = {}
        if(isObject(args.at(-1))) {
            options = args.pop()
        }
        options[ROUTE_OPTION_DEFAULT] = options[ROUTE_OPTION_DEFAULT] || {}

        // Identify Handler and and/or middlewares
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

        // Prepare RegExp for path matching
        const parts = url.split("/").filter(part => part !== "")
        const vars: Array<string> = []

        // @TODO: Optimize RegExp creation approach
        const regExpParts = parts.map(part => {
            if(part[0] === ':') {
                if(part[part.length - 1] === '?') {
                    part = part.replace("?", '')
                    vars.push(part.slice(1))
                    return `([a-zA-Z0-9_-]*)`
                } else if(part.includes('.')) {
                    const subParts = part.split('.')
                    if(subParts[1][0] === ':') {
                        vars.push(`${subParts[0].slice(1)}_${subParts[1].slice(1)}`)
                        return `([a-zA-Z0-9_-]+.[a-zA-Z0-9_-]+)`
                    } else {
                        vars.push(subParts[0])
                        return `([a-zA-Z0-9_-]+.${subParts[1].slice(1)})`
                    }
                } else if(part.includes('-')) {
                    const subParts = part.split('-')
                    if(subParts[1][0] === ':') {
                        vars.push(`${subParts[0].slice(1)}_${subParts[1].slice(1)}`)
                        return `([a-zA-Z0-9_-]+-[a-zA-Z0-9_-]+)`
                    } else {
                        vars.push(subParts[0].slice(1))
                        return `([a-zA-Z0-9_-]+-${subParts[1]})`
                    }
                } else {
                    vars.push(part.slice(1))
                    return `([a-zA-Z0-9_-]+)`
                }
            } else if (part[0] === '*') {
                vars.push(part.slice(1))
                return `(.*)`
            } else if (part.includes('.')) {
                const subParts = part.split('.')
                vars.push(subParts[1].slice(1))
                return `(${subParts[0]}.[a-zA-Z0-9_-]+)`
            } else if(part.includes('::')) {
                const subParts = part.split('::')
                vars.push(subParts[0])
                return `(${subParts[0]}:[a-zA-Z0-9_-]+)`
            } else {
                return part
            }
        })
        const regExp = regExpParts.join("/")


        if(!this.routes[method]) this.routes[method] = []
        this.routes[method]!.push({
            id,
            matcher: new RegExp(`^/${regExp}$`),
            vars,
            controller,
            options,
            middlewares
        })
    }

    /**
     * Resolve, or identify a matching route
     * @param method
     * @param path
     * @returns
     */
    private resolve(method: RouteMethod, path: string) {

        const route = this.routes[method]!.find(route => route.matcher.test(path))
        if(!route) return undefined

        const matches = route.matcher.exec(path)

        const options = route.options
        const params: {[key: string]: string } = options[ROUTE_OPTION_DEFAULT] || {}

        if(matches) {
            route.vars.forEach((val, index) => {
                const match = matches[index + 1]
                if(match){
                    if(val.includes('_')) {
                        const matchParts = match.includes('-') ? match.split('-') : match.includes('.') ? match.split('.') : [ match ]
                        const valParts = val.split('_')
                        if(valParts.length === matchParts.length) {
                            valParts.forEach((val, index) => {
                                params[val] = matchParts[index]
                            })
                        }
                    } else {
                        params[val] = decodeURIComponent(
                            match.startsWith(`${val}:`) ? match.replace(`${val}:`, '') :
                            match.includes('.') ? match.substring(match.lastIndexOf('.') + 1, match.length) : match
                        )
                    }
                }
            })
        }

        return {
            ...route,
            params
        }
    }

    /**
     * Handle a route
     * @param req
     * @returns
     */
    private async handle(req: Request) {
        const ctx = new AppContext<S>(req, this.config)
        const { path , method } = ctx
        /**
         * Global "App-level" middlewares
         */
        if(this.middlewares.before && this.middlewares.before.length) {
            const resp = await exec(ctx, this.middlewares.before)
            if(resp || ctx.isImmediate) return resp
        }
        /**
         * Group-level middlewars. Could halt execution, or respond
         */
        const basePath = path.substring(0, path.lastIndexOf('/'))
        if(this.pathMiddlewares[path] && this.pathMiddlewares[path].before.length) {
            const resp = await exec(ctx, this.pathMiddlewares[path].before)
            if(ctx.isImmediate || resp) return resp
        } else if(basePath && this.pathMiddlewares[basePath] && this.pathMiddlewares[basePath].before.length) {
            // middlewares discovered for a base path on a route cannot halt execution
            await exec(ctx, this.pathMiddlewares[basePath].before)
        }

        /**
         * Identify if there's a handler
         */
        const route = this.resolve(method, path)
        if(route) {
            // use middlewares
            if(route.middlewares && route.middlewares.length) {
                try {
                    const resp = await exec(ctx, route.middlewares)
                    if(resp || ctx.isImmediate) return resp as Response
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        return this.errorHandler(ctx, error)
                        // return new Response(error.message, { status: 400 });
                    }
                }
            }
            if(route.controller) {
                try {
                    const response = await route.controller(ctx as AppContext<S>, {...route.params, ...{}})
                    if(ctx.isImmediate) {
                        return response
                    } else if(this.middlewares.after.length) {
                        ctx.response = response
                        const resp = await exec<{}, S>(ctx, this.middlewares.after)
                        if(resp) return resp
                    }
                    return response;
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        return this.errorHandler(ctx, error)
                        // return new Response(error.message, { status: 400 });
                    }
                }
            }
        }
        return this.notFoundHandler()
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

    // ADVANCED: ROUTE ORCHESTRATION
    /**
     * Mount a sub-app routes, on the parent app routes
     *
     * This method just copies over all the routes, from the mounted app to the root app, and re-registers all the handlers and
     * middlewares on the newly formed path
     * @param prefix
     * @param app
     */
     mount<M>(prefix: string, app: BunTea<M>) {
        for(const routeType in app.routes as RouteStack) {
            for(const route of app.routes[routeType as RouteMethod] as Array<Route>) {
                this.register(
                    routeType as RouteMethod,
                    getMountPath(prefix, route.id),
                    route.middlewares, route.controller
                )
            }
        }
        this.appList[getMountPath(prefix, '')] = app
    }

    /**
     * Create and return Route groups
     * @param prefix
     * @param args
     * @returns
     */
    group(prefix: string = '/', ...args: Array<MiddlewareFunction<S>>) {
        return new BunTeaRouteGroup<S>(this.register.bind(this), this.useOnPath.bind(this), prefix, ...args)
    }

    /// MIDDLEWARES ///

    /**
     * Register app middlewares
     * @param middleware
     * @param type
     * @returns
     */
     use (middleware: MiddlewareFunction<S>, type: MiddlewareType = 'before') {
        this.middlewares[type].push(middleware)
        return this
    }

    private useOnPath(path: string, ...args: Array<MiddlewareFunction<S>>) {
        if(!this.pathMiddlewares[path]) this.pathMiddlewares[path] = { before: [], after: [], error: [] }
        this.pathMiddlewares[path].before.push(...args)
        this.pathWithMiddlewares.push(path)
    }

    /// SERVER METHODS ///

    shutdown() {
        // do any pre-shutdown process
        if(!this.server) {
            return console.error(`Can't shutdown as server isn't up currently`)
        }
        if(this.server?.pendingRequests) {
            return console.error(`Can't shutdown as there are pending requests. You might wanna wait or forcibly shut the server instance?`)
        }
        return this.server?.stop()
    }

    listen({
        port = 3333,
        development = false,
        hostname = '0.0.0.0'
    }: BunTeaOptions, startedCb?: (server: Server) => void) {
        const self = this
        if (!Bun) throw new Error('Bun-Tea requires Bun to run')

        // do things, before initializing the server
        this.server = Bun.serve({
            port,
            hostname,
            development: process.env.NODE_ENV !== "production" || development,
            // @ts-ignore
            fetch: this.handle.bind(this),
            error(err: Errorlike) {
                return self.serverErrorHandler(err)
            }
        })

        if(startedCb && typeof startedCb === 'function') {
            startedCb(this.server)
        }

        return this.server
    }
}

function defaultErrorHandler(ctx: AppContext, err: Errorlike): Response {
    const errorCode = parseInt(err.code as string || '') || 500
    return new Response(err.message || HTTP_STATUS_CODES[errorCode], { status: errorCode  });
}

class BunTeaRouteGroup<S extends Record<string, string>> {
    private prefix = ''
    private register: (method: RouteMethod, url: string, ...args: any) => void
    private registerMw: (path: string, ...args: Array<MiddlewareFunction<S>>) => void

    constructor(
        register: (method: RouteMethod, url: string, ...args: any) => void,
        registerMw: (path: string, ...args: Array<MiddlewareFunction<S>>) => void,
        prefix: string = '/',
        ...args: Array<MiddlewareFunction<S>>

        ) {
        this.prefix = prefix === '' ? '/' : prefix
        this.register = register
        this.registerMw = registerMw

        if(args.length) registerMw(this.prefix, ...args)
    }

    get<T extends Record<string, string> = {}>(path: string, controller: Controller<T, S>) {
        this.register('get', getMountPath(this.prefix, path), controller);
        return this as Omit<typeof this, 'group'>
    }
    post<T extends Record<string, string> = {}>(path: string, controller: Controller<T, S>) {
        this.register('post', getMountPath(this.prefix, path), controller);
        return this as Omit<typeof this, 'group'>
    }
    put<T extends Record<string, string> = {}>(path: string, controller: Controller<T, S>) {
        this.register('put', getMountPath(this.prefix, path), controller);
        return this as Omit<typeof this, 'group'>
    }
    patch<T extends Record<string, string> = {}>(path: string, controller: Controller<T, S>) {
        this.register('patch', getMountPath(this.prefix, path), controller);
        return this as Omit<typeof this, 'group'>
    }
    del<T extends Record<string, string> = {}>(path: string, controller: Controller<T, S>) {
        this.register('delete', getMountPath(this.prefix, path), controller);
        return this as Omit<typeof this, 'group'>
    }
    all <T extends Record<string, string> = {}>(path: string, controller: Controller<T, S>) {
        ['get', 'post', 'put', 'patch', 'delete'].forEach(verb => {
            this.register(verb as RouteMethod, getMountPath(this.prefix, path), controller);
        })
        return this as Omit<typeof this, 'group'>
    }
    group(path: string = '/', ...args: Array<MiddlewareFunction<S>>) {
        return new BunTeaRouteGroup(this.register, this.registerMw, getMountPath(this.prefix, path), ...args)
    }
}
