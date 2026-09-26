import React, { FC } from 'react';
import classNames from 'classnames';

export const Skeleton: FC<{ rows?: number; className?: string }> = ({
  rows = 3,
  className,
}) => (
  <div className={classNames('skeleton', className)} aria-hidden="true">
    {Array.from({ length: rows }, (_, index) => (
      <span key={index} className="skeleton__row" />
    ))}
  </div>
);
