/**
 * front路由封装
 **/
import Vue from 'vue'
import VueRouter from 'vue-router'
import List from 'front_com/List'
import Article from 'front_com/Article'

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    scrollBehavior: (to, from, savedPosition) => {
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

export default router;
