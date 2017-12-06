import { mongoose } from '../dbhelper/mongodb'
import moment from 'moment'

moment.locale('zh-cn');
const Schema = mongoose.Schema;
//定义一个表结构
const articleSchema = new Schema({
    title: String,
    content: String,
    abstract: String,
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'tag'
    }],
    publish: {
        type: Boolean,
        default: false
    },
    createTime: {
        type: Date
    },
    lastEditTime: {
        type: Date,
        default: Date.now
    },
}, { versionKey: false });

//当实例调用了toJSON方法后起作用
articleSchema.set('toJSON', { getters: true, virtuals: true });

articleSchema.set('toObject', { getters: true, virtuals: true });

//修改createTime的输出值
articleSchema.path('createTime').get(function(v) {
    return moment(v).format('lll');
});

articleSchema.path('lastEditTime').get(function(v) {
    return moment(v).format('lll');
});

//生成model并导出
module.exports = mongoose.model('article', articleSchema);