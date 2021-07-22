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
if (initialState) {
  store = createStore(
    rootReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
} else {
  store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}
export default store;

setInterval(() => {
  // Save store state to localstorage
  if (window.localStorage) {
    window.localStorage.setItem('s', JSON.stringify(store.getState()));
  }
}, 5000);
