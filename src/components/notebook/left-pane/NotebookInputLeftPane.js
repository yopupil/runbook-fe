import React from 'react';
import { connect } from 'react-redux';

import BaseComponent from 'shared/BaseComponent';
import AddCellLine from 'components/notebook/AddCellLine';
import { createCellAction, updateCellAction } from 'actions/CellActionCreators';
import './NotebookLeftPane.css';

class NotebookInputLeftPane extends BaseComponent {
  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    const { cellIndex } = this.props;
    return (
      <div className='notebook-left-pane'>
        {/*
            Show cell number
           */}
        <AddCellLine onAdd={this.createCellAbove} />
        <div className='notebook-left-pane__cell-number'>
          In:{cellIndex + 1}
        </div>
      </div>
    );
  }
  // *********************************************************
  // Private methods
  // *********************************************************
  handleToggle (field) {
    this.props.onCellChange({
      inputMeta: {
        ...this.props.cell.inputMeta,
        [field]: !this.props.cell.inputMeta[field]
      }
    });
  }

  createCellAbove = () => {
    let { cellIndex } = this.props;
    this.props.createCell(cellIndex, 'above');
  };
}

export default connect(
  (state, ownProps) => ({
    cell: state.cells[ownProps.cellId]
  }),
  (dispatch, ownProps) => ({
    // Create cell action creator
    createCell: (cellIndex, direction) =>
      dispatch(createCellAction(cellIndex, direction, ownProps.notebookId)),
    onCellChange: partial =>
      dispatch(
        updateCellAction(
          Object.assign(
            {
              id: ownProps.cellId
            },
            partial
          )
        )
      )
  })
)(NotebookInputLeftPane);
