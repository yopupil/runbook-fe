import { CREATE_CELL } from 'actions/CellActionConstants';
import { KernelTypes } from 'constants/CellConstants';
import { KERNEL_CREATED } from 'actions/KernelActionConstants';

const INITIAL_STATE = {
  new: {
    cellIds: [],
    kernelIds: [KernelTypes.BROWSER]
  }
};

export function addCellToNotebook (
  state,
  { notebookId, direction, cellIndex },
  { id }
) {
  let start, end;
  if (direction === 'below') {
    start = cellIndex + 1;
    end = cellIndex + 1;
  } else {
    start = cellIndex;
    end = cellIndex;
  }
  let cellIds = state[notebookId].cellIds;
  cellIds = cellIds
    .slice(0, start)
    .concat([id])
    .concat(cellIds.slice(end));
  return Object.assign({}, state, {
    [notebookId]: {
      ...state[notebookId],
      cellIds
    }
  });
}

export function addKernelToNotebook (state, { notebookId }, { id }) {
  if (state[notebookId].kernelIds.indexOf(id) > -1) {
    return state;
  }
  return {
    ...state,
    [notebookId]: {
      ...state[notebookId],
      kernelIds: state[notebookId].kernelIds.concat([id])
    }
  };
}

function assertNotebookId (action) {
  if (!action.meta || (action.meta && !action.meta.notebookId)) {
    throw new Error('Notebook actions must include notebook id');
  }
}

export default function notebooks (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_CELL:
      assertNotebookId(action);
      return addCellToNotebook(state, action.meta, action.payload);
    case KERNEL_CREATED:
      assertNotebookId(action);
      return addKernelToNotebook(state, action.meta, action.payload);
    default:
      return state;
  }
}
