import React from 'react';
import PropTypes from 'prop-types';

import './CircleText.css';

export default function CircleText (props) {
  let { style, text, size, dimension, ...otherProps } = props;
  if (dimension !== undefined) {
    style.width = style.width || dimension + 'px';
    style.height = style.height || dimension + 'px';
    style.lineHeight = style.lineHeight || dimension * 1 + 'px';
    style.fontSize = style.fontSize || dimension * 0.6 + 'px';
  }
  style = Object.assign(
    {
      color: '#ffffff',
      borderColor: props.style.background
    },
    style
  );
  return (
    <span
      className={`circle-text circle-text--${size}`}
      style={style}
      {...otherProps}
    >
      {text}
    </span>
  );
}

CircleText.propTypes = {
  /**
   * The size of the circle text component
   */
  size: PropTypes.oneOf(['small', 'medium', 'large', 'custom']),
  /**
   * The text to display inside circle. The length of text must be
   * small, otherwise the circle will be able to accomodate it
   */
  text: PropTypes.string,
  /**
   * Custom styles
   */
  style: PropTypes.object,
  /**
   * Optional number that dictates the sizing of the icon. This overrides size
   */
  dimension: PropTypes.number
};

CircleText.defaultProps = {
  size: 'medium'
};
