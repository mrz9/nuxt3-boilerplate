import express from 'express'
import fs from 'fs'
import cookieSession from 'cookie-session'
import bodyParser from 'body-parser'
import compression from 'compression'
import ServeStatic from 'serve-static'
import { createRequire } from 'module'
import path from 'path'
import { root, __filename, __dirname } from './config'
import Controller from './controller'
import { AccessLogger, ErrorLogger, AppLogger } from './logger'

const require = createRequire(import.meta.url)
const { createServer } = require('vite')

export const isProd = process.env.NODE_ENV === 'production'

console.log('app start', isProd)

const resolve = (p: string) => path.resolve(root, p)

export const createAppServer = async () => {
    const app = express()
    app.__dirname = __dirname
    app.__filename = __filename
    app.root = root
    app.isProd = isProd

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())
    app.use(
        cookieSession({
            maxAge: Number(process.env.SESSION_MAXAGE), // 1天
            // maxAge: 60 * 1000, // 1 min for debug
            name: process.env.SESSION_NAME,
            httpOnly: true,
            secret: process.env.SESSION_SECRET,
        }),
    )
    app.logger = AppLogger(app)
    // 请求日志
    AccessLogger(app)
    // 注册路由
    Controller(app)

    let vite: any
    if (!isProd) {
        /**
         * @type {import('vite').ViteDevServer}
         */
        vite = await createServer({
            root,
            logLevel: 'error',
            server: {
                middlewareMode: 'ssr',
                watch: {
                    // During tests we edit the files too fast and sometimes chokidar
                    // misses change events, so enforce polling for consistency
                    usePolling: true,
                    interval: 100,
                },
            },
        })
        app.use(vite.middlewares)
    } else {
        app.use(compression())
        app.use(
            ServeStatic(resolve('./client'), {
                index: false,
            }),
        )
    }

    app.use('*', async (req, res) => {
        try {
            const url = req.originalUrl
            let template
            let render
            if (!isProd) {
                template = fs.readFileSync(resolve('index.html'), 'utf-8')
                template = await vite.transformIndexHtml(url, template)
                render = (
                    await vite.ssrLoadModule(resolve('src/entry-server.js'))
                ).render
            } else {
                template = fs.readFileSync(
                    resolve('./client/index.html'),
                    'utf-8',
                )
                render = require('./server/entry-server.js').render
            }

            const manifest = isProd ? require('./client/ssr-manifest.json') : {}

            const [appHead, appHtml, preloadLinks] = await render(url, manifest)

            const html = template
                .replace(`<!--head-meta-->`, appHead)
                .replace(`<!--preload-links-->`, preloadLinks)
                .replace(`<!--app-html-->`, appHtml)

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e: any) {
            vite && vite.ssrFixStacktrace(e)
            console.log(e.stack)
            res.status(500).end(e.stack)
        }
    })

    // 错误日志
    ErrorLogger(app)
    return app
}
