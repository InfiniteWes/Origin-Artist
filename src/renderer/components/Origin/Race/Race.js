// Race.js

// Assuming you have loaded the Race.json file into a variable named raceData
// For demonstration purposes, let's assume raceData is an array of objects with race information


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

// This function will create the table structure and append it to the body
function setupRaceTable() {
    const table = document.createElement('table');
    table.classList.add('race-table'); // Add class for styling
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    // Setup table headers for 'Name' and 'Source'
    const headers = ['Name'];
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const header = document.createElement('th');
        const textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        headerRow.appendChild(header);
    });
    thead.appendChild(headerRow);

    document.body.appendChild(table);

    return tbody;
}

function populateRaceTable(tbody, data) {
    Object.entries(data).forEach(([raceKey, raceData]) => {
        const row = document.createElement('tr');
        const raceName = raceData.element[0]["@name"] || 'Unknown Race'; // Get race name from the first element

        const nameCell = document.createElement('td');
        nameCell.textContent = raceName;
        row.appendChild(nameCell);

        row.addEventListener('click', () => {
            handleRowSelection(raceData); // Pass the entire race data
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

    window.electronAPI.receiveData('race-data-response', (data) => {
        populateRaceTable(tbody, data);
    });

    window.electronAPI.send('request-race-data', 'Dragonborn');
}

requestAndDisplayRaceData();
