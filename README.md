# Bun Tea
Fast, Bun-powered, and Bun-only(for now) Web API framework with full Typescript support.

## Quickstart
Starting with `bun-tea` is as simple as instantiating the `BunTea` class, attaching route handlers and finally starting the server
```ts
import { BunTea } from "bun-tea"

const app = new BunTea()

app.get("/hello", (ctx) => {
    return ctx.json({
        hello: "hello"
    })
})

app.get("/", (ctx) => {
    return ctx.html(`Welcome to Bun-Tea App server`)
})

app.listen({
    port: 3000
}, (server) => {
    console.log(`Server started on ${server.port}`)
})
```
## App and Routing
Routes are how you tell where/when/what to respond when somebody visits your app's URLs, and `bun-tea` lets you easily register routes, with all the commonly used HTTP verbs like `GET`, `POST`, `PUT`, `DELETE`, etc.

Here's how you'd define your app routes -

```ts
// GET
app.get("/posts", (ctx) => {
    return ctx.json({
        posts: [/* all of the posts */]
    })
})

// POST
app.post("/posts", async(ctx) => {
    const { request } = ctx
    const body = await request?.json()
    // ... validate the post body
    // ... create a post entry
    return ctx.json(body)
})

// PUT
app.put("/posts/:id", async(ctx, params) => {
    const { request } = ctx
    const id = params.id
    const body = await request?.json()
    // ... validate the post body
    // ... upadte the post entry
    return ctx.json(body)
})

// DELETE
app.del("/posts/:id", async(ctx, params) => {
    const id = params.id
    // ... validate the del op
    // ... delete the post entry
    return ctx.json({ deleted: 1 })
})

```
## Routing: Context
`Context` available as the first argument to your route handlers is a special object made available to all the route handlers which
- lets you access vaious details w.r.t `Request` object
- provides convenience methods like `json`, `text`, `html` to send `Response` to the client

The most accessed/useful object could be the `Request` object itself(available at `ctx.request`), but it offers few other methods too
- `setHeader`
- `setType`
- `setVary`
- `isType`
- `accepts`
to determine things about the current request, or change few things about the response that's send to the client.

## Routing: Params
`Params` is the second argument available to your route handlers, that lets you access the route parameters easily.
```ts
app.get("/products/:id", (ctx, params) => {
    // params.id ? //
    // Pull the details
    return ctx.json({
        product: {/* all of the posts */}
    })
})
```
`bun-tea` supports all the common URL patterns you'd expect in a Web-App/API framework
```ts
app.get("/user/:name/books/:title", (ctx, params) => {
    const { name, title } = params
    return ctx.json({
        name,
        title
    })
})

app.get("/user/:name?", (ctx, params) => {
    return ctx.json({
        name: params.name || 'No name found'
    })
})

// /admin/feature/path/goes/here
app.get("/admin/*all", (ctx, params) => {
    return ctx.json({
        supPath: params.all // -> /feature/path/goes/here
    })
})

// /v1/nike/shop/uk
// /v1/nike/uk/shop/shop-at...
app.get("/v1/*brand/shop/*name", (ctx, params) => {
    return ctx.json({
        params // -> { brand: 'nike', ...},  { brand: 'nike/uk', ...}
    })
})
```

# RoadMap
A lot of great stuff is actually planned for the project. The Alpha version is majorly focussing on making the core stable and provide all the essential features. For an exhaustive list of what's coming to `Bun-Tea` refer the [project roadmap](https://github.com/users/one-aalam/projects/3/views/1).
