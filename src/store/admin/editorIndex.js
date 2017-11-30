import mutations from './editorMutations'
import actions from './editorAction'
import getters from './editorGetters'

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