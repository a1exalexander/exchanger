const format = require('date-fns/format');

const getUrls = () => ({
  monobank: `https://api.monobank.ua/bank/currency`,
  btc: `https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=1`,
  privatbank: `https://api.privatbank.ua/p24api/exchange_rates?json&date=${format(
    new Date(),
    'dd.MM.yyyy'
  )}`,
  nationalbank: `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json`,
});

module.exports = getUrls;
