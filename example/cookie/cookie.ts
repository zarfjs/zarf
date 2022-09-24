import type { UrlKind, CookieOptions, CookieOptionSameSite } from './types'
import { defaultCookie } from './constants'
import { getURL, isValidCookieKey, isValidCookieVal, isSameDomainOrSubdomain } from './utils'

const TERMINATORS = ["\n", "\r", "\0"];

function trimTerminator(str: string) {
    if (str === undefined || str === "") return str;
    for (let t = 0; t < TERMINATORS.length; t++) {
      const terminatorIdx = str.indexOf(TERMINATORS[t]);
      if (terminatorIdx !== -1) {
        str = str.substring(0, terminatorIdx);
      }
    }

    return str;
  }

export class Cookie {
    private _cookie: CookieOptions
    constructor(options?: CookieOptions) {
        this._cookie = { ...defaultCookie, ...options, creationDate: Date.now()}
    }
    get name() {
        return this._cookie.name
    }
    get value() {
        return this._cookie.value
    }
    get path() {
        return this._cookie.path
    }
    get domain() {
        return this._cookie.domain
    }
    get httpOnly() {
        return this._cookie.httpOnly
    }
    get sameSite() {
        return this._cookie.sameSite
    }
    get maxAge() {
        return this._cookie.maxAge
    }
    get expires() {
        return this._cookie.expires
    }
    get isSecure() {
        return this._cookie.secure
    }

    setName(name: string) {
        this._cookie.name = name
        return this
    }
    setValue(value: string) {
        this._cookie.value = value
        return this
    }
    setPath(path: UrlKind) {
        const pathname = getURL(path).pathname
        this._cookie.path = !pathname || pathname.startsWith('/') ? pathname : `/${pathname}`
        return this
    }
    setDomain(domain: UrlKind) {
        this._cookie.domain = getURL(domain).host
        return this
    }
    setSameSite(val: CookieOptionSameSite) {
        this._cookie.sameSite = val
    }
    setMaxAge(maxAge: number) {
        this._cookie.maxAge = maxAge
        return this
    }
    setExpires(expiresAt: Date | number) {
        this._cookie.expires = expiresAt instanceof Date ? (expiresAt as Date).getTime() : expiresAt
        return this
    }

    signed() {
        this._cookie = { ...this._cookie, security: 'signed'}
        return this
    }
    private() {
        this._cookie = { ...this._cookie, security: 'private'}
        return this
    }


    secure() {
        this._cookie.secure = true
        return this
    }
    insecure() {
        this._cookie.secure = false
        return this
    }
    setHttpOnly() {
        this._cookie.httpOnly = true
        return this
    }
    unsetHttpOnly() {
        this._cookie.httpOnly = false
        return this
    }

    isValid() {
        return isValidCookieKey(this.name) && isValidCookieVal(this.value)
    }
    isExpired() {
        return (this.maxAge && this._cookie.creationDate && Date.now() - this._cookie.creationDate >= this.maxAge * 1000) ||
        (this.expires && Date.now() - this.expires >= 0 ) ? true : false
    }

    markForImmediateRemoval() {
        this.setValue('').setMaxAge(0).setExpires(Date.now() - 365 * ( 24 * 60 * 60 * 1000 ))
    }
    markForDeferredRemoval() {
        this.setValue('').setMaxAge(-1)
    }
    markForPermanancy() {
        const twentyYrs = 20 * 365 * ( 24 * 60 * 60 * 1000 )
        this.setMaxAge(twentyYrs).setExpires(Date.now() + twentyYrs)
    }

    toString() {
        let str = `${this.name || ''}=${this.value || ''}`
        if(this.expires && this.expires !== Infinity) {
            str += `; Expires=${new Date(this.expires).toUTCString()}`
        }
        if(this.maxAge! >= -1 && this.maxAge !== Infinity) {
            str += `; Max-Age=${this.maxAge}`
        }
        if(this.domain) {
            str += `; Domain=${this.domain}`
        }
        if(this.path) {
            str += `; Path=${this.path}`
        }
        if(this.isSecure) {
            str += `; Secure`
        }
        if(this.httpOnly) {
            str += `; HttpOnly`
        }
        if(this.sameSite) {
            str += `; SameSite=${this.sameSite}`
        }
        return str
    }

    static from(cookieStr: string) {
        const cookieStrParts = cookieStr.trim().split(';')
        const cookieStrKeyValPart = trimTerminator(cookieStrParts.shift() || '').trim()

        if(!cookieStrKeyValPart.includes('=')) return new Cookie()

        let [ cookieKey, cookieVal ] = cookieStrKeyValPart.split('=')
        cookieVal = cookieVal.length > 2 && cookieVal.at(0) === '"' && cookieVal.at(-1) === '"' ? cookieVal.slice(1, -1) : cookieVal
        if(!isValidCookieKey(cookieKey) && !isValidCookieVal(cookieVal)) return new Cookie()

        const cookie = new Cookie()
        cookie.setName(cookieKey).setValue(cookieVal)

        cookieStrParts.forEach((part => {
            const [ keyRaw , val] = part.split('=')
            const key = keyRaw.trim().toLowerCase()
            if(key.toLowerCase() === 'expires') {
                const expires = new Date(val).getTime()
                if(expires && !isNaN(expires)) cookie.setExpires(expires)
            } else if (key.toLowerCase() === 'max-age') {
                const maxAge = parseInt(val, 10)
                if(!isNaN(maxAge)) cookie.setMaxAge(maxAge)
            } else if (key.toLowerCase() === 'domain') {
                cookie.setDomain(val)
            } else if (key.toLowerCase() === 'path') {
                if(val.trim() !== '' && val.trim() !== '/') cookie.setPath(val)
            } else if (key.toLowerCase() === 'same-site') {
                const sameSite: Lowercase<CookieOptionSameSite> = val.toLowerCase() as Lowercase<CookieOptionSameSite>
                if(sameSite === 'strict') cookie.setSameSite('Strict')
                if(sameSite === 'lax') cookie.setSameSite('Lax')
                if(sameSite === 'none') cookie.setSameSite('None')
            }else if(key.toLowerCase() === 'secure') {
                cookie.secure()
            } else if(key.toLowerCase() === 'httponly') {
                cookie.setHttpOnly()
            }
        }))

        return cookie
    }

    sendable(urlKInd: UrlKind) {
        const url = getURL(urlKInd)
        if(this.isSecure && url.protocol !== 'https:') return false
        if(this.sameSite === 'None' && !this.isSecure) return false
        if(this.path) {
            return (this.path === url.pathname)
            || (url.pathname.startsWith(this.path) && this.path.at(-1) === '/')
            || (this.path.length < url.pathname.length && url.pathname.startsWith(this.path) && url.pathname[this.path.length] === '/') ? true : false
        }
        return this.domain && isSameDomainOrSubdomain(this.domain, url.host) ? true : false
    }

    clone() {
        const { security, name, value, path, domain, secure, httpOnly, maxAge, expires, sameSite } = this._cookie
        return new Cookie({
            security,
            name,
            value,
            path,
            domain,
            secure,
            httpOnly,
            maxAge,
            expires,
            sameSite,
            creationDate: Date.now()
        })
    }

    matches(targetCookie: Cookie, strict: boolean = false) {
        if(this.path !== '' && targetCookie.path.startsWith(this.path)) return false
        if(this.domain && !isSameDomainOrSubdomain(this.domain, targetCookie.domain)) return false
        if(this.name && this.name !== targetCookie.name) return false
        if(strict && [ "secure", "httpOnly", "maxAge", "expires", "sameSite" ].some(
                key => this._cookie[key as keyof CookieOptions] &&
                        this._cookie[key as keyof CookieOptions] !== targetCookie._cookie[key as keyof CookieOptions])){
                            return false
        }
        return true
    }
}
