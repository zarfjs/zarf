import { TextMimeType, MIME_TEXT } from './text.ts'
import { FontMimeType, MIME_FONT } from './font.ts'
import { ImageMimeType, MIME_IMAGE } from './image.ts'
import { AudioMimeType, MIME_AUDIO } from './audio.ts'
import { VideoMimeType, MIME_VIDEO } from './video.ts'
import { AppMimeType , MIME_APP } from './application.ts'

export type MultipartMimeType = `multipart/${string}`
export type MimeType = TextMimeType | FontMimeType | ImageMimeType | AudioMimeType | VideoMimeType | MultipartMimeType | AppMimeType
export type MimeTypeConfig = {
    ext?: Array<string>,
    cmp?: boolean,
    charset?: "UTF-8"
}

export const MIME_TYPES_CONFIG: Record<MimeType, MimeTypeConfig> = {
    ...MIME_TEXT,
    ...MIME_FONT,
    ...MIME_IMAGE,
    ...MIME_AUDIO,
    ...MIME_VIDEO,
    ...MIME_APP,
    "multipart/form-data": {
      "cmp": false
    }
}

function populateExtensionsMimeTypes() {
    Object.entries(MIME_TYPES_CONFIG).forEach(([mimeType, mimeConfig]) => {
        if(mimeConfig.ext && mimeConfig.ext.length) {
            MIME_TYPE_EXT[mimeType as MimeType] = mimeConfig.ext
            mimeConfig.ext.forEach(ext => {
                EXT_MIME_TYPES[ext] = mimeType as MimeType
            })
        }
    })
}

// Runtime consts
export const EXT_MIME_TYPES: Record<string, MimeType> = Object.create(null);
export const MIME_TYPE_EXT: Record<MimeType, Array<string>> = Object.create(null);

populateExtensionsMimeTypes()
