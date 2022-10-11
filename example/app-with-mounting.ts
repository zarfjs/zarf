import { Zarf } from "../src"
import { logger, loggerAfter } from './deps/mw-logger'

/**
 * Main App
 */
interface AppLocals {
    user: string
}

const app = new Zarf<AppLocals>()

app.get("/", (ctx) => {
    return ctx.html(`Welcome to Zarf App - App Mounting Example Server`)
})


/**
 * Sub-App
 */

interface SubAppLocals {
    user: string
}

const subApp = new Zarf<SubAppLocals>()

subApp.get("/goodbye/:name", [ logger() ], (ctx, params) => {
    return ctx.json({
      message: `Goodbye, ${params.name}`,
    });
})

subApp.use(logger()).use(loggerAfter, 'after')

/**
 * Mount
 */

app.mount<SubAppLocals>("/sub", subApp)

/**
 * Listen
 */
app.listen({
    port: 3000
})
