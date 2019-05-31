import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import ProfileStore from 'shared/profile/ProfileStore';

it('renders without crashing', done => {
  const promise = Promise.resolve({});
  let spy = jest
    .spyOn(ProfileStore, 'fetchProfile')
    .mockImplementation(() => promise);
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  promise.then(() => {
    ReactDOM.unmountComponentAtNode(div);
    spy.mockRestore();
    done();
  });
});
