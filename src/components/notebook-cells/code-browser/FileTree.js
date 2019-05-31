import React from 'react';
import PropTypes from 'prop-types';

import { classNames as cx } from 'utils/DOMUtils';
import './FileTree.css';

export function FileView (props) {
  return <div className='file-tree__file-name'>{props.name}</div>;
}

FileView.propTypes = {
  name: PropTypes.string.isRequired
};

export function ExpandableFolderView (props) {
  const { name, expanded, handleExpand } = props;
  return (
    <div
      className={cx(
        'file-tree__expandable-folder-view',
        expanded && 'file-tree__expandable-folder-view--expanded'
      )}
    >
      <i
        className={`zmdi zmdi-caret-${
          expanded ? 'down' : 'right'
        } file-tree__expand-trigger`}
        onClick={handleExpand}
      />
      <span className='file-tree__expandable-folder-view-label'>{name}</span>
    </div>
  );
}

ExpandableFolderView.propTypes = {
  name: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  handleExpand: PropTypes.func.isRequired
};

export default function FileTree (props) {
  const { node, handleExpand } = props;
  const isFolder = node.type === 'folder' ? true : false;
  const expanded = node.expanded;
  return (
    <div className='file-tree'>
      {isFolder ? (
        <ExpandableFolderView
          name={node.name}
          expanded={expanded}
          handleExpand={handleExpand.bind(null, node)}
        />
      ) : (
        <FileView name={node.name} />
      )}
      {expanded &&
        node.children.map(c => {
          return <FileTree key={c.id} node={c} handleExpand={handleExpand} />;
        })}
    </div>
  );
}

FileTree.propTypes = {
  node: PropTypes.shape({
    // The id of the node
    id: PropTypes.string.isRequired,
    // Whether folder is expanded or not
    expanded: PropTypes.bool,
    // Type of the node
    type: PropTypes.oneOf(['folder', 'file']),
    // Don't want to define a nested prop-type. Possible but ugly https://github.com/facebook/react/issues/5676
    children: PropTypes.arrayOf({})
  }),
  handleExpand: PropTypes.func.isRequired
};
