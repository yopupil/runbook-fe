import cuid from 'cuid';

import {
  CREATE_CELL,
  UPDATE_CELL,
  CODE_RESULT
} from 'actions/CellActionConstants';
import {
  CellTypes,
  KernelDefinitions,
  CellContentTypes
} from 'constants/CellConstants';

const INITIAL_STATE = {
  /*
    cellId: {
      cellDetails..
    }
   */
};

/**
 * Create a new cell and add it to notebook
 * @param  {Object} state    Notebook state
 * @param  {Object} payload  The body of new cell
 * @return {Object}          Updated notebook state
 */
export function createCell (state, payload) {
  const newCell = {
    id: cuid(),
    // A new cell is always a command cell
    type: CellTypes.COMMAND,
    // Default mode is same as that of the cell above/below
    contentType: CellContentTypes[CellTypes.COMMAND].JAVASCRIPT.value,
    // Default kernel is same as that of cell above/below
    kernelType: KernelDefinitions.BROWSER.value,
    title: '',
    // Meta
    inputMeta: {
      isReadOnly: false,
      isCollapsed: false,
      isVisible: true
    },
    state: {},
    outputMeta: {
      isCollapsed: false,
      isVisible: true
    },
    ...payload
  };
  return Object.assign(
    {
      [newCell.id]: newCell
    },
    state
  );
}

function makeVisibleIfExpanded (payload = {}, state, segment) {
  // If a cell segment is expanded, and it is not visible,
  // then make it visible as well
  let { isCollapsed, isVisible } = state[segment];
  if (payload.isCollapsed !== isCollapsed) {
    // If uncollapsed, unhide it as well
    if (!payload.isCollapsed) {
      payload.isVisible = true;
    }
  } else if (payload.isVisible !== isVisible) {
    if (!payload.isVisible) {
      payload.isCollapsed = true;
    }
  }
}

export function updateCodeResult (state, { id, error, output }) {
  return {
    ...state,
    [id]: {
      ...state[id],
      state: {
        ...state[id].state,
        codeResult: {
          error,
          output:
            (state[id].state.codeResult || { error: '', output: '' }).output +
            output
        }
      }
    }
  };
}

export function extendObjectState (currentState, existingState) {
  if (!currentState) {
    existingState;
  }
  return {
    ...existingState,
    ...currentState
  };
}

/**
 * Update a cell's state
 * @param  {Object} state   The state corresponding to all cells
 * @param  {Object} payload The updated state for the cell
 * @return {Object}         New state containing updated cell
 */
export function updateCell (state, payload) {
  makeVisibleIfExpanded(payload.inputMeta, state[payload.id], 'inputMeta');
  makeVisibleIfExpanded(payload.outputMeta, state[payload.id], 'outputMeta');
  // If payload contains inputMeta or outputMeta, clone and merge
  payload.inputMeta = extendObjectState(
    payload.inputMeta,
    state[payload.id].inputMeta
  );
  payload.outputMeta = extendObjectState(
    payload.outputMeta,
    state[payload.id].outputMeta
  );
  return Object.assign({}, state, {
    [payload.id]: { ...state[payload.id], ...payload }
  });
}

/**
 * Core cells reducer. Each cell is namespaced with the notebook id
 * so that we can import cells from other notebooks.
 *
 * @param  {Object} state  Initial cell state
 * @param  {Object} action The action that is being dispatched
 * @return {Object}        Mutated state
 */
export default function cellsReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_CELL:
      return createCell(state, action.payload);
    case UPDATE_CELL:
      return updateCell(state, action.payload);
    case CODE_RESULT:
      return updateCodeResult(state, action.payload);
    default:
      return state;
  }
}
