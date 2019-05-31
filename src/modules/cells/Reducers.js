/**
 * @module cells
 * @namespace reducers
 *
 * Reducers related to cells
 *
 */
import invariant from 'invariant';
import { CellActionConstants, CellStatus } from 'modules/cells/Constants';
import BrowserRuntime from 'modules/runtime/BrowserRuntime';

/**
 * Add a new cell into the notebook. The payload can originate from the client or from a server side
 * event. Duplicates are handled appropriately.
 *
 * A cell represents a unit of code that can be run in the system
 *
 * @param {Object} state                      The current store state
 * @param {String} options.id                 The cell id
 * @param {String} options.runtimeId          The runtime associated with this cell. If no runtime is specified,
 *                                            we will use the previously selected/active cell to set the runtime.
 * @param {String} options.status             The cell status
 * @return {Object}                           Updated state
 */
function addNewCell (
  state,
  { id, runtimeId, status = CellStatus.PENDING } = {}
) {
  return {
    ...state,
    [id]: {
      id,
      runtimeId,
      status
    }
  };
}

/**
 * Update cell status
 * @param  {Object} state                         Store state
 * @param  {String} options.id                    Cell id
 * @param  {CellStatus} options.status      One of the CellStatus values
 * @return {Object}                               Updated state
 */
function updateCellStatus (state, { id, status }) {
  const allowedStatusValues = Object.keys(CellStatus).map(k => CellStatus[k]);
  invariant(
    allowedStatusValues.indexOf(status) !== -1,
    `Unknown cell status ${status}. status must be one of ${allowedStatusValues}`
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
 * Clear the results for the cell, usually before a fresh run
 *
 * @param  {Object} state      Initial state for all cells
 * @param  {String} options.id Cell id
 * @return {Object}            Updated state
 */
function clearCellResult (state, { id }) {
  return {
    ...state,
    [id]: {
      ...state[id],
      output: undefined,
      error: undefined
    }
  };
}

/**
 * Update the cell result
 * @param  {Object} state           Store state
 * @param  {String} options.id      The id of the cell
 * @param  {String} options.output  The cell output
 * @param  {String} options.error   The cell error output
 * @return {Object}                 Updated state
 */
function updateCellResult (state, { id, output, error }) {
  return {
    ...state,
    [id]: {
      ...state[id],
      output:
        (state[id].output || '') + (state[id].output ? '\n' : '') + output,
      error: (state[id].error || '') + (state[id].error ? '\n' : '') + error
    }
  };
}

export const CellReducers = {
  addNewCell,
  updateCellResult,
  updateCellStatus,
  clearCellResult
};

/**
 * Initial state
 */

const INITIAL_STATE = {
  cells: {},
  activeCellId: null
};

export function cellStateHandler (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CellActionConstants.CREATED:
      return CellReducers.addNewCell(state, action.payload);
    case CellActionConstants.RESULT:
      return CellReducers.updateCellResult(state, action.payload);
    case CellActionConstants.STATUS:
      return CellReducers.updateCellStatus(state, action.payload);
    case CellActionConstants.CLEAR:
      return CellReducers.clearCellResult(state, action.payload);
    default:
      return state;
  }
}
