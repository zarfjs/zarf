import { MimeTypeConfig } from '.'

export type FontType = 'font'
export type FontMimeType = `${FontType}/${string}`

export const MIME_FONT: Record<FontMimeType, MimeTypeConfig> = {
	'font/collection': {
		ext: ['ttc']
	},
	'font/otf': {
		cmp: true,
		ext: ['otf']
	},
	'font/ttf': {
		cmp: true,
		ext: ['ttf']
	},
	'font/woff': {
		ext: ['woff']
	},
	'font/woff2': {
		ext: ['woff2']
	}
}
