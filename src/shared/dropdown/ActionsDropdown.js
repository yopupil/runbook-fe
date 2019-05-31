import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'shared/dropdown/Dropdown';
import './ActionsDropdown.css';

export default class ActionsDropdown extends Dropdown {
  render () {
    const { open } = this.state;
    const { actions } = this.props;
    return (
      <div className='actions-dropdown' ref={el => (this.container = el)}>
        <i
          className='zmdi zmdi-more-vert zmdi-hc-lg actions-dropdown__icon'
          onClick={this.toggleOpen}
        />
        {open && (
          <ul className='actions-dropdown__list'>
            {actions.map((action, i) => {
              return (
                <li
                  key={i}
                  className='actions-dropdown__list-item'
                  onClick={() => this.handleAction(action)}
                >
                  {action}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  toggleOpen () {
    this.setState({
      open: !this.state.open
    });
  }

  handleAction (action) {
    this.setState({
      open: false
    });
    this.props.handleAction(action);
  }
}

ActionsDropdown.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string),
  // The callback function to execute when action is triggered
  handleAction: PropTypes.func.isRequired
};

ActionsDropdown.defaultProps = {
  actions: []
};
