import React, { useState } from 'react';

const RoomControls = ({ setRoomId, socket }) => {
    const [inputRoomId, setInputRoomId] = useState('');

    const joinRoom = () => {
        if (inputRoomId.trim()) {
            setRoomId(inputRoomId.trim());
        }
    };

    return (
        <div className="room-controls flex flex-col items-center space-y-4">
            <input
                type="text"
                placeholder="Enter Room ID"
                value={inputRoomId}
                onChange={(e) => setInputRoomId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#313338] text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={joinRoom}
                className="px-6 py-2 rounded-lg bg-blue-600 text-gray-100 font-semibold hover:bg-blue-700 transition duration-300"
            >
                Join Room
            </button>
        </div>
    );
};

export default RoomControls;
