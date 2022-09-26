import { bufferToString } from './buffer'

export async function getFormDataFromRequest(request: Request) {
    const arrayBuffer = await request?.arrayBuffer()
    const boundary = getBoundary(request?.headers.get('Content-Type') || '')
    if (boundary) {
        return getParsedFormData(Buffer.from(arrayBuffer), boundary)
    } else {
        return {}
    }
}

function getBoundary(header: string) {
    var items = header.split(';');
    if (items) {
        for (var i = 0; i < items.length; i++) {
            var item = new String(items[i]).trim();
            if (item.indexOf('boundary') >= 0) {
                var k = item.split('=');
                return new String(k[1]).trim().replace(/^["']|["']$/g, "");
            }
        }
    }
    return '';
}

export interface ParsedFileField {
    filename: string
    type: string,
    data: Buffer,
    size: number
}
export type ParsedFormData = Record<string, string | ParsedFileField>

/**
 * Get parsed form data
 * @param data
 * @param boundary
 * @param spotText
 * @returns
 */
function getParsedFormData(buffer: Buffer, boundary: string, spotText?: string): ParsedFormData {
    const result: Record<string, any> = {};
    const data = bufferToString(buffer)
    data.split(boundary)
        .forEach(item => {
            const nameMatch = item.match(/name=".+"/g)
            if(nameMatch) {
                if (/filename=".+"/g.test(item)) {
                    const fileNameMatch = item.match(/filename=".+"/g)
                    const contentTypeMatch = item.match(/Content-Type:\s.+/g)
                    if(contentTypeMatch && fileNameMatch) {
                        const fieldName = nameMatch[0].replace(fileNameMatch[0], '').slice(6, -3)
                        result[fieldName] = {
                            filename: fileNameMatch?.[0].slice(10, -1),
                            type: contentTypeMatch[0].slice(14),
                            data: spotText? Buffer.from(item.slice(item.search(/Content-Type:\s.+/g) + contentTypeMatch[0].length + 4, -4), 'binary'):
                                item.slice(item.search(/Content-Type:\s.+/g) + contentTypeMatch[0].length + 4, -4),
                        };
                        result[fieldName]['size'] = Buffer.byteLength(result[fieldName].data)
                    }
                } else if (/name=".+"/g.test(item)){
                    result[nameMatch[0].slice(6, -1)] = item.slice(item.search(/name=".+"/g) + nameMatch[0].length + 4, -4);
                }
            }
        });
    return result
}
