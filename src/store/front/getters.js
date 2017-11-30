//Getter就是把组件中共有的对state 的操作进行了提取，它就相当于 对state 的computed. 所以它会获得state 作为第一个参数
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