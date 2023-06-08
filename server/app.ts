import { createAppServer as createServer, isProd } from './core'

if (isProd) {
    ;(async () => {
        const app = await createServer()
        const listener = app.listen(process.env.PORT, function () {
            console.log('Server is on:')
            console.dir(listener?.address())
        })
    })()
}
export const createAppServer = createServer
