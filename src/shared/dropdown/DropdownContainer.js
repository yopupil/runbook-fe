import React from 'react';
import BaseComponent from 'shared/BaseComponent';

export default class DropdownContainer extends BaseComponent {
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

  componentDidMount () {
    // document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount () {
    super.componentWillUnmount();
    // document.removeEventListener('click', this.handleDocumentClick);
  }

  toggleOpen (event) {
    this.setState({
      open: !this.state.open
    });
  }

  handleDocumentClick (event) {
    if (event.target && this.triggerElement.contains(event.target)) {
      return;
    }
    if (this.container) {
      if (this.state.open && !this.container.contains(event.target)) {
        this.setState({
          open: false
        });
      }
    }
  }

  render () {
    const { trigger, className } = this.props;
    const { open } = this.state;
    return (
      <div className={className}>
        <span ref={el => (this.triggerElement = el)}>
          {trigger ? (
            trigger(open, this.toggleOpen.bind(this))
          ) : (
            <i className='zmdi zmdi-more-vert' onClick={this.toggleOpen} />
          )}
        </span>
        {open && (
          <div
            className='dropdown-container__children'
            ref={el => (this.container = el)}
          >
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}
