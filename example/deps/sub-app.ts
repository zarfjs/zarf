import { BunTea } from "../../src"
import { logger, loggerAfter } from '../../src/middlewares/logger'

interface AppLocals {
    user: string
}

export const subApp = new BunTea<AppLocals>()

subApp.get("/goodbye", (ctx) => {
    return ctx.json({
        hello: "goodbye"
    })
})
