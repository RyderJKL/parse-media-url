
import { RouterContext } from '@koa/router';
import { extraMedia } from './strage';

export interface RequestBody {
    id: string;
    url: string;
}

export const controller = async (ctx: RouterContext) => {
    try {
        const body = ctx.request.body as RequestBody;
        const mediaData = await extraMedia(body.url);
        console.log(mediaData, 'get mediaData at controller');
        ctx.body = mediaData
    } catch (e) {
        console.log(e, 'eee');
        ctx.body = JSON.stringify(e);
    }
}
