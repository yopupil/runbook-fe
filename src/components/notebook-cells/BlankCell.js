import React from 'react';

import CodeEditor from 'components/notebook-cells/code-browser/CodeEditor';
import BaseComponent from 'shared/BaseComponent';

export default class BlankCell extends BaseComponent {
  // *********************************************************
  // Static methods
  // *********************************************************
  static propTypes = {};
  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    return (
      <div className='notebook-cell blank-notebook-cell'>
        {/*
             Allow user to choose via right hand side dropdown.
           */}
        {/*
            Auto detect based on user triggered command. If there is nothing,
            we will show plain CodeMirror with no mode
           */}
        <CodeEditor ref={inst => (this.editor = inst)} mode='javascript' />
      </div>
    );
  }

  getCode () {
    return this.editor.getCode();
  }
}
