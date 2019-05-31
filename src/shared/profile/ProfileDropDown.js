import React from 'react';
import BaseComponent from '../BaseComponent';
import { withRouter } from 'react-router-dom';

import fetch from 'utils/FetchUtils';
import { classNames as cx } from 'utils/DOMUtils';
import NotificationToast from 'components/notification/NotificationToast';
import DoubleDropDownArrowSVG from 'assets/images/double-dropdown-arrow.svg';

import { ServerEndpoints } from 'constants/UrlEndpoints';

class ProfileDropDown extends BaseComponent {
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
    const profile = this.props.profile || {};
    const open = this.state.open;
    return (
      <div className='profile-dropdown' ref={el => (this.container = el)}>
        <img
          alt='context'
          src={DoubleDropDownArrowSVG}
          width={6}
          height={11}
          onClick={this.toggleOpen}
        />
        <ul
          className={cx(
            'profile-dropdown__list',
            open && 'profile-dropdown__list--open'
          )}
        >
          <li className='profile-dropdown__item'>
            <label className='profile-dropdown__label'>Name</label>
            <span className='profile-dropdown__value'>{profile.name}</span>
          </li>
          <li className='profile-dropdown__item'>
            <label className='profile-dropdown__label'>Email</label>
            <span
              className='profile-dropdown__value'
              style={{
                color: '#4285F4'
              }}
            >
              {profile.email}
            </span>
          </li>
          <li className='profile-dropdown__item'>
            <label className='profile-dropdown__label'>
              Current Organization
            </label>
            <span className='profile-dropdown__value'>
              {profile.currentOrganization
                ? profile.currentOrganization.name
                : 'Unknown'}
              {profile.organizations && profile.organizations.length > 1 ? (
                <a href={ServerEndpoints.switchOrgContext}>(Switch)</a>
              ) : null}
            </span>
          </li>
          <button
            className='profile-dropdown__button'
            onClick={this.handleLogout}
          >
            Logout
          </button>
        </ul>
      </div>
    );
  }

  // *********************************************************
  // Private methods
  // *********************************************************
  toggleOpen () {
    this.setState({
      open: !this.state.open
    });
  }

  async handleLogout () {
    try {
      let result = await fetch(ServerEndpoints.logout, {
        crendentials: 'same-origin',
        method: 'POST'
      });
      if (result.status === 200) {
        NotificationToast.notify({
          mode: 'success',
          message: 'Logout successful... Redirecting..'
        });
        setTimeout(() => {
          // We use location href instead of replace/pushstate
          window.location.href = ServerEndpoints.login;
        }, 2000);
      } else {
        throw new Error('An error occured during login');
      }
    } catch (e) {
      // Notify user that there was an error logging out.
      NotificationToast.notify({
        mode: 'error',
        message: 'There was an error logging the user out'
      });
    }
  }

  handleClick (event) {
    if (this.state.open && event.target.contains(this.container)) {
      this.setState({
        open: false
      });
    }
  }
}

export default withRouter(ProfileDropDown);
