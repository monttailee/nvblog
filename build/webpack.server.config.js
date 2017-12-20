/**
 * 服务端打包webpack
 * entry: entry-server.js服务端打包入口文件
 * 参考https://segmentfault.com/a/1190000009554693
 *
 * node端createBundleRenderer需要两个参数：
 *  1⃣️ vue-ssr-bundle.json   2⃣️ 通过Client打包生成的HTML模板文件
 * */
const path = require('path')
const webpack = require('webpack')
const base = require('./webpack.base.config')
const merge = require('webpack-merge')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

//获取根目录
const pathRoot = path.resolve(__dirname, '..')

module.exports = merge(base, {
    target: 'node',
    entry: path.join(pathRoot, 'src/assets/entry/entry-server.js'),
    output: {
        filename: 'server-bundle.js',
        libraryTarget: 'commonjs2'
    },
    externals: Object.keys(require('../package.json').dependencies),
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"'
        }),
        //生产中, 会用webpack插件生成*.json文件
        new VueSSRServerPlugin({
          filename: './dist/vue-ssr-bundle.json'
        })
    ]
})
