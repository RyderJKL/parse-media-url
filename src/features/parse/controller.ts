import {RouterContext} from '@koa/router';
import {extraMedia} from './utils';
import {MediaData} from '../../type'
import db from '../../db'
import logger from '../../logger';

export interface RequestBody {
    post_id: number;
    url: string;
}

const updateDB = (mediaData: MediaData, id: number) => new Promise((resolve, reject) => {
    db.query('update `cnews`.`reddit_post` set data = ? where id = ?', [JSON.stringify(mediaData), id], (error, result) => {
        if (error) {
            logger.error(error);
            return reject(error)
        }
        logger.info('数据库更新成功');
        resolve(mediaData);
    });

});

class ParseController {
    async parse(ctx: RouterContext, next: () => void) {
        try {
            const body = ctx.request.body as RequestBody;
            const mediaData = await extraMedia(body.url);

            if (typeof body.post_id === undefined) {
                throw '提交参数错误：id 不合法'
            }

            if (!mediaData) return;

            await updateDB(mediaData, body.post_id);

            ctx.type = 'application/json'
            ctx.body = JSON.stringify(mediaData);
            ctx.status = 200;
        } catch (e) {
            console.error(e);
            ctx.body = JSON.stringify(e);
            ctx.status = 500
            next();
        }
    }
}

export default new ParseController;
