import { MimeTypeConfig } from "./index.ts"
export type AudioType = 'audio'
export type AudioMimeType = `${AudioType}/${string}`

export const MIME_AUDIO: Record<AudioMimeType, MimeTypeConfig> = {
      "audio/3gpp": {
        "cmp": false,
        "ext": ["3gpp"]
      },
      "audio/3gpp2": {
      },
      "audio/aac": {
      },
      "audio/ac3": {
      },
      "audio/midi": {
        "ext": ["mid","midi","kar","rmi"]
      },
      "audio/mp3": {
        "cmp": false,
        "ext": ["mp3"]
      },
      "audio/mp4": {
        "cmp": false,
        "ext": ["m4a","mp4a"]
      },
      "audio/mpeg": {
        "cmp": false,
        "ext": ["mpga","mp2","mp2a","mp3","m2a","m3a"]
      },
      "audio/ogg": {
        "cmp": false,
        "ext": ["oga","ogg","spx","opus"]
      },

      "audio/wav": {
        "cmp": false,
        "ext": ["wav"]
      },
      "audio/wave": {
        "cmp": false,
        "ext": ["wav"]
      },
      "audio/webm": {

        "cmp": false,
        "ext": ["weba"]
      },
      "audio/x-aac": {

        "cmp": false,
        "ext": ["aac"]
      },
      "audio/x-flac": {
        "ext": ["flac"]
      },
      "audio/x-m4a": {
        "ext": ["m4a"]
      },
      "audio/x-matroska": {
        "ext": ["mka"]
      },
      "audio/x-mpegurl": {
        "ext": ["m3u"]
      },
      "audio/x-ms-wma": {
        "ext": ["wma"]
      },
      "audio/x-wav": {
        "ext": ["wav"]
      },
      "audio/xm": {
        "ext": ["xm"]
      },
}
