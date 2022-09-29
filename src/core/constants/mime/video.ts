import { MimeTypeConfig } from '.'

export type VideoType = 'video'
export type VideoMimeType = `${VideoType}/${string}`

export const MIME_VIDEO: Record<VideoMimeType, MimeTypeConfig> = {
	'video/h264': {
		ext: ['h264']
	},
	'video/h265': {},
	'video/mp4': {
		cmp: false,
		ext: ['mp4', 'mp4v', 'mpg4']
	},
	'video/mpeg': {
		cmp: false,
		ext: ['mpeg', 'mpg', 'mpe', 'm1v', 'm2v']
	},
	'video/ogg': {
		cmp: false,
		ext: ['ogv']
	},
	'video/quicktime': {
		cmp: false,
		ext: ['qt', 'mov']
	},
	'video/vnd.mpegurl': {
		ext: ['mxu', 'm4u']
	},
	'video/webm': {
		cmp: false,
		ext: ['webm']
	},
	'video/x-f4v': {
		ext: ['f4v']
	},
	'video/x-fli': {
		ext: ['fli']
	},
	'video/x-flv': {
		cmp: false,
		ext: ['flv']
	},
	'video/x-m4v': {
		ext: ['m4v']
	},
	'video/x-matroska': {
		cmp: false,
		ext: ['mkv', 'mk3d', 'mks']
	},
	'video/x-msvideo': {
		ext: ['avi']
	}
}
