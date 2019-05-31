import RuntimeListener from 'modules/runtime/Listener';
import {
  RuntimeSocketEvents,
  RuntimeActionConstants
} from 'modules/runtime/Constants';

const NOOP = function () {};

describe('RuntimeListener dispatch', () => {
  let listener;
  let listenerMap = {};
  const store = {
    dispatch: NOOP
  };

  beforeEach(() => {
    listener = new RuntimeListener(store, {
      on (eventType, listener) {
        listenerMap[eventType] = listener;
      }
    });
  });

  test('it dispatches runtime created event when connection fires', () => {
    const spy = jest.spyOn(store, 'dispatch');
    listenerMap[RuntimeSocketEvents.CREATED]({
      id: 1
    });
    expect(spy).toHaveBeenCalledWith({
      type: RuntimeActionConstants.CREATED,
      payload: {
        id: 1
      },
      meta: {
        notebookId: undefined
      }
    });
    spy.mockRestore();
  });

  test('it dispatches runtime log event when connection fires', () => {
    const spy = jest.spyOn(store, 'dispatch');
    listenerMap[RuntimeSocketEvents.LOG]({
      id: 1,
      logs: ['hai']
    });
    expect(spy).toHaveBeenCalledWith({
      type: RuntimeActionConstants.LOG,
      payload: {
        id: 1,
        logs: ['hai']
      }
    });
    spy.mockRestore();
  });

  test('it dispatches runtime status event when connection fires', () => {
    const spy = jest.spyOn(store, 'dispatch');
    listenerMap[RuntimeSocketEvents.STATUS]({
      id: 1,
      status: 'done'
    });
    expect(spy).toHaveBeenCalledWith({
      type: RuntimeActionConstants.STATUS,
      payload: {
        id: 1,
        status: 'done'
      }
    });
    spy.mockRestore();
  });
});
