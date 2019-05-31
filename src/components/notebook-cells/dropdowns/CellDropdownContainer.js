import React from 'react';
import { connect } from 'react-redux';

import BaseComponent from 'shared/BaseComponent';
import CellSelectorDropdown from 'components/notebook-cells/dropdowns/CellSelectorDropdown';
import CodeFileInput from 'components/notebook-cells/code-browser/CodeFileInput';

import {
  ReadOnlyToggle,
  VisibilityToggle,
  CollapseToggle
} from 'components/notebook/left-pane/PaneActionItems';

import {
  updateCellAction,
  mountCellAsFileAction
} from 'actions/CellActionCreators';
import { debounce } from 'utils/OptimizationUtils';
import {
  CellTypes,
  LanguageDefinitions,
  KernelDefinitions
} from 'constants/CellConstants';
import './CellDropdownContainer.css';

const CELL_TYPE_ICONS = {
  [CellTypes.COMMAND]: 'eject-alt',
  [CellTypes.DOC]: 'view-headline',
  [CellTypes.CODE]: 'code'
};

class CellDropdownContainer extends BaseComponent {
  // *********************************************************
  // Constructor
  // *********************************************************
  constructor (...args) {
    super(...args);
    this.handleTitleChange = debounce(this.handleTitleChange.bind(this), 2000);
    this.autoBind();
  }
  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    let {
      cell,
      kernels,
      onCellContentTypeChange,
      onCellKernelTypeChange
    } = this.props;
    // Kernel dependencies are sent in by selector. Command outputs or server
    // comm can trigger updates. Using shallow checks, we can optimize re-rendering
    // of cells
    const { isCollapsed, isReadOnly, isVisible } = cell.inputMeta;
    const languages = Object.keys(LanguageDefinitions).map(
      k => LanguageDefinitions[k]
    );
    return (
      <div
        className='cell-dropdown'
        style={{
          opacity: isVisible ? 1 : 0.5
        }}
      >
        <div className='cell-dropdown-container__header'>
          <div className='cell-dropdown-container__header-left' />
          <div className='cell-dropdown-container__header-right'>
            {/*
                Show a collapsed abbreviated version of language and kernel information
               */}
            <div className='row'>
              <div
                className='eight columns'
                style={{
                  textAlign: 'left'
                }}
              >
                {/*
                    The type of the cell: Command, Doc, Code etc
                   */}
                <CellSelectorDropdown
                  name={'Cell Type'}
                  selections={Object.keys(CellTypes).map(k => ({
                    name: CellTypes[k],
                    value: k,
                    icon: CELL_TYPE_ICONS[k]
                  }))}
                  selectedItem={{
                    name: CellTypes[cell.type],
                    value: cell.type,
                    icon: CELL_TYPE_ICONS[cell.type]
                  }}
                  onSelect={this.onCellTypeChange}
                  labelAccessor={d => (
                    <i className={`zmdi zmdi-${d.icon} zmdi-hc-lg`} />
                  )}
                  secondaryLabelAccessor={d => d.name}
                />
                <CodeFileInput
                  title={cell.title}
                  onChange={this.handleTitleChange}
                />
              </div>
              <div className='two columns'>
                <CellSelectorDropdown
                  name='Kernel'
                  selections={kernels.filter(k => {
                    if (
                      cell.type === CellTypes.DOC ||
                      cell.type === CellTypes.COMMAND
                    ) {
                      return k.value === KernelDefinitions.BROWSER.value;
                    }
                    return true;
                  })}
                  selectedItem={kernels.find(k => k.value === cell.kernelType)}
                  onSelect={onCellKernelTypeChange}
                  secondaryLabelAccessor={d =>
                    d.image ? d.image + ':' + d.version : d.value
                  }
                  labelAccessor={d => d.name}
                  collapsedLabelAccessor={d => d.name}
                />
                <CellSelectorDropdown
                  name={'Language'}
                  selections={languages.filter(lang => {
                    // Either the kernel must support the language or cell type might restrict language
                    if (cell.type === CellTypes.DOC) {
                      return lang.value === LanguageDefinitions.MARKDOWN.value;
                    }
                    if (cell.type === CellTypes.COMMAND) {
                      return (
                        LanguageDefinitions.JAVASCRIPT.value === lang.value
                      );
                    }
                    if (cell.type === CellTypes.CODE) {
                      const kernel = kernels.find(
                        k => k.value === cell.kernelType
                      );
                      if (!kernel) {
                        return (
                          lang.value === LanguageDefinitions.JAVASCRIPT.value
                        );
                      }
                      return kernel.supportedLanguages.indexOf(lang.value) > -1;
                    }
                    return false;
                  })}
                  selectedItem={languages.find(
                    item => item.value === cell.contentType
                  )}
                  labelAccessor={d => d.name}
                  secondaryLabelAccessor={d => d.extension}
                  onSelect={onCellContentTypeChange}
                  collapsedLabelAccessor={d => d.extension}
                />
              </div>
              <div className='two columns'>
                <ReadOnlyToggle
                  isReadOnly={isReadOnly}
                  onToggle={this.handleToggle.bind(this, 'isReadOnly')}
                />
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
      </div>
    );
  }

  toggleOpen () {
    this.setState({
      open: !this.state.open
    });
  }

  handleToggle (field) {
    this.props.onCellChange({
      inputMeta: {
        ...this.props.cell.inputMeta,
        [field]: !this.props.cell.inputMeta[field]
      }
    });
  }

  handleTitleChange ({ type, value }) {
    if (type === 'file') {
      // Mount cell as file
      return this.props.onFileMount({
        filePath: value,
        kernelId: this.props.cell.kernelType,
        // To get the latest code, we need to use ref id
        content: this.props.cell.state.code
      });
    }
    this.props.onCellChange({
      title: value
    });
  }

  onCellTypeChange = newCellType => {
    this.props.onCellTypeChange(newCellType);
    if (newCellType === CellTypes.DOC) {
      this.props.onCellContentTypeChange(LanguageDefinitions.MARKDOWN.value);
    } else if (newCellType === CellTypes.COMMAND) {
      this.props.onCellContentTypeChange(LanguageDefinitions.JAVASCRIPT.value);
    }
  };
}

export default connect(
  (state, ownProps) => ({
    cell: state.cells[ownProps.cellId],
    kernels: state.notebooks[ownProps.notebookId].kernelIds.map(
      kId => state.kernels[kId]
    )
  }),
  (dispatch, ownProps) => ({
    onCellTypeChange: newCellType =>
      dispatch(
        updateCellAction({
          id: ownProps.cellId,
          type: newCellType,
          contentType: undefined,
          kernelType: undefined
        })
      ),
    onCellContentTypeChange: newCellContentType =>
      dispatch(
        updateCellAction({
          id: ownProps.cellId,
          contentType: newCellContentType
        })
      ),
    onCellKernelTypeChange: newKernel =>
      dispatch(
        updateCellAction({
          id: ownProps.cellId,
          kernelType: newKernel,
          contentType: undefined
        })
      ),
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
    onFileMount: ({ kernelId, filePath, content }) =>
      dispatch(
        mountCellAsFileAction(ownProps.cellId, kernelId, {
          filePath,
          content
        })
      )
  })
)(CellDropdownContainer);
