/**
 * 服务端打包webpack
 * entry: entry-server.js服务端打包入口文件
 * */
const path = require('path')
const webpack = require('webpack')
const base = require('./webpack.base.config')
const merge = require('webpack-merge')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

//获取根目录
const pathRoot = path.resolve(__dirname, '..');

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
        new VueSSRServerPlugin()
    ]
})
