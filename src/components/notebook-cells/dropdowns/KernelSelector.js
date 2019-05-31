import React from 'react';

import BaseComponent from 'shared/BaseComponent';

export default class KernelSelector extends BaseComponent {
  // *********************************************************
  // Static methods
  // *********************************************************
  static defaultProps = {
    kernels: []
  };
  // *********************************************************
  // React methods
  // *********************************************************
  render () {
    const { kernels, selectedKernel, onSelect } = this.props;
    return (
      <div className='kernel-selector'>
        <label>Kernel</label>
        <select
          defaultValue={selectedKernel ? selectedKernel.value : undefined}
          onChange={e =>
            onSelect(kernels.find(c => c.value === e.target.value))
          }
        >
          {kernels.map((kernel, i) => {
            return (
              <option key={i} value={kernel.value}>
                {kernel.name + ':' + kernel.version}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
}
