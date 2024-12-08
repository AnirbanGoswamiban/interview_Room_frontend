import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../redux/actions/index'

const HomePage = () => {

    const dispatch = useDispatch();
    const {roomUuid} = useSelector((state) => state.room);

    const [CR_name, CR_setName] = useState(''); // while room cretation
    const [J_name, J_setName] = useState(''); // while join room
    const [roomId, setRoomId] = useState('');


    function generateUUID() {
      console.log("uudi gen")
          const timestamp = Date.now().toString(16); // Convert current time to hexadecimal
          const randomPart = Math.random().toString(16).substring(2, 10); // Generate random hex string
          return `${timestamp}-${randomPart}`
    }

    const handleCreateRoom = () => {
        if(CR_name.trim().length === 0){
            dispatch(Actions.globalActions.setToast("error","please enter your name"))
            return
        }
        let uuid
        if(roomUuid.trim()){
            uuid = roomUuid
        }else{
            uuid = generateUUID()
            dispatch(Actions.RoomActions.setRoomId(uuid))
        }
        dispatch(Actions.RoomActions.createRoom({roomId:uuid,name:CR_name}))
    };

    const handleJoinRoom = () => {
        if(J_name.trim().length === 0){
            dispatch(Actions.globalActions.setToast("error","please enter your name"))
            return
        }
        if(roomId.trim().length === 0){
            dispatch(Actions.globalActions.setToast("error","please enter room Id"))
            return
        }
        dispatch(Actions.RoomActions.setRoomId(roomId))
        dispatch(Actions.RoomActions.createRoom({roomId:roomId,name:J_name,type:"join"}))
    };

    return (
        // <div className="flex min-h-screen bg-gray-900 text-gray-100 p-6 items-center justify-center">

        //     {/* Main content wrapper */}

        //     <div className="flex w-full max-w-4xl justify-center space-x-6">
        //         {/* Left Section (Create Room) */}
        //         <div className="flex flex-col items-center justify-center space-y-4 bg-gray-800 p-6 rounded-md w-full max-w-sm">
        //             <div className="text-xl font-semibold text-white mb-4">Create Room</div>

        //             {/* Name Input */}
        //             <input
        //                 type="text"
        //                 value={CR_name}
        //                 onChange={(e) => CR_setName(e.target.value)}
        //                 placeholder="Enter your Name"
        //                 className="w-full p-3 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        //             />

        //             {/* Create Room Button */}
        //             <button
        //                 onClick={handleCreateRoom}
        //                 className="w-full p-3 bg-green-500 text-gray-100 rounded-md hover:bg-green-600 focus:outline-none mt-4"
        //             >
        //                 Create Room
        //             </button>
        //         </div>

        //         {/* Divider */}
        //         <div className="h-full w-px bg-gray-500 mx-6"></div>

        //         {/* Right Section (Join Room) */}
        //         <div className="flex flex-col items-center justify-center space-y-4 bg-gray-800 p-6 rounded-md w-full max-w-sm">
        //             <div className="text-xl font-semibold text-white mb-4">Join Room</div>

        //             {/* Room ID Input */}
        //             <input
        //                 type="text"
        //                 value={roomId}
        //                 onChange={(e) => setRoomId(e.target.value)}
        //                 placeholder="Enter Room ID"
        //                 className="w-full p-3 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        //             />

        //             {/* Name Input */}
        //             <input
        //                 type="text"
        //                 value={J_name}
        //                 onChange={(e) => J_setName(e.target.value)}
        //                 placeholder="Enter your Name"
        //                 className="w-full p-3 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        //             />

        //             {/* Join Room Button */}
        //             <button
        //                 onClick={handleJoinRoom}
        //                 className="w-full p-3 bg-blue-500 text-gray-100 rounded-md hover:bg-blue-600 focus:outline-none mt-4"
        //             >
        //                 Join Room
        //             </button>
        //         </div>
        //     </div>
        // </div>

<div className="flex h-full bg-[#313338] text-gray-100 p-6 items-center justify-center">
      {/* Right Section */}
      <div className="flex w-full max-w-xl justify-center space-x-6">
        {/* Left Section (Create Room) */}
        <div className="flex flex-col items-center justify-center space-y-4 bg-gray-800 p-6 rounded-md w-full max-w-sm">
          <div className="text-xl font-semibold text-white mb-4">Create Room</div>

          {/* Name Input */}
          <input
            type="text"
            value={CR_name}
            onChange={(e) => CR_setName(e.target.value)}
            placeholder="Enter your Name"
            className="w-full p-3 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Create Room Button */}
          <button
            onClick={handleCreateRoom}
            className="w-full p-3 bg-green-500 text-gray-100 rounded-md hover:bg-green-600 focus:outline-none mt-4"
          >
            Create Room
          </button>
        </div>

        {/* Divider */}
        <div className="h-full w-px bg-gray-500 mx-6"></div>

        {/* Right Section (Join Room) */}
        <div className="flex flex-col items-center justify-center space-y-4 bg-gray-800 p-6 rounded-md w-full max-w-sm">
          <div className="text-xl font-semibold text-white mb-4">Join Room</div>

          {/* Room ID Input */}
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
            className="w-full p-3 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Name Input */}
          <input
            type="text"
            value={J_name}
            onChange={(e) => J_setName(e.target.value)}
            placeholder="Enter your Name"
            className="w-full p-3 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Join Room Button */}
          <button
            onClick={handleJoinRoom}
            className="w-full p-3 bg-blue-500 text-gray-100 rounded-md hover:bg-blue-600 focus:outline-none mt-4"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
    );
};

export default HomePage;
