import { BunTea } from "../src"
import { logger, loggerAfter } from '../src/middlewares/logger'

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

app.post("/hello", async(ctx) => {
    const { request } = ctx
    const body = await request?.json() // await request.text()
    // do something with the body
    return ctx.json({})
})

app.get("/hello", (ctx) => {
    return ctx.json({
        hello: "hello"
    })
})

app.get("/text", (ctx) => {
    return ctx.text("lorem ipsum", {
        status: 404,
        statusText: "created"
    })
})

app.get("/send", async (ctx) => {
    return ctx.send(Bun.file("./README.md"))
})

app.get("/", (ctx) => {
    return ctx.json({
      message: "Hello World!",
    });
})

app.use(logger()).use(loggerAfter, 'after')

app.listen({
    port: 3000
})
