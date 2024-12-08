import React, { useState, useEffect, useRef } from 'react';
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
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CodeIcon from '@mui/icons-material/Code';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { usePeer } from './Socket/peer';
import Participants from './components/Participants';

const actions = [
  { icon: <ChatBubbleIcon />, name: 'chat' },
  { icon: <CodeIcon />, name: 'code' },
  { icon: <VideoCallIcon />, name: 'video' },
];

const App = () => {
    const { toastData, loader,curCompoenet,user } = useSelector((state) => state.global);
    const { roomUuid } = useSelector((state) => state.room);
    const dispatch = useDispatch();
    const {peers,createOffer,createAnswer,setRemoteAns} = usePeer()




    // Handle Toast Notifications
    useEffect(() => {
        if (toastData.type === null) return;

        if (toastData.type === 'success') toast.success(toastData.message);
        else if (toastData.type === 'info') toast.info(toastData.message);
        else toast.error(toastData.message);
    }, [toastData]);

    useEffect(() => {
        const handleUserJoined = async(data) => {
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

        

        clientSocket.on('userJoined', handleUserJoined);
        clientSocket.on('receiveMessage', handleReceiveMessage);
        clientSocket.on('codeUpdate', handleCodeUpdate);
        clientSocket.on('languageUpdate', handleLanguageUpdate);
        clientSocket.on('receiveAnswer', handleReciveAnswer);
        clientSocket.on('offer', handleOffer);

        return () => {
            clientSocket.off('userJoined', handleUserJoined);
            clientSocket.off('receiveMessage', handleReceiveMessage);
            clientSocket.off('codeUpdate', handleCodeUpdate);
            clientSocket.off('languageUpdate', handleLanguageUpdate);
            clientSocket.off('receiveAnswer', handleReciveAnswer);
            clientSocket.off('offer',handleOffer)
        };
    }, [dispatch,roomUuid,user]);


    // Function to render the component based on currentComponent
    const renderComponent = () => {
        switch (curCompoenet) {
            case 'home':
                return <HomePage />;
            case 'chat':
                return <ChatComponent />;
            case 'code':
                return <OnlineEditor />;
            case 'video':
                return <Participants
                // createOffer={(()=>{
                //     createOffer(roomUuid,localStream,user,clientSocket)
                // })}
                // localStream={localStream}
            />
            default:
                return <HomePage />;
        }
    };


    return (
      
        <div className="App min-h-screen w-full bg-gray-900 text-gray-100 flex flex-col">
            {/* Render the Selected Component */}
            {curCompoenet &&  <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={(()=>{
              dispatch({
                type: Actions.SET_CUR_COMPONENT,
                payload: action.name
            })
            })}
          />
        ))}
            </SpeedDial>}
                {renderComponent()}
            {/* FullScreenLoader and ToastContainer */}
            <FullScreenLoader isLoading={loader} />
            <ToastContainer />
        </div>
    );
};

export default App;
