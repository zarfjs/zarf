import * as path from 'path'
import { BunTeaViewEngine, BunTeaViewOptions } from './engine'
import liquidOptionsFs from './liquid.options.fs'

export class BunTeaLiquidViewEngine extends BunTeaViewEngine {
    constructor(options: BunTeaViewOptions){
        super('liquidjs', options, {
            mode: 'class',
            qualiferName: 'Liquid',
            initOptions: {
                // cache: true,
                root: options.viewDir,
                extname: '.liquid',
                layouts: path.resolve(options.viewDir!, 'layout'),
                partials: path.resolve(options.viewDir!, 'partials'),
                fs: liquidOptionsFs
            }
        })
    }

    protected $compile(tpl: string, options: any) {
        return (options: any) => {
            return this.engine.parseAndRenderSync(tpl, options)
        }
    }
}
