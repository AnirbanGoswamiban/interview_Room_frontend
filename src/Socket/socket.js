import { io } from 'socket.io-client';
// const clientSocket = io('http://localhost:3050'); // Connect to the backend
// const clientSocket = io(`${process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000'}`); // Connect to the backend
const clientSocket = io('https://interview-room-backend.onrender.com')
export default  clientSocket