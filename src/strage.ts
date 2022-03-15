import { launchMeidaCrawler } from './crawler-engine';
import {  parseUrl } from './parse-strage';
import { MediaData, MediaType, mediaTypeArr } from './type'

export const extraMedia = (url: string) => {
    const validteUrl = parseUrl(url);
    if (!validteUrl) return;
    const mediaData = launchMeidaCrawler(url, () => {});
}