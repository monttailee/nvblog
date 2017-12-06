//获取配置信息+运行环境
const SERVER_ENV = process.env.NODE_ENV;
global.ENV_CONFIG = require('../config/env/' + SERVER_ENV);
const isProd = SERVER_ENV === 'production';

const path = require('path');
const fs = require('fs');
const resolve = file => path.resolve(__dirname, file);

const createBundleRenderer = require('vue-server-renderer').createBundleRenderer;

const Koa = require('koa');
const app = new Koa();
const staticServer = require('koa-static');//托管静态资源
const convert = require('koa-convert');//兼容
const onerror = require('koa-onerror');//错误信息
const router = require('koa-router')();

const historyApiFallback = require('./middleware/historyApiFallback');
const mongodb = require('./dbhelper/mongodb');
const middleware = require('./middleware/index');
const routerApi = require('./router');

//const routerInfo = require('koa-router')();
//connect mongodb
mongodb.connect();

//中间件
app.use(middleware());
onerror(app);

//静态资源
app.use(staticServer(resolve('../src/static')));

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
    const bundle = require('../dist/vue-ssr-api-bundle.json');
    const template = fs.readFileSync(resolve('../src/dist/front.html'), 'utf-8');
    renderer = createRenderer(bundle, template);
    app.use(staticServer('./src/dist'));
} else {
    //开发环境下使用hot/dev middleware拿到bundle与template
    require('./setup-dev-server')(app, (bundle, template) => {
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

//启动服务
app.listen(ENV_CONFIG.app.port, () => {
    console.log('Koa2 server is running at http://localhost:' + ENV_CONFIG.app.port);
});

export default app;