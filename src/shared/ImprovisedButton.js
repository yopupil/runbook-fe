// https://github.com/facebook/draft-js/issues/696
import React from 'react';
import PropTypes from 'prop-types';

const ImprovisedButton = props => (
  <div
    className={props.className}
    onMouseDown={event => {
      event.preventDefault();
      props.toggleFunction();
    }}
  >
    {props.children}
  </div>
);

ImprovisedButton.propTypes = {
  toggleFunction: PropTypes.func.isRequired
};
export default ImprovisedButton;
