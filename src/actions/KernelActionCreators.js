import {
  KernelsSocket,
  KernelSocketEvents
} from 'connection/KernelsSocketConn';

export function createKernelAction ({ notebookId, config }) {
  KernelsSocket.emit(KernelSocketEvents.CREATE_KERNEL, {
    notebook_id: notebookId,
    ...config
  });
  return {
    type: 'UNKNOWN_ACTION'
  };
}
