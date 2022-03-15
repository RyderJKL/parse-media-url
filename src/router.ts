import Router from '@koa/router';
import { launchMeidaCrawler } from './crawler-engine';

export const router = new Router();

router.post('/parse', async (ctx) => {
    console.log(ctx.request.body);
    await launchMeidaCrawler('https://benlesh.medium.com/learning-observable-by-building-observable-d5da57405d87');
    ctx.body = 'hahh post'
});

export default router;