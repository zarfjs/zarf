import { createHmac, timingSafeEqual } from 'crypto'

export const sign = (val: string, secret: string) => `${val}.${createHmac('sha256', secret).update(val).digest('base64').replace(/=+$/, '')}`

export const unsign = (val: string, secret: string): string | false => {
    const str = val.slice(0, val.lastIndexOf('.'))
    const mac = sign(str, secret)
    const macBuffer = Buffer.from(mac)
    const valBuffer = Buffer.alloc(macBuffer.length)

    valBuffer.write(val)
    return timingSafeEqual(macBuffer, valBuffer) ? str : false
}
