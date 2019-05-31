import React from 'react';
import { connect } from 'react-redux';

import BaseComponent from 'shared/BaseComponent';

class CodeRunner extends BaseComponent {
  // *********************************************************
  // Render
  // *********************************************************
  render () {
    const { output } = this.props;
    // The output of the execution is stored in store. We simply display the output
    return <pre>{output}</pre>;
  }
}
