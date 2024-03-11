// navigation.js

// List of button names corresponding to your other JavaScript files
const buttonNames = ["Home","Race","Class","Abilities","Equipment", "Magic", "Manage"];

// Function to create the navigation bar
function createNavigationBar() {
  const navBar = document.createElement("nav");
  navBar.classList.add("horizontal-navigation");

  buttonNames.forEach((buttonName) => {
    const button = document.createElement("button");
    button.textContent = buttonName;
    button.addEventListener("click", () => {
      loadScript(`components/${buttonName}/${buttonName}.js`);
    });
    navBar.appendChild(button);
  });

  document.body.prepend(navBar);
}

// Function to load the script when a button is clicked
function loadScript(scriptPath) {
  const script = document.createElement("script");
  script.src = scriptPath;
  document.body.appendChild(script);
}

// Call the function to create the navigation bar when the window loads
window.onload = createNavigationBar;