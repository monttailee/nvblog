//多个modules的store合并，类似react的多个reducer合并
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import auth from './authModule/index'
import editor from './editorModule/index'

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        auth,
        editor
    },
    strict: debug,
})