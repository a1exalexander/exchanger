import { flagIcon } from './currencyMeta';

const cryptoSvgs = import.meta.glob<string>('../assets/crypto/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
});

const getCryptoIcon = (currency: string) =>
  cryptoSvgs[`../assets/crypto/${currency.toLowerCase()}.svg`] || '';

const getIcon = (a: string, b: string) => {
  const name = a ? a.replace( /(\s|,|')/g, "-" ) : b ? b.replace( /(\s|,|')/g, "-" ) : '';
  if (!name) return '';
  return a ? flagIcon(name) : getCryptoIcon(name)
};

export default getIcon;
