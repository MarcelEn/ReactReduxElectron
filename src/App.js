import React, { Component } from 'react';
import reactsvg from './react.svg';
import electronpng from './electron.png';
import './App.css';
import { connect } from 'react-redux';
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const path = electron.remote.require('path');
const ipcRenderer = electron.ipcRenderer;
const remote = electron.remote;

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={reactsvg} className="logo" alt="reactsvg" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <header className="App-header">
          <img src={electronpng} className="logo" alt="electronsvg" />
          <h1 className="App-title">Welcome to Electron</h1>
        </header>
        <p className="App-intro">
          Make a new Window <b onClick={this.props.openNewWindow}>here</b>.
          <button onClick={this.makeSomething}>Make something</button>
        </p>
        <header className="App-header">
          <img src={electronpng} className="logo" alt="electronsvg" />
          <h1 className="App-title">Welcome to Electron</h1>
        </header>
        <p className="App-intro">
          See Redux working in this window <b onClick={this.props.doDEC}>-</b>{this.props.local.number}<b onClick={this.props.doINC}>+</b>.<br />
          See Redux working across multiple Windows <b onClick={this.props.doDECGlobal}>-</b>{this.props.global.number}<b onClick={this.props.doINCGlobal}>+</b>.
        </p>
      </div >
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state
  }
}

const mapDispatchToProps = dispatch => {
  return {
    openNewWindow: () => {
      dispatch({ type: 'ADD_WINDOW', global: true });
    },
    doINC: () => {
      dispatch({ type: 'INC', payload: 1 })
    },
    doDEC: () => {
      dispatch({ type: 'DEC', payload: 1 })
    },
    doINCGlobal: () => {
      dispatch({ type: 'INC', payload: 1, global: true })
    },
    doDECGlobal: () => {
      dispatch({ type: 'DEC', payload: 1, global: true })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
