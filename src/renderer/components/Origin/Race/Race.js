// Race.js

// Assuming you have loaded the Race.json file into a variable named raceData
// For demonstration purposes, let's assume raceData is an array of objects with race information
// In your renderer process JavaScript, responsible for handling race page logic
/*electronAPI.receiveData('race-data-response', (raceData) => {
    if (raceData) {
        const tbody = document.querySelector('.race-table tbody');
        tbody.innerHTML = ''; // Clear existing rows
        populateRaceTable(tbody, raceData); // Repopulate the table with the received data
    } else {
        console.log("No race data received");
    }
});*/

// This function will create the table structure and append it to the body
function setupRaceTable() {
    let table = document.querySelector('.race-table');
    let tbody;

    // Check if the table already exists
    if (!table) {
        // Create a paragraph element to display a message
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = "Please choose a Race:";
        document.body.appendChild(messageParagraph);

        table = document.createElement('table');
        table.classList.add('race-table'); // Add class for styling

        const thead = document.createElement('thead');
        tbody = document.createElement('tbody');
        table.appendChild(thead);
        table.appendChild(tbody);

        // Setup table headers for 'Race'
        const headers = ['Race'];
        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const header = document.createElement('th');
            const textNode = document.createTextNode(headerText);
            header.appendChild(textNode);
            headerRow.appendChild(header);
        });
        thead.appendChild(headerRow);

        document.body.appendChild(table);
    } else {
        // If the table exists, clear the tbody contents
        tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
    }

    return tbody;
}


function setupSubraceTable() {
    const container = document.getElementById('subrace-table-container');
    container.innerHTML = ''; // Clear the container

    const table = document.createElement('table');
    table.classList.add('subrace-table'); // Add class for styling
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    // Optionally set up table headers
    const headerRow = document.createElement('tr');
    const headerCell = document.createElement('th');
    headerCell.textContent = 'Subraces';
    headerRow.appendChild(headerCell);
    thead.appendChild(headerRow);

    container.appendChild(table);

    return tbody; // Return the tbody element for populating rows
}

function populateRaceTable(tbody, data) {
    Object.entries(data).forEach(([raceKey, raceData]) => {
        const row = document.createElement('tr');
        const raceName = raceData.element[0]["@name"] || 'Unknown Race';

        const nameCell = document.createElement('td');
        nameCell.textContent = raceName;
        row.appendChild(nameCell);

        const deselectCell = document.createElement('td');
        const deselectButton = document.createElement('button');
        deselectButton.textContent = 'Deselect';
        deselectButton.style.display = 'none'; // Initially hidden
        deselectButton.addEventListener('click', () => deselectRace(raceData, row, deselectButton));
        deselectCell.appendChild(deselectButton);
        row.appendChild(deselectCell);

        row.addEventListener('click', () => {
            handleRowSelection(raceData);
        });

        row.addEventListener('dblclick', () => {
            selectRace(raceData, deselectButton);
        });

        tbody.appendChild(row);
    });
}

function handleRowSelection(raceDetails) {
    // Logic to handle selection, possibly displaying more details about the selected race
    console.log(raceDetails); // Example: log the selected race details
    // You can update the UI here to show more information about `raceDetails`
}



function handleRowSelection(raceData) {
    const detailsDiv = document.getElementById('race-details');
    detailsDiv.innerHTML = ''; // Clear previous content

    // Display race name
    const nameHeader = document.createElement('h2');
    nameHeader.textContent = raceData.element[0]["@name"];
    detailsDiv.appendChild(nameHeader);

    // Display source
    const sourceParagraph = document.createElement('p');
    sourceParagraph.textContent = `Source: ${raceData.element[0]["@source"]}`;
    detailsDiv.appendChild(sourceParagraph);

    const descriptions = raceData.element[0]["description"]['p']; // Get the 'p' array from the description

    if (descriptions && descriptions.length > 1) {
        descriptions.slice(1).forEach(item => {
            if (typeof item === 'string') {
                // Directly append string items as new paragraphs
                const paragraph = document.createElement('p');
                paragraph.textContent = item;
                detailsDiv.appendChild(paragraph);
            } else if (typeof item === 'object') {
                // If item.text is an array, iterate through it, otherwise treat it as a single string
                const textItems = Array.isArray(item.text) ? item.text : [item.text];

                textItems.forEach((textItem, index) => {
                    const paragraph = document.createElement('p');

                    // Handle 'strong' elements with 'em' labels
                    if (item.strong && item.strong.em) {
                        const strongElement = document.createElement('strong');
                        const emElement = document.createElement('em');
                        emElement.textContent = item.strong.em + ": "; // Include the 'em' label text
                        strongElement.appendChild(emElement);
                        paragraph.appendChild(strongElement); // Append 'strong' to the paragraph
                    }

                    // Handle 'span' elements, ensuring each label is matched with its corresponding text item
                    if (item.span && item.span[index]) {
                        const spanElement = document.createElement('span');
                        spanElement.textContent = item.span[index] + ": "; // Add the span text with formatting
                        paragraph.appendChild(spanElement);
                    }

                    // Append the text content after the label
                    paragraph.appendChild(document.createTextNode(textItem));
                    detailsDiv.appendChild(paragraph); // Append the paragraph to 'detailsDiv'
                });
            }
        });
    } else {
        // Handle case where there are no descriptions or only the first item
        const descriptionParagraph = document.createElement('p');
        descriptionParagraph.textContent = 'No additional description available';
        detailsDiv.appendChild(descriptionParagraph);
    }


    // Further logic to display additional details can go here...

    // Display descriptions and other details as needed
    raceData.element.forEach((item, index) => {
        if (index > 0) { // Skip the first element which is the race itself
            const traitHeader = document.createElement('h3');
            traitHeader.textContent = item["@name"];
            detailsDiv.appendChild(traitHeader);

            // Here you can add more logic to display detailed descriptions, tables, etc.
            // For example, item.description.p for paragraphs, item.description.h4 for headers, etc.
        }
    });

    // Store or use the selected race data for character creation
    // For example, store in a global variable or local storage for later use
}

function requestAndDisplayRaceData() {
    const tbody = setupRaceTable();

    electronAPI.receiveData('race-data-response', (raceData) => {
        if (raceData) {
            tbody.innerHTML = ''; // Clear existing rows
            populateRaceTable(tbody, raceData); // Repopulate the table with the received data
        } else {
            console.log("No race data received");
        }
    });

    window.electronAPI.send('request-race-data');
}

let selectedRaceData = null;
let selectedSubraceData = null;
let currentSubraces = [];

function selectRace(raceData, deselectButton) {
    console.log("Race selected:", raceData.element[0]["@name"]); // For debugging
    selectedRaceData = raceData;

    // update character data in local storage
    if (selectedRaceData && selectedSubraceData || selectedRaceData && !selectedSubraceData) {
        updateCharacterDataInLocalStorage();
    }

    const tbody = document.querySelector('.race-table tbody');
    tbody.innerHTML = '';

    // Re-create the row for the selected race
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.textContent = raceData.element[0]["@name"];
    row.appendChild(nameCell);

    // Re-add the deselect button
    deselectButton.style.display = 'inline'; // Make the deselect button visible
    deselectButton.removeEventListener('click', () => deselectRace()); // Remove previous click listeners to avoid duplicates
    deselectButton.addEventListener('click', deselectRace, deselectSubrace); // Add click listener to the deselect button
    const deselectCell = document.createElement('td');
    deselectCell.appendChild(deselectButton);
    row.appendChild(deselectCell);

    tbody.appendChild(row); // Add the row back to the table

    // Clear subrace selection when a new race is selected
    const subraceSelectionDiv = document.getElementById('subrace-selection');
    if (subraceSelectionDiv) {
        subraceSelectionDiv.innerHTML = '';
    }

    const subraceTableContainer = document.getElementById('subrace-table-container');
    subraceTableContainer.innerHTML = '';

    const detailsDiv = document.getElementById('race-details');
    detailsDiv.innerHTML = ''; // Clear previous content

    // Check if it's Dragonborn and has racial traits to be treated as subraces
    /*if (raceData.element[0]["@name"] === "Dragonborn") {
        const dragonbornSubraces = raceData.element.filter(item => item["@color"]);
        displaySubraces(dragonbornSubraces, 'Dragonborn Ancestry');
    } else if (raceData.element[0]["@name"] !== "Dragonborn") { // Check for other races with subraces
        const subraces = raceData.element.filter(item => item["@type"] === "Sub Race" || item["@type"] === "Subrace" || item["@type"] === "Sub race");
        displaySubraces(subraces, 'Subrace');
    } else {
        console.log("No subraces for this race");
        // Proceed to the next step if no subraces
    }*/

    const subraceTbody = setupSubraceTable();
    if (raceData.element[0]["@name"] === "Dragonborn") {
        displaySubraces(subraceTbody, raceData.element.filter(item => item["@color"]), 'Dragonborn Ancestry');
    } else {
        displaySubraces(subraceTbody, raceData.element.filter(item => item["@type"] === "Sub Race" || item["@type"].toLowerCase().includes("subrace")), 'Sub race');
    }
}


function displaySubraces(tbody, subraces, type) {
    tbody.innerHTML = ''; // Clear existing table rows

    subraces.forEach(subrace => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = subrace["@name"] + (type === 'Dragonborn Ancestry' ? ' Ancestry' : ''); // Add 'Ancestry' suffix for Dragonborn
        row.appendChild(nameCell);

        row.addEventListener('click', () => {
            displaySubraceDetails(subrace); // Handle subrace selection
        });

        row.addEventListener('dblclick', () => {
            selectSubrace(subrace); // Handle subrace selection on double click
        });

        tbody.appendChild(row);
    });
}

function displaySubraceDetails(subraceData) {
    const subraceDetailsDiv = document.getElementById('subrace-details');
    subraceDetailsDiv.innerHTML = ''; // Clear previous content

    // Display subrace name
    const nameHeader = document.createElement('h2');
    nameHeader.textContent = subraceData["@name"];
    subraceDetailsDiv.appendChild(nameHeader);

    // Iterate through the description array
    subraceData.description.forEach(element => {
        const paragraph = document.createElement('p');

        if (typeof element === 'string') {
            // Directly append string elements as paragraph text
            paragraph.textContent = element;
        } else {
            // For object elements, check for 'strong' and 'em' properties
            if (element.strong && element.strong.em) {
                const strongElement = document.createElement('strong');
                const emElement = document.createElement('em');
                emElement.textContent = element.strong.em;
                strongElement.appendChild(emElement);
                paragraph.appendChild(strongElement);
            }
            // Append the text content after any 'strong'/'em' formatting
            if (element.text) {
                paragraph.append(` ${element.text}`);
            }
        }

        subraceDetailsDiv.appendChild(paragraph);
    });

    // Additional details can be appended here as needed
}

function selectSubrace(subraceData) {
    console.log(subraceData["@name"] + " selected"); // For debugging
    deselectSubrace();
    selectedSubraceData = subraceData;

    updateSubraceSelectionDisplay(subraceData["@name"]);

    if (selectedRaceData && selectedSubraceData) {
        updateCharacterDataInLocalStorage();
    }
}

let currentRace; // Creates empty variable to store the current race

// Function to update the Race selection if the user deselects a race.
function updateRaceSelectionDisplay(raceName) {
    currentRace = raceName; // Update the current race

    const raceSelectionDiv = document.getElementById('race-selection');
    raceSelectionDiv.innerHTML = ''; // Clear previous content

    const selectionText = document.createTextNode(`Race: ${raceName}`);
    raceSelectionDiv.appendChild(selectionText);

    const deselectButton = document.createElement('button');
    deselectButton.textContent = 'Deselect';
    deselectButton.addEventListener('click', deselectRace);
    raceSelectionDiv.appendChild(deselectButton);
}

// Function to update the Subrace selection if the user deselects a race.
function updateSubraceSelectionDisplay(subraceName) {
    const subraceSelectionDiv = document.getElementById('subrace-table-container');
    subraceSelectionDiv.innerHTML = ''; // Clear previous content

    const selectionText = document.createTextNode(`Subrace: ${subraceName}`);
    subraceSelectionDiv.appendChild(selectionText);

    const deselectButton = document.createElement('button');
    deselectButton.textContent = 'Deselect';
    deselectButton.addEventListener('click', deselectSubrace);
    subraceSelectionDiv.appendChild(deselectButton);
}

// Function to deselect the race
function deselectRace() {
    const raceSelectionDiv = document.getElementById('race-selection');
    if (raceSelectionDiv) {
        raceSelectionDiv.innerHTML = ''; // Clear the race selection display
    }
    
    const subraceTableContainer = document.querySelector('#subrace-table-container');
    if (subraceTableContainer) {
        subraceTableContainer.innerHTML = ''; // Clear the subrace table
    }

    deselectSubrace();

    selectedSubraceData = null; // Reset the current subraces
    selectedRaceData = null; // Reset the current race
    const subraceSelectionDiv = document.getElementById('subrace-selection');
    if (subraceSelectionDiv) {
        subraceSelectionDiv.innerHTML = ''; // Clear the subrace selection display
    }

    const tbody = document.querySelector('.race-table tbody');
    tbody.innerHTML = ''; // Important: Clear the table before repopulating

    requestAndDisplayRaceData(); // Repopulate the race table
}


// Function to deselect the subrace
function deselectSubrace() {
    // Clear the subrace selection display
    const subraceSelectionDiv = document.getElementById('subrace-selection');
    if (subraceSelectionDiv) {
        subraceSelectionDiv.innerHTML = '';
    }

    const subraceDetailsDiv = document.getElementById('subrace-details');
    if (subraceDetailsDiv) {
        subraceDetailsDiv.innerHTML = '';
    }
    // Clear the subrace table
    const subraceTableContainer = document.getElementById('subrace-table-container');
    if (subraceTableContainer) {
        subraceTableContainer.innerHTML = '';
    }

    // Optionally, repopulate the subrace list for the current race if needed
    if (selectedRaceData) {
        const subraceTbody = setupSubraceTable();
        displaySubraces(subraceTbody, selectedRaceData.element.filter(item => item["@type"] === "Sub Race" || item["@type"].toLowerCase().includes("subrace")), 'Sub race');
    }

    selectedSubraceData = null;
}


// Store the character Data.
function characterData() {
    // Retrieve the existing character data from localStorage
    let storedCharacterData = localStorage.getItem('characterData');
    storedCharacterData = storedCharacterData ? JSON.parse(storedCharacterData) : {};

    // Check if both race and subrace have been selected
    if (selectedRaceData && selectedSubraceData) {
        // Update the stored character data with the race and subrace information
        storedCharacterData.race = selectedRaceData;
        storedCharacterData.subrace = selectedSubraceData;

        // Save the updated character data back to localStorage
        localStorage.setItem('characterData', JSON.stringify(storedCharacterData));

        console.log('Updated character data with race and subrace:', storedCharacterData);
    } else {
        console.log("Please ensure both a race and subrace have been selected.");
    }
}

function updateCharacterDataInLocalStorage() {
    // Retrieve existing character data or initialize a new object if none exists
    let storedCharacterData = localStorage.getItem('characterData');
    storedCharacterData = storedCharacterData ? JSON.parse(storedCharacterData) : {};

    // Update with the selected race and subrace
    storedCharacterData.race = selectedRaceData;
    storedCharacterData.subrace = selectedSubraceData;

    // Save the updated character data back to localStorage
    localStorage.setItem('characterData', JSON.stringify(storedCharacterData));

    console.log('Character data updated with race and subrace:', storedCharacterData);
}


document.addEventListener('DOMContentLoaded', function() {
    requestAndDisplayRaceData();
});