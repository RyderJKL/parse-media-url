import Router from '@koa/router';
import { controller as parseurlContoller } from './features/parse-url';

export const router = new Router();

router.post('/parse', parseurlContoller);

export default router;