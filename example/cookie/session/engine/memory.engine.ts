import { SessionStorageEngine, SessionStorageEngineOptions } from './engine';

// @todo: Last Access Time
export class InMemoryStorageEngine<T> extends SessionStorageEngine<T> {
    private data = new Map()
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
      await this.data.delete(`${this.sessionName}.${key}`);
    }
    async set(key: string, sessionData: T): Promise<void> {
      await this.data.set(`${this.sessionName}.${key}`, sessionData);
    }
    async get(key: string): Promise<T> {
      return await this.data.get(`${this.sessionName}.${key}`);
    }
    async getAll(): Promise<T[]> {
        const sessionDataList: Array<T> = []
      this.data.forEach((sessionData, key) => {
        if(key.startsWith(`${this.sessionName}.`)) {
            sessionDataList.push(sessionData)
        }
      })
      return await sessionDataList
    }
  }
