import { BunTea } from "../src"

interface AppLocals {
    user: string
}

const app = new BunTea<AppLocals>()


app.get<{ from: string, to: string }>("/flights/:from-:to", (ctx, params) => {
    return ctx.json({
        params
    })
})

app.get<{ from: string, to: string }>("/folder/:file.:ext", (ctx, params) => {
    return ctx.json({
        params
    })
})

app.get<{ from: string, to: string }>("/api/users.:ext", (ctx, params) => {
    return ctx.json({
        params
    })
})

app.get<{ color: string, size: string }>("/shop/product/color::color/size::size", (ctx, params) => {
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
