import { CellActionConstants, CellStatus } from '../Constants';
import { CellReducers, cellStateHandler } from '../Reducers';

function NOOP () {}

describe('Cell state handler', () => {
  let state;
  beforeEach(() => {
    state = cellStateHandler(undefined, {});
  });

  test('it must have default empty state as initial state', () => {
    expect(state).toBeDefined();
    expect(Object.keys(state.cells).length).toEqual(0);
    expect(state.activeCellId).toEqual(null);
  });

  test('it must call addNewCell when action is raised', () => {
    const spy = jest
      .spyOn(CellReducers, 'addNewCell')
      .mockImplementation(() => NOOP);
    cellStateHandler(state, {
      type: CellActionConstants.CREATED
    });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('it must call updateCellStatus when action is raised', () => {
    const spy = jest
      .spyOn(CellReducers, 'updateCellStatus')
      .mockImplementation(() => NOOP);
    cellStateHandler(state, {
      type: CellActionConstants.STATUS
    });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('it must call updateCellResult when action is raised', () => {
    const spy = jest
      .spyOn(CellReducers, 'updateCellResult')
      .mockImplementation(() => NOOP);
    cellStateHandler(state, {
      type: CellActionConstants.RESULT
    });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('it must call clearCellResult when action is raised', () => {
    const spy = jest
      .spyOn(CellReducers, 'clearCellResult')
      .mockImplementation(() => NOOP);
    cellStateHandler(state, {
      type: CellActionConstants.CLEAR
    });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('Cell reducers', () => {
  test('addNewCell must return all payload values assigned to state', () => {
    const input = {
      id: 'new',
      runtimeId: 'test',
      status: CellStatus.DONE
    };
    expect(CellReducers.addNewCell({}, input)).toEqual({
      new: {
        ...input
      }
    });
  });

  test('addNewCell must add default cell status as PENDING', () => {
    const input = {
      id: 'new',
      runtimeId: 'test'
    };
    expect(CellReducers.addNewCell({}, input)).toEqual({
      new: {
        ...input,
        status: CellStatus.PENDING
      }
    });
  });

  test('updateCellStatus must update the status of cell and throw error if wrong status is passed', () => {
    expect(
      CellReducers.updateCellStatus(
        {
          new: {
            status: CellStatus.PENDING
          }
        },
        {
          id: 'new',
          status: CellStatus.DONE
        }
      ).new.status
    ).toBe(CellStatus.DONE);

    expect(
      CellReducers.updateCellStatus(
        {
          new: {
            status: CellStatus.PENDING
          }
        },
        {
          id: 'new',
          status: CellStatus.ERROR
        }
      ).new.status
    ).toBe(CellStatus.ERROR);

    expect(() => {
      CellReducers.updateCellStatus(
        {
          new: {
            status: CellStatus.PENDING
          }
        },
        {
          id: 'new',
          status: '***'
        }
      );
    }).toThrow();
  });

  test('updateCellResult must update cell result', () => {
    expect(
      CellReducers.updateCellResult(
        {
          new: {}
        },
        {
          id: 'new',
          output: 'test\n'
        }
      ).new.output
    ).toEqual('test\n');

    expect(
      CellReducers.updateCellResult(
        {
          new: {}
        },
        {
          id: 'new',
          error: 'Oh noes'
        }
      ).new.error
    ).toEqual('Oh noes');
  });

  test('updateCellResult must append to cell output and error', () => {
    expect(
      CellReducers.updateCellResult(
        {
          new: {
            output: 'line1'
          }
        },
        {
          id: 'new',
          output: 'line2\n'
        }
      ).new.output
    ).toEqual('line1\nline2\n');

    expect(
      CellReducers.updateCellResult(
        {
          new: {
            error: 'Oh noes1'
          }
        },
        {
          id: 'new',
          error: 'Oh noes2'
        }
      ).new.error
    ).toEqual('Oh noes1\nOh noes2');
  });

  test('clearCellResult must wipe error and output', () => {
    const state = CellReducers.clearCellResult(
      {
        new: {
          output: 'line1',
          error: 'hooyah'
        }
      },
      {
        id: 'new'
      }
    );
    expect(state.new.output).toBeFalsy();
    expect(state.new.error).toBeFalsy();
  });
});
