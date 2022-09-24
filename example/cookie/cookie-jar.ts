import type { CookieOptions, UrlKind } from './types'
import { Cookie } from './cookie'

export class CookieJar {
    cookies: Array<Cookie> = []

    constructor(cookies?: Array<Cookie> | Array<CookieOptions>) {
        this.init(cookies)
    }

    private init(cookies?: Array<Cookie|CookieOptions>) {
        if(cookies?.length) {
            for(const cookieKind of cookies) {
                if(cookieKind instanceof Cookie) {
                    this.cookies.push(cookieKind)
                } else {
                    this.cookies.push(new Cookie(cookieKind as CookieOptions))
                }
            }
        } else {
            this.cookies = []
        }
    }

    setCookie(cookieKind: Cookie | string, urlKind: UrlKind) {
        const cookie = typeof cookieKind === 'string' ? Cookie.from(cookieKind) : cookieKind
        if(urlKind) {
            if(!cookie.domain) {
                cookie.setDomain(urlKind)
            }
            if(!cookie.path) {
                cookie.setPath(urlKind)
            }
        }
        if(!cookie.isValid()) return
        const found = this.getCookie(cookie)
        if(found) {
            !cookie.isExpired() ? this.cookies.splice(this.cookies.indexOf(found), 1, cookie) : this.cookies.splice(this.cookies.indexOf(found), 1)
        } else {
            this.cookies.push(cookie)
        }
    }

    getCookie(matchOption: Cookie | CookieOptions): Cookie | undefined {
        const matchStrictly = matchOption instanceof Cookie
        for(const [i, cookie] of this.cookies.entries()) {
            if(cookie.matches(matchOption as Cookie, matchStrictly)){
                if(!cookie.isExpired()) return cookie
            } else {
                this.cookies.splice(i, 1)
                return undefined
            }
        }
    }

    getCookies(matchOption?: Cookie | CookieOptions): Array<Cookie> {
        if(matchOption) {
            const matchStrictly = matchOption instanceof Cookie
            const cookiesMatched = this.cookies.filter(cookie => cookie.matches(matchOption as Cookie, matchStrictly))
            const cookiesAvailable = cookiesMatched.filter(cookie => !cookie.isExpired())
            // const cookiesExpired = cookiesMatched.filter(cookie => cookie.isExpired())
            if(cookiesAvailable.length) this.cookies = cookiesAvailable
            return cookiesAvailable
        } else {
            return this.cookies
        }
    }

    getCookiesByUrl(url: UrlKind) {
        return url ? this.getCookies(new Cookie().setDomain(url)).filter(cookie => cookie.sendable(url)) : this.getCookies()
    }

    getCookiesStringByUrl(url: UrlKind) {
        return this.getCookiesByUrl(url).join('; ')
    }

    remCookie(matchOption: Cookie | CookieOptions): Cookie | undefined {
        const matchStrictly = matchOption instanceof Cookie
        for(const [i, cookie] of this.cookies.entries()) {
            if(cookie.matches(matchOption as Cookie, matchStrictly)){
                return this.cookies.splice(i, 1)[0]
            }
        }
    }

    remCookies(matchOption?: Cookie | CookieOptions): Array<Cookie> {
        if(matchOption) {
            const matchStrictly = matchOption instanceof Cookie
            const cookiesMatched = this.cookies.filter(cookie => cookie.matches(matchOption as Cookie, matchStrictly))
            if(cookiesMatched.length) {
                this.cookies = this.cookies.filter(cookie => !cookie.matches(matchOption as Cookie, matchStrictly))
            }
            return cookiesMatched
        } else {
            this.cookies = []
            return []
        }
    }

}
