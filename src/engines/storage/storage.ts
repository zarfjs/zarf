
export interface BunStorageEngineInitOptions<D extends Record<string, any> = {}> {
    // db?: () => Map<string, D>
    interval?: number | null
    done?: () => void | Promise<void>,
    debug?: boolean
}

export abstract class BunStorageEngine<T extends Record<string, any> = {}, D extends Record<string, any> = {}> {
    readonly options: T
    constructor(options: T) {
        this.options = options
    }

    async init(options?: BunStorageEngineInitOptions): Promise<void> {
      throw new Error(`"init" not implemented in: ${this.constructor.name}`);
    }

    async set(key: string, data: D): Promise<void|number> {
        throw new Error(`"set" not implemented in: ${this.constructor.name}`);
    }

    async get(key: string): Promise<D|null> {
        throw new Error(`"get" not implemented in: ${this.constructor.name}`);
    }

    async getAll(): Promise<D[]> {
        throw new Error(`"getAll" not implemented in: ${this.constructor.name}`);
    }

    async delete(key: string): Promise<void> {
      throw new Error(`"delete" not implemented in: ${this.constructor.name}`);
    }

    async reset(): Promise<void> {
        throw new Error(`"reset" not implemented in: ${this.constructor.name}`);
    }

    async close(): Promise<void> {
        throw new Error(`"close" not implemented in: ${this.constructor.name}`);
    }
}
