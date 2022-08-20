import { BunTea } from "../src"

interface AppLocals {
    user: string
}

const app = new BunTea<AppLocals>()


app.get("/flights/:from-:to/", (ctx, params) => {
    return ctx.json({
        params
    })
})

app.get("/folder/:file.:ext", (ctx, params) => {
    return ctx.json({
        params
    })
})

app.get("/api/users.:ext", (ctx, params) => {
    return ctx.json({
        params
    })
})

app.get("/shop/product/color::color/size::size/dep::dep", (ctx, params) => {
    return ctx.json({
        color: params.color,
        size: params.size
    })
})

app.get("/", (ctx) => {
    return ctx.halt(200, {
      message: "Hello World!",
    });
})


app.listen({
    port: 3000
}, (server) => {
    console.log(`Server started on ${server.port}`)
})
