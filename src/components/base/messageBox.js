/**
 * 封装 MessageBox 为一个插件
 * 应用vue.use(*)变成全局组件
 * https://www.cnblogs.com/dupd/p/6716386.html  vue.use源码分析
 * */
import { MessageBox } from 'element-ui';

export default {
    install: function(Vue){
        Object.defineProperty(Vue.prototype, '$msgBox', {value: MessageBox});
        Object.defineProperty(Vue.prototype, '$alert', {value: MessageBox.alert});
        Object.defineProperty(Vue.prototype, '$confirm', {value: MessageBox.confirm});
        Object.defineProperty(Vue.prototype, '$prompt', {value: MessageBox.prompt});
    }
}