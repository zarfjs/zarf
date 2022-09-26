import { BunTea } from '../src'
import { bodyParser } from '../src/middlewares/mw-body-parser'

const app = new BunTea()

app.post("/users", [ bodyParser({
    extensions: ['jpg'],
    maxFileSizeBytes: 2_4000,
    maxSizeBytes: 2_6000
}) ], (ctx) => {
    // console.log(ctx.body)
    return ctx.json({
        message: "users created",
    });
})

app.get("/", (ctx) => {
    return ctx.json({
      message: "Hello World! I'm ready to take all yo data and uploads.",
    });
})

app.listen({
    port: 3000
}, (server) => {
    console.log(`Server started on ${server.port}`)
})
