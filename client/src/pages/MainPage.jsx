import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import socketClient  from "socket.io-client";

const theme = createTheme();
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SERVER = "http://localhost:5000";
var socket;

function MainPage() {
  const [symbol, setSymbol] = React.useState('BOSS');
  const [addr, setAddr] = React.useState('0xabcd1234');
  const [dec, setDecimal] = React.useState(18);
  const [currency, setCurrency] = React.useState('BNB');
  const [tokenPrice, setTokenPrice] = React.useState('0.0');
  const [currencyPrice, setCurrencyPrice] = React.useState('');
  const [total, setTotal] = React.useState(20);
  const [perTx, setPerTx] = React.useState(1);
  const [slipTol, setSlipTol] = React.useState(12);
  const [priceTol, setPriceTol] = React.useState(10);
  const [timeStep, setTimeStep] = React.useState(3600);
  const [spentBNB, setSpentBNB] = React.useState(0);
  const [amountToken, setAmountToken] = React.useState("0");
  const [tempKey, setTempKey] = React.useState("");
  const [privateKey, setPrivKey] = React.useState('');
  const [publicKey, setPubKey] = React.useState('');
  const [bSuccess, setbSuccess] = React.useState(false);
  const [successMsg, setSuccess] = React.useState('SUCCESS MSG');
  const [bFailed, setbFailed] = React.useState(false);
  const [failedMsg, setFailed] = React.useState('FAILED MSG');
  const [bStart, setbStart] = React.useState(false);
  const [bStopping, setbStopping] = React.useState(false);
  const [bShow, setbShow] = React.useState(false);
  const [bSlippage, setbSlippage] = React.useState(false);
  const [ready, setReady] = React.useState(0);
  
  React.useEffect(() => {
    // if (performance.navigation.type === 1) {
    //   alert( "This page is reloaded" );
    // } else {
    //   alert( "This page is not reloaded");
    // }
    configureSocket();
    setSymbol('BOSS');
    socket.emit('SYMBOL_INFO',  symbol);
  }, []);
  /////////////// Functions //////////////////
  const configureSocket = () => {
    var mySocket = socketClient (SERVER);
    mySocket.on('connection', (msg) => {
      if(msg == null)
        console.log(`connected to back-end`);
    });
    mySocket.on('SYMBOL_INFO', data => {
      setAddr(data.address);
      setDecimal(data.decimals);
      setTokenPrice(data.price);
      setCurrencyPrice(data.bnb);
    });
    mySocket.on('bot-ready', (data) => {
      setReady(2);
    });
    mySocket.on('bot-warning', (data) => {
      const msg = data.msg;
      const slippage = data.slippage;
      const price = data.price;
      if(msg != ''){
        setFailed(msg);
        openFailed();
      }
      setbSlippage(slippage);
      if(price != 0) setTokenPrice(price);
    });
    mySocket.on('bot-status', (data) => {
      const status = data.status;
      if(status){
       setSpentBNB(data.bnb); 
       setAmountToken(data.amount);
      }
    });
    mySocket.on('msg-success', (data) => {
      setSuccess(data);
      openSuccess();
    });
    mySocket.on('msg-failed', (data) => {
      setFailed(data);
      openFailed();
    });
    mySocket.on('bot-end', (data) => {
      setAmountToken(data.amount);
      setSuccess("All BOUGHT!");
      openSuccess();
    });
    mySocket.on('stop-bot', (data) => {
      setbStopping(false);
      setbStart(false);
      setbShow(false);
    });    
    socket = mySocket;  
  }
  const openSuccess = () => {
    setSuccess('SUCCESS MSG');
    setbSuccess(true);
  };
  const closeSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setbSuccess(false);
  };

  const openFailed = () => {
    setbFailed(true);
  };
  const closeFailed = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setbFailed(false);
  };
  const startBot = async () => {
    if(privateKey == '') {
      setFailed('Please set the Private Key!')
      openFailed();
      return;
    }
    if(publicKey == '') {
      setFailed('Please set the Public Key!')
      openFailed();
      return;
    }
    if(total <= 0) {
      setFailed('Total must be greater than 0')
      openFailed();
      return;
    }
    if(perTx <= 0 || perTx > total) {
      setFailed('Please reset PerTx value')
      openFailed();
      return;
    }
    if(timeStep < 60) {
      setFailed('TimeStep must be greater than 60s');
      openFailed();
      return;
    }
    if(slipTol < 12) {
      setFailed('Silppage Tolerance must be greater than 12%');
      openFailed();
    }   
    setbStart(true);
    setbShow(true);
    socket.emit('start-bot', {
      privkey : privateKey,
      publickey: publicKey,
      target : symbol,
      coinSymbol : currency,
      totalUSD : total,
      USDPerTx : perTx,
      priceThreshold : 0,
      slippage : slipTol,
      timeStep : timeStep
    });
    setReady(1);
  }
  const stopBot = () => {
    setbStopping(true);
    socket.emit('stop-bot', null);
  }
  /////////////// Handels //////////////////
  const symbolChange = (event) => {
    socket.emit('SYMBOL_INFO',  event.target.value);
    setSymbol(event.target.value);
    setbShow(false);
    setReady(0);
  };
  const currencyChange = (event) => {
    setCurrency(event.target.value);
    setbShow(false);
    setReady(0);
  };
  const amountTotal = (event) => {
    setTotal(Math.abs(parseInt(event.target.value)));
    setbShow(false);
    setReady(0);
  };
  const amountPerTx = (event) => {
    setPerTx(Math.abs(parseInt(event.target.value)));
    setbShow(false);
    setReady(0);
  };
  const slippageChange = (event) => {
    setSlipTol(Math.abs(parseInt(event.target.value)));
    setbShow(false);
    setReady(0);
  };
  const priceChange = (event) => {
    setPriceTol(Math.abs(parseInt(event.target.value)));
    setbShow(false);
    setReady(0);
  };
  const timeChange = (event) => {
    setTimeStep(Math.abs(parseInt(event.target.value)));
    setbShow(false);
    setReady(0);
  };
  const privateChange = (event) => {
    setTempKey(event.target.value);
    setbShow(false);
    setReady(0);
  };
  const onClickPrivKey = () => {
    setPrivKey(tempKey);
    setTempKey("Already set");
    setbShow(false);
    setReady(0);
  };
  const publicChange = (event) => {
    console.log(publicKey);
    setPubKey(event.target.value);
  };
  const onClickStart = () => {
    startBot();
    console.log("Start BOT");
  };
  const onClickStop = () => {
    stopBot();
    console.log("Stop BOT");
  };
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        {/* <Box border={1} borderColor="primary.main" borderRadius={6} sx={{p:1}}> */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography variant="h6" gutterBottom>
                Target Token
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="simple-select-token" >Symbol</InputLabel>
                <Select
                  labelId="simple-select-token"
                  id="simple-select-standard"
                  value={symbol}
                  onChange={symbolChange}
                >
                  <MenuItem value={'BOSS'}>BOSS</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {symbol !== '' &&
            <>
              <Grid item xs={8} sm={8}>
                  <TextField
                    readOnly
                    id="outline-token-price"
                    name="token-price"
                    label="Token Price($)"
                    fullWidth
                    // autoComplete="family-name"
                    variant="filled"
                    value={tokenPrice}
                  />
              </Grid>
              <Grid item xs={10} sm={10}>
                <TextField
                  readOnly
                  id="tokenAddress"
                  name="tokenAddress"
                  label="Address"
                  fullWidth
                  size="small"
                  // autoComplete="family-name"
                  variant="filled"
                  value={addr}
                />
              </Grid>
              <Grid item xs={2} sm={2}>
                <TextField
                  readOnly
                  // required
                  id="tokenDec"
                  name="tokenDec"
                  label="Dec"
                  fullWidth
                  size="small"
                  // autoComplete="shipping address-line1"
                  variant="filled"
                  value={dec}
                />
              </Grid>
            </>
            }
            <Grid item xs={12} sm={12}>
              <Divider variant="fullWidth" color=""/>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography variant="h6" gutterBottom>
                Setting
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="simple-select-currency">Currency</InputLabel>
                <Select
                  labelId="simple-select-currency"
                  id="simple-select-standard-currency"
                  value={currency}
                  disabled={bStart}
                  onChange={currencyChange}
                >
                  <MenuItem value={'BNB'}>BNB</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6}>
                <TextField
                  readOnly
                  id="outline-currency-price"
                  name="currency-price"
                  label="Currency Price($)"
                  fullWidth 
                  // autoComplete="family-name"
                  variant="filled"
                  value={currencyPrice}
                />
            </Grid>
            <Grid item xs={4} sm={4}>
              <TextField 
                required
                id="outlined-Total" 
                label="Total($)" 
                variant="outlined"
                type="number"
                size="small"
                value={total}
                disabled={bStart}
                inputProps={{
                  // maxLength: 5,
                  // min : 0,
                  max : 30000,
                  step : "10",
                }}
                onChange={amountTotal}
              />
            </Grid>
            <Grid item xs={4} sm={4}>
              <TextField 
                required
                id="outlined-PerTx" 
                label="PerTx($)" 
                variant="outlined"
                type="number"
                size="small"
                value={perTx}
                disabled={bStart}
                inputProps={{
                  // maxLength: 5,
                  // min : 0,
                  max : 30000,
                  step : "1",
                }}
                onChange={amountPerTx}
              />
            </Grid>
            <Grid item xs={4} sm={4}>
              <TextField 
                required
                id="outlined-timestep" 
                label="TimeStep(S)" 
                variant="outlined"
                type="number"
                size="small"
                disabled={bStart}
                inputProps={{
                  // maxLength: 5,
                  // min : 0,
                  max : 86400,
                  step : "10",
                }}
                value = {timeStep}
                onChange={timeChange}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField 
                required
                id="outlined-slippage" 
                label="Slippage Tolerance(%)" 
                variant="outlined"
                type="number"
                size="small"
                disabled={bStart}
                inputProps={{
                  // maxLength: 5,
                  // min : 0,
                  max : 100,
                  step : "1",
                }}
                value = {slipTol}
                onChange={slippageChange}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField 
                required
                id="outlined-price" 
                label="Price Tolerance(%)" 
                variant="outlined"
                type="number"
                size="small"
                disabled={bStart}
                inputProps={{
                  max : 100,
                  step : "1",
                }}
                value = {priceTol}
                onChange={priceChange}
              />
            </Grid>
            <Grid item xs={9} sm={9}>
              <TextField 
                required
                fullWidth
                id="outlined-privatekey" 
                label="Private Key" 
                variant="outlined"
                size="small"
                disabled={bStart}
                value={tempKey}
                onChange={privateChange}
              />
            </Grid>
            <Grid item xs={3} sm={3}>
              <Button variant="outlined" size="medium" onClick={onClickPrivKey}>
                  Set
                </Button>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField 
                required
                fullWidth
                id="outlined-publickey" 
                label="Public Key" 
                variant="outlined"
                value={publicKey}
                size="small"
                disabled={bStart}
                inputProps={{style: {fontSize: 15}}}
                onChange={publicChange}
              />
            </Grid>
            {!bShow &&
              <>
                <Grid item xs={12} sm={12}>
                  <Button variant="contained" size="large" onClick={onClickStart}>
                    START
                  </Button>
                </Grid>
              </>
            }
            {bShow &&
              <>
                <Grid item xs={12} sm={12}>
                  <Button variant="contained" color="error" size="large" onClick={onClickStop} disabled={bStopping}>
                    STOP
                  </Button>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Divider variant="fullWidth" color=""/>
                </Grid>
                {ready == 1 &&
                <>
                <Grid item xs={12} sm={12}>
                  <Typography variant="h6">Data Loading...</Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CircularProgress />
                </Grid>
                </>
                }
                {ready == 2 &&
                <>
                  <Grid item xs={3} sm={3}>
                    <TextField
                        readOnly
                        id="outline-spent-bnb"
                        name="spent-bnb"
                        label="Spent BNB"
                        fullWidth 
                        size="small"
                        variant="filled"
                        value={spentBNB}
                      />
                  </Grid>
                  <Grid item xs={9} sm={9}>
                    <TextField
                        readOnly
                        id="outline-amount-token"
                        name="amount-token"
                        label="Amount of Token"
                        fullWidth 
                        size="small"
                        variant="filled"
                        value={amountToken}
                      />
                  </Grid>
                </>
                }
                <Grid item xs={12} sm={12}>
                  {bSlippage && ready == 2 &&
                    <>
                      <LinearProgress color="success"/>
                      <Typography variant="h6" color="green">POSITIVE SLIPPAGE</Typography>
                    </>
                  }
                  {!bSlippage && ready == 2 &&
                    <>
                      <LinearProgress color="secondary"/>
                      <Typography variant="h6" color="red">NEGATIVE SLIPPAGE</Typography>
                    </>
                  }
                </Grid>
              </>
            }
            </Grid>
          <Snackbar open={bSuccess} autoHideDuration={4000} onClose={closeSuccess}>
            <Alert onClose={closeSuccess} severity="success" sx={{ width: '100%' }}>
              {successMsg}
            </Alert>
          </Snackbar>
          <Snackbar open={bFailed} autoHideDuration={4000} onClose={closeFailed}>
            <Alert onClose={closeFailed} severity="error" sx={{ width: '100%' }}>
              {failedMsg}
            </Alert>
          </Snackbar>
        {/* </Box> */}
      </Container>
    </ThemeProvider>
  );
}

export default MainPage;