import { getPageFromUrl } from '../crawler-strage/getPageFromUrl';
import { MediaData, MediaType } from '../type'
import {parseUrl, getMediumContext, getTwitterContext, getYoutubeContext} from './utils';
import { Page } from 'puppeteer';

export const getMediaDataParse: Record<MediaType, (page: Page) => Promise<MediaData|undefined>> = {
    [MediaType.Medium]: getMediumContext,
    [MediaType.Twitter]: getTwitterContext,
    [MediaType.Youtube]: getYoutubeContext,
}

export const extraMedia = async (url: string): Promise<MediaData | undefined> => {
    try {
        const validateUrl = parseUrl(url);

        if (!validateUrl) return;

        const page = await getPageFromUrl(validateUrl.url);
        console.log(validateUrl);
        return getMediaDataParse[validateUrl.type](page)
    } catch (e) {
        console.log(e);
        throw e;
    }
}
