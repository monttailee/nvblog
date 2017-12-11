/**
 * 基础webpack: 抽取构建公用部分
 * 注：ssr(服务器端渲染)构建分为两部分：前端 + 服务器端
 * */
const path = require('path')
const vueLoader = require('./vue-loader')

module.exports = {
    entry: {
        'admin': ['../src/assets/entry/entry-client-admin.js'],
        'front': ['../src/assets/entry/entry-client-front.js']
    },
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],//解析模块时应该搜索的目录
        extensions: ['.js', '.vue', '.json'],
        alias: {//引用别名
            'entry': path.resolve(__dirname, '../src/assets/entry'),
            'lib': path.resolve(__dirname, '../src/assets/entry/lib'),
            'fonts': path.resolve(__dirname, '../src/assets/static/fonts'),
            'utils': path.resolve(__dirname, '../src/assets/utils'),
            'admin_com': path.resolve(__dirname, '../src/components/admin'),
            'front_com': path.resolve(__dirname, '../src/components/front'),
            'common_com': path.resolve(__dirname, '../src/components/common'),
            'router': path.resolve(__dirname, '../src/router'),
            'service': path.resolve(__dirname, '../src/service'),
            'admin_store': path.resolve(__dirname, '../src/store/admin'),
            'front_store': path.resolve(__dirname, '../src/store/front'),
            'css': path.resolve(__dirname, '../src/assets/css'),
        }
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].js'
    },
    externals: {
        'simplemde': 'SimpleMDE'
    },
    plugins: [],
    module: {
        rules: [
            {
              test: /\.(js|vue)$/,
              loader: 'eslint-loader',
              enforce: 'pre',
              include: [path.join(__dirname, '../src')],
              options: {
                  formatter: require('eslint-friendly-formatter')
              }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoader
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
    }
}
