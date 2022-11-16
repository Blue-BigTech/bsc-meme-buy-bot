const { scrapData } = require('../utils/scrapping');
const { getPrices } = require('../api/tokenPriceAPI');
const tokenAddr = '0x49324d59327fB799813B902dB55b2a118d601547';

var coinSymbol = '';
var coinAddr = '';
var totalCoin = 0;
var priceThreshold = 0;

var initPriceImpact = 0;
var initAmountOut = 0;
var initAmountOutMin = 0;

const startBoss = async (params) => {
    await setMainParams(params);

    let inAddr = coinSymbol == 'BNB' ? 'BNB' : USDT_ADDR;
    let data = await scrapData(inAddr, tokenAddr, totalCoin);
    // console.log(data);
    initPriceImpact = data.PriceImpact;
    initAmountOut = data.AmountOut;
    initAmountOutMin = data.amountOutMin;

    printInitialData();
}

const setMainParams = async (params) => {
    coinSymbol = params.coinSymbol;
    coinAddr = coinSymbol == 'BNB' ? BNB_ADDR : USDT_ADDR;
    totalCoin = params.totalCoin;
    priceThreshold = params.priceThreshold;
    if(priceThreshold == 0){
        let data = await getPrices(tokenAddr);
        // console.log(data);
        priceThreshold = coinSymbol == 'BNB' ? data.INBNB : data.INUSD;
    }
}

const printInitialData = () => {
    console.log(`${coinSymbol} -> BOSS`);
    console.log(`${coinSymbol} : ${coinAddr}`);
    console.log(`BOSS : ${tokenAddr}`);
    console.log(`TotalAmount : ${totalCoin} ${coinSymbol}`);
    console.log(`BOSS Price Threshold : ${priceThreshold} ${coinSymbol}`);
    console.log(`Price Impact : ${initPriceImpact}%`);
    console.log(`Max Amount of BOSS(Pancake) : ${initAmountOut}`);
    console.log(`Min Amount of BOSS(Pancake) : ${initAmountOutMin}`);
}
module.exports = {
    startBoss
}