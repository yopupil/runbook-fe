import React from 'react';
import { withRouter } from 'react-router-dom';

import BaseComponent from 'shared/BaseComponent';
import AppHeader from 'shared/app-header/AppHeader';
import Notebook from 'components/notebook/Notebook';

import './DashboardPage.css';

class DashboardPage extends BaseComponent {
  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    return (
      <div className='page login-page'>
        <div className='page__wrapper'>
          <AppHeader />
          <main>
            <div className='container'>
              <section className='dashboard-page__header-section'>
                <Notebook />
              </section>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default withRouter(DashboardPage);
