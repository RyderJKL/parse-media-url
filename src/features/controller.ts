import { RouterContext } from '@koa/router';
import { extraMedia } from './strage';
import db from '../db'

export interface RequestBody {
    post_id: string;
    url: string;
}

export const controller = async (ctx: RouterContext) => {
    try {
        const body = ctx.request.body as RequestBody;
        const mediaData = await extraMedia(body.url);
        console.log(body);

        if (typeof body.post_id === undefined) {
            throw '提交参数错误：id 不合法'
        }

        console.log(mediaData, 'get mediaData at controller');
        db.query('update `cnews`.`reddit_post` set data = ? where id = ?', [JSON.stringify(mediaData), body.post_id], (error, result) => {
            if (error) {
                console.log(error);
                ctx.response.status = 400
                return
            }
            ctx.body = mediaData
        });
    } catch (e) {
        ctx.body = JSON.stringify(e);
    }
}
