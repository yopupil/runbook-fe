/**
 * A cell output variable represents an observable that can use polling
 * to represent its readiness. The cell output variable is the key to
 * constructing the computational dependency graph.
 */
export default class Variable {
  static PENDING = Symbol('PENDING');
  static READY = Symbol('READY');
  static ERROR = Symbol('ERROR');

  // Registry stores the list of variable names for a single notebook.
  // The notebook that is currently executing is denoted as `current`.
  // Imported notebooks will have the name of the notebook as key.
  // Having a registry prevents duplicate variable name references that
  // shadow a given name. When using variables from imported notebooks,
  // fully qualified names must be used.
  static _registry = {};

  constructor (name) {
    this._status = Variable.PENDING;
    /*
      Each variable is referenced by it's name. If there are two colliding
      variable names, the runtime must uniquely identify them.
     */
    this.name = name;
  }

  /**
   * Getter for status
   * @return {Symbol} The ready state of this variable
   */
  get status () {
    return this._status;
  }

  /**
   * Poll for status updates.
   * @return {Symbol} Ready state of the variable
   */
  async poll () {
    if (this.status === Variable.PENDING) {
      await this._getUpdatedStatus();
    }
    return this.status;
  }

  /**
   * Poll for status updates from the kernel.
   */
  async _getUpdatedStatus () {
    throw new Error('Subclasses must implement this method.');
  }
}
