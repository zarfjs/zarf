import { MiddlewareFunctionInitializer } from '../../src/core/middleware'
import { SessionStorageEngine, SQLiteStorageEngine } from '../cookie/session/engine'
import { Session, SESSION_NAME, SessionData } from '../cookie/session/session'

export type SessionLookupSource = 'cookie' | 'header'
export type SessionLookupKey = `${SessionLookupSource}:${string}`

type MiddlewareOptions = {
    sessionName?: string
    expiration?: number
    source?: SessionLookupSource,
    // lookupKey: SessionLookupKey,
    keygenFunc?: () => {},
    engine: SessionStorageEngine<SessionData['data']>
}

const MW_OPTION_DEFAULTS: MiddlewareOptions = {
    sessionName: SESSION_NAME,
    expiration: 24 * 60 * 60 * 1000,
    source: 'cookie',
    // lookupKey: 'cookie:',
    keygenFunc: () => crypto.randomUUID(),
    engine: new SQLiteStorageEngine({
        ttl: 15 * 60 * 1000,
        sessionName: SESSION_NAME
    })
}

const getCookieValue = (cookieHeader: string, name: string) => (
    cookieHeader.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)

export const session: MiddlewareFunctionInitializer<MiddlewareOptions> = (options) => {
    let { sessionName, source, engine, ...rest } = { ...MW_OPTION_DEFAULTS, ...options }
    return async (context, next: Function) => {
        const cookieHeader = context.request?.headers.get('Cookie')
        if(cookieHeader) {
            const matchIndex = cookieHeader.indexOf(`${sessionName}=`)
            // const matches = new RegExp('[,; ]'+sessionName+'=([^\\s;]*)').exec(cookieHeader as string)
            if(matchIndex !== -1) {
                // const cookie = Cookie.from(cookieHeader.substring(matchIndex, cookieHeader.length))
                let hasSession = false
                const session = new Session(
                    cookieHeader.substring(matchIndex, cookieHeader.length),
                {
                    sessionName,
                    ...rest,
                })
                try {
                    const sc = await session.prepare()
                    if(Object.keys(sc.data).length) {
                        hasSession = true
                        // @ts-ignore
                        context.locals['session'] = sc.data
                    }
                    // context.session = sc

                    context.after(async(ctx) => {
                        if ((Object.keys(context.locals['session']).length > 0) || hasSession || sc.id) {
                          ctx.setHeader('Cookie', await session.with(sc))
                          await engine.set(sc.id, {
                            value: sc.data,
                            lastAccessTime: Date.now(),
                          });
                        } else {
                            ctx.setHeader('Cookie', await session.without(sc))
                        }
                    });
                } catch(e) {
                    console.log(e)
                }
            } else {
                console.log('no match')
            }
        }
        await next()
    }
}

/**
             * Parse and create a session
             */
            // const session = new Session(cookieParts![1])
            // const sessionChangset = await session.prepare()
            /**
             * Put some useful data
             */
            // sessionChangset.set('this', 'thatyuuuuu')
            // sessionChangset.set('tho', 'thonnjhhjjjjj')
            /**
             * Commit/Save
             */
            // console.log('this is it', await session.with(sessionChangset, {}))
            /**
             * Destroy
             */
            // console.log('this isnt', await session.without(sessionChangset, {}))
