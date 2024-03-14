const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref } = require('firebase/database');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const { Menu } = require('electron')

const template = [
   
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      
    },
  })

  ipcMain.on('sidebar-to-race-page', (event) => {
    console.log("Received 'sidebar-to-race-page' IPC message"); // Log the receipt of the IPC message
    const mainWindow = BrowserWindow.getFocusedWindow();

    if (mainWindow) {
        mainWindow.loadFile(path.join(__dirname, 'renderer', 'components', 'Race', 'Race.html'));
        console.log("Navigating to Race.html"); // Log the navigation attempt
    } else {
        console.log("Main window not found"); // Log if the main window instance is not found
    }
  });


  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

const firebaseConfig = {
  apiKey: "AIzaSyCgpNqA8O17ptu5_5OHSQM54C_rQdmOjC8",
  authDomain: "origin-artist.firebaseapp.com",
  projectId: "origin-artist",
  storageBucket: "origin-artist.appspot.com",
  messagingSenderId: "139641712145",
  appId: "1:139641712145:web:caecf51d38fd2909810bb0",
  measurementId: "G-T2PFEX423F"
};

const firebaseapp = initializeApp(firebaseConfig);

const db = getDatabase(firebaseapp);

const dbRef = ref(db, '/Races/Dragonborn/element');
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.