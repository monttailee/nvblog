import axios from '../assets/utils/http'

export default {
    createToken(username, password) {
        return axios.post('/api/token', { username, password })
    }
}