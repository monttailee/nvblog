import { CREATE_ARTICLE, SAVE_ARTICLE, PUBLISH_ARTICLE, GET_ALL_ARTICLES, GET_CURRENT_ARTICLE,
    CHANGE_ARTICLE, NOT_PUBLISH_ARTICLE, DELETE_ARTICLE, CREATE_TAG, MODIFY_TAG, DELETE_TAG,
    DELETE_CURRENT_TAG, GET_ALL_TAGS, TOGGLE_SELECT_TAG, CLEAR_SELECT_TAG, SET_ALL_PAGE, SET_CUR_PAGE } from './mutationTypes'

export default {
    [CREATE_ARTICLE](state, article) {
        state.articleList.unshift(article);
        state.currentArticle = article;
    },
    [SAVE_ARTICLE](state, { id, article }) {
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
    [PUBLISH_ARTICLE](state) {
        state.currentArticle.publish = true;
    },
    [GET_ALL_ARTICLES](state, { articleList, allPage, curPage }) {
        state.articleList = articleList;
        state.allPage = allPage;
        state.curPage = curPage;
    },
    [GET_CURRENT_ARTICLE](state, article) {
        state.currentArticle = article;
    },
    [CHANGE_ARTICLE](state) {
        state.currentArticle.save = false;
    },
    [PUBLISH_ARTICLE](state, id) {
        state.currentArticle.publish = true;
        state.articleList.find(p => p.id === id).publish = true;
    },
    [NOT_PUBLISH_ARTICLE](state, id) {
        state.currentArticle.publish = false;
        state.articleList.find(p => p.id === id).publish = false;
    },
    [DELETE_ARTICLE](state, index) {
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
    [CREATE_TAG](state, tag) {
        state.currentArticle.tags.push(tag)
    },
    [MODIFY_TAG](state, name) {
        state.currentArticle.tags.push(name)

    },
    [DELETE_TAG](state, id) {
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
    [DELETE_CURRENT_TAG](state, index) {
        state.currentArticle.tags.splice(index, 1)
    },
    [GET_ALL_TAGS](state, tagList) {
        state.tagList = tagList;
    },
    [SET_ALL_PAGE](state, allPage) {
        state.allPage = allPage;
    },
    [SET_CUR_PAGE](state, curPage) {
        state.curPage = curPage;
    },
    [TOGGLE_SELECT_TAG](state, id) {
        if (!state.selectTagArr.includes(id)) {
            state.selectTagArr.push(id);
        } else {
            state.selectTagArr = state.selectTagArr.filter((e) => {
                return e !== id;
            })
        }
    },
    [CLEAR_SELECT_TAG](state) {
        state.selectTagArr = [];
    },
}
