import React from 'react';
import { LanguageDefinitions } from 'constants/CellConstants';
import StartKernelCommand from './StartKernelCommand';

export const auraCommands = {
  startKernels (kernelDefs) {
    // return promise on which output of CommandCell will wait. Any socket communications from server will be re-routed through store
    // to the appropriate cell.
    return props => (
      <StartKernelCommand
        kernelDefinitions={Object.keys(kernelDefs).map(k => ({
          name: k,
          ...kernelDefs[k]
        }))}
        {...props}
      />
    );
  },
  LanguageDefinitions: LanguageDefinitions
};
