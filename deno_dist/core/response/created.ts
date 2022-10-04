import { createResp, createRedirect, createNotModified, createUnauthorized } from "./creator.ts";
import { HTTP_STATUS_CODES } from '../constants/codes.ts'

export const informContinue = createResp(100, HTTP_STATUS_CODES['100'])
export const informSwitchingProtocols = createResp(101, HTTP_STATUS_CODES['101'])

export const ok = createResp(200, HTTP_STATUS_CODES['200'])
export const created = createResp(201, HTTP_STATUS_CODES['201'])
export const accepted = createResp(202, HTTP_STATUS_CODES['202'])
export const nonAuthorititiveInfo = createResp(203, HTTP_STATUS_CODES['203'])
export const noContent = createResp(204, HTTP_STATUS_CODES['204'])
export const resetContent = createResp(205, HTTP_STATUS_CODES['205'])
export const partialContent = createResp(206, HTTP_STATUS_CODES['206'])


export const movedPermanently = createRedirect(301, HTTP_STATUS_CODES['301'])
export const found = createRedirect(302, HTTP_STATUS_CODES['302'])
export const seeOther = createRedirect(303, HTTP_STATUS_CODES['303'])
export const notModified = createNotModified(304, HTTP_STATUS_CODES['304'])
export const tempRedirect = createRedirect(307, HTTP_STATUS_CODES['307'])
export const permRedirect = createRedirect(308, HTTP_STATUS_CODES['308'])

export const badRequest = createResp(400, HTTP_STATUS_CODES['400'])
export const unauthorized = createUnauthorized(401, HTTP_STATUS_CODES['401'])
export const forbidden = createResp(403, HTTP_STATUS_CODES['403'])
export const notFound = createResp(404, HTTP_STATUS_CODES['404'])
export const methodNotAllowed = createResp(405, HTTP_STATUS_CODES['405'])
export const notAcceptable = createResp(406, HTTP_STATUS_CODES['406'])
export const proxyAuthRequired = createResp(407, HTTP_STATUS_CODES['407'])
export const requestTimeout = createResp(408, HTTP_STATUS_CODES['408'])
export const conflict = createResp(409, HTTP_STATUS_CODES['409'])
export const gone = createResp(410, HTTP_STATUS_CODES['410'])
export const unprocessableEntity = createResp(422, HTTP_STATUS_CODES['422'])

export const internalServerError = createResp(500, HTTP_STATUS_CODES['500'])
export const notImplemented = createResp(501, HTTP_STATUS_CODES['501'])
export const badGateway = createResp(502, HTTP_STATUS_CODES['502'])
export const serviceUnavailable = createResp(503, HTTP_STATUS_CODES['503'])
export const gatewayTimeout = createResp(504, HTTP_STATUS_CODES['504'])
