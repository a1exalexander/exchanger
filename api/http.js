const axios = require('axios').default;
const fs = require('fs');
const getUrls = require('./urls');

const writeDataToFile = (file) => (res) => {
  console.log(`${file} => Checking response`);
  if (res && res.data) {
    fs.writeFile(
      `./data/${file}.json`,
      JSON.stringify(res.data),
      'utf8',
      (error) => {
        if (error) console.log(`[ERROR] ${file} => `, error);
        console.log(`[SUCCESS] ${file} => RESPONSE writed to ${file}.json`);
      }
    );
    if (file === 'monobank') {
      fs.writeFile(
        `./data/date.json`,
        JSON.stringify(res.headers.date),
        'utf8',
        (error) => {
          if (error) console.log(`[ERROR] date => `, error);
          console.log(`[SUCCESS] date => RESPONSE writed to date.json`);
        }
      );
    }
  }
};

const requestData = ([file, url]) => {
  try {
    axios
        .get(url)
        .then(writeDataToFile(file))
        .catch((err) => console.log(`[ERROR] ${url} => `, err.response || err));
  } catch (err) {
    console.log(err);
  }
};

const getData = () => {
  const urls = getUrls();
  console.log(urls);
  Object.entries(urls).forEach(requestData);
};

module.exports = { getData };
