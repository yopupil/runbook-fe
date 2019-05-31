/**
 * @module  cells
 */
import cuid from 'cuid';
import { CellSocketConn } from 'modules/cells/SocketConn';
import {
  CellSocketEvents,
  CellActionConstants,
  CellStatus
} from 'modules/cells/Constants';

/**
 * An action creator responsible for dispatching an action that creates a new
 * cell
 *
 * @param  {String} options.notebookId      The id of the notebook
 * @param  {String} options.runtimeId       The id of the runtime in which cell must be run
 * @param  {String} options.language        The language setting for the cell
 * @return {Object}                         Created action with pending status
 */
export function createCellAction ({ notebookId, runtimeId, language }) {
  const cellId = cuid();
  // Create a new cell in the backend for storage. Backend will store them as part of the notebook
  // so that cells can be reloaded when user opens up the notebook.
  CellSocketConn.emit(CellSocketEvents.CREATE, {
    notebookId,
    cellId,
    runtimeId,
    language
  });
  // Other metadata will be synced on changes
  return {
    type: CellActionConstants.CREATED,
    payload: {
      id: cellId,
      runtimeId,
      status: CellStatus.PENDING,
      language
    },
    meta: {
      notebookId
    }
  };
}

/**
 * Clear the cell's output
 * @param  {String} options.id The id of the cell to clear
 * @return {Object}                Action payload for clearing cell
 */
export function clearCellAction ({ id }) {
  return {
    type: CellActionConstants.CLEAR,
    payload: {
      id
    }
  };
}
