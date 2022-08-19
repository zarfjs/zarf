import { BunTea } from "../src"
import { logger, loggerAfter } from './deps/mw-logger'

/**
 * Main App
 */
interface AppLocals {
    user: string
}

const app = new BunTea<AppLocals>()

app.get("/", (ctx) => {
    return ctx.halt(200, {
      message: "Hello World!",
    });
})


/**
 * Sub-App
 */

interface SubAppLocals {
    user: string
}

const subApp = new BunTea<SubAppLocals>()

subApp.get<{ name: string }>("/goodbye/:name", [ logger() ], (ctx, params) => {
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
