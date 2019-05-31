import SocketNamespace from './SocketClient';
import store from 'store/Store';

import * as CellActionConstants from 'actions/CellActionConstants';

export const CellsSocket = new SocketNamespace('cells');

export const CellSocketEvents = {
  CODE_RESULT: 'code_result',
  CODE_RUN: 'code_run',
  CREATE_ENDPOINT: 'endpoint_create'
};

// *********************************************************
// Listeners and store actions
// *********************************************************
CellsSocket.on(CellSocketEvents.CODE_RESULT, ({ id, error, output }) => {
  store.dispatch({
    type: CellActionConstants.CODE_RESULT,
    payload: {
      id,
      error,
      output
    }
  });
});
