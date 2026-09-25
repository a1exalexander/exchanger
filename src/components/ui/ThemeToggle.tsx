import React, { FC } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { SET_THEME } from '../../constants';
import { ExchangesState } from '../../store/types';
import { useT } from '../../i18n';
import { IconMoon, IconSun } from './icons';

export const ThemeToggle: FC<{ className?: string }> = ({ className }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state: ExchangesState) => state.theme);
  const t = useT();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={t.theme.label}
      title={isDark ? t.theme.toLight : t.theme.toDark}
      className={classNames('theme-toggle', className, { _dark: isDark })}
      onClick={() =>
        dispatch({ type: SET_THEME, payload: isDark ? 'light' : 'dark' })
      }
    >
      <span className="theme-toggle__thumb">
        {isDark ? <IconMoon /> : <IconSun />}
      </span>
    </button>
  );
};
