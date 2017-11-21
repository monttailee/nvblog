import Koa from 'koa';
import convert from 'koa-convert';//兼容
import onerror from 'koa-onerror';//错误信息
import staticServer from 'koa-static';//托管Koa应用内的静态资源
import mongoose from 'mongoose';

import url from 'url';
import path from 'path';
import fs from 'fs';
import { createBundleRenderer } from 'vue-server-renderer';

import historyApiFallback from './middleware/historyApiFallback';
import middleware from './middleware/index.js';
import routerApi from './router.js';
//const glob = require('glob');

//获取配置信息+运行环境
const SERVER_ENV = process.env.NODE_ENV;
global.ENV_CONFIG = require('../config/env/' + SERVER_ENV);
const isProd = SERVER_ENV === 'production';

const resolve = file => path.resolve(__dirname, file);

// connect mongodb
mongoose.Promise = Promise;
mongoose.connect(ENV_CONFIG.mongodb.url, ENV_CONFIG.mongodbSecret);
mongoose.connection.on('error', console.error);

//node框架/路由初始化
const router = require('koa-router')();
const routerInfo = require('koa-router')();
const app = new Koa();

//中间件
app.use(middleware());
onerror(app);

//静态资源
app.use(staticServer(resolve('../client/static')));

//路由
app.use(routerApi());


//创建服务端渲染器，开启缓存
let renderer = void 0;
function createRenderer(bundle, template) {
    return createBundleRenderer(bundle, {
        template,
        cache: require('lru-cache')({
            max: 1000,
            maxAge: 1000 * 60 * 15
        }),
        runInNewContext: false
    })
}

//提示webpack还在工作
routerInfo.get('*', async(ctx, next) => {
    if (!renderer) {
        return ctx.body = 'waiting for compilation... refresh in a moment.';
    }
    return next();
});

app.use(routerInfo.routes());

//connect-history-api-fallback让你的单页面路由处理更自然
//对路由admin直接走historyApiFallback,而不是用服务端渲染
//  */admin 或者 */admin/login 均渲染admin.html
app.use(convert(historyApiFallback({
    verbose: true,
    index: '/admin.html',
    rewrites: [
        { from: /^\/admin$/, to: '/admin.html' },
        { from: /^\/admin\/login/, to: '/admin.html' }
    ],
    path: /^\/admin/
})));

if (isProd) {
    //生产环境下直接读取构造渲染器
    const bundle = require('../client/dist/vue-ssr-api-bundle.json');
    const template = fs.readFileSync(resolve('../client/dist/front.html'), 'utf-8');
    renderer = createRenderer(bundle, template);
    app.use(staticServer('./client/dist'));
} else {
    //开发环境下使用hot/dev middleware拿到bundle与template
    require('../client/build/setup-dev-server')(app, (bundle, template) => {
        renderer = createRenderer(bundle, template)
    })
}

//流式渲染
router.get('*', async(ctx, next) => {
    let res = ctx.res;
    let req = ctx.req;
    // 由于koa内有处理type，此处需要额外修改content-type
    ctx.type = 'html';
    const s = Date.now();
    let context = { url: req.url };

    function renderToStringPromise() {
        return new Promise((resolve, reject) => {
            renderer.renderToString(context, (err, html) => {
                if (err) {
                    console.log(err);
                }
                if (!isProd) {
                    console.log(`whole request: ${Date.now() - s}ms`)
                }
                resolve(html);
            })
        })
    }
    ctx.body = await renderToStringPromise();
});

app
    .use(router.routes())
    .use(router.allowedMethods());

//create server
app.listen(ENV_CONFIG.app.port, () => {
    console.log('Koa2 server is running at http://localhost:' + ENV_CONFIG.app.port);
});

export default app;