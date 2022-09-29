import { extname } from 'path';
import { MimeType, MIME_TYPES_CONFIG, EXT_MIME_TYPES } from '../constants/mime'

export function getContentType(str: string) {
    if(str && typeof str === 'string') {
        const isMimeType = str.indexOf('/') !== -1
        if(isMimeType) {
            const mimeConfig = MIME_TYPES_CONFIG[str as MimeType]
            return mimeConfig?.charset ? `${str}; charset=${mimeConfig.charset.toLowerCase()}` : false
        } else {
            const mimeType = getMimeType(str)
            if(mimeType && typeof mimeType !== 'boolean') {
                const mimeConfig = MIME_TYPES_CONFIG[mimeType as MimeType]
                return mimeConfig && mimeConfig.charset ?
                    `${mimeType}; charset=${mimeConfig.charset.toLowerCase()}` :
                    mimeType.startsWith('text/') ?
                    `${mimeType}; charset=utf-8` :
                    false
            }else{
                return false
            }
        }
    }
    return false
}

export function getMimeExt(str: MimeType): string | boolean {
    if(str && typeof str === 'string') {
        const config = MIME_TYPES_CONFIG[str as MimeType]
        return config?.ext?.length ? config.ext[0] : false
    }
    return false
}

export function getMimeType(path: string): string | boolean {
    return path && typeof path === 'string' && path.trim() !== '' ? EXT_MIME_TYPES[extname('x.' + path.trim()).toLowerCase().substring(1)] || false : false
}
