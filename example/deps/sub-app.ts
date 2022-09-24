import { BunTea } from "../../src"

interface AppLocals {
    user: string
}

export const subApp = new BunTea<AppLocals>()

subApp.get("/goodbye", (ctx) => {
    return ctx.json({
        hello: "goodbye"
    })
})
