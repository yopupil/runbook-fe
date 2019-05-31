import cuid from 'cuid';

import { CellsSocket, CellSocketEvents } from 'connection/CellsSocketConn';
import {
  CodeFilesSocket,
  CodeFileSocketEvents
} from 'connection/CodeFilesSocketConn';
import {
  CREATE_CELL,
  UPDATE_CELL,
  CODE_RESULT
} from 'actions/CellActionConstants';
import { KernelTypes, KernelDefinitions } from 'constants/CellConstants';

export function createCellAction (cellIndex, direction = 'below', notebookId) {
  const newCell = {
    id: cuid()
  };
  return {
    type: CREATE_CELL,
    payload: newCell,
    meta: {
      cellIndex,
      direction,
      notebookId
    }
  };
}

export function updateCellAction (partialBody) {
  return {
    type: UPDATE_CELL,
    payload: partialBody
  };
}

export function runCodeInCellAction (code, title, cellId, kernelId, language) {
  // Thunk needed ?
  const cellType = title.slice(0, 7) === 'file://' ? 'file' : 'cell';
  // If kernel is browser omit this step, and eval the code and send output
  if (kernelId === KernelDefinitions[KernelTypes.BROWSER].value) {
    let output, error;
    try {
      // TODO: sandbox
      output = eval(code);
      if (output) {
        output = output.toString();
      }
    } catch (e) {
      error = e.toString();
    }
    return {
      type: CODE_RESULT,
      payload: {
        id: cellId,
        error,
        output
      }
    };
  }
  CellsSocket.emit(CellSocketEvents.CODE_RUN, {
    code,
    cellId: cellId,
    kernelId: kernelId,
    cellType,
    filePath: title.replace('file://', ''),
    language: language.toLowerCase()
  });
  return {
    type: 'UNKNOWN_ACTION',
    payload: {}
  };
}

export function mountCellAsFileAction (
  cellId,
  kernelId,
  { filePath, content }
) {
  CodeFilesSocket.emit(CodeFileSocketEvents.CREATE, {
    kernel: kernelId,
    cellId: cellId,
    filePath: filePath.replace('file://', ''),
    content: content || ''
  });
  return {
    type: UPDATE_CELL,
    payload: {
      id: cellId,
      title: filePath
    }
  };
}

export function createEndpointAction ({ id, kernelId, filePath, config }) {
  CellsSocket.emit(CellSocketEvents.CREATE_ENDPOINT, {
    cellId: id,
    kernelId,
    config,
    filePath: filePath.replace('file://', '')
  });
  return {
    type: UPDATE_CELL,
    payload: {
      id,
      outputMeta: {
        endpointDefinition: config
      }
    }
  };
}
