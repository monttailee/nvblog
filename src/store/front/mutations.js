import {
    GET_ALL_POSTS,
    GET_ALL_TAGS,
    SET_SELECT_TAGS,
    TOGGLE_SELECT_TAGS,
    TOGGLE_SIDEBOX,
    CLOSE_SIDEBOX,
    GET_POST
} from './mutationTypes'

import marked from '../../assets/js/lib/marked'

export default {
    [GET_ALL_POSTS](state, { posts, allPage, curPage }){
        if (isNaN(+allPage)) {
            allPage = 0
        }
        if (isNaN(+curPage)) {
            curPage = 0
        }
        state.posts = posts;
        state.allPage = +allPage;
        state.curPage = +curPage;
    },
    [GET_ALL_TAGS](state, tags){
        state.tags = tags;
    },
    [SET_SELECT_TAGS](state, tags){
        state.selectTags = tags;
    },
    [TOGGLE_SELECT_TAGS](state, { id, name }){
        if (typeof state.selectTags.find(function(e) {
                return e.id == id
            }) == 'undefined') {
            state.selectTags.push({
                id,
                name
            })
        } else {
            state.selectTags = state.selectTags.filter((e) => {
                return e.id !== id;
            })
        }
    },
    [TOGGLE_SIDEBOX](state){
        state.sideBoxOpen = !state.sideBoxOpen;
    },
    [CLOSE_SIDEBOX](state){
        state.sideBoxOpen = false;
    },
    [GET_POST](state, article){
        state.currentPost = article;
        state.currentPostCompile = marked(state.currentPost.content);
    },
}