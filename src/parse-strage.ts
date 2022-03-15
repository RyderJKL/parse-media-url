import { mediaTypeArr  } from './type';
import * as urlParse from 'url-parse';

export const validteUrl = (url) => {
    const { host, href } = urlParse(url);

    if (!mediaTypeArr.some(item => item.includes(host))) {
        console.error('改下域名下的链接暂不支持，目前仅仅支持 medum/twritter/youtubu。')
        return;
    } 

    return href
};

export const parseUrl = (url: string) => validteUrl(url);