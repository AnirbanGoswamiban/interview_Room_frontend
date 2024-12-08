import * as actions from '../actions/index'

const initialState = {
  toastData: {type:null,message:''},
  loader : false,
  curCompoenet : "",
  user : ""
};

const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.globalActions.SET_TOAST:
      return {
        ...state,
        toastData: action.payload,
      };
    case actions.globalActions.SET_LOADER:
      return {
        ...state,
        toastData: action.payload,
      };
    case actions.globalActions.SET_CUR_COMPONENT:
      return {
        ...state,
        curCompoenet: action.payload,
      };
    case actions.globalActions.SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default globalReducer;
