import { SessionStorageEngine, SessionStorageEngineOptions } from './engine';
import { storage } from './redis-store'

export class RedisUpstashStorageEngine<T> extends SessionStorageEngine<T> {
    constructor(options: SessionStorageEngineOptions) {
      super(options);
    }
    async init(): Promise<void> {
    }
    async delete(key: string): Promise<void> {
        await storage.del(`${this.sessionName}.${key}`)
    }
    async set(key: string, sessionData: T) {
        await storage.set(`${this.sessionName}.${key}`, JSON.stringify(sessionData), {
            ex: this.ttl * 60 * 1000
        })
    }
    async get(key: string): Promise<T|null> {
      return await storage.get<T>(`${this.sessionName}.${key}`)
    }
    private async getAllMatchingKeys(): Promise<Array<string>> {
        return await storage.keys(`${this.sessionName}\.*`)
    }
    async getAll(): Promise<T[]> {
        const keys = await this.getAllMatchingKeys()
        if(keys.length) {
            const fetchValCalls = keys.map(key => storage.get<T>(key))
            const vals = await Promise.all(fetchValCalls)
            // @ts-ignore
            return vals
        }else {
            return []
        }
    }
  }
