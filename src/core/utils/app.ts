import type { ZarfConfig } from '../types'
import type { MiddlewareFunctionInitializer } from "../middleware"

export function getMountPath(prefix: string, path: string): string {
    if(prefix.length === 0 || prefix === '/') {
        return path[0] === '/' ? path : `/${path}`
    } else {
        return `${prefix}${path}`
    }
}

export type MountConfigMiddlewareOptions = {
    prefix: string
    config: ZarfConfig
}

export const mountConfigMiddleware: MiddlewareFunctionInitializer<MountConfigMiddlewareOptions, { config: MountConfigMiddlewareOptions }> = (options) => {
    return async (ctx, next) => {
        ctx.useAppConfigOnPath(options?.prefix!, options?.config!)
        await next()
    }
}
