import { MiddlewareFunction, MiddlewareFunctionInitializer } from "../core/middleware"

const MW_LOGGER_DEFAULTS = {
    logger: console.error
}

export const logger: MiddlewareFunctionInitializer<typeof MW_LOGGER_DEFAULTS> = (options) => {
    let { logger } = { ...MW_LOGGER_DEFAULTS, ...options }
    if (typeof logger !== 'function') logger = console.log
    return async (context, next: Function) => {
        logger(`Request [${context.method}]: ${context.path}`)
        await next()
    }
}

const MW_LOGGER_ERR_DEFAULTS = {
    logger: console.error
}

export const errorLogger: MiddlewareFunctionInitializer<typeof MW_LOGGER_ERR_DEFAULTS> = (options) => {
    let { logger } = { ...MW_LOGGER_ERR_DEFAULTS, ...options }
    if (typeof logger !== 'function') logger = console.error
    return async (context, next: Function) => {
        logger(context.error)
        await next()
    }
}

export const loggerAfter: MiddlewareFunction = async (context, next) => {
    console.info(`After response for [${context.method}]: ${context.path}`);
    const ms = Date.now() - context.meta.startTime;
    context.response?.headers.set("X-Response-Time", `${ms}ms`);
    await next()
}
