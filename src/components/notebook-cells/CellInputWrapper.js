import React from 'react';
import { connect } from 'react-redux';

import BaseComponent from 'shared/BaseComponent';
import {
  CellTypes,
  KernelDefinitions,
  KernelTypes
} from 'constants/CellConstants';
import { updateCellAction } from 'actions/CellActionCreators';
import CommandCell from './CommandCell';
import MarkdownCell from './MarkdownWidgetCell';
import BlankCell from './BlankCell';
import WidgetCell from './WidgetCell';
import CodeCell from './CodeCell';
import { classNames as cx } from 'utils/DOMUtils';

export function getComponent (cellType, cellContentType, kernelType) {
  switch (cellType) {
    case CellTypes.COMMAND:
      return CommandCell;
    case CellTypes.CODE:
      if (kernelType === KernelDefinitions[KernelTypes.BROWSER].value) {
        return WidgetCell;
      }
      return CodeCell;
    case CellTypes.DOC:
      switch (cellContentType) {
        case 'MARKDOWN':
          return MarkdownCell;
        default:
          return BlankCell;
      }
    default:
      return BlankCell;
  }
}

class CellInputWrapper extends BaseComponent {
  render () {
    const { cell, onCellContentChange } = this.props;
    const Component = getComponent(
      cell.type,
      cell.contentType,
      cell.kernelType
    );
    const { isVisible, isCollapsed, isReadOnly } = cell.inputMeta;
    return (
      <div
        className={cx(
          !isVisible && 'notebook-cell-input-wrapper--hidden',
          isCollapsed && 'notebook-cell-input-wrapper--collapsed',
          isReadOnly && 'notebook-cell-input-wrapper--read-only'
        )}
      >
        <Component
          code={cell.state.code}
          mode={cell.contentType ? cell.contentType.toLowerCase() : undefined}
          cell={cell}
          onCellContentChange={onCellContentChange}
        />
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    cell: state.cells[ownProps.cellId]
  }),
  (dispatch, ownProps) => ({
    onCellContentChange: partial =>
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
)(CellInputWrapper);
