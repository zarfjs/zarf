import * as path from 'path'
import * as fs from 'fs/promises'
import { constants, readFileSync as nodeCompatReadFileSync } from 'fs'
import LRU from 'mnemonist/lru-cache'
const cache = new LRU<string, string>(100)

export default {
    readFileSync(filePath: string) {
        return nodeCompatReadFileSync(filePath, 'utf-8')
    },
    async readFile(filePath: string) {
        const tplCacheKey = path.basename(filePath)
        if(cache.has(tplCacheKey)){
            return cache.get(tplCacheKey) as string
        } else {
            const file = Bun.file(filePath)
            const text = await file.text()
            cache.set(tplCacheKey, text)
            return text
        }
    },
    existsSync () {
        return true
    },
    resolve(dir: string, file: string, ext: string) {
        if (!path.extname(file)) file += ext
        return path.resolve(dir, file)
    },
    async exists (filePath: string) {
        try {
            await fs.access(filePath, constants.R_OK)
            return true
        } catch (e) {
            return false
        }
    },
    dirname(filePath: string) {
        return path.dirname(filePath)
    },
    contains () {
        return true
    },
    sep: path.sep
}
