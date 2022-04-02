import Router from '@koa/router';
import {parseController} from './features/parse';

export const router = new Router({ prefix: '/media' });

router.get('/', (ctx) => {
    ctx.body = 'media parse'
    ctx.status = 200
})

router.post('/parse', parseController.parse);

export default router;
