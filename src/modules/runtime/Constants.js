/**
 * @module runtime
 */

/**
 *
 * These are used for runtime related socket events
 *
 * @type {Object} RuntimeSocketEvents
 */
export const RuntimeSocketEvents = {
  CREATE: 'SocketEvent::create_runtime',
  LOG: 'SocketEvent::runtime_log',
  CREATED: 'SocketEvent::runtime_created',
  STATUS: 'SocketEvent::runtime_status'
};

/**
 * @type {Object} RuntimeStatus The status of runtime
 */
export const RuntimeStatus = {
  PENDING: 'pending',
  ERROR: 'error',
  READY: 'ready',
  UNKNOWN: 'unknown'
};

/**
 * @module runtime
 *
 * These are used for runtime related redux actions
 *
 * @type {Object} RuntimeActionConstants
 *
 */
export const RuntimeActionConstants = {
  CREATED: 'ActionType::RUNTIME_CREATED',
  LOG: 'ActionType::RUNTIME_LOG',
  STATUS: 'ActionType::RUNTIME_STATUS'
};
