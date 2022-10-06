import type { Errorlike } from 'bun DENOIFY: UNKNOWN NODE BUILTIN'
import { AppContext } from '../context.ts';
import { sendError } from './error.ts'
/**
 * Special handlers
 * /
/*
 * Default error handler
 * @param ctx
 * @param err
 * @returns
 */
export function defaultErrorHandler<S extends Record<string, string> = {}>(ctx: AppContext<S>, err: Errorlike): Response {
    return sendError(err)!
}
/**
 * Not Found Error handler
 * @param ctx
 * @returns
 */
export function notFoundHandler<S extends Record<string, string> = {}>(ctx: AppContext<S>): Response | Promise<Response>{
    return new Response(`No matching ${ctx.method.toUpperCase()} routes discovered for the path: ${ctx.path}`, {
        status: 404,
    });
}

/**
 * Not found verb error handler
 * @param ctx
 * @returns
 */
export function notFoundVerbHandler<S extends Record<string, string> = {}>(ctx: AppContext<S>): Response | Promise<Response> {
    return new Response(`No implementations found for the verb: ${ctx.method.toUpperCase()}`, {
        status: 404,
    });
}
