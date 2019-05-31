import React from 'react';

import { classNames as cx } from 'utils/DOMUtils';
import './PaginationPad.css';

export default function PaginationPad (props) {
  const { start, size, total, showLabel, paginationLabel } = props;
  const prevDisabled = start === 0;
  const nextDisabled = start + size >= total;
  return (
    <div className='pagination-pad'>
      {showLabel && (
        <p className='pagination-pad__text'>
          {size === 1
            ? `Showing ${Math.min(total, start + 1)} of ${total} ${
                paginationLabel ? paginationLabel : 'records'
              }`
            : `Showing ${Math.min(total, start + 1)}-${Math.min(
                start + size,
                total
              )} of ${total} ${paginationLabel ? paginationLabel : 'records'}`}
        </p>
      )}
      <button
        className={cx(
          'pagination-pad__button',
          prevDisabled && 'pagination-pad__button--disabled'
        )}
        disabled={prevDisabled}
        onClick={() => props.paginate(start - size, start)}
      >
        <i className='zmdi zmdi-chevron-left zmdi-hc-lg' />
      </button>
      <button
        className={cx(
          'pagination-pad__button',
          nextDisabled && 'pagination-pad__button--disabled'
        )}
        disabled={nextDisabled}
        onClick={() =>
          props.paginate(start + size, Math.min(total, start + size * 2))
        }
      >
        <i className='zmdi zmdi-chevron-right zmdi-hc-lg' />
      </button>
    </div>
  );
}

PaginationPad.defaultProps = {
  showLabel: true,
  start: 0,
  size: 10
};
