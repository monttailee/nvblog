/**
 * front页面(server-render)入口文件
 * */
import { createApp } from './front'

const isDev = process.env.NODE_ENV !== 'production'

export default context => {
    return new Promise((resolve, reject) => {
      const s = isDev && Date.now()
      const { app, router, store } = createApp()

      //set router's location
      router.push(context.url)

      router.onReady(() => {
          const matchedComponents = router.getMatchedComponents();
          if (!matchedComponents.length) {
              reject({ code: 404 })
          }

        Promise.all(matchedComponents.map(component => {
          return component.preFetch && component.preFetch(store)
        })).then(() => {
            isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)

            //暴露数据到HTMl，使得客户端渲染拿到数据，跟服务端渲染匹配
            context.state = store.state
            context.state.posts.forEach((element, index) => {
                context.state.posts[index].content = ''
            })
            resolve(app)
          }).catch(reject)
      })
    })
}
