import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Divider from '@mui/material/Divider';

const theme = createTheme();
function MainPage() {
  const [symbol, setSymbol] = React.useState('BOSS');
  const [addr, setAddr] = React.useState('0x49324d59327fB799813B902dB55b2a118d601547');
  const [dec, setDecimal] = React.useState(18);
  const [currency, setCurrency] = React.useState('BNB');
  const [total, setTotal] = React.useState(10);
  const [perTx, setPerTx] = React.useState(2);
  const [slipTol, setSlipTol] = React.useState(12);
  const [timeStep, setTimeStep] = React.useState(600);

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
  const timeChange = (event) => {
    console.log(parseInt(event.target.value))
    setTimeStep(parseInt(event.target.value));
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
            <Grid item xs={12} sm={12}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="simple-select-token">Symbol</InputLabel>
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
              <Grid item xs={10} sm={10}>
                <TextField
                  readOnly
                  id="tokenAddress"
                  name="tokenAddress"
                  label="Address"
                  fullWidth
                  // autoComplete="family-name"
                  variant="standard"
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
                  // autoComplete="shipping address-line1"
                  variant="standard"
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
            <Grid item xs={12} sm={12}>
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
                required
                id="outlined-Total" 
                label="Total($)" 
                variant="outlined"
                type="number"
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
            <Grid item xs={6} sm={6}>
              <TextField 
                required
                id="outlined-PerTx" 
                label="PerTx($)" 
                variant="outlined"
                type="number"
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
            <Grid item xs={6} sm={6}>
              <TextField 
                required
                id="outlined-slippage" 
                label="SlippageTolerance(%)" 
                variant="outlined"
                type="number"
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
                id="outlined-timestep" 
                label="TimeStep(S)" 
                variant="outlined"
                type="number"
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
          </Grid>
        {/* </Box> */}
      </Container>
    </ThemeProvider>
  );
}

export default MainPage;