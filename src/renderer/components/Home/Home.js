// Home.js
import { createSidebar } from "./sidebar.js";

// Creating Add Character Button
const addCharacterButton = document.createElement('button');
addCharacterButton.textContent = '+';

// Function to make the Sidebar only appear once
let sidebarcreation = false;
function Sidebarlimit() {
    if (!sidebarcreation) {
        createSidebar();
        sidebarcreation = true;
    } else {
        console.log('You can only have one character at a time!');
    }
}

addCharacterButton.addEventListener('click', Sidebarlimit);
document.body.appendChild(addCharacterButton);