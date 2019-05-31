import React from 'react';
import PropTypes from 'prop-types';

export default function RunButton (props) {
  return (
    <span className='notebook__run-button'>
      <i className='zmdi zmdi-play-circle zmdi-hc-lg' onClick={props.onClick} />
    </span>
  );
}

RunButton.propTypes = {
  /**
   * The callback function to execute when run button is clicked
   * @type {Function}
   */
  onClick: PropTypes.func.isRequired
};
