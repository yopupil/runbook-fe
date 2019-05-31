/**
 * @module  runtime
 */

import { RuntimeSocketConn } from 'modules/runtime/SocketConn';
import { RuntimeSocketEvents } from 'modules/runtime/Constants';

/**
 * An action creator responsible for dispatching an action that creates a new
 * runtime
 *
 * @param  {String} options.notebookId      The id of the notebook
 * @param  {RuntimeConfig} options.config   The parsed config object
 * @return {Object}                         Dummy action
 */
export function createRuntimeAction ({ notebookId, config }) {
  RuntimeSocketConn.emit(RuntimeSocketEvents.CREATE, {
    notebookId,
    ...config.toObject()
  });
  return {
    type: 'UNKNOWN_ACTION'
  };
}
