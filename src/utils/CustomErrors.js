export class PermissionDeniedError extends Error {
  static isInstance (error) {
    return error.name === 'PermissionDeniedError';
  }

  constructor (message) {
    super(message);
    this.name = 'PermissionDeniedError';
  }
}
export class NotFoundError extends Error {
  static isInstance (error) {
    return error.name === 'NotFoundError';
  }

  constructor (message) {
    super(message);
    this.name = 'NotFoundError';
  }
}
