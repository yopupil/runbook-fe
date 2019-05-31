import React from 'react';
import snarkdown from 'snarkdown';
import CodeEditor from 'components/notebook-cells/code-browser/CodeEditor';
import RunButton from 'components/notebook/RunButton';

import BaseComponent from 'shared/BaseComponent';

export default class MarkdownWidgetCell extends BaseComponent {
  // *********************************************************
  // Static methods
  // *********************************************************
  static cellType = 'markdown';

  static getOutput ({ code }) {
    return (
      <article
        className='notebook-markdown-cell__output markdown-body'
        dangerouslySetInnerHTML={{
          __html: snarkdown(code || '')
        }}
      />
    );
  }

  // *********************************************************
  // Constructor
  // *********************************************************
  constructor (...args) {
    super(...args);
    this.autoBind();
  }
  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    return (
      <div className='notebook-cell notebook-markdown-cell'>
        {/**
         * Each cell has an editable view && and output view. Some cells do not produce
         * output, or are hidden, user can toggle the state of those cells to decide if the cell
         * must be hidden
         */}
        <CodeEditor
          ref={inst => (this.editor = inst)}
          code={this.props.code}
          mode={'markdown'}
        />
        <RunButton onClick={this.setOutput} />
      </div>
    );
  }

  /**
   * Given editable state set the appropriate output
   */
  setOutput () {
    // Notify state tree and let the computations begin!
    this.props.onCellContentChange({
      state: {
        code: this.editor.getCode()
      }
    });
  }
}
