import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import BaseComponent from 'shared/BaseComponent';
import AppHeader from 'shared/app-header/AppHeader';

import { AppEndpoints } from 'constants/UrlEndpoints';

class NotFoundPage extends BaseComponent {
  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    return (
      <div className='page login-page'>
        <div className='page__wrapper'>
          <div className='page__header'>
            <AppHeader />
          </div>
          <main>
            <h1>404</h1>
            <p>
              The page you requested cannot be found Click{' '}
              <Link to={AppEndpoints.dashboard}>here</Link> to navigate to home
              page.
            </p>
          </main>
          <div className='page__push' />
        </div>
      </div>
    );
  }
}

export default withRouter(NotFoundPage);
