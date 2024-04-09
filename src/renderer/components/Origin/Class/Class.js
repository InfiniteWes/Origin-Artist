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
    const classesContainer = document.getElementById('classesContainer');
    if (!classesContainer) return;

    classesContainer.innerHTML = '';

    Object.keys(classData).forEach((className) => {
        const classObj = classData[className];
        const card = document.createElement('div');
        card.classList.add('class-card');

        const name = classObj.element[0]["@name"];
        const classImage = document.createElement('img');
        classImage.src = `../../../assets/${name.toLowerCase()}.png`;
        classImage.alt = name;

        const nameParagraph = document.createElement('p');
        nameParagraph.textContent = name;

        card.appendChild(classImage);
        card.appendChild(nameParagraph);

        classesContainer.appendChild(card);

        card.addEventListener('click', () => {
            displayClassInfo(classObj.element[0]);
        });

        card.addEventListener('dblclick', () => {
            const characterData = JSON.parse(localStorage.getItem('characterData')) || {};
            if (characterData.race) {
                characterData.class = classObj;
                localStorage.setItem('characterData', JSON.stringify(characterData));

                // Add animation to slide away other cards
                Array.from(classesContainer.children).forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.add('slide-away');
                        // Explicitly hide the card
                        otherCard.style.display = 'none';
                    }
                });

                // Display class info for the selected class
                displayClassOptions(classObj, characterData.level);

                // Add deselect button to the selected card
                const deselectBtn = document.createElement('button');
                deselectBtn.textContent = 'Deselect';
                card.appendChild(deselectBtn);

                deselectBtn.addEventListener('click', () => {
                    // Remove the deselect button
                    card.removeChild(deselectBtn);

                    // Repopulate cards by removing slide-away class and setting display back
                    Array.from(classesContainer.children).forEach(otherCard => {
                        otherCard.classList.remove('slide-away');
                        otherCard.style.display = ''; // Reset to default display style
                    });

                    // Optionally clear class info section if you have a separate area for displaying selected class details
                    // document.getElementById('classInfoContainer').innerHTML = '';
                    document.getElementById('classInfoContainer').innerHTML = '';
                    document.getElementById('optionsContainer').innerHTML = '';
                    document.getElementById('classInfoContainer').innerHTML = '';
                });
            } else {
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

function populateASIOptions(classObj, userLevel) {
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
}

function populateArchetypes(classObj, userLevel) {
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
}

function populateFightingStyles(classObj, userLevel) {
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
}

function populateFavoredEnemy(classObj, userLevel) {
    const favoredEnemyContainer = document.createElement('div');
    favoredEnemyContainer.innerHTML = '<h3>Favored Enemy</h3>';
    optionsContainer.appendChild(favoredEnemyContainer);

    const favoredEnemyList = document.createElement('ul');
    favoredEnemyContainer.appendChild(favoredEnemyList);

    
    let selectedHumanoids = [];
    // Separate list for humanoid options
    const humanoidOptionsList = document.createElement('ul');
    favoredEnemyContainer.appendChild(humanoidOptionsList);
    humanoidOptionsList.style.display = 'none'; // Initially hidden
    

    const populateFavoredEnemy = () => {
        favoredEnemyList.innerHTML = ''; // Clear previous content
        humanoidOptionsList.innerHTML = ''; // Clear humanoid options
        humanoidOptionsList.style.display = 'none'; // Hide humanoid options
    
        // Filter for favored enemy features, including level-based access
        const favoredEnemies = classObj.element.filter(feature =>
            feature['@type'] === "Class Feature" &&
            feature['supports']?.includes("Favored Enemy") &&
            !feature['supports']?.includes("Humanoid Favored Enemy") &&
            !feature['@id']?.includes("HUMANOIDS_2") &&
            !feature['@id']?.includes("HUMANOIDS_3")
        );
    
        // Retrieve the current selections from localStorage
        const characterData = JSON.parse(localStorage.getItem('characterData')) || {};
        const selectedEnemies = characterData.favoredEnemy || [];
    
        favoredEnemies.forEach(feature => {
            const favoredEnemyOption = document.createElement('li');
            favoredEnemyOption.textContent = feature['@name'];
    
            // Append the option only if it's in the selected list or if no selections have been made yet
            if (selectedEnemies.includes(feature['@name']) || selectedEnemies.length === 0) {
                favoredEnemyList.appendChild(favoredEnemyOption);
            }
    
            favoredEnemyOption.addEventListener('dblclick', () => {
                // Handle humanoid selection separately
                if (feature['@name'].includes("Humanoid")) {
                    handleHumanoidSelection();
                } else {
                    updateCharacterDataFavoredEnemy(feature, 'add');
                    // Re-render the option with a deselect button
                    favoredEnemyOption.innerHTML = `${feature['@name']}<button class="deselect-btn">Deselect</button>`;
                    Array.from(favoredEnemyList.children).forEach(item => {
                        if (item !== favoredEnemyOption) {
                            item.remove();
                        }
                    });
    
                    const deselectBtn = favoredEnemyOption.querySelector('.deselect-btn');
                    deselectBtn.addEventListener('click', () => {
                        updateCharacterDataFavoredEnemy(feature, "applicable level here", 'remove');
                        populateFavoredEnemy(); // Repopulate to reflect the updated selections
                    });
                }
            });
    
            // Automatically add deselect button if the enemy is already selected
            if (selectedEnemies.includes(feature['@name'])) {
                favoredEnemyOption.innerHTML = `${feature['@name']}<button class="deselect-btn">Deselect</button>`;
                const deselectBtn = favoredEnemyOption.querySelector('.deselect-btn');
                deselectBtn.addEventListener('click', () => {
                    //favoredEnemyOption.remove();
                    updateCharacterDataFavoredEnemy(feature,"applicable level here", 'remove');
                    populateFavoredEnemy(); // Repopulate to reflect the updated selections
                });
            }
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
        optionItem.dataset.humanoidName = option['@name'];
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
                if (!selectedHumanoids.includes(item.dataset.humanoidName) && item.tagName === 'LI') {
                    item.style.display = 'none';
                }
            });
        }
    };

    const deselectHumanoid = (name, listItem) => {
        selectedHumanoids = selectedHumanoids.filter(humanoid => humanoid !== name);
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
}

function updateCharacterDataFavoredEnemy(featureName, level, action) {
    const updateCharacterDataFavoredEnemy = (featureName, level, action) => {
        const characterData = JSON.parse(localStorage.getItem('characterData')) || {};
    
        if (!Array.isArray(characterData.favoredEnemy)) {
            characterData.favoredEnemy = [];
        }
    
        level = level.toString(); // Ensure level is treated as a string
    
        const enemyIndex = characterData.favoredEnemy.findIndex(enemy => enemy.name === featureName && enemy.level === level);
    
        if (action === 'add' && enemyIndex === -1) {
            characterData.favoredEnemy.push({ name: featureName, level: level });
        } else if (action === 'remove' && enemyIndex !== -1) {
            characterData.favoredEnemy.splice(enemyIndex, 1);
        }
    
        localStorage.setItem('characterData', JSON.stringify(characterData));
    };
}

function updateCharacterDataFavoredTerrain(featureTerrain, action) {
    const updateCharacterDataFavoredTerrain = (featureTerrain, action) => {
        // This function updates the selected Favored Terrain in character data within the localStorage
        const characterData = JSON.parse(localStorage.getItem('characterData')) || {};

        if (!Array.isArray(characterData.favoredTerrain)) {
            characterData.favoredTerrain = [];
        }

        if (action === 'add' && !characterData.favoredTerrain.includes(featureTerrain)) {
            characterData.favoredTerrain.push(featureTerrain);
        } else if (action === 'remove') {
            characterData.favoredTerrain = characterData.favoredTerrain.filter(item => item !== featureTerrain);
        }
        localStorage.setItem('characterData', JSON.stringify(characterData));
    };
}

function populateLevelSpecificFavoredEnemies(classObj, userLevel) {
    // Adjusted the populateLevelSpecificFavoredEnemies function for immediate UI update
    const populateLevelSpecificFavoredEnemies = (levelSpecificList, level, favoredEnemies) => {
        levelSpecificList.innerHTML = ''; // Clear the list to ensure we're starting fresh
        level = level.toString(); // Ensure level is treated as a string
    
        const characterData = JSON.parse(localStorage.getItem('characterData')) || {};
        const selectedEnemies = characterData.favoredEnemy || [];
    
        favoredEnemies.forEach(feature => {
            const isSelected = selectedEnemies.some(enemy => enemy.name === feature['@name'] && enemy.level === level);
            const optionItem = document.createElement('li');
            optionItem.textContent = feature['@name'];
    
            optionItem.addEventListener('dblclick', () => {
                updateCharacterDataFavoredEnemy(feature['@name'], level, isSelected ? 'remove' : 'add');
                // Clear non-selected options and show only the selected one with a deselect button
                Array.from(levelSpecificList.children).forEach(item => {
                    if (item !== optionItem) {
                        item.style.display = 'none'; // Alternatively, use item.remove() to completely remove the elements
                    }
                });
    
                if (!isSelected) { // Check if the option was not already selected
                    optionItem.innerHTML = `${feature['@name']} <button class="deselect-btn">Deselect</button>`;
                    const deselectBtn = optionItem.querySelector('.deselect-btn');
                    deselectBtn.addEventListener('click', () => {
                        updateCharacterDataFavoredEnemy(feature['@name'], level, 'remove');
                        populateLevelSpecificFavoredEnemies(levelSpecificList, level, favoredEnemies); // Repopulate to reflect the updated selections
                    });
                }
            });
    
            if (isSelected) {
                optionItem.innerHTML = `${feature['@name']} <button class="deselect-btn">Deselect</button>`;
                const deselectBtn = optionItem.querySelector('.deselect-btn');
                deselectBtn.addEventListener('click', () => {
                    updateCharacterDataFavoredEnemy(feature['@name'], level, 'remove');
                    populateLevelSpecificFavoredEnemies(levelSpecificList, level, favoredEnemies); // Immediate repopulation to ensure the UI reflects the current state
                });
            }
    
            levelSpecificList.appendChild(optionItem); // Add the option item to the list
        });
    };
}

function populateLevelSpecificFavoredTerrains(classObj, userLevel) {
    const favoredTerrainContainer = document.createElement('div');
    favoredTerrainContainer.innerHTML = '<h3>Favored Terrain</h3>';
    optionsContainer.appendChild(favoredTerrainContainer);

    const favoredTerrainList = document.createElement('ul');
    favoredTerrainContainer.appendChild(favoredTerrainList);

    const populateLevelSpecificFavoredTerrains = (levelSpecificList) => {
        // Assuming 'favoredTerrains' is an array of favored terrain options
        const favoredTerrains = classObj.element.filter(feature =>
            feature['@type'] === "Class Feature" &&
            feature['supports']?.includes("Favored Terrain") &&
            feature['@id']?.includes("NATURAL_EXPLORER_")
        );

        // Populate 'levelSpecificList' with options
        favoredTerrains.forEach(feature => {
            const optionItem = document.createElement('li');
            optionItem.textContent = feature['@name'];
            optionItem.addEventListener('dblclick', () => {
                // Handle selection similar to your existing logic
                updateCharacterDataFavoredTerrain(feature, 'add');
                levelSpecificList.innerHTML = '';
                optionItem.innerHTML = `${feature['@name']} <button class="deselect-btn">Deselect</button>`;
                levelSpecificList.appendChild(optionItem);
                const deselectBtn = optionItem.querySelector('.deselect-btn');
                deselectBtn.addEventListener('click', () => {
                    updateCharacterDataFavoredTerrain(feature, 'remove'); // Reset this part to allow re-selection
                    levelCheckFavor(); // You might need to call this or another function to refresh the lists
                });
            })
            levelSpecificList.appendChild(optionItem);
        });
    }
}

function levelCheckFavor(classObj, userLevel) {
    const levelCheckFavor = () => {
        const characterData = JSON.parse(localStorage.getItem('characterData')) || {};
        const userLevel = characterData.level || 0;
    
        // Find the favored enemy feature
        const favoredEnemyFeature = classObj.element.find(feature => feature['@id'] === "ID_WOTC_CLASSFEATURE_RANGER_FAVORED_ENEMY");
        const naturalExplorerFeature = classObj.element.find(feature => feature['@id'] === "ID_WOTC_CLASSFEATURE_RANGER_NATURAL_EXPLORER");
    
        const dynamicallyPopulateFavoredEnemies = () => {
            // ... your existing code to find favoredEnemyFeature
        
            if (!favoredEnemyFeature) {
                console.error("Favored Enemy feature not found.");
                return;
            }
        
            // Define 'favoredEnemies' array here, if not already defined
            const favoredEnemies = classObj.element.filter(feature =>
                feature['@type'] === "Class Feature" &&
                feature['supports']?.includes("Favored Enemy") &&
                !feature['supports']?.includes("Humanoid Favored Enemy") &&
                !feature['@id']?.includes("HUMANOIDS_2") &&
                !feature['@id']?.includes("HUMANOIDS_3")
            );
        
            favoredEnemyFeature.rules.forEach(rule => {
                const ruleLevel = parseInt(rule['@level'], 10); // Ensure 'level' is defined here
        
                // Check if the rule applies at the current user level and has the name "Favored Enemy"
                if (rule['@name'] === "Favored Enemy" && userLevel >= ruleLevel) {
                    const levelContainer = document.createElement('div');
                    levelContainer.className = 'favored-enemy-level-container';
                    levelContainer.innerHTML = `<h4>Favored Enemies - Level ${ruleLevel}:</h4>`;
                    const levelSpecificList = document.createElement('ul');
                    levelContainer.appendChild(levelSpecificList);
                    favoredEnemyList.appendChild(levelContainer);
        
                    // Correctly pass 'ruleLevel' as the 'level' parameter
                    populateLevelSpecificFavoredEnemies(levelSpecificList, ruleLevel, favoredEnemies);
                }
            });
        };
        
        // Assuming a similar setup for favored terrains...
        const dynamicallyPopulateFavoredTerrains = () => {
            if (!naturalExplorerFeature) {
                console.error("Favored Terrain feature not found.");
                return; // Early return if the feature is not found
            }
        
            favoredTerrainList.innerHTML = ''; // Clear the previous content
        
            naturalExplorerFeature.rules.forEach(rule => {
                const ruleLevel = parseInt(rule['@level'], 10);
                if (userLevel >= ruleLevel && rule['@name'] === "Favored Terrain") { // Ensure rule name matches expected
                    const levelContainer = document.createElement('div');
                    levelContainer.className = 'favored-terrain-level-container';
                    levelContainer.innerHTML = `<h4>Favored Terrain - Level ${ruleLevel}:</h4>`;
                    const levelSpecificList = document.createElement('ul');
                    levelContainer.appendChild(levelSpecificList);
                    favoredTerrainList.appendChild(levelContainer);
        
                    populateLevelSpecificFavoredTerrains(levelSpecificList); // Populate the list
                }
            });
        };
        
    
        if (favoredEnemyFeature) dynamicallyPopulateFavoredEnemies();
        // Similarly for favored terrains, if needed
        if (naturalExplorerFeature) dynamicallyPopulateFavoredTerrains();
    };
    
    levelCheckFavor(); // Call levelCheckFavor to perform the checks and populate options

}

function displayClassOptions(classObj, userLevel) {
    const optionsContainer = document.getElementById('optionsContainer');
    if (!optionsContainer) return;
    optionsContainer.innerHTML = '';

    if (classObj.element.some(feature => feature['@type'] === "Class Feature" && feature['@name'] === "Ability Score Improvement")) {
        populateASIOptions(classObj, userLevel); // Pass classObj
    }

    if (classObj.element.some(feature => feature['@type'] === "Archetype")) {
        populateArchetypes(classObj, userLevel); // Pass classObj
    }

    if (classObj.element.some(feature => feature['@type'] === "Class Feature" && feature['@name'] === "Fighting Style")) {
        populateFightingStyles(classObj, userLevel); // Pass classObj
    }

    if (classObj.element.some(feature => feature['@type'] === "Class Feature" && feature['@name'] === "Favored Enemy")) {
        populateFavoredEnemy(classObj, userLevel); // Pass classObj
    }

    if (classObj.element.some(feature => feature['@type'] === "Class Feature" && feature['@name'] === "Favored Terrain")) {
        populateFavoredTerrain(classObj, userLevel); // Pass classObj
    }

    levelCheckFavor(classObj, userLevel); // Pass classObj
}



