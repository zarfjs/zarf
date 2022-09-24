import { BunTea } from "../src"
import { SQLiteStorageEngine } from "./cookie/session/engine"
import { RedisUpstashStorageEngine } from "./cookie/session/engine/redis-upstash.engine"
import { SESSION_NAME } from './cookie/session/session'
import { session } from './deps/mw-session'

interface AppLocals {
    user: string
}

const app = new BunTea<AppLocals>()

app.get("/hello", (ctx) => {
    console.log(ctx.request?.headers.get('Cookie'))

    return ctx.json({
        hello: "hello"
    })
})

app.get("/session", [ session({
    expiration: 24 * 60 * 60 * 1000,
    engine: new RedisUpstashStorageEngine({
        ttl: 30,
        sessionName: SESSION_NAME
    }), // new SQLiteStorageEngine(0)
}) ], async (ctx) => {

    console.log('from handler', ctx.locals.session.value)
    return ctx.json({
        session: 'session'
    })
})

app.get("/", (ctx) => {
    return ctx.html(`Welcome to Bun-Tea App server`)
})

app.listen({
    port: 3000
}, (server) => {
    console.log(`Server started on ${server.port}`)
})
