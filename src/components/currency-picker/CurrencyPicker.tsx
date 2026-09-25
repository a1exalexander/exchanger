import React, {
  FC,
  KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { ExchangesState } from '../../store/types';
import {
  CurrencyOption,
  getRecent,
  POPULAR,
  searchCurrencies,
} from '../../utils/currencyMeta';
import { hasBankRates } from '../../utils/resolveExchange';
import { DESKTOP_QUERY, useCurrencyOptions, useMediaQuery } from '../../hooks';
import { CurrencyIcon } from '../ui/CurrencyIcon';
import { IconCheck, IconClose, IconSearch } from '../ui/icons';

interface Props {
  open: boolean;
  anchor: HTMLElement | null;
  /** Currently selected code on this side */
  value: string;
  /** Code selected on the other side of the pair */
  other: string;
  title: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}

interface Section {
  title: string;
  items: CurrencyOption[];
}

const POPOVER_WIDTH = 380;
const CLOSE_DELAY = 160;

const pick = (options: CurrencyOption[], codes: string[]) =>
  codes
    .map((code) => options.find((option) => option.code === code))
    .filter(Boolean) as CurrencyOption[];

export const CurrencyPicker: FC<Props> = (props) => {
  const { open } = props;
  // keep the picker mounted while the closing animation plays
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }
    if (!mounted) return;
    setClosing(true);
    const timer = setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, CLOSE_DELAY);
    return () => clearTimeout(timer);
  }, [open, mounted]);

  if (!mounted) return null;
  return createPortal(
    <PickerPanel {...props} closing={closing} />,
    document.body,
  );
};

const PickerPanel: FC<Props & { closing: boolean }> = ({
  anchor,
  value,
  other,
  title,
  onSelect,
  onClose,
  closing,
}) => {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const currencies = useSelector((state: ExchangesState) => state.currencies);
  const options = useCurrencyOptions();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startY: number; startTime: number; dy: number } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sections: Section[] = useMemo(() => {
    if (query.trim()) {
      return [{ title: '', items: searchCurrencies(options, query) }];
    }
    const recent = pick(options, getRecent()).slice(0, 4);
    return [
      { title: 'Нещодавні', items: recent },
      { title: 'Популярні', items: pick(options, POPULAR) },
      {
        title: 'Усі валюти',
        items: options.filter(({ kind }) => kind === 'fiat'),
      },
      {
        title: 'Криптовалюти',
        items: options.filter(({ kind }) => kind === 'crypto'),
      },
      {
        title: 'Дорогоцінні метали',
        items: options.filter(({ kind }) => kind === 'metal'),
      },
    ].filter(({ items }) => items.length);
  }, [options, query]);

  const flat = useMemo(
    () => sections.reduce<CurrencyOption[]>((acc, s) => acc.concat(s.items), []),
    [sections],
  );

  // start keyboard navigation from the selected currency
  useEffect(() => {
    const index = flat.findIndex(({ code }) => code === value);
    setActive(Math.max(index, 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onQueryChange = (next: string) => {
    setQuery(next);
    // reset synchronously so Enter right after typing picks the first match
    setActive(0);
  };

  useLayoutEffect(() => {
    if (!isDesktop || !anchor) return;
    const update = () => {
      const rect = anchor.getBoundingClientRect();
      const width = Math.min(POPOVER_WIDTH, window.innerWidth - 32);
      const left = Math.min(
        Math.max(16, rect.left),
        window.innerWidth - width - 16,
      );
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: left + window.scrollX,
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [anchor, isDesktop]);

  useEffect(() => {
    // on touch screens the keyboard would cover the list, let people browse first
    const finePointer = window.matchMedia?.('(pointer: fine)').matches;
    if (isDesktop || finePointer) inputRef.current?.focus({ preventScroll: true });
  }, [isDesktop]);

  // lock page scroll under the bottom sheet
  useEffect(() => {
    if (isDesktop) return;
    const { documentElement } = document;
    const prev = documentElement.style.overflow;
    documentElement.style.overflow = 'hidden';
    return () => {
      documentElement.style.overflow = prev;
    };
  }, [isDesktop]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || anchor?.contains(target)) return;
      onClose();
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        anchor?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [anchor, onClose]);

  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${active}"]`,
    );
    node?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const select = (code: string) => {
    onSelect(code);
    if (isDesktop) anchor?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!flat.length) return;
    const pageSize = 6;
    const moves: { [key: string]: number } = {
      ArrowDown: 1,
      ArrowUp: -1,
      PageDown: pageSize,
      PageUp: -pageSize,
    };
    if (event.key in moves) {
      event.preventDefault();
      setActive((current) =>
        Math.min(Math.max(current + moves[event.key], 0), flat.length - 1),
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (flat[active]) select(flat[active].code);
    }
  };

  // bottom sheet: drag the header down to dismiss
  const onDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startY: event.clientY, startTime: Date.now(), dy: 0 };
    panelRef.current?.classList.add('_dragging');
  };
  const onDragMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !panelRef.current) return;
    const dy = Math.max(0, event.clientY - drag.current.startY);
    drag.current.dy = dy;
    panelRef.current.style.transform = `translateY(${dy}px)`;
  };
  const onDragEnd = () => {
    const panel = panelRef.current;
    const state = drag.current;
    drag.current = null;
    if (!panel || !state) return;
    panel.classList.remove('_dragging');
    const velocity = state.dy / Math.max(1, Date.now() - state.startTime);
    if (state.dy > 110 || (state.dy > 30 && velocity > 0.6)) {
      onClose();
      return;
    }
    panel.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.36, 0.64, 1)';
    panel.style.transform = '';
    setTimeout(() => {
      panel.style.transition = '';
    }, 300);
  };

  let index = -1;
  const listboxId = 'currency-picker-list';

  return (
    <>
      {!isDesktop && (
        <div
          className={classNames('currency-picker__backdrop', {
            _closing: closing,
          })}
          aria-hidden="true"
        />
      )}
      <div
        ref={panelRef}
        className={classNames(
          'currency-picker',
          isDesktop ? 'currency-picker--popover' : 'currency-picker--sheet',
          { _closing: closing },
        )}
        style={isDesktop ? position : undefined}
        role="dialog"
        aria-modal={!isDesktop}
        aria-label={title}
      >
        {!isDesktop && (
          <div
            className="currency-picker__head"
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onPointerCancel={onDragEnd}
          >
            <span className="currency-picker__handle" aria-hidden="true" />
            <h2 className="currency-picker__title">{title}</h2>
            <button
              type="button"
              className="currency-picker__close"
              onClick={onClose}
              aria-label="Закрити"
            >
              <IconClose />
            </button>
          </div>
        )}
        <label className="currency-picker__search">
          <IconSearch className="currency-picker__search-icon" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Код, назва або країна"
            aria-label="Пошук валюти"
            role="combobox"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={flat[active] ? `currency-option-${active}` : undefined}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="done"
          />
          {query && (
            <button
              type="button"
              className="currency-picker__clear"
              onClick={() => {
                onQueryChange('');
                inputRef.current?.focus();
              }}
              aria-label="Очистити пошук"
            >
              <IconClose />
            </button>
          )}
        </label>
        <div
          ref={listRef}
          className="currency-picker__list"
          role="listbox"
          id={listboxId}
          aria-label={title}
        >
          {!flat.length && (
            <p className="currency-picker__empty">
              Нічого не знайдено за запитом «{query.trim()}»
            </p>
          )}
          {sections.map((section) => (
            <div
              key={section.title || 'results'}
              className="currency-picker__section"
              role="group"
              aria-label={section.title || 'Результати пошуку'}
            >
              {section.title && (
                <div className="currency-picker__section-title" aria-hidden="true">
                  {section.title}
                </div>
              )}
              {section.items.map((option) => {
                index += 1;
                const itemIndex = index;
                const selected = option.code === value;
                const isOther = option.code === other;
                const bank = !isOther && hasBankRates(currencies, option.code, other);
                return (
                  <div
                    key={`${section.title}-${option.code}`}
                    id={`currency-option-${itemIndex}`}
                    data-index={itemIndex}
                    role="option"
                    aria-selected={selected}
                    className={classNames('currency-picker__option', {
                      _active: itemIndex === active,
                      _selected: selected,
                    })}
                    onPointerMove={() => isDesktop && setActive(itemIndex)}
                    onClick={() => select(option.code)}
                  >
                    <CurrencyIcon code={option.code} size={28} />
                    <span className="currency-picker__code">{option.code}</span>
                    <span className="currency-picker__name">{option.name}</span>
                    {bank && (
                      <span
                        className="currency-picker__tag"
                        title="Курс купівлі та продажу від Monobank"
                      >
                        mono
                      </span>
                    )}
                    {isOther && (
                      <span
                        className="currency-picker__tag currency-picker__tag--muted"
                        title="Валюти поміняються місцями"
                      >
                        обмін
                      </span>
                    )}
                    {selected && <IconCheck className="currency-picker__check" />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
