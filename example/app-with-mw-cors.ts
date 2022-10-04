import { Zarf } from '../src'
import { cors } from '../src/middlewares/mw-cors'

const app = new Zarf()

app.use(cors(), 'after')

app.get("/", (ctx) => {
    return ctx.json({
      message: "Hello World! I'm CORS enabled",
    });
})

app.listen({
    port: 3000
}, (server) => {
    console.log(`Server started on ${server.port}`)
})
