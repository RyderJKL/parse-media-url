import puppeteer, { Browser, Page } from "puppeteer";
import { isProdEnv } from '../utils';

/**
 *
 * @param browser
 * @param url
 * @param evaluateCallback
 * @returns MediaData
 */
async function getPage(browser: Browser, url: string) {
  const page = await browser.newPage();

  await page.setViewport({
    width: 2000,
    height: 2000,
  });

  try {
    await page.goto(url);

    // 确保页面加载完成
    await page.waitFor(1000 * 3);

    return page;
  } catch {
    console.error('打开页面失败，当前页面路径：', url);
    throw '打开页面失败'
  }
}

let browserInstance: Browser;

async function getBrowser({ headless = true } = {}) {
  if (browserInstance) return browserInstance;

  browserInstance = await puppeteer.launch({
    headless,
    devtools: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
    //   "--proxy-server=socks5://127.0.0.1:9050",
    ],
  });

  return browserInstance;
}

/**
 *
 * @param targeURL
 * @param evaluateCallback
 * @returns
 */
export async function getPageFromUrl(targetURL: string) {
  try {
    const headless = isProdEnv;
    const browser = await getBrowser({ headless });
    return await getPage(browser, targetURL);
  } catch (error) {
    throw JSON.stringify(error);
  }
}
