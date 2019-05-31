import Variable from 'variables/Variable';

/**
 * A Kernel variable represents the state of a system kernel or the
 * browser kernel. When a kernel variable is referenced by a cell (for e.g
 * by specifying the runtime kernel to use, then it must wait for the kernel to
 * be ready or abort if the kernel errors out.) The ComputeEngine will use the ready
 * state before running code cells.
 *
 */
export default class KernelVariable extends Variable {
  constructor (name, image, version) {
    super(name);
    this.image = image;
    this.version = version;
    this._containerId = null;
  }

  get value () {
    return this._containerId;
  }

  async _getUpdatedStatus (socket) {
    // Check if the kernel is ready using the socket connection
    socket.emit('aura::kernel::status', {
      image: this.image,
      version: this.version
    });
  }
}
