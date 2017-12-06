/**
 * 服务端返回结果封装
 * */
exports.handleError = ({ ctx, message = '请求失败', err = null }) => {
    ctx.body = { code: 0, message, debug: err }
};

exports.handleSuccess = ({ ctx, message = '请求成功', data = null }) => {
    ctx.response.body = { code: 1, message, data }
};