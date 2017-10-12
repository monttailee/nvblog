import * as $ from '../controllers/token_control.js'

export default async(router) => {
    $.initUser();
    router.post('/token', $.login)
}