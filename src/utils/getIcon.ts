const getCountryIcon = (country: string) => {
  try {
    return require(`../assets/flags/${country}.svg`) || ''
  } catch(e) {
    return '';
  }
};
const getCryptoIcon = (currency: string) => {
  try {
    return require(`../assets/crypto/${currency.toLowerCase()}.svg`) || ''
  } catch(e) {
    return '';
  }
};
const getIcon = (a: string, b: string) => {
  const name = a ? a.replace( /(\s|,|')/g, "-" ) : b ? b.replace( /(\s|,|')/g, "-" ) : '';
  console.log(name)
  if (!name) return '';
  return a ? getCountryIcon(name) : getCryptoIcon(name)
};

export default getIcon;