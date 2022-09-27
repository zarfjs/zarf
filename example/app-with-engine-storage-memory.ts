import { BunTea } from "../src"
import { BunInMemorySessionStorageEngine } from "../src/engines/storage/impl/session-memory.storage"

interface AppLocals {
    user: string
}

type RouteMeta = {
    data: {
        visits: number
    },
    lastAccessTime: number
}

const app = new BunTea<AppLocals>()
const appInMemoryStore = new BunInMemorySessionStorageEngine<RouteMeta>({
    ttl: 1
})
appInMemoryStore.init({
    interval: 0,
    done: () => console.log(`teardown-ed`),
    debug: true
})

app.get("/hello", async (ctx) => {
    await appInMemoryStore.debug()
    const visits = await appInMemoryStore.get('visit')
    if(visits) {
        appInMemoryStore.set('visit', {
            data: {
                visits: visits.data.visits + 1
            },
            lastAccessTime: Date.now()
        })
    } else {
        appInMemoryStore.set('visit', {
            data: {
                visits: 1
            },
            lastAccessTime: Date.now()
        })
    }
    await appInMemoryStore.debug()
    return ctx.html(`You've visited this route ${visits ? visits.data.visits + ' times.' : ', not even once?'}`)
})

app.get("/", (ctx) => {
    return ctx.html(`Welcome to Bun-Tea App server (with Memory Storage Engine)`)
})

app.listen({
    port: 3000
}, (server) => {
    console.log(`Server started on ${server.port}`)
})
