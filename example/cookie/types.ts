export type UrlKind = string | Request | URL
export type CookieOptionSameSite = 'Lax' | 'Strict' | 'None'
export type CookieOptionSecurity = 'plain' | 'private' | 'signed'

export interface CookieOptions {
    security: CookieOptionSecurity
    //
    name: string
    value: string
    path: string
    domain?: string
    secure: boolean
    httpOnly: boolean
    maxAge?: number
    expires?: number | undefined
    sameSite?: CookieOptionSameSite
    creationDate?: number
}
