import { formatAmount, formatRate, parseAmount } from '../utils/formatCurrency';

describe('parseAmount', () => {
  it('accepts comma, spaces and a leading dot', () => {
    expect(parseAmount('1 234,5')).toBe('1234.5');
    expect(parseAmount('.5')).toBe('0.5');
    expect(parseAmount('')).toBe('');
  });

  it('rejects invalid input', () => {
    expect(parseAmount('12a')).toBeNull();
    expect(parseAmount('1.2.3')).toBeNull();
  });
});

describe('formatAmount', () => {
  it('uses two decimals and groups thousands', () => {
    expect(formatAmount('45417.5')).toBe('45 417.50');
    expect(formatAmount('100')).toBe('100');
  });

  it('keeps significant digits for tiny amounts', () => {
    expect(formatAmount('0.000132241234')).toBe('0.00013224');
  });
});

describe('formatRate', () => {
  it('shows useful precision', () => {
    expect(formatRate('45.41752')).toBe('45.4175');
    expect(formatRate('0.0220180')).toBe('0.02202');
    expect(formatRate('3781023.3')).toBe('3 781 023.30');
  });
});
