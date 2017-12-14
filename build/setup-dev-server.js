/**
 * 开发环境下使用  被node-server调用
 * 执行 热更新 和 服务端监听 渲染
 * 注：生产环境调用dist目录生成的server-bundle.js
 * */
const path = require('path')
const webpack = require('webpack')
const MFS = require('memory-fs')
const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')

module.exports = function setupDevServer (app, cb) {
    let bundle, template

    //执行客户端webpack 生成dist目录资源
    const clientCompiler = webpack(clientConfig)
    const devMiddleware = require('./middle-dev')(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        stats: {
            colors: true
        }
    })

    //应用中间件
    app.use(devMiddleware)

    clientCompiler.plugin('done', () => {
        const fs = devMiddleware.fileSystem
        const filePath = path.join(clientConfig.output.path, 'front.html')

        if (fs.existsSync(filePath)) {
            template = fs.readFileSync(filePath, 'utf-8')
            if (bundle) {
                cb(bundle, template)
            }
        }
    })
    //入口文件变化自动热加载
    app.use(require('./middle-hot')(clientCompiler))

    //node-server监听文件变动并自动更新
    const serverCompiler = webpack(serverConfig)
    const mfs = new MFS()
    serverCompiler.outputFileSystem = mfs
    serverCompiler.watch({}, (err, stats) => {
        if (err) throw err
        stats = stats.toJson()
        stats.errors.forEach(err => console.error(err))
        stats.warnings.forEach(err => console.warn(err))

        const bundlePath = path.join(serverConfig.output.path, 'vue-ssr-bundle.json')
        bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
        if (template) {
            cb(bundle, template)
        }
    })
}
