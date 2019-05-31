import React from 'react';
import PropTypes from 'prop-types';
import { classNames as cx } from 'utils/DOMUtils';

import './Checkbox.css';

export default function Checkbox (props) {
  const { id, value, backgroundColor, onChange } = props;
  return (
    <React.Fragment>
      <label
        htmlFor={`checkbox-field-${id}`}
        className={cx('checkbox-label', value && 'checkbox-label--checked')}
        style={{
          background: value ? backgroundColor : undefined
        }}
      />
      <input
        id={`checkbox-field-${id}`}
        className='checkbox-field'
        type='checkbox'
        checked={!!value}
        onChange={e => onChange(!value, e)}
      />
    </React.Fragment>
  );
}

Checkbox.propTypes = {
  /**
   * The id to use for the checkbox
   */
  id: PropTypes.string.isRequired,
  /**
   * The value of the checkbox
   */
  value: PropTypes.bool,
  /**
   * The callback function to use when checkbox is checked
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Optional background color
   */
  backgroundColor: PropTypes.string
};
