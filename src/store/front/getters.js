//Getter就是把组件中共有的对state 的操作进行了提取，它就相当于 对state 的computed. 所以它会获得state 作为第一个参数
export const posts = state => state.posts
export const tags = state => state.tags
export const curPage = state => state.curPage
export const allPage = state => state.allPage
export const selectTags = state => state.selectTags
export const searchTags = state => {return state.selectTags.map((item) => item.id)}
export const sideBoxOpen = state => state.sideBoxOpen
export const currentPost = state => state.currentPost
export const currentPostCompile = state => state.currentPostCompile
