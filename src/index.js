const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}


const { Menu } = require('electron')

const template = [
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// Splash Screen / loading Screeen

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    backgroundColor: 'white',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // This should be enabled for contextBridge to work
      nodeIntegration: false,
      
    },
  })

  ipcMain.on('sidebar-to-race-page', (event) => {
    console.log("Received 'sidebar-to-race-page' IPC message"); // Log the receipt of the IPC message
    const mainWindow = BrowserWindow.getFocusedWindow();

    if (mainWindow) {
        mainWindow.loadFile(path.join(__dirname, 'renderer', 'components','Origin', 'Race', 'Race.html'));
        console.log("Navigating to Race.html"); // Log the navigation attempt
    } else {
        console.log("Main window not found"); // Log if the main window instance is not found
    }
  });

  ipcMain.on('request-race-data', async (event, raceName) => {
    // Assuming raceName is a variable containing the name of the race you want data for

    // Get the base races from the database
    const race_main_DataRef = ref(db, `/main/races/`);
    get(race_main_DataRef).then((snapshot) => {
      if (snapshot.exists()) {
        const raceData = snapshot.val();
        event.reply('race-data-response', raceData); // Send data back to renderer
      } else {
        console.log("No data available");
        event.reply('race-data-response', null);
      }
    }).catch((error) => {
      console.error(error);
      event.reply('race-data-response', null);
    });

    // Get the expansion races from the database
    //const race_expansion_DataRef = ref(db, `/expansion/races/`);
    
  });
  


  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.center();

  var splash = new BrowserWindow({
    width:500,
    height:300,
    transparent: false,
    frame: false,
    alwaysOnTop: true,
  });
  
  splash.loadFile(path.join(__dirname, 'renderer', 'Splash.html'));
  splash.center();
  
  setTimeout(function () {
    splash.close();
    mainWindow.show();
  }, 3000);
  
  

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// Firebase Configuration
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

// Splash Screen / loading Screeen
//const dbRef = ref(db, '/Races/Dragonborn/element');
//module.exports = { dbRef };
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  Menu.setApplicationMenu(menu);
  createWindow();
});

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