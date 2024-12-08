import * as actions from '../actions/index'

const initialState = {
  roomUuid: "",
  roomMessages : [],
  codeText : "",
  codeLanguage : "javascript",
  peers : {},
  curStream : null
};

const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.RoomActions.SET_ROOM_ID:
      return {
        ...state,
        roomUuid: action.payload,
      };
      case actions.RoomActions.SET_MESSAGE:
        return {
          ...state,
          roomMessages: [...state.roomMessages,action.payload],
        };
      case actions.RoomActions.SET_CODE:
        return {
          ...state,
          codeText: action.payload,
        };
      case actions.RoomActions.SEt_LANGUAGE:
        return {
          ...state,
          codeLanguage: action.payload,
        };
      case actions.RoomActions.SET_STREAM:
        return {
          ...state,
          curStream: action.payload,
        };
      case actions.RoomActions.SET_PEERS:
        return {
          ...state,
          peers: action.payload
        };
    default:
      return state;
  }
};

export default roomReducer;
