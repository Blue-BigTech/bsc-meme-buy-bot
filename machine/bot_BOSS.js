const fs = require('fs');
const Web3 = require('web3');
const {BN} = require('web3-utils');
const { scrapData } = require('../utils/scrapping');
const { getPrices } = require('../api/tokenPriceAPI');
const { startBot, test } = require('./bot.js')

const tokenAddr = '0x49324d59327fB799813B902dB55b2a118d601547';
const tokenAbi = JSON.parse(fs.readFileSync('abi/BOSS/abi.json','utf-8'));

// var coinSymbol = '';
// var coinAddr = '';
// var totalCoin = 0;
// var priceThreshold = 0;
// var slippageTolerance = 0;
// var taxFee = 0;
// var liquidityFee = 0;
// var maxTxAmount = 0;

const web3 = new Web3(RPC_URL);

const startBoss = async (params) => {
    await setMainParams(params);

    let inAddr = coinSymbol == 'BNB' ? 'BNB' : USDT_ADDR;
    let data = await scrapData(inAddr, tokenAddr, totalCoin);
    initPriceImpact = data.PriceImpact;
    initAmountOut = data.AmountOut;
    initAmountOutMin = data.amountOutMin;
    
    BOSS_DATA.taxFee = await getTaxFee();
    BOSS_DATA.liquidityFee = await getLiquidityFee();
    BOSS_DATA.maxTxAmount = await getMaxTaxAmount();
    printInitialData();
    console.log("After 10 sec bot will start running! You can stop it to press keyboard <Ctrl + C>");
    setTimeout(runMachine, 10000);
}

async function getTaxFee(){
    let tokenRouter = await new web3.eth.Contract( tokenAbi, tokenAddr );
    return await tokenRouter.methods._taxFee().call();
}

async function getLiquidityFee(){
    let tokenRouter = await new web3.eth.Contract( tokenAbi, tokenAddr );
    return await tokenRouter.methods._liquidityFee().call();
}

async function getMaxTaxAmount(){
    let tokenRouter = await new web3.eth.Contract( tokenAbi, tokenAddr );
    return await tokenRouter.methods._maxTxAmount().call();
}

const setMainParams = async (params) => {
    coinSymbol = params.coinSymbol;
    coinAddr = coinSymbol == 'BNB' ? BNB_ADDR : USDT_ADDR;
    totalUSD = params.totalUSD;
    USDPerTx = params.USDPerTx;
    priceThreshold = params.priceThreshold;
    let data = await getPrices(tokenAddr);
    if(priceThreshold == 0){
        priceThreshold = coinSymbol == 'BNB' ? data.INBNB : data.INUSD;
    }
    BNBPrice = parseFloat(data.BNB).toFixed(3);
    slippageTolerance = params.slippage;
}

const printInitialData = () => {
    console.log("*****************************************************************************");
    console.log(`BNB : ${BNBPrice} USD`);
    console.log(`${coinSymbol} -> BOSS`);
    console.log(`${coinSymbol} : ${coinAddr}`);
    console.log(`BOSS : ${tokenAddr}`);
    console.log(`TotalAmount : ${totalUSD / BNBPrice} ${coinSymbol}`);
    console.log(`AmountPerTx : ${USDPerTx / BNBPrice} ${coinSymbol}`);
    console.log(`BOSS Price Threshold : ${priceThreshold} ${coinSymbol}`);
    console.log(`Price Impact : ${initPriceImpact}%`);
    console.log(`Slippage Tolerance : ${slippageTolerance}%`);
    console.log(`Max Amount of BOSS(Pancake) : ${initAmountOut}`);
    console.log(`Min Amount of BOSS(Pancake) : ${initAmountOutMin}`);
    console.log(`BOSS TaxFee : ${BOSS_DATA.taxFee}%`);
    console.log(`BOSS LiquidityFee : ${BOSS_DATA.liquidityFee}%`);
    console.log(`BOSS MaxTxAmount : ${BOSS_DATA.maxTxAmount}`);
    console.log("*****************************************************************************");
}

const runMachine = () => {
    console.log("start++++++++++");
    startBot(BNB, BOSS, tokenAddr);
}

module.exports = {
    startBoss
}