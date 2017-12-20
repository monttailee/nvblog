/**
 * 基础webpack: 抽取构建公用部分
 * 注：ssr(服务器端渲染)分为两部分：前端 + 服务器端
 * */
const path = require('path')
const webpack = require('webpack')

const isPro = process.env.NODE_ENV === 'production'

module.exports = {
    devtool: isPro ? '#source-map' : '#cheap-module-eval-source-map',
    entry: {
      admin: './src/assets/entry/admin.js',
      front: './src/assets/entry/entry-client.js'
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/dist/',
      filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {//引用别名
            'entry': path.resolve(__dirname, '../src/assets/entry'),
            'lib': path.resolve(__dirname, '../src/assets/entry/lib'),
            'fonts': path.resolve(__dirname, '../src/assets/static/fonts'),
            'utils': path.resolve(__dirname, '../src/assets/utils'),
            'admin_com': path.resolve(__dirname, '../src/components/admin'),
            'front_com': path.resolve(__dirname, '../src/components/front'),
            'common_com': path.resolve(__dirname, '../src/components/common'),
            'base_com': path.resolve(__dirname, '../src/components/base'),
            'router': path.resolve(__dirname, '../src/router'),
            'service': path.resolve(__dirname, '../src/service'),
            'admin_store': path.resolve(__dirname, '../src/store/admin'),
            'front_store': path.resolve(__dirname, '../src/store/front'),
            'css': path.resolve(__dirname, '../src/assets/css'),
        }
    },
    externals: {
        'simplemde': 'SimpleMDE'
    },
    module: {
      rules: [
        {
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          exclude: /node_modules/
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: require('./styleLoader').cssLoaders({
              sourceMap: isPro,
              extract: isPro
            }),
            preserveWhitespace: false,
            postcss: [
              require('autoprefixer')({
                browsers: ['last 3 versions']
              })
            ]
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'images/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name].[hash:7].[ext]'
          }
        }
      ]
    },
    plugins: []
}
