import urlParse from 'url-parse';
import {Page} from 'puppeteer';
import * as R from 'ramda';

import {getPageFromUrl} from '../../crawler/getPageFromUrl';
import {MediaData, MediaType} from '../../type'

export const extraMedia = async (url: string): Promise<MediaData | undefined> => {
    try {
        const validateUrl = parseUrl(url);

        if (!validateUrl) return;

        const page = await getPageFromUrl(validateUrl.url);
        return getMediaDataParse[validateUrl.type](page)
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export const parseUrl = (url: string): { type: MediaType.Medium | MediaType.Youtube | MediaType.Twitter; url: string } | undefined => {
    if (!url) return;

    try {
        const {host, href} = urlParse(url);
        const mediaTypeArr = Object.keys(MediaType).map((key) => MediaType[key as keyof typeof MediaType]);

        const mediaType = mediaTypeArr.find((item) => new RegExp(`${item}$`).test(host));

        if (!mediaType) {
            throw '目前只支持 twitter/medium/youtube 三个平台';
        }

        return {
            url: href,
            type: mediaType
        }
    } catch (e) {
        throw `${e}`;
    }
}

export const getMediumContext = async (page: Page) => {
    const titleSel = '.pw-post-title';
    const paragraphImageSel = '.paragraph-image img'
    const previewSel = '.pw-post-body-paragraph';

    try {
        return await page.evaluate((titleSel, paragraphImageSel, previewSel) => {
            const title = document.querySelector(titleSel)?.innerText || '';
            const img = document.querySelector(paragraphImageSel)?.src || '';
            const preview = Array(document.querySelector(previewSel)).slice(0, 2).map(node => (node as HTMLElement).innerText).join('\n');
            return {
                title, img, preview
            }
        }, titleSel, paragraphImageSel, previewSel)
    } catch (e) {
        console.error('Error at getMediumContext:', e);
        throw `Error At getMediumContext :${e}`
    }
}

export const getYoutubeContext = async (page: Page) => {
    const titleSel = '#container > h1';
    const previewSel = '#description > yt-formatted-string > span:nth-child(1)';

    try {
        return await page.evaluate((titleSel, previewSel) => {
            const title = (document.querySelector(titleSel) as unknown as HTMLElement)?.innerText || '';
            const preview = (document.querySelector(previewSel) as unknown as HTMLElement)?.innerText || '';

            return {
                title, preview
            }

        }, titleSel, previewSel);
    } catch (e) {
        console.error(e);
        throw `Error At getYoutubeContext :${e}`
    }
}

const twitterResultPath = [
    'threaded_conversation_with_injections',
    'instructions',
    0,
    'entries',
    0,
    'content',
    'itemContent',
    'tweet_results',
    'result',
    'legacy'
];

const twitterLegacyProperties = [
    'full_text',
    'favorite_count',
    'quote_count',
    'reply_count',
    'retweet_count'
];

export interface TwitterLegacyProperties {
    full_text: string,
    favorite_count: string,
    quote_count: string,
    reply_count: string,
    retweet_count: string
}

export interface TwitterMedia extends MediaData {
    twitter_avatar?: string;
    twitter_name?: string;
    twitter_handle?: string;
    likes?: number;
    retweets?: number;
    quote_tweets?: number;
}

const convertTwitterLegacyPropertiesToMediaData = (obj: Partial<TwitterLegacyProperties>): TwitterMedia => {
    return {
        title: obj.full_text,
        img: '',
        preview: '',
        twitter_avatar: '',
        twitter_name: '',
        likes: Number(obj.favorite_count),
        retweets: Number(obj.retweet_count),
        quote_tweets: Number(obj.quote_count),
        twitter_handle: ''
    }
}
export const getTwitterContext = async (page: Page) => {
    try {
        await page.setRequestInterception(true);
        console.log('getTwitterContext')

        await page.on('request', (req) =>
            req.continue()
        )

        const getResponseBody = (): Promise<{ data: any }> => new Promise((resolve) => {
            page.on(('response'), async (res) => {
                try {
                    if (res.url().includes('/i/api/graphql/') && res.url().includes('TweetDetail')) {
                        const data = await res.json();
                        resolve(data);
                    }
                } catch (e) {
                    console.error('get twitter response body error', e);
                }
            });
        });

        const result = await getResponseBody();
        if (!result) return;

        const getTwitterPropPath = (prop: string) => R.path([...twitterResultPath, prop]);
        const obj: Partial<TwitterLegacyProperties> = {};
        twitterLegacyProperties.forEach(prop => {
            obj[prop as keyof TwitterLegacyProperties] = getTwitterPropPath(prop)(result.data ?? {}) as unknown as string
        });

        const formattedObj = convertTwitterLegacyPropertiesToMediaData(obj);
        console.log(formattedObj)

        return Promise.resolve(formattedObj);
    } catch (e) {
        console.error('getTwitterContext error', e);
    }
}

export const getMediaDataParse: Record<MediaType, (page: Page) => Promise<MediaData | undefined>> = {
    [MediaType.Medium]: getMediumContext,
    [MediaType.Twitter]: getTwitterContext,
    [MediaType.Youtube]: getYoutubeContext,
}
