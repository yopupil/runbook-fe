/**
 * @module cells
 */

/**
 *
 * These are used for cell related socket events
 *
 * @type {Object} CellSocketEvents
 */
export const CellSocketEvents = {
  CREATE: 'SocketEvent::create_cell',
  CREATED: 'SocketEvent::cell_created',
  RESULT: 'SocketEvent::cell_result',
  STATUS: 'SocketEvent::cell_status'
};

/**
 * @type {Object} RuntimeStatus The status of runtime
 */
export const CellStatus = {
  PENDING: 'pending',
  BUSY: 'busy',
  DONE: 'done',
  ERROR: 'error'
};

/**
 *
 * These are used for cell related redux actions
 *
 * @type {Object} CellActionConstants
 *
 */
export const CellActionConstants = {
  CREATED: 'ActionType::CELL_CREATED',
  STATUS: 'ActionType::CELL_STATUS',
  RESULT: 'ActionType::CELL_RESULT',
  CLEAR: 'ActionType::CELL_CLEAR'
};
