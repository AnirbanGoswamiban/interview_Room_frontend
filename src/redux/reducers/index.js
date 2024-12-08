import { combineReducers } from 'redux';
import roomReducer from '../reducers/roomReducer';
import globalReducer from '../reducers/globalReducers';

const rootReducer = combineReducers({
    room: roomReducer,
    global : globalReducer
  });
  
  export default rootReducer;
