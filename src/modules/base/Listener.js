/**
 * A base class for socket event listeners.
 *
 * @module base
 *
 * @class
 */
export default class BaseSocketEventListener {
  /**
   * @param  {String}     name. The name of the listener
   * @param  {ReduxStore} store The redux store
   * @param  {SocketConn} conn  The socket connection for runtime namespace
   */
  constructor (name, store, conn) {
    this.name = name;
    this.store = store;
    this.conn = conn;

    if (
      !this.store.dispatch ||
      (this.store.dispatch && typeof this.store.dispatch !== 'function')
    ) {
      throw new Error(
        `store passed to ${name} socket listener must have a dispatch method`
      );
    }

    if (!this.conn || (this.conn && typeof this.conn.on !== 'function')) {
      throw new Error(
        `conn passed to ${name} listener must have \`on\` method`
      );
    }

    this._setupListeners();
  }

  // *********************************************************
  // Event listeners
  // *********************************************************
  /**
   * Start listening for messages over the socket. All updates including logs will flow
   * via this listener.
   */
  _setupListeners () {
    // To be implemented by subclasses
    throw new Error('Not implemented');
  }
}
