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

const theme = createTheme();
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function MainPage() {
  const [symbol, setSymbol] = React.useState('BOSS');
  const [addr, setAddr] = React.useState('0x49324d59327fB799813B902dB55b2a118d601547');
  const [dec, setDecimal] = React.useState(18);
  const [currency, setCurrency] = React.useState('BNB');
  const [tokenPrice, setTokenPrice] = React.useState('');
  const [currencyPrice, setCurrencyPrice] = React.useState('');
  const [total, setTotal] = React.useState(10);
  const [perTx, setPerTx] = React.useState(2);
  const [slipTol, setSlipTol] = React.useState(12);
  const [priceTol, setPriceTol] = React.useState(10);
  const [timeStep, setTimeStep] = React.useState(600);
  const [spentBNB, setSpentBNB] = React.useState(20);
  const [amountToken, setAmountToken] = React.useState("987654321");
  const [tempKey, setTempKey] = React.useState("");
  const [privateKey, setPrivKey] = React.useState("");
  const [publicKey, setPubKey] = React.useState("0x49324d59327fB799813B902dB55b2a118d601547");
  const [bSuccess, setbSuccess] = React.useState(false);
  const [successMsg, setSuccess] = React.useState('SUCCESS MSG');
  const [bFailed, setbFailed] = React.useState(false);
  const [failedMsg, setFailed] = React.useState('FAILED MSG');
  const [bStart, setbStart] = React.useState(false);
  const [bSlippage, setbSlippage] = React.useState(false);
    
  /////////////// Functions //////////////////
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
    setFailed('FAILED MSG');
    setbFailed(true);
  };
  const closeFailed = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setbFailed(false);
  };
  const startBot = () => {
    setbStart(true);
  }
  const stopBot = () => {
    setbStart(false);
  }
  /////////////// Handels //////////////////
  const symbolChange = (event) => {
    setSymbol(event.target.value);
  };
  const currencyChange = (event) => {
    setCurrency(event.target.value);
  };
  const amountTotal = (event) => {
    console.log(parseInt(event.target.value))
    setTotal(parseInt(event.target.value));
  };
  const amountPerTx = (event) => {
    console.log(parseInt(event.target.value))
    setPerTx(parseInt(event.target.value));
  };
  const slippageChange = (event) => {
    console.log(parseInt(event.target.value))
    setSlipTol(parseInt(event.target.value));
  };
  const priceChange = (event) => {
    console.log(parseInt(event.target.value))
    setPriceTol(parseInt(event.target.value));
  };
  const timeChange = (event) => {
    console.log(parseInt(event.target.value))
    setTimeStep(parseInt(event.target.value));
  };
  const privateChange = (event) => {
    setTempKey(event.target.value);
  };
  const onClickPrivKey = () => {
    setPrivKey(tempKey);
    setTempKey("Already set");
  };
  const publicChange = (event) => {
    console.log(publicKey);
    setPubKey(event.target.value);
  };
  const onClickStart = () => {
    // openSuccess();
    startBot();
    openFailed();
    console.log("Start BOT");
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
            <Grid item xs={6} sm={6}>
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
              <Grid item xs={6} sm={6}>
                  <TextField
                    readOnly
                    id="outline-token-price"
                    name="token-price"
                    label="Token Price"
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
                  label="Currency Price"
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
                inputProps={{
                  // maxLength: 5,
                  // min : 0,
                  max : 30000,
                  step : "100",
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
                inputProps={{
                  // maxLength: 5,
                  // min : 0,
                  max : 30000,
                  step : "100",
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
                inputProps={{style: {fontSize: 15}}}
                onChange={publicChange}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button variant="contained" size="large" onClick={onClickStart}>
                START
              </Button>
            </Grid>
          {bStart &&
            <>
              <Grid item xs={12} sm={12}>
                <Divider variant="fullWidth" color=""/>
              </Grid>
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
              <Grid item xs={12} sm={12}>
                {bSlippage &&
                  <Box bgcolor="green">
                    <Typography variant="h5" color="white">POSITIVE SLIPPAGE</Typography>
                  </Box>
                }
                {!bSlippage &&
                  <Box bgcolor="red">
                    <Typography variant="h5" color="white">NEGATIVE SLIPPAGE</Typography>
                  </Box>
                }
              </Grid>
            </>
          }
          </Grid>
          <Snackbar open={bSuccess} autoHideDuration={6000} onClose={closeSuccess}>
            <Alert onClose={closeSuccess} severity="success" sx={{ width: '100%' }}>
              {successMsg}
            </Alert>
          </Snackbar>
          <Snackbar open={bFailed} autoHideDuration={6000} onClose={closeFailed}>
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