const {BN} = require('web3-utils');

function setDecimals( number, decimals ){
    number = number.toString();
    let numberAbs = number.split('.')[0]
    let numberDecimals = number.split('.')[1] ? number.split('.')[1] : '';
    while( numberDecimals.length < decimals ){
        numberDecimals += "0";
    }
    return numberAbs + numberDecimals;
}

function addDecimals(x, n) { 
    base = new BN(10).pow(new BN(n));
    dm = new BN(x).divmod(base);
    return dm.div + "." + dm.mod.toString(10, n)
}

function printCurTime() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const hh = today.getHours();
    const min = today.getMinutes();
    const sec = today.getSeconds();
    today = mm + '/' + dd + '/' + yyyy + '-' + hh + ':' + min + ':' + sec;
    console.log(today)
}

function isElapsedTime(prevTime) {
    if(prevTime == null) return true;
    let curTime = new Date();
    let timeDiff = curTime - prevTime; //in ms
    timeDiff /= 1000;
    if(Math.round(timeDiff) < ElapsedTime) return false;
    return true;
}
module.exports = {
    setDecimals,
    addDecimals,
    isElapsedTime,
    printCurTime
}