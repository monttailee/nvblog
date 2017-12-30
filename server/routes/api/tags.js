const tag_control = require('../../controllers/tags_control.js')
const verify = require('../../middleware/verify.js')
const router = require('koa-router')()

router.post('/tags', verify, tag_control.createTag)
router.get('/tags', tag_control.getAllTags)
router.patch('/tags/:id', verify, tag_control.modifyTag)
router.delete('/tags/:id', verify, tag_control.deleteTag)

module.exports = router
