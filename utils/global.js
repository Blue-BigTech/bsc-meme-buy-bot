global.ColorType = Object.freeze({'green' : 0, 'red' : 1, 'none' : 2});
global.Slippage = Object.freeze({'negative' : 0, 'positive' : 1});
global.BNB = 0;
global.USDT = 1;
global.BOSS = 2;
global.USDTBNBFEE = 0.0025;
global.BNBBOSSFEE = 0.0025;

global.BOSS_DATA = {
    address : '0x49324d59327fB799813B902dB55b2a118d601547',
    taxFee : 0,
    liquidityFee : 0,
    maxTxAmount : 0
};

global.BNBPrice = 0;
global.coinSymbol = '';
global.coinAddr = '';
global.totalUSD = 0;
global.USDPerTx = 0;
global.priceThreshold = 0;
global.slippageTolerance = 0;

global.initPriceImpact = 0;
global.initAmountOut = 0;
global.initAmountOutMin = 0;

//BSC Mainnet
global.PANCKAE_ADDR='0x10ED43C718714eb63d5aA57B78B54704E256024E';
global.RPC_URL='https://bsc-dataseed1.binance.org';
global.BNB_ADDR='0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
global.USDT_ADDR='0x55d398326f99059fF775485246999027B3197955';

//BSC Testnet
// global.PANCKAE_ADDR='0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';
// global.RPC_URL='https://data-seed-prebsc-1-s1.binance.org:8545';
// global.BNB_ADDR='0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd';
// global.USDT_ADDR='0x337610d27c682E347C9cD60BD4b3b107C9d34dDd';