import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk'; // Use default import
import rootReducer from '../reducers/index';

// Apply middleware
const middleware = [thunk];
const store = createStore(rootReducer, applyMiddleware(...middleware));

export default store;
