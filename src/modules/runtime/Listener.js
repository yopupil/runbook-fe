import BaseSocketEventListener from 'modules/base/Listener';
import {
  RuntimeSocketEvents,
  RuntimeActionConstants
} from 'modules/runtime/Constants';

/**
 * A listener that mirrors the runtime status on the backend side for each runtime. When the runtime starts,
 * it is in pending state. Then it proceeds to either become available, or goes into error mode.
 * This class spawns a listener that listens for incoming kernel messages and relays them to the
 * store so that UI can update accordingly. In the event of a disconnection, the status moves to
 * `unknown`.
 *
 * @module runtime
 *
 * @class
 */
export default class RuntimeSocketEventListener extends BaseSocketEventListener {
  /**
   * Store the unique id of the runtime so that we can listen for updates
   * @param  {ReduxStore} store The redux store
   * @param  {SocketConn} conn  The socket connection for runtime namespace
   */
  constructor (store, conn) {
    super('runtime', store, conn);
  }

  // *********************************************************
  // Event listeners
  // *********************************************************
  /**
   * Start listening for messages over the socket. All updates including logs will flow
   * via this listener.
   */
  _setupListeners () {
    const RuntimeSocketConn = this.conn;
    /*
			Dispatch the appropriate actions and start listening via socket
		 */
    this._onRuntimeCreated = this._onRuntimeCreated.bind(this);
    this._onRuntimeLog = this._onRuntimeLog.bind(this);
    this._onRuntimeStatus = this._onRuntimeStatus.bind(this);

    // Setup listeners
    RuntimeSocketConn.on(RuntimeSocketEvents.CREATED, this._onRuntimeCreated);

    RuntimeSocketConn.on(RuntimeSocketEvents.LOG, this._onRuntimeLog);

    RuntimeSocketConn.on(RuntimeSocketEvents.STATUS, this._onRuntimeStatus);
  }
  // *********************************************************
  // Private methods
  // *********************************************************
  _onRuntimeCreated ({
    id,
    name,
    image,
    version,
    modes,
    languages,
    notebookId
  }) {
    this.store.dispatch({
      type: RuntimeActionConstants.CREATED,
      payload: {
        id,
        name,
        image,
        modes,
        languages,
        version
      },
      meta: {
        notebookId
      }
    });
  }

  _onRuntimeLog ({ id, logs }) {
    this.store.dispatch({
      type: RuntimeActionConstants.LOG,
      payload: {
        id,
        logs
      }
    });
  }

  _onRuntimeStatus ({ id, status }) {
    this.store.dispatch({
      type: RuntimeActionConstants.STATUS,
      payload: {
        id,
        status
      }
    });
  }
}
