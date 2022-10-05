import type { Replace } from '../utils/types'
export const HTTP_STATUS_CODES = {
    // Informational
    100: 'Continue',
    101: 'Switching Protocols',
    // Successful
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    // Redirection
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    307: 'Temporary Redirect',
    308: 'Permanent Redirect',
    // Client Error
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    422: 'Unprocessable Entity',
    // Server Error
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout'
} as const

export type HTTPStatusCode = keyof typeof HTTP_STATUS_CODES
export type HTTPStatusCodeMesssage = typeof HTTP_STATUS_CODES[HTTPStatusCode]
export type HTTPStatusCodeMesssageKey = Replace<Replace<HTTPStatusCodeMesssage, ' ', '', { all: true }>, '-', '', { all: true }>
