/**
 * 前端构建，区分开发环境与生产环境
 * */
const path = require('path')
const webpack = require('webpack')
const baseConfig = require('./../build/webpack.base.config.js')
const HtmlPlugin = require('html-webpack-plugin')//根据模版生成dist目录中的html文件
const ExtractTextPlugin = require('extract-text-webpack-plugin')//抽取的css样式
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')
const productionEnv = process.env.NODE_ENV === 'production'

let proConfig = {}
let commonPlugins = [
  //设置变量
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VUE_ENV': '"client"'
  }),
  //为了更好的缓存第三方库
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor'
  }),
  new HtmlPlugin({
    filename: 'admin.html',
    template: '../src/template/admin.html',
    inject: true,//脚本插到body
    chunks: ['vendor', 'admin']//引入生成的js文件
  }),
  new HtmlPlugin({
    filename: 'front.html',
    template: '../src/template/front.html',
    chunks: ['vendor', 'front']
  })
]

if(!productionEnv){
  //------------------------dev------------------------
  Object.keys(baseConfig.entry).forEach(function (name) {
    //如果refresh有问题 则此处需改https://segmentfault.com/a/1190000006851575
    baseConfig.entry[name] = ['webpack-hot-middleware/client?reload=true'].concat(baseConfig.entry[name])
  })

  proConfig = merge(baseConfig, {
    devtool: '#cheap-module-eval-source-map',
    module: {
      rules: require('./../build/styleLoader').styleLoaders({ sourceMap: false })
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ].concat(commonPlugins)
  })

} else{
  //-------------------------pro------------------------
  proConfig = merge(baseConfig, {
    devtool: '#source-map',
    module: {
      rules: require('./../build/styleLoader').styleLoaders({ sourceMap: true, extract: true })
    },
    output: {
      filename: '[name].[chunkhash:5].js'
    },
    plugins: commonPlugins.concat(
      [
        new ExtractTextPlugin('[name].[contenthash:5].css'),
        // Compress extracted CSS
        new OptimizeCSSPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        }),
        //copy assets
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
}

module.exports = proConfig
