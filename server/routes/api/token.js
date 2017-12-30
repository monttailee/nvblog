const token_control = require('../../controllers/token_control.js')
const router = require('koa-router')()

token_control.initUser()
router.post('/token', token_control.login)

module.exports = router
