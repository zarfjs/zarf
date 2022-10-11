import { Zarf } from "../src"
import { logger, loggerAfter } from './deps/mw-logger'

interface AppLocals {
    user: string
}

const app = new Zarf<AppLocals>()

const api = app.group("/api", (_, next) => {
    console.log("called from API")
    return next()
}, async (ctx) => {
    console.log("called from API again")
    return ctx.html(`You've visited a group route. Please try going to some child route`)
})

const apiV1 = api.group('/v1', (_, next) => {
    console.log("called from API v1")
    return next()
})

apiV1.get('/list', (ctx) => {
    return ctx.json({
        list: 'list'
    })
})
apiV1.get('/user', (ctx) => {
    return ctx.json({
        user: 'user'
    })
})

const apiV2 = api.group('/v2')
apiV2.get('/list', (ctx) => {
    return ctx.json({
        list: 'list'
    })
})
apiV2.get('/user', (ctx) => {
    return ctx.json({
        user: 'user'
    })
})

app.get("/", (ctx) => {
    return ctx.html(`Welcome to Zarf App - Route Grouping Example Server`)
})

app.use(logger()).use(loggerAfter, 'after')

app.listen({
    port: 3000
})
