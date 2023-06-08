import { Application } from 'express'
import * as winston from 'winston'
import 'winston-daily-rotate-file'
import expressWinston from 'express-winston'
import { resolve } from 'path'

const winstonLogOption = {
    metaField: null, // this causes the metadata to be stored at the root of the log entry
    responseField: null, // this prevents the response from being included in the metadata (including body and status code)
    requestWhitelist: ['headers', 'query'], // these are not included in the standard StackDriver httpRequest
    responseWhitelist: ['body'], // this populates the `res.body` so we can get the response size (not required)
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
    ),
    dynamicMeta: (req: any, res: any) => {
        const httpRequest: any = {}
        const httpResponse: any = {}
        if (req) {
            httpRequest.method = req.method
            httpRequest.url = `${req.protocol}://${req.get('host')}${
                req.originalUrl
            }`
            httpRequest.protocol = `HTTP/${req.httpVersion}`
            // httpRequest.remoteIp = req.ip // this includes both ipv6 and ipv4 addresses separated by ':'
            httpRequest.remoteIp =
                req.ip && req.ip.indexOf(':') >= 0
                    ? req.ip.substring(req.ip.lastIndexOf(':') + 1)
                    : req.ip // just ipv4
            httpRequest.size = req.socket.bytesRead
            httpRequest.userAgent = req.get('User-Agent')
            httpRequest.referrer = req.get('Referrer')
        }

        if (res) {
            httpResponse.status = res.statusCode
            httpResponse.latency = {
                seconds: Math.floor(res.responseTime / 1000),
                nanos: (res.responseTime % 1000) * 1000000,
            }
            const isJSON =
                (res.get('Content-Type') ?? '')
                    .toLocaleLowerCase()
                    .indexOf('application/json') !== -1

            if (res.body && isJSON) {
                if (typeof res.body === 'object') {
                    httpResponse.size = JSON.stringify(res.body).length
                } else if (typeof res.body === 'string') {
                    httpResponse.size = res.body.length
                }
                httpResponse.body = res.body
            }
        }
        return {
            req: httpRequest,
            res: httpResponse,
        }
    },
}

const CreateConsole = () => {
    return new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json(),
            winston.format.splat(),
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message }) => {
                return `[${timestamp}] ${level}: ${message}`
            }),
        ),
    })
}

const createDailyFile = (app: Application, type: string) => {
    const logDir = resolve(app.root, 'data', 'logs')
    return new winston.transports.DailyRotateFile({
        filename: `${type}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        dirname: logDir,
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
    })
}

// 请求日志
export const AccessLogger = (app: Application) => {
    app.use(
        expressWinston.logger({
            ...winstonLogOption,
            transports: [
                !app.isProd ? CreateConsole() : createDailyFile(app, 'access'),
            ],
        }),
    )
}

// 错误日志
export const ErrorLogger = (app: Application) => {
    app.use(
        expressWinston.errorLogger({
            ...winstonLogOption,
            transports: [
                !app.isProd
                    ? new winston.transports.Console()
                    : createDailyFile(app, 'error'),
            ],
        }),
    )
}
// 程序日志
export const AppLogger = (app: Application) => {
    return winston.createLogger({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
        ),
        transports: [
            !app.isProd
                ? new winston.transports.Console()
                : createDailyFile(app, 'app'),
        ],
    })
}
