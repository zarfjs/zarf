import { BunStorageEngineInitOptions } from '../storage'
import { BunSessionStorageEngine, SessionStorageEngineOptions } from '../session.storage'
import { isAsyncFn } from '../../../core/utils/is'

type SessionData = {
    data: Record<string, any>,
    lastAccessTime: number
}

export class BunInMemorySessionStorageEngine<T extends SessionData> extends BunSessionStorageEngine<T> {

    private data = new Map<string, T>()
    private checkInterval: ReturnType<typeof setInterval> | undefined
    private config: BunStorageEngineInitOptions<T> = {
        debug: false
    }

    constructor(options: SessionStorageEngineOptions) {
      super(options);
    }

    async init(options?: BunStorageEngineInitOptions<T>): Promise<void> {
        this.config = { ...this.config, ...options }
        const shouldAutoExpire = this.config.interval !== null || this.config.interval !== 0
        if(shouldAutoExpire) {
            if(this.config.debug) console.debug(`Engine: Memory - ⏰ keeping a watch on values for their 'ttl'`)
            clearInterval(this.checkInterval);
            this.checkInterval = setInterval(async () => {
                const items = await this.getAllMap()
                const currentTime = Date.now();
                items.forEach(async(item, key) => {
                    if ((currentTime - item.lastAccessTime) > this.options.ttl!) {
                        if(this.config.debug) console.debug(`Engine: Memory - ⏰ ${key} has expired, and will be removed shortly`)
                        await this.delete(key);
                    }
                })
                const hasItems = (await this.getAll()).length
                if(!hasItems) {
                    clearInterval(this.checkInterval)
                    if(this.config.debug) console.debug(`Engine: Memory - ⏰ All 'ttl' watchers removed!`)
                    await this.close()
                }
            }, this.config?.interval || this.options.ttl);
        }
    }

    async set(key: string, sessionData: T): Promise<void> {
      await this.data.set(this.key(key), sessionData);
    }

    async get(key: string): Promise<T|null> {
        const _key = this.key(key)
        if(this.data.has(_key)) {
            const value = this.data.get(_key)
            if(value) {
                const currentTime = Date.now();
                if ((currentTime - value.lastAccessTime) > this.options.ttl!) {
                    await this.delete(key);
                    return null
                }
                return value
            } else {
                return null
            }
        }
        return null
    }

    async getAll(): Promise<T[]> {
        const sessionDataList: Array<T> = []
        this.data.forEach((sessionData, key) => {
            if(this.isValidKey(key)) {
                sessionDataList.push(sessionData)
            }
        })
      return await sessionDataList
    }

    async delete(key: string): Promise<void> {
        await this.data.delete(this.key(key));
    }

    async reset(): Promise<void> {
        this.data = new Map()
    }

    async close() {
        const doneFn = this.config.done
        if(doneFn) {
            if(isAsyncFn(doneFn)) {
                await doneFn()
            } else {
                doneFn()
            }
        }
    }


    async getAllMap(): Promise<Map<string, T>> {
        const sessionDataMap: Map<string, T> = new Map()
        this.data.forEach((sessionData, key) => {
            if(this.isValidKey(key)) {
                sessionDataMap.set(key, sessionData)
            }
        })
      return await sessionDataMap
    }

    private key(key: string): string {
        return `${this.options.sessionName}.${key}`
    }

    private isValidKey(key: string): boolean {
        return key.startsWith(this.key(''))
    }

    async debug(structured = false ) {
        if(structured) {
            const table: Array<{ key: string, value: any }> = []
            const items = await this.getAllMap()
            items.forEach(async(item, key) => {
                table.push({
                    key,
                    value: item
                })
            })
            console.table(table)
        } else {
            console.log(Object.fromEntries(this.data.entries()))
        }
    }
}
