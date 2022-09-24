import { Redis } from "@upstash/redis"
export const storage = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN
})
