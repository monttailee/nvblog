const art_control = require('../../controllers/articles_control.js')
const verify = require('../../middleware/verify.js')
const router = require('koa-router')()

router.get('/articles', verify, art_control.getAllArticles)
router.post('/articles', verify, art_control.createArticle)
router.patch('/articles/:id', verify, art_control.modifyArticle)
router.get('/articles/:id', art_control.getArticle)
router.delete('/articles/:id', verify, art_control.deleteArticle)
router.get('/publishArticles', art_control.getAllPublishArticles)

module.exports = router
