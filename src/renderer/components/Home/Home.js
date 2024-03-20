// Home.js
import { createSidebar } from "./sidebar.js";
//const { ipcRenderer } = require('electron');

// Creating Add Character Button
const addCharacterButton = document.createElement('button');
addCharacterButton.textContent = '+';

// Function to make the Sidebar only appear once
let sidebarcreation = false;
function Sidebarlimit() {
    if (!sidebarcreation) {
        createSidebar(enableNavigation);
        sidebarcreation = true;
    } else {
        console.log('You can only have one character at a time!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('characterCreationComplete', enableNavigation);
});

function enableNavigation() {
    document.querySelectorAll('.disabled').forEach(link => {
        link.classList.remove('disabled');
        link.style.pointerEvents = 'auto';
    });
}

function simulateCharacterCreationComplete() {
    const event = new CustomEvent('characterCreationComplete');
    document.dispatchEvent(event);
}

/*ipcRenderer.send('request-race-data', 'Dragonborn');
// Listen for the response
ipcRenderer.on('race-data-response', (event, raceData) => {
    if (raceData) {
      // Update your UI with the received data
      console.log(raceData);
    } else {
      // Handle the case where no data is received or an error occurred
      console.log('Failed to receive race data');
    }
  });
*/
/*dbRef.once('value')
    .then((snapshot) => {
        const data = snapshot.val();
        console.log(data);
    })
    .catch((error) => {
        console.error(error);
    })
*/
addCharacterButton.addEventListener('click', Sidebarlimit);
document.body.appendChild(addCharacterButton);

const TestButton = document.createElement('button');
TestButton.textContent = 'Test';
TestButton.addEventListener('click', () => {
    console.log('Test button clicked');
    window.electronAPI.receiveData('race-data-response', (data) => {
        console.log(data); // Handle the received data
        console.log("The data was received!");
    });
    window.electronAPI.send('request-race-data', 'Dragonborn');
    console.log("All data receieved!");
    
});
document.body.appendChild(TestButton);
