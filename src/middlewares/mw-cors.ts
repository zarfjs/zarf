import { MiddlewareFunctionInitializer } from '../core/middleware'

const getOrigin = (reqOrigin: string, options: MiddlewareOptions) => {
    if(options.origins) {
        const { origins, credentials } = options
        if (origins.length > 0) {
            if (reqOrigin && origins.includes(reqOrigin)) {
              return reqOrigin
            } else {
              return origins[0]
            }
        } else {
            if (reqOrigin && credentials && origins[0] === '*') {
              return reqOrigin
            }
            return origins[0]
        }
    } else {
        return MW_OPTION_DEFAULTS.origins![0]
    }
}

type AllowedMethod = typeof MW_OPTION_METHOD_DEFAULTS[number]
type HeaderVaryContent = "Origin" | "User-Agent" | "Accept-Encoding" | "Accept" | "Accept-Language"
type MiddlewareOptions = {
    origins?: Array<string>,
    credentials?: boolean,
    allowedHeaders?: Array<string>,
    exposedHeaders?: Array<string>,
    methods?: Array<AllowedMethod>,
    vary?: HeaderVaryContent,
    maxAge?: number,
    preflightContinue?: boolean,
    cacheControl?: string
}

const MW_OPTION_METHOD_DEFAULTS = [ 'GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS' ] as const
const MW_OPTION_DEFAULTS: MiddlewareOptions = {
    origins: ['*'],
    credentials: false,
    allowedHeaders: [],
    exposedHeaders: [],
    methods: [ ...MW_OPTION_METHOD_DEFAULTS ],
    preflightContinue: false
}

const HEADERS = {
    ACAC: 'Access-Control-Allow-Credentials',
    ACAH: 'Access-Control-Allow-Headers',
    ACAM: 'Access-Control-Allow-Methods',
    ACAO: 'Access-Control-Allow-Origin',

    ACEH: 'Access-Control-Expose-Headers',
    ACRH: 'Access-Control-Request-Headers',
    ACRM: 'Access-Control-Request-Methods'
}

export const cors: MiddlewareFunctionInitializer<MiddlewareOptions> = (opts) => {
    const options = { ...MW_OPTION_DEFAULTS, ...opts }
    return async (ctx, next: Function) => {
        const headers = ctx.response?.headers || new Map()

        if(headers.has(HEADERS.ACAC)) {
            options.credentials = headers.get(HEADERS.ACAC) === 'true'
        }
        if(options.credentials) ctx.setHeader(HEADERS.ACAC, String(options.credentials))

        if(options.allowedHeaders && options.allowedHeaders.length && !headers.has(HEADERS.ACAH)) {
            ctx.setHeader(HEADERS.ACAH, options.allowedHeaders.join(', '))
        }
        if(options.exposedHeaders && options.exposedHeaders.length && !headers.has(HEADERS.ACEH)) {
            ctx.setHeader(HEADERS.ACEH, options.exposedHeaders.join(', '))
        }

        if(options.methods && !headers.has(HEADERS.ACAM)) {
            ctx.setHeader(HEADERS.ACAM, options.methods.join(','))
        }

        if(options.origins?.length && !headers.has(HEADERS.ACAO)) {
            ctx.setHeader(HEADERS.ACAO, getOrigin(ctx.url.origin, options))
        }

        if(headers.has(HEADERS.ACAO) && headers.get(HEADERS.ACAO) !== '*') {
            options.vary = 'Origin'
        }
        if(options.vary && !headers.has('Vary')){
            ctx.setVary(options.vary)
        }

        if(options.maxAge && !headers.has('maxAge')) {
            ctx.setHeader('maxAge', String(options.maxAge))
        }

        if(ctx.method === 'options') {

            if(options.cacheControl && !headers.has('Cache-Control')) {
                ctx.setHeader('Cache-Control', options.cacheControl)
            }

            if (options.preflightContinue) {
              await next()
            } else {
              ctx.setHeader('Content-Length', '0')
              return ctx.halt(200, '')
            }
        } else {
            await next()
        }
    }
}
