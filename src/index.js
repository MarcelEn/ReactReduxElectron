import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { applyMiddleware, createStore, combineReducers } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { Provider } from "react-redux";

const electron = window.require('electron');
const fs = electron.remote.require('fs');
const path = electron.remote.require('path');
const ipcRenderer = electron.ipcRenderer;
const remote = electron.remote;


ipcRenderer.send('stateInit-request', {
    windowType: 'main'
})

let firstInit = true;

ipcRenderer.on('test', (event, action) => {
    console.log("yes")
});

ipcRenderer.on('stateInit-reply', (event, response) => {
    if (!firstInit) {
        return;
    }
    const windowId = response.windowId
    firstInit = false;
    const local = (state = { number: 0 }, action) => {
        switch (action.type) {
            case 'INC':
                return { ...state, number: state.number + action.payload };
            case 'DEC':
                return { ...state, number: state.number - action.payload };
            default:
                return state;
        }
    };
    const global = (state = response.global, action) => {
        switch (action.type) {
            case 'SET_GLOBAL':
                return action.payload
        }
        return state;
    };

    const rootReducer = combineReducers({
        global,
        local
    })

    const middleware = applyMiddleware(
        store => next => action => {
            if (action.global) {
                ipcRenderer.send('global-request', {
                    ...action
                })
            } else {
                next(action);
            }
        }
    );
    const store = createStore(rootReducer, middleware);

    ipcRenderer.on('global-response', (event, action) => {
        store.dispatch(action);
    });
    ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
    registerServiceWorker();
})


// store.subscribe(() => {
//     console.log('store changed', store.getState());
// });

// store.dispatch({ type: 'INC', payload: 100 });

// store.dispatch(dispatch => {
//     dispatch({ type: 'DEC', payload: 25 });
//     setTimeout(() => {
//         dispatch({ type: 'INC', payload: 5 });
//     }, 2000);
// });




