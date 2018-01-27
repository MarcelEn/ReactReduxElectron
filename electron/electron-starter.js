import { applyMiddleware, createStore, combineReducers } from "redux";
//Electron------------
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain

//Redux---------------



//TODO: fix bug in redux window array if one window has been closed.






// const global = (store = 0, action) => {
//     if (!action.windowId) {
//         switch (action.type) {
//             default:
//                 return store;
//         }
//     }
//     return store;
// }

// const windows = (store = [], action) => {
//     if (action.windowId) {
//         let window = store.findIndex((window) => {
//             return window.windowId === action.windowId
//         });
//         if (window !== -1) {
//             switch (action.windowType) {
//                 case 'main':
//                     switch (action.type) {
//                         default:
//                             return store
//                     }
//                 default:
//                     return store;
//             }
//         }
//     }

//     return store;
// }

// const windowMiddleware = state => next => action => {
//     if (action.type === 'ADD_WINDOW') {
//         let windowId = 0;
//         while (state.getState().windows.findIndex(window => window.windowId === windowId) !== -1){
//             windowId = Math.floor(Math.random()*100000);
//         }
//         next();// hier weiter machen die generierte windowid musss verarbeitete werden
//     }
// }



// const rootReducer = combineReducers({
//     global,
//     windows
// });





//--------------------


const getStartUrl = (file) => {
    if (!file) {
        file = '';
    }
    return process.env.ELECTRON_START_URL ? process.env.ELECTRON_START_URL + '/' + file : url.format({
        pathname: path.join(__dirname, '/../' + file),
        protocol: 'file:',
        slashes: true
    })
}


function createWindow() {
    // Create the browser window.

    let newWindow = new BrowserWindow({ width: 800, height: 600 })

    // and load the index.html of the app.

    newWindow.loadURL(getStartUrl('index.html'));

    // Open the DevTools.
    if (process.env.ELECTRON_START_URL) {
        newWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    newWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        newWindow = null
    })
    return newWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.


app.on('ready', () => {
    const sendGlobalStore = (index) => {
        let currentStore = store.getState();
        if (index !== '*') {
            currentStore.windows[index].webContents.send('global-response', {
                type: 'SET_GLOBAL',
                payload: currentStore.global,
                windowId: index
            });
            return;
        }
        currentStore.windows.forEach((window, i) => {
            console.log(typeof window)
            window.webContents.
            window.webContents.send('global-response', {
                type: 'SET_GLOBAL',
                payload: currentStore.global,
                windowId: i
            });
        })
    }

    const global = (store = {
        number: 0
    }, action) => {
        switch (action.type) {
            case 'INC':
                return { ...store, number: store.number + action.payload };
            case 'DEC':
                return { ...store, number: store.number - action.payload };
            default:
                return store;
        }
    }

    const windows = (store = [], action) => {
        switch (action.type) {
            case 'ADD_WINDOW':
                return [...store, createWindow()];
            default:
                return store;
        }
    }

    const store = createStore(combineReducers({
        global,
        windows
    }));

    store.subscribe(() => {
        console.log(store.getState())
    })

    ipc.on('stateInit-request', function (event, action) {
        event.sender.send('stateInit-reply', { global: store.getState().global, windowId: store.getState().windows.length - 1 })
    })

    ipc.on('global-request', function (event, action) {
        store.dispatch(action);
        sendGlobalStore('*');
        // event.sender.send('stateInit-reply', { global: store.getState().state, windowId: store.getState().windows.length - 1 })
    })

    store.dispatch({ type: 'ADD_WINDOW' });
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// app.on('activate', function () {
//     // On OS X it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (store.getState().windows.length === 0) {
//         store.dispatch({ type: 'ADD_WINDOW' });
//     }
// })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//Listener