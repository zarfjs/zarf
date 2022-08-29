

import LRU from 'mnemonist/lru-cache'
const enginesImportMap = {
    'liquidjs': 'liquidjs',
    'ejs': 'ejs',
    'react-ssr':  'react-dom/server',
    'preact-ssr': 'preact-render-to-string'
}
export type SupportedTplEngine = keyof typeof enginesImportMap

export interface BunTeaViewOptions {
    viewDir?: string
    globals?: Record<string, any>
    maxCache?: number
    useViewExt?: boolean
    isProd?: boolean
    ctx?: Record<string, any>
    rootLayout?: string | undefined
}

interface ViewEngineOptions {
    cache?: boolean
    [key: string]: any;
}

interface ModuleOptions<T extends object = {}> {
    mode: 'class' | 'function',
    qualiferName?: string,
    fileRenderFunc?: string,
    initOptions?: T,
    requires?: Array<string>,
    initDefault?: boolean
}

export const importsMap: Map<string, any> = new Map()

export class BunTeaViewEngine {
    protected driverName: string | undefined;
    constructor(readonly name: SupportedTplEngine, readonly options: BunTeaViewOptions, readonly mod: ModuleOptions = {
        mode: 'function',
        qualiferName: '',
        fileRenderFunc: '',
        initOptions: {},
        requires: [],
        initDefault: false
    }) {}
    async init() {
        await this.import(this.name, this.options)
    }

    get engine(): any {
        return importsMap.get(this.name)
    }

    compile(tpl: string, options: ViewEngineOptions) {
        return this.$compile.call(this, tpl, options)(options)
    }

    async compileFile(tplName: string, options: ViewEngineOptions) {
        return await this.$compileFile.call(this, tplName, options)
    }

    protected $compile(tpl: string, options: ViewEngineOptions): (options: ViewEngineOptions) => Promise<string> {
        return this.engine.compile(tpl, options)
    }

    protected async $compileFile(fileName: string, options: ViewEngineOptions): Promise<string> {
        return await this.engine.renderFile ?
            this.engine.renderFile(fileName, options) :
                (
                    this.mod.fileRenderFunc &&
                    this.engine[this.mod.fileRenderFunc] &&
                    typeof this.engine[this.mod.fileRenderFunc] === 'function') ?
                        this.engine[this.mod.fileRenderFunc](fileName, options) :
                        this._compileFile(fileName, options)
    }

    private async _compileFile(fileName: string, options: ViewEngineOptions) {
        const tpl = await Bun.file(fileName).text()
        return this.$compile(tpl, options)
    }

    protected import(name: string, options: BunTeaViewOptions) {
        const imports = [ ...(this.mod.requires || []), name ].map(async (importable: string) => {
            try {
                this.driverName = name
                if(!importsMap.has(name)) {
                    const toImport = enginesImportMap[name as SupportedTplEngine] || name
                    const imported = await import(toImport)
                    if(this.mod.mode === 'class') {
                        if(this.mod.qualiferName && imported[this.mod.qualiferName]) {
                            const tplEngineInstance = new imported[this.mod.qualiferName](this.mod.initOptions)
                            importsMap.set(name, this.$onInit(tplEngineInstance))
                        } else {
                            throw new Error(`The engine doesnt seem to be having the qualifier you applied`)
                        }
                    } else {

                        const qualifier = this.mod.qualiferName || 'default'
                        const tplEngine =  this.mod.initDefault && typeof imported[qualifier] === 'function' ? imported[qualifier](this.mod.initOptions) : imported[qualifier] ? imported[qualifier] : imported
                        importsMap.set(name, this.$onInit(tplEngine))
                    }
                    return imported.default || {}
                } else {
                    return importsMap.get(name) || {}
                }
            } catch(err) {
                console.log(err)
            }
        })
        return Promise.all(imports)
    }

    protected $onInit(module: any) {
        // do nothing
        return module
    }
}
