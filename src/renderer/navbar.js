// navigation.js

// List of button names corresponding to your other JavaScript files
const buttonNames = ["Home", "Origin", "Creator", "Character Sheet"];
const subButtonNames = ["Race", "Class", "Background", "Ability", "Magic", "Equipment"];

// Function to create the navigation bar
function createNavigationBar() {
    const navBar = document.createElement("nav");
    navBar.classList.add("horizontal-navigation");

    buttonNames.forEach((buttonName) => {
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("nav-button-container");

        // Main navigation button
        const button = document.createElement("button");
        button.textContent = buttonName;
        button.classList.add("main-nav-button");

        if (buttonName.toLowerCase() === "home") {
            button.addEventListener("click", () => {
                window.location.href = "../../index.html";
            });
        } else {
            button.style.cursor = "pointer";
        }

        buttonContainer.appendChild(button);

        // Check if this button should have sub-navigation
        if (buttonName === "Origin") {
            const subNav = createSubNavigation(subButtonNames);
            buttonContainer.appendChild(subNav);
        }

        navBar.appendChild(buttonContainer);
    });

    document.body.prepend(navBar);
}

// Function to create sub-navigation
function createSubNavigation(subButtonNames) {
    const subNavContainer = document.createElement("div");
    subNavContainer.classList.add("sub-navigation");
    subNavContainer.style.display = "none"; // Initially hide the sub-navigation

    subButtonNames.forEach((subButtonName) => {
        const subButton = document.createElement("button");
        subButton.textContent = subButtonName;
        subButton.classList.add("sub-nav-button");
        subNavContainer.appendChild(subButton);
    });

    return subNavContainer;
}

// Add event listeners for showing/hiding sub-navigation
function setupNavigationInteractivity() {
    const navButtonContainers = document.querySelectorAll('.nav-button-container');

    navButtonContainers.forEach(container => {
        const mainButton = container.querySelector('.main-nav-button');
        const subNav = container.querySelector('.sub-navigation');

        if (subNav) {
            // Show sub-navigation on hover or click
            mainButton.addEventListener('mouseenter', () => {
                subNav.style.display = 'flex';
            });

            // Hide sub-navigation when not hovered
            container.addEventListener('mouseleave', () => {
                subNav.style.display = 'none';
            });
        }
    });
}

// Call the functions to create the navigation bar and set up interactivity when the window loads
window.onload = () => {
    createNavigationBar();
    setupNavigationInteractivity();
};
