import React from 'react';
import { connect } from 'react-redux';

import BaseComponent from 'shared/BaseComponent';
import AddCellLine from 'components/notebook/AddCellLine';
import CellContainer from 'components/notebook-cells/CellContainer';
import { createCellAction } from 'actions/CellActionCreators';
import './Notebook.css';

class Notebook extends BaseComponent {
  // *********************************************************
  // Constructor
  // *********************************************************
  constructor (...args) {
    super(...args);
    this.state = {
      cells: []
    };
    this.autoBind();
  }
  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    const { notebook, notebookId, createCell } = this.props;
    return (
      <div className='notebook'>
        {notebook.cellIds.length === 0 ? (
          <AddCellLine onAdd={() => createCell(-1, 'below')} />
        ) : null}
        {notebook.cellIds.map((cellId, i) => {
          return (
            <div className='notebook__cell' key={i}>
              <div className='notebook__cell-type-selector' />
              <CellContainer
                cellId={cellId}
                cellIndex={i}
                notebookId={notebookId}
              />
            </div>
          );
        })}
      </div>
    );
  }

  // // *********************************************************
  // // Private methods
  // // *********************************************************o
  // /**
  //  * Add a new cell into the notebook
  //  * @param {Number} cellIndex Numeric index of the cell
  //  * @param {String} direction Whether to add the cell above or below
  //  */
  // addCell(cellIndex, direction = 'below') {
  //   let {
  //     cells
  //   } = this.state;
  //   let start, end;
  //   // Add a new blank cell. User can select type of cell or start typing apppropriate code
  //   // to trigger cell-type. (auto-detect). Or we can use the name of the cell with extension.
  //   if (direction === 'below') {
  //     start = cellIndex + 1;
  //     end = cellIndex + 2;
  //   } else {
  //     start = cellIndex - 1;
  //     end = cellIndex;
  //   }
  //   // cellsById & notebook[id].cells => array of cell ids.
  //   // notebooksById{nbId} => [array of cells]
  //   cells = cells.slice(0, start).concat([{
  //     type: BlankCell,
  //     props: {},
  //     inputProps: {
  //       isReadOnly: false,
  //       isCollapsed: false,
  //       isVisible: true
  //     },
  //     outputProps: {
  //       isCollapsed: false,
  //       isVisible: true
  //     }
  //   }]).concat(cells.slice(end));
  //   this.setState({
  //     cells
  //   });
  // }

  // handleCellContentChange(cellIndex, cellProps) {
  //   let cell = this.state.cells[cellIndex];
  //   cell.props = cellProps;
  //   this.forceUpdate();
  // }

  // handleCellTypeSelect(cellIndex, cellType) {
  //   let cell = this.state.cells[cellIndex];
  //   cell.inputProps.selectedCellType = cellType;
  //   // Registry will decide the type of the cell.
  //   cell.type = Registry[cellType.cellType];
  //   this.forceUpdate();
  // }

  // handleKernelSelect(cellIndex, kernel) {
  //   let cell = this.state.cells[cellIndex];
  //   cell.inputProps.selectedKernel = kernel;
  //   this.forceUpdate();
  // }

  // handleCellMetaPropertyChange(cellIndex, segment, state) {
  //   let cell = this.state.cells[cellIndex];
  //   cell[segment + 'Props'] = state;
  //   this.forceUpdate();
  // }
}

export default connect(
  state => ({
    // Until we have `create` notebook functionality we will use `new` as id.
    notebook: state.notebooks['new'],
    notebookId: 'new'
  }),
  (dispatch, ownProps) => ({
    // Create cell action creator
    createCell: (cellIndex, direction) =>
      dispatch(createCellAction(cellIndex, direction, 'new'))
  })
)(Notebook);
