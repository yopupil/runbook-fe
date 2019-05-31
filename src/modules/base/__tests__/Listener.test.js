import BaseSocketEventListener from 'modules/base/Listener';

const NOOP = function () {};

describe('BaseSocketEventListener init', () => {
  test('it throws error if invalid store is provided', () => {
    expect(() => new BaseSocketEventListener('', {})).toThrow();
    expect(() => new BaseSocketEventListener()).toThrow();
    expect(() => new BaseSocketEventListener('', 2)).toThrow();
  });

  test('it throws error if invalid connection is provided', () => {
    expect(() => new BaseSocketEventListener('', { dispatch: NOOP })).toThrow();
    expect(
      () => new BaseSocketEventListener('', { dispatch: NOOP }, {})
    ).toThrow();
    expect(
      () => new BaseSocketEventListener('', { dispatch: NOOP }, 2)
    ).toThrow();
  });

  test('it calls _setupListeners method', () => {
    const spy = jest
      .spyOn(BaseSocketEventListener.prototype, '_setupListeners')
      .mockImplementation(() => NOOP);
    new BaseSocketEventListener(
      'test',
      {
        dispatch: NOOP
      },
      {
        on: NOOP
      }
    );
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
