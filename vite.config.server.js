/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path')
const ViteSSRPlugin = require('./plugin/viteSSR.js')
// https://vitejs.dev/config/
module.exports = {
    resolve: {
        alias: {
            '@server': resolve('./server'),
        },
    },
    server: {
        host: '0.0.0.0',
    },
    plugins: [
        ViteSSRPlugin({
            appPath: './server/app.ts',
            exportName: 'createAppServer',
        }),
    ],
    ssr: {
        noExternal: ['element-plus'],
    },
}
