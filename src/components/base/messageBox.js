import { Message, MessageBox } from 'element-ui';

export default {
    install: function(Vue){
        Object.defineProperty(Vue.prototype, '$message', {value: Message});
        Object.defineProperty(Vue.prototype, '$msgbox', {value: MessageBox});
    }
}

/*
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = (options) => { //重新定义默认参数
    options = Object.assign(options, { duration: 500 });
    return Message(options);
}
Vue.prototype.$message.error = (err) => { //重新定义默认参数
    var options = {
        message: err,
        duration: 500,
        type: 'error'
    };
    return Message(options);
}*/
