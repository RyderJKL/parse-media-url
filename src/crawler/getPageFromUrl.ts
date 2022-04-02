import puppeteer, {Browser, Page} from "puppeteer";
import {isProdEnv} from '../utils';

/**
 *
 * @param browser
 * @param url
 * @param evaluateCallback
 * @returns MediaData
 */
async function getPage(browser: Browser) {
    const page = await browser.newPage();

    await page.setViewport({
        width: 2000,
        height: 2000,
    });

    return page;
    // try {
    //     page.on("response", async response => {
    //         const url = response.url();
    //         if (url.match(".*/graphql/.*")) {
    //             console.log(url);
    //             const body = await response.text();
    //             if (body) {
    //                 try {
    //                     const json = JSON.parse(body);
    //                     // if (json.data && json.data.user && json.data.user.legacy) {
    //                     //     console.log(JSON.stringify(json.data.user.legacy, null, 4));
    //                     // }
    //                 } catch (e) {
    //                 }
    //             }
    //         }
    //     });
    //     // await page.goto(url);
    //     // 确保页面加载完成
    //     // await page.waitFor(1000 * 3);
    //     return page;
    // } catch {
    // throw '打开页面失败'
    // }
}

let browserInstance: Browser;

async function getBrowser({headless = true} = {}) {
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
export async function getPageFromUrl() {
    try {
        const headless = true;
        const browser = await getBrowser({headless});
        return await getPage(browser);
    } catch (error) {
        throw JSON.stringify(error);
    }
}
