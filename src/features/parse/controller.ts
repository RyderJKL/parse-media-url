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
            logger.info('sql updated successed');
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
            logger.error(`the current data not queried in database，target id：${id}` );
            return reject(`the current data not queried in database，target id：${id}`);
        }

        let data = result?.[0]?.data || '{}';
        data = JSON.parse(data);

        const newData = merge(data, mediaData);
        updateCallback(newData);
    });
});

class ParseController {
    async parse(ctx: RouterContext) {
        logger.info(`access path: ${ctx.path}`);

        try {
            const body = ctx.request.body as RequestBody;
            const mediaData = await extraMedia(body.url);

            if (typeof body.post_id === undefined) {
                logger.error(`The data corresponding to the current id is not queried: ${body.post_id}`)
                throw `{The data corresponding to the current id is not queried: ${body.post_id}`
            }

            if (!mediaData) {
                logger.error(`Not related content parsed: ${body.url}`);
                throw `Not related content parsed: ${body.url}`
            }

            await updateDB(mediaData, body.post_id);

            ctx.type = 'application/json'
            ctx.body = JSON.stringify(mediaData);
            ctx.status = 200;
        } catch (e) {
            console.error(`Caught in error：${e}`);
            ctx.body = JSON.stringify(e);
            ctx.status = 500
        }
    }
}

export default new ParseController;
