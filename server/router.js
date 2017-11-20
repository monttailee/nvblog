import compose from 'koa-compose';
import Router from 'koa-router';
import convert from 'koa-convert';
import importDir from 'import-dir';
const routers = importDir('./routers');

export default function routerApi() {
    const router = new Router({
        prefix: ENV_CONFIG.app.baseApi  //路由前缀  router.get('/:id', ...); // responds to "/users/:id"
    });
    Object.keys(routers).forEach(name => {
        return routers[name]['default'](router)
    });
    return convert.compose([
        router.routes(),
        router.allowedMethods()
    ]);
}