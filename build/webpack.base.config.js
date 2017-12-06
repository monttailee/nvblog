const path = require('path')

module.exports = {
    devtool: '#cheap-module-eval-source-map',
    entry: {
        'admin': ['../src/assets/entry/admin'],
        'front': ['../src/assets/entry/front'],
        //vendor: ['vue', 'vue-router', 'vuex', 'vuex-router-sync', 'axios']
    },
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'entry': path.resolve(__dirname, '../src/assets/entry'),
            'fonts': path.resolve(__dirname, '../src/assets/fonts'),
            'utils': path.resolve(__dirname, '../src/assets/utils'),
            'admin_com': path.resolve(__dirname, '../src/components/admin'),
            'front_com': path.resolve(__dirname, '../src/components/front'),
            'common_com': path.resolve(__dirname, '../src/components/common'),
            'router': path.resolve(__dirname, '../src/router'),
            'service': path.resolve(__dirname, '../src/service'),
            'admin_store': path.resolve(__dirname, '../src/store/admin'),
            'front_store': path.resolve(__dirname, '../src/store/front'),
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
                enforce: 'pre',
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            },
            {
                enforce: 'pre',
                test: /\.vue$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        styl: ['vue-style-loader', 'css-loader?minimize', 'stylus-loader'],
                        stylus: ['vue-style-loader', 'css-loader?minimize', 'stylus-loader'],
                        css: ['vue-style-loader', 'css-loader?minimize'],
                    },
                    preserveWhitespace: false,
                    postcss: [require('autoprefixer')({ browsers: ['last 7 versions'] })]
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.styl$/,
                use: ['style-loader', 'css-loader?minimize', 'stylus-loader'],
                include: [path.resolve(__dirname, '../')]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader?minimize']
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: path.posix.join('src/assets/', 'images/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: path.posix.join('src/assets/', 'fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    }
}