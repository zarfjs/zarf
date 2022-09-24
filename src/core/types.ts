import type { Errorlike } from "bun";
import { AppContext } from './context'
import { MiddlewareFunction } from './middleware';
import type { Replace } from './utils/types'

export interface BunTeaConfig {
    appName?: string
    serverHeader?: string
    strictRouting?: boolean
    getOnly?: boolean
    errorHandler?: (ctx: AppContext, error: Errorlike) => Response | Promise<Response> | Promise<undefined> | undefined
}

export interface BunTeaOptions {
    port?: number,
    development?: boolean,
    hostname?: string
}

export interface Route {
    id: string
    matcher: RegExp
    controller: Controller
    vars: Array<string>
    options: any,
    middlewares?: Array<MiddlewareFunction>
}

export type RouteStack = Record<RouteMethod, Array<Route>>


export interface ResolvedRoute {
    controller: Controller
    params: Record<string, string|number|boolean>
}

export interface RouteProps {
    context: AppContext;
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

export type RouteMethod = "get" | "post" | "put" | "patch" | "delete" | "head"

type Path = string;
export type RegisterRoute<T extends Record<string, string> = {}> = ( method: RouteMethod, path: Path, controller: Controller<T> ) => void;
export type Controller<T extends Record<string, string> = {}, S extends Record<string, string> = {}> = (context: AppContext<S>, params: T) => Response | Promise<Response>
