export type RespCreatorRequestInit= Omit<RequestInit, 'status' | 'statusText'>

/**
 * Create a Response
 * @param status number
 * @param statusText string
 * @returns Response
 */
export const createResp = (status: number, statusText: string) => (body: BodyInit | null = null, init: RespCreatorRequestInit = {}) => new Response(body, {
    ...init,
    status,
    statusText,
})

/**
 * Create a redirect response
 * @param status number
 * @param statusText string
 * @returns Response
 */
export const createRedirect = (status: number, statusText: string) => (location: string | URL, init: RespCreatorRequestInit = {}): Response => new Response(null, {
    ...init,
    status,
    statusText,
    headers: [
        // @ts-ignore
      ...init?.headers ? Array.isArray(init.headers) ? init.headers : new Headers(init.headers) : [],
      ['Location', location.toString()]
    ],
  });

/**
 * Create Unauthorized Response
 * @param status number
 * @param statusText string
 * @returns Response
 */
export const createUnauthorized = (status: number, statusText: string) => (realm = '', init: RespCreatorRequestInit = {}): Response => new Response(null, {
    ...init,
    status,
    statusText,
    headers: [
        ...init?.headers ? Array.isArray(init.headers) ? init.headers : new Headers(init.headers) : [],
        ['WWW-Authenticate', `Basic realm="${realm}", charset="UTF-8"`],
    ],
  });



type CreateNotModifiedOptions = {
    ifNoneMatch: string,
    ifModifiedSince: Date
}

/**
 * Create `NotModified` Response
 * @param status number
 * @param statusText  string
 * @returns Response
 */
export const createNotModified = (status: number, statusText: string) => (options: CreateNotModifiedOptions, init: RespCreatorRequestInit = {}): Response => new Response(null, {
    ...init,
    status,
    statusText,
    headers: [
      ...init?.headers ? Array.isArray(init.headers) ? init.headers : new Headers(init.headers) : [],
      ['If-None-Match', options.ifNoneMatch],
      ['If-Modified-Since', options.ifModifiedSince],
    ],
  })
