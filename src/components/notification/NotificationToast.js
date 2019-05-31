import React from 'react';

import BaseComponent from 'shared/BaseComponent';
import './NotificationToast.css';

export default class NotificationToast extends BaseComponent {
  // *********************************************************
  // Static properties
  // *********************************************************
  static notifications = [];

  static instance = null;

  static notify (notification) {
    NotificationToast.notifications.push(notification);
    NotificationToast.fire();
  }

  static fire () {
    if (!NotificationToast.instance) {
      return;
    }
    if (NotificationToast.notifications.length) {
      let next = NotificationToast.notifications.shift();
      if (next.type === 'countdown') {
        let timeLeft = next.timeout || 3000;
        NotificationToast.instance.setState({
          mode: next.mode || next.status,
          message: next.message + ' (' + Math.round(timeLeft / 1000) + 's)'
        });
        let id = setInterval(() => {
          timeLeft -= next.interval || 1000;
          if (timeLeft <= 0) {
            return clearInterval(id);
          }
          NotificationToast.instance.setState({
            mode: next.mode || next.status,
            message: next.message + ' (' + Math.round(timeLeft / 1000) + 's)'
          });
        }, next.interval || 1000);
      } else {
        NotificationToast.instance.setState({
          mode: next.mode || next.status,
          message: next.message
        });
        setTimeout(() => {
          NotificationToast.fire();
        }, next.timeout || 3500);
      }
    } else {
      NotificationToast.instance.setState({
        mode: 'hidden',
        message: ''
      });
    }
  }

  // *********************************************************
  // Constructor
  // *********************************************************
  constructor (...args) {
    super(...args);
    this.autoBind();
    this.state = {
      mode: 'hidden',
      message: ''
    };
  }
  // *********************************************************
  // React methods
  // *********************************************************
  componentDidMount () {
    // Sometimes unmount is not called by router.
    setTimeout(() => {
      NotificationToast.notifications = [];
      NotificationToast.instance = this;
    }, 100);
  }

  componentWillUnmount () {
    super.componentWillUnmount();
    NotificationToast.instance = null;
    NotificationToast.notifications = [];
  }

  render () {
    return (
      <div className={'notification-toast notification-' + this.state.mode}>
        {this.state.message}
      </div>
    );
  }
}
