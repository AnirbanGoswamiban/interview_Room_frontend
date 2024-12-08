import React, { useMemo, useState, useContext, useEffect } from 'react';
import clientSocket from './socket';

// Context for Peer Management
const PeerContext = React.createContext(null);

export const usePeer = () => useContext(PeerContext);

export const PeerProvider = (props) => {
    const [peers, setPeers] = useState({}); // Manage a map of peer connections
    const [remoteStreams, setRemoteStreams] = useState("");

    // Create a new peer connection for a given peerId
    const createPeer = (peerId) => {
        const peer = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        let peerObj = peers;
        peerObj[peerId] = peer;
        setPeers(peerObj);
        return peer;
    };

    // Get or create a peer connection
    const getOrCreatePeer = (peerId) => {
        return peers[peerId] || createPeer(peerId);
    };

    // Create an offer for a specific peer
    const createOffer = async (peerId) => {
        const peer = getOrCreatePeer(peerId);
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    };

    // Create an answer for a specific peer

const createAnswer = async (peerId, offer) => {
const peer = getOrCreatePeer(peerId);
await peer.setRemoteDescription(offer);
const answer = await peer.createAnswer();
await peer.setLocalDescription(answer);
return answer;
};

    // Set the remote answer for a specific peer
    const setRemoteAns = async (peerId, answer) => {
        const peer = getOrCreatePeer(peerId);
        await peer.setRemoteDescription(answer);
    };

    // create offer with stream
    const createStreamOffer = async (peerId, stream) => {
        // Get or create the peer connection
        const peer = getOrCreatePeer(peerId);
    
        // Add tracks from the stream to the peer connection
        stream.getTracks().forEach((track) => {
            peer.addTrack(track, stream);
        });
    
        // Create and set the local description
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
    
        console.log(`Offer created and local description set for peer: ${peerId}`);
        
        return offer; // Return the offer to send to the signaling server
    };
    
    const createAndEmitOffersForAllPeers = async (stream) => {
        // Iterate through all peer connections
        for (const peerId in peers) {
            if (peers.hasOwnProperty(peerId)) {
                try {
                    // Create an offer with the local stream for each peer
                    const offer = await createStreamOffer(peerId, stream);
    
                    // Emit the offer to the signaling server
                    clientSocket.emit('streamOffer', { offer, to: peerId });
    
                    console.log(`Offer emitted for peer: ${peerId}`);
                } catch (error) {
                    console.error(`Failed to create and emit offer for peer: ${peerId}`, error);
                }
            }
        }
    };

    const handleIncomingOffer = async ({ offer, from }) => {
        try {
            // Get or create a peer connection
            const peer = getOrCreatePeer(from);
    
            // Set up the 'ontrack' event listener to receive media streams
            peer.ontrack = (event) => {
                console.log(event)
                const remoteStream = event.streams[0];
                console.log('Track received:', event.track);
                // setRemoteStreams((prevStreams) => ({
                //     ...prevStreams,
                //     [from]: remoteStream, // Store the stream against the peer ID
                // }));
                console.log(remoteStream)
                setRemoteStreams(remoteStream)
            };
    
            // Set the remote description with the received offer
            await peer.setRemoteDescription(new RTCSessionDescription(offer));
            console.log(`Remote description set for peer: ${from}`);
    
            // Create an answer
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            console.log(`Answer created and local description set for peer: ${from}`);
    
            // Emit the answer back to the sender
            clientSocket.emit('streamAnswer', { answer, to: from });
            console.log(`Answer emitted to peer: ${from}`);
        } catch (error) {
            console.error(`Error handling incoming offer from peer: ${from}`, error);
        }
    };
    const handleIncomingAnswer = async ({ answer, from }) => {
        try {
            const peer = getOrCreatePeer(from);
            peer.ontrack = (event) => {
                console.log(event)
                const remoteStream = event.streams[0];
                console.log('Track received:', event.track);
                // setRemoteStreams((prevStreams) => ({
                //     ...prevStreams,
                //     [from]: remoteStream, // Store the stream against the peer ID
                // }));
                console.log(remoteStream)
                setRemoteStreams(remoteStream)
            };

            // Set the remote description with the received answer
            await peer.setRemoteDescription(answer);
            console.log(`Remote description (answer) set for peer: ${from}`);

            // Now the connection is established, you can start sending and receiving media
            // If necessary, you can trigger further actions here (like UI updates, etc.)

        } catch (error) {
            console.error(`Error handling incoming answer from peer: ${from}`, error);
        }
    };




    return (
        <PeerContext.Provider
            value={{
                createOffer,
                createAnswer,
                setRemoteAns,
                createAndEmitOffersForAllPeers,
                handleIncomingOffer,
                remoteStreams,
                handleIncomingAnswer,
                peers,
            }}
        >
            {props.children}
        </PeerContext.Provider>
    );
};
