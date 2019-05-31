import React from 'react';

import Dropdown from 'shared/dropdown/Dropdown';
import { classNames as cx } from 'utils/DOMUtils';
import './ContextDropdown.css';

export default class ContextDropdown extends Dropdown {
  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    const { open } = this.state;
    let { currentContext, availableContexts } = this.props;
    currentContext = currentContext || availableContexts[0];
    return (
      <div className='context-dropdown'>
        <span className='context-dropdown__label'>
          {'in:' + currentContext.text + ' '}
        </span>
        {availableContexts.length > 1 ? (
          <i
            className={`context-dropdown__trigger zmdi zmdi-caret-${
              open ? 'up' : 'down'
            }`}
            onClick={this.toggleOpen}
          />
        ) : null}
        <ul
          className={cx(
            'context-dropdown__list',
            open && 'context-dropdown__list--open'
          )}
        >
          {availableContexts
            .filter(a => a.type !== currentContext.type)
            .map((c, i) => {
              return (
                <li
                  key={c.type}
                  className='context-dropdown__list-item'
                  onClick={() => this.onSelect(c)}
                >
                  {'in:' + c.text + ' '}
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
  // *********************************************************
  // Private methods
  // *********************************************************
  onSelect (option) {
    this.setState({
      open: false
    });
    this.props.onSelect(option);
  }
}
