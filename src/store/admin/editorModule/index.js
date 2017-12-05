import mutations from './mutations'
import actions from './action'
import getters from './getters'

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

export default {
    state,
    getters,
    actions,
    mutations
}