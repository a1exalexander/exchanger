const getCountryIcon = (country: string) => {
  return `/public/flags/${country}.svg`;
  // try {
  //   return require(`../assets/flags/${country}.svg`) || ''
  // } catch(e) {
  //   return '';
  // }
};
const getCryptoIcon = (currency: string) => {
  return `/public/crypto/${currency.toLowerCase()}.svg`;
  // try {
  //   return require(`../assets/crypto/${currency.toLowerCase()}.svg`) || ''
  // } catch(e) {
  //   return '';
  // }
};
const getIcon = (a: string, b: string) => {
  const name = a ? a.replace( /(\s|,|')/g, "-" ) : b ? b.replace( /(\s|,|')/g, "-" ) : '';
  if (!name) return '';
  return a ? getCountryIcon(name) : getCryptoIcon(name)
};

export default getIcon;