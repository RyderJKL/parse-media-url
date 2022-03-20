import { launchMeidaCrawler } from '../../crawler-engine';
import { MediaData, MediaType } from '../../type'
import urlParse from 'url-parse';

const parseUrl = (url: string): { type: MediaType.Medium | MediaType.Youtube | MediaType.Twritter; url: string } | undefined => {
    if (!url) return;

    try {
        const { host, href } = urlParse(url);
        const mediaTypeArr = Object.keys(MediaType).map((key) => MediaType[key as keyof typeof  MediaType]);

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

/**
 * 获取 medium 数据
 */
const getMediumContext = () => {
    const articleTitleSelec = '.pw-post-title';
    const voteCountSelec = '.pw-multi-vote-count';
    const pwResponsesCountSelec = '.pw-responses-count';

    return (((articleTitleSelec, voteCountSelec, pwResponsesCountSelec) => {
        const getEleText = (selector: string) => (document.querySelector(selector) as HTMLElement)?.innerText || '';
        const title = getEleText(articleTitleSelec);
        const voteCount = getEleText(voteCountSelec);
        const pwCount = getEleText(pwResponsesCountSelec);
        return {
            title, voteCount, pwCount
        }
    })(articleTitleSelec, voteCountSelec, pwResponsesCountSelec))
}

export const getMediaDataParse: Record<MediaType, () => any> = {
    [MediaType.Medium]: getMediumContext,
    [MediaType.Twritter]: () => undefined,
    [MediaType.Youtube]: () => undefined,
}

export const extraMedia = async (url: string): Promise<MediaData | undefined> => {
    try {
        const validateUrl = parseUrl(url);

        if (!validateUrl) return;

        return await launchMeidaCrawler(validateUrl.url, getMediaDataParse[validateUrl.type]);
    } catch (e) {
        console.log(e);
        throw e;
    }
}
