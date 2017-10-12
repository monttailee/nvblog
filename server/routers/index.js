import compose from 'koa-compose';
import Router from 'koa-router';
import convert from 'koa-convert';
import importDir from 'import-dir';
import config from '../configs';
const routers = importDir('./routers');

export default function api() {
    const router = new Router({
        prefix: config.app.baseApi
    });
    Object.keys(routers).forEach(name => {
        return routers[name](router)
    });
    return convert.compose([
        router.routes(),
        router.allowedMethods()
    ]);
}