/**
 * 服务端打包webpack
 * entry: entry-server.js服务端打包入口文件
 * 参考https://segmentfault.com/a/1190000009554693
 *
 * node端createBundleRenderer需要两个参数：
 *  1⃣ vue-ssr-server-bundle.json   2⃣ 通过Client打包生成的vue-ssr-client-manifest.json + template
 * */
const path = require('path')
const webpack = require('webpack')
const base = require('./webpack.base.config')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(base, {
    target: 'node',
    devtool: '#source-map',
    entry: './src/assets/entry/entry-server.js',
    output: {
        filename: 'server-bundle.js',
        libraryTarget: 'commonjs2'
    },
    externals: nodeExternals({
      whitelist: /\.css$/
    }),
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"'
        }),
        new VueSSRServerPlugin()
    ]
})
