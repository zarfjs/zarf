import { BunTeaViewEngine, BunTeaViewOptions } from './engine'

export class BunTeaReactViewEngine extends BunTeaViewEngine {
    constructor(readonly options: BunTeaViewOptions){
        super('react-ssr', options, {
            mode: 'function',
            requires: [ 'react' ],
            initOptions: {}
        })
    }

    protected $compile(tpl: string, options: any) {
        return (options: any) => {
            return this.engine.renderToStaticMarkup(tpl, options)
        }
    }

    protected async $compileFile(tplName: string, options: any) {
        const doc = await import(`${this.options.viewDir}/pages/_document.tsx`)
        const file = await import(`${this.options.viewDir}/pages/${tplName}.tsx`)

        return this.engine.renderToStaticMarkup(doc.default({
            children: file.default(options),
            styleTag: ''
        }))
    }
}
