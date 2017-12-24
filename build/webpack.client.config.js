/**
 * Client打包webpack
 * entry: entry-client.js服务端打包入口文件
 * */
const path = require('path')
const webpack = require('webpack')
const base = require('./webpack.base.config')
const merge = require('webpack-merge')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const styleLoader = require('./styleLoader')


const isPro = process.env.NODE_ENV === 'production'
const cssRules = isPro ? styleLoader.styleLoaders({ sourceMap: true, extract: true }) : styleLoader.styleLoaders({ sourceMap: false })

const config = merge(base, {
  entry: {
    front: './src/assets/entry/entry-client.js'
  },
  module: {
    rules: cssRules
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return (
          /node_modules/.test(module.context) && !/\.css$/.test(module.require)
        )
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    //create vue-ssr-client-manifest.json
    new VueSSRClientPlugin()
  ]
})

module.exports = config
