import urlParse from 'url-parse';
import {Page} from 'puppeteer';
import * as R from 'ramda';

import {getPageFromUrl} from '../../crawler/getPageFromUrl';
import {MediaData, MediaType} from '../../type'
import logger from "../../logger";

export const extraMedia = async (url: string): Promise<MediaData | undefined> => {
    try {
        const validateUrl = parseUrl(url);
        console.log(validateUrl, 'validateUrl');

        if (!validateUrl) {
            logger.error(`parsing request parameters error: ${validateUrl}`)
            return;
        }

        const page = await getPageFromUrl();
        return await getMediaDataParse[validateUrl.type](page, validateUrl.url)
    } catch (e) {
        logger.error(e);
        throw e;
    }
}

export const parseUrl = (url: string): { type: MediaType.Medium | MediaType.Youtube | MediaType.Twitter; url: string } | undefined => {
    if (!url) return;

    const {host, href} = urlParse(url);
    const mediaTypeArr = Object.keys(MediaType).map((key) => MediaType[key as keyof typeof MediaType]);

    const mediaType = mediaTypeArr.find((item) => new RegExp(`${item}$`).test(host));

    if (!mediaType) {
        logger.error(`only twitter/medium/youtube platforms are supported`)
        throw 'only twitter/medium/youtube platforms are supported';
    }

    return {
        url: href,
        type: mediaType
    }
}

export const getMediumContext = async (page: Page, url: string) => {
    const titleSel = '.pw-post-title';
    const paragraphImageSel = '.paragraph-image img'
    const previewSel = '.pw-post-body-paragraph';
    console.log('getMediumContext, doing....');

    try {
        await page.goto(url);
        await page.waitFor(3000);

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

export const getYoutubeContext = async (page: Page, url: string) => {
    const titleSel = '#container > h1';
    const previewSel = '#description > yt-formatted-string > span:nth-child(1)';

    try {
        await page.goto(url);
        await page.waitFor(3000);

        const { query } = urlParse(url) as unknown as  {query: { v: string }};
        const img = `https://img.youtube.com/vi/${query?.v || ''}/mqdefault.jpg`

        const result = await page.evaluate((titleSel, previewSel) => {
            const title = (document.querySelector(titleSel) as unknown as HTMLElement)?.innerText || '';
            const preview = (document.querySelector(previewSel) as unknown as HTMLElement)?.innerText || '';

            return {
                title, preview
            }
        }, titleSel, previewSel);

        return { ...result, img }
    } catch (e) {
        console.error(e);
        throw `Error At getYoutubeContext :${e}`
    }
}

const twitterResultPath = [
    'threaded_conversation_with_injections_v2',
    'instructions',
    0,
    'entries',
    0,
    'content',
    'itemContent',
    'tweet_results',
    'result',
];

const twitterResultLegacyPath = [
    ...twitterResultPath,
    'legacy'
];

const twitterResultLegacyProperties = [
    'full_text',
    'favorite_count',
    'quote_count',
    'reply_count',
    'retweet_count'
];

const twitterResultUserPath = [
    ...twitterResultPath,
    'core',
    'user_results',
    'result',
    'legacy'
];

const twitterResultUserProperties = [
    'name',
    'screen_name',
    'profile_image_url_https'
]

export interface TwitterResultUserProperties {
    name: string;
    screen_name: string;
    profile_image_url_https: string;
}

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

const convertToMediaData = (obj: Partial<TwitterLegacyProperties & TwitterResultUserProperties>): TwitterMedia => {
    console.log(obj, 'obj');

    return {
        title: obj.full_text,
        img: '',
        preview: obj.full_text,
        twitter_avatar: obj.profile_image_url_https,
        twitter_name: obj.name,
        likes: Number(obj.favorite_count),
        retweets: Number(obj.retweet_count),
        quote_tweets: Number(obj.quote_count),
        twitter_handle: obj.screen_name
    }
}
export const getTwitterContext = async (page: Page, url: string): Promise<MediaData> => await new Promise((resolve, reject) => {
    logger.info('getTwitterContext')

    try {
        page.on(('response'), async (res) => {
            if (res.url().includes('/i/api/graphql/') && res.url().includes('TweetDetail')) {
                const result = await res.json();
                if (!result) {
                    logger.error('no twitter content retrieved');
                    return;
                }

                logger.info('get twitter contetn data', JSON.stringify(result));
                console.log(JSON.stringify(result));
                const getContentPropPath = (prop: string) => R.path([...twitterResultLegacyPath, prop]);
                const obj: Partial<TwitterLegacyProperties & TwitterResultUserProperties> = {};
                twitterResultLegacyProperties.forEach(prop => {
                    obj[prop as keyof TwitterLegacyProperties] = getContentPropPath(prop)(result.data ?? {}) as unknown as string
                });

                const getUserPropPath = (prop: string) => R.path([...twitterResultUserPath, prop]);
                twitterResultUserProperties.forEach(prop => {
                    obj[prop as keyof TwitterResultUserProperties] = getUserPropPath(prop)(result.data ?? {}) as unknown as string
                });

                const formattedObj = convertToMediaData(obj);
                console.log(formattedObj, 'formattedObj');

                return resolve(formattedObj);
            }
        });

        page.goto(url);
    } catch (e) {
        console.error('getTwitterContext error', e);
        reject(e);
    }
})

export const getMediaDataParse: Record<MediaType, (page: Page, url: string) => Promise<MediaData | undefined>> = {
    [MediaType.Medium]: getMediumContext,
    [MediaType.Twitter]: getTwitterContext,
    [MediaType.Youtube]: getYoutubeContext,
}
