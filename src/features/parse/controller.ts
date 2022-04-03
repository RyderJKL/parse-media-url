import {RouterContext} from '@koa/router';
import {extraMedia} from './utils';
import {MediaData} from '../../type'
import db from '../../db'
import logger from '../../logger';
import {merge} from 'lodash';

export interface RequestBody {
    post_id: number;
    url: string;
}

const updateDB = (mediaData: MediaData, id: number) => new Promise((resolve, reject) => {
    const updateCallback = (data: MediaData) => {
        db.query('update `cnews`.`reddit_post` set data = ? where id = ?', [JSON.stringify(data), id], (error, result) => {
            if (error) {
                logger.error(error);
                return reject(error)
            }
            logger.info('数据库更新成功');
            return resolve(mediaData);
        });
    }

    db.query('select `data`, `id` from `cnews`.`reddit_post` where id = ?', [id], (error, result) => {
        if (error) {
            logger.error(error);
            return reject(error)
        }

        const targetId = result?.[0]?.id;

        if (!targetId) {
            logger.error(`未查询到当前数据，对应 id：${id}` );
            return reject(`未查询到当前数据，对应 id：${id}`);
        }

        let data = result?.[0]?.data || '{}';
        data = JSON.parse(data);

        const newData = merge(data, mediaData);
        updateCallback(newData);
    });
});

class ParseController {
    async parse(ctx: RouterContext) {
        logger.info(`当前访问路径: ${ctx.path}`);

        try {
            const body = ctx.request.body as RequestBody;
            const mediaData = await extraMedia(body.url);

            if (typeof body.post_id === undefined) {
                logger.error(`提交参数错误， id 不合法: ${body.post_id}`)
                throw '提交参数错误：id 不合法'
            }

            if (!mediaData) {
                logger.error(`未解析到相关内容: ${body.url}`);
                throw `未解析到相关内容: ${body.url}`
            }

            await updateDB(mediaData, body.post_id);

            ctx.type = 'application/json'
            ctx.body = JSON.stringify(mediaData);
            ctx.status = 200;
        } catch (e) {
            console.error(`捕获到错误：${e}`);
            ctx.body = JSON.stringify(e);
            ctx.status = 500
        }
    }
}

export default new ParseController;
