import React from 'react';
import { connect } from 'react-redux';
import BaseComponent from 'shared/BaseComponent';
import { getComponent } from 'components/notebook-cells/CellInputWrapper';
import EndpointDefinitionModal from 'components/endpoints/EndpointDefinitionModal';
import { EndpointToggle } from 'components/notebook/left-pane/PaneActionItems';
import DropdownContainer from 'shared/dropdown/DropdownContainer';
import { classNames as cx } from 'utils/DOMUtils';

import {
  updateCellAction,
  createEndpointAction
} from 'actions/CellActionCreators';

import {
  VisibilityToggle,
  CollapseToggle
} from 'components/notebook/left-pane/PaneActionItems';

class CellOutputWrapper extends BaseComponent {
  constructor (...args) {
    super(...args);
    this.autoBind();
  }
  render () {
    const { cell, kernel, notebookId } = this.props;
    const { isVisible, isCollapsed, endpointDefinition } = cell.outputMeta;
    let Component = getComponent(cell.type, cell.contentType, cell.kernelType);
    const isFile = cell.title && cell.title.slice(0, 7) === 'file://';
    let ComponentOutput;
    if (Component.getOutput) {
      ComponentOutput = (
        <div
          className={cx(
            !isVisible && 'notebook-cell-input-wrapper--hidden',
            isCollapsed && 'notebook-cell-input-wrapper--collapsed'
          )}
        >
          {Component.getOutput(cell.state, {
            notebookId,
            ...cell
          })}
        </div>
      );
    } else {
      ComponentOutput = <span />;
    }
    return (
      <div
        className='cell-dropdown'
        style={{
          opacity: isVisible ? 1 : 0.5
        }}
      >
        <div className='notebook-cell-output-wrapper'>{ComponentOutput}</div>
        <div className='cell-dropdown-container__header'>
          <div className='cell-dropdown-container__header-left' />
          <div className='cell-dropdown-container__header-right row'>
            <div
              className='ten columns'
              style={{
                textAlign: 'left'
              }}
            >
              {isFile && kernel ? (
                <DropdownContainer
                  ref={el => (this.endpointDropdown = el)}
                  trigger={(isOpen, toggleOpen) => (
                    <React.Fragment>
                      <EndpointToggle
                        isEndpointDefined={endpointDefinition !== undefined}
                        onToggle={toggleOpen}
                      />
                      {endpointDefinition && (
                        <code className='endpoint-definition-summary'>
                          {'/' +
                            endpointDefinition.name +
                            '/' +
                            endpointDefinition.path +
                            (endpointDefinition.query
                              ? '?' + endpointDefinition.query
                              : '')}
                        </code>
                      )}
                    </React.Fragment>
                  )}
                >
                  <EndpointDefinitionModal
                    endpointDefinition={endpointDefinition}
                    onCancel={this.closeEndpointDropdown}
                    onCreate={this.handleEndpointCreation}
                  />
                </DropdownContainer>
              ) : (
                <span>&nbsp;</span>
              )}
            </div>
            <div className='two columns'>
              <CollapseToggle
                isCollapsed={isCollapsed}
                onToggle={this.handleToggle.bind(this, 'isCollapsed')}
              />
              <VisibilityToggle
                isVisible={isVisible}
                onToggle={this.handleToggle.bind(this, 'isVisible')}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  closeEndpointDropdown () {
    if (this.endpointDropdown) {
      this.endpointDropdown.toggleOpen();
    }
  }

  handleEndpointCreation (config) {
    // Create an endpoint under cell
    this.props.onCreateEndpoint({
      config,
      id: this.props.cellId,
      kernelId: this.props.kernel.id,
      filePath: this.props.cell.title
    });
  }

  handleToggle (field) {
    const { cell } = this.props;
    this.props.onCellChange({
      outputMeta: {
        ...cell.outputMeta,
        [field]: !cell.outputMeta[field]
      }
    });
  }
}

export default connect(
  (state, ownProps) => ({
    cell: state.cells[ownProps.cellId],
    kernel: state.kernels[state.cells[ownProps.cellId].kernelType]
  }),
  (dispatch, ownProps) => ({
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
      ),
    onCreateEndpoint: payload => dispatch(createEndpointAction(payload))
  })
)(CellOutputWrapper);
