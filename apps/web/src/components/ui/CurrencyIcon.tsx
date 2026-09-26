import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { getCurrencyIcon } from '../../utils/currencyMeta';

interface Props {
  code: string;
  size?: number;
  className?: string;
}

/** Flag or coin icon; falls back to a round badge with the currency code */
export const CurrencyIcon: FC<Props> = ({ code, size = 24, className }) => {
  const src = getCurrencyIcon(code);
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size };

  if (!src || failed) {
    return (
      <span
        className={classNames('currency-icon currency-icon--badge', className)}
        style={{ ...style, fontSize: Math.max(8, size * 0.32) }}
        aria-hidden="true"
      >
        {code.slice(0, 3)}
      </span>
    );
  }

  return (
    <img
      className={classNames('currency-icon', className)}
      style={style}
      src={src}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};
