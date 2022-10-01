import { badRequest, internalServerError, methodNotAllowed, notFound, unprocessableEntity } from "../response/created";
import { RespCreatorRequestInit } from "../response/creator";
import { HTTPStatusCodeMesssageKey } from '../constants/codes'

export const serverErrorFns: Partial<Record<HTTPStatusCodeMesssageKey, (body?: BodyInit | null, init?: RespCreatorRequestInit) => Response>> = {
    'InternalServerError': internalServerError,
    'NotFound': notFound,
    'BadRequest': badRequest,
    'UnprocessableEntity': unprocessableEntity,
    'MethodNotAllowed': methodNotAllowed
}
