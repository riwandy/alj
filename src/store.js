//Redux Store
import { applyMiddleware, createStore } from 'redux';
import reducer from './reducers';
import {createLogger} from 'redux-logger';

applyMiddleware(createLogger())

export default createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())