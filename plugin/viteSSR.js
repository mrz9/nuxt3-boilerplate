const PLUGIN_NAME = 'ViteSSRPlugin'

const ExpressHandler = (app, req, res) => {
    app(req, res)
}

const createMiddleware = (server, cfg) => {
    const requestHandler = ExpressHandler
    let instance
    return async function (req, res) {
        const appModule = await server.ssrLoadModule(cfg.appPath)
        if (!instance) {
            instance = await appModule[cfg.exportName]()
        }
        await requestHandler(instance, req, res)
    }
}

module.exports = (cfg) => {
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
