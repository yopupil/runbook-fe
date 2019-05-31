import React from 'react';

import BaseComponent from 'shared/BaseComponent';
import CodeEditor from 'components/notebook-cells/code-browser/CodeEditor';
import RunButton from 'components/notebook/RunButton';
import { auraCommands } from 'commands';

export default class CommandCell extends BaseComponent {
  // *********************************************************
  // Static methods
  // *********************************************************
  static getOutput ({ code }, props) {
    try {
      // eslint-disable-next-line
      return new Function(
        'aura',
        `
        return ${code}
      `
      )(auraCommands)(props);
    } catch (e) {
      return <span className='command-error-message'>{String(e)}</span>;
    }
  }

  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    const { code, mode } = this.props;
    return (
      <div className='notebook-cell notebook-command-cell'>
        {/*
            Specific commands that can be executed by the user to do project specific actions
            e.g start kernels, install libraries in kernels etc. These are executed outside of
            the purview of the kernel's command instance. The output of the command depends on different handlers
            that are defined.
           */}
        <CodeEditor
          ref={inst => (this.editor = inst)}
          code={code}
          mode={mode}
        />
        <RunButton onClick={this.setOutput} />
      </div>
    );
  }

  /**
   * Given editable state set the appropriate output
   */
  setOutput = () => {
    // Notify state tree and let the computations begin!
    this.props.onCellContentChange({
      state: {
        code: this.editor.getCode()
      }
    });
  };
}
