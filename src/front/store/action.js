import { getAllPublishArticles, getArticle } from '../../service/article'
import { getAllTags } from '../../service/tag'
import { GET_ALL_POSTS, GET_ALL_TAGS, GET_POST } from './mutationTypes'


export default {
    async getAllPosts({ commit, state }, { tag = '', page = 1, limit = 5 } = {}){
        let res = await getAllPublishArticles(tag, page, limit);
        commit(GET_ALL_POSTS, res)
    },
    async getAllTags({ commit, state }){
        let res = await getAllTags();
        commit(GET_ALL_TAGS, res)
    },
    async getPost({ commit, state }, id){

        let article = state.posts.find((post) => post.id == id);
        if (!article && state.currentPost.id == id) {
            article = state.currentPost;
        }

        if (article && article.content) {
            commit(GET_POST, article);

        } else {
            let res = await getArticle(id);
            commit(GET_POST, res)
        }
    }
}