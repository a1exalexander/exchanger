import React, { FC } from 'react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { SET_LANG } from '../../constants';
import { Lang, LANGS, useLang, useT } from '../../i18n';

const LABELS: { [key in Lang]: { short: string; name: string } } = {
  uk: { short: 'UA', name: 'Українська' },
  en: { short: 'EN', name: 'English' },
};

export const LangSwitch: FC<{ className?: string }> = ({ className }) => {
  const dispatch = useDispatch();
  const lang = useLang();
  const t = useT();
  const index = LANGS.indexOf(lang);
  const next = LANGS[(index + 1) % LANGS.length];

  // The whole pill is one button: tapping anywhere switches to the next language
  return (
    <button
      type="button"
      className={classNames('lang-switch', className)}
      aria-label={`${t.header.language}: ${LABELS[lang].name}`}
      title={LABELS[next].name}
      style={{ '--lang-index': index } as React.CSSProperties}
      onClick={() => dispatch({ type: SET_LANG, payload: next })}
    >
      <span className="lang-switch__thumb" aria-hidden="true" />
      {LANGS.map((item) => (
        <span
          key={item}
          lang={item}
          aria-hidden="true"
          className={classNames('lang-switch__item', { _active: lang === item })}
        >
          {LABELS[item].short}
        </span>
      ))}
    </button>
  );
};
