const path = require('path')
const webpack = require('webpack')
const base = require('./webpack.base.config')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(base, {
    target: 'node',
    devtool: '#source-map',
    entry: path.resolve(__dirname, '../src/assets/entry/entry-server'),
    output: {
        filename: 'api-bundle.js',
        libraryTarget: 'commonjs2'
    },
    resolve: {
    },
    externals: nodeExternals({
        // 之前是通过读取package.json
        whitelist: /\.css$/
    }),
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"api"'
        }),
        new VueSSRServerPlugin()
    ]
})
