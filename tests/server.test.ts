import { describe, expect, it } from "bun:test";
import { Zarf } from '../src/core/server'

describe('server', () => {
    const app = new Zarf()

    app.get('/hello/:name', (ctx, params) => {
        return ctx.send(`${params.name}`)
    })

    describe('routes', () => {
        it('should return a 200 on found routes', async () => {
            const res = await app.fetch('http://localhost/hello/john')
            expect(res?.status).toBe(200)
        })

        it('should return a 404 on non-found routes', async () => {
            const res = await app.fetch('http://localhost/hello')
            expect(res?.status).toBe(404)
            expect(await res?.text()).toBe('No matching GET routes discovered for the path: /hello')
        })

        it('should parse the params correctly', async () => {
            const res = await app.fetch('http://localhost/hello/john')
            expect(await res?.text()).toBe('john')
        })
    })
})
