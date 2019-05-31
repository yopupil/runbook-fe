import React from 'react';
import { Link } from 'react-router-dom';

import BaseComponent from 'shared/BaseComponent';
import { classNames as cx } from 'utils/DOMUtils';
import './LibraryDropDown.css';

import { AppEndpoints } from 'constants/UrlEndpoints';

export default class LibraryDropDown extends BaseComponent {
  // *********************************************************
  // Constructor
  // *********************************************************
  constructor (...args) {
    super(...args);
    this.state = {
      open: false
    };
    this.autoBind();
  }
  // *********************************************************
  // React methods
  // *********************************************************
  componentDidMount () {
    document.addEventListener('click', this.handleClick);
  }

  componentWillUnmount () {
    super.componentWillUnmount();
    document.removeEventListener('click', this.handleClick);
  }

  render () {
    const { open } = this.state;
    return (
      <div className='library-dropdown' ref={el => (this.container = el)}>
        <i
          className='zmdi zmdi-apps library-dropdown__icon'
          onClick={this.toggleOpen}
        />
        <ul
          className={cx(
            'library-dropdown__list',
            open && 'library-dropdown__list--open'
          )}
        >
          {/*
              A grid of items to choose from library
             */}
          <li className='library-dropdown__list-item'>
            {/*
                Content sources list
               */}
            <Link to={AppEndpoints.contentSourceContainersPage.root}>
              <i className='zmdi zmdi-collection-text zmdi-hc-2x' />
              <label>Content Sources</label>
            </Link>
          </li>
        </ul>
      </div>
    );
  }

  // *********************************************************
  // React methods
  // *********************************************************
  toggleOpen () {
    this.setState({
      open: !this.state.open
    });
  }

  handleClick (event) {
    if (this.state.open && event.target.contains(this.container)) {
      this.setState({
        open: false
      });
    }
  }
}
