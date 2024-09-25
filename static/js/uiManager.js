// Function to toggle light/dark mode
const toggleMode = () => {
    document.body.classList.toggle('dark-mode');
    const viewModeButton = document.getElementById('view-mode-button');
    viewModeButton.innerText = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
};

// Function to initialize UI-related event listeners
export const initUI = () => {
    const viewModeButton = document.getElementById('view-mode-button');

    // Event listener for light/dark mode toggle
    viewModeButton.addEventListener('click', toggleMode);
};
