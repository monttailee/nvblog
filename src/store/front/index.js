import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
    currentPost: {
        content: '',
        id: ''
    },
    currentPostCompile: '',
    posts: [],
    allPage: 0,
    curPage: 0,
    tags: [],
    selectTags: [],
    sideBoxOpen: false
}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})

export default store
