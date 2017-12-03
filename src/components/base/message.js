import { Message } from 'element-ui';

export default {
    install: function(Vue, name = '$message'){
        Object.defineProperty(Vue.prototype, name, {value: Message})
    }
}