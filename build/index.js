/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs')
const spawn = require('child_process').spawn
const { build } = require('vite')
const { config } = require('dotenv')
const ViteServerConfig = require('../vite.config.server')

const mode = process.env.APP_MODE || 'dev'
// 环境变量
console.log('===== APP_MODE ====', mode)

config({
    path: `.env`,
})
if (['pre', 'pub'].indexOf(mode) !== -1) {
    config({
        override: true,
        path: `.env.${mode}`,
    })
}

const distDir = path.resolve(process.cwd(), 'dist', process.env.outDir)

const serverBuildOptions = {
    publicDir: false, // No need to copy public files to SSR directory
    mode,
    build: {
        outDir: path.resolve(distDir, 'server'),
        // The plugin is already changing the vite-ssr alias to point to the server-entry.
        // Therefore, here we can just use the same entry point as in the index.html
        ssr: 'src/entry-server.js',
        emptyOutDir: false,
    },
    ssr: {
        noExternal: [...(ViteServerConfig?.ssr?.noExternal ?? [])],
    },
}

const clientBuildOptions = {
    mode,
    build: {
        outDir: path.resolve(distDir, 'client'),
        ssrManifest: true,
        emptyOutDir: false,
    },
}
const appServerBuildOptions = {
    configFile: './vite.config.server.js',
    build: {
        outDir: path.resolve(distDir),
    },
}

/**
 * 检查路径是否存在 如果不存在则创建路径
 * @param {string} folderpath 文件路径
 * @param {string} pwd 目标目录
 */

const createPath = (folderpath, pwd) => {
    const pathArr = folderpath.split('/')
    let _path = '.'
    for (let i = 0; i < pathArr.length; i++) {
        if (pathArr[i]) {
            _path += `/${pathArr[i]}`
            if (!fs.existsSync(path.resolve(pwd, _path))) {
                fs.mkdirSync(path.resolve(pwd, _path))
            }
        }
    }
}

function copyDeployFile() {
    fs.copyFileSync(
        './build/deploy/index.js',
        path.resolve(distDir, 'index.js'),
    )
    fs.copyFileSync(
        './build/deploy/Dockerfile',
        path.resolve(distDir, 'Dockerfile'),
    )
    fs.copyFileSync(
        './build/deploy/.dockerignore',
        path.resolve(distDir, '.dockerignore'),
    )
    fs.copyFileSync('.env', path.resolve(distDir, '.env'))
    fs.copyFileSync('.env.pre', path.resolve(distDir, '.env.pre'))
    fs.copyFileSync('.env.pub', path.resolve(distDir, '.env.pub'))
    fs.copyFileSync('package.json', path.resolve(distDir, 'package.json'))
    createPath('prisma', distDir)
    fs.copyFileSync(
        './prisma/schema.prisma',
        path.resolve(distDir, 'prisma/schema.prisma'),
    )
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function install(done = () => {}) {
    const str = '🏮🏮🏮🏮🏮'
    console.log(str, '安装依赖...', str)
    spawn('npm', ['install', '--production'], {
        cwd: distDir,
        stdio: 'inherit',
    })
        .on('error', function (err) {
            throw err
        })
        .on('close', () => {
            console.log('🎉🎉🎉🎉🎉 ', '构建成功')
            done()
        })
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function prismaGenerate(done = () => {}) {
    console.log(`npm prisma generate`)
    spawn('npm', ['run', 'generate'], {
        cwd: distDir,
        stdio: 'inherit',
    })
        .on('error', function (err) {
            throw err
        })
        .on('close', () => {
            console.log('🎉🎉🎉🎉🎉 ', 'npm prisma generate')
            done()
        })
}

async function run() {
    await build(appServerBuildOptions)
    await build(clientBuildOptions)
    await build(serverBuildOptions)
    copyDeployFile()
    install(() => {
        // prismaGenerate()
    })
}

run()
