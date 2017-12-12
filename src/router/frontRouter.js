/**
 * front路由封装
 * https://router.vuejs.org/zh-cn/advanced/navigation-guards.html
 * 导航被触发。
 * 在失活的组件里调用离开守卫。
 * 调用全局的 beforeEach 守卫。
 * 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
 * 在路由配置里调用 beforeEnter。
 * 解析异步路由组件。
 * 在被激活的组件里调用 beforeRouteEnter。
 * 调用全局的 beforeResolve 守卫 (2.5+)。
 * 导航被确认。
 * 调用全局的 afterEach 钩子。
 * 触发 DOM 更新。
 * 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。
 **/
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'front_store/index'
import List from 'front_com/List'
import Article from 'front_com/Article'

Vue.use(VueRouter);

export function createRouter() {
  const router = new VueRouter({
    mode: 'history',
    scrollBehavior: (to, from, savedPosition) => {//在后退时回到之前的滚动的位置
      let _nav = to == from ? 'same' : 'null';
      sessionStorage.setItem('navigatorAction', _nav)
    },
    routes: [
      { path: '/', component: List },
      { path: '/article/:id', component: Article, meta: { scrollToTop: true } },
      { path: '/page/:page', component: List },
      { path: '*', redirect: '/' }
    ]
  });

  //全局钩子
  router.beforeEach((to, from, next) => {
    if (typeof window !== "undefined"){
      if (to.path === '/' && store.state.sideBoxOpen) {
        store.commit('CLOSE_SIDEBOX');
        setTimeout( () => next(), 100)

      } else {
        next()
      }
    }
  });

  router.afterEach((to, from) => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        if (sessionStorage.getItem('navigatorAction') == 'same') {
          return;
        }
        if (document && to.meta.scrollToTop) {
          //回到顶部
          document.body.scrollTop = 0
        }
      }, 200)
    }
  });

  return router
}
