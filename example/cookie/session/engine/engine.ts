export interface SessionStorageEngineOptions {
    ttl?: number
    sessionName?: string
}

const SS_DEFAULT_OPTIONS: SessionStorageEngineOptions = {
    ttl: 10,
    sessionName: 'bun-tea.session-storage-engine'
}

export class SessionStorageEngine<T> {
    ttl: number;
    sessionName: string
    // Number in mins. the session should expire
    constructor(options: SessionStorageEngineOptions) {
        this.ttl = (options.ttl || SS_DEFAULT_OPTIONS.ttl!) * 60 * 1000;
        this.sessionName = options.sessionName || SS_DEFAULT_OPTIONS.sessionName!
    }
    async init(): Promise<void> {
      throw new Error(`"init" not implemented in: ${this.constructor.name}`);
    }
    async delete(key: string): Promise<void> {
      throw new Error(`"delete" not implemented in: ${this.constructor.name}`);
    }
    async set(key: string, sessionData: T): Promise<void|number> {
      throw new Error(`"set" not implemented in: ${this.constructor.name}`);
    }
    async get(key: string): Promise<T|null> {
      throw new Error(`"get" not implemented in: ${this.constructor.name}`);
    }
    async getAll(): Promise<T[]> {
      throw new Error(`"getAll" not implemented in: ${this.constructor.name}`);
    }
}
