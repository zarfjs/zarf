---
title: Routing
description: Know how you work with popular HTTP verbs in Bun-Tea
layout: ../../layouts/MainLayout.astro
---

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
