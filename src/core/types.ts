import type { Errorlike } from "bun";
import { ROUTE_OPTION_DEFAULT } from "./constants";
import { AppContext as PrivateAppContext } from './context'
import { MiddlewareFunction } from './middleware';
import type { Replace } from './utils/types'

// Utility types
export type JSONValue =
    | string
    | number
    | boolean
    | { [x: string]: JSONValue }
    | Array<JSONValue>;

// Global Type aliases
export type RouteMethod = "get" | "post" | "put" | "patch" | "delete" | "head" | "options"
export type HeaderVaryContent = 'Origin' | 'User-Agent' | 'Accept-Encoding' | 'Accept' | 'Accept-Language'
export type HeaderTypeContent = 'text' | 'json' | 'html'

//  Context interfaces/types
// The context that could be shared to `RouteHandler`
export type AppContext<S extends Record<string, string> = {}> = Omit<PrivateAppContext<S>,
    'after' |
    'afterMiddlewares' |
    'useAppConfigOnPath' |
    'isImmediate'
>
// Context-internal interfaces/types
export interface ContextMeta {
    startTime: number
}

// `Zarf` Application config
export interface ZarfConfig<S extends Record<string, any> = {}> {
    appName?: string
    serverHeader?: string
    strictRouting?: boolean
    getOnly?: boolean
    errorHandler?: (ctx: PrivateAppContext<S>, error: Errorlike) => Response | Promise<Response> | Promise<undefined> | undefined
}

// `Zarf` lister options
export interface ZarfOptions {
    port?: number,
    development?: boolean,
    hostname?: string
}

// `Route` types
export interface RouteOptions {
    [ROUTE_OPTION_DEFAULT]?: {},
    meta: {
        name: string,
        alias: string
    }
}

export interface Route<S extends Record<string, any> = {}> {
    id: string
    matcher: RegExp
    handler: RouteHandler<{}, S>
    vars: Array<string>
    options: RouteOptions,
    middlewares?: Array<MiddlewareFunction<S>>
}
export type RouteStack<S extends Record<string, any> = {}> = Record<RouteMethod, Array<Route<S>>>
export interface ResolvedRoute {
    handler: RouteHandler
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

// `Route Handler` types

type Path = string;
export type RegisterRoute<T extends Record<string, string> = {}> = ( method: RouteMethod, path: Path, handler: RouteHandler<T> ) => void;
export type RouteHandler<T extends Record<string, string> = {}, S extends Record<string, string> = {}> = (context: AppContext<S>, params: T) => Response | Promise<Response>

// Adapter Context
export interface AdapterContext<T extends Record<string, JSONValue> = {}> {
    waitUntil?(promise: Promise<void | unknown>): void;
    signal?: {
      aborted: boolean;
    };
    passThrough?(promise: Promise<void | unknown>): void;
    platform: T,
    [key: string | number]: unknown;
}

export interface AdapterServerListenerOptions {
    port?: number,
    development?: boolean,
    hostname?: string,
    log?: boolean
}

type CertFileExt = 'crt' | 'pem'
type KeyFileExt = 'key' | 'pem'
type CertFilePath = `./${string}.${CertFileExt}`
type KeyFilePath = `./${string}.${KeyFileExt}`

export interface AdapterServerHttpsOptions {
    certFile: CertFilePath,
    keyFile: KeyFilePath,
}
