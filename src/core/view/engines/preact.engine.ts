import { BunTeaViewEngine, BunTeaViewOptions } from './engine'

export class BunTeaPreactViewEngine extends BunTeaViewEngine {
    constructor(readonly options: BunTeaViewOptions){
        super('preact-ssr', options, {
            mode: 'function',
            requires: [ 'preact' ]
        })
    }

    protected $compile(tpl: string, options: any) {
        return (options: any) => {
            return this.engine(tpl, options)
        }
    }

    protected async $compileFile(tplName: string, options: any) {
        const doc = await import(`${this.options.viewDir}/pages/_document.ts`)
        const file = await import(`${this.options.viewDir}/pages/${tplName}.ts`)
        return this.engine((doc.default({
            children: file.default(options),
            styleTag: ''
        })))
    }
}
