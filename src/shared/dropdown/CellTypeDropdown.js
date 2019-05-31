import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'shared/dropdown/Dropdown';
import CollapsedLabel from 'shared/labels/CollapsedLabel';

export default class CellDropdown extends Dropdown {
  render () {
    const { open } = this.state;
    const { actions } = this.props;
    return (
      <div className='cell-dropdown' ref={el => (this.container = el)}>
        <i
          className='zmdi zmdi-more-vert zmdi-hc-lg cell-dropdown__icon'
          onClick={this.toggleOpen}
        />
        {open ? (
          <div>
            <ul className='cell-dropdown__list' />
          </div>
        ) : (
          <React.Fragment>
            <CollapsedLabel isCircular={true} text={'js'} />
            <CollapsedLabel text={'py3nameforme'} />
          </React.Fragment>
        )}
      </div>
    );
  }

  toggleOpen () {
    this.setState({
      open: !this.state.open
    });
  }

  handleAction (action) {
    this.setState({
      open: false
    });
    this.props.handleAction(action);
  }
}

CellDropdown.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.string),
  // The callback function to execute when action is triggered
  handleAction: PropTypes.func.isRequired
};

CellDropdown.defaultProps = {
  actions: []
};
