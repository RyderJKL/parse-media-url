import puppeteer, { Browser } from "puppeteer";
import { MediaData } from './type';


/**
 * @param { } page
 * @return {*} { nickname, feedItems }
 */
async function parseUrl(browser: Browser, url: string) {
  const page = await getSinglePage(browser);
  await page.goto(url);

  // 确保页面加载完成
  await page.waitFor(1000 * 5);

  const articleTitleSelec = '.pw-post-title';
  const voteCountSelec = '.pw-multi-vote-count';
  const pwResponsesCountSelec = '.pw-responses-count';

  const evaluateFunc = () => {

  }; 

  try {
     const mediaData: MediaData =  await page.evaluate(
      (articleTitleSelec, voteCountSelec, pwResponsesCountSelec) => {
        const getEleText = (selector: string) => (document.querySelector(selector) as HTMLElement)?.innerText || '';
        const title = getEleText(articleTitleSelec); 
        const voteCount = getEleText(voteCountSelec);
        const pwCount = getEleText(pwResponsesCountSelec);
        console.log(title, voteCount, pwCount);
        return {
            title, voteCount, pwCount
        }
      },
        articleTitleSelec,
        voteCountSelec,
        pwResponsesCountSelec,
    );

    return mediaData;
  } catch (error) {
    throw Error(error);
  }
}

async function getBrowser({ headless = true } = {}) {
  let browserInstance = await puppeteer.launch({
    headless,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
    //   "--proxy-server=socks5://127.0.0.1:9050",
    ],
  });
  return browserInstance;
}

// 创建 page 单例
// let pageInstance = null
async function getSinglePage(browser: Browser) {
  let pageInstance = null;
  pageInstance = await browser.newPage();
  await pageInstance.setViewport({
    width: 800,
    height: 800,
  });
  return pageInstance;
}

export async function launchMeidaCrawler(targeURL: string): Promise<MediaData> {
  try {
    const browser = await getBrowser({ headless: false });
    const result = await parseUrl(browser, targeURL, );
    console.log(result, 'result');
    return result;
  } catch (error) { 
    throw Error(error);
  }
}

