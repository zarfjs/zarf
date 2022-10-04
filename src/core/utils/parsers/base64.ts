import { asBuffer } from './buffer'

export const encodeBase64 = (buffer: Uint8Array): Uint8Array => {
    return Buffer.from(asBuffer(buffer).toString('base64'), 'utf8');
}

export const decodeBase64 = (buffer: Uint8Array): Uint8Array => {
    return Buffer.from(asBuffer(buffer).toString('utf8'), 'base64');
}
