import * as $ from '../controllers/tags_control.js'
import verify from '../middleware/verify.js'

export default async(router) => {
    router.post('/tags', verify, $.createTag)
        .get('/tags', $.getAllTags)
        .patch('/tags/:id', verify, $.modifyTag)
        .delete('/tags/:id', verify, $.deleteTag)
}