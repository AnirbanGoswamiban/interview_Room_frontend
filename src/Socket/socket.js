import { io } from 'socket.io-client';
// const clientSocket = io('http://localhost:3050'); // Connect to the backend
const clientSocket = io(`${process.env.REACT_APP_SOCKET_URL}`); // Connect to the backend
export default  clientSocket