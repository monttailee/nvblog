import logger from 'koa-logger';//log
import bodyParser from 'koa-bodyparser';//解析body
import compress from 'koa-compress';//压缩
import convert from 'koa-convert';//兼容

export default function middleware() {
    //对不支持koa2的中间件使用koa-convert来做兼容
    return convert.compose(
        logger(),
        bodyParser(),
        compress({
            filter: function(content_type) {//配置过滤的压缩文件的类型
                // 为了让hot reload生效，不对__webpack_hmr压缩
                return !(/event-stream/i.test(content_type))
            },
            //threshold: 2048,   //要压缩的最小响应字节
            //flush: require('zlib').Z_SYNC_FLUSH  //同步的刷新缓冲区数据；
        })
    )
}