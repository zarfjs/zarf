import { Zarf } from "../src"

interface AppLocals {
    user: string
}

const app = new Zarf<AppLocals>()


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
    return ctx.html(`Welcome to Zarf App - Advanced Route Example Server`)
})


app.listen({
    port: 3000
}, (server) => {
    console.log(`Server started on ${server.port}`)
})
