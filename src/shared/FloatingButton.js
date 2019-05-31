import React from 'react';
import PropTypes from 'prop-types';
import { classNames as cx } from 'utils/DOMUtils';
import './FloatingButton.css';

export default class FloatingButton extends React.Component {
  // *********************************************************
  // Static properties
  // *********************************************************
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        icon: PropTypes.icon,
        onClick: PropTypes.func.isRequired
      })
    ),
    /**
     * Material design icon code
     */
    mainIcon: PropTypes.string
  };

  static defaultProps = {
    options: [],
    mainIcon: 'plus'
  };

  // *********************************************************
  // Constructor
  // *********************************************************
  constructor (...args) {
    super(...args);
    this.state = {
      isOpen: false
    };
    this.toggleOpen = this.toggleOpen.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
  }

  render () {
    const { isOpen } = this.state;
    let { mainIcon, options } = this.props;
    options = options || [];
    return (
      <div className='floating-button'>
        <button className='floating-button__trigger' onClick={this.toggleOpen}>
          <i
            className={`zmdi zmdi-triangle-down ${
              isOpen ? 'animated rotateOut' : ''
            }`}
            style={{
              opacity: isOpen ? 1 : 0,
              animationFillMode: 'backwards'
            }}
          />
          <i
            className={`zmdi zmdi-${mainIcon} ${
              !isOpen ? 'animated rotateIn' : ''
            }`}
            style={{
              opacity: isOpen ? 0 : 1,
              animationFillMode: 'backwards'
            }}
          />
        </button>
        {isOpen && (
          <ul className='floating-button__list'>
            {options.map((option, index) => {
              return (
                <li className='floating-button__list-item' key={index}>
                  <label
                    className={cx(
                      'floating-button__list-item-label',
                      option.disabled &&
                        'floating-button__list-item-label--disabled'
                    )}
                    style={{
                      cursor: option.disabled ? 'not-allowed' : 'pointer'
                    }}
                    onClick={
                      option.disabled
                        ? null
                        : this.handleOptionClick.bind(null, option)
                    }
                  >
                    {option.label}
                  </label>
                  <i
                    className={`zmdi zmdi-${
                      option.icon
                    } zmdi-hc-2x floating-button__list-item-icon`}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  // *********************************************************
  // Event handlers
  // *********************************************************
  toggleOpen () {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleOptionClick (option) {
    this.setState({
      isOpen: false
    });
    if (option.onClick) {
      option.onClick();
    }
  }
}
