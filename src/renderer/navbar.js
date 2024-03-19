// navigation.js

// List of button names corresponding to your other JavaScript files
const buttonNames = ["Home","Origin","Creator","Character Sheet"];
const subButtonNames = ["Race","Class","Background","Ability","Magic","Equipment"];

// Function to create the navigation bar
// Function to create the navigation bar
function createNavigationBar() {
  const navBar = document.createElement("nav");
  navBar.classList.add("horizontal-navigation");

  // Get the current page filename
  const currentPage = window.location.pathname.split('/').pop();

  buttonNames.forEach((buttonName) => {
    const button = document.createElement("button");
    button.textContent = buttonName;
    if (buttonName === "home") {
      button.addEventListener("click", () => {
        window.location.href = "../../index.html";
      });
    } else {
      button.style.opacity = 0.5;
      button.style.cursor = "default";
      button.disabled = true;
    }

    //button.addEventListener("click", () => {
      /*
      if (buttonName !== currentPage.replace('.html', '')) {
        if (currentPage === "Race.html" && buttonName === "Home") {
          window.location.href = "../../index.html"; // Navigate to index.html from Race.html
        } else if (currentPage === "Ability.html" && buttonName === "Home") {
          window.location.href = "../../index.html";
        } else if (currentPage === "Equipment.html" && buttonName === "Home") {
          window.location.href = "../../index.html";
        } else if (currentPage === "Magic.html" && buttonName === "Home") {
          window.location.href = "../../index.html";
        } else if (currentPage === "Manage.html" && buttonName === "Home") {
          window.location.href = "../../index.html";
        } else if (currentPage === "Class.html" && buttonName === "Home") {
          window.location.href = "../../index.html"; // Navigate to index.html from Class.html
        } else if (currentPage === "index.html" && buttonName === "Home") {
          window.location.href = "index.html";
        } else {
          let newPath;
          if (currentPage === "Race.html" || currentPage === "Class.html" || currentPage === "Ability.html" || currentPage === "Equipment.html" || currentPage === "Magic.html" || currentPage === "Manage.html") {
            if (buttonName === "Magic" || buttonName === "Manage" || buttonName === "Equipment" || buttonName === "Ability" || buttonName === "Class" || buttonName === "Race") {
              newPath = `../${buttonName}/${buttonName}.html`; // Navigate to the corresponding HTML page within the same directory
            } else {
              newPath = `../components/${buttonName}/${buttonName}.html`; // Navigate to the corresponding HTML page within the components directory
            }
          } else {
            newPath = `./components/${buttonName}/${buttonName}.html`; // Navigate to the corresponding HTML page within the components directory
          }
          window.location.href = newPath;
        }
      } */
    //});
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