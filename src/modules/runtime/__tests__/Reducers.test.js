import BrowserRuntime from '../BrowserRuntime';
import { RuntimeActionConstants, RuntimeStatus } from '../Constants';
import { RuntimeReducers, runtimeStateHandler } from '../Reducers';

function NOOP () {}

describe('Runtime state handler', () => {
  let state;
  beforeEach(() => {
    state = runtimeStateHandler(undefined, {});
  });

  test('it must have default browser runtime in initial state', () => {
    expect(state).toBeDefined();
    expect(state[BrowserRuntime.id]).toEqual(BrowserRuntime);
  });

  test('it must call addNewRuntime when action is raised', () => {
    const spy = jest
      .spyOn(RuntimeReducers, 'addNewRuntime')
      .mockImplementation(() => NOOP);
    runtimeStateHandler(state, {
      type: RuntimeActionConstants.CREATED
    });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('it must call updateRuntimeLogs when action is raised', () => {
    const spy = jest
      .spyOn(RuntimeReducers, 'updateRuntimeLogs')
      .mockImplementation(() => NOOP);
    runtimeStateHandler(state, {
      type: RuntimeActionConstants.LOG
    });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('it must call updateRuntimeStatus when action is raised', () => {
    const spy = jest
      .spyOn(RuntimeReducers, 'updateRuntimeStatus')
      .mockImplementation(() => NOOP);
    runtimeStateHandler(state, {
      type: RuntimeActionConstants.STATUS
    });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('Runtime reducers', () => {
  test('addNewRuntime must return all payload values assigned to state', () => {
    const input = {
      id: 'new',
      name: 'new',
      image: 'test',
      version: 'latest',
      modes: ['shell']
    };
    expect(RuntimeReducers.addNewRuntime({}, input)).toEqual({
      new: {
        ...input,
        logs: ['Starting runtime new'],
        status: RuntimeStatus.PENDING
      }
    });
  });

  test('updateRuntimeStatus must update the status of runtime and throw error if wrong status is passed', () => {
    expect(
      RuntimeReducers.updateRuntimeStatus(
        {
          new: {
            status: RuntimeStatus.PENDING
          }
        },
        {
          id: 'new',
          status: RuntimeStatus.READY
        }
      ).new.status
    ).toBe(RuntimeStatus.READY);

    expect(
      RuntimeReducers.updateRuntimeStatus(
        {
          new: {
            status: RuntimeStatus.PENDING
          }
        },
        {
          id: 'new',
          status: RuntimeStatus.ERROR
        }
      ).new.status
    ).toBe(RuntimeStatus.ERROR);

    expect(() => {
      RuntimeReducers.updateRuntimeStatus(
        {
          new: {
            status: RuntimeStatus.PENDING
          }
        },
        {
          id: 'new',
          status: '***'
        }
      );
    }).toThrow();
  });

  test('updateRuntimeLogs must update runtime logs', () => {
    expect(
      RuntimeReducers.updateRuntimeLogs(
        {
          new: {
            logs: []
          }
        },
        {
          id: 'new',
          logs: ['hello', 'world']
        }
      ).new.logs
    ).toEqual(['hello', 'world']);

    expect(
      RuntimeReducers.updateRuntimeLogs(
        {
          new: {
            logs: undefined
          }
        },
        {
          id: 'new',
          logs: ['hello', 'world']
        }
      ).new.logs
    ).toEqual(['hello', 'world']);
  });
});
