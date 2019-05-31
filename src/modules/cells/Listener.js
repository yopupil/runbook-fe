import BaseSocketEventListener from 'modules/base/Listener';
import {
  CellSocketEvents,
  CellActionConstants,
  CellStatus
} from 'modules/cells/Constants';

/**
 * A listener that mirrors the cell status in the backend. A cell contains executable code that is
 * usually run by the backend. Certain commands are run by the front-end, for e.g markdown and HTML
 * cells are executed in the browser runtime. Other cell types dispatch to the appropriate runtime.
 *
 * @module cells
 *
 * @class
 */
export default class CellSocketEventListener extends BaseSocketEventListener {
  /**
   * Store the unique id of the runtime so that we can listen for updates
   * @param  {ReduxStore} store The redux store
   * @param  {SocketConn} conn  The socket connection for runtime namespace
   */
  constructor (store, conn) {
    super('cell', store, conn);
  }

  // *********************************************************
  // Event listeners
  // *********************************************************
  /**
   * Start listening for messages over the socket. All updates including logs will flow
   * via this listener.
   */
  _setupListeners () {
    const CellSocketConn = this.conn;
    this._onCellCreated = this._onCellCreated.bind(this);
    this._onCellResult = this._onCellResult.bind(this);
    this._onCellStatus = this._onCellStatus.bind(this);
    /*
			Dispatch the appropriate actions and start listening via socket
		 */
    CellSocketConn.on(CellSocketEvents.CREATED, this._onCellCreated);

    CellSocketConn.on(CellSocketEvents.RESULT, this._onCellResult);

    CellSocketConn.on(CellSocketEvents.STATUS, this._onCellStatus);
  }
  // *********************************************************
  // Private methods
  // *********************************************************
  _onCellCreated ({ id, notebookId }) {
    this.store.dispatch({
      type: CellActionConstants.CREATED,
      payload: {
        id,
        status: CellStatus.DONE
      },
      meta: {
        notebookId
      }
    });
  }

  _onCellResult ({ id, output, error }) {
    this.store.dispatch({
      type: CellActionConstants.RESULT,
      payload: {
        id,
        output,
        error
      }
    });
  }

  _onCellStatus ({ id, status }) {
    this.store.dispatch({
      type: CellActionConstants.STATUS,
      payload: {
        id,
        status
      }
    });
  }
}
