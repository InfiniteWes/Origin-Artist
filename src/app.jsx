import * as React from 'react';
import { createRoot } from 'react-dom/client';

function Addbutton() {
    return (
        <button>+</button>
    );
}

const CharacterButton = document.getElementById('AddCharacterButton');
const root = createRoot(CharacterButton);
root.render(
    <Addbutton />
)