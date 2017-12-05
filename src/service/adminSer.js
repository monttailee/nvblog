import axios from '../assets/utils/http'

export default {
    createToken(username, password) {
        return axios.post('/api/token', { username, password })
    },
    createArticle(title, content, publish, tags) {
        let abstract;
        if (content.indexOf("<!--more-->") !== -1) {
            abstract = content.split("<!--more-->")[0];
        } else {
            abstract = '';
        }
        return axios.post('/api/articles', { title, content, publish, abstract, tags })
    },
    getAllArticles(tag = '', page = 1, limit = 0) {
        return axios.get(`/api/articles?tag=${tag}&page=${page}&limit=${limit}`)
    },
    getAllPublishArticles(tag = '', page = 1, limit = 0) {
        return axios.get(`/api/publishArticles?tag=${tag}&page=${page}&limit=${limit}`)
    },
    saveArticle(id, article) {
        //console.log(article);
        return axios.patch('/api/articles/' + id, article)
    },
    publishArticle(id) {
        return axios.patch('/api/articles/' + id, { "publish": true })
    },
    notPublishArticle(id) {
        return axios.patch('/api/articles/' + id, { "publish": false })
    },
    deleteArticle(id) {
        return axios.delete('/api/articles/' + id)
    },
    getArticle(id) {
        return axios.get('/api/articles/' + id)
    },
    createTag(name) {
        return axios.post('/api/tags', {name:name})
    },
    modifyTag(id, name) {
        return axios.patch('/api/tags/' + id, name)
    },
    deleteTag(id) {
        return axios.delete('/api/tags/' + id)
    }
}