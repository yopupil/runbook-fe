import React from 'react';

import BaseComponent from 'shared/BaseComponent';
import FileTree from 'components/notebook-cells/code-browser/FileTree';

export default class FileBrowser extends BaseComponent {
  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    /*
      The tree is lazy because it will show only top level directories/files unless user specified a pre-defined set of node ids.
      The expanded state is frozen upon save, and if the view is shown to end-user (if cell is editable & user has not hidden it from read view)
     */
    const root = this.props.tree || {};
    // The root node comprises of the whole tree !
    return <FileTree node={root} handleExpand={this.handleExpand.bind(this)} />;
  }

  handleExpand (node) {
    // Update by reference
    node.expanded = !node.expanded;
    this.forceUpdate();
  }
}
