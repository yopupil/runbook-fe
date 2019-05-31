import React from 'react';
import PropTypes from 'prop-types';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-light.css';
import 'codemirror/mode/css/css';
import './CodeEditor.css';
import { debounce } from 'utils/OptimizationUtils';

import BaseComponent from 'shared/BaseComponent';

export default class CodeEditor extends BaseComponent {
  // *********************************************************
  // Static methods
  // *********************************************************
  static propTypes = {
    mode: PropTypes.oneOf([
      'javascript',
      'python',
      'java',
      'json',
      'shell',
      'golang',
      'yaml',
      'markdown',
      'html',
      'css',
      'redis'
    ]),
    code: PropTypes.string,
    onSave: PropTypes.func
  };

  static defaultProps = {
    onSave: BaseComponent.NOOP
  };

  static langModeToCodeMirrorMode = {
    javascript: 'text/javascript',
    json: 'application/json',
    java: 'text/x-java',
    python: 'python',
    golang: 'text/x-go',
    markdown: 'gfm',
    shell: 'shell',
    yaml: 'yaml',
    html: 'text/html',
    css: 'text/css',
    redis: 'text/plain'
  };

  // *********************************************************
  // Constructor
  // *********************************************************
  constructor (props, ...args) {
    super(props, ...args);
    this.state = {};
    this.autoBind();
    this.handleChange = debounce(this.handleChange.bind(this), 1000);
  }
  // *********************************************************
  // React methods
  // *********************************************************
  getCode () {
    return this.el.editor.getValue();
  }

  render () {
    const { mode, code, onSave } = this.props;
    return (
      <div className='ReactCodeMirror'>
        <CodeMirror
          ref={this.setElement}
          value={code}
          options={{
            mode: CodeEditor.langModeToCodeMirrorMode[mode],
            indentUnit: 4,
            viewportMargin: 150,
            theme: 'base16-light',
            extraKeys: {
              Tab: cm => cm.execCommand('indentMore'),
              'Shift-Tab': cm => cm.execCommand('indentLess')
            }
          }}
          onBlur={onSave}
        />
      </div>
    );
  }

  setElement (el) {
    this.el = el;
  }

  refresh () {
    this.el.editor.refresh();
  }

  handleChange () {
    this.props.onSave();
  }
}
