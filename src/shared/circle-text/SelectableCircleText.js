import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from 'shared/BaseComponent';
import CircleText from 'shared/circle-text/CircleText';
import Checkbox from 'shared/checkbox/Checkbox';
import { classNames as cx } from 'utils/DOMUtils';
import './SelectableCircleText.css';

export default class SelectableCircleText extends BaseComponent {
  // *********************************************************
  // Static properties
  // *********************************************************
  static propTypes = {
    /**
     * The id of the checkbox
     */
    id: PropTypes.string.isRequired,
    /**
     * The letter to use for question icon
     */
    letter: PropTypes.string.isRequired,
    /**
     * If selector should be shown at all times
     */
    showSelector: PropTypes.bool,
    /**
     * The color to use for circle text background
     */
    color: PropTypes.string,
    /**
     * Callback function to call when item is selected / deselected
     */
    onSelect: PropTypes.func.isRequired,
    /**
     * Boolean that controls if item is selected
     */
    isSelected: PropTypes.bool
  };
  // *********************************************************
  // Constructor
  // *********************************************************
  constructor (...args) {
    super(...args);
    this.state = {
      showCheckbox: false
    };
    this.autoBind();
  }
  // *********************************************************
  // React methods
  // *********************************************************
  componentWillReceiveProps (nextProps) {
    if (
      nextProps.showSelector !== this.props.showSelector &&
      !nextProps.showSelector
    ) {
      this.setState({
        showCheckbox: false
      });
    }
  }

  render () {
    let { id, letter, showSelector, isSelected, color } = this.props;
    let { showCheckbox } = this.state;
    return (
      <span
        className={cx(
          'selectable-circle-text',
          (showCheckbox || showSelector) && 'selectable-circle-text--selecting',
          isSelected && 'selectable-circle-text--selected'
        )}
        onMouseLeave={() => this.toggleCheckbox(false)}
      >
        {showCheckbox || isSelected || showSelector ? (
          <Checkbox
            id={id}
            value={isSelected}
            backgroundColor={color}
            onChange={this.handleSelect}
          />
        ) : (
          <CircleText
            size='medium'
            style={{
              background: color,
              borderColor: color
            }}
            text={letter || '*'}
            onMouseEnter={() => this.toggleCheckbox(true)}
          />
        )}
      </span>
    );
  }

  /**
   * Toggle checkbox state
   * @return {[type]} [description]
   */
  toggleCheckbox (v) {
    // If checkbox is selected do nothing until unchecked
    if (this.props.isSelected) {
      return;
    }
    this.setState({
      showCheckbox: v
    });
  }

  handleSelect (value) {
    this.props.onSelect(value);
  }
}
