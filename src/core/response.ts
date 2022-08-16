import * as mime from 'es-mime-types'
import { HTTP_STATUS_CODES } from './codes'

export const getMimeType = (type:string) =>  type.indexOf('/') === -1 ? mime.lookup(type) : type
export const getContentType = (type:string) =>  type.indexOf('/') === -1 ? mime.contentType(type) : type

export function json<T = void>(data: T, args: ResponseInit = {}): Response {
    const headers = new Headers(args.headers || {})
    headers.set('Content-Type', getContentType('json'))
    const status = args.status || 200
    const statusText = args.statusText || HTTP_STATUS_CODES[status]
    if(typeof data === 'object' && data != null) {
        return new Response( JSON.stringify(data, null, 0), { ...args, status, statusText, headers } )
    } else if(typeof data === 'string') {
        return text(data, { ...args, status, statusText, headers} )
    } else {
        headers.delete('Content-Length')
        headers.delete('Transfer-Encoding')
        return text("", { ...args, status, statusText, headers} )
    }
}


export function text(text: string, args: ResponseInit = {}): Response {
    const headers = new Headers(args.headers || {})
    const contentType = headers.get('Content-Type') || ''
    if(contentType && typeof contentType === 'string') {
        headers?.set('Content-Type', getContentType('text'))
    }
    const status = args.status || 200
    const statusText = args.statusText || HTTP_STATUS_CODES[status]
    return new Response(text.toString(), { ...args, status, statusText, headers });
}

export function head(args: ResponseInit = {}): Response {
    const status = args.status || 204
    const statusText = args.statusText || HTTP_STATUS_CODES[status]
    return new Response('', {...args, status, statusText })
}

export async function send(body: any, args: ResponseInit = {}): Promise<Response> {
    let sendable = body
    const headers = new Headers(args.headers || {})

    // Do any required header tweaks
    if(Buffer.isBuffer(body)) {
        sendable = body
    } else if(typeof body === 'object' && body !== null) {
        // `json` updates its header, so no changes required
    } else if(typeof body === 'string') {
        headers.set('Content-Type', getContentType('text'))
    } else {
        headers.set('Content-Type', getContentType('html'))
    }

    // @TODO: populate Etag

    // strip irrelevant headers
    if (args?.status === 204 || args?.status === 304) {
        headers.delete('Content-Type')
        headers.delete('Content-Length')
        headers.delete('Transfer-Encoding')
        sendable = ''
    }

    // if(this._request?.method === 'HEAD') {
    //     return head({
    //         ...args,
    //         headers
    //     })
    // }

    if (typeof sendable === 'object') {
        if (sendable == null) {
          return new Response('', {
            ...args,
            headers
          })
        } else {
            return json(sendable, {
                ...args,
                headers
            })
        }
    }
    else if(Buffer.isBuffer(sendable)){
        if(!headers.get('Content-Type')) {
            headers.set('Content-Type', getContentType('octet-stream'))
        }
        return new Response(sendable, {
            ...args,
            headers
        })
    } else if(typeof sendable === 'string') {
        return text(sendable, {
            ...args,
            headers
        })
    } else if(sendable instanceof Blob) {
        if(sendable.type.includes('json')) {
            return json(await sendable.json(), {
            ...args,
            headers
        })
        } else if (sendable.type.includes('text')) {
            return text(await sendable.text(), {
                ...args,
                headers
            })
        } else {

        }
    }  else  {

        if(typeof sendable !== 'string') sendable = sendable.toString()
        return new Response(sendable, {
            ...args,
            headers
        })
    }
    return new Response(sendable, { ...args, headers })
}

export async function sendFile(path: string, args: ResponseInit = {}): Promise<Response> {
    const headers = new Headers(args.headers || {})
    const file = Bun.file(path)
    const fileName = path.substring(path.lastIndexOf('/') + 1, path.length)
    headers.set('Content-Disposition', `attachment; filename=${fileName}`)
    headers.set('Content-Transfer-Encoding', 'binary')
    headers.set('Content-Type', getContentType('octet-stream'))
    return new Response(new Blob([
        await file.arrayBuffer()
    ], {
        type: file.type
    }), {
        ...args,
        headers
    })
}
