import * as types from '../mutation-types'
import api from '../../../../api/article.js'
import tagApi from '../../../../api/tag.js'

const state = {
    articleList: [],
    tagList: [],
    currentArticle: {
        id: -1,
        index: -1,
        content: '',
        title: '',
        tags: [],
        save: true,
        publish: false
    },
    allPage: 1,
    curPage: 1,
    selectTagArr: []
};
// getters
const getters = {
    articleList: state => state.articleList,
    tagList: state => state.tagList,
    currentArticle: state => state.currentArticle,
    allPage: state => state.allPage,
    curPage: state => state.curPage,
    selectTagArr: state => state.selectTagArr
};


const mutations = {
    [types.CREATE_ARTICLE](state, article) {
        state.articleList.unshift(article)
        state.currentArticle = article;
    },
    [types.SAVE_ARTICLE](state, { id, article }) {
        state.currentArticle.save = true;
        let now = state.articleList.find(p => p.id === id)
        if (now) {
            now.title = article.title;
            now.content = article.content;
            now.abstract = article.abstract;
            now.tags = article.tags;
            now.lastEditTime = article.lastEditTime;
        }
    },
    [types.PUBLISH_ARTICLE](state) {
        state.currentArticle.publish = true;
    },
    [types.GET_ALL_ARTICLES](state, { articleList, allPage, curPage }) {
        state.articleList = articleList;
        state.allPage = allPage;
        state.curPage = curPage;
    },
    [types.GET_CURRENT_ARTICLE](state, article) {
        state.currentArticle = article;
    },
    [types.CHANGE_ARTICLE](state) {
        state.currentArticle.save = false;
    },
    [types.PUBLISH_ARTICLE](state, id) {
        state.currentArticle.publish = true;
        state.articleList.find(p => p.id === id).publish = true;
    },
    [types.NOT_PUBLISH_ARTICLE](state, id) {
        state.currentArticle.publish = false;
        state.articleList.find(p => p.id === id).publish = false;
    },
    [types.DELETE_ARTICLE](state, index) {
        state.articleList.splice(index, 1)
        if (state.articleList.length === 0) {
            return;
        }
        if (index > state.articleList.length - 1) {
            index = state.articleList.length - 1;
        }
        state.currentArticle = state.articleList[index];
        state.currentArticle.index = index;
        state.currentArticle.save = true;
    },
    [types.CREATE_TAG](state, tag) {
        state.currentArticle.tags.push(tag)
    },
    [types.MODIFY_TAG](state, name) {
        state.currentArticle.tags.push(name)

    },
    [types.DELETE_TAG](state, id) {
        state.tagList = state.tagList.filter((e) => {
            return e.id !== id;
        })
        state.currentArticle.tags = state.currentArticle.tags.filter((e) => {
            return e.id !== id;
        })
        state.selectTagArr = state.selectTagArr.filter((e) => {
            return e !== id;
        })

    },
    [types.DELETE_CURRENT_TAG](state, index) {
        state.currentArticle.tags.splice(index, 1)
    },
    [types.GET_ALL_TAGS](state, tagList) {
        state.tagList = tagList;
    },
    [types.SET_ALL_PAGE](state, allPage) {
        state.allPage = allPage;
    },
    [types.SET_CUR_PAGE](state, curPage) {
        state.curPage = curPage;
    },
    [types.TOGGLE_SELECT_TAG](state, id) {
        if (!state.selectTagArr.includes(id)) {
            state.selectTagArr.push(id);
        } else {
            state.selectTagArr = state.selectTagArr.filter((e) => {
                return e !== id;
            })
        }
    },
    [types.CLEAR_SELECT_TAG](state) {
        state.selectTagArr = [];
    },
}
export default {
    state,
    getters,
    actions,
    mutations
}