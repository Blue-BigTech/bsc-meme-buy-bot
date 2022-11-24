const fs = require('fs');
const Web3 = require('web3');
const {BN} = require('web3-utils');
const { scrapData } = require('../utils/scrapping');
const { getPrices } = require('../api/tokenPriceAPI');
const { startBot, test } = require('./bot.js');
const { Socket } = require('socket.io');

const tokenAddr = BOSS_DATA.address;
const tokenAbi = JSON.parse(fs.readFileSync('abi/BOSS/abi.json','utf-8'));
const web3 = new Web3(RPC_URL);

const startBoss = async (params) => {
    await setMainParams(params);

    let inAddr = coinSymbol == 'BNB' ? 'BNB' : USDT_ADDR;
    let data = await scrapData(inAddr, tokenAddr, parseFloat(totalUSD/BNBPrice).toFixed(3));
    initPriceImpact = data.PriceImpact;
    initAmountOut = data.AmountOut;
    initAmountOutMin = data.amountOutMin;
    
    BOSS_DATA.taxFee = await getTaxFee();
    BOSS_DATA.liquidityFee = await getLiquidityFee();
    BOSS_DATA.maxTxAmount = await getMaxTaxAmount();
    printInitialData();
    SocketIO.emit('bot-ready', null);
    setTimeout(runMachine, 500);
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
        priceThreshold = data.INUSD;
    }
    BNBPrice = parseFloat(data.BNB).toFixed(3);
    slippageTolerance = params.slippage;
    ElapsedTime = params.timeStep;
}

const printInitialData = () => {
    console.log("*****************************************************************************");
    console.log(`BNB : ${BNBPrice} USD`);
    console.log(`${coinSymbol} -> BOSS`);
    console.log(`${coinSymbol} : ${coinAddr}`);
    console.log(`BOSS : ${tokenAddr}`);
    console.log(`TotalAmount : ${totalUSD / BNBPrice} ${coinSymbol}`);
    console.log(`AmountPerTx : ${USDPerTx / BNBPrice} ${coinSymbol}`);
    console.log(`SecondsPerTx : ${ElapsedTime}s`);
    console.log(`BOSS Price Threshold : ${priceThreshold} USD`);
    // console.log(`Price Impact : ${initPriceImpact} %`);
    console.log(`Slippage Tolerance : ${slippageTolerance}%`);
    console.log(`Max Amount of BOSS(Pancake) : ${initAmountOut}`);
    console.log(`Min Amount of BOSS(Pancake) : ${initAmountOutMin}`);
    console.log(`BOSS TaxFee : ${BOSS_DATA.taxFee}%`);
    console.log(`BOSS LiquidityFee : ${BOSS_DATA.liquidityFee}%`);
    console.log(`BOSS MaxTxAmount : ${BOSS_DATA.maxTxAmount}`);
    console.log("*****************************************************************************");
}

const runMachine = () => {
    console.log("BOT START!");
    startBot(BNB, BOSS, tokenAddr);
}

const getTokenInfo = async () => {
    let data = await getPrices(tokenAddr);
    return {
        address : tokenAddr,
        decimals : 9,
        price : data.INUSD,
        bnb : data.BNB
    }
}

module.exports = {
    startBoss,
    getTokenInfo
}