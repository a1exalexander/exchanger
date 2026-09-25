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

  return (
    <div
      className={classNames('lang-switch', className)}
      role="radiogroup"
      aria-label={t.header.language}
      style={{ '--lang-index': LANGS.indexOf(lang) } as React.CSSProperties}
    >
      <span className="lang-switch__thumb" aria-hidden="true" />
      {LANGS.map((item) => (
        <button
          key={item}
          type="button"
          role="radio"
          lang={item}
          aria-checked={lang === item}
          aria-label={LABELS[item].name}
          title={LABELS[item].name}
          className={classNames('lang-switch__item', { _active: lang === item })}
          onClick={() => dispatch({ type: SET_LANG, payload: item })}
        >
          {LABELS[item].short}
        </button>
      ))}
    </div>
  );
};
