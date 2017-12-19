import mutations from './mutations'
import actions from './action'

const state = {
    token: sessionStorage.getItem('vue-blog-token')
}

export default {
    state,
    actions,
    mutations
}
