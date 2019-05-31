import CellSocketEventListener from 'modules/cells/Listener';
import {
  CellSocketEvents,
  CellStatus,
  CellActionConstants
} from 'modules/cells/Constants';

const NOOP = function () {};

describe('CellSocketEventListener dispatch', () => {
  let listener;
  let listenerMap = {};
  const store = {
    dispatch: NOOP
  };

  beforeEach(() => {
    listener = new CellSocketEventListener(store, {
      on (eventType, listener) {
        listenerMap[eventType] = listener;
      }
    });
  });

  test('it dispatches cell created event when connection fires', () => {
    const spy = jest.spyOn(store, 'dispatch');
    listenerMap[CellSocketEvents.CREATED]({
      id: 1,
      notebookId: 'new'
    });
    expect(spy).toHaveBeenCalledWith({
      type: CellActionConstants.CREATED,
      payload: {
        id: 1,
        status: CellStatus.DONE
      },
      meta: {
        notebookId: 'new'
      }
    });
    spy.mockRestore();
  });

  test('it dispatches cell result event when connection fires', () => {
    const spy = jest.spyOn(store, 'dispatch');
    listenerMap[CellSocketEvents.RESULT]({
      id: 1,
      output: 'my output\n'
    });
    expect(spy).toHaveBeenCalledWith({
      type: CellActionConstants.RESULT,
      payload: {
        id: 1,
        output: 'my output\n',
        error: undefined
      }
    });
    listenerMap[CellSocketEvents.RESULT]({
      id: 1,
      output: 'my output\n',
      error: 'oh my god\n'
    });
    expect(spy).toHaveBeenCalledWith({
      type: CellActionConstants.RESULT,
      payload: {
        id: 1,
        output: 'my output\n',
        error: 'oh my god\n'
      }
    });
    spy.mockRestore();
  });

  test('it dispatches cell status event when connection fires', () => {
    const spy = jest.spyOn(store, 'dispatch');
    listenerMap[CellSocketEvents.STATUS]({
      id: 1,
      status: CellStatus.DONE
    });
    expect(spy).toHaveBeenCalledWith({
      type: CellActionConstants.STATUS,
      payload: {
        id: 1,
        status: CellStatus.DONE
      }
    });
    spy.mockRestore();
  });
});
