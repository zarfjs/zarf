import { MimeTypeConfig } from '.'

export type ImageType = 'image'
export type ImageMimeType = `${ImageType}/${string}`

export const MIME_IMAGE: Record<ImageMimeType, MimeTypeConfig> = {
	'image/apng': {
		cmp: false,
		ext: ['apng']
	},
	'image/avci': {
		ext: ['avci']
	},
	'image/avcs': {
		ext: ['avcs']
	},
	'image/avif': {
		cmp: false,
		ext: ['avif']
	},
	'image/bmp': {
		cmp: true,
		ext: ['bmp']
	},

	'image/gif': {
		cmp: false,
		ext: ['gif']
	},

	'image/jp2': {
		cmp: false,
		ext: ['jp2', 'jpg2']
	},
	'image/jpeg': {
		cmp: false,
		ext: ['jpeg', 'jpg', 'jpe']
	},

	'image/pjpeg': {
		cmp: false
	},
	'image/png': {
		cmp: false,
		ext: ['png']
	},

	'image/svg+xml': {
		cmp: true,
		ext: ['svg', 'svgz']
	},
	'image/t38': {
		ext: ['t38']
	},
	'image/tiff': {
		cmp: false,
		ext: ['tif', 'tiff']
	},
	'image/tiff-fx': {
		ext: ['tfx']
	},
	'image/vnd.adobe.photoshop': {
		cmp: true,
		ext: ['psd']
	},

	'image/vnd.microsoft.icon': {
		cmp: true,
		ext: ['ico']
	},

	'image/vnd.ms-photo': {
		ext: ['wdp']
	},
	'image/vnd.net-fpx': {
		ext: ['npx']
	},

	'image/webp': {
		ext: ['webp']
	},
	'image/wmf': {
		ext: ['wmf']
	},

	'image/x-icon': {
		cmp: true,
		ext: ['ico']
	},

	'image/x-ms-bmp': {
		cmp: true,
		ext: ['bmp']
	}
}
