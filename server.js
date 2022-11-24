require('dotenv-safe').config()
require('./utils/global');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const cors = require('cors');
const {startBoss, getTokenInfo } = require('./machine/BOSS_Enterance');
const {test} = require('./machine/bot');

const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 5000;

http.listen(port, () => {
    console.log(`listening on *:${port}`);
});


io.on('connection', (socket) => {
    // console.log('new client connected');
    socket.emit('connection', null);
    socket.on('SYMBOL_INFO', async symbol => {
      let data = await getSymbolInfo(symbol);
      socket.emit('SYMBOL_INFO', data);
    });
    socket.on('start-bot', param => {
      console.log(param);
      SocketIO = socket;
      main(param.target, param);
    });
    socket.on('stop-bot', param => {
      console.log("stop-bot");
      if(bStop){
        socket.emit('stop-bot', null);
      } else {
        bStop = true;
      }
      console.log(bStop);
    });
});

const getSymbolInfo = async (symbol) => {
  let data = null;
  switch(symbol){
    case 'BOSS':
      data = await getTokenInfo();
      break;
  }
  return data;
}

// const {
//   TARGET_TOKEN,
//   TOTAL_USD,
//   USD_PER_TX,
//   PRICE_THRESHOLD,
//   SLIPPAGE_TOLERANCE,
//   TIME_STEP_SEC
// } = process.env;

// let params = {
//   coinSymbol : 'BNB',
//   totalUSD : TOTAL_USD,
//   USDPerTx : USD_PER_TX,
//   priceThreshold : PRICE_THRESHOLD,
//   slippage : SLIPPAGE_TOLERANCE,
//   timeStep : TIME_STEP_SEC,
// }

const main = (target, param) => {
  PRIVATE_KEY = param.privkey;
  PUBLIC_KEY = param.publickey;
  switch(target) {
    case 'BOSS':
      console.log("BOSS START!");
      startBoss(param);
      break;
  }
};

// main();
// test()

// app.post('/api/startbot', (req, res) => {
//   console.log("start bot");
//   console.log(req.body);
//   // res.send(
//   //   `I received your POST request. This is what you sent me: ${req.body.post}`,
//   // );
// });
