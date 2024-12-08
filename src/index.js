import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import App2 from './App2'
import { Provider } from 'react-redux'
import store from './redux/store/index'
import {PeerProvider} from './Socket/peer'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PeerProvider>
    <App2/>
    {/* <App/> */}
    </PeerProvider>
    </Provider>
  </React.StrictMode>
);
