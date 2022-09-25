---
title: "Routing: Context"
description: Routing & Context
layout: ../../layouts/MainLayout.astro
---

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
