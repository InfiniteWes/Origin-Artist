export function createSidebar(onCharacterCreationComplete) {
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    sidebar.textContent = 'This is some information in the sidebar.';
    sidebar.style.position = 'fixed';
    sidebar.style.top = '60px'; // Position below the navigation bar
    sidebar.style.right = '0'; // Open the sidebar by default
    sidebar.style.width = '250px';
    sidebar.style.height = 'calc(100% - 60px)'; // Adjust height to fit below navigation bar
    sidebar.style.padding = '20px';
    sidebar.style.boxShadow = '-1px 0 4px rgba(0, 0, 0, 0.1)';
    sidebar.style.transition = 'right 0.5s'; // Add transition for animation

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close Sidebar';
    closeButton.addEventListener('click', () => {
        sidebar.style.right = '-300px'; // Slide back off-screen
    });
    sidebar.appendChild(closeButton);

    document.body.appendChild(sidebar);

    // Trigger reflow to start the animation
    setTimeout(() => {
        sidebar.style.right = '0';
    }, 0);

    // Call startCharacterCreation to open the character creation section by default
    startCharacterCreation(sidebar);
}

function startCharacterCreation(sidebar) {
    // Clear existing content in the sidebar
    sidebar.innerHTML = '';

    localStorage.setItem('characterCreationInProgress', 'true');

    // Create a form for user input
    const form = document.createElement('form');
    


    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Character Name: ';
    const nameInput = document.createElement('input');
    nameLabel.appendChild(nameInput);
    form.appendChild(nameLabel);

    const levelLabel = document.createElement('label');
    levelLabel.textContent = 'Character Level: ';

    //Adjust Character level by arrow keys
    const levelInput = document.createElement('input');
    levelInput.type = 'number';
    levelInput.value = 1;
    levelInput.min = 1;
    levelInput.max = 20;
    levelLabel.appendChild(levelInput);

    form.appendChild(levelLabel);

    // Feats Checkbox
    const FeatLabel = document.createElement('label');
    FeatLabel.textContent = 'Feat: ';
    const FeatInput = document.createElement('input');
    FeatInput.type = 'checkbox';
    FeatInput.checked = true;
    FeatLabel.appendChild(FeatInput);

    form.appendChild(FeatLabel);

    // MultiClass Checkbox
    const MultiClassLabel = document.createElement('label');
    MultiClassLabel.textContent = 'Multi-Class: ';
    const MultiClassInput = document.createElement('input');
    MultiClassInput.type = 'checkbox';
    MultiClassInput.checked = true;
    MultiClassLabel.appendChild(MultiClassInput);

    form.appendChild(MultiClassLabel);

    const multiClassLabel = document.createElement('label');
    multiClassLabel.textContent = 'Multi-Class: ';
    const multiClassInput = document.createElement('input');
    multiClassInput.type = 'checkbox';
    multiClassInput.checked = true;
    multiClassLabel.appendChild(multiClassInput);
    form.appendChild(multiClassLabel);

    // Image Slideshow for Character Selection
    const imageContainer = document.createElement('div');
    const characterImage = document.createElement('img');
    characterImage.src = './assets/profileart1.jpg'; // Set the initial image source
    imageContainer.appendChild(characterImage);

    const prevButton = document.createElement('button');
    prevButton.textContent = '< Previous';
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next >';

    let currentImageIndex = 0; // Initialize image index
    const images = ['./assets/profileart2.jpg', './assets/profileart3.jpg', './assets/profileart4.jpg', './assets/profileart5.jpg', './assets/profileart6.png', './assets/profileart7.jpg']; // Image paths array

    prevButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentImageIndex > 0) {
            currentImageIndex--;
            characterImage.src = images[currentImageIndex];
        }
    });

    nextButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentImageIndex < images.length - 1) {
            currentImageIndex++;
            characterImage.src = images[currentImageIndex];
        }
    });

    form.appendChild(imageContainer);
    form.appendChild(prevButton);
    form.appendChild(nextButton);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close Sidebar';
    closeButton.addEventListener('click', () => {
        sidebar.style.right = '-300px'; // Slide back off-screen
    });
    form.appendChild(closeButton);

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Next';
    submitButton.addEventListener('click', (event) => {
        event.preventDefault();
        const characterData = {
            name: nameInput.value,
            level: levelInput.value,
            Feat: FeatInput.checked,
            MultiClass: MultiClassInput.checked
        };

        if (typeof onCharacterCreationComplete === 'function') {
            onCharacterCreationComplete();
        }

        // Save character data locally within the database folder
        // Example: Save character data to a JSON file
        localStorage.setItem('characterData', JSON.stringify(characterData));
        console.log("Got character data:", characterData);
        
        //window.location.href = './Race/Race.html';
        // Send an IPC message to the main process to navigate to the Race PAge
        electronAPI.send('sidebar-to-race-page');
        console.log("Sent to race page")
    });
    form.appendChild(submitButton);

    sidebar.appendChild(form);
}