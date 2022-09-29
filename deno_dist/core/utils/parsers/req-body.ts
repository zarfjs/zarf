import type { ParsedFormData, ParsedFileField } from './form-data.ts'
import type { ParsedUrlQuery } from './query-string.ts'
import { getFormDataFromRequest } from "./form-data.ts"
import { parseQueryParams } from './query-string.ts'

export type ParsedBody = string | ParsedUrlQuery | ParsedFormData

export async function parseBody(request: Request): Promise<ParsedBody>  {
    const contentType = request?.headers.get('Content-Type') || ''
    if(contentType.includes('application/json')) {
        // for `json` type
        let body = {}
        try {
            body = await request!.json()
          } catch {
            // do nothing
          }
        return body
    } else if (contentType.includes('application/text') || contentType.startsWith('text')) {
        // for `application/text` and `text/plain`
        return await request!.text()
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const urlEncodedForm = await request.text()
        return parseQueryParams(urlEncodedForm)
    } else {
        return await getFormDataFromRequest(request)
     }
}
