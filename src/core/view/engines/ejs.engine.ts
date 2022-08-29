import { BunTeaViewEngine, BunTeaViewOptions } from './engine'
import LRU from 'mnemonist/lru-cache'
import * as path from 'path'
import * as fs from 'fs'


export class BunTeaEjsViewEngine extends BunTeaViewEngine {
    constructor(readonly options: BunTeaViewOptions){
        super('ejs', options, { mode: 'function', initDefault: true })
    }

    protected $onInit(module: any): void {
        const options = this.options
        module.fileLoader = function (fileName: string) {
            const filePath = path.join(options.viewDir!, path.extname(fileName) !== 'ejs' ? `${fileName}.ejs` : fileName);
            return fs.readFileSync(filePath, 'utf-8');
        };
        // module.cache = new LRU(100)
        return module
    }
}
