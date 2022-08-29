import { MiddlewareFunctionInitializer } from '~/core/middleware'
import { readFilesWithMeta } from '~/core/utils/fs';
import * as fs from "fs/promises";
import { constants } from "fs";

const MW_FILE_SYSTEM = {
    root: '',
    pathPrefix: '',
    browse: false,
    index: '/index.html',
    maxAge: 0,
    notFoundFile: ''
}

export const FileSystem: MiddlewareFunctionInitializer<Partial<typeof MW_FILE_SYSTEM>> = (options) => {
    let { root, pathPrefix, browse, index, maxAge, notFoundFile } = { ...MW_FILE_SYSTEM, ...options }

    if(root === '') throw new Error('FS Root cannot be empty.')
    if(pathPrefix !== '' && pathPrefix.startsWith('/')) pathPrefix = `/${pathPrefix}`

    const resolveFilePath = (filePath: string) => {
        return `${import.meta.dir}${pathPrefix}${filePath}`
    }

    return async (context, next: Function) => {

        // Skip, continuing with this middleware if the request is not a `GET` request
        // @ts-ignore
        if(context.method !== 'get' || context.method !== 'head') {
            await next()
        }

        // Form file path
        let { path: filePath } = context
        if(!filePath.startsWith('/')) filePath = `/${filePath}`
        filePath = resolveFilePath(filePath)

        try {
            await fs.access(filePath, constants.R_OK)
            const fStat = await fs.stat(filePath)

            if(fStat.isDirectory()) {
                const files = await readFilesWithMeta(filePath)
                if(browse) {
                    const indexTplPath = resolveFilePath(index)
                    try {
                        await fs.access(indexTplPath, constants.R_OK)
                        const indexTpl = Bun.file(indexTplPath)
                        const tpl = await indexTpl.text()
                        const DATA = files.map(file => (
                            `
                                <li><a href="./dir/${file.name}" title="${file.name}">${file.name}</a></li>
                            `
                        ))
                        const content = tpl.replace(`<!--LISTING-->`, `<ul>${DATA}</ul>`)
                        return context.html(content)
                    } catch (e) {
                        return context.halt(404, 'The index file configured for listing cannot be found')
                    }
                } else {
                    return context.halt(403, 'The content of this directory are unavailable for listing')
                }
            } else {
                const { mtime, size } = fStat
                const file = await Bun.file(filePath)
                context.setHeader('Content-Length', size.toString())
                if(mtime) {
                    context.setHeader('Last-Modified', mtime.toUTCString())
                }
                if(maxAge) {
                    context.setHeader('Cache-Control', `public, max-age=${maxAge}`)
                }
                // @TODO: Return early for `HEAD`
                // return context.head()
                if(file.type.includes('text')) {
                    return context.text(await file.text())
                } else if (file.type.includes('json')) {
                    return context.json(await file.json())
                } else {
                    return new Response(Buffer.from(await file.arrayBuffer()))
                }
            }
          } catch {
            if(notFoundFile) {
                const notFoundFilePath = resolveFilePath(notFoundFile)
                try {
                    await fs.access(notFoundFilePath, constants.R_OK)
                    const notFoundFile = await Bun.file(notFoundFilePath)
                    if(notFoundFile.type.includes('text')) {
                        return context.html(await notFoundFile.text())
                    }
                    return context.halt(404, 'Not Found')
                } catch {
                    return context.halt(404, 'Not Found')
                }
            } else {
                return context.halt(404, 'Not Found')
            }
        }
    }
}
