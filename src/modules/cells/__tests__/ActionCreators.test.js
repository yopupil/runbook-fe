import { createCellAction, clearCellAction } from '../ActionCreators';
import { CellSocketConn } from '../SocketConn';
import {
  CellSocketEvents,
  CellActionConstants,
  CellStatus
} from '../Constants';

test('it should send message via socket connection to create cell', () => {
  const spy = jest
    .spyOn(CellSocketConn, 'emit')
    .mockImplementation(() => function () {});

  const r = createCellAction({
    notebookId: 'nid',
    runtimeId: 'rid',
    language: 'python'
  });
  expect(spy).toHaveBeenCalledWith(CellSocketEvents.CREATE, {
    cellId: 'cuid',
    notebookId: 'nid',
    runtimeId: 'rid',
    language: 'python'
  });

  expect(r.type).toEqual(CellActionConstants.CREATED);
  expect(r.payload.id).toEqual('cuid');
  expect(r.payload.status).toEqual(CellStatus.PENDING);
  expect(r.meta.notebookId).toEqual('nid');
});

test('it should return clear cell action', () => {
  const r = clearCellAction({
    id: 'cid'
  });
  expect(r.payload.id).toEqual('cid');
  expect(r.type).toEqual(CellActionConstants.CLEAR);
});
