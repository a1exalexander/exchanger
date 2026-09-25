import React, { FC, SVGAttributes } from 'react';

type IconProps = SVGAttributes<SVGElement>;

const Svg: FC<IconProps> = ({ children, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {children}
  </svg>
);

export const IconChevron: FC<IconProps> = (props) => (
  <Svg {...props}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const IconSwap: FC<IconProps> = (props) => (
  <Svg {...props}>
    <path d="M7 4v16M7 4 3.5 7.5M7 4l3.5 3.5M17 20V4m0 16-3.5-3.5M17 20l3.5-3.5" />
  </Svg>
);

export const IconSearch: FC<IconProps> = (props) => (
  <Svg {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);

export const IconClose: FC<IconProps> = (props) => (
  <Svg {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Svg>
);

export const IconCheck: FC<IconProps> = (props) => (
  <Svg {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);

export const IconSun: FC<IconProps> = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
);

export const IconMoon: FC<IconProps> = (props) => (
  <Svg {...props}>
    <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
  </Svg>
);

export const IconGlobe: FC<IconProps> = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
  </Svg>
);

/** App logo: two exchange arrows on a gradient tile */
export const AppLogo: FC<IconProps> = (props) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" {...props}>
    <defs>
      <linearGradient id="app-logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#3d81ff" />
        <stop offset="1" stopColor="#17a781" />
      </linearGradient>
    </defs>
    <rect className="app-logo__tile" width="32" height="32" rx="9" fill="url(#app-logo-gradient)" />
    <g fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12.5h13.5M18.5 8.5l4 4-4 4" />
      <path d="M23 19.5H9.5M13.5 15.5l-4 4 4 4" />
    </g>
  </svg>
);
