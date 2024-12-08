import React, { useState,useEffect } from "react";
import * as Actions from '../redux/actions/index'
import { useDispatch, useSelector } from 'react-redux';

const ChatComponent = () => {
  const dispatch = useDispatch();
  const {roomMessages} = useSelector((state) => state.room);
  const {user} = useSelector((state) => state.global);
  const {roomUuid} = useSelector((state) => state.room);
  // const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  
  

  // Handle sending a message
  const sendMessage = () => {
    if (input.trim()) {
      setInput("");
      dispatch(Actions.RoomActions.sendMessage({roomId:roomUuid,message:{data:input,user:user}}))
    }
  };

  return (
    // <div className="h-screen w-full bg-gray-800 text-gray-200 flex flex-col">
    //   {/* Chat Header */}
    //   {/* <div className="bg-gray-900 text-gray-100 p-4">
    //     <h1 className="text-lg font-bold">Chat Room</h1>
    //   </div> */}

    //   {/* Chat Messages */}
    //   <div className="flex-1 p-4 overflow-y-auto">
    //     {roomMessages.map((message, index) => (
    //       <div
    //         key={index}
    //         className={`mb-4 ${message.isUser ? "text-right" : "text-left"}`}
    //       >
    //         {/* Sender Context */}
    //         <p className="text-sm text-gray-400 mb-1">{message.sender}</p>
    //         {/* Chat Bubble */}
    //         <div
    //           className={`inline-block px-4 py-2 rounded-lg max-w-max ${
    //             message.isUser
    //               ? "bg-blue-600 text-white"
    //               : "bg-gray-700 text-gray-200"
    //           }`}
    //         >
    //           {message.text}
    //         </div>
    //       </div>
    //     ))}
    //   </div>

    //   {/* Chat Input */}
    //   <div className="flex items-center p-4 border-t border-gray-700">
    //     <input
    //       type="text"
    //       value={input}
    //       onChange={(e) => setInput(e.target.value)}
    //       onKeyDown={(e) => {
    //         if (e.key === "Enter") sendMessage();
    //       }}
    //       style={{
    //         width:'90%'
    //       }}
    //       className=" bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
    //       placeholder="Type a message..."
    //     />
    //     <button
    //       onClick={sendMessage}
    //       className="ml-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
    //     >
    //       Send
    //     </button>
    //   </div>
    // </div>
    <div className="flex flex-col h-full">
    {/* Chat Messages */}
    <div className="flex-1 p-4 overflow-y-auto">
      {roomMessages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}
        >
          {/* Sender Context */}
          <p className="text-sm text-gray-400 mb-1">{message.sender}</p>
          {/* Chat Bubble */}
          <div
            className={`inline-block px-4 py-2 rounded-lg max-w-max ${
              message.isUser
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-200'
            }`}
          >
            {message.text}
          </div>
        </div>
      ))}
    </div>

    {/* Chat Input */}
    <div className="flex items-center p-4 border-t border-gray-700">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') sendMessage();
        }}
        style={{ width: '90%' }}
        className="bg-[#404249] text-gray-200 border border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        placeholder="Type a message..."
      />
      <button
        onClick={sendMessage}
        className="ml-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Send
      </button>
    </div>
  </div>
  );
};

export default ChatComponent;
