export default {
    posts: state => state.posts,
    tags: state => state.tags,
    curPage: state => state.curPage,
    allPage: state => state.allPage,
    selectTags: state => state.selectTags,
    searchTags: state => {
        return state.selectTags.map((item) => item.id)
    },
    sideBoxOpen: state => state.sideBoxOpen,
    currentPost: state => state.currentPost,
    currentPostCompile: state => state.currentPostCompile
}