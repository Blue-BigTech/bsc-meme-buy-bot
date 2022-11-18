const puppeteer = require('puppeteer');
const scrapData = async (tokenIn, tokenOut, amountIn) => {
    const browser = await puppeteer.launch({
        // executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        // headless: false    
    });
    let page = await browser.newPage();
    let url = `https://pancakeswap.finance/swap?chainId=56&inputCurrency=${tokenIn}&outputCurrency=${tokenOut}`;
    // console.log(url);
    let impactPercent="", amountOut="", amountOutMin="";
    try{
        await page.goto(url, {
            waitUntil: 'load',
        });
        const understandSelector = '//*[@id="__next"]/div[1]/div[2]/div[2]/div/div/div[3]/div/input';
        const importSelector = '//*[@id="__next"]/div[1]/div[2]/div[2]/div/div/div[3]/button';
        let elHandle = await page.waitForXPath(understandSelector);
        await page.waitForTimeout(500);
        await elHandle.click();
        elHandle = await page.waitForXPath(importSelector);
        await elHandle.click();

        const inputSelector = '//*[@id="swap-currency-input"]/div[2]/label/div[1]/input';
        await page.waitForXPath(inputSelector);
        elHandle = await page.$x(inputSelector);
        await elHandle[0].type(amountIn.toString());
        await page.waitForTimeout(500);

        const impactSelector = '//*[@id="__next"]/div[1]/div[3]/div/div/div[1]/div[2]/div/div/div/div/div[4]/div/div/div[2]/div[2]';
        await page.waitForXPath(impactSelector);
        elHandle = await page.$x(impactSelector);
        impactPercent = await page.evaluate(el => el.innerHTML, elHandle[0]);

        const outputSelector = '//*[@id="swap-currency-output"]/div[2]/label/div[1]/input';
        elHandle = await page.waitForXPath(outputSelector);
        amountOut = await (await elHandle.getProperty('value')).toString();

        const outMinSelector = '//*[@id="__next"]/div[1]/div[3]/div/div/div[1]/div[2]/div/div/div/div/div[4]/div/div/div[1]/div[2]/div';
        await page.waitForXPath(outMinSelector);
        elHandle = await page.$x(outMinSelector);
        amountOutMin = await page.evaluate(el => el.innerHTML, elHandle[0])

        amountOut = amountOut.substr((amountOut.indexOf(':')+1));
        impactPercent = impactPercent.substr(0, impactPercent.length-1);
        if(impactPercent.indexOf('&lt;') == 0) impactPercent = impactPercent.substr(4);
        amountOutMin = amountOutMin.substr(0, amountOutMin.indexOf(' '));
    }catch(e){
        console.log(e);
    }
    await browser.close();
    return {
        PriceImpact     : impactPercent,
        AmountOut       : amountOut,
        amountOutMin    : amountOutMin
    }
}

module.exports = {
    scrapData
}
