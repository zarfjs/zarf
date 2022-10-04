import type { Errorlike } from "bun DENOIFY: UNKNOWN NODE BUILTIN";
import { AppContext as PrivateAppContext } from './context.ts'
import { MiddlewareFunction } from './middleware.ts';
import type { Replace } from './utils/types/index.ts'

export interface ZarfConfig<S extends Record<string, any> = {}> {
    appName?: string
    serverHeader?: string
    strictRouting?: boolean
    getOnly?: boolean
    errorHandler?: (ctx: PrivateAppContext<S>, error: Errorlike) => Response | Promise<Response> | Promise<undefined> | undefined
}

export interface ZarfOptions {
    port?: number,
    development?: boolean,
    hostname?: string
}

export interface Route<S extends Record<string, any> = {}> {
    id: string
    matcher: RegExp
    controller: Controller<{}, S>
    vars: Array<string>
    options: any,
    middlewares?: Array<MiddlewareFunction<S>>
}

export type RouteStack<S extends Record<string, any> = {}> = Record<RouteMethod, Array<Route<S>>>


export interface ResolvedRoute {
    controller: Controller
    params: Record<string, string|number|boolean>
}

export interface RouteProps {
    context: PrivateAppContext;
    request: Request;
    params: Record<string, string>;
}

type RouteParamNames<Route extends string> =
    string extends Route
        ? string
        : Route extends `${string}:${infer Param}-:${infer Rest}`
        ? (RouteParamNames<`/:${Param}/:${Rest}`>)
        : Route extends `${string}:${infer Param}.:${infer Rest}`
        ? (RouteParamNames<`/:${Param}/:${Rest}`>)
        : Route extends `${string}:${infer Param}/${infer Rest}`
        ? (Replace<Param, ':', ''> | RouteParamNames<Rest>)
        : Route extends `${string}*${infer Param}/${infer Rest}`
        ? (Replace<Param, '*', ''> | RouteParamNames<Rest>)
        : (
            Route extends `${string}:${infer LastParam}?` ?
                Replace<Replace<LastParam, ':', ''>, '?', ''> :
                    Route extends `${string}:${infer LastParam}` ?
                        Replace<LastParam, ':', ''> :
                            Route extends `${string}*${infer LastParam}` ?
                                LastParam :
                                    Route extends `${string}:${infer LastParam}?` ?
                                        Replace<LastParam, '?', ''> :
                                            never
        );


export type RouteParams<T extends string> = {
    [key in RouteParamNames<T>]: string
}

export type RouteMethod = "get" | "post" | "put" | "patch" | "delete" | "head" | "options"

type Path = string;
export type AppContext<S extends Record<string, string> = {}> = Omit<PrivateAppContext<S>, 'after' | 'afterMiddlewares'>
export type RegisterRoute<T extends Record<string, string> = {}> = ( method: RouteMethod, path: Path, controller: Controller<T> ) => void;
export type Controller<T extends Record<string, string> = {}, S extends Record<string, string> = {}> = (context: AppContext<S>, params: T) => Response | Promise<Response>