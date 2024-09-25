// static/js/uiManager.js

// Function to toggle between light and dark mode
export const toggleTheme = () => {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');
    const viewModeButton = document.getElementById('view-mode-button');
    
    // Update button text based on the theme
    viewModeButton.innerText = isDarkMode ? 'Light Mode' : 'Dark Mode';
};

// Function to initialize button event listeners
export const initUI = () => {
    // Attach event listener to the view mode button
    const viewModeButton = document.getElementById('view-mode-button');
    viewModeButton.addEventListener('click', toggleTheme);

    // Additional UI interactions can be initialized here
};
