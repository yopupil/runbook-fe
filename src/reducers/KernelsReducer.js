import {
  KernelTypes,
  KernelDefinitions,
  LanguageDefinitions
} from 'constants/CellConstants';

import {
  KERNEL_CREATED,
  KERNEL_LOG,
  KERNEL_STATUS
} from 'actions/KernelActionConstants';

export function addNewKernel (
  state,
  { id, name, image, version, value, supportedLanguages }
) {
  return {
    ...state,
    [id]: {
      id,
      name,
      image,
      value,
      version,
      supportedLanguages: supportedLanguages || [
        LanguageDefinitions[image.toUpperCase()].value,
        LanguageDefinitions.SHELL.value
      ],
      logs: [`Starting kernel ${name}`],
      status: 'pending'
    }
  };
}

export function updateKernelStatus (state, { id, status }) {
  return {
    ...state,
    [id]: {
      ...state[id],
      status
    }
  };
}

export function updateKernelLogs (state, { id, logs }) {
  return {
    ...state,
    [id]: { ...state[id], logs: state[id].logs.concat(logs) }
  };
}

const INITIAL_STATE = {
  [KernelTypes.BROWSER]: KernelDefinitions[KernelTypes.BROWSER]
};

export default function kernels (state = INITIAL_STATE, action) {
  switch (action.type) {
    case KERNEL_CREATED:
      return addNewKernel(state, action.payload);
    case KERNEL_LOG:
      return updateKernelLogs(state, action.payload);
    case KERNEL_STATUS:
      return updateKernelStatus(state, action.payload);
    default:
      return state;
  }
}
