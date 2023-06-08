import { config } from 'dotenv'
import { dirname } from 'path'
// import { fileURLToPath } from 'url'
// import { fileURLToPath } from 'node:url'
export const __filename = new URL(import.meta.url).pathname
export const __dirname = dirname(__filename)
export const root = process.cwd()

// 环境变量
console.log('===== APP_MODE ====', process.env.APP_MODE)

config({
    path: `.env`,
})
config({
    override: true,
    path: `.env.local`,
})
if (['pre', 'pub'].indexOf(process.env.APP_MODE ?? '') !== -1) {
    config({
        override: true,
        path: `.env.${process.env.APP_MODE}`,
    })
}
