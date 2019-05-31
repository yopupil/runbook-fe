/**
 * @module runtime
 * @namespace reducers
 *
 * Reducers related to runtime
 *
 */
import invariant from 'invariant';
import {
  RuntimeActionConstants,
  RuntimeStatus
} from 'modules/runtime/Constants';
import BrowserRuntime from 'modules/runtime/BrowserRuntime';

/**
 * Add a new runtime definition
 *
 * A runtime is an isolated container that provides interactive playground for running
 * code.
 *
 * @param {Object} state                      The current store state
 * @param {String} options.id                 The runtime id
 * @param {String} options.name               The name of the runtime, must be unique within the notebook
 * @param {String} options.image              The image to use for the runtime
 * @param {String} options.version            The runtime image version
 * @param {Array.String} options.modes        The execution modes allowed for the runtime
 * @return {Object}                           Updated state
 */
function addNewRuntime (state, { id, name, image, version, modes }) {
  return {
    ...state,
    [id]: {
      id,
      name,
      image,
      version,
      modes,
      logs: [`Starting runtime ${name}`],
      status: RuntimeStatus.PENDING
    }
  };
}

/**
 * Update a runtime's status
 * @param  {Object} state                         Store state
 * @param  {String} options.id                    Runtime id
 * @param  {RuntimeConstants} options.status      One of the RuntimeConstant values
 * @return {Object}                               Updated state
 */
function updateRuntimeStatus (state, { id, status }) {
  const allowedStatusValues = Object.keys(RuntimeStatus).map(
    k => RuntimeStatus[k]
  );
  invariant(
    allowedStatusValues.indexOf(status) !== -1,
    `Unknown runtme status ${status}. status must be one of ${allowedStatusValues}`
  );
  return {
    ...state,
    [id]: {
      ...state[id],
      status
    }
  };
}

/**
 * Update the logs for a runtime
 * @param  {Object} state        Store state
 * @param  {String} options.id   The id of the runtime
 * @param  {Array.String} options.logs Array of logs
 * @return {Object}              Updated state
 */
function updateRuntimeLogs (state, { id, logs }) {
  return {
    ...state,
    [id]: { ...state[id], logs: (state[id].logs || []).concat(logs) }
  };
}

export const RuntimeReducers = {
  addNewRuntime: addNewRuntime,
  updateRuntimeLogs: updateRuntimeLogs,
  updateRuntimeStatus: updateRuntimeStatus
};

/**
 * The default runtime is the browser's main runtime. It can only be used for running config files.
 */

const INITIAL_STATE = {
  [BrowserRuntime.id]: BrowserRuntime
};

export function runtimeStateHandler (state = INITIAL_STATE, action) {
  switch (action.type) {
    case RuntimeActionConstants.CREATED:
      return RuntimeReducers.addNewRuntime(state, action.payload);
    case RuntimeActionConstants.LOG:
      return RuntimeReducers.updateRuntimeLogs(state, action.payload);
    case RuntimeActionConstants.STATUS:
      return RuntimeReducers.updateRuntimeStatus(state, action.payload);
    default:
      return state;
  }
}
