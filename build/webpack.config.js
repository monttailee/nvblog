/**
 * admin打包webpack
 * admin页面不用ssr
 * */
const path = require('path')
const webpack = require('webpack')
const base = require('./webpack.base.config')
//生成dist中的html
const HtmlPlugin = require('html-webpack-plugin')
//抽取css
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')

const isPro = process.env.NODE_ENV === 'production'
base.entry = {admin: './src/assets/entry/admin.js'}
base.externals = {'simplemde': 'SimpleMDE'}

let proConfig = {}
let commonPlugins = [
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
  })
]

if(isPro){
  proConfig = merge(base, {
    module: {
      rules: require('./styleLoader').styleLoaders({ sourceMap: true, extract: true })
    },
    plugins: commonPlugins.concat(
      [
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
  base.entry.admin = ['webpack-hot-middleware/client', base.entry.admin]
  base.output.filename = '[name].js'
  proConfig = merge(base, {
    module: {
      rules: require('./styleLoader').styleLoaders({ sourceMap: false })
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new ExtractTextPlugin({
        filename: '[name].[chunkhash].css'
      })
    ].concat(commonPlugins)
  })
}

module.exports = proConfig
