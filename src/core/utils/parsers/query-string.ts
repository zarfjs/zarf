export type ParsedUrlQuery = {
    [key: string]: string;
}
/**
 *
 * @param query
 * @returns
 */

 export const parseQueryParams = (searchParamsStr = ''): ParsedUrlQuery => Object.fromEntries(new URLSearchParams(searchParamsStr).entries())
