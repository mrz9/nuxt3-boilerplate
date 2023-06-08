import { ViteDevServer, Connect, PluginOption } from 'vite'
import http from 'http'
import { Application } from 'express'

export declare type RequestAdapter<App = any> = (
    app: App,
    req: http.IncomingMessage,
    res: http.ServerResponse,
) => void | Promise<void>

const PLUGIN_NAME = 'ViteSSRPlugin'

const ExpressHandler: RequestAdapter<Application> = (app, req, res) => {
    app(req, res)
}

const createMiddleware = (
    server: ViteDevServer,
    cfg: any,
): Connect.HandleFunction => {
    const requestHandler = ExpressHandler
    let instance: Application
    return async function (
        req: http.IncomingMessage,
        res: http.ServerResponse,
    ): Promise<void> {
        const appModule = await server.ssrLoadModule(cfg.appPath)
        if (!instance) {
            instance = await appModule[cfg.exportName]()
        }
        await requestHandler(instance, req, res)
    }
}
export default (cfg: any): PluginOption => {
    return {
        name: PLUGIN_NAME,
        config: () => ({
            build: {
                ssr: cfg.appPath,
                rollupOptions: {
                    input: cfg.appPath,
                },
            },
            server: {
                hmr: false,
            },
            esbuild: {},
        }),
        configureServer: (server) => {
            server.middlewares.use(createMiddleware(server, cfg))
        },
    }
}
