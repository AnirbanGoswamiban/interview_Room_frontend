import React, { useState,useEffect } from "react";
import './output.css';
import HomePage from './components/Homepage';
import clientSocket from './Socket/socket';
import FullScreenLoader from './components/FullScreenLoader';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatComponent from './components/Chat';
import * as Actions from './redux/actions/globalActions';
import * as Room from './redux/actions/roomActions';
import OnlineEditor from './components/CodeEditor';
import VideoRoom from './components/VideoRoom';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CodeIcon from '@mui/icons-material/Code';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { usePeer } from './Socket/peer';
import Participants from './components/Participants';
import StreamPlayer from "./components/StreamPlayer";
import ReactPlayer from 'react-player'
import MicIcon from '@mui/icons-material/Mic';
import CallEndIcon from '@mui/icons-material/CallEnd';
import GroupsIcon from '@mui/icons-material/Groups';
import userJoined from './assets/sounds/userJoined.wav';
import joinCall from './assets/sounds/userJoined.wav';

const App2 = () => {

  const { toastData, loader,curCompoenet,user } = useSelector((state) => state.global);
  const { roomUuid } = useSelector((state) => state.room);
  const dispatch = useDispatch();
  const {peers,createOffer,createAnswer,setRemoteAns,remoteStreams,handleIncomingOffer,handleIncomingAnswer,createAndEmitOffersForAllPeers} = usePeer()

  const actions = [
    { icon: <ChatBubbleIcon />, name: 'chat' },
    { icon: <CodeIcon />, name: 'code' },
    { icon: <GroupsIcon />, name: 'participants' },
  ];



      // Handle Toast Notifications
      useEffect(() => {
        if (toastData.type === null) return;

        if (toastData.type === 'success') toast.success(toastData.message);
        else if (toastData.type === 'info') toast.info(toastData.message);
        else toast.error(toastData.message);
    }, [toastData]);

    useEffect(() => {
        const handleUserJoined = async(data) => {
          const audio = new Audio(userJoined); 
          audio.play().catch((err) => {
              console.error('Audio playback failed:', err);
          });
            dispatch({
                type: Actions.SET_TOAST,
                payload: {
                    type: 'info',
                    message: `${data.name} Joined the room`,
                },
            });

            console.log("sending offer")
            const offer = await createOffer(data['socketId'])
            clientSocket.emit("offer",{offer,roomId:roomUuid,targetSocketId:data['socketId'],name:user})
        };

        const handleReceiveMessage = ({ message }) => {
            dispatch({
                type: Room.SET_MESSAGE,
                payload: { text: message.data, isUser: false, sender: message.user },
            });
        };

        const handleCodeUpdate = (data) => {
            dispatch({ type: Room.SET_CODE, payload: data });
        };

        const handleLanguageUpdate = (data) => {
            dispatch({ type: Room.SEt_LANGUAGE, payload: data });
        };

        const handleOffer = async(data)=>{
            console.log("got offer")
            const answer = await createAnswer(data['from'],data["offer"])
            clientSocket.emit('answer', { answer, to: data['from'] });
        }

        const handleReciveAnswer = async (data)=>{
            console.log(peers)
            console.log("recive",data)
            await setRemoteAns(data['from'],data["answer"])

        }

        const handleStreamOffer = async (data)=>{
          await handleIncomingOffer(data)
        }
        const handleAnswer = async (data)=>{
          await handleIncomingAnswer(data)
        }

        

        clientSocket.on('userJoined', handleUserJoined);
        clientSocket.on('receiveMessage', handleReceiveMessage);
        clientSocket.on('codeUpdate', handleCodeUpdate);
        clientSocket.on('languageUpdate', handleLanguageUpdate);
        clientSocket.on('receiveAnswer', handleReciveAnswer);
        clientSocket.on('offer', handleOffer);
        clientSocket.on('streamOffer',handleStreamOffer)
        clientSocket.on('streamAnswer',handleAnswer)


        return () => {
            clientSocket.off('userJoined', handleUserJoined);
            clientSocket.off('receiveMessage', handleReceiveMessage);
            clientSocket.off('codeUpdate', handleCodeUpdate);
            clientSocket.off('languageUpdate', handleLanguageUpdate);
            clientSocket.off('receiveAnswer', handleReciveAnswer);
            clientSocket.off('offer',handleOffer)
            clientSocket.off('streamOffer',handleStreamOffer)
            clientSocket.off('streamAnswer',handleAnswer)
        };
    }, [dispatch,roomUuid,user]);


  const handleClick = (actionName) => {
    dispatch({
        type: Actions.SET_CUR_COMPONENT,
        payload: actionName
      });
  };
  const handleJoinVoice = async () => {
    try {
        // Get user media (audio only)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true});
        // setLocalStream(stream);
        // sendStream(stream)
         await createAndEmitOffersForAllPeers(stream)
         const audio = new Audio(joinCall); 
         audio.play().catch((err) => {
             console.error('Audio playback failed:', err);
         });
    } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Unable to access microphone. Please check permissions.");
    }
};

      // Function to render the component based on currentComponent
      const renderComponent = () => {
        switch (curCompoenet) {
            case 'home':
                return <HomePage />;
            case 'chat':
                return <ChatComponent />;
            case 'code':
                return <OnlineEditor />;
            case 'participants':
                return <Participants/>
            default:
                return <HomePage />;
        }
    };

    

  return (
    <div className="bg-[#111827] h-screen">
      {/* Navbar */}
      <nav className="bg-[#35373c] text-white py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          {/* <a href="#" className="text-lg font-bold">Room Id</a> */}
          {`Room Id : ${roomUuid}`}
          <ul className="flex space-x-4">
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto  flex h-[calc(100vh-4rem)]">
        {/* Left Scrollable Div */}

        {curCompoenet &&<div
          className="w-1/6 p-4 overflow-y-auto shadow-md custom-scroll-left"
          style={{
            background: '#2b2d31',
          }}
        >
          {/* Interactive Texts */}
          <div className="space-y-4" style={{
            height:'80%'
          }}>
            {
                actions.map((action,index)=>{
                    return(
                        <div
                        key={index}
                        onClick={() => handleClick(`${action.name}`)}
                        className={`w-full py-2 px-4 text-left font-bold cursor-pointer rounded-lg ${
                          curCompoenet === `${action.name}`
                            ? "bg-[#404249] text-white"
                            : "text-gray-300 hover:bg-[#35373c] hover:text-white"
                        }`}
                      >
                          <div className="flex items-center">
                            {action.icon}
                            <span className="ml-4">{action.name}</span>
                          </div>
                      </div>
                    )
                })
            }
          </div>
          <div className="mt-6 space-y-2 flex" style={{
            height:'15%',
            justifyContent:'flex-end',
            alignItems:'flex-end'
          }}>
      <button
        className="w-full py-2 px-4 text-left font-bold text-gray-300 hover:bg-[#35373c] hover:text-white rounded-lg"
        style={{
          color:'#80ff80'
        }}
        onClick={handleJoinVoice}
      >
        Join
      </button>
      <button
        className="w-full py-2 px-4 text-left font-bold text-gray-300 hover:bg-[#35373c] hover:text-white rounded-lg"
        // onClick={}
      >
        <MicIcon/>
      </button>
      <button
        className="w-full py-2 px-4 flex items-center justify-center font-bold text-gray-300 hover:bg-[#35373c] hover:text-white rounded-lg"
        // onClick={}
      >
        <CallEndIcon sx={{
          color:'red'
        }}/>
        {/* <span className="material-icons">star</span> Replace with desired icon */}
      </button>
          </div>
        </div>}

        {/* Right Div */}
        <div
          className="flex-grow  shadow-md "
          style={{
            background: '#313338'
          }}
        >
            {renderComponent()}
        </div>
      </div>
      <ToastContainer />
      <ReactPlayer
      style={{
        display:'none'
      }}
          url={remoteStreams} // Convert MediaStream to URL
          playing={true}
          controls={true}
          width="500px"  // Set your preferred width
          height="500px" // Set your preferred height
      />
    </div>
  );
};

export default App2;
