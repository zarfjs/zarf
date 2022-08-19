import { BunTea } from "../src"
import { logger, loggerAfter } from './deps/mw-logger'

interface AppLocals {
    user: string
}

const app = new BunTea<AppLocals>()

app.get<{ name: string }>("/hello/:name", [ logger() ], (ctx, params) => {
    console.log('before:', ctx.locals)
    ctx.locals.user = "John"
    console.log('after:', ctx.locals)
    return ctx.json({
      message: `Hello World! ${params.name}`,
    });
})

app.get("/", (ctx) => {
    return ctx.halt(200, {
      message: "Hello World!",
    });
})

app.use(logger()).use(loggerAfter, 'after')

app.listen({
    port: 3000
}, (server) => {
    console.log(`Server started on ${server.port}`)
})
