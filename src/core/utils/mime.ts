import * as mime from 'es-mime-types'

export const getMimeType = (type:string) =>  type.indexOf('/') === -1 ? mime.lookup(type) : type
export const getContentType = (type:string) =>  type.indexOf('/') === -1 ? mime.contentType(type) : type
