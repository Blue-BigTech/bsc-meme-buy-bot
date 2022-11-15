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
  const [amount, setAmount] = React.useState(1);
  const symbolChange = (event) => {
    setSymbol(event.target.value);
  };
  const currencyChange = (event) => {
    setCurrency(event.target.value);
  };
  const amountChange = (event) => {
    console.log(parseInt(event.target.value))
    setAmount(parseInt(event.target.value));
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
                  label="Decimals"
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
            {/* <br/><br/><br/> */}
            <Grid item xs={12} sm={12}>
              <Typography variant="h6" gutterBottom>
                Select Currency
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
                  <MenuItem value={'USDT'}>USDT</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField 
                required
                id="outlined-Amount" 
                label="Amount" 
                variant="outlined" 
                onChange={amountChange}
              />
            </Grid>
          </Grid>
        {/* </Box> */}
      </Container>
    </ThemeProvider>
  );
}

export default MainPage;