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
const template = fs.readFileSync(resolve('./src/front.template.html'), 'utf-8')
function createRenderer(bundle, options) {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      template,
      cache: require('lru-cache')({
        max: 1000,
        maxAge: 1000 * 60 * 15
      }),
      basedir: resolve('./dist'),
      runInNewContext: false
    })
  )
}

//icon
app.use(favicon(resolve('../dist/images/logo.png')))

//中间件
app.use(middleware())
onerror(app)

//路由
app.use(routerApi())

//路由admin被拦截走historyApiFallback,不用服务端渲染
// */admin 或者 */admin/login 均渲染admin.html
app.use(convert(historyApiFallback({
    verbose: true,
    index: '/admin.html',
    rewrites: [
        { from: /^\/admin$/, to: '/admin.html' },
        { from: /^\/admin\/login/, to: '/admin.html' }
    ],
    path: /^\/admin/
})))

let renderer
let readyPromise

if (isProd) {
  const bundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    clientManifest
  })
} else {
  readyPromise = require('./build/setup-dev-server')(app, (bundle, options) => {
    renderer = createRenderer(bundle, options)
  })
}

//静态资源
app.use(staticServer(resolve('../dist')))

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

app.use(router.routes()).use(router.allowedMethods())

const port = ENV_CONFIG.app.port || 8089
app.listen(port, () => {
    console.log('Koa2 server is running at http://localhost:' + port)
})

export default app
