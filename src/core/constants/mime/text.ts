import { MimeTypeConfig } from '.'

export type TextType = 'text'
export type TextMimeType = `${TextType}/${string}`

export const MIME_TEXT: Record<TextMimeType, MimeTypeConfig> = {
	'text/cache-manifest': {
		cmp: true,
		ext: ['appcache', 'manifest']
	},
	'text/calendar': {
		ext: ['ics', 'ifb']
	},
	'text/calender': {
		cmp: true
	},
	'text/cmd': {
		cmp: true
	},
	'text/coffeescript': {
		ext: ['coffee', 'litcoffee']
	},
	'text/css': {
		charset: 'UTF-8',
		cmp: true,
		ext: ['css']
	},
	'text/csv': {
		cmp: true,
		ext: ['csv']
	},
	'text/html': {
		cmp: true,
		ext: ['html', 'htm', 'shtml']
	},
	'text/jade': {
		ext: ['jade']
	},
	'text/javascript': {
		cmp: true
	},
	'text/jsx': {
		cmp: true,
		ext: ['jsx']
	},
	'text/less': {
		cmp: true,
		ext: ['less']
	},
	'text/markdown': {
		cmp: true,
		ext: ['markdown', 'md']
	},
	'text/mdx': {
		cmp: true,
		ext: ['mdx']
	},
	'text/plain': {
		cmp: true,
		ext: ['txt', 'text', 'conf', 'def', 'list', 'log', 'in', 'ini']
	},
	'text/richtext': {
		cmp: true,
		ext: ['rtx']
	},
	'text/rtf': {
		cmp: true,
		ext: ['rtf']
	},
	'text/stylus': {
		ext: ['stylus', 'styl']
	},
	'text/tab-separated-values': {
		cmp: true,
		ext: ['tsv']
	},
	'text/uri-list': {
		cmp: true,
		ext: ['uri', 'uris', 'urls']
	},
	'text/vcard': {
		cmp: true,
		ext: ['vcard']
	},
	'text/vnd.dvb.subtitle': {
		ext: ['sub']
	},
	'text/vtt': {
		charset: 'UTF-8',
		cmp: true,
		ext: ['vtt']
	},
	'text/x-handlebars-template': {
		ext: ['hbs']
	},
	'text/xml': {
		cmp: true,
		ext: ['xml']
	},
	'text/yaml': {
		ext: ['yaml', 'yml']
	}
}
