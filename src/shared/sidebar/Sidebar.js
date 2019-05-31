import React from 'react';
import ReactTooltip from 'react-tooltip';
import { Link, withRouter } from 'react-router-dom';
import { classNames as cx } from 'utils/DOMUtils';
import { AppEndpoints } from 'constants/UrlEndpoints';
import './Sidebar.css';

function Sidebar (props) {
  const { location } = props;
  const icons = [
    {
      icon: 'file-text',
      context: 'PROPOSAL',
      url: AppEndpoints.proposalContainersPage.root,
      label: 'Current Responses'
    },
    {
      icon: 'inbox',
      context: 'INBOX',
      url: AppEndpoints.inbox,
      label: 'Inbox'
    },
    {
      icon: 'library',
      context: 'CONTENT_LIBRARY',
      url: AppEndpoints.contentSourceContainersPage.root,
      label: 'Content Library'
    }
  ];
  let currentContext;
  const p = location.pathname.toLowerCase();
  if (p.indexOf('inbox') > -1) {
    currentContext = 'INBOX';
  } else if (p.indexOf('proposal') > -1) {
    currentContext = 'PROPOSAL';
  } else if (p.indexOf('content-source') > -1) {
    currentContext = 'CONTENT_LIBRARY';
  }
  return (
    <div className='sidebar'>
      <ReactTooltip id='side-bar' />
      {icons.map(icon => {
        return (
          <Link
            key={icon.url}
            to={icon.url}
            className={cx(
              'sidebar__icon',
              icon.context === currentContext && 'sidebar__icon--active'
            )}
          >
            <i
              data-tip={icon.label}
              data-for={'side-bar'}
              className={`zmdi zmdi-${icon.icon} zmdi-hc-2x`}
            />
          </Link>
        );
      })}
    </div>
  );
}

export default withRouter(Sidebar);
