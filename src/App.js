import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const path = electron.remote.require('path');
const ipcRenderer = electron.ipcRenderer;
const remote = electron.remote;



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexDir: null
    }
    this.openNewWindow = this.openNewWindow.bind(this);
  }
  openNewWindow() {
    let win = new remote.BrowserWindow({ width: 400, height: 320 });
    win.on('close', function () { win = null });
    win.loadURL(this.state.indexDir);
    win.show();
  }
  componentDidUpdate() {

  }
  componentWillMount() {
    ipcRenderer.send('getDirname-request', 'index.html')
    ipcRenderer.on('getDirname-reply', (event, arg) => {
      this.setState({ indexDir: arg });
    })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.<br />
          Or make a new Window with Electron <b onClick={this.openNewWindow}>here</b>.
        </p>
      </div >
    );
  }
}

export default App;
