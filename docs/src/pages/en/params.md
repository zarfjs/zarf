---
title: "Routing: Params"
description: Routing & Parameters
layout: ../../layouts/MainLayout.astro
---


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
