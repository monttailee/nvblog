import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const defaultState = {
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

const inBrowser = typeof window !== 'undefined'

// if in browser, use pre-fetched state injected by SSR
const state = (inBrowser && window.__INITIAL_STATE__) || defaultState

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})
