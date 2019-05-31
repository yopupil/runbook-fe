import React from 'react';
import Proptypes from 'prop-types';

export default class ProfileWrapper extends React.Component {
  // *********************************************************
  // Static properties
  // *********************************************************
  static propTypes = {
    /**
     * The user profile object
     * @type {Object}
     */
    profile: Proptypes.object
  };

  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    const { profile } = this.props;
    if (profile) {
      return this.props.children;
    }
    return <span />;
  }
}
