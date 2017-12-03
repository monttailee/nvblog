import '../../assets/css/main.styl'

import Vue from 'vue'

import router from '../../router/adminRouter'
import App from '../../components/admin/Home.vue'
import store from '../../store/admin/store'

// 按需引入element-ui相关弹出
import { Message } from 'element-ui'

Vue.prototype.$message = (options) => { //重新定义默认参数
    options = Object.assign(options, { duration: 500 });
    return Message(options);
};
Vue.prototype.$message.error = (err) => { //重新定义默认参数
    var options = {
        message: err,
        duration: 500,
        type: 'error'
    };
    return Message(options);
};

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});