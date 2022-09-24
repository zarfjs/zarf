import { Database } from 'bun:sqlite'

export class LocalStore {
    private dbPath: string | undefined
    private db: Database
    private tableName: string

    constructor(
        dbPath = './local_store.sqlite',
        tableName = 'local_store'
    ) {
        this.dbPath = dbPath
        this.tableName = tableName
        this.db = new Database(dbPath)
        this.db.run(
            `CREATE TABLE IF NOT EXISTS ${this.tableName} (key STRING PRIMARY KEY, value TEXT)`
        )
    }

    public async set(key: string, value: any): Promise<void> {
        if (typeof value !== "string") {
          value = JSON.stringify(value);
        }
        this.db.run(
          `INSERT OR IGNORE INTO ${this.tableName} (key, value) VALUES (?, ?)`,
          [key, value],
        );
        this.db.run(
          `UPDATE ${this.tableName} SET value = ? WHERE key = ?`,
          [value, key],
        );
      }

      public async get(key: string) {
        const get = this.db.query(`SELECT value FROM ${this.tableName} WHERE key = ?`)
        const all = get.all(key)
        for (
            var value of all
          ) {
          try {
            return JSON.parse(value);
          } catch (e) {
            return value;
          }
        }
      }

      public async delete(key: string): Promise<void> {
        this.db.run(
          `DELETE FROM ${this.tableName} WHERE key = ?`,
          [key],
        );
      }

      public async getList(keyStartsWith: string): Promise<any[]> {
        const getList = this.db.query(`SELECT value FROM ${this.tableName} WHERE key >= ? AND key < ?`)
        const allList = getList.all(keyStartsWith, this.incrementString(keyStartsWith))
        const res = [];
        for (
          var value of allList
        ) {
          try {
            res.push(JSON.parse(value));
          } catch (e) {
            res.push(value);
          }
        }
        return res;
      }

      public async deleteList(keyStartsWith: string): Promise<void> {
        this.db.run(
          `DELETE FROM ${this.tableName} WHERE key >= ? AND key < ?`,
          [keyStartsWith, this.incrementString(keyStartsWith)],
        );
      }

      incrementString(s: string) {
        return s.replace(/.$/, this.nextChar(s.slice(-1)));
      }

      nextChar(c: string) {
        return String.fromCharCode(c.charCodeAt(0) + 1);
      }
}

export const storage = new LocalStore()
