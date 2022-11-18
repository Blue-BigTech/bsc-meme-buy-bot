const {BN} = require('web3-utils');
const { getPrices, getDecimals, amountByBNB, amountByUSDT, ethBalanceOf } = require('../api/tokenPriceAPI.js');
const { swapBNBtoToken, swapUSDTtoToken } = require('../api/buyToken');
const { BOSS_Manager } = require('./manager');
const { addDecimals } = require('../utils/utils.js');

const {PUBLIC_KEY} = process.env;
let parent = null;
let coin = null;
let curBar = {
    High    : 0,
    Close   : 0,
    Open    : 0,
    Low     : 0,
    Color   : ColorType.none
}

let prevBar = {
    High    : 0,
    Close   : 0,
    Open    : 0,
    Low     : 0,
    Color   : ColorType.none
}

let tokenPrices = {
    BNB : 300.0,
    TOKEN : 1.0
}

// let priceDB = [];
let candleStickDB = [];
let tokenAddress = '0x49324d59327fB799813B902dB55b2a118d601547';
let recordLimit = 15;
let counter = 0;
let bStop = true;
let bFirst = true;
const initialize = () => {
    bStop = true;
    curBar = {
        High    : 0,
        Close   : 0,
        Open    : 0,
        Low     : 10000,
        Color   : ColorType.none
    };
    prevBar = {
        High    : 0,
        Close   : 0,
        Open    : 0,
        Low     : 0,
        Color   : ColorType.none
    };
    priceDB = [];
    candleStickDB = [];
    counter = 0;
    LastTime = null;
    spentBNB = 0;
}

const changeCandleStick = (price, bClose = false) => {
    if(bClose){
        curBar.Close = price;
    }
    if(curBar.Open == 0){
        curBar.Open = price;
    }
    curBar.Low = curBar.Low < price ? curBar.Low : price;
    curBar.High = curBar.High > price ? curBar.High : price;
}

const makeCandleStick = () => {
    if(!bFirst){
        h = curBar.High; c = curBar.Close; o = curBar.Open; l = curBar.Low;
        curBar.Close = (o + h + l + c)/4;
        curBar.Open = (prevBar.Open + prevBar.Close)/2;
        curBar.High = Math.max(h,o,c);
        curBar.Low = Math.min(l,o,c);
    }
    bFirst = false;
    curBar.Color = curBar.Close >= curBar.Open ? ColorType.green : ColorType.red
    prevBar.High    = curBar.High;
    prevBar.Close   = curBar.Close;
    prevBar.Open    = curBar.Open;
    prevBar.Low     = curBar.Low;
    prevBar.Color   = curBar.Color;
    const rec = {
        h: curBar.High, 
        c: curBar.Close, 
        o: curBar.Open, 
        l: curBar.Low,
        col : curBar.Color
    };
    candleStickDB.push(JSON.stringify(rec));
    console.log(curBar);
    curBar = {
        High    : 0,
        Close   : 0,
        Open    : 0,
        Low     : 10000,
        Color   : ColorType.none
    };
    
    if (candleStickDB.length == recordLimit) candleStickDB.shift();
}

const pridictSlippage = () => {
    const last = candleStickDB.length;
    return JSON.parse(candleStickDB[last-1]).col;
}

const mainMachine = async () => {
    console.log('call mainMachine')
    if(spentBNB >= (totalUSD/BNBPrice)) {
        console.log('All BOUGHT!');
        bStop = true;
        return;
    }
    let record = await getPrices(tokenAddress);
    counter++;
    // if (priceDB.length == recordLimit) priceDB.shift();
    // priceDB.push(record);
    // let price = coin === BNB ? record.INBNB : record.INUSD;
    let price = record.INUSD;
    BNBPrice = parseFloat(record.BNB).toFixed(3);
    if(counter === recordLimit) {
        changeCandleStick(price, true);
        counter = 0;
        makeCandleStick();
        switch(parent){
            case BOSS:
                let params = {
                    slippage : pridictSlippage(),
                }
                console.log('call BOSS_Manager')
                await BOSS_Manager(params);
                break;
        }
    }else{
        changeCandleStick(price);
    }

    if(bStop) return;
    setTimeout(mainMachine, 5000);
}

const startBot = (_coin, _parent, _tokenAddress) => {
    coin = _coin;
    parent = _parent;
    tokenAddress = _tokenAddress;

    // console.log(coin);
    // console.log(parent);
    // console.log(tokenAddress);

    initialize();
    bStop = false;
    mainMachine();
}

const test = async () => {
    // console.log(await ethBalanceOf(PUBLIC_KEY));
    // let bnb = 1;
    // let real = bnb*(1-0.12);
    // const amount = await amountByBNB( real, BOSS_DATA.address )
    // console.log(amount);
    // let res = await swapBNBtoToken(bnb, amount, BOSS_DATA.address);

    // let res = await testTransferERC20();

    // let usdt = 1;
    // let real = usdt*(1-0.12);
    // const amount = await amountByUSDT( real, tokenAddress )
    // console.log(amount);
    // let res = await swapUSDTtoToken(usdt, amount, BOSS_DATA.address);
    // if(res.success){
    //     console.log('********SUCCESS********');
    //     let amountToken = ((new BN(res.curBal)).sub(new BN(res.prevBal))).toString();
    //     let decimals = await getDecimals(BOSS_DATA.address);
    //     amountToken = addDecimals(amountToken, decimals);
    //     console.log(`BOSS Amount : ${amountToken}`)
    // }else{
    //     console.log('********FAILED********');
    // }
}

module.exports = {
    curBar,
    tokenPrices,
    startBot,
    test
}
