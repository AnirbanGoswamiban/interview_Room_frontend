import React, { useEffect, useRef, useState } from 'react';
import clientSocket from '../Socket/socket';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../redux/actions/index';



const VideoRoom = ({ createOffer, localStream }) => {
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const localVideoRef = useRef(null);

    useEffect(() => {
        if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOn(videoTrack.enabled);
            }
        }
    };

    const toggleAudio = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioOn(audioTrack.enabled);
            }
        }
    };

    return (
        <div className="video-room bg-gray-900 text-gray-100 w-screen h-screen flex">
            <div className="flex-[8] flex flex-col p-6 overflow-hidden">
                <h3 className="text-2xl font-bold mb-2 text-center">Video Room</h3>
                <div className="flex flex-col justify-center items-center mb-4 h-full">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        className="w-full max-w-[80%] h-[75%] rounded-lg border-4 border-blue-500"
                    ></video>
                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={toggleVideo}
                            className={`px-4 py-2 rounded-lg font-semibold text-white ${
                                isVideoOn ? 'bg-red-500' : 'bg-green-500'
                            }`}
                        >
                            {isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
                        </button>
                        <button
                            onClick={toggleAudio}
                            className={`px-4 py-2 rounded-lg font-semibold text-white ${
                                isAudioOn ? 'bg-red-500' : 'bg-green-500'
                            }`}
                        >
                            {isAudioOn ? 'Mute Audio' : 'Unmute Audio'}
                        </button>
                        <button
                            onClick={() => createOffer('room-id')} // Replace 'room-id' with your dynamic roomId
                            className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-500"
                        >
                            Send Offer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoRoom



