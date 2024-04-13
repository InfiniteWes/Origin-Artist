const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
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

  // Starting the Character Process from the sidebar page.
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

  // Handles Dark and Light mode for Users
  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  });

  // Pulls the race data from Firebase 
  ipcMain.on('request-race-data', async (event) => {
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
  });

  // Pulls the class data from Firebase
  ipcMain.on('request-class-data', async (event) => {
    // Assuming raceName is a variable containing the name of the race you want data for

    // Get the base races from the database
    const class_main_DataRef = ref(db, `/main/classes/`);
    get(class_main_DataRef).then((snapshot) => {
      if (snapshot.exists()) {
        const classData = snapshot.val();
        event.reply('class-data-response', classData); // Send data back to renderer
      } else {
        console.log("No data available");
        event.reply('class-data-response', null);
      }
    }).catch((error) => {
      console.error(error);
      event.reply('class-data-response', null);
    });
  });

  // Pulls the background data from Firebase
  ipcMain.on('request-background-data', async (event) => {
    // Get the base background info from the database
    const background_main_DataRef = ref(db, `/main/backgrounds/`);
    get(background_main_DataRef).then((snapshot) => {
      if (snapshot.exists()) {
        const backgroundData = snapshot.val();
        event.reply('background-data-response', backgroundData); // Send data back to renderer
      } else {
        console.log("No data available");
        event.reply('background-data-response', null);
      }
    }).catch ((error) => {
      console.error(error);
      event.reply('background-data-response', null);
    })
  })
  
  // Pulls the feats data from Firebase
  ipcMain.on('request-feats-data', async (event) => {
    // Get the base feats info from the database
    const feats_main_DataRef = ref(db, `/main/feats/`);
    get(feats_main_DataRef).then((snapshot) => {
      if (snapshot.exists()) {
        const featsData = snapshot.val();
        event.reply('feats-data-response', featsData); // Send data back to renderer
      } else {
        console.log("No data available");
        event.reply('feats-data-response', null);
      }
    }).catch ((error) => {
      console.error(error);
      event.reply('feats-data-response', null);
    })
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

app.on('ready', () => {
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
