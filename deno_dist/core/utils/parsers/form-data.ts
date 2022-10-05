import { Buffer } from "https://deno.land/std@0.158.0/node/buffer.ts";
import { asString } from './buffer.ts'

export async function getFormDataFromRequest(request: Request) {
    const boundary = getBoundary(request?.headers.get('Content-Type') || '')
    if (boundary) {
        return await getParsedFormData(request, boundary)
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

const normalizeLf = (str: string) => str.replace(/\r?\n|\r/g, '\r\n')
const escape = (str: string) => normalizeLf(str).replace(/\n/g, '%0A').replace(/\r/g, '%0D').replace(/"/g, '%22')
const replaceTrailingBoundary = (value: string, boundary: string) => {
    const boundaryStr = `--${boundary.trim()}--`
    return value.replace(boundaryStr, '')
}

export interface ParsedFileField {
    filename: string
    type: string,
    data: Buffer,
    size: number,
}
export type ParsedFormData = Record<string, string | ParsedFileField>

export function isFileField(fieldTuple: [string, string | ParsedFileField ]): fieldTuple is [string, ParsedFileField] {
    return typeof fieldTuple[1] !== 'string';
}
/**
 * Get parsed form data
 * @param data
 * @param boundary
 * @param spotText
 * @returns
 */

async function getParsedFormData(request: Request, boundary: string, spotText?: string): Promise<ParsedFormData> {
    const _boundary = ' ' + `${boundary}`
    const result: Record<string, any> = {};
    const prefix = `--${_boundary.trim()}\r\nContent-Disposition: form-data; name="`
    const data = asString(Buffer.from(await request?.arrayBuffer()))
    const multiParts = data.split(prefix).filter(
        part => part.includes('"')
    ).map(
        part => [
            part.substring(0, part.indexOf('"')),
            part.slice(part.indexOf('"') + 1, -1)
        ]
    )
    multiParts.forEach(item => {
            if (/filename=".+"/g.test(item[1])) {
                const fileNameMatch = item[1].match(/filename=".+"/g)
                const contentTypeMatch = item[1].match(/Content-Type:\s.+/g)
                if(contentTypeMatch && fileNameMatch) {
                    result[item[0]] = {
                        filename: fileNameMatch?.[0].slice(10, -1),
                        type: contentTypeMatch[0].slice(14),
                        data: spotText? Buffer.from(item[1].slice(item[1].search(/Content-Type:\s.+/g) + contentTypeMatch[0].length + 4, -4), 'binary'):
                        Buffer.from(item[1].slice(item[1].search(/Content-Type:\s.+/g) + contentTypeMatch[0].length + 4, -4), 'binary'),
                    };
                    result[item[0]]['size'] = Buffer.byteLength(result[item[0]].data)
                }
            } else {
                result[item[0]] = normalizeLf(replaceTrailingBoundary(item[1], _boundary)).trim()
            }
    });
    return result
}
