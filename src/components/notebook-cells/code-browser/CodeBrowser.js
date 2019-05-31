import React from 'react';

import BaseComponent from 'shared/BaseComponent';
import FileBrowser from 'components/notebook-cells/code-browser/FileBrowser';
import CodeEditor from 'components/notebook-cells/code-browser/CodeEditor';

export default class CodeBrowser extends BaseComponent {
  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    return (
      <div className='code-browser'>
        <div className='row'>
          <div className='three columns'>
            <FileBrowser
              tree={{
                name: 'src',
                type: 'folder',
                expanded: true,
                children: [
                  {
                    name: 'components',
                    type: 'folder',
                    expanded: true,
                    children: [
                      {
                        name: 'WidgetComponent.js',
                        type: 'file'
                      }
                    ]
                  }
                ]
              }}
            />
          </div>
          <div className='nine columns'>
            <CodeEditor mode='javascript' />
          </div>
        </div>
      </div>
    );
  }
}
