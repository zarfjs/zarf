import { storage } from './local-store'
import { SessionStorageEngine, SessionStorageEngineOptions } from './engine';

// @todo: Last Access Time
export class SQLiteStorageEngine<T> extends SessionStorageEngine<T> {
    constructor(options: SessionStorageEngineOptions) {
      super(options);
    }
    async init(): Promise<void> {
    //   clearInterval(this.checkInterval);
    //   this.checkInterval = setInterval(async () => {
    //     const sessions = await this.getAll();
    //     const currentTime = Date.now();
    //     for (const s of sessions) {
    //       if ((currentTime - s.lastAccessTime) > expiresInMS) {
    //         await this.delete(s.key);
    //       }
    //     }
    //   }, expiresInMS);
    }
    async delete(key: string): Promise<void> {
      await storage.delete(`${this.sessionName}.${key}`);
    }
    async set(key: string, sessionData: T): Promise<void> {
      return await storage.set(`${this.sessionName}.${key}`, sessionData);
    }
    async get(key: string): Promise<T> {
      return await storage.get(`${this.sessionName}.${key}`);
    }
    async getAll(): Promise<T[]> {
      return await storage.getList(`${this.sessionName}.`);
    }
  }
