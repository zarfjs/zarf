import type { ZarfConfig } from '../types'
import type { MiddlewareFunctionInitializer } from "../middleware"

export type MountConfigMiddlewareOptions = {
    prefix: string
    config: ZarfConfig
}

export function getMountPath(prefix: string, path: string): string {
    if(prefix.length === 0 || prefix === '/') {
        return path[0] === '/' ? path : `/${path}`
    } else {
        return `${prefix}${path}`
    }
}

export const mountConfigMiddleware: MiddlewareFunctionInitializer<MountConfigMiddlewareOptions, { config: MountConfigMiddlewareOptions }> = (options) => {
    return async (ctx, next) => {
        ctx.useAppConfigOnPath(options?.prefix!, options?.config!)
        await next()
    }
}

export function getRouteName(id: string, vars: Array<string>, appName?: string) {
    if(id === '/' && appName) return appName
    let str = id.replace(/\//g,"_").substring(1)
    vars.forEach(vars => {
        str = str.includes(`*${vars}`) ? str.replace(`*${vars}`, `_${vars}`) : str.includes(`:${vars}`) ? str.replace(`:${vars}`, `_${vars}`) : str.includes(`${vars}?`) ? str.replace(`${vars}?`, `${vars}`) : str
    })
    return str.replace(/\?/g,"")
}
