import { createArticle, getAllArticles, saveArticle, publishArticle, notPublishArticle,
    deleteArticle, createTag, getAllTags, GET_ALL_TAGS, modifyTag, deleteTag } from 'service/adminSer'

import { CREATE_ARTICLE,
    GET_ALL_ARTICLES, GET_CURRENT_ARTICLE, CHANGE_ARTICLE, SAVE_ARTICLE, PUBLISH_ARTICLE,
    NOT_PUBLISH_ARTICLE, CREATE_TAG, MODIFY_TAG, DELETE_TAG, DELETE_CURRENT_TAG} from './mutationTypes'

import { dealResult } from 'utils/index'

export default {
    async createArticle({commit, state}, {title, content, publish, tags}){
      try{
        let res = await createArticle(title, content, publish, tags)
        dealResult(res, () => commit(CREATE_ARTICLE, {save: true}))

        return res
      }catch (err){
        return err
      }
    },

    async getAllArticles({commit, state, dispatch}, {tag = '', page = 1, limit = 0} = {}){
      try{
        let res = await getAllArticles(tag, page, limit);
        dealResult(res, () => {
          commit(GET_ALL_ARTICLES, {articleList: res.data.articleArr, allPage: res.data.allPage, curPage: page})
          dispatch('getCurrentArticle', 0)
        })

        return res
      }catch (err){
        return err
      }
    },

    async getCurrentArticle({commit, state}, index){
        let article;
        if (state.articleList.length == 0 || index == -1) {
            article = {
                id: -1,
                index: -1,
                title: '',
                content: '<!--more-->',
                save: true,
                publish: false,
                tags: []
            }
        } else {
            article = {
                id: state.articleList[index].id,
                index: index,
                title: state.articleList[index].title,
                content: state.articleList[index].content,
                save: true,
                publish: state.articleList[index].publish,
                tags: state.articleList[index].tags
            }
        }
        commit(GET_CURRENT_ARTICLE, article)
    },

    changeArticle({commit, state}){
        commit(CHANGE_ARTICLE)
    },

    async saveArticle({commit, state}, {id, article}){
      let res = await saveArticle(id, article)
      dealResult(res, () => commit(SAVE_ARTICLE, {id, article}))

      return res
    },

    async publishArticle({commit, state}, {id}){
      let res = await publishArticle(id)
      dealResult(res, () => commit(PUBLISH_ARTICLE, id))

      return res
    },

    async notPublishArticle({commit, state}, {id}){
      let res = await notPublishArticle(id)
      dealResult(res, () => commit(NOT_PUBLISH_ARTICLE, id))

      return res
    },

    async deleteArticle({commit, state}, {id, index}){
      let res = await deleteArticle(id);
      dealResult(res, () => {
        if (state.articleList.length <= 1) {
          let article = {
              id: -1,
              index: 0,
              title: '',
              content: '',
              save: false,
              publish: false
          }
          commit(GET_CURRENT_ARTICLE, article)
        }
      })

      return res
    },

    async createTag({commit, state}, {name}){
      let res = await createTag(name)
      dealResult(res, () => commit(CREATE_TAG, res.data.tag))
      return res
    },

    async getAllTags({commit, state}){
      let res = await getAllTags()
      dealResult(res, () => commit(GET_ALL_TAGS, res.data.tagArr))
    },

    async modifyTag({commit, state}, {id, name}){
      let res = await modifyTag(id, name)
      dealResult(res, () => commit(MODIFY_TAG, {id, name}))

      return res
    },

    async deleteTag({commit, state}, {id}){
      let res = await deleteTag(id);
      dealResult(res, () => commit(DELETE_TAG, id))

      return res
    },

    async deleteCurrentTag({commit, state}, {index}){
        return commit(DELETE_CURRENT_TAG, index)
    }
}
