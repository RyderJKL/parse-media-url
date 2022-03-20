import puppeteer, { Browser } from "puppeteer";
import { MediaData } from './type';

/**
 * 
 * @param browser 
 * @param url 
 * @param evaluateCallback 
 * @returns MediaData
 */
async function parseUrl(browser: Browser, url: string, evaluateCallback: () => MediaData): Promise<MediaData> {
  const page = await getSinglePage(browser);
  await page.goto(url);
  // 确保页面加载完成
  await page.waitFor(1000 * 5);

  try {
     return await page.evaluate(evaluateCallback);
  } catch (error) {
    throw Error(JSON.stringify(error));
  }
}

async function getBrowser({ headless = true } = {}) {
  const browserInstance = await puppeteer.launch({
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

/**
 * 
 * @param targeURL 
 * @param evaluateCallback 
 * @returns 
 */
export async function launchMeidaCrawler<U extends string, T extends (...args: any[]) => MediaData>(targeURL: U, evaluateCallback: T): Promise<MediaData> {
  try {
    const browser = await getBrowser({ headless: false });
    return await parseUrl(browser, targeURL, evaluateCallback);
  } catch (error) { 
    throw Error(JSON.stringify(error));
  }
}