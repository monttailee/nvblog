import mutations from './authMutations'
import actions from './authAction'

const state = {
    token: sessionStorage.getItem('vue-blog-token')
};

export default {
    state,
    actions,
    mutations
}