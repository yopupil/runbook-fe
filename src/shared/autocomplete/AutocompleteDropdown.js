import React from 'react';
import Proptypes from 'prop-types';
import BaseComponent from 'shared/BaseComponent';

import { debounce } from 'utils/OptimizationUtils';
import './AutocompleteDropdown.css';

const COLUMN_NAME_MAP = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'eleven',
  12: 'twelve'
};

export default class AutocompleteDropdown extends BaseComponent {
  // *********************************************************
  // Static properties
  // *********************************************************
  static propTypes = {
    /**
     * The label to use for the autocomplete
     */
    label: Proptypes.string,
    /**
     * The function to fetch matches for a given input
     */
    fetchMatches: Proptypes.func.isRequired,
    /**
     * Array of default options to display with a line separator
     */
    defaultOptions: Proptypes.arrayOf(
      Proptypes.oneOfType([Proptypes.object, Proptypes.string])
    ),
    /**
     * An optional function to display the label of the match if the match
     * is an object instead of a string. e.g if a match is of the form
     * {"id": 1, "name": "Foobar"}, then labelAccessor = (d) => d.name
     * @type {[type]}
     */
    labelAccessor: Proptypes.func,
    /**
     * A boolean indicating if free search is allowed. Defaults to false
     */
    freeTextAllowed: Proptypes.bool,
    /**
     * Boolean indicating if the dropdown trigger must be shown. The dropdown
     * trigger is useful for fixed options.
     */
    showDropdownTrigger: Proptypes.bool,
    /**
     * Show the clear button
     */
    showClear: Proptypes.bool,
    /**
     * Number representing columns allocated to label
     */
    labelColumns: Proptypes.number,
    /**
     * If label and input are laid out vertically instead of horizontally.
     * If used simultaneously with labelColumns, labelColumns has no effect
     */
    verticalLayout: Proptypes.bool,
    /**
     * The placeholder to use
     */
    placeholder: Proptypes.string,
    /**
     * Callback function to call when an option is selected
     */
    onSelect: Proptypes.func.isRequired,
    /**
     * If true, when user presses enter, the text is selected
     */
    selectOnEnter: Proptypes.bool
  };

  static defaultProps = {
    labelAccessor: d => d,
    freeTextAllowed: false,
    labelColumns: 2,
    showDropdownTrigger: false,
    verticalLayout: false,
    placeholder: 'Search..',
    selectOnEnter: true,
    showClear: true
  };

  /**
   * Given an array of options return a `fetchMatches` function
   * that will dynamically populate the input
   * @param  {Array} options  Array of string options to match against
   * @return {Function}       A fetchMatches function that is capable of displaying
   *                          and filtering a fixed set of options
   */
  static filterFixedOptions (options) {
    return input => {
      return input
        ? options.filter(o => o.toLowerCase().indexOf(input.toLowerCase()) > -1)
        : options;
    };
  }

  // *********************************************************
  // Constructor
  // *********************************************************
  constructor (props, ...args) {
    super(props, ...args);
    this.state = {
      matches: [],
      input: '',
      dirty: false,
      isOpen: false
    };
    this.autoBind();
    this.handleInputChange = debounce(this.handleInputChange.bind(this), 550);
    if (props.freeTextAllowed) {
      this.selectCurrentInput = debounce(
        this.selectCurrentInput.bind(this),
        1500
      );
    }
  }
  // *********************************************************
  // React methods
  // *********************************************************
  componentDidMount () {
    document.addEventListener('click', this.handleDocumentClick);
    if (this.props.selectedMatch) {
      this.setState({
        input: this.props.labelAccessor(this.props.selectedMatch) || ''
      });
    }
  }

  componentWillUnmount () {
    super.componentWillUnmount();
    document.removeEventListener('click', this.handleDocumentClick);
  }

  componentWillReceiveProps (nextProps) {
    if (
      JSON.stringify(nextProps.selectedMatch) !==
        JSON.stringify(this.props.selectedMatch) &&
      !this.state.dirty
    ) {
      // Do not change the input if user started typing since a selection call
      if (nextProps.selectedMatch) {
        this.setState({
          input: nextProps.labelAccessor(nextProps.selectedMatch) || ''
        });
      }
    }
  }

  render () {
    const { matches, input, isOpen } = this.state;
    const {
      label,
      showDropdownTrigger,
      labelAccessor,
      labelColumns,
      verticalLayout,
      placeholder,
      selectOnEnter,
      defaultOptions,
      showClear
    } = this.props;
    let labelCols = COLUMN_NAME_MAP[labelColumns] + ' columns';
    let otherCols = COLUMN_NAME_MAP[12 - labelColumns] + ' columns';
    if (verticalLayout) {
      labelCols = 'row';
      otherCols = 'row';
    }
    return (
      <div className='autocomplete-dropdown row' ref={el => (this.node = el)}>
        <span className={`autocomplete-dropdown__label ${labelCols}`}>
          {label}
        </span>
        <div
          className={`autocomplete-dropdown__dropdown__selector ${otherCols}`}
        >
          <input
            value={input}
            placeholder={placeholder}
            onFocus={this.handleFocus}
            className='autocomplete-dropdown__selector-input'
            onKeyDown={selectOnEnter ? this.handleKeyDown : BaseComponent.NOOP}
            onChange={this._handleInputChange}
          />
          {showDropdownTrigger && (
            <i
              className={`zmdi zmdi-caret-${
                isOpen ? 'up' : 'down'
              } autocomplete-dropdown__selector-trigger`}
              onClick={this.toggleDropdown}
            />
          )}
          {showClear && (
            <i
              className='zmdi zmdi-close autocomplete-dropdown__selector-trigger'
              onClick={this.clear}
              style={{
                right: '20px',
                fontSize: '16px !important',
                display: input ? 'block' : 'none'
              }}
            />
          )}
          {isOpen && (
            <ul
              className='autocomplete-dropdown__list'
              style={{
                display: matches.length || defaultOptions ? 'block' : 'none'
              }}
            >
              {defaultOptions
                ? defaultOptions.map(o => {
                    return (
                      <li
                        className='autocomplete-dropdown__list-item'
                        key={labelAccessor(o)}
                        onClick={this.selectOption.bind(null, o)}
                      >
                        {labelAccessor(o)}
                      </li>
                    );
                  })
                : null}
              {defaultOptions ? <hr style={{ margin: '0px' }} /> : null}
              {matches.map(match => {
                return (
                  <li
                    className='autocomplete-dropdown__list-item'
                    key={labelAccessor(match)}
                    onClick={this.selectOption.bind(null, match)}
                  >
                    {labelAccessor(match)}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  }

  toggleDropdown () {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  selectOption (match) {
    const { onSelect, labelAccessor } = this.props;
    this.setState({
      isOpen: false,
      input: labelAccessor(match)
    });
    if (onSelect) {
      this.selectCurrentInput(match);
    }
  }

  handleKeyDown (e) {
    const { onSelect } = this.props;
    if (e.keyCode === 13 && onSelect) {
      this.selectCurrentInput(this.state.input);
    }
  }

  handleFocus () {
    if (this.props.matchWithEmptyContent && !this.state.input) {
      this.setState({
        isOpen: true
      });
      this.handleInputChange('');
    }
    if (this.props.defaultOptions) {
      this.setState({
        isOpen: true
      });
    }
  }

  clear () {
    const { onSelect } = this.props;
    this.setState({
      isOpen: false,
      input: ''
    });
    if (onSelect) {
      this.selectCurrentInput(undefined);
    }
  }

  _handleInputChange (event) {
    const value = event.target.value;
    const { freeTextAllowed } = this.props;
    this.setState({
      input: value,
      isOpen: true,
      dirty: true,
      matches: !value ? [] : this.state.matches
    });
    this.handleInputChange(value);
    if (freeTextAllowed) {
      // Then we need to let the user know that the current input text is the new value.
      // Otherwise, the parent will not know about `selecting` this free form text
      this.selectCurrentInput(value);
    }
  }

  async handleInputChange (value) {
    const { fetchMatches } = this.props;
    let matches = await fetchMatches(value);
    matches = matches || [];
    if (value === this.state.input) {
      this.setState({
        matches,
        dirty: false
      });
    }
  }

  handleDocumentClick (event) {
    if (this.state.isOpen) {
      const target = event.target;
      // Check if target is inside a node within autocomplete realm
      if (this.node && !this.node.contains(target)) {
        this.setState({
          isOpen: false
        });
      }
    }
  }

  selectCurrentInput (v) {
    this.props.onSelect(v);
  }
}
