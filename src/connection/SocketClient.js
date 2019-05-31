import io from 'socket.io-client';

export default class SocketNamespace {
  /**
   * The namespace to use for socket communication
   * @param  {String} namespace The namespace for the socket comm
   */
  constructor (namespace) {
    this.namespace = namespace;
    this.socket = null;
    this._connected = false;
    this._listenerQueue = [];
    this._emitQueue = [];
  }

  // *********************************************************
  // Private methods
  // *********************************************************
  _setupConnListeners (socket) {
    socket.on('connect', () => {
      this._connected = true;
      this._emitQueue.forEach(item => {
        socket.emit(item[0], ...item[1]);
      });
      this._emitQueue = [];
    });

    socket.on('disconnect', () => {
      this._connected = false;
    });

    this._listenerQueue.forEach(item => {
      socket.on(item[0], item[1]);
    });
  }

  _connect () {
    this.socket = io.connect(`/${this.namespace}`);
    this._setupConnListeners(this.socket);
  }

  // *********************************************************
  // Public methods
  // *********************************************************
  get isConnected () {
    return this._connected;
  }

  emit (event, ...args) {
    event = event.replace('SocketEvent::', '');
    if (!this.isConnected) {
      this._emitQueue.push([event, args]);
      this._connect();
    } else {
      this.socket.emit(event, ...args);
    }
  }

  on (event, listener) {
    event = event.replace('SocketEvent::', '');
    if (!this.isConnected) {
      return this._listenerQueue.push([event, listener]);
    } else {
      this.socket.on(event, listener);
    }
  }
}
