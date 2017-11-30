import { createArticle, getAllArticles, saveArticle, publishArticle, notPublishArticle,
    deleteArticle, createTag, getAllTags, GET_ALL_TAGS, modifyTag, deleteTag } from '../../service/article'
import { CREATE_ARTICLE,
    GET_ALL_ARTICLES, GET_CURRENT_ARTICLE, CHANGE_ARTICLE, SAVE_ARTICLE, PUBLISH_ARTICLE,
    NOT_PUBLISH_ARTICLE, CREATE_TAG, MODIFY_TAG, DELETE_TAG, DELETE_CURRENT_TAG} from './mutationTypes'

export default {
    async createArticle({commit, state}, {title, content, publish, tags}){
        let res = await createArticle(title, content, publish, tags);
        res.data.success && commit(CREATE_ARTICLE, {save: true})
    },

    async getAllArticles({commit, state, dispatch}, {tag = '', page = 1, limit = 0} = {}){
        let res = await getAllArticles(tag, page, limit);
        if (res.data.success) {
            commit(GET_ALL_ARTICLES, {articleList: res.data.articleArr, allPage: res.data.allPage, curPage: page});
            dispatch('getCurrentArticle', 0);
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
        commit(GET_CURRENT_ARTICLE, article);
    },

    changeArticle({commit, state}){
        commit(CHANGE_ARTICLE)
    },

    async saveArticle({commit, state}, {id, article}){
        let res = await saveArticle(id, article);
        res.data.success && commit(SAVE_ARTICLE, {id, article})
    },

    async publishArticle({commit, state}, {id}){
        let res = await publishArticle(id);
        res.data.success && commit(PUBLISH_ARTICLE, id)
    },

    async notPublishArticle({commit, state}, {id}){
        let res = await notPublishArticle(id);
        res.data.success && commit(NOT_PUBLISH_ARTICLE, id)
    },

    async deleteArticle({commit, state}, {id, index}){
        let res = await deleteArticle(id);
        if (res.data.success) {
            if (state.articleList.length <= 1) {
                let article = {
                    id: -1,
                    index: 0,
                    title: '',
                    content: '',
                    save: false,
                    publish: false
                };
                commit(GET_CURRENT_ARTICLE, article)
            }
        }
    },

    async createTag({commit, state}, {name}){
        let res = await createTag(name);
        res.data.success && commit(CREATE_TAG, res.data.tag)
    },

    async getAllTags({commit, state}){
        let res = await getAllTags();
        res.data.success && commit(GET_ALL_TAGS, res.data.tagArr)
    },

    async modifyTag({commit, state}, {id, name}){
        let res = await modifyTag(id, name);
        res.data.success && commit(MODIFY_TAG, {id, name})
    },

    async deleteTag({commit, state}, {id}){
        let res = await deleteTag(id);
        res.data.success && commit(DELETE_TAG, id)
    },

    async deleteCurrentTag({commit, state}, {index}){
        commit(DELETE_CURRENT_TAG, index)
    }
}