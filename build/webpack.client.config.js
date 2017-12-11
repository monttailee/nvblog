/**
 * 前端构建，区分开发环境与生产环境
 * */
const path = require('path')
const webpack = require('webpack')
const base = require('./webpack.base.config')
const HtmlPlugin = require('html-webpack-plugin')//根据模版生成dist目录中的html文件
const ExtractTextPlugin = require('extract-text-webpack-plugin')//抽取的css样式
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')
const productionEnv = process.env.NODE_ENV === 'production'

const config = merge(base, {
    plugins: [
        //设置变量
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"'
        }),
        new HtmlPlugin({
            filename: 'admin.html',
            template: '../src/template/admin.html',
            inject: 'body',//脚本插入到body底部
            chunks: productionEnv ? ['manifest_admin', 'vendor_admin', 'admin'] : ['admin'],//引入生成的js文件
            minify: {//压缩方式
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            }
        }),
        new HtmlPlugin({
            filename: 'front.html',
            template: '../src/template/front.html',
            chunks: productionEnv ? ['manifest_front', 'vendor_front', 'front'] : ['front'],
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true
            }
        })
    ]
});


  if(!productionEnv){
    //dev
    config.devtool = '#cheap-module-eval-source-map';
    config.entry['admin'].unshift('webpack-hot-middleware/client?reload=true');
    config.entry['front'].unshift('webpack-hot-middleware/client?reload=true');

    config.plugins = [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new ExtractTextPlugin('[name].css')].concat(config.plugins);

    config.module.rules = config.module.rules.concat(require('./styleLoader').styleLoaders({sourceMap: false}))

  } else{
    //pro
    config.module.rules = config.module.rules.concat(require('./styleLoader').styleLoaders({sourceMap: true, extract: true}));
    config.devtool = '#source-map';
    config.output.filename = '[name].[chunkhash:8].js';
    config.plugins = config.plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,//最紧凑的输出
        comments: false,//删除注释
        compress: {
          warnings: false,//删除没用的不警告
          drop_console: true,//删除console
          collapse_vars: true,//内嵌变量
          reduce_vars: true,//提取变量
        }
      }),
      new ExtractTextPlugin('[name].[contenthash].css'),
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true
        }
      }),
      //分别提取vendor、manifest
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor_admin',
        chunks: ['admin'],
        minChunks: function(module, count) {
          return (
            module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
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
        minChunks: function(module, count) {
          return (
            module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
          )
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest_front',
        chunks: ['vendor_front']
      }),
      //copy assets
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, '../src/static'),
          to: path.resolve(__dirname, '../dist'),
          ignore: ['.*']
        }
      ])
    ])
  }

module.exports = config
