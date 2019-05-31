import React from 'react';
import { classNames as cx } from 'utils/DOMUtils';
import { getColorForName } from 'utils/Palette';
import './CollapsedLabel.css';

export default function CollapsedLabel (props) {
  const { isCircular, text, color, onClick } = props;
  return (
    <label
      className={cx(
        'collapsed-label',
        isCircular && 'collpased-label--circular'
      )}
      onClick={onClick}
      style={{
        color:
          color || getColorForName(typeof text === 'string' ? text : '#0066ff')
      }}
    >
      {text}
    </label>
  );
}

CollapsedLabel.defaultProps = {
  text: '*'
};
