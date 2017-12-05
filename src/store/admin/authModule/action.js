import { createToken } from '../../../service/login'
import { CREATE_TOKEN, DELETE_TOKEN } from './mutationTypes'

export default {
    async createToken({ commit, state }, { username, password }){
        let res = await createToken(username, password);
        res.data.success ? commit(CREATE_TOKEN, res.data.token) : commit(DELETE_TOKEN)
    }
}