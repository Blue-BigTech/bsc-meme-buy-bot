const fs = require('fs')
const Web3 = require('web3');
const {BN} = require('web3-utils');
const { setDecimals, addDecimals } = require('../utils/utils');
let pancakeSwapAbi = JSON.parse(fs.readFileSync('abi/pancakeswap.json','utf-8'));
let tokenAbi = JSON.parse(fs.readFileSync('abi/erc20.json','utf-8'));

const web3 = new Web3(RPC_URL);

async function balanceOf(tokenAddr, ownerAddr) {
    let tokenRouter = await new web3.eth.Contract( tokenAbi, tokenAddr );
    let balance = await tokenRouter.methods.balanceOf(ownerAddr).call();
    console.log(balance);
    return balance;
}

async function ethBalanceOf(ownerAddr){
    let balanceWei = await web3.eth.getBalance(ownerAddr); //Will give value in.
    let balanceEth = Web3.utils.fromWei(balanceWei, 'ether');
    return {
        wei : balanceWei,
        eth : balanceEth
    }
}

async function calcSell( tokensToSell, tokenAddr){
    let tokenRouter = await new web3.eth.Contract( tokenAbi, tokenAddr );
    let tokenDecimals = await tokenRouter.methods.decimals().call();
    
    tokensToSell = setDecimals(tokensToSell, tokenDecimals);
    let amountOut;
    try {
        let router = await new web3.eth.Contract( pancakeSwapAbi, PANCKAE_ADDR );
        amountOut = await router.methods.getAmountsOut(tokensToSell, [tokenAddr ,BNB_ADDR]).call();
        amountOut =  web3.utils.fromWei(amountOut[1]);
    } catch (error) {}
    
    if(!amountOut) return 0;
    return amountOut;
}

async function calcBNBPrice(){
    let bnbToSell = web3.utils.toWei("1", "ether") ;
    let amountOut;
    try {
        let router = await new web3.eth.Contract( pancakeSwapAbi, PANCKAE_ADDR );
        amountOut = await router.methods.getAmountsOut(bnbToSell, [BNB_ADDR ,USDT_ADDR]).call();
        amountOut =  web3.utils.fromWei(amountOut[1]);
    } catch (error) {}
    if(!amountOut) return 0;
    return amountOut;
}

async function getDecimals( tokenAddress ){
    let tokenRouter = await new web3.eth.Contract( tokenAbi, tokenAddress );
    return await tokenRouter.methods.decimals().call();
}

async function amountByBNB( BNBToSell, tokenAddress ){
    let tokenDecimals = await getDecimals(tokenAddress);
    BNBToSell = setDecimals(BNBToSell, 18);

    let amountOut;
    try {
        let router = await new web3.eth.Contract( pancakeSwapAbi, PANCKAE_ADDR );
        amountOut = await router.methods.getAmountsOut(BNBToSell, [BNB_ADDR, tokenAddress]).call();
        amountOut = addDecimals(amountOut[1], tokenDecimals);
    } catch (error) {}
    
    if(!amountOut) return 0;
    return amountOut;
}

async function amountByUSDT( USDToSell, tokenAddress ){
    let tokenDecimals = await getDecimals(tokenAddress);
    USDToSell = setDecimals(USDToSell, 18);

    let amountOut;
    try {
        let router = await new web3.eth.Contract( pancakeSwapAbi, PANCKAE_ADDR );
        amountOut = await router.methods.getAmountsOut(USDToSell, [USDT_ADDR, tokenAddress]).call();
        amountOut = addDecimals(amountOut[1], tokenDecimals);
    } catch (error) {}
    
    if(!amountOut) return 0;
    return amountOut;
    // USDToSell = web3.utils.toWei((USDToSell * (1 - USDTBNBFEE)).toString(), "ether") ;
    // let amountOut;
    // try {
    //     let router = await new web3.eth.Contract( pancakeSwapAbi, PANCKAE_ADDR );
    //     amountOut = await router.methods.getAmountsOut(USDToSell, [USDT_ADDR, BNB_ADDR]).call();
    //     amountOut =  web3.utils.fromWei(amountOut[1]);
    // } catch (error) {}
    // if(!amountOut) return 0;
    // amountOut = (parseFloat(amountOut)).toFixed(7);
    // return await amountByBNB(amountOut, tokenAddress);
}

const getPrices = async function(tokenAddress){
    let timeElapsed = (new Date()).getTime();
    let bnbPrice = await calcBNBPrice() // query pancakeswap to get the price of BNB in USDT
    // Them amount of tokens to sell. adjust this value based on you need, you can encounter errors with high supply tokens when this value is 1.
    let tokens_to_sell = 1; 
    let priceInBnb = await calcSell(tokens_to_sell, tokenAddress)/tokens_to_sell; // calculate TOKEN price in BNB
    timeElapsed = ((new Date()).getTime() - timeElapsed)/1000;
    return {
        BNB     : bnbPrice*1,
        INBNB   : priceInBnb,
        INUSD   : priceInBnb*bnbPrice,
        TIME    : timeElapsed
    }
}

module.exports = { 
    getPrices,
    calcBNBPrice,
    getDecimals,
    balanceOf,
    ethBalanceOf,
    amountByBNB,
    amountByUSDT
}
