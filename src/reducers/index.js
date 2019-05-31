import { combineReducers } from 'redux';
import cellsReducer from './CellsReducer';
import notebooksReducer from './NotebooksReducer';
import kernelsReducer from './KernelsReducer';

export default combineReducers({
  cells: cellsReducer,
  notebooks: notebooksReducer,
  kernels: kernelsReducer
});
