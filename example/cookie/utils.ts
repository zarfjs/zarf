import type { UrlKind } from "./types";
import { CONTROL_CHARS, COOKIE_NAME_BLOCKED, COOKIE_OCTET_BLOCKED, COOKIE_OCTET } from './constants'
export function getURL(urlKind: UrlKind) {
    const url = (urlKind instanceof Request ? urlKind.url : urlKind instanceof URL ? urlKind.toString() : urlKind).replace(/^\./, '')
    return new URL(!url.includes("://") ? `http://${url}` : url);
}

export const isValidCookieKey = (key: string) => !key || (CONTROL_CHARS.test(key) || COOKIE_NAME_BLOCKED.test(key)) ? false : true
export const isValidCookieVal = (val: string) => (CONTROL_CHARS.test(val) || COOKIE_OCTET_BLOCKED.test(val) || !COOKIE_OCTET.test(val)) ? false : true

export function isSameDomainOrSubdomain(thisDomain?: string, thatDomain?: string) {
    if (!thisDomain || !thatDomain) {
      return false;
    }

    let longDomain;
    let shortDomain;
    if (thatDomain.length > thisDomain.length) {
        longDomain = thatDomain;
        shortDomain = thisDomain;
    } else {
        longDomain = thisDomain;
        shortDomain = thatDomain;
    }

    const longDomainHasShortDomain = longDomain.includes(shortDomain);
    if (longDomainHasShortDomain) {
        if (longDomain.charAt(longDomain.indexOf(shortDomain) - 1) !== ".") {
            return false;
        }
    } else {
      return false
    }
    return true;
}
