import type { CookieOptions } from '../types'
import { Cookie } from '../cookie'
import { SessionStorageEngine } from './engine'


export const SESSION_NAME = 'bun-tea.session'

export class SessionData {
    private _data = new Map()
    private _flashes = new Map()
    constructor(options: {
        data: Record<string, any>,
        flashes: Record<string, any>
    }, readonly id = "") {
        this._data = new Map(Object.entries(options.data))
        this._flashes = new Map(Object.entries(options.flashes))
        // `__flash_${name}__`
    }

    get data() {
        return Object.fromEntries(this._data)
    }
    get keys() {
        return Object.keys(this._data)
    }
    get flashes() {
        return Object.fromEntries(this._flashes)
    }

    get(key: string) {
        return this._data.get(key);
    }
    set(key: string, value: string) {
        this._data.set(key, value)
        return this
    }

    has(key: string) {
        return this._data.has(key);
    }


    rem(key: string) {
        this._data.delete(key)
        return this
    }
    clear() {
        this._data.clear()
        return this
    }

    flash(key: string, value?: string) {
        // https://github.com/davidpdrsn/axum-flash/blob/main/src/lib.rs
        if(value) {
            this._flashes.set(key, value)
            return this
        } else {
            const flash = this._flashes.get(key)
            this._flashes.delete(key)
            return flash
        }
    }

    toString() {
        const str = JSON.stringify(this.data)
        return Buffer.from(str).toString('base64')
    }

    from(str: string) {
        const body = Buffer.from(str, 'base64').toString('utf-8')
        return JSON.parse(body)
    }
}

const keygenFunc = () => crypto.randomUUID()

interface SessionOptions {
    sessionName: string,
    expiration: number,
    keygenFunc: typeof keygenFunc,
    engine: SessionStorageEngine<SessionData['data']>
}

export class Session {
    private _cookie: Cookie
    private _engine: SessionStorageEngine<SessionData['data']>

    private _fresh: boolean = true
    private _expires: number
    // private _data: SessionData | undefined
    constructor(cookieKind: Cookie | CookieOptions | string, readonly options: SessionOptions) {
        const cookie = typeof cookieKind === 'string' ? Cookie.from(cookieKind) : cookieKind instanceof Cookie ? cookieKind : new Cookie(cookieKind)
        if(!cookie.name) cookie.setName(options.sessionName)
        this._cookie = cookie
        this._engine = options.engine

        this._fresh = this._cookie.value.length ? false : true
        this._expires = options.expiration || 24 * 60 * 60 * 1000
    }
    async prepare() {
        const { name, value: id } = this._cookie
        console.debug(id ? 'pre-existing session' : 'new session')
        if(id) {
            const data = await this._engine.get(id)
            return new SessionData({ data: data && data != null ? data : {}, flashes: {} }, id)
        } else {
            return new SessionData({ data: {}, flashes: {} }, '')
        }
    }
    async with(session: SessionData) {
        const { id, data } = session
        if (id) {
            await this._engine?.set(id, data)
        } else {
            const sessionId = this.options.keygenFunc()
            await this._engine?.set(sessionId, data)
            this._cookie.setValue(sessionId)
        }
        return this._cookie.toString()
    }
    async without(session: SessionData) {
        const { id, data } = session
        const hasSessionData = Object.keys(data).length
        if(!hasSessionData) {
            //
        } else {
            session.clear()
            if(id) {
                await this._engine?.delete(session.id)
                this._cookie.markForImmediateRemoval()
                return this._cookie.toString()
            }
        }
        return this._cookie.toString()
    }

    //
    // setExpiration(expiration: number) {
    //     this._expires = expiration
    // }
}
