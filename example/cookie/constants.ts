import type { CookieOptions } from "./types";
// // with help from https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie and rfc6265
export const CONTROL_CHARS = /[\x00-\x1F\x7F]/;
export const COOKIE_NAME_BLOCKED = /[()<>@,;:\\"/[\]?={}]/;

export const COOKIE_OCTET_BLOCKED = /[\s",;\\]/;
export const COOKIE_OCTET = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]+$/;

export const defaultCookie: CookieOptions = {
    security: 'plain',
    name: 'bun-tea-session',
    value: '',
    path: '/',
    domain: '',
    secure: true,
    httpOnly: true,
    maxAge: 0,
    expires: 0,
    sameSite: 'None'
}
