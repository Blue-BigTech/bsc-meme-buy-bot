const fs = require('fs');
const Web3 = require('web3');
const {BN} = require('web3-utils');
const Provider = require('@truffle/hdwallet-provider');
const { setDecimals, addDecimals } = require('../utils/utils');
const { getPrices,
        calcBNBPrice,
        getDecimals,
        balanceOf,
        ethBalanceOf,
        amountByBNB,
        amountByUSDT} = require('./tokenPriceAPI');
const {
    PRIVATE_KEY,
    PUBLIC_KEY,
} = process.env;

let tokenAbi = JSON.parse(fs.readFileSync('abi/erc20.json','utf-8'));
let pancakeAbi = JSON.parse(fs.readFileSync('abi/pancakeswap.json','utf-8'));
const testTransferERC20 = async () => {
    const provider = new Provider(PRIVATE_KEY, RPC_URL);
    const web3 = new Web3(provider);
    const myContract = new web3.eth.Contract(tokenAbi, tokenAddr);
    let tokenDecimals = await myContract.methods.decimals().call();
    console.log(tokenDecimals);
    let amount = setDecimals('100', tokenDecimals)
    const receiver = '0x8F928110f7071AE9CC426eE36CF9750F4433e97c'
    const receipt = await myContract.methods.transfer(receiver, amount).send({ from: PUBLIC_KEY });
    console.log(receipt);
}

const checkBNBBalance = async (ownerAddr, amounBNB) => {
    const ethBalance = await ethBalanceOf(ownerAddr);
    if(parseFloat(ethBalance.eth) >= (amounBNB + 1/BNBPrice)) return true;
    else return false;
}

const checkUSDTBalance = async (tokenAddr, ownerAddr, amounUSDT) => {
    const ethBalance = await ethBalanceOf(ownerAddr);
    let bStatus = true;
    if(parseFloat(ethBalance.eth) < (1/BNBPrice)) return false;
    let erc20Bal = await balanceOf(tokenAddr, ownerAddr);
    let decimals = await getDecimals(tokenAddr);
    erc20Bal = addDecimals(erc20Bal, decimals);
    if(parseFloat(erc20Bal) < amounUSDT) return false;
    return bStatus;
}
const swapBNBtoToken = async (amountIn, amountOutMin, tokenAddress) => {
    if(!await checkBNBBalance(PUBLIC_KEY, amountIn)){
        console.log("ERROR : Insufficiant BNBs in your wallet");
        return;
    }
    const provider = new Provider(PRIVATE_KEY, RPC_URL);
    const web3 = new Web3(provider);
    const decimals = await getDecimals(tokenAddress);
    amountOutMin = setDecimals(amountOutMin, decimals);
    amountIn = web3.utils.toWei(amountIn.toString(), "ether");
    // console.log(amountIn, amountOutMin);
    const pancakeRouter = new web3.eth.Contract(pancakeAbi, PANCKAE_ADDR);
    let deadline = web3.utils.toHex(Math.round(Date.now()/1000)+60*20);
    let res = null;
    try{
        let prevBal = await balanceOf(tokenAddress, PUBLIC_KEY);
        await pancakeRouter.methods.swapExactETHForTokens(amountOutMin, [BNB_ADDR, tokenAddress], PUBLIC_KEY, deadline).send({ from:PUBLIC_KEY, value:amountIn });
        let curBal = await balanceOf(tokenAddress, PUBLIC_KEY);
        res = {
            success : true,
            prevBal : prevBal,
            curBal : curBal
        };
    }catch(e){
        res = {
            success : false,
        };
    }
    return res;
}

const swapUSDTtoToken = async (amountIn, amountOutMin, tokenAddress) => {
    if(!await checkUSDTBalance(tokenAddress, PUBLIC_KEY, amountIn)) {
        console.log('Insufficiant BNB or USDT in your wallet.')
        return;
    }
    const provider = new Provider(PRIVATE_KEY, RPC_URL);
    const web3 = new Web3(provider);
    let decimals = await getDecimals(USDT_ADDR);
    amountIn = setDecimals(amountIn, decimals);
    // let amountOutMin = await amountByUSDT(amountIn, tokenAddress);
    decimals = await getDecimals(tokenAddress);
    amountOutMin = setDecimals(amountOutMin, decimals);
    console.log(amountIn, amountOutMin);
    //approve
    const tokenRouter = new web3.eth.Contract(tokenAbi, USDT_ADDR);
    let res = null;
    await tokenRouter.methods.approve(PANCKAE_ADDR, amountIn).send({ from:PUBLIC_KEY });
    //swap
    const pancakeRouter = new web3.eth.Contract(pancakeAbi, PANCKAE_ADDR);
    let deadline = web3.utils.toHex(Math.round(Date.now()/1000)+60*20);
    // try{
        let prevBal = balanceOf(tokenAddress, PUBLIC_KEY);
        // await pancakeRouter.methods.swapExactTokensForTokens(amountOutMin, [USDT_ADDR ,BNB_ADDR, tokenAddress], PUBLIC_KEY, deadline).send({ from:PUBLIC_KEY, value:amountIn });
        await pancakeRouter.methods.swapExactTokensForTokens(amountIn, amountOutMin, [USDT_ADDR, BNB_ADDR, tokenAddress], PUBLIC_KEY, deadline).send({ from:PUBLIC_KEY });
        let curBal = balanceOf(tokenAddress, PUBLIC_KEY);
        res = {
            success : true,
            prevBal : prevBal,
            curBal : curBal
        };
    // }catch(e){
    //     res = {
    //         success : false,
    //         err : e.error
    //     };
    // }
    return res;
}

module.exports = {
    testTransferERC20,
    swapBNBtoToken,
    swapUSDTtoToken
}
