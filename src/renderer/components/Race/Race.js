// Race.js

// Assuming you have loaded the Race.json file into a variable named raceData
// For demonstration purposes, let's assume raceData is an array of objects with race information

// Function to fetch and load data from Race.json
function loadData() {
    fetch('../data/json/races.json')
        .then(response => response.json())
        .then(data => {
            displayData(data);
        });
}

// Function to display data in a table
function displayData(data) {
    const table = document.createElement('table');
    const header = table.createTHead();
    const headerRow = header.insertRow(0);

    // Define table headers
    const headers = ['Race', 'Description', 'Attribute Bonus'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    // Populate table with data
    data.forEach(race => {
        const row = table.insertRow();
        const nameCell = row.insertCell(0);
        const descCell = row.insertCell(1);
        const bonusCell = row.insertCell(2);

        nameCell.textContent = race.name;
        descCell.textContent = race.description;
        bonusCell.textContent = race.attributeBonus;
    });

    document.body.appendChild(table);
}

// Call the loadData function to fetch and display the data
loadData();