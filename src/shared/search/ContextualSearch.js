import React from 'react';
import PropTypes from 'prop-types';

import BaseComponent from 'shared/BaseComponent';
import ContextDropdown from 'shared/search/ContextDropdown';
import './ContextualSearch.css';

export default class ContextualSearch extends BaseComponent {
  // *********************************************************
  // Static properties
  // *********************************************************
  static propTypes = {
    context: PropTypes.shape({
      text: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    }),
    onSearch: PropTypes.func.isRequired,
    onSearchTermChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    context: {
      text: '',
      type: 'GLOBAL'
    }
  };
  // *********************************************************
  // Constructor
  // *********************************************************
  constructor (...args) {
    super(...args);
    this.state = {
      input: '',
      showFilters: false
    };
    this.autoBind();
  }
  // *********************************************************
  // React methods
  // *********************************************************
  componentDidMount () {
    this.setState({
      input: this.props.selectedSearchTerm || ''
    });
  }

  componentDidUpdate (prevProps) {
    if (prevProps.selectedSearchTerm !== this.props.selectedSearchTerm) {
      this.setState({
        input: this.props.selectedSearchTerm || ''
      });
    }
  }

  render () {
    let { context, availableContexts } = this.props;
    if (!availableContexts) {
      availableContexts = [context];
    }
    const { input, showFilters } = this.state;
    return (
      <div className='contextual-search'>
        <i className='zmdi zmdi-search zmdi-hc-lg contextual-search__search-icon' />
        <ContextDropdown
          currentContext={context}
          availableContexts={availableContexts}
          onSelect={this.handleContextSelection}
        />
        <input
          className='contextual-search__input'
          placeholder='Search'
          value={input}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
        />
        <i
          className={`zmdi zmdi-caret-${
            showFilters ? 'up' : 'down'
          } contextual-search__filter-trigger`}
          onClick={this.toggleFilters}
        />
        {showFilters && (
          <div className='contextual-search__filters'>
            <div
              style={{
                padding: '15px 35px'
              }}
            >
              {this.props.filters}
            </div>
            <button
              className='contextual-search__button'
              onClick={this.submitSearch}
            >
              Search
            </button>
          </div>
        )}
      </div>
    );
  }
  // *********************************************************
  // Event handlers
  // *********************************************************
  handleChange (e) {
    const value = e.target.value;
    this.props.onSearchTermChange(value);
  }

  handleKeyDown (e) {
    if (e.keyCode === 13) {
      this.props.onSearchTermChange(this.state.input);
      setTimeout(() => {
        this.props.onSearch();
      });
    }
  }

  toggleFilters () {
    this.setState({
      showFilters: !this.state.showFilters
    });
  }

  handleContextSelection (context) {
    if (this.props.handleContextSelection) {
      this.props.handleContextSelection(context);
    }
  }

  onSearch () {
    this.props.onSearchTermChange(this.state.input);
  }

  submitSearch () {
    const { onSearch } = this.props;
    onSearch();
    this.setState({
      showFilters: false
    });
  }

  cancelSearch () {
    this.setState({
      showFilters: false
    });
  }
}
