import { MiddlewareFunctionInitializer } from '../core/middleware'

type MiddlewareOptions = {
    header?: string,
    keygenFunc?: () => string,
}

const MW_OPTION_DEFAULTS: MiddlewareOptions = {
    header: 'X-Request-ID',
    keygenFunc: () => crypto.randomUUID()
}

const REQ_LOCALS_ID = 'request_id'
export type RequestIdLocals = {[REQ_LOCALS_ID]?: string}

export const requestId: MiddlewareFunctionInitializer<MiddlewareOptions, RequestIdLocals> = (opts) => {
    const { header, keygenFunc } = { ...MW_OPTION_DEFAULTS, ...opts }
    return async (ctx, next) => {
        if(header && keygenFunc && !ctx.request?.headers?.has(header)){
            const reqId = keygenFunc()
            ctx.setHeader(header, reqId)
            ctx.locals['request_id'] = reqId
        }
        await next()
    }
}
