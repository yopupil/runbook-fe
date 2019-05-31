import React from 'react';
import PropTypes from 'prop-types';
import './AddCellLine.css';

export default function AddCellLine (props) {
  return (
    <div className='notebook__add-cell-line'>
      {props.above && <hr className='notebook-left-pane__hr' />}
      <span className='notebook__add-cell-line-trigger' onClick={props.onAdd}>
        +
      </span>
      {!props.above && <hr className='notebook-left-pane__hr' />}
    </div>
  );
}

AddCellLine.propTypes = {
  /**
   * Boolean indicating if button is above or below a view item
   */
  above: PropTypes.bool,
  /**
   * Callback function to call when user clicks add button
   */
  onAdd: PropTypes.func.isRequired
};
