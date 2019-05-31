import React from 'react';
import { withRouter } from 'react-router-dom';

function NavigateBack (props) {
  return <span onClick={props.history.goBack}>{props.children}</span>;
}

export default withRouter(NavigateBack);
