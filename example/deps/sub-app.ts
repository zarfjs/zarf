import { Zarf } from "../../src"

interface AppLocals {
    user: string
}

export const subApp = new Zarf<AppLocals>()

subApp.get("/goodbye", (ctx) => {
    return ctx.json({
        hello: "goodbye"
    })
})
