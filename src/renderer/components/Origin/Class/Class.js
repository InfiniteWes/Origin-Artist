// Class.js 

function levelCheck() {
    // Retrieve the character data from local storage
    const characterData = JSON.parse(localStorage.getItem('characterData'));

    // Check if character data and level exist
    if (characterData && characterData.level) {
        const level = characterData.level;
        console.log("Character level is: " + level);
    }
}

function multiClassCheck() {
    // Function to check if multi-class is on, if on, then allow user to add another class after level 2 and if there proficiencies are matching.
}

document.addEventListener('DOMContentLoaded', () => {
    // Request class data from the main process
    electronAPI.send('request-class-data');

    // Listen for class data response from the main process
    electronAPI.receiveData('class-data-response', (classData) => {
        if (classData) {
            console.log(classData); // For testing purposes, log the received data
            displayClasses(classData);
        } else {
            console.log("No class data received");
        }
    });
});


function displayClasses(classData) {
    // Find the container where the class cards will be displayed
    const classesContainer = document.getElementById('classesContainer');
    if (!classesContainer) return;

    // Clear previous content
    classesContainer.innerHTML = '';

    // Loop through each class in the class data
    Object.keys(classData).forEach((className) => {
        // Access the class object using the className key
        const classObj = classData[className];

        // Create a card element
        const card = document.createElement('div');
        card.classList.add('class-card'); // Add a 'class-card' class for styling

        // Assuming your class data structure, extract the class name
        const name = classObj.element[0]["@name"];

        // Create an image element for the class (you'll need to provide images or a way to determine the image source based on the class name)
        const classImage = document.createElement('img');
        classImage.src = `../../../assets/${name.toLowerCase()}.png`; // Example image path, adjust as needed
        classImage.alt = name;

        // Create a paragraph element for the class name
        const nameParagraph = document.createElement('p');
        nameParagraph.textContent = name;

        // Append the image and name paragraph to the card
        card.appendChild(classImage);
        card.appendChild(nameParagraph);

        // Append the card to the container
        classesContainer.appendChild(card);

        card.addEventListener('click', () => {
            displayClassInfo(classObj.element[0]);
        });

        card.addEventListener('dblclick', () => {
            const characterData = JSON.parse(localStorage.getItem('characterData')) || {};
            
            // Assuming the race has already been chosen and stored under 'race' key
            if (characterData.race) {
                
                // Update characterData with selected class and save back to localStorage
                characterData.class = classObj;
                localStorage.setItem('characterData', JSON.stringify(characterData));
        
                // Optionally, you can then proceed to display level-based options if the level is already set
                if (characterData.level) {
                    displayClassOptions(classObj, characterData.level);
                } else {
                    // Notify user to select level if not set
                    console.log("Please select your character level.");
                }
            } else {
                // Notify user to select race first
                console.log("Please select your character race first.");
            }
        });
        
    });
}

function displayClassInfo(classObj) {
    const infoContainer = document.getElementById('classInfoContainer');
    if (!infoContainer) return;

    infoContainer.innerHTML = '';

    const nameHeader = document.createElement('h2');
    nameHeader.textContent = classObj["@name"];
    infoContainer.appendChild(nameHeader);

    // Display paragraphs
    classObj.description.p.forEach(text => {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        infoContainer.appendChild(paragraph);
    });

    // Display lists
    if (classObj.description.ul) {
        classObj.description.ul.forEach(item => {
            const list = document.createElement('ul');
        
            const processListItem = (item) => {
                const listItem = document.createElement('li');
                if (item.strong) {
                    const strongElement = document.createElement('strong');
                    strongElement.textContent = item.strong + ": ";
                    listItem.appendChild(strongElement);
                }
                listItem.appendChild(document.createTextNode(item['text']));
                list.appendChild(listItem);
            };

            if (Array.isArray(item)) {
                item.forEach(subItem => processListItem(subItem));
            } else {
                processListItem(item);
            }
        
            infoContainer.appendChild(list);
        });
    }
    // Display tables, if any
    // This part is a bit more complex due to the nested structure of table rows (tr) and data (thead and td)
    // You'll need to iterate through thead for headers and tr for rows, creating corresponding elements

    // Example for thead
    if (classObj.description.table) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        
        // Creating the header row
        const headerRow = document.createElement('tr');
        classObj.description.table.thead.tr.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        
        // Creating the body rows
        classObj.description.table.tr.forEach(rowData => {
            const row = document.createElement('tr');
            
            // Checking if rowData is an array (for nested structure) or just a string
            if (Array.isArray(rowData)) {
                rowData.forEach(cellData => {
                    const cell = document.createElement('td');
                    cell.textContent = cellData;
                    row.appendChild(cell);
                });
            } else {
                const cell = document.createElement('td');
                cell.textContent = rowData;
                row.appendChild(cell);
                // If rowData is a single string, it might be a merged cell case or a single column row, so we adjust accordingly
                cell.setAttribute('colspan', classObj.description.table.thead.tr.length); // Spanning across all columns
            }
            
            tbody.appendChild(row);
        });
    
        table.appendChild(thead);
        table.appendChild(tbody);
    
        infoContainer.appendChild(table);
    }
    

    // Continue to display other elements as needed (h3, h4, h5, etc.)
}

function displayClassOptions(classObj, userLevel) {
    const optionsContainer = document.getElementById('optionsContainer');
    if (!optionsContainer) return;
    optionsContainer.innerHTML = '';

    // Function to handle deselecting an option and repopulating choices
    function handleDeselect(container, populateFunction) {
        container.innerHTML = ''; // Clear the container
        populateFunction(); // Repopulate options
    }

    // Function to handle selection and add deselect button
    function handleSelection(container, selectionText, repopulateFunction) {
        container.innerHTML = ''; // Clear previous content

        const selection = document.createElement('li');
        selection.textContent = selectionText;
        container.appendChild(selection);

        const deselectBtn = document.createElement('button');
        deselectBtn.textContent = 'Deselect';
        deselectBtn.onclick = () => handleDeselect(container, repopulateFunction);
        container.appendChild(deselectBtn);
    }

    // Populate Ability Score Improvements
    const asiContainer = document.createElement('div');
    asiContainer.id = 'asiContainer';
    asiContainer.innerHTML = '<h3>Ability Score Improvements</h3>';
    optionsContainer.appendChild(asiContainer);

    classObj.element.forEach(feature => {
        if (feature['@type'] === "Class Feature" && feature['@name'] === "Ability Score Improvement") {
            feature.rules.forEach(rule => {
                const level = parseInt(rule['@level'], 10);
                if (userLevel >= level) {
                    const levelContainer = document.createElement('div');
                    asiContainer.appendChild(levelContainer);
    
                    const populateASIOptions = () => {
                        levelContainer.innerHTML = `<h4>Level ${level} Options:</h4>`;
                        const optionsList = document.createElement('ul');
                        ['Ability Score Improvement', 'Feat'].forEach(optionText => {
                            const option = document.createElement('li');
                            option.textContent = optionText;
                            option.addEventListener('dblclick', () => {
                                handleSelection(levelContainer, `Level ${level}: ${optionText}`, populateASIOptions);
    
                                const characterData = JSON.parse(localStorage.getItem('characterData')) || {};
                                // Initialize the 'asiChoices' key as an object if it doesn't exist
                                characterData.asiChoices = characterData.asiChoices || {};
    
                                // Store the user's selection for the specific level
                                if (optionText === 'Ability Score Improvement') {
                                    characterData.asiChoices[`Level ${level}`] = 'Ability Score Improvement';
                                } else if (optionText === 'Feat') {
                                    characterData.asiChoices[`Level ${level}`] = 'Feat';
                                }
    
                                localStorage.setItem('characterData', JSON.stringify(characterData));
                            });
                            optionsList.appendChild(option);
                        });
                        levelContainer.appendChild(optionsList);
                    };
                    populateASIOptions(); // Initial population of ASI options
                }
            });
        }
    });    

    // Populate Archetypes
    const archetypesContainer = document.createElement('div');
    archetypesContainer.innerHTML = '<h3>Archetypes</h3>';
    optionsContainer.appendChild(archetypesContainer);

    const archetypesList = document.createElement('ul');
    archetypesContainer.appendChild(archetypesList);

    const populateArchetypes = () => {
        archetypesList.innerHTML = ''; // Clear previous content
        classObj.element.forEach(feature => {
            if (feature['@type'] === "Archetype" && (feature['@level'] ? userLevel >= parseInt(feature['@level'], 10) : true)) {
                const archetypeOption = document.createElement('li');
                archetypeOption.textContent = feature['@name'];
                archetypeOption.addEventListener('dblclick', () => {
                    handleSelection(archetypesList, `Archetype: ${feature['@name']}`, populateArchetypes);
                    const characterData = JSON.parse(localStorage.getItem('characterData')) || {};
                    characterData.subclass = feature;
                    localStorage.setItem('characterData', JSON.stringify(characterData));
                });
                archetypesList.appendChild(archetypeOption);
            }
        });
    };
    populateArchetypes(); // Initial population of archetypes

    // Populate Fighting Styles
    const fightingStylesContainer = document.createElement('div');
    fightingStylesContainer.innerHTML = '<h3>Fighting Styles</h3>';
    optionsContainer.appendChild(fightingStylesContainer);

    const fightingStylesList = document.createElement('ul'); // Ensure this is defined before populateFightingStyles is called
    fightingStylesContainer.appendChild(fightingStylesList);

    // Populate Fighting Styles
    const populateFightingStyles = () => {
        fightingStylesList.innerHTML = ''; // Clear previous content
        classObj.element.forEach(feature => {
            if (feature['@type'] === "Class Feature" && feature['@name'] === "Fighting Style") {
                // Iterate over each fighting style and create a list item
                feature['description']['h5'].forEach(style => {
                    const fightingStyleOption = document.createElement('li');
                    fightingStyleOption.textContent = style;
                    fightingStyleOption.addEventListener('dblclick', () => {
                        // When a fighting style is selected, handle the selection
                        handleSelection(fightingStylesList, `Fighting Style: ${style}`, populateFightingStyles);
                        const characterData = JSON.parse(localStorage.getItem('characterData')) || {};
                    
                        // Instead of storing the entire feature, store the selected style
                        characterData.fightingStyle = { 
                            '@id': feature['@id'],
                            '@name': style,
                            '@source': feature['@source'],
                            '@type': feature['@type'],
                            'description': feature['description']['p'][feature['description']['h5'].indexOf(style) + 1] // Description based on index
                        };

                        localStorage.setItem('characterData', JSON.stringify(characterData));
                    });
                    fightingStylesList.appendChild(fightingStyleOption);
                });
            }
        });
    };
    populateFightingStyles(); // Initial population of fighting styles

    const favoredEnemyContainer = document.createElement('div');
    favoredEnemyContainer.innerHTML = '<h3>Favored Enemy</h3>';
    optionsContainer.appendChild(favoredEnemyContainer);

    const favoredEnemyList = document.createElement('ul');
    favoredEnemyContainer.appendChild(favoredEnemyList);

    let selectedHumanoids = [];
    const updateCharacterData = (feature) => {
        // This function updates the selected Favored Enemy in character data and localStorage
        const characterData = JSON.parse(localStorage.getItem('characterData')) || {};
        characterData.favoredEnemy = feature;
        localStorage.setItem('characterData', JSON.stringify(characterData));
    };

    // Separate list for humanoid options
    const humanoidOptionsList = document.createElement('ul');
    favoredEnemyContainer.appendChild(humanoidOptionsList);
    humanoidOptionsList.style.display = 'none'; // Initially hidden

    const populateFavoredEnemy = () => {
        favoredEnemyList.innerHTML = ''; // Clear previous content
        humanoidOptionsList.innerHTML = ''; // Clear humanoid options
        humanoidOptionsList.style.display = 'none'; // Hide humanoid options

        // Filter for non-humanoid favored enemies
        const favoredEnemies = classObj.element.filter(feature =>
            feature['@type'] === "Class Feature" &&
            feature['supports']?.includes("Favored Enemy") &&
            !feature['supports']?.includes("Humanoid Favored Enemy") &&
            !feature['@id']?.includes("HUMANOIDS_2") &&
            !feature['@id']?.includes("HUMANOIDS_3")
        );

        favoredEnemies.forEach(feature => {
            const favoredEnemyOption = document.createElement('li');
            favoredEnemyOption.textContent = feature['@name'];
            favoredEnemyList.appendChild(favoredEnemyOption);

            favoredEnemyOption.addEventListener('dblclick', () => {
                if (feature['@name'].includes("Humanoid")) {
                    handleHumanoidSelection();
                } else {
                    updateCharacterData(feature);
                }
            });
        });
    };

    const handleHumanoidSelection = () => {
        favoredEnemyList.style.display = 'none'; // Hide main list
        humanoidOptionsList.innerHTML = ''; // Clear humanoid list
        humanoidOptionsList.style.display = 'block'; // Show humanoid list

        const humanoidOptions = classObj.element.filter(item =>
            item['@id']?.includes('HUMANOID') &&
            item['@type'] === "Class Feature" &&
            !item['@id']?.includes('HUMANOIDS')
        );

        humanoidOptions.forEach(option => {
            addHumanoidOptionToList(option, humanoidOptionsList);
        });

        // Add a back button to allow user to go back to the main list
        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Favored Enemies';
        backButton.onclick = () => {
            favoredEnemyList.style.display = 'block'; // Show main list
            humanoidOptionsList.style.display = 'none'; // Hide humanoid list
        };
        humanoidOptionsList.appendChild(backButton);
    };

    const addHumanoidOptionToList = (option, list) => {
        const optionItem = document.createElement('li');
        optionItem.textContent = option['@name'];
        list.appendChild(optionItem);

        optionItem.addEventListener('dblclick', () => {
            if (selectedHumanoids.length < 2) {
                selectHumanoid(option, optionItem);
            }
        });
    };

    const selectHumanoid = (option, listItem) => {
        selectedHumanoids.push(option['@name']);
        updateCharacterDataForHumanoids();

        listItem.innerHTML = `${option['@name']} <button class="deselect-btn">Deselect</button>`;

        const deselectBtn = listItem.querySelector('.deselect-btn');
        deselectBtn.addEventListener('click', () => {
            deselectHumanoid(option['@name'], listItem);
        });

        // After selecting two humanoids, hide other options
        if (selectedHumanoids.length === 2) {
            Array.from(humanoidOptionsList.children).forEach(item => {
                if (!selectedHumanoids.includes(item.textContent) && item.tagName === 'LI') {
                    item.style.display = 'none';
                }
            });
        }
    };

    const deselectHumanoid = (name, listItem) => {
        selectedHumanoids = selectHumanoid.filter(humanoid => humanoid !== name);
        updateCharacterDataForHumanoids();
        listItem.remove();

        // If less than two humanoids are selected, show all options again
        if (selectedHumanoids.length < 2) {
            Array.from(humanoidOptionsList.children).forEach(item => {
                if (item.tagName === 'LI') {
                    item.style.display = 'block';
                }
            });
        }
    };

    const updateCharacterDataForHumanoids = () => {
        const characterData = JSON.parse(localStorage.getItem('characterData')) || {};
        characterData.favoredEnemy = selectedHumanoids;
        localStorage.setItem('characterData', JSON.stringify(characterData));
    };

    populateFavoredEnemy();
}

