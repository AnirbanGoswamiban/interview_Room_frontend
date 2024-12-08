// Action Type
import {SET_TOAST} from './globalActions'
import { SET_LOADER } from './globalActions';
import {SET_CUR_COMPONENT} from './globalActions'
import {SET_USER} from './globalActions'
import clientSocket from '../../Socket/socket'
export const CREATE_ROOM = 'CREATE_ROOM';
export const SET_ROOM_ID = "SET_ROOM_ID"
export const SET_MESSAGE = "SET_MESSAGE"
export const SET_CODE = "SET_CODE"
export const SEt_LANGUAGE = "SEt_LANGUAGE"
export const SET_PEERS = "SET_PEERS"
export const SET_STREAM = "SET_STREAM"


export const createRoom = (data) => {
  return async (dispatch) => {
      try {
        dispatch({
          type:SET_LOADER,
          payload:true
        })
          const response = await new Promise((resolve, reject) => {
              clientSocket.emit("joinRoom",data, (response) => {
                  if (response && response.success) {
                      resolve(response);  // This resolves the promise when the server responds
                  } else {
                      reject(response?.message || "Error from server");  // Rejects if response is invalid
                  }
              });
          });
          dispatch({
            type:SET_LOADER,
            payload:false
          })
          dispatch({
            type:SET_TOAST,
            payload:{type:"success",message:response.message}
          })
          dispatch({
            type:SET_USER,
            payload:response.name
          })
          dispatch({
            type:SET_CUR_COMPONENT,
            payload:"chat"
          })
      } catch (error) {
        dispatch({
          type:SET_LOADER,
          payload:false
        })
        dispatch({
          type:SET_TOAST,
          payload:{type:"failure",message:error}
        })
          console.error("Error joining room:", error);
      }
  };
};
export const sendMessage = (data) => {
  // console.log(data)
  return async (dispatch) => {
    try {

      // Sending the message to the server
      const response = await new Promise((resolve, reject) => {
        clientSocket.emit("sendMessage",data, (ack) => {
          if (ack && ack.success) {
            resolve(ack); // Resolves when the server acknowledges
          } else {
            reject(ack?.message || "Error sending message");
          }
        });
      });
      console.log(data)
      dispatch({
        type: SET_MESSAGE,
        payload: {text: data.message.data,isUser:true, sender: "me"}
      });

    } catch (error) {
      dispatch({
        type: SET_TOAST,
        payload: { type: "failure", message: error },
      });

      console.error("Error sending message:", error);
    }
  };
};

export const setRoomId = (data) => ({
  type: SET_ROOM_ID,
  payload: data
});

export const setMessage = (data) => ({
  type: SET_MESSAGE,
  payload: data
});

export const sendCode = (data) => {
  return async (dispatch) => {
    try {
      // Emit the codeChange event to the server
      // console.log("Actions",data)
      const response = await new Promise((resolve, reject) => {
        clientSocket.emit("codeChange", { roomId: data.roomId, data: data.message.data }, (ack) => {
          if (ack && ack.success) {
            resolve(ack); // Resolves if server acknowledges
          } else {
            reject(ack?.message || "Error updating code");
          }
        });
      });

      // console.log('Code change broadcasted successfully:', response);
      dispatch({
        type:SET_CODE,
        payload:data.message.data
      })

    } catch (error) {
      // Dispatch failure toast in case of an error
      dispatch({
        type: SET_TOAST,
        payload: { type: "failure", message: error },
      });

      console.error("Error updating code:", error);
    }
  };
};
export const setLanguage = (data) => {
  return async (dispatch) => {
    try {
      // Emit the codeChange event to the server
      console.log("Actions",data)
      const response = await new Promise((resolve, reject) => {
        clientSocket.emit("languageChange", { roomId: data.roomId, data: data.message.data }, (ack) => {
          if (ack && ack.success) {
            resolve(ack); // Resolves if server acknowledges
          } else {
            reject(ack?.message || "Error updating code");
          }
        });
      });

      // console.log('Code change broadcasted successfully:', response);
      dispatch({
        type:SEt_LANGUAGE,
        payload:data.message.data
      })

    } catch (error) {
      // Dispatch failure toast in case of an error
      dispatch({
        type: SET_TOAST,
        payload: { type: "failure", message: error },
      });

      console.error("Error updating code:", error);
    }
  };
};



