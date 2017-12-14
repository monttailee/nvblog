//获取配置信息+运行环境
const SERVER_ENV = process.env.NODE_ENV
global.ENV_CONFIG = require('../config/env/' + SERVER_ENV)
const isProd = SERVER_ENV === 'production'

const path = require('path')
const fs = require('fs')
const resolve = file => path.resolve(__dirname, file)

const createBundleRenderer = require('vue-server-renderer').createBundleRenderer

const Koa = require('koa')
const app = new Koa()
const staticServer = require('koa-static')//托管静态资源
const favicon = require('koa-favicon')
const convert = require('koa-convert')//兼容
const onerror = require('koa-onerror')//错误信息
const router = require('koa-router')()

const historyApiFallback = require('./middleware/historyApiFallback')
const mongodb = require('./dbhelper/mongodb')
const middleware = require('./middleware')
const routerApi = require('./router')

//connect mongodb
mongodb.connect()

//创建渲染器，开启缓存
let renderer
if (isProd) {
  //生产环境,bundle是构建完成的正式文件
  const bundle = require('../dist/server-bundle.js')
  const template = fs.readFileSync(resolve('../dist/front.html'), 'utf-8')
  renderer = createRenderer(bundle, template)

} else {
  //开发环境,bundle会在改变之后重新回调生成
  require('../build/setup-dev-server')(app, (bundle, template) => {
    renderer = createRenderer(bundle, template)
  })
}

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

//icon
app.use(favicon(resolve('../dist/images/logo.png')))

//中间件
app.use(middleware())
onerror(app)

//静态资源
app.use(staticServer(resolve('../dist')))

//路由
app.use(routerApi())

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
})))

//ssr渲染页面内容
router.get('*', async(ctx, next) => {
    if (!renderer) {
      return ctx.body = 'waiting for compilation... refresh in a moment.'
    }

    let res = ctx.res
    let req = ctx.req

    ctx.type = 'html'
    const s = Date.now()
    let context = { url: req.url }

    function renderHtml() {
      return new Promise((resolve, reject) => {
        renderer.renderToString(context, (err, html) => {
          if (err) {
            console.log(err)
          }
          if (!isProd) {
            console.log(`whole request: ${Date.now() - s}ms`)
          }
          resolve(html)
        })
      })
    }

    ctx.body = await renderHtml()
})

app
    .use(router.routes())
    .use(router.allowedMethods())

//启动服务
const port = ENV_CONFIG.app.port || 3000
app.listen(port, () => {
    console.log('Koa2 server is running at http://localhost:' + port)
})

export default app
