import { parse, ParsedUrlQuery } from 'querystring'
/**
 *
 * @param query
 * @returns
 */

 export const parseQueryParams = (url = '/'): ParsedUrlQuery => parse(url.slice(getPathQueryIndex(url) + 1))
 const getPathQueryIndex = (path: string): number => {
     const index = path.indexOf('?')
     return index === -1 ? path.length : index
 }
