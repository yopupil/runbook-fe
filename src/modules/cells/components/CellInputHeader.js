import React from 'react';

export default function CellInputHeader (props) {
  const { cellType, title, runtimeState, actionState } = props;
  return (
    <div className='cell-input-header'>
      {/*
					Icon for showing type of the cell
				 */}
      <CellTypeIcon cellType={cellType} />
      {/*
					Title for the cell / File mode etc
				 */}
      <CellTitle title={title} />
      {/*
					Runtime related information and language selector
				 */}
      <RuntimeSelector {...runtimeState} />
      {/*
					Action bar for visibility, read only modes etc
				 */}
      <CellInputActionBar {...actionState} />
    </div>
  );
}
