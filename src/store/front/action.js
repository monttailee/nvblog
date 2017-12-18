import { getAllPublishArticles, getArticle, getAllTags } from 'service/frontSer'
import { GET_ALL_POSTS, GET_ALL_TAGS, GET_POST } from './mutationTypes'

export default {
    async getAllPosts({ commit, state }, { tag = '', page = 1, limit = 5 } = {}){
      let res = await getAllPublishArticles(tag, page, limit)
      return commit(GET_ALL_POSTS, { posts: res.data.articleArr, allPage: res.data.allPage, curPage: page })
    },
    async getAllTags({ commit, state }){
      let res = await getAllTags()
      return commit(GET_ALL_TAGS, res.data.tagArr)
    },
    async getPost({ commit, state }, id){
      //find() 方法返回数组中满足提供的测试函数的第一个元素的值
      let article = state.posts.find((post) => post.id == id);
      if (!article && state.currentPost.id == id) {
        article = state.currentPost
      }

      if (article && article.content) {
        return commit(GET_POST, article)
      } else {
          let res = await getArticle(id)
          return commit(GET_POST, res.data.article)
      }
    }
}
