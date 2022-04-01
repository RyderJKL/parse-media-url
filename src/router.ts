import Router from '@koa/router';
import { parseController } from './features/parse';

export const router = new Router();

router.post('/parse', parseController.parse);

export default router;
