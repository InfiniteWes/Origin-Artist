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
                background_UI(backgroundData);
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
                feats_UI(featsData);
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

function background_UI(backgroundData) {
    const backgroundContainer = document.getElementById('backgroundContainer');
    if (!backgroundContainer) {
        console.error("Failed to find the background container element");
        return;
    }
    if (!backgroundData) {
        console.error("No background data provided to UI function");
        return;
    }

    // Clear previous contents
    backgroundContainer.innerHTML = '';

    // Create a table element
    const table = document.createElement('table');

    // Iterate over each background entry in the received data
    Object.keys(backgroundData).forEach((backgroundName) => {
        // Create a row for each background
        const row = document.createElement('tr');
        
        // Create a cell for the background name
        const nameCell = document.createElement('td');
        nameCell.textContent = backgroundName;  // Use the key as the name
        row.appendChild(nameCell);

        // Append the row to the table
        table.appendChild(row);

        // Add Click Event listener to each row
        row.addEventListener('click', () => {
            const elements = backgroundData[backgroundName].element[0];
            const descriptionObj = elements.description;
            if (descriptionObj && descriptionObj.p) {
                // Convert each property in the 'p' object into a string and join them
                const descriptionText = Object.values(descriptionObj.p).join("\n\n");
                background_info(descriptionText);
            } else {
                background_info("Description not available");
            }
        });

        // Add Double Click Event listener to each row
        row.addEventListener('dblclick', () => {
            const characterData = JSON.parse(localStorage.getItem('characterData')) || {};
            characterData.background = backgroundName;
            localStorage.setItem('characterData', JSON.stringify(characterData));
        })
    });

    // Append the table to the background container
    backgroundContainer.appendChild(table);
}

// Function to display background information
function background_info(description) {
    const infoContainer = document.getElementById('infoContainer');
    if (!infoContainer) {
        console.error("Failed to find the info container element");
        return;
    }
    infoContainer.textContent = description;  // Update the text content with the background description
}

function background_choices() {
    const infoContainer = document.getElementById('infoContainer');
    if (!infoContainer) {
        console.error("Failed to find the info container element");
        return;
    }
    infoContainer.textContent = "Background Choices";
}




function feats_UI() {

}

function getProficiencies() {

}

function skill_proficiency_UI() {

}
