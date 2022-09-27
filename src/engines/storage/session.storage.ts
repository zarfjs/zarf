import { BunStorageEngine } from "./storage"

export interface SessionStorageEngineOptions {
    ttl?: number
    sessionName?: string
}

const SS_DEFAULT_OPTIONS: Required<SessionStorageEngineOptions> = {
    ttl: 10,
    sessionName: 'bun-tea.session-storage-engine'
}

// Example
export class BunSessionStorageEngine<D extends Record<string, any> = {}> extends BunStorageEngine<SessionStorageEngineOptions, D> {
    constructor(options: SessionStorageEngineOptions = {}) {
        options.ttl = (options.ttl || SS_DEFAULT_OPTIONS.ttl) * 60 * 1000
        options.sessionName = options.sessionName || SS_DEFAULT_OPTIONS.sessionName
        super(options)
    }
}
