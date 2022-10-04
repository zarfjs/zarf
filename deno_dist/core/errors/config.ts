import { badRequest, internalServerError, methodNotAllowed, notFound, unprocessableEntity } from "../response/created.ts";
import { RespCreatorRequestInit } from "../response/creator.ts";
import { HTTPStatusCodeMesssageKey } from '../constants/codes.ts'

export const serverErrorFns: Partial<Record<HTTPStatusCodeMesssageKey, (body?: BodyInit | null, init?: RespCreatorRequestInit) => Response>> = {
    'InternalServerError': internalServerError,
    'NotFound': notFound,
    'BadRequest': badRequest,
    'UnprocessableEntity': unprocessableEntity,
    'MethodNotAllowed': methodNotAllowed
}
