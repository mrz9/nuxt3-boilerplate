import { Application, Request, Response, NextFunction } from 'express'
const modules = import.meta.globEager('../controller/**/*')

export default (app: Application) => {
    // 扩展res 方法
    app.use((_req: Request, res: Response, next: NextFunction) => {
        res.error = (messageOrOptions) => {
            let code = -1
            let msg = '请求错误'
            if (typeof messageOrOptions === 'string') {
                msg = messageOrOptions
            } else {
                if (messageOrOptions.msg) {
                    msg = messageOrOptions.msg
                }
                if (typeof messageOrOptions.code !== 'undefined') {
                    code = messageOrOptions.code
                }
            }
            return res.json({
                code,
                msg,
            })
        }
        res.success = (data = '', code = 0) => {
            return res.json({
                code,
                data,
            })
        }
        next()
    })
    // 自动注册controller
    function registerRouter(path: string) {
        const mod = modules[path]
        const match = path.match(/\..\/controller(.*)\.(t|j)s$/)
        if (match && match[1]) {
            let name = match[1].toLowerCase()
            if (name.endsWith('/index')) {
                name = name.replace(/\/index$/, '')
            }
            console.log(`/api${name}`)
            app.use(`/api${name}`, mod.default)
        }
    }

    const IndexPath = '../controller/index.ts'
    for (const path in modules) {
        if (path !== IndexPath) {
            registerRouter(path)
        }
    }
    // index.ts需要最后欧注册，防止与子目录路由冲突
    if (modules[IndexPath]) {
        registerRouter(IndexPath)
    }
}
