
import { BunTeaViewEngine, BunTeaViewOptions, SupportedTplEngine } from './engines/engine'
export * from './engines/engine'

import { BunTeaEjsViewEngine } from './engines/ejs.engine'
import { BunTeaLiquidViewEngine } from './engines/liquid.engine'
import { BunTeaReactViewEngine } from './engines/react.engine'
import { BunTeaPreactViewEngine } from './engines/preact.engine'

const defaultConfig: BunTeaViewOptions = {
    viewDir: '',
    globals: {},
    maxCache: 100,
    useViewExt: false,
    isProd: false,
    ctx: {},
    rootLayout: ''
}

export class BunTeaView {
    private _engine: BunTeaViewEngine
    constructor(readonly tplEngine: SupportedTplEngine , readonly config: BunTeaViewOptions) {
        if(tplEngine === 'liquidjs') {
            this._engine = new BunTeaLiquidViewEngine({...defaultConfig, ...config})
        } else if (tplEngine === 'ejs') {
            this._engine = new BunTeaEjsViewEngine({...defaultConfig, ...config})
        } else if (tplEngine === 'react-ssr') {
            this._engine = new BunTeaReactViewEngine({...defaultConfig, ...config})
        } else if (tplEngine === 'preact-ssr') {
            this._engine = new BunTeaPreactViewEngine({...defaultConfig, ...config})
        } else {
            this._engine = new BunTeaLiquidViewEngine({...defaultConfig, ...config})
        }
    }

    async init() {
        await this._engine.init()
    }

    get engine() {
        return this._engine.engine
    }

    async parse(viewName: string, data: Record<string, any>, options: any) {
        try {
            if(this._engine.engine) {
                return await this._engine?.compileFile(viewName, data)
            } else {
                throw new Error(`template engine not initialized`)
            }
        } catch (err) {
            throw err
        }
    }
}
