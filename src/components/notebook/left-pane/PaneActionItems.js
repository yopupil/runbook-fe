import React from 'react';
import PropTypes from 'prop-types';
import { classNames as cx } from 'utils/DOMUtils';

export function ReadOnlyToggle (props) {
  const { isReadOnly, onToggle } = props;
  return (
    <div
      data-tip={isReadOnly ? 'Edit' : 'Readonly'}
      className={cx(
        'notebook-pane-action-item',
        isReadOnly && 'notebook-pane-action-item--toggled'
      )}
      onClick={onToggle}
    >
      <i className={`zmdi zmdi-${isReadOnly ? 'edit' : 'card-off'}`} />
    </div>
  );
}

ReadOnlyToggle.propTypes = {
  isReadOnly: PropTypes.bool,
  onToggle: PropTypes.func
};

export function VisibilityToggle (props) {
  const { isVisible, onToggle } = props;
  return (
    <div
      data-tip={isVisible ? 'Hide' : 'Show'}
      className={cx(
        'notebook-pane-action-item',
        !isVisible && 'notebook-pane-action-item--toggled'
      )}
      onClick={onToggle}
    >
      <i className={`zmdi zmdi-${isVisible ? 'eye-off' : 'eye'}`} />
    </div>
  );
}

VisibilityToggle.propTypes = {
  isVisble: PropTypes.bool,
  onToggle: PropTypes.func
};

export function CollapseToggle (props) {
  const { isCollapsed, onToggle } = props;
  return (
    <div
      data-tip={isCollapsed ? 'Expand' : 'Collapse'}
      className={cx(
        'notebook-pane-action-item',
        isCollapsed && 'notebook-pane-action-item--toggled'
      )}
      onClick={onToggle}
    >
      <i className={`zmdi zmdi-unfold-${isCollapsed ? 'more' : 'less'}`} />
    </div>
  );
}

CollapseToggle.propTypes = {
  isCollapsed: PropTypes.bool,
  onToggle: PropTypes.func
};

export function EndpointToggle (props) {
  const { isEndpointDefined, onToggle } = props;
  return (
    <div
      data-tip={'Endpoint'}
      className={cx(
        'notebook-pane-action-item',
        isEndpointDefined && 'notebook-pane-action-item--toggled'
      )}
      onClick={onToggle}
    >
      <i className={`zmdi zmdi-swap`} />
    </div>
  );
}

EndpointToggle.propTypes = {
  isEndpointDefined: PropTypes.bool,
  onToggle: PropTypes.func
};
