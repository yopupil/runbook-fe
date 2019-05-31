import SocketNamespace from './SocketClient';
import store from 'store/Store';

import * as CellActionConstants from 'actions/CellActionConstants';

export const CodeFilesSocket = new SocketNamespace('code-files');

export const CodeFileSocketEvents = {
  CREATE: 'code_file_create',
  NAME: 'code_file_name'
};

// *********************************************************
// Listeners and store actions
// *********************************************************
CodeFilesSocket.on(CodeFileSocketEvents.NAME, ({ id, filePath }) => {
  store.dispatch({
    type: CellActionConstants.UPDATE_CELL,
    payload: {
      id,
      title: 'file://' + filePath
    }
  });
});
