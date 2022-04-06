import puppeteer, {Browser} from "puppeteer";
import logger from "../logger";

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
}

let browserInstance: Browser;

async function getBrowser({headless = true} = {}) {
    try {
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
    } catch (e) {
        logger.error(e);
        throw e;
    }
}

/**
 *
 * @param targeURL
 * @param evaluateCallback
 * @returns
 */
export async function getPageFromUrl() {
    try {
        const browser = await getBrowser({headless: true});
        return await getPage(browser);
    } catch (error) {
        logger.error(error);
        throw error;
    }
}
