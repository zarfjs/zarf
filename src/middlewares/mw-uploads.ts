import type { MiddlewareFunctionInitializer } from '../core/middleware'
import { isFileField } from '../core/utils/parsers/form-data'

import * as fs from 'node:fs/promises'
import { constants } from 'node:fs'
import { join, extname, basename } from 'path'

type Slash = '/'
type MiddlewareOptions = {
    path?: '.' | '..' | `${Slash}${string}`
    useTempDir?: boolean
    useOriginalFileName?: boolean
    useLocals?: boolean
}

const MW_UPLOAD_DIR = 'uploads'
const MW_OPTION_DEFAULTS: MiddlewareOptions = {
    useTempDir: false,
    useOriginalFileName: false,
    useLocals: false
}

const REQ_LOCALS_ID = 'uploads'
export type RequestIdLocals = {[REQ_LOCALS_ID]?: Record<string, string>}

function getRandomizedFileName(filename: string) {
    return `${Date.now()}-${crypto.randomUUID()}${extname(filename)}`;
}

function isValidPath(path: string) {
    const _path = path.trim()
    return _path === '.' || _path === '..' || basename(_path)
}

export const uploads: MiddlewareFunctionInitializer<MiddlewareOptions, RequestIdLocals> = (opts) => {
    const options = { ...MW_OPTION_DEFAULTS, ...opts }
    return async (ctx, next) => {
        // The entire middleware runs only when `body-parser` has run before.
        // `body-parser` middleware already makes sure that `ctx.body` is
        // populated only when the request is one of the `POST`ables
        if(ctx.body) {
            const uploadDir = options.path && isValidPath(options.path) ? join(options.path, MW_UPLOAD_DIR) : options.useTempDir && process.env.TMPDIR ? join(process.env.TMPDIR, MW_UPLOAD_DIR) : join(process.cwd(), MW_UPLOAD_DIR)

            try {
                await fs.access(uploadDir, constants.R_OK)
            } catch(e: any) {
                if(e?.code && e.code === 'ENOENT') {
                    await fs.mkdir(uploadDir)
                } else {
                    throw new Error('Upload middleware cannot proceed')
                }
            }
            const locals: Record<string, string> = {}
            Object.entries(ctx.body).filter(isFileField).forEach(async([name, file]) => {
                if(file.filename) {
                    const filename = options.useOriginalFileName ? file.filename : getRandomizedFileName(file.filename)
                    const filepath = join(uploadDir, filename)
                    if(options.useLocals) locals[name] = filepath
                    await Bun.write(filepath, new Blob([ file.data ], {
                        type: file.type
                    }))
                }
            })
            if(options.useLocals) ctx.locals[REQ_LOCALS_ID] = locals
        } else {
            console.debug(`Please configure body parser module to run before`)
        }
        await next()
    }
}
