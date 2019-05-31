import { createStore } from 'redux';
import rootReducer from 'reducers';

let initialState = undefined;
if (window.localStorage) {
  initialState = window.localStorage.getItem('s');
  try {
    initialState = JSON.parse(initialState);
  } catch (e) {
    // Ignore
  }
}

let store;
if (!initialState) {
  store = createStore(rootReducer);
} else {
  store = createStore(rootReducer, initialState);
}
export default store;

setInterval(() => {
  // Save store state to localstorage
  if (window.localStorage) {
    window.localStorage.setItem('s', JSON.stringify(store.getState()));
  }
}, 5000);
