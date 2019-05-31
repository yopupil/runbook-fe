import React from 'react';

import BaseComponent from 'shared/BaseComponent';
import NotebookInputLeftPane from 'components/notebook/left-pane/NotebookInputLeftPane';
import NotebookOutputLeftPane from 'components/notebook/left-pane/NotebookOutputLeftPane';
import CellDropdownContainer from 'components/notebook-cells/dropdowns/CellDropdownContainer';
import CellInputWrapper from 'components/notebook-cells/CellInputWrapper';
import CellOutputWrapper from 'components/notebook-cells/CellOutputWrapper';
import ReactTooltip from 'react-tooltip';

export default class CellContainer extends BaseComponent {
  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    const { notebookId, cellIndex, cellId } = this.props;
    return (
      <div
        className='notebook-cell-container'
        style={{
          margin: '20px 0px'
        }}
      >
        <ReactTooltip />
        <div className='notebook-cell-container__dropdowns'>
          <CellDropdownContainer cellId={cellId} notebookId={notebookId} />
        </div>
        <div className='notebook-cell-container__row'>
          <div className='notebook-cell-container__left-pane'>
            <NotebookInputLeftPane
              notebookId={notebookId}
              cellIndex={cellIndex}
              cellId={cellId}
            />
          </div>
          <div className='notebook-cell-container__cell'>
            <CellInputWrapper cellId={cellId} />
          </div>
        </div>
        <div className='notebook-cell-container__row'>
          <CellOutputWrapper cellId={cellId} notebookId={notebookId} />
          <div
            className='notebook-cell-container__left-pane'
            style={{
              top: '10px'
            }}
          >
            <NotebookOutputLeftPane
              cellIndex={cellIndex}
              notebookId={notebookId}
              cellId={cellId}
            />
          </div>
        </div>
      </div>
    );
  }
}
