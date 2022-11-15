const fs = require('fs');
const Web3 = require('web3');
const {BN} = require('web3-utils');
const Provider = require('@truffle/hdwallet-provider');
const { setDecimals } = require('../utils/utils');
const { getPrices,
        calcBNBPrice,
        getDecimals,
        amountByBNB,
        amountByUSDT} = require('./tokenPriceAPI');
const {
    PRIVATE_KEY,
    PUBLIC_KEY,
    PANCKAE_ADDR,
    BNB_ADDR,
    USDT_ADDR,
    RPC_URL
} = process.env;

let tokenAbi = JSON.parse(fs.readFileSync('abi/erc20.json','utf-8'));
let pancakeAbi = JSON.parse(fs.readFileSync('abi/pancakeswap.json','utf-8'));
// const tokenAddr = '0x49324d59327fB799813B902dB55b2a118d601547'; //BOSS
// const RPC_URL = 'https://bsctestapi.terminet.io/rpc'; //BSC testnet
/***********************/
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

const swapBNBtoToken = async (amountIn, amountOutMin, tokenAddress) => {
    // let amountOutMin = await amountByBNB(amountIn, tokenAddress);
    const provider = new Provider(PRIVATE_KEY, RPC_URL);
    const web3 = new Web3(provider);
    const decimals = await getDecimals(tokenAddress);
    amountOutMin = setDecimals(amountOutMin, decimals);
    amountIn = web3.utils.toWei(amountIn.toString(), "ether");
    console.log(amountIn, amountOutMin);
    const pancakeRouter = new web3.eth.Contract(pancakeAbi, PANCKAE_ADDR);
    let deadline = web3.utils.toHex(Math.round(Date.now()/1000)+60*20);
    let res = await pancakeRouter.methods.swapExactETHForTokens(amountOutMin, [BNB_ADDR, tokenAddress], PUBLIC_KEY, deadline).send({ from:PUBLIC_KEY, value:amountIn });
    // let res = await pancakeRouter.methods.swapExactETHForTokens(amountOutMin, [BNB_ADDR, tokenAddress], PUBLIC_KEY, deadline).send({ value: amountIn });
    console.log(res);
}

const swapUSDTtoToken = async (amountIn, amountOutMin, tokenAddress) => {
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
    let appres = await tokenRouter.methods.approve(pancakeRouter, amountIn).send({ from:PUBLIC_KEY })
    //swap
    const pancakeRouter = new web3.eth.Contract(pancakeAbi, PANCKAE_ADDR);
    let deadline = web3.utils.toHex(Math.round(Date.now()/1000)+60*20);
    let res = await pancakeRouter.methods.swapExactTokensForTokens(amountOutMin, [BNB_ADDR, tokenAddress], PUBLIC_KEY, deadline).send({ from:PUBLIC_KEY, value:amountIn });
    console.log(res);
}

module.exports = {
    testTransferERC20,
    swapBNBtoToken,
    swapUSDTtoToken
}

// let abi = ["function approve(address _spender, uint256 _value) public returns (bool success)"]
// let provider = ethers.getDefaultProvider('ropsten')
// let contract = new ethers.Contract(tokenAddress, abi, provider)
// await contract.approve(accountAddress, amount)