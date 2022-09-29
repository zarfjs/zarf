import { MimeTypeConfig } from '.'

export type AppType = 'application'
export type AppMimeType = `${AppType}/${string}`

export const MIME_APP: Record<AppMimeType, MimeTypeConfig> = {
	'application/atom+xml': {
		cmp: true,
		ext: ['atom']
	},
	'application/calendar+json': {
		cmp: true
	},
	'application/calendar+xml': {
		cmp: true,
		ext: ['xcs']
	},
	'application/epub+zip': {
		cmp: false,
		ext: ['epub']
	},
	'application/font-woff': {
		cmp: false
	},
	'application/geo+json': {
		cmp: true,
		ext: ['geojson']
	},
	'application/inkml+xml': {
		cmp: true,
		ext: ['ink', 'inkml']
	},

	'application/java-archive': {
		cmp: false,
		ext: ['jar', 'war', 'ear']
	},
	'application/java-serialized-object': {
		cmp: false,
		ext: ['ser']
	},
	'application/java-vm': {
		cmp: false,
		ext: ['class']
	},
	'application/javascript': {
		charset: 'UTF-8',
		cmp: true,
		ext: ['js', 'mjs']
	},
	'application/jf2feed+json': {
		cmp: true
	},
	'application/json': {
		charset: 'UTF-8',
		cmp: true,
		ext: ['json', 'map']
	},
	'application/json-patch+json': {
		cmp: true
	},
	'application/json5': {
		ext: ['json5']
	},
	'application/jsonml+json': {
		cmp: true,
		ext: ['jsonml']
	},
	'application/ld+json': {
		cmp: true,
		ext: ['jsonld']
	},
	'application/manifest+json': {
		charset: 'UTF-8',
		cmp: true,
		ext: ['webmanifest']
	},
	'application/msword': {
		cmp: false,
		ext: ['doc', 'dot']
	},
	'application/node': {
		ext: ['cjs']
	},
	'application/octet-stream': {
		cmp: false,
		ext: [
			'bin',
			'dms',
			'lrf',
			'mar',
			'so',
			'dist',
			'distz',
			'pkg',
			'bpk',
			'dump',
			'elc',
			'deploy',
			'exe',
			'dll',
			'deb',
			'dmg',
			'iso',
			'img',
			'msi',
			'msp',
			'msm',
			'buffer'
		]
	},
	'application/pdf': {
		cmp: false,
		ext: ['pdf']
	},
	'application/gzip': {
		cmp: false,
		ext: ['gz']
	},
	'application/x-bzip': {
		cmp: false,
		ext: ['bz']
	},
	'application/x-bzip2': {
		cmp: false,
		ext: ['bz2', 'boz']
	},

	'application/x-mobipocket-ebook': {
		ext: ['prc', 'mobi']
	},
	'application/x-mpegurl': {
		cmp: false
	},
	'application/x-ms-application': {
		ext: ['application']
	},
	'application/x-msdos-program': {
		ext: ['exe']
	},
	'application/x-msdownload': {
		ext: ['exe', 'dll', 'com', 'bat', 'msi']
	},
	'application/x-rar-compressed': {
		cmp: false,
		ext: ['rar']
	},
	'application/x-shockwave-flash': {
		cmp: false,
		ext: ['swf']
	},
	'application/x-sql': {
		ext: ['sql']
	},
	'application/x-web-app-manifest+json': {
		cmp: true,
		ext: ['webapp']
	},
	'application/x-www-form-urlencoded': {
		cmp: true
	},
	'application/xhtml+xml': {
		cmp: true,
		ext: ['xhtml', 'xht']
	},
	'application/xml': {
		cmp: true,
		ext: ['xml', 'xsl', 'xsd', 'rng']
	},
	'application/zip': {
		cmp: false,
		ext: ['zip']
	}
}
