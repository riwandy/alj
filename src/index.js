import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import store from './store';
import setAuthorizationToken from './utils/setAuthorizationToken';
import jwt from 'jsonwebtoken';

if(localStorage.Authorization){
    setAuthorizationToken(localStorage.Authorization)
    let token = localStorage.Authorization.split(' ')
    store.dispatch({type : 'UPDATE_CURRENT_USER', payload:jwt.decode(token[1])})
    store.dispatch({type : 'SET_AUTHENTICATED'})
}

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
