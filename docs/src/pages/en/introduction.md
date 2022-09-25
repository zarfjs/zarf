---
title: 👋 Welcome
description: Bun Tea intro
layout: ../../layouts/MainLayout.astro
---
`Bun-Tea` is a Bun-powered, and Bun-only(for now) Web API framework with full **Typescript support** and **performance** in mind.

## Getting Started
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
