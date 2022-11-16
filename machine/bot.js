const { getPrices, calcBNBPrice, amountByBNB, amountByUSDT } = require('../api/tokenPriceAPI.js');
const { testTransferERC20, swapBNBtoToken } = require('../api/buyToken');

// const ColorType = Object.freeze({'green' : 0, 'red' : 1, 'none' : 2});
// const Slippage = Object.freeze({'negative' : 0, 'positive' : 1});

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
let recordLimit = 150;
let counter = 0;
let ready = 10;
let bStop = true;

const initialize = () => {
    bStop = true;
    curBar = {
        High    : 0,
        Close   : 0,
        Open    : 0,
        Low     : 0,
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
    ready = 10;
    counter = 0;
}

const changeCandleStick = (price) => {
    console.log("  -> changeCandleStick")
    if(counter == 1){
        curBar.Open = (prevBar.Open + prevBar.Close) / 2
    }
    curBar.High = curBar.High > price ? curBar.High : price;
    if(curBar.Low == 0) {
        curBar.Low = price;
    } else {
        curBar.Low = curBar.Low < price ? curBar.Low : price;
    }
    curBar.High = Math.max(curBar.High, curBar.Open, curBar.Close);  
    curBar.Close = curBar.Close == 0 ? price : curBar.Close;
    curBar.Low = Math.min(curBar.Low, curBar.Open, curBar.Close);    
    curBar.Close = (curBar.Open + curBar.High + curBar.Low + curBar.Close) / 4;
}

const makeCandleStick = () => {
    console.log("  -> makeCandleStick");
    curBar.Color = curBar.Close >= curBar.Open ? ColorType.green : ColorType.red
    prevBar.High    = curBar.High;
    prevBar.Close   = curBar.Close;
    prevBar.Open    = curBar.Open;
    prevBar.Low     = curBar.Low;
    prevBar.Color   = curBar.Color;
    candleStickDB.push({
        h: curBar.High, 
        c: curBar.Close, 
        o: curBar.Open, 
        l: curBar.Low,
        color : curBar.Close >= curBar.Open ? ColorType.green : ColorType.red
    });
    if (candleStickDB.length == recordLimit/10) candleStickDB.shift();
    console.log(curBar)
}

const pridictSlippage = () => {
    let result = null;
    if(curBar.Close >= curBar.Open) result = Slippage.negative;
    else result = Slippage.positive
}

const mainMachine = async () => {
    console.log(`-> mainMachine ${counter}`)
    let record = await getPrices(tokenAddress);
    counter++;
    if (priceDB.length == recordLimit) priceDB.shift();
    priceDB.push(record);
    changeCandleStick(record.INUSD);

    let limit = recordLimit;
    if(ready > 0) limit /= 30;

    if(counter === limit) {
        ready--;
        counter = 0;
        makeCandleStick();
        if(ready <= 0) {
            pridictSlippage();
        }
    }
    if(bStop) return;
    setTimeout(mainMachine, 2000);
}

const startBot = (address) => {
    tokenAddress = address;
    initialize();
    bStart = false;
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
