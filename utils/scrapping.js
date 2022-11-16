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
        const understandSelector = '#__next > div.sc-318d5b1d-0.bfzTId.appear > div.sc-b492d839-0.sc-7630ff66-3.dkezcQ.hMiWhv > div.sc-b492d839-1.sc-32d5f017-0.sc-7630ff66-2.DtkAv.fOPopv.dUKQkf > div > div > div.sc-b492d839-1.sc-32d5f017-0.gEMDyZ.jdlnRz > div > input';
        const importSelector = '#__next > div.sc-318d5b1d-0.bfzTId.appear > div.sc-b492d839-0.sc-7630ff66-3.dkezcQ.hMiWhv > div.sc-b492d839-1.sc-32d5f017-0.sc-7630ff66-2.DtkAv.fOPopv.dUKQkf > div > div > div.sc-b492d839-1.sc-32d5f017-0.gEMDyZ.jdlnRz > button';
        await page.waitForSelector(understandSelector);
        await page.waitForTimeout(500);
        await page.click(understandSelector);
        await page.waitForSelector(importSelector);
        await page.click(importSelector);  
        const inputSelector = '#swap-currency-input > div.sc-18ab1c73-3.gLZifk > label > div.sc-18ab1c73-2.kfJsyf > input';
        await page.waitForSelector(inputSelector);
        await page.type(inputSelector, amountIn.toString());
        const impactSelector = '#__next > div.sc-80277dc0-0.leLMTT.ggzm1z0._1nzuaz71yo._1nzuaz71zq > div.sc-b492d839-1.sc-80277dc0-4.ikybOA.dzJiXf > div > div > div.sc-b492d839-1.sc-32d5f017-0.gSuloB.ieaVLn > div.sc-b492d839-1.sc-32d5f017-0.gEMDyZ.jMqaHv > div > div > div > div > div.sc-ddb625d1-0.ikiZiJ > div > div > div:nth-child(2) > div:nth-child(2)';
        await page.waitForSelector(impactSelector);
        impactPercent = await page.evaluate(() => {
            return document.querySelector('#__next > div.sc-80277dc0-0.leLMTT.ggzm1z0._1nzuaz71yo._1nzuaz71zq > div.sc-b492d839-1.sc-80277dc0-4.ikybOA.dzJiXf > div > div > div.sc-b492d839-1.sc-32d5f017-0.gSuloB.ieaVLn > div.sc-b492d839-1.sc-32d5f017-0.gEMDyZ.jMqaHv > div > div > div > div > div.sc-ddb625d1-0.ikiZiJ > div > div > div:nth-child(2) > div:nth-child(2)').innerText;
        });
        const outputSelector = '#swap-currency-output > div.sc-18ab1c73-3.gLZifk > label > div.sc-18ab1c73-2.kfJsyf > input';
        await page.waitForSelector(outputSelector);
        amountOut = await page.evaluate(() => {
            return document.querySelector('#swap-currency-output > div.sc-18ab1c73-3.gLZifk > label > div.sc-18ab1c73-2.kfJsyf > input').value;
        });
        const outputMinSelector = '#__next > div.sc-80277dc0-0.leLMTT.ggzm1z0._1nzuaz71yo._1nzuaz71zq > div.sc-b492d839-1.sc-80277dc0-4.ikybOA.dzJiXf > div > div > div.sc-b492d839-1.sc-32d5f017-0.gSuloB.ieaVLn > div.sc-b492d839-1.sc-32d5f017-0.gEMDyZ.jMqaHv > div > div > div > div > div.sc-ddb625d1-0.ikiZiJ > div > div > div:nth-child(1) > div:nth-child(2) > div';
        await page.waitForSelector(outputMinSelector);
        amountOutMin = await page.evaluate(() => {
            return document.querySelector('#__next > div.sc-80277dc0-0.leLMTT.ggzm1z0._1nzuaz71yo._1nzuaz71zq > div.sc-b492d839-1.sc-80277dc0-4.ikybOA.dzJiXf > div > div > div.sc-b492d839-1.sc-32d5f017-0.gSuloB.ieaVLn > div.sc-b492d839-1.sc-32d5f017-0.gEMDyZ.jMqaHv > div > div > div > div > div.sc-ddb625d1-0.ikiZiJ > div > div > div:nth-child(1) > div:nth-child(2) > div').innerText;
        });
        impactPercent = impactPercent.substr(0, impactPercent.length-1);
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
