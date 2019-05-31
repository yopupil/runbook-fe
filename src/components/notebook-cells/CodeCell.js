import React from 'react';
import { connect } from 'react-redux';

import {
  runCodeInCellAction,
  mountCellAsFileAction
} from 'actions/CellActionCreators';
import CodeEditor from 'components/notebook-cells/code-browser/CodeEditor';
import RunButton from 'components/notebook/RunButton';

import BaseComponent from 'shared/BaseComponent';

class CodeWidgetCell extends BaseComponent {
  // *********************************************************
  // Static methods
  // *********************************************************
  static getOutput ({ codeResult = {} }) {
    return (
      <div className='notebook-code-cell-output'>
        <pre>{codeResult.output}</pre>
        <pre style={{ color: 'red' }}>{codeResult.error}</pre>
      </div>
    );
  }
  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    const { code, mode, cell } = this.props;
    return (
      <div className='notebook-cell notebook-code-cell' id={cell.id}>
        <CodeEditor
          ref={inst => (this.editor = inst)}
          code={code}
          mode={mode}
          onSave={this.setOutput.bind(this, false)}
        />
        <RunButton onClick={this.setOutput.bind(this, true)} />
      </div>
    );
  }

  /**
   * Given editable state set the appropriate output
   */
  setOutput (run = true) {
    const code = this.editor.getCode();
    const { cell } = this.props;
    // Notify state tree and let the computations begin!
    const codeResult = run
      ? {
          output: '',
          error: ''
        }
      : cell.state.codeResult;
    // If cell is of type file, write changes to file as well so that execution is always correct
    // TODO: Tharun this needs to move into its own thunk
    if (cell.title.slice(0, 7) === 'file://') {
      this.props.onFileMount({
        kernelId: cell.kernelType,
        filePath: cell.title,
        content: code
      });
    }
    this.props.onCellContentChange({
      state: {
        ...cell.state,
        code: this.editor.getCode(),
        codeResult
      }
    });
    if (run) {
      // Dispatch the action here to update the kernel and get code output. We don't want to auto-execute code when notebook reloads
      this.props.handleCodeRun(code, cell.title);
    }
  }
}

export default connect(
  null,
  (dispatch, { cell }) => ({
    handleCodeRun (code, title) {
      dispatch(
        runCodeInCellAction(
          code,
          title,
          cell.id,
          cell.kernelType,
          cell.contentType
        )
      );
    },
    onFileMount: ({ kernelId, filePath, content }) =>
      dispatch(
        mountCellAsFileAction(cell.id, kernelId, {
          filePath,
          content
        })
      )
  })
)(CodeWidgetCell);
