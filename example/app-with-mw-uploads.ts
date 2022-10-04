import { Zarf } from '../src'
import { bodyParser } from '~/middlewares/mw-body-parser'
import { uploads } from '~/middlewares/mw-uploads'

const app = new Zarf()

app.post("/users", [ bodyParser({
    extensions: ['jpg', 'jpeg'],
    maxFileSizeBytes: 3_4000,
    maxSizeBytes: 5_6000
}), uploads({
    useOriginalFileName: false,
    useLocals: true
}) ], async (ctx) => {
    // your upload details here if `useLocals` is true
    // console.log(ctx.locals)
    return ctx.json({
        message: "users created",
    });
})

app.get("/", (ctx) => {
    return ctx.json({
      message: "Hello World! I'm ready to keep your uploads.",
    });
})

app.listen({
    port: 3000
}, (server) => {
    console.log(`Server started on ${server.port}`)
})
