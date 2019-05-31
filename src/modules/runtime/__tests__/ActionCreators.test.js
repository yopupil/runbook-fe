import { createRuntimeAction } from '../ActionCreators';
import { RuntimeSocketConn } from '../SocketConn';
import { RuntimeSocketEvents } from '../Constants';
import { RuntimeConfig } from '../ConfigParser';

test('it should dispatch message via socket connection to create runtime', () => {
  const spy = jest
    .spyOn(RuntimeSocketConn, 'emit')
    .mockImplementation(() => function () {});
  const config = new RuntimeConfig('a', 'b', null, ['test']);
  createRuntimeAction({
    notebookId: 'nid',
    config
  });
  expect(spy).toHaveBeenCalledWith(RuntimeSocketEvents.CREATE, {
    notebookId: 'nid',
    ...config.toObject()
  });
});
