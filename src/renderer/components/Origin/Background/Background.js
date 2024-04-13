// Background.js file

// getBackground function to call the background data from firebase
function getBackground() {
    // Call the background data from the database
    document.addEventListener('DOMContentLoaded', () => {
        // Request background data from the main process
        electronAPI.send('request-background-data');

        // Listen for class data response from the main process
        electronAPI.receiveData('background-data-response', (backgroundData) => {
            if (backgroundData) {
                console.log(backgroundData); // For testing purposes, log the received data
                background_option(backgroundData);
            } else {
                console.log("No class data received");
            }
        });
    });
}

getBackground();

// getFeats function to call the feats data from firebase
function getFeats() {
    // Call the background data from the database
    document.addEventListener('DOMContentLoaded', () => {
        // Request background data from the main process
        electronAPI.send('request-feats-data');

        // Listen for class data response from the main process
        electronAPI.receiveData('feats-data-response', (featsData) => {
            if (featsData) {
                console.log(featsData); // For testing purposes, log the received data
                background_option(featsData);
            } else {
                console.log("No class data received");
            }
        });
    });
}

getFeats();

// Pull the character data from local storage
function localCharacterData() {
    // Retrieve the character data from local storage
    const characterData = JSON.parse(localStorage.getItem('characterData'));

    // Check if character data and level exist
    if (characterData && characterData.level) {
        const level = characterData.level;
        console.log("Character level is: " + level);
    }
}

function background_option(backgroundData) {
    const backgroundContainer = document.getElementById('backgroundContainer');
    if (!backgroundContainer) return;

    backgroundContainer.innerHTML = '';

    Object.keys(backgroundData).forEach((backgroundName) => {
        const background = backgroundData[backgroundName];
        const backgroundNameElement = document.createElement('p');
        backgroundNameElement.textContent = background.name;
        backgroundContainer.appendChild(backgroundNameElement);
    })
}

function skill_proficiency_option() {

}

function feats_option() {

}