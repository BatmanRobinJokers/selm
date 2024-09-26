export function initUI() {
    const viewModeButton = document.getElementById('view-mode-button');
    const switchChatButton = document.getElementById('switch-chat-button');

    // Toggle dark/light mode
    viewModeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        viewModeButton.innerText = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
    });

    // Switch between chat modes
    switchChatButton.addEventListener('click', () => {
        // Logic for switching chat modes
        // For now, just log the action to the console
        console.log('Switched chat modes');
    });
}
