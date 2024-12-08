import React, { useEffect, useRef } from 'react';

const StreamPlayer = ({ remoteStream }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (remoteStream && audioRef.current) {
            audioRef.current.srcObject = remoteStream; // Assign the MediaStream
            audioRef.current.play().catch((err) => {
                console.error("Playback error:", err);
            });
        }
    }, [remoteStream]);

    return (
        <audio ref={audioRef} controls autoPlay />
    );
};

export default StreamPlayer;
