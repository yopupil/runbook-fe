import React from 'react';
import { connect } from 'react-redux';

import BaseComponent from 'shared/BaseComponent';
import AddCellLine from 'components/notebook/AddCellLine';
import { createCellAction, updateCellAction } from 'actions/CellActionCreators';
import './NotebookLeftPane.css';

class NotebookOutputLeftPane extends BaseComponent {
  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    const { cellIndex } = this.props;
    return (
      <div className='notebook-left-pane'>
        {/*
            Visibility & Collapse modes
           */}
        <div
          className='notebook-left-pane__cell-number'
          style={{
            color: 'orange'
          }}
        >
          Out:{cellIndex + 1}
        </div>
        <AddCellLine above onAdd={this.createCellBelow} />
      </div>
    );
  }
  // *********************************************************
  // Private methods
  // *********************************************************
  handleToggle (field) {
    const { cell } = this.props;
    this.props.onCellChange({
      outputMeta: {
        ...cell.outputMeta,
        [field]: !cell.outputMeta[field]
      }
    });
  }

  createCellBelow = () => {
    let { cellIndex } = this.props;
    this.props.createCell(cellIndex, 'below');
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
)(NotebookOutputLeftPane);
