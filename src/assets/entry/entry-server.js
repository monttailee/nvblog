/**
 * front页面(server-render)入口文件
 * */
import { app, router, store } from './front'

const isDev = process.env.NODE_ENV !== 'production'
/**
 * 这个暴露的方法将被 node端 bundleRenderer 调用
 * 在实际渲染前获取到应用中 Store 的数据
 * 数据是异步获取，这个方法会返回一个 Promise 给应用实例
 * */
export default context => {
  const s = isDev && Date.now()

  // 设置路由位置
  router.push(context.url)
  const matchedComponents = router.getMatchedComponents()

  router.onReady(() => {
    // 无匹配路由
    if (!matchedComponents.length) {
      return Promise.reject({ code: '404' })
    }

    // 调用匹配路由组件的 preFetch 钩子
    // 一个 preFetch 钩子分发一个 action，并返回一个 Promise
    // 该 Promise 将在 action 完成和 state 变更时 resolve
    return Promise.all(matchedComponents.map(component => {
      if (component.preFetch) {
        return component.preFetch(store)
      }
    })).then(() => {
      isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
      // 在所有的 preFetch 钩子 resolved 后
      // 我们的 store 现在有了用于渲染应用的所有 state
      // 将这些 state 暴露给 context，并请求处理内联在 HTML 响应中的 state
      // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML

      context.state = store.state
      //context.state.posts.forEach((element, index) => {
        //context.state.posts[index].content = ''
      //})
      return app
    })
  })
}
