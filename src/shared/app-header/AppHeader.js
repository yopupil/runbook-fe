import React from 'react';
import BaseComponent from 'shared/BaseComponent';
import { Link } from 'react-router-dom';

import ProfileStore from 'shared/profile/ProfileStore';
import ProfileDropDown from 'shared/profile/ProfileDropDown';
import UserAutocomplete from 'shared/profile/UserAutocomplete';
import NotificationToast from 'components/notification/NotificationToast';
import NotificationBellSVG from 'assets/images/notification-bell.svg';
import AnonymousUserSVG from 'assets/images/anonymous-user.svg';
import AppLogo from 'assets/images/aura_logo_dark.svg';

import { AppEndpoints } from 'constants/UrlEndpoints';

export default class AppHeader extends BaseComponent {
  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    const profile = ProfileStore.getProfile() || {};
    return (
      <header className='app-header'>
        {/*
            Floats left
           */}
        <div className='app-header__left row'>
          <div className='twelve columns'>
            <Link className='app-header__home-link' to={AppEndpoints.dashboard}>
              <div
                style={{
                  paddingTop: '8px'
                }}
              >
                <img alt='logo' src={AppLogo} width={100} height={35} />
              </div>
            </Link>
            <span className='app-header__sub-label'>Playbook</span>
          </div>
        </div>
        <div className='app-header__center'>
          <NotificationToast />
          {this.props.children}
        </div>
        {/*
            The following float to the right side
           */}
        <div className='app-header__right'>
          <img
            alt='notifications'
            src={NotificationBellSVG}
            width={20}
            height={25}
          />
          {profile.name !== 'Unknown User' ? (
            <UserAutocomplete
              selectedUser={{
                id: 'user-id-not-used',
                name: profile.name
              }}
              editable={false}
              onSelect={BaseComponent.NOOP}
            />
          ) : (
            <img alt='profile' src={AnonymousUserSVG} width={35} height={35} />
          )}

          <ProfileDropDown profile={profile} />
        </div>
      </header>
    );
  }
}
