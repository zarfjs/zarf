import { BunTea } from "../../deno_dist/core/server.ts"
import { serve } from "https://deno.land/std@0.158.0/http/server.ts"

interface AppLocals {
    user: string
}

const app = new BunTea<AppLocals>({
    appName: 'BunTeaRoot',
    serverHeader: `Bun-Tea`,
    strictRouting: false,
    getOnly: false,
})

app.get("/hello", (ctx) => {
    return ctx.json({
        hello: "hello"
    })
})

app.post("/hello", async(ctx) => {
    const { request } = ctx
    const body = await request?.json() // await request.text()
    // do something with the body
    return ctx.json(body)
})


app.get("/text", (ctx) => {
    return ctx.text("lorem ipsum", {
        status: 404,
        statusText: "created"
    })
})

app.get("/user/:name/books/:title", (ctx, params) => {
    const { name, title } = params
    return ctx.json({
        name,
        title
    })
})

app.get("/admin/*all", (ctx, params) => {
    return ctx.json({
        name: params.all
    })
})

app.get("/v1/*brand/shop/*name", (ctx, params) => {
    return ctx.json({
        params
    })
})

app.get("/", (ctx) => {
    return ctx.html(`Welcome to Bun-Tea Deno App server`)
})

console.log(`Server started on 3000`)
await serve(app.handle, { port: 3000 });
