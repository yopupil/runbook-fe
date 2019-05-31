import SocketNamespace from './SocketClient';
import store from 'store/Store';

import * as KernelActionConstants from 'actions/KernelActionConstants';

export const KernelsSocket = new SocketNamespace('kernels');

export const KernelSocketEvents = {
  CREATE_KERNEL: 'kernel_create',
  KERNEL_LOG: 'kernel_log',
  KERNEL_CREATED: 'kernel_created',
  KERNEL_STATUS: 'kernel_status'
};

// *********************************************************
// Listeners and store actions
// *********************************************************
KernelsSocket.on(
  KernelSocketEvents.KERNEL_CREATED,
  ({ id, name, image, version, value, language, notebookId }) => {
    store.dispatch({
      type: KernelActionConstants.KERNEL_CREATED,
      payload: {
        id,
        name,
        image,
        language,
        value,
        version
      },
      meta: {
        notebookId
      }
    });
  }
);

KernelsSocket.on(KernelSocketEvents.KERNEL_LOG, ({ id, logs }) => {
  store.dispatch({
    type: KernelActionConstants.KERNEL_LOG,
    payload: {
      id,
      logs
    }
  });
});

KernelsSocket.on(KernelSocketEvents.KERNEL_STATUS, ({ id }) => {
  store.dispatch({
    type: KernelActionConstants.KERNEL_STATUS,
    payload: {
      id,
      status: 'ready'
    }
  });
});
