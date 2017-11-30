//多个modules的store合并，类似react的多个reducer合并
import Vue from 'vue'
import Vuex from 'vuex'
import auth from './authIndex'
import editor from './editorIndex'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        auth,
        editor
    },
    strict: debug,
})