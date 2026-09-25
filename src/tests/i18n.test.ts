import { detectLang, MESSAGES } from '../i18n';

const setLanguages = (languages: string[]) => {
  Object.defineProperty(window.navigator, 'languages', {
    value: languages,
    configurable: true,
  });
};

describe('detectLang', () => {
  it('picks Ukrainian for Ukrainian browsers', () => {
    setLanguages(['uk-UA', 'en-US']);
    expect(detectLang()).toBe('uk');
    setLanguages(['en-US', 'uk']);
    expect(detectLang()).toBe('uk');
    setLanguages(['ru-UA']);
    expect(detectLang()).toBe('uk');
  });

  it('falls back to English for everyone else', () => {
    setLanguages(['en-US']);
    expect(detectLang()).toBe('en');
    setLanguages(['de-DE', 'fr']);
    expect(detectLang()).toBe('en');
  });
});

describe('messages', () => {
  const keys = (value: object): string[] =>
    Object.entries(value).flatMap(([key, item]) =>
      item && typeof item === 'object' ? keys(item).map((sub) => `${key}.${sub}`) : [key],
    );

  it('English has every Ukrainian key', () => {
    expect(keys(MESSAGES.en)).toEqual(keys(MESSAGES.uk));
  });
});
