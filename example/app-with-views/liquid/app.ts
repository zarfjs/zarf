import { BunTea } from "../../../src"
import { fileURLToPath } from 'url';
import * as path from 'path'
const __dirname = path.dirname(fileURLToPath(import.meta.url));


interface AppLocals {
    user: string,
    type: string
}

const app = new BunTea<AppLocals>({
    engine: 'liquidjs',
    viewDir: path.resolve(__dirname, './views')
})



app.get("/tpl", async (ctx) => {
    ctx.locals.user = "Aftab"
    ctx.locals.type = "Admin"

    return await ctx.render('tpl', {
        name: 'bob'
    }, {});
})

app.get("/", (ctx) => {
    return ctx.halt(200, {
      message: "Hello World!",
    });
})

app.listen({
    port: 3000
}, (server) => {
    console.log(`file Server started on ${server.port}`)
})
