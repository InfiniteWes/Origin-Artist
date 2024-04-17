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
            characterData.background = backgroundData[backgroundName].element;
            localStorage.setItem('characterData', JSON.stringify(characterData));

            background_choices(backgroundData[backgroundName].element[0]);

            const deselectBtn = document.createElement('button');
            deselectBtn.textContent = 'Deselect';
            row.appendChild(deselectBtn);
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

function background_choices(element) {
    const infoContainer = document.getElementById('infoContainer');
    if (!infoContainer) {
        console.error("Failed to find the info container element");
        return;
    }

    // Clear previous contents
    infoContainer.innerHTML = '';

    // Check if there is a 'rules' object with a 'select' key
    if (element.rules && element.rules.select) {
        Object.keys(element.rules.select).forEach((key) => {
            const selectEntry = element.rules.select[key];

            // Create a table for each select entry if it has an 'item' array
            if (selectEntry['item'] && Array.isArray(selectEntry['item'])) {
                const table = document.createElement('table');
                table.style.width = '100%'; // Set table width
                const caption = document.createElement('caption');
                caption.textContent = selectEntry['@name'] || "Unnamed"; // Use the @name attribute or a placeholder
                table.appendChild(caption);

                // Iterate over the items array
                selectEntry['item'].forEach((item) => {
                    const row = document.createElement('tr');
                    const cell = document.createElement('td');
                    cell.textContent = item.text || "No description available"; // Check for text property
                    row.appendChild(cell);
                    table.appendChild(row);

                    // Add double-click event listener to row
                    row.addEventListener('dblclick', () => {
                        selectItem(item, key, table);
                    });
                });

                // Append the table to the info container
                infoContainer.appendChild(table);
            }
        });
    } else {
        infoContainer.textContent = "No selectable rules found.";
    }
}

/**
 * Function to handle item selection
 * @param {Object} item The item object that was selected
 * @param {String} key The category name (e.g., Personality Trait)
 * @param {HTMLElement} table The table element where the selection happened
 */
function selectItem(item, key, table) {
    // Highlight the selected row and update character data
    // First, clear previous selections if any
    Array.from(table.querySelectorAll('tr')).forEach(tr => {
        tr.classList.remove('selected');
        tr.style.display = ''; // Restore any previously hidden rows
        // Remove any existing deselect buttons
        const existingButton = tr.querySelector('.deselect-button');
        if (existingButton) {
            tr.removeChild(existingButton);
        }
    });

    // Highlight the selected row
    event.currentTarget.classList.add('selected');

    // Hide all non-selected rows
    Array.from(table.querySelectorAll('tr')).forEach(tr => {
        if (!tr.classList.contains('selected')) {
            tr.style.display = 'none';
        }
    });

    // Add a deselect button to the selected row
    const deselectBtn = document.createElement('button');
    deselectBtn.textContent = 'Deselect';
    deselectBtn.className = 'deselect-button'; // Add a class for possible CSS styling
    event.currentTarget.appendChild(deselectBtn);

    // Handle deselect button click
    // Handle deselect button click
    deselectBtn.onclick = () => {
        // Restore all rows
        Array.from(table.querySelectorAll('tr')).forEach(tr => {
            tr.style.display = '';
            tr.classList.remove('selected');
        });

        // Remove the deselect button safely
        deselectBtn.parentNode.removeChild(deselectBtn);

        // Optionally clear the selection from character data
        const characterData = JSON.parse(localStorage.getItem('characterData')) || {};
        if (characterData.selections && characterData.selections[key]) {
            delete characterData.selections[key];
            localStorage.setItem('characterData', JSON.stringify(characterData));
        }

        // Log deselection
        console.log("Deselected option for:", key);
    };

    // Update some state or storage to reflect the selection
    const characterData = JSON.parse(localStorage.getItem('characterData')) || {};
    if (!characterData.selections) {
        characterData.selections = {};
    }
    characterData.selections[key] = {
        text: item.text || "No description available",
        id: item["@id"] || "No ID"
    };
    localStorage.setItem('characterData', JSON.stringify(characterData));

    // Log the selection
    console.log("Selected:", item.text);
}


function feats_UI() {

}

function getProficiencies() {

}

function skill_proficiency_UI() {

}
