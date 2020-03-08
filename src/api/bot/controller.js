const request = require('request');
const { StringStream } = require('scramjet');
/**
 * stock bot query
 */
exports.stock = async ticker => {
  try {
    let index = 0;
    let value;
    const price = await request
      .get(`https://stooq.com/q/l/?s=${ticker}&f=sd2t2ohlcv&h&e=csv`) // fetch csv
      .pipe(new StringStream()) // pass to stream
      .CSVParse() // parse into objects
      .consume(object => {
        // only get the first result
        if (index === 1) {
          // get close ticker value
          value = object[6];
        }
        index++
      })
      .then(() => value);
    if (value === 'N/D' || value == null) {
      return `${ticker} was not found`;
    }
    return `${ticker.toUpperCase()} quote is ${value} per share`;
  } catch (error) {
    return error;
  }
};
