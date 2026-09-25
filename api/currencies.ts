import {
  mapCurrencies,
  filterCurrencies,
  getSyncCash,
} from '../src/utils/formatCurrency';

const MONOBANK = 'https://api.monobank.ua/bank/currency';
const NBU = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

interface Res {
  setHeader(name: string, value: string): void;
  status(code: number): { json(body: unknown): void };
}

const getJson = async (url: string) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`${url} → ${response.status}`);
  return response.json();
};

/**
 * Monobank + NBU rates. Monobank rate-limits by IP, so the Vercel CDN caches
 * the response: upstream is hit at most once per 5 minutes per region.
 */
export default async function handler(_req: unknown, res: Res) {
  try {
    const [monobank, nbu] = await Promise.all([
      getJson(MONOBANK),
      getJson(NBU).catch(() => []),
    ]);
    if (!Array.isArray(monobank) || !monobank.length) {
      throw new Error('empty monobank response');
    }
    const currencies = getSyncCash(
      monobank.map(mapCurrencies).filter(filterCurrencies),
      Array.isArray(nbu) ? nbu : [],
    );
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400');
    res.status(200).json({ date: new Date().toISOString(), currencies });
  } catch (error) {
    console.error('[api/currencies]', error);
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: 'upstream unavailable' });
  }
}
