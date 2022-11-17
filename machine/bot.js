const { getPrices, calcBNBPrice, amountByBNB, amountByUSDT } = require('../api/tokenPriceAPI.js');
const { testTransferERC20, swapBNBtoToken } = require('../api/buyToken');
const { manager } = require('./manager');

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

let priceDB = [];
let candleStickDB = [];
let tokenAddress = '0x49324d59327fB799813B902dB55b2a118d601547';
let recordLimit = 25;
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
    let record = await getPrices(tokenAddress);
    counter++;
    if (priceDB.length == recordLimit) priceDB.shift();
    priceDB.push(record);
    // let price = coin === BNB ? record.INBNB : record.INUSD;
    let price = record.INUSD;
    // console.log("PRICE : " + parseFloat(price).toFixed(13));
    if(counter === recordLimit) {
        changeCandleStick(price, true);
        counter = 0;
        makeCandleStick();
        switch(parent){
            case BOSS:
                let params = {
                    slippage : pridictSlippage(),

                }
                manager(params);
                break;
        }
    }else{
        changeCandleStick(price);
    }

    if(bStop) return;
    setTimeout(mainMachine, 1000);
}

const startBot = (_coin, _parent, _tokenAddress) => {
    coin = _coin;
    parent = _parent;
    tokenAddress = _tokenAddress;

    console.log(coin);
    console.log(parent);
    console.log(tokenAddress);

    initialize();
    bStop = false;
    mainMachine();
}

const test = async () => {
    // let BUSDAddress = '0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814';//test
    // let BUSDAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';//main
    // const amount = await calcBNBPrice();
    let bnb = 0.0037;
    // const amount = await amountByBNB( bnb*(1-0.01), USDT_ADDR )
    // console.log(amount)
    const amount = await amountByUSDT( 1, tokenAddress )
    let res = await testTransferERC20();
    // let res = swapBNBtoToken(bnb, amount, USDT_ADDR);
    // console.log(res)
}

module.exports = {
    curBar,
    tokenPrices,
    startBot,
    test
}
