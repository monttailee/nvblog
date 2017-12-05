/**
 * client--浏览页 service
 * */
import Axios from 'axios'

// 为了让服务端渲染正确请求数据
if(typeof window == "undefined") {
    Axios.defaults.baseURL = 'http://127.0.0.1:5050';
 }

export default {
    getAllTags() {
        return Axios.get('/api/tags')
    },
    getAllPublishArticles(tag = '', page = 1, limit = 0) {
        return Axios.get(`/api/publishArticles?tag=${tag}&page=${page}&limit=${limit}`)
    },
    getArticle(id) {
        return Axios.get('/api/articles/' + id)
    }
}