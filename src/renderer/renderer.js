document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
    const isDarkMode = await window.electronAPI.toggle();
    //document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light';
});
