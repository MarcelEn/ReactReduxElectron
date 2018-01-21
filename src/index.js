import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { applyMiddleware, createStore, combineReducers } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { Provider } from "react-redux";


const exampleReducer = (state = { number: 0 }, action) => {
    switch (action.type) {
        case 'INC':
            return { ...state, number: state.number + action.payload };
        case 'DEC':
            return { ...state, number: state.number - action.payload };
    }
    return state;
};

const reducers = combineReducers({
    example: exampleReducer
});
const middleware = applyMiddleware(thunk, logger);
const store = createStore(reducers, middleware);

store.subscribe(() => {
    console.log('store changed', store.getState());
});

store.dispatch({ type: 'INC', payload: 100 });

store.dispatch(dispatch => {
    dispatch({ type: 'DEC', payload: 25 });
    setTimeout(() => {
        dispatch({ type: 'INC', payload: 5 });
    }, 2000);
});



ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
