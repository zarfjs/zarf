import type { BunTeaConfig, RouteMethod } from './types'
import { json, text, head, send, html } from './response'
import { getContentType } from './utils/mime'

/**
 * Context-internal interfaces/types
 */

interface ContextMeta {
    startTime: number
}

type HeaderVaryContent = 'Origin' | 'User-Agent' | 'Accept-Encoding' | 'Accept' | 'Accept-Language'
type HeaderTypeContent = 'text' | 'json' | 'html'

/**
 * Execution context for handlers and all the middlewares
 */
export class AppContext<S extends Record<string, any> = {}> {
    private _response: Response | null
    private _config: BunTeaConfig = {}
    private _error: any
    private _code: number | undefined;

    private readonly _request: Request | null
    readonly url: URL;
    readonly method: RouteMethod
    readonly host: string | undefined;
    readonly path: string;
    readonly query: URLSearchParams | undefined;
    readonly headers: Request["headers"]

    private _locals: S = {} as S
    readonly meta: ContextMeta = {
        startTime: 0
    }
    private _isImmediate: boolean = false

    constructor(req: Request, config: BunTeaConfig) {
        this.meta.startTime = Date.now()
        this._config = config
        this._request = req
        this._response = new Response('')

        this.method = req.method.toLowerCase() as RouteMethod

        this.url = new URL(req.url)
        this.host = this.url.host
        this.path = this._config.strictRouting || this.url.pathname === '/' ?
            this.url.pathname :
            this.url.pathname.endsWith('/') ?
                this.url.pathname.substring(0, this.url.pathname.length -1) :
                this.url.pathname

        this.query = new Proxy(new URLSearchParams(req.url), {
            get: (params, param) => params.get(param as string),
        })
        this.headers = new Proxy(this._request.headers, {
            get: (headers, header) => headers.get(header as string),
        })

        if(this._config.serverHeader) {
            this._response.headers.set('Server', this._config.serverHeader)
        }

        /**
         * Currently needed for reading request body using `json`, `text` or `arrayBuffer`
         * without taking forever to resolve when any of them are accessed later
         */
        this._request.blob();
    }

    /**
     * Get the current request in the raw form
     */
    get request() {
        return this._request
    }

    /**
     * Get the `Response` if any
     */
    get response() {
        return this._response
    }
    /**
     * Set the `Response`
     */
    set response(resp) {
        this._response = resp
    }

    /**
     * Get the current status code
     */
    get status() {
        return this._code!
    }
    /**
     * Set the current status code
     */
    set status(code: number) {
        this._code = code;
    }

    get isImmediate() {
        return this._isImmediate
    }

    /// HEADER HELPERS ///
    setHeader(headerKey: string, headerVal: string) {
        return this._response?.headers.set(headerKey, headerVal)
    }

    setType(headerVal: HeaderTypeContent) {
        return this.setHeader('Content-Type', getContentType(headerVal))
    }

    isType(headerVal: HeaderTypeContent) {
        return this._request?.headers.get('Content-Type') === getContentType(headerVal)
    }

    accepts(headerVal: HeaderTypeContent) {
        return this._request?.headers.get('Accepts')?.includes(getContentType(headerVal))
    }

    // https://www.smashingmagazine.com/2017/11/understanding-vary-header/
    setVary(...headerVals: Array<HeaderVaryContent>) {
        if(headerVals.length) {
            const varies = (this._response?.headers.get('Vary') || '').split(',')
            this._response?.headers.set('Vary', [...new Set([...varies ,...headerVals])].join(','))
        }
    }

    /**
     * Get Error
     */
    get error() {
        return this._error
    }
    /**
     * Set Error
     */
    set error(err) {
        this._error = err
    }

    // Getter/Setter for App-specific details
    /**
     * Get available App-specific details
     */
    get locals() {
        return this._locals as S
    }
    /**
     * Set App-specific details
     */
    set locals(value: S) {
        this._locals = value
    }

    // Context helpers to send the `Response` in all the supported formats
    /**
     * Send the response as string, json, etc. - One sender to rule `em all!
     * @param body
     * @returns
     */
    async send(body: any, args: ResponseInit = {}): Promise<Response> {
        if(this._request?.method === 'HEAD') return this.head()
        return await send(body, {...this.getResponseInit(), ...args})
    }

    /**
     * Send the provided values as `json`
     * @param body
     * @returns
     */
    json(body: any, args: ResponseInit = {}): Response {
        return json(body, {...this.getResponseInit(), ...args})
    }

    /**
     * Send the provided value as `text`
     * @param _text
     * @returns
     */
    text(_text: string, args: ResponseInit = {}): Response {
        return text(_text, {...this.getResponseInit(), ...args})
    }

    /**
     * Send the provided value as `html`
     * @param _text
     * @returns
     */
     html(text: string, args: ResponseInit = {}): Response {
        return html(text, {...this.getResponseInit(), ...args})
    }

    /**
     * Just return with `head` details
     * @returns
     */
    head(args: ResponseInit = {}): Response {
        return head({...this.getResponseInit(), ...args})
    }


    /**
     * Halt flow, and return with currently provided status
     *
     * @param statusCode status code to use
     * @param body the body to send in response. Could be `json`, `string`, etc.
     * @returns
     */
    async halt(statusCode: number, body: any): Promise<Response> {
        this._isImmediate = true
        return this.send(body, { ...this.getResponseInit(), status: statusCode })
    }

    /**
     * Redirect to the given URL
     *
     * @param url
     * @param statusCode
     * @returns
     */
    redirect(url: string, statusCode: number = 302): Response {
        this._isImmediate = true
        let loc = url
        if(loc ==='back') loc = this._request?.headers.get('Referrer') || '/'
        return Response.redirect(encodeURI(loc), statusCode)
    }

    /**
     * Use the settings from available `Response` details, if there's one (as an outcome of handler processing and middleware execution)
     * @returns
     */
    private getResponseInit(): ResponseInit {
        if(this._response) {
            const { status, statusText, headers } = this._response

            const _headers: Record<string, string> = {}
            headers.forEach((val, key) => {
                _headers[key] = val
            })

            return {
                headers: _headers,
                status,
                statusText
            }
        }
        else {
            return {}
        }
    }
}
