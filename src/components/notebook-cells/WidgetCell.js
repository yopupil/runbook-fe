import React from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import {
  runCodeInCellAction,
  mountCellAsFileAction
} from 'actions/CellActionCreators';
import WidgetFrame from 'components/notebook-cells/WidgetFrame';
import CodeEditor from 'components/notebook-cells/code-browser/CodeEditor';
import RunButton from 'components/notebook/RunButton';

import BaseComponent from 'shared/BaseComponent';

export default class WidgetCell extends BaseComponent {
  // *********************************************************
  // Static methods
  // *********************************************************
  static getOutput ({ jsCode, htmlCode, cssCode }) {
    return (
      <div className='notebook-widget-cell-output'>
        <WidgetFrame jsCode={jsCode} htmlCode={htmlCode} cssCode={cssCode} />
      </div>
    );
  }
  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    const { cell = {} } = this.props;
    const { htmlCode, jsCode, cssCode } = (cell && cell.state) || {};
    return (
      <div className='notebook-cell notebook-code-cell' id={cell.id}>
        {/* Show tabs */}
        <Tabs forceRenderTabPanel onSelect={this.handleTabSelect.bind(this)}>
          <TabList>
            <Tab>HTML</Tab>
            <Tab>JS</Tab>
            <Tab>CSS</Tab>
          </TabList>
          <TabPanel>
            <CodeEditor
              ref={inst => (this.htmlEditor = inst)}
              code={htmlCode}
              mode={'html'}
            />
          </TabPanel>
          <TabPanel>
            <CodeEditor
              ref={inst => (this.jsEditor = inst)}
              code={jsCode}
              mode={'javascript'}
            />
          </TabPanel>
          <TabPanel>
            <CodeEditor
              ref={inst => (this.cssEditor = inst)}
              code={cssCode}
              mode={'css'}
            />
          </TabPanel>
        </Tabs>
        <RunButton onClick={this.setOutput.bind(this)} />
      </div>
    );
  }

  /**
   * Given editable state set the appropriate output
   */
  setOutput () {
    const { cell } = this.props;
    this.props.onCellContentChange({
      state: {
        ...cell.state,
        htmlCode: this.htmlEditor.getCode(),
        jsCode: this.jsEditor.getCode(),
        cssCode: this.cssEditor.getCode()
      }
    });
  }

  handleTabSelect (index) {
    setTimeout(() => {
      // This hack is necessary because the parent node is hidden via TabPanel
      // When editor is suddenly made visible, it does not expand and show code.
      switch (index) {
        case 0:
          return this.htmlEditor.refresh();
        case 1:
          return this.jsEditor.refresh();
        case 2:
          return this.cssEditor.refresh();
        default:
          break;
      }
    }, 0);
  }
}
