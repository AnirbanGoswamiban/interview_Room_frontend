import { useState } from 'react';
import React from 'react';
import { usePeer } from '../Socket/peer';
import ReactPlayer from 'react-player'

const Participants = () => {
    const { peers,createAndEmitOffersForAllPeers } = usePeer(); // Get the list of peers from the context
    const [localStream, setLocalStream] = useState(null);

    const handleJoinVoice = async () => {
        try {
            // Get user media (audio only)
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true});
            setLocalStream(stream);
            // sendStream(stream)
             await createAndEmitOffersForAllPeers(stream)
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Unable to access microphone. Please check permissions.");
        }
    };

    return (
        <div className="p-4 bg-[#313338] text-gray-100 h-full">
            <h2 className="text-lg font-semibold mb-4">
                Connected Peers: {Object.keys(peers).length}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Object.keys(peers).map((peerId) => (
                    <div
                        key={peerId}
                        className="bg-green-500 text-white p-4 rounded-lg shadow-md flex items-center justify-center text-sm font-medium break-all"
                    >
                        {peerId}
                    </div>
                ))}
            </div>
            <div className="mt-6">
                {/* <button
                    onClick={handleJoinVoice}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Join Voice
                </button> */}
            </div>
            {/* {localStream && (
                <ReactPlayer
                    url={localStream} // Convert MediaStream to URL
                    playing={true}
                    controls={true}
                    width="500px"  // Set your preferred width
                    height="500px" // Set your preferred height
                />
            )} */}
        </div>
    );
};

export default Participants;
