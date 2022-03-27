import urlParse from 'url-parse';
import {MediaType} from '../type'
import {Page} from 'puppeteer';

const getEle = (selector: string) => (document.querySelectorAll(selector));
const getEleText = (selector: string) => (getEle(selector)[0] as unknown as HTMLElement).innerText || '';
const getEleImgSrc = (selector: string) => (getEle(selector)[0] as unknown as HTMLImageElement).src || ''

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
    // const voteCountSelec = '.pw-multi-vote-count';
    // const pwResponsesCountSelec = '.pw-responses-count';

    const callback = () => (((titleSel, paragraphImageSel) => {
        const title = getEleText(titleSel);
        const img = getEleImgSrc(paragraphImageSel);
        const preview = Array.from(getEle(previewSel)).slice(0, 2).map(node => (node as HTMLElement).innerText).join('\n');
        return {
            title, img, preview
        }
    })(titleSel, paragraphImageSel))

    try {
        return await page.evaluate(callback);
    } catch (e) {
        console.error('getMediumContext error');
    }
}

export const getYoutubeContext = async (page: Page) => {
    const titleSel = '#container > h1';
    // const paragraphImageSel = '#description > yt-formatted-string > span:nth-child(1)'
    const previewSel = '#description > yt-formatted-string > span:nth-child(1)';

    // try {
    const callback = () => (((titleSel, previewSel) => {
        const title = (document.querySelector(titleSel) as unknown as HTMLElement).innerText || '';
        // const img = getEleImgSrc(paragraphImageSel);
        const preview = (document.querySelector(previewSel) as unknown as HTMLElement).innerText || '';

        return {
            title, preview
        }
    })(titleSel, previewSel))

    try {
        return await page.evaluate(callback);
    } catch (e) {
        console.error(e);
        throw 'getYoutubeContext error'
    }
}

export const getTwitterContext = async (page: Page) => {
    try {
        await page.setRequestInterception(true);
        await page.on('request', (req) =>
            req.continue()
        )

        const getResponseBody = () => new Promise((resolve, reject) => {
            page.on(('response'), async (res) => {
                if (res.url().includes('/i/api/graphql/') && res.url().includes('TweetDetail')) {
                    resolve(await res.json());
                }
            });

        });

        const result = await getResponseBody();
        console.log(result, 'result');
        return Promise.resolve({ title: 'jack '});
    } catch (e) {
        console.error('getTwitterContext error', e);
    }
}
