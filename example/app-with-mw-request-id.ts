import { Zarf } from '../src'
import { requestId, RequestIdLocals } from '../src/middlewares/mw-request-id'

const app = new Zarf<RequestIdLocals>()

app.use(requestId())

app.get("/", (ctx) => {
    if(ctx.locals.request_id) {
        return ctx.json({
            message: `Hello, mate! here's your request id: ${ctx.locals.request_id}`,
        });
    }
    return ctx.json({
        message: `Hello, world!`,
    });
})

app.listen({
    port: 3000
}, (server) => {
    console.log(`Server started on ${server.port}`)
})
