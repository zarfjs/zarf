import { BunTea } from "../src"
import { FileSystem } from './deps/mw-fs'

interface AppLocals {
    user: string
}

const app = new BunTea<AppLocals>()

app.get("/", (ctx) => {
    return ctx.halt(200, {
      message: "Hello World!",
    });
})

app.use(FileSystem({
    root: './static'
}))

app.listen({
    port: 3000
}, (server) => {
    console.log(`file Server started on ${server.port}`)
})
