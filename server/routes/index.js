const router = require('koa-router')()
const art_router = require('./api/articles')
const tag_router = require('./api/tags')
const token_router = require('./api/token')

//对api进行路由配置 responds to "/api/articles"
router.use(ENV_CONFIG.app.baseApi, art_router.routes(), art_router.allowedMethods())
router.use(ENV_CONFIG.app.baseApi, tag_router.routes(), tag_router.allowedMethods())
router.use(ENV_CONFIG.app.baseApi, token_router.routes(), token_router.allowedMethods())

module.exports = router
