import { CREATE_TOKEN, DELETE_TOKEN } from './mutationTypes'

export default {
    [CREATE_TOKEN](state, token){
        state.token = token
        sessionStorage.setItem('vue-blog-token', token)
    },
    [DELETE_TOKEN](state){
        state.token = null
        sessionStorage.setItem('vue-blog-token', '')
    }
}
