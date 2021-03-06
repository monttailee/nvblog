/**
 * Client打包webpack
 * entry: entry-client.js服务端打包入口文件
 * */
const path = require('path')
const webpack = require('webpack')
const base = require('./webpack.base.config')
//生成dist中的html
const HtmlPlugin = require('html-webpack-plugin')
//抽取css
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const isPro = process.env.NODE_ENV === 'production'
let proConfig = {}
let commonPlugins = [
  //设置变量
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VUE_ENV': '"client"'
  }),
  new HtmlPlugin({
    filename: 'admin.html',
    template: path.resolve(__dirname, '../src/template/admin.html'),
    inject: 'body',//脚本插到body底部
    chunks: isPro ? ['manifest_admin', 'vendor_admin', 'admin'] : ['admin'],//import js
    minify: {//压缩方式
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    }
  }),
  new HtmlPlugin({
    filename: 'front.html',
    template: path.resolve(__dirname, '../src/template/front.template.html'),
    chunks: isPro ? ['manifest_front', 'vendor_front', 'front'] : ['front'],
    minify: {
      collapseWhitespace: true,
      removeAttributeQuotes: true
    }
  })
]

if(isPro){
  proConfig = merge(base, {
    entry: {
      admin: './src/assets/entry/admin.js',
      front: './src/assets/entry/entry-client.js'
    },
    module: {
      rules: require('./styleLoader').styleLoaders({ sourceMap: true, extract: true })
    },
    output: {
      filename: '[name].[chunkhash].js'
    },
    plugins: commonPlugins.concat(
      [
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        }),
        new ExtractTextPlugin({
          filename: '[name].[contenthash].css'
        }),
        //duplicated CSS from different components can be deduped
        new OptimizeCSSPlugin({
          cssProcessorOptions: {
            safe: true
          }
        }),
        //分别提取vendor、manifest
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor_admin',
          chunks: ['admin'],
          minChunks: function(module) {
            return (
              module.resource && /\.js$/.test(module.resource) &&
              module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
            )
          }
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'manifest_admin',
          chunks: ['vendor_admin']
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor_front',
          chunks: ['front'],
          minChunks: function(module) {
            return (
              module.resource && /\.js$/.test(module.resource) &&
              module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
            )
          }
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'manifest_front',
          chunks: ['vendor_front']
        }),
        //copy
        new CopyWebpackPlugin([
          {
            from: path.resolve(__dirname, '../src/static'),
            to: path.resolve(__dirname, '../dist'),
            ignore: ['.*']
          }
        ])
      ]
    )
  })
} else{
  Object.keys(base.entry).forEach(function (name) {
    //base.entry[name] = ['webpack-hot-middleware/client?reload=true'].concat(base.entry[name])
    base.entry[name] = ['./build/dev-client'].concat(base.entry[name])
  })

  proConfig = merge(base, {
    module: {
      rules: require('./styleLoader').styleLoaders({ sourceMap: false })
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new ExtractTextPlugin('[name].css')
    ].concat(commonPlugins).concat([
      new FriendlyErrorsPlugin()
    ])
  })
}

module.exports = proConfig
