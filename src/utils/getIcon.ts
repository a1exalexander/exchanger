const getCountryIcon = (country: string) => require(`../assets/flags/${country}.svg`) || '';
const getCryptoIcon = (currency: string) => require(`../assets/crypto/${currency.toLowerCase()}.svg`) || '';
const getIcon = (a: string, b: string) => {
  if (!a && !b) return '';
  return a ? getCountryIcon(a) : getCryptoIcon(b)
};

export default getIcon;