const apiType = {
  prod: 'https://api.monobank.ua',
  fake: 'http://localhost:3004',
};

const ROOT_URL = apiType[process.env.REACT_APP_API_MODE];

console.log(`MODE: ${process.env.NODE_ENV}`);
console.log(`ROOT URL ${process.env.REACT_APP_API_MODE}: ${ROOT_URL}`);

const api = {
  currencies: `${ROOT_URL}/bank/currency`,
}

export default api;

