# WARNING: You had already pushed your wallet private key. 
# bsc-meme-buy-bot on pancakeswap
<div align="center">
<img
    src="https://raw.githubusercontent.com/Blue-BigTech/Moonhub-Images/master/PancakeBoss.png"
    width="486"
    height=auto
  />
  
</div>

> Using create-react-app with a Node Express Backend

## Usage

Install [nodemon](https://github.com/remy/nodemon) globally

```
npm i nodemon -g
```

Install server and client dependencies

```
npm i
```

To start the server and client at the same time (from the root of the project)

```
npm run server
```
## Input ENV before running server
```
NODE_ENV=development
PORT=5000
PRIVATE_KEY=85edec2.......................................b91f724
PUBLIC_KEY=0x5E3040.............F383f5f9E3c6905
```

TARGET_TOKEN          : token symbol to buy.
EX : 
```
TARGET_TOKEN=BOSS
```
TOTAL_USD             : total amount for buying as USD.
EX : 
```
TOTAL_USD=20000
```
USD_PER_TX            : amount USD per tx as USD. 
EX : 
```
USD_PER_TX=1000
```
PRICE_THRESHOLD       : threshold price of target token. if it sets as 0, this will be set as the price when the server runs. 
EX : 
```
PRICE_THRESHOLD=0
```
SLIPPAGE_TOLERANCE    : slippage tolerance for meme token. this must be minimum 12%. 
EX : 
```
SLIPPAGE_TOLERANCE=12
```
TIME_STEP_SEC         : Server will retry to buy token after this time period. It represents by seconds. 
EX : 
```
TIME_STEP_SEC=600
```
